import { test } from 'node:test'
import assert from 'node:assert/strict'
import { connectedEndpoints, moveWall, nearestEndpoint, turnWall, tipWall } from '../src/model/wall.ts'
import { createWall, createWallDraft, getWalls, updateWall, connectWalls, deleteWall } from '../src/api/walls.ts'

const fixture = { id: 'a', name: 'A', start: { x: 0, z: 0 }, end: { x: 4, z: 0 }, length: 4, height: 2.5, thickness: 0.15, tiltDegrees: 0, startAnchorId: 's', endAnchorId: 'e' }

test('moving and turning a wall preserve its dimensions and do not mutate other walls', () => {
  const moved = moveWall(fixture, 1, 2)
  assert.deepEqual(moved.start, { x: 1, z: 2 })
  assert.deepEqual(moved.end, { x: 5, z: 2 })
  const turned = turnWall(fixture, 90)
  assert.ok(Math.abs(turned.end.x) < 1e-10)
  assert.equal(turned.end.z, 4)
  assert.equal(turned.length, 4)
  assert.deepEqual(fixture.start, { x: 0, z: 0 })
  assert.equal(tipWall(fixture, 200).tiltDegrees, 90)
})

test('endpoint snapping chooses the nearest endpoint within range', () => {
  assert.equal(nearestEndpoint({ x: 3.94, z: 0 }, [{ x: 3.8, z: 0 }, fixture.end]), fixture.end)
  assert.equal(nearestEndpoint({ x: 3.7, z: 0 }, [fixture.end]), null)
})

test('connection readout shows every shared anchor and ignores coincident unconnected walls', () => {
  const b = { ...fixture, id: 'b', start: fixture.end, startAnchorId: 'e', endAnchorId: 'other' }
  const c = { ...b, id: 'c', startAnchorId: 'another', endAnchorId: 'e' }
  const coincident = { ...b, id: 'd', startAnchorId: 'unconnected' }
  assert.deepEqual(connectedEndpoints(fixture, 'start', [fixture, b, c, coincident]), [])
  assert.deepEqual(connectedEndpoints(fixture, 'end', [fixture, b, c, coincident]), [
    { wall: b, endpoint: 'start' }, { wall: c, endpoint: 'end' },
  ])
})

test('wall API uses DTOs and the expected routes and methods', async () => {
  const original = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, init) => {
    calls.push({ url, method: init?.method ?? 'GET', body: init?.body && JSON.parse(init.body) })
    if (init?.method === 'DELETE') return new Response(null, { status: 204 })
    return { ok: true, json: async () => url.endsWith('/connections') || url.endsWith('/draft') || init?.method === undefined ? [fixture] : fixture }
  }
  try {
    assert.deepEqual(await getWalls(), [fixture])
    assert.equal((await createWall(fixture)).id, 'a')
    await updateWall('a', fixture)
    await connectWalls('a', { endpoint: 'end', targetWallId: 'b', targetEndpoint: 'start' })
    await deleteWall('a')
    assert.deepEqual(await createWallDraft([fixture]), [fixture])
    assert.deepEqual(calls.map(({ url, method }) => [url, method]), [
      ['/api/walls', 'GET'], ['/api/walls', 'POST'], ['/api/walls/a', 'PUT'], ['/api/walls/a/connections', 'POST'], ['/api/walls/a', 'DELETE'], ['/api/walls/draft', 'POST']
    ])
    assert.equal(calls[2].body.end.x, 4)
    assert.deepEqual(calls[5].body, [fixture])
  } finally { globalThis.fetch = original }
})

test('API errors reject instead of treating invalid results as success', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () => ({ ok: false, status: 400, text: async () => 'Invalid wall' })
  try { await assert.rejects(getWalls(), /Invalid wall/) }
  finally { globalThis.fetch = original }
})

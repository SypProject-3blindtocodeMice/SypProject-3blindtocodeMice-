import { test } from 'node:test'
import assert from 'node:assert/strict'
import { adjustDraftDimensions, emptyDraft, placePoint, previewSegments } from '../src/model/wall-draft.ts'
import { defaultWallDimensions, parseWallDimensions } from '../src/model/wall.ts'

const point = (x, z) => ({ x, z })

test('pointer movement adjusts height and thickness independently without allowing zero', () => {
  const start = { height: 2.5, thickness: 0.15 }
  assert.deepEqual(adjustDraftDimensions(start, 25, -40), { height: 2.9, thickness: 0.2 })
  assert.deepEqual(adjustDraftDimensions(start, -25, 40), { height: 2.1, thickness: 0.1 })
  assert.deepEqual(adjustDraftDimensions(start, 0, -10), { height: 2.6, thickness: 0.15 })
  assert.deepEqual(adjustDraftDimensions(start, -1000, 1000), { height: 0.01, thickness: 0.01 })
  assert.deepEqual(adjustDraftDimensions({ height: 2.56789, thickness: 0.1234567 }, 0, 0), { height: 2.56789, thickness: 0.1234567 })
})

test('clicks chain segments and moving the cursor does not pin them', () => {
  const a = point(0, 0)
  const b = point(4, 0)
  const c = point(4, 3)
  const first = placePoint(emptyDraft, a, false)
  assert.equal(placePoint(first, a, false), first)
  assert.deepEqual(previewSegments(first, b, false), [{ start: a, end: b }])
  assert.deepEqual(first.segments, [])
  const second = placePoint(first, b, false)
  const third = placePoint(second, c, false)
  assert.deepEqual(third.segments, [{ start: a, end: b, ...defaultWallDimensions }, { start: b, end: c, ...defaultWallDimensions }])
  assert.deepEqual(emptyDraft.segments, [])
})

test('parallel pair uses the latest segment, not a designated width wall', () => {
  const initial = placePoint(placePoint(placePoint(emptyDraft, point(0, 0), false), point(4, 0), false), point(4, 3), false)
  const preview = previewSegments(initial, point(7, 8), true)
  assert.deepEqual(preview, [{ start: point(4, 0), end: point(7, 0) }, { start: point(4, 3), end: point(7, 3) }])
  const pinned = placePoint(initial, point(7, 8), true)
  assert.deepEqual(pinned.segments, [...initial.segments, ...preview.map((segment) => ({ ...segment, ...defaultWallDimensions }))])
  assert.deepEqual(pinned.tip, point(7, 3))
  assert.deepEqual(previewSegments(initial, point(4, 8), true), [])
})

test('pinned walls keep their dimensions and a parallel pair shares the current settings', () => {
  const a = point(0, 0)
  const b = point(4, 0)
  const c = point(4, 3)
  const initial = placePoint(placePoint(emptyDraft, a, false), b, false)
  const tall = { height: 3, thickness: 0.2 }
  const next = placePoint(initial, c, false, [], tall)
  const thin = { height: 2.8, thickness: 0.1 }
  const paired = placePoint(next, point(7, 3), true, [], thin)
  assert.deepEqual(paired.segments, [
    { start: a, end: b, ...defaultWallDimensions },
    { start: b, end: c, ...tall },
    { start: b, end: point(7, 0), ...thin },
    { start: c, end: point(7, 3), ...thin },
  ])
})

test('wall dimension fields only accept positive finite values', () => {
  assert.deepEqual(parseWallDimensions({ height: '3', thickness: '0.15' }), { height: 3, thickness: 0.15 })
  for (const value of ['', '0', '-1', 'Infinity', 'NaN']) {
    assert.equal(parseWallDimensions({ height: value, thickness: '0.15' }), null)
    assert.equal(parseWallDimensions({ height: '3', thickness: value }), null)
  }
})

test('parallel pair projects a diagonal wall to equal perpendicular offsets on either side', () => {
  const draft = placePoint(placePoint(emptyDraft, point(0, 0), false), point(4, 4), false)
  for (const sign of [-1, 1]) {
    const sides = previewSegments(draft, point(4 + sign * 2, 4 - sign * 2), true)
    for (const { start, end } of sides) {
      assert.ok(Math.abs(end.x - start.x - sign * 2) < 1e-10)
      assert.ok(Math.abs(end.z - start.z + sign * 2) < 1e-10)
    }
  }
})

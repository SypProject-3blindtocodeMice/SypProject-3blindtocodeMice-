import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dimensionArrows, emptyDraft, placePoint, previewSegments, stepDraftDimension } from '../src/model/wall-draft.ts'
import { defaultWallDimensions, parseWallDimensions } from '../src/model/wall.ts'

const point = (x, z) => ({ x, z })

test('arrow steps start at one centimetre and grow as the key stays held', () => {
  assert.equal(dimensionArrows.ArrowUp[0], 'height')
  assert.equal(dimensionArrows.ArrowRight[0], 'thickness')
  assert.equal(stepDraftDimension(2.5, 'ArrowUp', 0), 2.51)
  assert.equal(stepDraftDimension(2.5, 'ArrowDown', 0), 2.49)
  assert.equal(stepDraftDimension(2.5, 'ArrowUp', 750), 2.52)
  assert.equal(stepDraftDimension(2.5, 'ArrowUp', 1500), 2.55)
  assert.equal(stepDraftDimension(2.5, 'ArrowUp', 2500), 2.6)
  assert.equal(stepDraftDimension(0.15, 'ArrowLeft', 0), 0.14)
  assert.equal(stepDraftDimension(0.15, 'ArrowRight', 2500), 0.25)
  assert.equal(stepDraftDimension(0.03, 'ArrowLeft', 2500), 0.01)
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

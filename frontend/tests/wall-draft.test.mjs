import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyDraft, placePoint, previewSegments } from '../src/model/wall-draft.ts'

const point = (x, z) => ({ x, z })

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
  assert.deepEqual(third.segments, [{ start: a, end: b }, { start: b, end: c }])
  assert.deepEqual(emptyDraft.segments, [])
})

test('parallel pair uses the latest segment, not a designated width wall', () => {
  const initial = placePoint(placePoint(placePoint(emptyDraft, point(0, 0), false), point(4, 0), false), point(4, 3), false)
  const preview = previewSegments(initial, point(7, 8), true)
  assert.deepEqual(preview, [{ start: point(4, 0), end: point(7, 0) }, { start: point(4, 3), end: point(7, 3) }])
  const pinned = placePoint(initial, point(7, 8), true)
  assert.deepEqual(pinned.segments, [...initial.segments, ...preview])
  assert.deepEqual(pinned.tip, point(7, 3))
  assert.deepEqual(previewSegments(initial, point(4, 8), true), [])
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

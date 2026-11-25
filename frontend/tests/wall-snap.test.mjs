import assert from 'node:assert/strict'
import test from 'node:test'
import { Ray, Vector3 } from 'three'
import { createWallSnapPicker } from '../src/viewer3d/wall-snap.ts'

const wall = {
  start: { x: 0, z: 0 }, end: { x: 4, z: 0 },
  length: 4, height: 2.5, thickness: 0.2, tiltDegrees: 0,
}
const aimAt = (from, to) => {
  const origin = new Vector3(...from)
  return new Ray(origin, new Vector3(...to).sub(origin).normalize())
}

test('aiming high or low at either wall end snaps to its floor anchor', () => {
  const pick = createWallSnapPicker([wall])
  for (const [x, anchor] of [[0.05, wall.start], [3.95, wall.end]]) {
    for (const height of [0.25, 2.45]) {
      const snap = pick(aimAt([x, 3, 5], [x, height, 0.1]), 100)
      assert.deepEqual(snap.point, anchor)
      assert.ok(Math.abs(snap.marker[1] - height) < 1e-9)
    }
  }
  // A top-face hit works too, even when the ray reaches the floor far away.
  assert.deepEqual(pick(aimAt([0.05, 5, 5], [0.05, 2.5, 0]), 100).point, wall.start)
})

test('does not pick wall midpoints, hidden endpoints, or walls beyond camera range', () => {
  const rear = { ...wall, start: { x: 2, z: -2 }, end: { x: 6, z: -2 } }
  const ray = aimAt([2.05, 2, 5], [2.05, 2, 0])
  assert.deepEqual(createWallSnapPicker([rear])(ray, 100).point, rear.start)
  assert.equal(createWallSnapPicker([rear, wall])(ray, 100), null)
  assert.equal(createWallSnapPicker([wall])(aimAt([0, 2, 5], [0, 2, 0]), 1), null)
})

test('snap follows a rotated, tilted wall visually without changing the floor anchor', () => {
  const tilted = {
    ...wall, start: { x: 3, z: 1 }, end: { x: 3, z: 5 }, tiltDegrees: 45,
  }
  const height = 2 * Math.SQRT1_2
  const snap = createWallSnapPicker([tilted])(aimAt([-2, height, 1.05], [3 - height, height, 1.05]), 100)
  assert.deepEqual(snap.point, tilted.start)
  assert.ok(snap.marker[0] < tilted.start.x - 1)
  assert.ok(snap.marker[1] > 1)
})

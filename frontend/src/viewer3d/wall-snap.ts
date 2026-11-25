import { Box3, Matrix4, Ray, Vector3 } from 'three'
import { endpointSnapDistance } from '../model/wall.ts'
import { wallPose, type WallShape } from './wall-pose.ts'

export function createWallSnapPicker<T extends WallShape>(walls: readonly T[]) {
  const targets = walls.map((wall) => {
    const { centerX, centerZ, baseHeight, yaw, tilt } = wallPose(wall)
    const world = new Matrix4().makeRotationY(yaw).multiply(new Matrix4().makeRotationX(tilt))
      .setPosition(centerX, baseHeight, centerZ)
    const halfLength = wall.length / 2
    const halfThickness = wall.thickness / 2
    return {
      wall, halfLength, world, inverse: world.clone().invert(),
      bounds: new Box3(new Vector3(-halfLength, 0, -halfThickness), new Vector3(halfLength, wall.height, halfThickness)),
    }
  })
  const localRay = new Ray()
  const localHit = new Vector3()
  const worldHit = new Vector3()

  return (ray: Ray, far: number) => {
    let distance = far
    let closest: (typeof targets)[number] | undefined
    let hitX = 0
    let hitY = 0
    for (const target of targets) {
      localRay.copy(ray).applyMatrix4(target.inverse)
      if (!localRay.intersectBox(target.bounds, localHit)) continue
      const hitDistance = worldHit.copy(localHit).applyMatrix4(target.world).distanceTo(ray.origin)
      if (hitDistance >= distance) continue
      distance = hitDistance
      closest = target
      hitX = localHit.x
      hitY = localHit.y
    }
    // Use the visible wall only; a wall face can hide another wall's endpoint.
    if (!closest || closest.halfLength - Math.abs(hitX) > endpointSnapDistance) return null
    const start = hitX <= 0
    const point = start ? closest.wall.start : closest.wall.end
    worldHit.set(start ? -closest.halfLength : closest.halfLength, hitY, 0).applyMatrix4(closest.world)
    return { point, marker: worldHit.toArray(), wall: closest.wall }
  }
}

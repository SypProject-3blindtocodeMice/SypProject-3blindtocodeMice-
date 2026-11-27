import type { Wall } from '../model/wall.ts'

export type WallShape = Pick<Wall, 'start' | 'end' | 'length' | 'height' | 'thickness' | 'tiltDegrees'>

export function wallPose(wall: WallShape) {
  const tilt = wall.tiltDegrees * Math.PI / 180
  return {
    centerX: (wall.start.x + wall.end.x) / 2,
    centerZ: (wall.start.z + wall.end.z) / 2,
    baseHeight: Math.abs(Math.sin(tilt)) * wall.thickness / 2,
    // Three.js rotates local +X toward -Z for positive Y angles.
    yaw: -Math.atan2(wall.end.z - wall.start.z, wall.end.x - wall.start.x),
    tilt,
  }
}

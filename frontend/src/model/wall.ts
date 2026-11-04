// Dimensions and position are in meters; XZ is the ground plane and Y is up.
export type Wall = {
  id: string
  name: string
  width: number
  height: number
  thickness: number
  position: { x: number; z: number }
  rotationDegrees: number // around the vertical Y axis
  tiltDegrees: number // around the horizontal axis through the wall's base
}

export function rotateWall(wall: Wall, degrees: number): Wall {
  return { ...wall, rotationDegrees: (wall.rotationDegrees + degrees + 360) % 360 }
}

export function tipWall(wall: Wall, degrees: number): Wall {
  return { ...wall, tiltDegrees: Math.max(-90, Math.min(90, wall.tiltDegrees + degrees)) }
}

export const initialWall: Wall = {
  id: 'wall-1',
  name: 'Wall 1',
  width: 4,
  height: 2.5,
  thickness: 0.15,
  position: { x: 2, z: 1 },
  rotationDegrees: 0,
  tiltDegrees: 0,
}

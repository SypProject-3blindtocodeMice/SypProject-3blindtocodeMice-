export type Point2 = { x: number; z: number }
export type Wall = {
  id: string
  name: string
  start: Point2
  end: Point2
  height: number
  thickness: number
  tiltDegrees: number
  startAnchorId: string
  endAnchorId: string
  length: number
}

export type CreateWallRequest = Pick<Wall, 'name' | 'start' | 'end' | 'height' | 'thickness'> & { tiltDegrees?: number }
export type UpdateWallRequest = Pick<Wall, 'name' | 'start' | 'end' | 'height' | 'thickness' | 'tiltDegrees'>

export type WallEndpoint = 'start' | 'end'
export const wallEndpoints = ['start', 'end'] as const

const anchorId = (wall: Wall, endpoint: WallEndpoint) => endpoint === 'start' ? wall.startAnchorId : wall.endAnchorId

export function connectedEndpoints(wall: Wall, endpoint: WallEndpoint, walls: Wall[]) {
  const id = anchorId(wall, endpoint)
  return walls.filter((other) => other.id !== wall.id).flatMap((other) =>
    wallEndpoints.filter((side) => anchorId(other, side) === id).map((side) => ({ wall: other, endpoint: side })))
}

export function wallFromEndpoints(wall: Wall, start: Point2, end: Point2): Wall {
  return { ...wall, start, end, length: Math.hypot(end.x - start.x, end.z - start.z) }
}

export function moveWall(wall: Wall, dx: number, dz: number): Wall {
  return wallFromEndpoints(wall, { x: wall.start.x + dx, z: wall.start.z + dz }, { x: wall.end.x + dx, z: wall.end.z + dz })
}

export function turnWall(wall: Wall, degrees: number): Wall {
  const angle = degrees * Math.PI / 180
  const dx = wall.end.x - wall.start.x
  const dz = wall.end.z - wall.start.z
  return wallFromEndpoints(wall, wall.start, { x: wall.start.x + dx * Math.cos(angle) - dz * Math.sin(angle), z: wall.start.z + dx * Math.sin(angle) + dz * Math.cos(angle) })
}

export function tipWall(wall: Wall, degrees: number): Wall {
  return { ...wall, tiltDegrees: Math.max(-90, Math.min(90, wall.tiltDegrees + degrees)) }
}

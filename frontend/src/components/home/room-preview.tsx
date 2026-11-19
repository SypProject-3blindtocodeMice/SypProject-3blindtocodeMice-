import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Wall } from '../../model/wall'
import { GroundGrid } from '../../viewer3d/GroundGrid'
import { WallMesh } from '../../viewer3d/WallMesh'

function demoWall(id: string, sx: number, sz: number, ex: number, ez: number, height = 2.5): Wall {
  return {
    id, name: id, start: { x: sx, z: sz }, end: { x: ex, z: ez },
    length: Math.hypot(ex - sx, ez - sz), height, thickness: 0.15, tiltDegrees: 0,
    startAnchorId: `${id}-s`, endAnchorId: `${id}-e`,
  }
}

const demoWalls: Wall[] = [
  demoWall('back', -3, -2, 3, -2),
  demoWall('left', -3, -2, -3, 2),
  demoWall('right', 3, -2, 3, 0.5),
  demoWall('divider', 0, -2, 0, -0.25, 2.5),
  demoWall('low', -3, 2, -1, 2, 1.1),
]

function SpinningRoom() {
  const group = useRef<Group>(null)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15
  })
  return (
    <group ref={group}>
      {demoWalls.map((wall) => (
        <WallMesh key={wall.id} wall={wall} selected={wall.id === 'divider'} onSelect={() => {}} />
      ))}
    </group>
  )
}

export default function RoomPreview() {
  return (
    <Canvas camera={{ position: [8, 7, 9], fov: 45 }} aria-hidden="true">
      <color attach="background" args={['#202830']} />
      <ambientLight intensity={1} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} />
      <GroundGrid onDeselect={() => {}} />
      <SpinningRoom />
    </Canvas>
  )
}

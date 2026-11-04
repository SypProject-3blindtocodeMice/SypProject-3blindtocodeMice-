import type { ThreeEvent } from '@react-three/fiber'
import type { Wall } from '../model/wall'

type WallMeshProps = {
  wall: Wall
  selected: boolean
  onSelect: (id: string) => void
}

export function WallMesh({ wall, selected, onSelect }: WallMeshProps) {
  const tiltRadians = wall.tiltDegrees * Math.PI / 180
  const baseHeight = Math.abs(Math.sin(tiltRadians)) * wall.thickness / 2

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    onSelect(wall.id)
  }

  return (
    <group
      position={[wall.position.x, baseHeight, wall.position.z]}
      rotation={[0, wall.rotationDegrees * Math.PI / 180, 0]}
    >
      <group rotation={[tiltRadians, 0, 0]}>
        <mesh position={[0, wall.height / 2, 0]} onClick={handleClick}>
          <boxGeometry args={[wall.width, wall.height, wall.thickness]} />
          <meshStandardMaterial color={selected ? '#ffd180' : '#8296a9'} />
        </mesh>
      </group>
    </group>
  )
}

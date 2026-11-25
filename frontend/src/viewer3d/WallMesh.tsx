import type { ThreeEvent } from '@react-three/fiber'
import { wallPose, type WallShape } from './wall-pose'

type WallMeshProps = {
  wall: WallShape & { id?: string }
  selected?: boolean
  onSelect?: (id: string) => void
  draft?: 'pinned' | 'preview'
}

export function WallMesh({ wall, selected, onSelect, draft }: WallMeshProps) {
  const { centerX, centerZ, baseHeight, yaw, tilt } = wallPose(wall)

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (wall.id) onSelect?.(wall.id)
  }

  return (
    <group position={[centerX, baseHeight, centerZ]} rotation={[0, yaw, 0]}>
      <group rotation={[tilt, 0, 0]}>
        <mesh position={[0, wall.height / 2, 0]} onClick={onSelect ? handleClick : undefined}>
          <boxGeometry args={[wall.length, wall.height, wall.thickness]} />
          <meshStandardMaterial color={draft ? '#84dcff' : selected ? '#ffd180' : '#8296a9'} transparent={!!draft} opacity={draft === 'preview' ? 0.35 : draft ? 0.65 : 1} depthWrite={!draft} />
        </mesh>
      </group>
    </group>
  )
}

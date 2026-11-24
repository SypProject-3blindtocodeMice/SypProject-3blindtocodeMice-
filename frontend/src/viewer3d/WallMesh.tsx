import type { ThreeEvent } from '@react-three/fiber'
import type { Wall } from '../model/wall'

type WallMeshProps = {
  wall: Pick<Wall, 'start' | 'end' | 'length' | 'height' | 'thickness' | 'tiltDegrees'> & { id?: string }
  selected?: boolean
  onSelect?: (id: string) => void
  draft?: 'pinned' | 'preview'
}

export function WallMesh({ wall, selected, onSelect, draft }: WallMeshProps) {
  const tiltRadians = wall.tiltDegrees * Math.PI / 180
  const baseHeight = Math.abs(Math.sin(tiltRadians)) * wall.thickness / 2

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (wall.id) onSelect?.(wall.id)
  }

  const centerX = (wall.start.x + wall.end.x) / 2
  const centerZ = (wall.start.z + wall.end.z) / 2
  // Three.js rotates local +X toward -Z for positive Y angles.
  const angle = -Math.atan2(wall.end.z - wall.start.z, wall.end.x - wall.start.x)
  return (
    <group position={[centerX, baseHeight, centerZ]} rotation={[0, angle, 0]}>
      <group rotation={[tiltRadians, 0, 0]}>
        <mesh position={[0, wall.height / 2, 0]} onClick={onSelect ? handleClick : undefined}>
          <boxGeometry args={[wall.length, wall.height, wall.thickness]} />
          <meshStandardMaterial color={draft ? '#84dcff' : selected ? '#ffd180' : '#8296a9'} transparent={!!draft} opacity={draft === 'preview' ? 0.35 : draft ? 0.65 : 1} depthWrite={!draft} />
        </mesh>
      </group>
    </group>
  )
}

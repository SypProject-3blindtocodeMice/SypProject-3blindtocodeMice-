import type { Wall } from '../model/wall'
import { CameraControls } from './CameraControls'
import { GroundGrid } from './GroundGrid'
import { WallMesh } from './WallMesh'

type SceneProps = {
  wall: Wall
  selectedWallId: string | null
  onSelectWall: (id: string) => void
  onDeselectWall: () => void
}

export function Scene({ wall, selectedWallId, onSelectWall, onDeselectWall }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#202830']} />
      <ambientLight intensity={1} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} />
      <GroundGrid onDeselect={onDeselectWall} />
      <WallMesh wall={wall} selected={selectedWallId === wall.id} onSelect={onSelectWall} />
      <CameraControls />
    </>
  )
}

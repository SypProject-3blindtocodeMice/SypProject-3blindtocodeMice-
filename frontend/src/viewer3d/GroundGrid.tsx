import { Grid } from '@react-three/drei'
import { grid } from './sceneConfig'

type GroundGridProps = {
  onDeselect: () => void
}

export function GroundGrid({ onDeselect }: GroundGridProps) {
  return (
    <>
      <Grid
        args={[grid.size, grid.size]}
        onClick={onDeselect}
        cellSize={grid.cellSize}
        sectionSize={grid.sectionSize}
        cellColor={grid.cellColor}
        sectionColor={grid.sectionColor}
        fadeDistance={80}
        fadeStrength={1}
      />
      <axesHelper args={[2]} />
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.08, 12, 8]} />
        <meshBasicMaterial color="#ffd166" />
      </mesh>
    </>
  )
}

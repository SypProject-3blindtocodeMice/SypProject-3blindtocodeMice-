import { CameraControls } from './CameraControls'
import { GroundGrid } from './GroundGrid'

export function Scene() {
  return (
    <>
      <color attach="background" args={['#202830']} />
      <ambientLight intensity={1} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} />
      <GroundGrid />
      <CameraControls />
    </>
  )
}

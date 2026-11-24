import { OrbitControls } from '@react-three/drei'
import type { PerspectiveCamera } from 'three'

export function CameraControls({ camera, enabled }: { camera: PerspectiveCamera; enabled: boolean }) {
  return <OrbitControls camera={camera} enabled={enabled} makeDefault enableDamping enablePan enableZoom minDistance={2} maxDistance={100} />
}

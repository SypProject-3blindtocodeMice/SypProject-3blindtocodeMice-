import { OrbitControls } from '@react-three/drei'

export function CameraControls() {
  return <OrbitControls makeDefault enableDamping enablePan enableZoom minDistance={2} maxDistance={100} />
}

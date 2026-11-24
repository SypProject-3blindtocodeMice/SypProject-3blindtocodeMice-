import { OrbitControls } from '@react-three/drei'
import type { ComponentRef, Ref } from 'react'
import type { PerspectiveCamera } from 'three'

type CameraControlsProps = {
  camera: PerspectiveCamera
  enabled: boolean
  ref?: Ref<ComponentRef<typeof OrbitControls>>
}

export function CameraControls({ camera, enabled, ref }: CameraControlsProps) {
  // Register the 3D controls so the ViewCube can use the same orbit target.
  return <OrbitControls ref={ref} camera={camera} enabled={enabled} makeDefault enableDamping enablePan enableZoom minDistance={2} maxDistance={100} />
}

import { Canvas } from '@react-three/fiber'
import { Scene } from './viewer3d/Scene'
import { camera } from './viewer3d/sceneConfig'

export default function App() {
  return (
    <main className="viewport" aria-label="Interactive 3D viewport">
      <Canvas camera={camera}>
        <Scene />
      </Canvas>
    </main>
  )
}

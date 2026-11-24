import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useState } from 'react'
import { MOUSE, TOUCH, PerspectiveCamera, type OrthographicCamera as ThreeOrthographicCamera } from 'three'
import type { Wall } from '../model/wall'
import { CameraControls } from './CameraControls'
import { GroundGrid } from './GroundGrid'
import type { ViewMode } from './sceneConfig'
import { WallMesh } from './WallMesh'
import { ViewCube } from './viewcube'

type SceneProps = {
  view: ViewMode
  walls: Wall[]
  selectedWallId: string | null
  onSelectWall: (id: string) => void
  onDeselectWall: () => void
}

function SceneCameras({ view }: { view: ViewMode }) {
  const { width, height } = useThree((state) => state.size)
  const get = useThree((state) => state.get)
  const [perspectiveCamera] = useState(() => get().camera)
  const [topDownCamera, setTopDownCamera] = useState<ThreeOrthographicCamera | null>(null)

  useLayoutEffect(() => {
    // Fiber resizes the active camera only. Keep 3D ready even when 2D is active.
    if (!(perspectiveCamera instanceof PerspectiveCamera) || !width || !height) return
    perspectiveCamera.aspect = width / height
    perspectiveCamera.updateProjectionMatrix()
  }, [perspectiveCamera, width, height])

  useLayoutEffect(() => {
    // Choose the active camera explicitly; neither mode restores a captured camera.
    const activeCamera = view === '2D' ? topDownCamera : perspectiveCamera
    if (activeCamera) get().set({ camera: activeCamera })
  }, [get, perspectiveCamera, topDownCamera, view])

  return (
    <>
      <OrthographicCamera
        ref={setTopDownCamera}
        position={[0, 100, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        up={[0, 0, -1]}
        zoom={Math.max(Math.min(width, height), 1) / 24}
      />
      {topDownCamera && (
        <OrbitControls
          camera={topDownCamera}
          enabled={view === '2D'}
          enableRotate={false}
          enableZoom={false}
          screenSpacePanning
          mouseButtons={{ LEFT: MOUSE.PAN, RIGHT: MOUSE.PAN }}
          touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_PAN }}
        />
      )}
      {perspectiveCamera instanceof PerspectiveCamera && (
        <>
          <CameraControls camera={perspectiveCamera} enabled={view === '3D'} />
          {view === '3D' && <ViewCube camera={perspectiveCamera} />}
        </>
      )}
    </>
  )
}

export function Scene({ view, walls, selectedWallId, onSelectWall, onDeselectWall }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#202830']} />
      <ambientLight intensity={1} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} />
      <GroundGrid onDeselect={onDeselectWall} />
      {walls.map((wall) => <WallMesh key={wall.id} wall={wall} selected={selectedWallId === wall.id} onSelect={onSelectWall} />)}
      <SceneCameras view={view} />
    </>
  )
}

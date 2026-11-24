import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef, useState, type ComponentRef } from 'react'
import { MOUSE, TOUCH, PerspectiveCamera, type OrthographicCamera as ThreeOrthographicCamera } from 'three'
import type { Wall } from '../model/wall'
import { CameraControls } from './CameraControls'
import { GroundGrid } from './GroundGrid'
import type { ViewMode } from './sceneConfig'
import { WallMesh } from './WallMesh'
import { WallDrawing } from './WallDrawing'
import { ViewCube } from './viewcube'

type SceneProps = {
  view: ViewMode
  walls: Wall[]
  selectedWallId: string | null
  onSelectWall: (id: string) => void
  onDeselectWall: () => void
  drawing?: React.ComponentProps<typeof WallDrawing>
}

function SceneCameras({ view }: { view: ViewMode }) {
  const { width, height } = useThree((state) => state.size)
  // Set the unzoomed view to 24 m on the shorter side and give both axes the
  // same metres per pixel. Resizing changes these bounds, not camera.zoom.
  const metresPerPixel = 24 / Math.max(Math.min(width, height), 1)
  const halfPlanWidth = Math.max(width, 1) * metresPerPixel / 2
  const halfPlanHeight = Math.max(height, 1) * metresPerPixel / 2
  const get = useThree((state) => state.get)
  const [perspectiveCamera] = useState(() => get().camera)
  const [topDownCamera, setTopDownCamera] = useState<ThreeOrthographicCamera | null>(null)
  const topDownControls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const perspectiveControls = useRef<ComponentRef<typeof OrbitControls>>(null)

  useLayoutEffect(() => {
    // Fiber resizes the active camera only. Keep 3D ready even when 2D is active.
    if (!(perspectiveCamera instanceof PerspectiveCamera) || !width || !height) return
    perspectiveCamera.aspect = width / height
    perspectiveCamera.updateProjectionMatrix()
  }, [perspectiveCamera, width, height])

  useLayoutEffect(() => {
    const state = get()
    const activeCamera = view === '2D' ? topDownCamera : perspectiveCamera
    // Only transfer the target when switching cameras, not on subsequent renders.
    if (!activeCamera || state.camera === activeCamera) return

    const source = view === '2D' ? perspectiveControls.current : topDownControls.current
    const destination = view === '2D' ? topDownControls.current : perspectiveControls.current
    if (source && destination) {
      // The target is the point the camera looks at. Transfer only its floor
      // coordinates (X/Z): shifting the camera by the same amount keeps its
      // angle to the target, while leaving height and zoom alone.
      activeCamera.position.x += source.target.x - destination.target.x
      activeCamera.position.z += source.target.z - destination.target.z
      destination.target.x = source.target.x
      destination.target.z = source.target.z
      destination.update()
    }

    state.set({ camera: activeCamera })
  }, [get, perspectiveCamera, topDownCamera, view])

  return (
    <>
      <OrthographicCamera
        ref={setTopDownCamera}
        manual
        left={-halfPlanWidth}
        right={halfPlanWidth}
        top={halfPlanHeight}
        bottom={-halfPlanHeight}
        position={[0, 100, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        up={[0, 0, -1]}
      />
      {/* Disabling inactive controls rather than unmounting them preserves
          their orbit target. DOLLY_PAN lets two fingers zoom and pan together. */}
      {topDownCamera && (
        <OrbitControls
          ref={topDownControls}
          camera={topDownCamera}
          enabled={view === '2D'}
          enableRotate={false}
          enableZoom
          minZoom={0.25}
          maxZoom={8}
          screenSpacePanning
          mouseButtons={{ LEFT: MOUSE.PAN, RIGHT: MOUSE.PAN }}
          touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_PAN }}
        />
      )}
      {perspectiveCamera instanceof PerspectiveCamera && (
        <>
          <CameraControls ref={perspectiveControls} camera={perspectiveCamera} enabled={view === '3D'} />
          {view === '3D' && <ViewCube camera={perspectiveCamera} />}
        </>
      )}
    </>
  )
}

export function Scene({ view, walls, selectedWallId, onSelectWall, onDeselectWall, drawing }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#202830']} />
      <ambientLight intensity={1} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} />
      <GroundGrid onDeselect={onDeselectWall} />
      {walls.map((wall) => <WallMesh key={wall.id} wall={wall} selected={selectedWallId === wall.id} onSelect={drawing ? undefined : onSelectWall} />)}
      <SceneCameras view={view} />
      {drawing && <WallDrawing {...drawing} />}
    </>
  )
}

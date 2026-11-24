import { Text } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const CUBE_SCALE = 0.38
const CAMERA_DISTANCE = 4

const faces = [
  { label: 'Front', normal: new THREE.Vector3(0, 0, 1), color: '#3d647e' },
  { label: 'Back', normal: new THREE.Vector3(0, 0, -1), color: '#3d647e' },
  { label: 'Right', normal: new THREE.Vector3(1, 0, 0), color: '#547b91' },
  { label: 'Left', normal: new THREE.Vector3(-1, 0, 0), color: '#547b91' },
  { label: 'Top', normal: new THREE.Vector3(0, 1, 0), color: '#7896a7' },
  { label: 'Bottom', normal: new THREE.Vector3(0, -1, 0), color: '#7896a7' },
]

const boxFaceMaterials = [
  { color: '#547b91' }, // right (+X)
  { color: '#547b91' }, // left (-X)
  { color: '#7896a7' }, // top (+Y)
  { color: '#7896a7' }, // bottom (-Y)
  { color: '#3d647e' }, // front (+Z)
  { color: '#3d647e' }, // back (-Z)
]

type OrbitControlsTarget = {
  target?: THREE.Vector3
  update?: () => void
}

type DragState = {
  pointerId: number
  lastX: number
  lastY: number
  startX: number
  startY: number
}

type PointerCaptureTarget = {
  setPointerCapture: (pointerId: number) => void
  releasePointerCapture: (pointerId: number) => void
}

export function ViewCube({ camera }: { camera: THREE.PerspectiveCamera }) {
  const group = useRef<THREE.Group>(null)
  const manualRotation = useRef(new THREE.Quaternion())
  const drag = useRef<DragState | null>(null)
  const dragged = useRef(false)
  const controls = useThree((state) => state.controls as OrbitControlsTarget | undefined)

  const faceMaterials = useMemo(
    () => boxFaceMaterials.map(({ color }) => new THREE.MeshStandardMaterial({ color, roughness: 0.65 })),
    [],
  )
  const facesWithOrientation = useMemo(
    () => faces.map((face) => ({
      ...face,
      rotation: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.normal),
    })),
    [],
  )

  useFrame(() => {
    if (!group.current) return

    // Keep the cube in the camera's upper-right corner while its independent
    // rotation lets the user inspect or choose a view without moving the camera.
    const halfHeight = CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV()) / 2)
    const halfWidth = halfHeight * camera.aspect
    const localPosition = new THREE.Vector3(
      halfWidth - CUBE_SCALE * 0.8,
      halfHeight - CUBE_SCALE * 0.8,
      -CAMERA_DISTANCE,
    )

    camera.updateMatrixWorld()
    group.current.position.copy(camera.localToWorld(localPosition))
    // Keep the cube aligned to world axes. Because its position is camera-relative,
    // the camera's movement naturally changes which faces are visible.
    group.current.quaternion.identity()
    group.current.quaternion.multiply(manualRotation.current)
  })

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    dragged.current = false
    drag.current = {
      pointerId: event.pointerId,
      lastX: event.nativeEvent.clientX,
      lastY: event.nativeEvent.clientY,
      startX: event.nativeEvent.clientX,
      startY: event.nativeEvent.clientY,
    }
    const pointerTarget = event.target as unknown as PointerCaptureTarget | null
    pointerTarget?.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    const currentDrag = drag.current
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return
    event.stopPropagation()

    const x = event.nativeEvent.clientX
    const y = event.nativeEvent.clientY
    const totalX = x - currentDrag.startX
    const totalY = y - currentDrag.startY
    if (Math.hypot(totalX, totalY) > 4) dragged.current = true

    const yaw = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -((x - currentDrag.lastX) * 0.012),
    )
    const pitch = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -((y - currentDrag.lastY) * 0.012),
    )
    manualRotation.current.multiply(yaw).multiply(pitch).normalize()
    currentDrag.lastX = x
    currentDrag.lastY = y
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (drag.current?.pointerId === event.pointerId) {
      event.stopPropagation()
      const pointerTarget = event.target as unknown as PointerCaptureTarget | null
      pointerTarget?.releasePointerCapture(event.pointerId)
      drag.current = null
      if (dragged.current) manualRotation.current.identity()
    }
  }

  function snapToFace(localNormal: THREE.Vector3, event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (dragged.current || !group.current) return

    const target = controls?.target?.clone()
      ?? camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(CAMERA_DISTANCE))
    const distance = Math.max(camera.position.distanceTo(target), 2)
    const direction = localNormal.clone().applyQuaternion(group.current.quaternion).normalize()

    camera.position.copy(target).addScaledVector(direction, distance)
    camera.up.set(0, 1, 0)
    if (Math.abs(direction.dot(camera.up)) > 0.98) {
      camera.up.set(0, 0, direction.y > 0 ? -1 : 1)
    }
    camera.lookAt(target)
    camera.updateMatrixWorld()

    if (controls?.target) controls.target.copy(target)
    controls?.update?.()

    // Once the camera has snapped, resume following its orientation directly.
    manualRotation.current.identity()
    dragged.current = false
  }

  return (
    <group
      ref={group}
      scale={CUBE_SCALE}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        drag.current = null
        manualRotation.current.identity()
      }}
    >
      <mesh
        material={faceMaterials}
        onClick={(event) => {
          if (event.face) snapToFace(event.face.normal, event)
        }}
        renderOrder={1000}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      {facesWithOrientation.map((face) => (
        <group
          key={face.label}
          position={face.normal.clone().multiplyScalar(0.502)}
          quaternion={face.rotation}
          renderOrder={1001}
        >
          <Text
            fontSize={0.17}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {face.label}
          </Text>
        </group>
      ))}
    </group>
  )
}

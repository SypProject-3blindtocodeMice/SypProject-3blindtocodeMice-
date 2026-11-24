import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { Plane, Raycaster, Vector2, Vector3 } from 'three'
import type { Point2 } from '../model/wall'
import { previewSegments, type WallDraft } from '../model/wall-draft'
import { WallMesh } from './WallMesh'
import { viewCubePointerDowns } from './viewcube'

export const draftWallDimensions = { height: 2.5, thickness: 0.15, tiltDegrees: 0 }

type DrawingProps = {
  draft: WallDraft
  parallel: boolean
  saving: boolean
  onPlace: (point: Point2, shift: boolean) => void
}

export function WallDrawing({ draft, parallel, saving, onPlace }: DrawingProps) {
  const canvas = useThree((state) => state.gl.domElement)
  const get = useThree((state) => state.get)
  const [hover, setHover] = useState<Point2 | null>(null)
  const lastHover = useRef<Point2 | null>(null)
  const cursor = useRef<Vector2 | null>(null)
  const gesture = useRef<{ down: PointerEvent; moved: boolean } | null>(null)
  const active = useRef(new Set<number>())
  const { ray, floor, hit } = useMemo(() => ({ ray: new Raycaster(), floor: new Plane(new Vector3(0, 1, 0)), hit: new Vector3() }), [])

  function project(ndc: Vector2): Point2 | null {
    const { camera } = get()
    camera.updateMatrixWorld()
    ray.setFromCamera(ndc, camera)
    if (!ray.ray.intersectPlane(floor, hit) || hit.distanceTo(ray.ray.origin) > camera.far) return null
    return { x: Math.round(hit.x * 4) / 4, z: Math.round(hit.z * 4) / 4 }
  }

  function pointerPosition(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    return x >= 0 && x <= 1 && y >= 0 && y <= 1 ? new Vector2(x * 2 - 1, 1 - y * 2) : null
  }

  const place = useEffectEvent((event: PointerEvent) => {
    const ndc = pointerPosition(event)
    const point = ndc && project(ndc)
    if (!saving && point && document.elementFromPoint(event.clientX, event.clientY) === canvas) onPlace(point, event.shiftKey)
  })

  useEffect(() => {
    function down(event: PointerEvent) {
      active.current.add(event.pointerId)
      if (active.current.size > 1 || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey)
        gesture.current = null
      else gesture.current = { down: event, moved: false }
    }
    function trackHover(event: PointerEvent) { cursor.current = pointerPosition(event) }
    function trackDrag(event: PointerEvent) {
      const candidate = gesture.current
      if (candidate?.down.pointerId === event.pointerId && Math.hypot(event.clientX - candidate.down.clientX, event.clientY - candidate.down.clientY) > 4)
        candidate.moved = true
    }
    function up(event: PointerEvent) {
      active.current.delete(event.pointerId)
      const candidate = gesture.current
      if (event.pointerType === 'touch') cursor.current = null
      if (candidate?.down.pointerId !== event.pointerId) return
      gesture.current = null
      // The ViewCube shares the canvas but its clicks only navigate.
      if (event.button === 0 && !candidate.moved && !viewCubePointerDowns.has(candidate.down)
        && Math.hypot(event.clientX - candidate.down.clientX, event.clientY - candidate.down.clientY) <= 4) place(event)
    }
    function cancel(event: PointerEvent) {
      active.current.delete(event.pointerId)
      if (gesture.current?.down.pointerId === event.pointerId) gesture.current = null
      cursor.current = null
    }
    function leave() { cursor.current = null }
    function wheel() { gesture.current = null }
    function blur() { cursor.current = null; gesture.current = null; active.current.clear() }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', trackHover)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointermove', trackDrag)
    window.addEventListener('pointercancel', cancel)
    window.addEventListener('blur', blur)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', trackHover)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('wheel', wheel)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointermove', trackDrag)
      window.removeEventListener('pointercancel', cancel)
      window.removeEventListener('blur', blur)
    }
  }, [canvas])

  useFrame(() => {
    const point = !saving && cursor.current ? project(cursor.current) : null
    if (point?.x === lastHover.current?.x && point?.z === lastHover.current?.z) return
    lastHover.current = point
    setHover(point)
  })

  const preview = hover ? previewSegments(draft, hover, parallel) : []
  return <>
    {draft.segments.map((segment, index) => <WallMesh key={index} draft="pinned" wall={{ ...segment, ...draftWallDimensions, length: Math.hypot(segment.end.x - segment.start.x, segment.end.z - segment.start.z) }} />)}
    {preview.map((segment, index) => <WallMesh key={index} draft="preview" wall={{ ...segment, ...draftWallDimensions, length: Math.hypot(segment.end.x - segment.start.x, segment.end.z - segment.start.z) }} />)}
    {[draft.tip, hover].map((point, index) => point && <mesh key={index} position={[point.x, 0.03, point.z]}>
      <sphereGeometry args={[0.085, 12, 8]} />
      <meshBasicMaterial color={index === 0 ? '#ffd180' : '#84dcff'} depthTest={false} />
    </mesh>)}
  </>
}

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Plane, Raycaster, Vector2, Vector3 } from 'three'
import { nearestEndpoint, wallAtEndpoint, type Point2, type Wall, type WallDimensions } from '../model/wall'
import { previewSegments, type WallDraft } from '../model/wall-draft'
import { WallMesh } from './WallMesh'
import { viewCubePointerDowns } from './viewcube'
import type { ViewMode } from './sceneConfig'
import { createWallSnapPicker } from './wall-snap'

type DrawingProps = {
  draft: WallDraft
  dimensions: WallDimensions | null
  adjusting: boolean
  parallel: boolean
  saving: boolean
  targets: readonly Point2[]
  view: ViewMode
  walls: readonly Wall[]
  onPlace: (point: Point2, shift: boolean, source?: Wall) => void
}

type DrawingPoint = Point2 & { snapped: boolean; marker?: [number, number, number]; source?: Wall }

export function WallDrawing({ draft, dimensions, adjusting, parallel, saving, targets, view, walls, onPlace }: DrawingProps) {
  const canvas = useThree((state) => state.gl.domElement)
  const get = useThree((state) => state.get)
  const [hover, setHover] = useState<DrawingPoint | null>(null)
  const lastHover = useRef(hover)
  const cursor = useRef<Vector2 | null>(null)
  const gesture = useRef<{ down: PointerEvent; moved: boolean } | null>(null)
  const active = useRef(new Set<number>())
  const { ray, floor, hit } = useMemo(() => ({ ray: new Raycaster(), floor: new Plane(new Vector3(0, 1, 0)), hit: new Vector3() }), [])

  const draftTargets = useMemo(() => draft.segments.flatMap(({ start, end }) => [start, end]), [draft.segments])
  const pickWallSnap = useMemo(() => view === '3D' ? createWallSnapPicker(walls) : null, [view, walls])

  function project(ndc: Vector2): DrawingPoint | null {
    const { camera } = get()
    camera.updateMatrixWorld()
    ray.setFromCamera(ndc, camera)
    // The visual snap follows the wall end at the cursor's height. Draft geometry
    // still receives only the original floor-level X/Z anchor.
    const wallSnap = pickWallSnap?.(ray.ray, camera.far)
    if (wallSnap) return { ...wallSnap.point, snapped: true, marker: wallSnap.marker, source: wallSnap.wall }
    if (!ray.ray.intersectPlane(floor, hit) || hit.distanceTo(ray.ray.origin) > camera.far) return null
    const raw = { x: hit.x, z: hit.z }
    const grid = { x: Math.round(hit.x * 4) / 4, z: Math.round(hit.z * 4) / 4 }
    const existing = nearestEndpoint(raw, targets) ?? nearestEndpoint(grid, targets)
    const snapped = existing ?? nearestEndpoint(raw, draftTargets)
    return { ...(snapped ?? grid), snapped: snapped !== null, source: existing ? wallAtEndpoint(existing, walls) : undefined }
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
    if (!adjusting && !saving && dimensions && point && document.elementFromPoint(event.clientX, event.clientY) === canvas)
      onPlace({ x: point.x, z: point.z }, event.shiftKey, point.source)
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

  useLayoutEffect(() => {
    if (adjusting) gesture.current = null
  }, [adjusting])

  useFrame(() => {
    if (adjusting) return
    const point = !saving && dimensions && cursor.current ? project(cursor.current) : null
    const last = lastHover.current
    if (point?.x === last?.x && point?.z === last?.z && point?.snapped === last?.snapped && point?.source === last?.source
      && point?.marker?.[0] === last?.marker?.[0] && point?.marker?.[1] === last?.marker?.[1] && point?.marker?.[2] === last?.marker?.[2]) return
    lastHover.current = point
    setHover(point)
  })

  const preview = hover ? previewSegments(draft, hover, parallel, targets) : []
  const previewDimensions = !adjusting && hover?.source ? hover.source : dimensions
  // Give adjustment a sample when there isn't a full cursor preview yet.
  const sampleStart = draft.tip ?? hover
  if (adjusting && !preview.length && sampleStart) {
    preview.push({ start: sampleStart, end: { x: sampleStart.x + 1, z: sampleStart.z } })
  }
  return <>
    {draft.segments.map((segment, index) => <WallMesh key={index} draft="pinned" wall={{ ...segment, tiltDegrees: 0, length: Math.hypot(segment.end.x - segment.start.x, segment.end.z - segment.start.z) }} />)}
    {previewDimensions && preview.map((segment, index) => <WallMesh key={index} draft="preview" wall={{ ...segment, height: previewDimensions.height, thickness: previewDimensions.thickness, tiltDegrees: 0, length: Math.hypot(segment.end.x - segment.start.x, segment.end.z - segment.start.z) }} />)}
    {[draft.tip, hover].map((point, index) => point && <mesh key={index} position={(index === 1 && hover?.marker) || [point.x, 0.03, point.z]}>
      <sphereGeometry args={[0.085, 12, 8]} />
      <meshBasicMaterial color={index === 0 ? '#ffd180' : hover?.snapped ? '#a3ffac' : '#84dcff'} depthTest={false} />
    </mesh>)}
  </>
}

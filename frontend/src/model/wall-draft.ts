import { defaultWallDimensions, nearestEndpoint, type Point2, type WallDimensions } from './wall.ts'

export type Segment = { start: Point2; end: Point2 }
export type DraftSegment = Segment & WallDimensions
export type WallDraft = { tip: Point2 | null; segments: DraftSegment[]; base: Segment | null }
export const emptyDraft: WallDraft = { tip: null, segments: [], base: null }

export function adjustDraftDimensions(start: WallDimensions, dx: number, dy: number): WallDimensions {
  // Height changes 1 cm per pixel; thickness changes 1 cm per 5 pixels.
  function adjust(value: number, steps: number) {
    return steps === 0 ? value : Math.max(Math.min(value, 0.01), Number((value + steps / 100).toFixed(6)))
  }
  return { height: adjust(start.height, -Math.round(dy)), thickness: adjust(start.thickness, Math.round(dx / 5)) }
}

export function previewSegments(draft: WallDraft, point: Point2, parallel: boolean, targets: readonly Point2[] = []): Segment[] {
  if (!draft.tip) return []
  if (parallel && draft.base) {
    const { start, end } = draft.base
    const length = Math.hypot(end.x - start.x, end.z - start.z)
    const nx = -(end.z - start.z) / length
    const nz = (end.x - start.x) / length
    const depth = (point.x - end.x) * nx + (point.z - end.z) * nz
    if (Math.abs(depth) < 0.000001) return []
    const side = (p: Point2): Segment => {
      const offset = { x: p.x + nx * depth, z: p.z + nz * depth }
      return { start: p, end: nearestEndpoint(offset, targets) ?? offset }
    }
    const sides = [side(start), side(end)]
    return sides.every(({ start: a, end: b }) => Math.hypot(b.x - a.x, b.z - a.z) >= 0.000001) ? sides : []
  }
  return Math.hypot(point.x - draft.tip.x, point.z - draft.tip.z) < 0.000001
    ? [] : [{ start: draft.tip, end: point }]
}

export function placePoint(draft: WallDraft, point: Point2, parallel: boolean, targets: readonly Point2[] = [], dimensions = defaultWallDimensions): WallDraft {
  if (!draft.tip) return { ...draft, tip: point }
  const segments = previewSegments(draft, point, parallel, targets)
  if (segments.length === 0) return draft
  const last = segments[segments.length - 1]
  return {
    tip: last.end,
    segments: [...draft.segments, ...segments.map((segment) => ({ ...segment, ...dimensions }))],
    base: last,
  }
}

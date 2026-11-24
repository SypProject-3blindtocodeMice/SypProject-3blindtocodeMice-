import type { Point2 } from './wall'

export type Segment = { start: Point2; end: Point2 }
export type WallDraft = { tip: Point2 | null; segments: Segment[]; base: Segment | null }
export const emptyDraft: WallDraft = { tip: null, segments: [], base: null }

export function previewSegments(draft: WallDraft, point: Point2, parallel: boolean): Segment[] {
  if (!draft.tip) return []
  if (parallel && draft.base) {
    const { start, end } = draft.base
    const length = Math.hypot(end.x - start.x, end.z - start.z)
    const nx = -(end.z - start.z) / length
    const nz = (end.x - start.x) / length
    const depth = (point.x - end.x) * nx + (point.z - end.z) * nz
    if (Math.abs(depth) < 0.000001) return []
    const offset = (p: Point2) => ({ x: p.x + nx * depth, z: p.z + nz * depth })
    return [{ start, end: offset(start) }, { start: end, end: offset(end) }]
  }
  return Math.hypot(point.x - draft.tip.x, point.z - draft.tip.z) < 0.000001
    ? [] : [{ start: draft.tip, end: point }]
}

export function placePoint(draft: WallDraft, point: Point2, parallel: boolean): WallDraft {
  if (!draft.tip) return { ...draft, tip: point }
  const segments = previewSegments(draft, point, parallel)
  if (segments.length === 0) return draft
  const last = segments[segments.length - 1]
  return {
    tip: last.end,
    segments: [...draft.segments, ...segments],
    base: last,
  }
}

import { defaultWallDimensions, nearestEndpoint, type Point2, type WallDimensions } from './wall.ts'

export type Segment = { start: Point2; end: Point2 }
export type DraftSegment = Segment & WallDimensions
export type WallDraft = { tip: Point2 | null; segments: DraftSegment[]; base: Segment | null }
export const emptyDraft: WallDraft = { tip: null, segments: [], base: null }

export const dimensionArrows = { ArrowUp: ['height', 1], ArrowDown: ['height', -1], ArrowRight: ['thickness', 1], ArrowLeft: ['thickness', -1] } as const
export type DimensionArrow = keyof typeof dimensionArrows

export function stepDraftDimension(value: number, arrow: DimensionArrow, heldMs: number): number {
  const centimetres = heldMs >= 2500 ? 10 : heldMs >= 1500 ? 5 : heldMs >= 750 ? 2 : 1
  const next = value + dimensionArrows[arrow][1] * centimetres / 100
  return Math.max(Math.min(value, 0.01), Number(next.toFixed(8)))
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

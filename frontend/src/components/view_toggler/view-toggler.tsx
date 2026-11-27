import type { ViewMode } from '../../viewer3d/sceneConfig'
import './view-toggler-style.css'

type ViewTogglerProps = {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggler({ view, onViewChange }: ViewTogglerProps) {
  const nextView = view === '2D' ? '3D' : '2D'

  return (
    <button
      id="viewToggler"
      className="logo-icon view-toggler"
      type="button"
      aria-label={`${view} view. Switch to ${nextView}`}
      onClick={() => onViewChange(nextView)}
    >
      {view}
    </button>
  )
}

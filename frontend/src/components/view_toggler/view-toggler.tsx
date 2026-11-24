import { useState } from 'react'
import './view-toggler-style.css'

export function ViewToggler() {
  const [view, setView] = useState<'2D' | '3D'>('2D')
  const nextView = view === '2D' ? '3D' : '2D'

  return (
    <button
      id="viewToggler"
      className="logo-icon view-toggler"
      type="button"
      aria-label={`${view} view. Switch to ${nextView}`}
      onClick={() => setView(nextView)}
    >
      {view}
    </button>
  )
}

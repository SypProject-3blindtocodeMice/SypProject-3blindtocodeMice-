import { useEffect, useRef, useState } from 'react'
import './controls-help-style.css'

type Control = { keys: string[]; action: string }

const keyboardKeys = ['Shift', '←', '→', '↑', '↓']

const pointerControls: Control[] = [
  { keys: ['Left-drag'], action: 'Orbit the camera' },
  { keys: ['Right-drag'], action: 'Pan the camera' },
  { keys: ['Scroll'], action: 'Zoom in and out' },
]

const touchControls: Control[] = [
  { keys: ['1-finger drag'], action: 'Orbit the camera' },
  { keys: ['2-finger drag'], action: 'Pan the camera' },
  { keys: ['Pinch'], action: 'Zoom in and out' },
]

const keyboardControls: Control[] = [
  { keys: ['←'], action: 'Move wall left' },
  { keys: ['→'], action: 'Move wall right' },
  { keys: ['↑'], action: 'Move wall back' },
  { keys: ['↓'], action: 'Move wall forward' },
  { keys: ['Shift', '←'], action: 'Turn left' },
  { keys: ['Shift', '→'], action: 'Turn right' },
  { keys: ['Shift', '↑'], action: 'Tilt back' },
  { keys: ['Shift', '↓'], action: 'Tilt forward' },
]

function ControlRow({ control, className }: { control: Control; className?: string }) {
  return (
    <li className={className}>
      <span className="help-keys">
        {control.keys.map((key, index) => (
          <span key={key}>
            {index > 0 && <span className="help-plus">+</span>}
            {keyboardKeys.includes(key) ? <kbd>{key}</kbd> : <span className="help-mouse">{key}</span>}
          </span>
        ))}
      </span>
      <span className="help-arrow" aria-hidden="true">→</span>
      <span className="help-action">{control.action}</span>
    </li>
  )
}

export default function ControlsHelp() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointer(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className={`controls-help ${open ? 'open' : ''}`} ref={wrapperRef}>
      <button
        type="button"
        className="help-button"
        aria-label="Controls"
        aria-expanded={open}
        aria-controls="controls-help-popover"
        onClick={() => setOpen((value) => !value)}
      >
        ?
      </button>

      <div id="controls-help-popover" className="help-popover" role="dialog" aria-label="Controls">
        <h2>Controls</h2>
        <ul>
          {pointerControls.map((control) => <ControlRow key={control.action} control={control} className="only-pointer" />)}
          {touchControls.map((control) => <ControlRow key={`touch-${control.action}`} control={control} className="only-touch" />)}
          {keyboardControls.map((control) => <ControlRow key={control.action} control={control} className="only-keyboard" />)}
        </ul>
        <p>Select a wall first to move, turn or tilt it. On touch screens, use the Edit geometry form.</p>
      </div>
    </div>
  )
}

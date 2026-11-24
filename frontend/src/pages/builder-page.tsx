import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { connectWalls, createWall, getWalls, updateWall } from '../api/walls'
import { moveWall, tipWall, turnWall, type Wall } from '../model/wall'
import { Scene } from '../viewer3d/Scene'
import { camera } from '../viewer3d/sceneConfig'
import ControlsHelp from '../components/builder/controls-help'
import { ViewToggler } from '../components/view_toggler/view-toggler'
import './builder-style.css'

const fieldLabels = { startX: 'Start X', startZ: 'Start Z', endX: 'End X', endZ: 'End Z', height: 'Height', thickness: 'Thickness' } as const
const fieldKeys = ['startX', 'startZ', 'endX', 'endZ', 'height', 'thickness'] as const

const moveStep = 0.25
const rotationStep = 1
const emptyForm = { name: '', startX: '0', startZ: '0', endX: '4', endZ: '0', height: '2.5', thickness: '0.15' }

export default function BuilderPage() {
  const [walls, setWalls] = useState<Wall[]>([])
  const wallsRef = useRef(walls)
  wallsRef.current = walls
  const pendingRef = useRef<Wall | null>(null)
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [edit, setEdit] = useState({ startX: '', startZ: '', endX: '', endZ: '', height: '', thickness: '' })
  const [connection, setConnection] = useState({ endpoint: 'end' as 'start' | 'end', targetWallId: '', targetEndpoint: 'start' as 'start' | 'end' })
  // UI-only state for the new layout (does not affect wall logic)
  const [panelOpen, setPanelOpen] = useState(true)
  const selectedWall = walls.find((wall) => wall.id === selectedWallId) ?? null

  useEffect(() => {
    const wall = walls.find((item) => item.id === selectedWallId)
    if (!wall) return
    setEdit({ startX: String(wall.start.x), startZ: String(wall.start.z), endX: String(wall.end.x), endZ: String(wall.end.z), height: String(wall.height), thickness: String(wall.thickness) })
  }, [selectedWallId, selectedWall?.start.x, selectedWall?.start.z, selectedWall?.end.x, selectedWall?.end.z, selectedWall?.height, selectedWall?.thickness])

  const reload = useCallback(async () => setWalls(await getWalls()), [])
  useEffect(() => { reload().catch((e: unknown) => setError(`Could not load walls: ${String(e)}`)) }, [reload])

  const commit = useCallback(async (id: string, optimistic: Wall) => {
    setWalls((current) => current.map((wall) => wall.id === id ? optimistic : wall))
    try {
      const updated = await updateWall(id, optimistic)
      setWalls((current) => current.map((wall) => wall.id === id ? updated : wall))
      await reload()
      setError('')
    } catch (e) {
      try { await reload() } catch { /* Keep the original update error visible. */ }
      setError(`Could not update wall: ${String(e)}`)
    }
  }, [reload])

  useEffect(() => {
    if (!selectedWallId) return
    const activeWallId = selectedWallId
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement)) return
      const current = pendingRef.current ?? wallsRef.current.find((wall) => wall.id === activeWallId)
      if (!current || !event.key.startsWith('Arrow')) return
      event.preventDefault()
      let next: Wall
      if (event.shiftKey) {
        next = event.key === 'ArrowLeft' ? turnWall(current, -rotationStep) : event.key === 'ArrowRight' ? turnWall(current, rotationStep) : event.key === 'ArrowUp' ? tipWall(current, -rotationStep) : tipWall(current, rotationStep)
      } else {
        next = moveWall(current, event.key === 'ArrowLeft' ? -moveStep : event.key === 'ArrowRight' ? moveStep : 0, event.key === 'ArrowUp' ? -moveStep : event.key === 'ArrowDown' ? moveStep : 0)
      }
      pendingRef.current = next
      setWalls((items) => items.map((wall) => {
        if (wall.id === current.id) return next
        const start = wall.startAnchorId === current.startAnchorId ? next.start : wall.startAnchorId === current.endAnchorId ? next.end : wall.start
        const end = wall.endAnchorId === current.startAnchorId ? next.start : wall.endAnchorId === current.endAnchorId ? next.end : wall.end
        return start === wall.start && end === wall.end ? wall : { ...wall, start, end, length: Math.hypot(end.x - start.x, end.z - start.z) }
      }))
    }
    function handleKeyUp(event: KeyboardEvent) {
      if (!event.key.startsWith('Arrow') || !pendingRef.current) return
      const final = pendingRef.current
      pendingRef.current = null
      void commit(activeWallId, final)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp) }
  }, [selectedWallId, commit])

  async function addWall(event: React.FormEvent) {
    event.preventDefault()
    try {
      const wall = await createWall({ name: form.name, start: { x: Number(form.startX), z: Number(form.startZ) }, end: { x: Number(form.endX), z: Number(form.endZ) }, height: Number(form.height), thickness: Number(form.thickness) })
      await reload()
      setSelectedWallId(wall.id)
      setForm(emptyForm)
      setShowAdd(false)
      setError('')
    } catch (e) { setError(`Could not add wall: ${String(e)}`) }
  }

  async function connect(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedWallId || !connection.targetWallId) return
    try { setWalls(await connectWalls(selectedWallId, connection)); setError('') }
    catch (e) { setError(`Could not connect walls: ${String(e)}`); try { await reload() } catch { /* Keep error visible. */ } }
  }

  async function saveWall(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedWall) return
    const next = { ...selectedWall, start: { x: Number(edit.startX), z: Number(edit.startZ) }, end: { x: Number(edit.endX), z: Number(edit.endZ) }, height: Number(edit.height), thickness: Number(edit.thickness) }
    await commit(selectedWall.id, next)
  }

  return <div className={`builder ${panelOpen ? 'panel-open' : 'panel-closed'}`}>
    <section className="viewport" aria-label="Interactive 3D viewport">
      <Canvas camera={camera} onPointerMissed={() => setSelectedWallId(null)}><Scene walls={walls} selectedWallId={selectedWallId} onSelectWall={setSelectedWallId} onDeselectWall={() => setSelectedWallId(null)} /></Canvas>
    </section>

    <div className="viewport-view-toggle">
      <ViewToggler />
    </div>

    <aside className="sidebar" aria-label="Wall editor">
      <div className="sidebar-head">
        <div>
          <h1>Building walls</h1>
          <p>{walls.length === 0 ? 'Start by adding a wall' : `${walls.length} wall${walls.length === 1 ? '' : 's'} in this room`}</p>
        </div>
        <div className="sidebar-head-actions">
          <ControlsHelp />
          <button type="button" className="icon-btn panel-toggle" aria-expanded={panelOpen} aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'} onClick={() => setPanelOpen((value) => !value)}>{panelOpen ? '▾' : '▴'}</button>
        </div>
      </div>

      <div className="sidebar-body">
        {error && <p className="error" role="alert">{error}</p>}

        <section className="panel-section">
          <button type="button" className={`btn btn-block ${showAdd ? '' : 'btn-primary'}`} onClick={() => setShowAdd((value) => !value)}>{showAdd ? 'Cancel' : '+ Add wall'}</button>
          {showAdd && <form onSubmit={addWall} className="wall-form">
            <h2>New wall <span>(metres)</span></h2>
            <label className="field">Name<input className="input" required placeholder="Living room north" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <div className="form-grid">{fieldKeys.map((key) => <label key={key} className="field">{fieldLabels[key]}<input className="input" type="number" step="0.1" required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}</div>
            <button type="submit" className="btn btn-primary btn-block">Add wall</button>
          </form>}
        </section>

        <section className="panel-section">
          <h2>Walls <span className="count">{walls.length}</span></h2>
          {walls.length === 0
            ? <p className="empty">No walls yet. Add your first wall to see it on the grid.</p>
            : <ul className="wall-list">{walls.map((wall) => <li key={wall.id}><button type="button" className={selectedWallId === wall.id ? 'selected' : ''} onClick={() => setSelectedWallId(wall.id)}><span>{wall.name}</span><small>{wall.length.toFixed(2)} m</small></button></li>)}</ul>}
        </section>

        {selectedWall && <section className="panel-section wall-details">
          <h2>{selectedWall.name}</h2>
          <dl className="stats">
            <div><dt>Length</dt><dd>{selectedWall.length.toFixed(2)} m</dd></div>
            <div><dt>Height</dt><dd>{selectedWall.height} m</dd></div>
            <div><dt>Thickness</dt><dd>{selectedWall.thickness} m</dd></div>
            <div><dt>Tilt</dt><dd>{selectedWall.tiltDegrees}°</dd></div>
          </dl>
          <p className="wall-hint">Use the arrow keys to move this wall, or hold <kbd>Shift</kbd> to turn and tilt it. Tap or hover <strong>?</strong> for all controls.</p>
          <form onSubmit={saveWall} className="wall-form">
            <h3>Edit geometry <span>(metres)</span></h3>
            <div className="form-grid">{fieldKeys.map((key) => <label key={key} className="field">{fieldLabels[key]}<input className="input" type="number" step="any" required value={edit[key]} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} /></label>)}</div>
            <button type="submit" className="btn btn-primary btn-block">Save wall</button>
          </form>

          {walls.length > 1 && <form onSubmit={connect} className="wall-form connect-form">
            <h3>Connection</h3>
            <label className="field">From this wall<select className="select" value={connection.endpoint} onChange={(e) => setConnection({ ...connection, endpoint: e.target.value as 'start' | 'end' })}><option value="start">Start point</option><option value="end">End point</option></select></label>
            <label className="field">To wall<select className="select" required value={connection.targetWallId} onChange={(e) => setConnection({ ...connection, targetWallId: e.target.value })}><option value="">Choose wall…</option>{walls.filter((w) => w.id !== selectedWall.id).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
            <label className="field">At its<select className="select" value={connection.targetEndpoint} onChange={(e) => setConnection({ ...connection, targetEndpoint: e.target.value as 'start' | 'end' })}><option value="start">Start point</option><option value="end">End point</option></select></label>
            <button type="submit" className="btn btn-block">Connect</button>
          </form>}
        </section>}
      </div>
    </aside>
  </div>
}

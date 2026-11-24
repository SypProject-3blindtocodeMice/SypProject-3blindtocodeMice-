import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { connectWalls, createWall, createWallDraft, deleteWall, getWalls, updateWall } from '../api/walls'
import { connectedEndpoints, moveWall, tipWall, turnWall, wallEndpoints, type Point2, type Wall } from '../model/wall'
import { emptyDraft, placePoint, type WallDraft } from '../model/wall-draft'
import { Scene } from '../viewer3d/Scene'
import { draftWallDimensions } from '../viewer3d/WallDrawing'
import { camera, type ViewMode } from '../viewer3d/sceneConfig'
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
  const [view, setView] = useState<ViewMode>('2D')
  const wallsRef = useRef(walls)
  wallsRef.current = walls
  const pendingRef = useRef<Wall | null>(null)
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [draft, setDraft] = useState<WallDraft | null>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const [parallel, setParallel] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const savingDraftRef = useRef(false)
  const viewportRef = useRef<HTMLElement>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [edit, setEdit] = useState({ startX: '', startZ: '', endX: '', endZ: '', height: '', thickness: '' })
  const [connection, setConnection] = useState({ endpoint: 'end' as 'start' | 'end', targetWallId: '', targetEndpoint: 'start' as 'start' | 'end' })
  // UI-only state for the new layout (does not affect wall logic)
  const [panelOpen, setPanelOpen] = useState(true)
  const selectedWall = walls.find((wall) => wall.id === selectedWallId) ?? null
  const drawing = draft !== null

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
    if (!selectedWallId || deleting || drawing) return
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
  }, [selectedWallId, commit, deleting, drawing])

  function startDrawing() {
    if (deleting || pendingRef.current) return
    setSelectedWallId(null)
    setShowAdd(false)
    setError('')
    setDraft(emptyDraft)
  }

  function cancelDrawing() {
    if (savingDraftRef.current) return
    setDraft(null)
    setShiftHeld(false)
    setParallel(false)
    setError('')
  }

  function addDraftPoint(point: Point2, shift: boolean) {
    if (savingDraftRef.current) return
    viewportRef.current?.focus({ preventScroll: true })
    setDraft((current) => current && placePoint(current, point, shift || parallel))
  }

  async function finishDrawing() {
    if (!draft?.segments.length || savingDraftRef.current) return
    savingDraftRef.current = true
    setSavingDraft(true)
    try {
      const saved = await createWallDraft(draft.segments.map((segment, index) => ({
        ...segment, ...draftWallDimensions, name: `Wall ${walls.length + index + 1}`,
      })))
      setWalls((current) => [...current, ...saved])
      setDraft(null)
      setShiftHeld(false)
      setParallel(false)
      setError('')
    } catch (e) {
      setError(`Could not save drawing: ${String(e)}`)
    } finally {
      savingDraftRef.current = false
      setSavingDraft(false)
    }
  }

  const finishFromKeyboard = useEffectEvent(finishDrawing)
  const cancelFromKeyboard = useEffectEvent(cancelDrawing)
  useEffect(() => {
    if (!drawing) return
    function keyDown(event: KeyboardEvent) {
      if (event.key === 'Shift') setShiftHeld(true)
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        cancelFromKeyboard()
      }
      if (event.key === 'Enter' && !(event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select, [contenteditable]'))) {
        event.preventDefault()
        void finishFromKeyboard()
      }
    }
    function keyUp(event: KeyboardEvent) { if (event.key === 'Shift') setShiftHeld(false) }
    function blur() { setShiftHeld(false) }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      window.removeEventListener('blur', blur)
    }
  }, [drawing])

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
    if (!selectedWall || deleting) return
    const next = { ...selectedWall, start: { x: Number(edit.startX), z: Number(edit.startZ) }, end: { x: Number(edit.endX), z: Number(edit.endZ) }, height: Number(edit.height), thickness: Number(edit.thickness) }
    await commit(selectedWall.id, next)
  }

  async function removeSelectedWall() {
    if (!selectedWall || deleting || pendingRef.current) return
    const { id, name } = selectedWall
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteWall(id)
      setWalls((current) => current.filter((wall) => wall.id !== id))
      setSelectedWallId((current) => current === id ? null : current)
      setConnection((current) => current.targetWallId === id ? { ...current, targetWallId: '' } : current)
      setError('')
    } catch (e) {
      setError(`Could not delete wall: ${String(e)}`)
    } finally {
      setDeleting(false)
    }
  }

  return <div className={`builder ${panelOpen ? 'panel-open' : 'panel-closed'}`}>
    <section ref={viewportRef} tabIndex={-1} className={`viewport${drawing ? ' viewport-drawing' : ''}`} aria-label={`${view} building viewport`}>
      <Canvas camera={camera} onPointerMissed={() => !drawing && setSelectedWallId(null)}>
        <Scene view={view} walls={walls} selectedWallId={selectedWallId} onSelectWall={setSelectedWallId} onDeselectWall={() => !drawing && setSelectedWallId(null)}
          drawing={draft ? { draft, parallel: parallel || shiftHeld, saving: savingDraft, onPlace: addDraftPoint } : undefined} />
      </Canvas>
    </section>

    <div className="viewport-view-toggle">
      <ViewToggler view={view} onViewChange={setView} />
    </div>

    <aside className="sidebar" aria-label="Wall editor">
      <div className="sidebar-head">
        <div>
          <h1>Building walls</h1>
          <p>{walls.length === 0 ? 'Start by adding a wall' : `${walls.length} wall${walls.length === 1 ? '' : 's'} in this room`}</p>
        </div>
        <div className="sidebar-head-actions">
          <ControlsHelp view={view} />
          <button type="button" className="icon-btn panel-toggle" aria-expanded={panelOpen} aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'} onClick={() => setPanelOpen((value) => !value)}>{panelOpen ? '▾' : '▴'}</button>
        </div>
      </div>

      <div className="sidebar-body">
        {error && <p className="error" role="alert">{error}</p>}

        <section className="panel-section">
          <button type="button" className="btn btn-primary btn-block" aria-pressed={drawing} disabled={savingDraft} onClick={drawing ? cancelDrawing : startDrawing}>Draw wall</button>
          {draft ? <div className="wall-form">
            <p className="wall-hint" role="status">{draft.tip ? `${draft.segments.length} draft segments. Click or tap to place the next point.` : 'Click or tap the grid to place the first point.'} Drag to navigate; scroll or pinch to zoom.</p>
            <button type="button" className="btn btn-block" aria-pressed={parallel || shiftHeld} disabled={!draft.base || savingDraft} onClick={() => setParallel((value) => !value)}>Parallel sides</button>
            <p className="wall-hint">Hold <kbd>Shift</kbd> or toggle Parallel sides to draw from both ends of the last wall.</p>
            <div className="form-grid">
              <button type="button" className="btn btn-primary" disabled={!draft.segments.length || savingDraft} onClick={finishDrawing}>{savingDraft ? 'Saving…' : 'Finish (Enter)'}</button>
              <button type="button" className="btn" disabled={savingDraft} onClick={cancelDrawing}>Cancel (Esc)</button>
            </div>
          </div> : <button type="button" className="btn btn-block" onClick={() => setShowAdd((value) => !value)}>{showAdd ? 'Cancel' : '+ Add wall by coordinates'}</button>}
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
            : <ul className="wall-list">{walls.map((wall) => <li key={wall.id}><button type="button" disabled={drawing} className={selectedWallId === wall.id ? 'selected' : ''} onClick={() => setSelectedWallId(wall.id)}><span>{wall.name}</span><small>{wall.length.toFixed(2)} m</small></button></li>)}</ul>}
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
            <button type="submit" className="btn btn-primary btn-block" disabled={deleting}>Save wall</button>
            <button type="button" className="btn btn-danger btn-block" disabled={deleting} onClick={removeSelectedWall}>{deleting ? 'Deleting…' : 'Delete wall'}</button>
          </form>

           <section className="wall-form connect-form">
             <h3>Current connections</h3>
             <dl className="wall-connections">
               {wallEndpoints.map((side) => {
                 const links = connectedEndpoints(selectedWall, side, walls)
                 return <div key={side}>
                   <dt>{side === 'start' ? 'Start point' : 'End point'}</dt>
                   <dd>{links.length ? links.map(({ wall, endpoint }) => `${wall.name} (${endpoint})`).join(', ') : 'Not connected'}</dd>
                 </div>
               })}
             </dl>
           </section>

           {walls.length > 1 && <form onSubmit={connect} className="wall-form connect-form">
             <h3>Connect manually</h3>
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

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { connectWalls, createWall, getWalls, updateWall } from '../api/walls'
import { moveWall, tipWall, turnWall, type Wall } from '../model/wall'
import { Scene } from '../viewer3d/Scene'
import { camera } from '../viewer3d/sceneConfig'
import './builder-style.css'
import NavBar from "../components/layout/nav-bar.tsx";


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

  return <main className="viewport" aria-label="Interactive 3D viewport">
    <Canvas camera={camera} onPointerMissed={() => setSelectedWallId(null)}><Scene walls={walls} selectedWallId={selectedWallId} onSelectWall={setSelectedWallId} onDeselectWall={() => setSelectedWallId(null)} /></Canvas>
    <aside className="sidebar">
      <h1>Building walls</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="button" onClick={() => setShowAdd((value) => !value)}>+ Add Wall</button>
      {showAdd && <form onSubmit={addWall} className="wall-form">
        <h2>New wall (metres)</h2>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <div className="form-grid">{(['startX', 'startZ', 'endX', 'endZ', 'height', 'thickness'] as const).map((key) => <label key={key}>{({ startX: 'Start X', startZ: 'Start Z', endX: 'End X', endZ: 'End Z', height: 'Height', thickness: 'Thickness' })[key]}<input type="number" step="0.1" required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}</div>
        <button type="submit">Add wall</button>
      </form>}
      <h2>Walls ({walls.length})</h2>
      <ul className="wall-list">{walls.map((wall) => <li key={wall.id}><button className={selectedWallId === wall.id ? 'selected' : ''} onClick={() => setSelectedWallId(wall.id)}>{wall.name}<small>{wall.length.toFixed(2)} m</small></button></li>)}</ul>
      {selectedWall && <section className="wall-details"><strong>{selectedWall.name}</strong><span>Length: {selectedWall.length.toFixed(2)} m · Height: {selectedWall.height} m</span><span>Thickness: {selectedWall.thickness} m</span><span>Tilt: {selectedWall.tiltDegrees}°</span><small>Arrows: move 0.25 m · Shift+Left/Right: turn · Shift+Up/Down: tilt</small>
        <form onSubmit={saveWall} className="wall-form"><h2>Edit geometry (metres)</h2><div className="form-grid">{(['startX', 'startZ', 'endX', 'endZ', 'height', 'thickness'] as const).map((key) => <label key={key}>{({ startX: 'Start X', startZ: 'Start Z', endX: 'End X', endZ: 'End Z', height: 'Height', thickness: 'Thickness' })[key]}<input type="number" step="any" required value={edit[key]} onChange={(e) => setEdit({ ...edit, [key]: e.target.value })} /></label>)}</div><button type="submit">Save wall</button></form>
        {walls.length > 1 && <form onSubmit={connect} className="connect-form"><h2>Connect endpoint</h2><select value={connection.endpoint} onChange={(e) => setConnection({ ...connection, endpoint: e.target.value as 'start' | 'end' })}><option value="start">Selected wall: start</option><option value="end">Selected wall: end</option></select><select required value={connection.targetWallId} onChange={(e) => setConnection({ ...connection, targetWallId: e.target.value })}><option value="">Choose wall…</option>{walls.filter((w) => w.id !== selectedWall.id).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select><select value={connection.targetEndpoint} onChange={(e) => setConnection({ ...connection, targetEndpoint: e.target.value as 'start' | 'end' })}><option value="start">Target: start</option><option value="end">Target: end</option></select><button>Connect</button></form>}
      </section>}
    </aside>
  </main>
}

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { initialWall, rotateWall, tipWall, type Wall } from './model/wall'
import { Scene } from './viewer3d/Scene'
import { camera } from './viewer3d/sceneConfig'

const moveStep = 0.25 // meters per arrow-key press
const rotationStep = 1 // degree per Shift+arrow-key event

export default function App() {
  const [wall, setWall] = useState<Wall>(initialWall)
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null)
  const selectedWall = selectedWallId === wall.id ? wall : null

  useEffect(() => {
    if (!selectedWallId) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && event.target.isContentEditable) return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

      if (event.shiftKey) {
        if (!event.key.startsWith('Arrow')) return
        event.preventDefault()
        setWall((current) => {
          if (current.id !== selectedWallId) return current
          switch (event.key) {
            case 'ArrowLeft': return rotateWall(current, -rotationStep)
            case 'ArrowRight': return rotateWall(current, rotationStep)
            case 'ArrowUp': return tipWall(current, -rotationStep)
            case 'ArrowDown': return tipWall(current, rotationStep)
            default: return current
          }
        })
        return
      }

      let x = 0
      let z = 0
      switch (event.key) {
        case 'ArrowLeft': x = -moveStep; break
        case 'ArrowRight': x = moveStep; break
        case 'ArrowUp': z = -moveStep; break
        case 'ArrowDown': z = moveStep; break
        default: return
      }

      event.preventDefault()
      setWall((current) => current.id === selectedWallId
        ? { ...current, position: { x: current.position.x + x, z: current.position.z + z } }
        : current)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedWallId])

  return (
    <main className="viewport" aria-label="Interactive 3D viewport">
      <Canvas camera={camera} onPointerMissed={() => setSelectedWallId(null)}>
        <Scene
          wall={wall}
          selectedWallId={selectedWallId}
          onSelectWall={setSelectedWallId}
          onDeselectWall={() => setSelectedWallId(null)}
        />
      </Canvas>
      {selectedWall && (
        <aside className="wall-details" aria-live="polite">
          <strong>{selectedWall.name}</strong>
          <span>Width: {selectedWall.width} m · Height: {selectedWall.height} m</span>
          <span>Thickness: {selectedWall.thickness} m</span>
          <span>Rotation: {selectedWall.rotationDegrees}°</span>
          <span>Tilt: {selectedWall.tiltDegrees}°</span>
          <small>Arrows: move 0.25 m · Shift+Left/Right: turn 1° · Shift+Up/Down: tip 1°</small>
        </aside>
      )}
    </main>
  )
}

import { spawn } from 'node:child_process'

const windows = process.platform === 'win32'
const commands = [
  ['backend', 'dotnet', ['run', '--project', 'backend/FurnaView.Api', '--no-launch-profile', '--urls', 'http://localhost:5080']],
  ['frontend', 'npm', ['run', 'dev', '--prefix', 'frontend']],
]

let stopping = false
const children = commands.map(([name, command, args]) => {
  // Windows needs a shell to launch npm; these command strings contain no user input.
  const child = spawn(windows ? [command, ...args].join(' ') : command, windows ? [] : args, {
    stdio: 'inherit', shell: windows, detached: !windows,
  })

  child.on('error', (error) => {
    console.error(`${name} failed to start: ${error.message}`)
    stop(1)
  })
  child.on('exit', (code) => {
    if (!stopping) {
      console.error(`${name} stopped; shutting down the other server.`)
      stop(code || 1)
    }
  })

  return child
})

function stop(code = 0) {
  if (stopping) return
  stopping = true
  process.exitCode = code

  for (const child of children) {
    if (!child.pid || child.exitCode !== null || child.signalCode !== null) continue
    if (windows) {
      spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      try { process.kill(-child.pid, 'SIGTERM') } catch { /* Process already stopped. */ }
    }
  }
}

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())

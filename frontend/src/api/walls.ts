import type { CreateWallRequest, UpdateWallRequest, Wall } from '../model/wall'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`)
  return response.json() as Promise<T>
}

export const getWalls = () => request<Wall[]>('/api/walls')
export const createWall = (body: CreateWallRequest) => request<Wall>('/api/walls', { method: 'POST', body: JSON.stringify(body) })
export const updateWall = (id: string, body: UpdateWallRequest) => request<Wall>(`/api/walls/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) })
export const connectWalls = (id: string, body: { endpoint: 'start' | 'end'; targetWallId: string; targetEndpoint: 'start' | 'end' }) => request<Wall[]>(`/api/walls/${encodeURIComponent(id)}/connections`, { method: 'POST', body: JSON.stringify(body) })

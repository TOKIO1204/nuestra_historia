import { useState, useEffect, useCallback } from 'react'
import { memories as staticMemories } from '../data/memoriesData'

const normalize = (m) => ({ ...m, image: m.image_url || m.image || null })

export function useMemories() {
  const [memories, setMemories] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  // ── Fetch ────────────────────────────────────────────────────────────
  const fetchMemories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/memories')
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error ${res.status}: ${text.substring(0, 50)}`)
      }
      const data = await res.json()
      setMemories(data && data.length > 0 ? data.map(normalize) : staticMemories)
    } catch (err) {
      console.error('[useMemories] fetch error:', err.message)
      setMemories(staticMemories)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMemories() }, [fetchMemories])

  // ── Upload helper ────────────────────────────────────────────────────
  const uploadFile = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    const filename = `foto-${Date.now()}.${ext}`
    const res = await fetch(`/api/upload?filename=${filename}`, {
      method: 'POST',
      body: file,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Subida fallida: ${err.error || res.statusText}`)
    }
    return res.json()
  }

  // ── Update image of existing card ────────────────────────────────────
  const updateImage = useCallback(async (memory, file) => {
    const blob = await uploadFile(file)

    if (memory.created_at) {
      // Registro en DB → PATCH
      const res = await fetch(`/api/memories?id=${memory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: blob.url }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(`Error al guardar: ${err.error || res.statusText}`)
      }
    } else {
      // Memoria estática → crear registro en DB con sus datos + imagen
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: blob.url,
          date: memory.date,
          title: memory.title,
          description: memory.description,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(`Error al guardar: ${err.error || res.statusText}`)
      }
    }

    setMemories(prev => prev.map(m =>
      m.id === memory.id ? { ...m, image: blob.url } : m
    ))
  }, [])

  // ── Add new memory ───────────────────────────────────────────────────
  const addMemory = useCallback(async ({ file, date, title, description }) => {
    const blob = await uploadFile(file)

    const res = await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: blob.url,
        date: date?.trim() || new Date().toLocaleDateString('es-MX', {
          year: 'numeric', month: 'long', day: 'numeric',
        }),
        title,
        description,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Base de datos: ${err.error || res.statusText}`)
    }

    const newMemory = normalize(await res.json())
    setMemories(prev => [...prev, newMemory])
    return newMemory
  }, [])

  return { memories, loading, error, addMemory, updateImage, refetch: fetchMemories }
}

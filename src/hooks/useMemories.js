import { useState, useEffect, useCallback } from 'react'
import { memories as staticMemories } from '../data/memoriesData'

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
      if (!res.ok) throw new Error('Error al obtener los recuerdos')
      const data = await res.json()
      // Si la base de datos está vacía y devuelve [], mostramos también los estáticos, pero mejor los ordenamos.
      // O los reemplazamos completamente, lo ideal es combinar o solo usar la DB si tiene datos.
      if (data && data.length > 0) {
          setMemories(data)
      } else {
          setMemories(staticMemories)
      }
    } catch (err) {
      console.error('[useMemories] fetch error:', err.message)
      // Fallback a los datos locales si falla la DB
      setMemories(staticMemories)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMemories() }, [fetchMemories])

  // ── Add ──────────────────────────────────────────────────────────────
  const addMemory = useCallback(async ({ file, date, title, description }) => {
    // 1. Sube imagen a Vercel Blob
    const ext = file.name.split('.').pop().toLowerCase()
    const filename = `foto-${Date.now()}.${ext}`

    const uploadRes = await fetch(`/api/upload?filename=${filename}`, {
      method: 'POST',
      body: file,
    })

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}))
      throw new Error(`Subida fallida: ${errorData.error || uploadRes.statusText}`)
    }

    const blob = await uploadRes.json()

    // 2. Guarda en la base de datos de Vercel Postgres
    const dbRes = await fetch('/api/memories', {
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

    if (!dbRes.ok) {
      const errorData = await dbRes.json().catch(() => ({}))
      throw new Error(`Base de datos: ${errorData.error || dbRes.statusText}`)
    }

    const newMemory = await dbRes.json()

    // 3. Actualización optimista
    setMemories(prev => [...prev, newMemory])
    return newMemory
  }, [])

  return { memories, loading, error, addMemory, refetch: fetchMemories }
}

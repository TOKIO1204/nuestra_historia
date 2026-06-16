import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  // CORS para desarrollo local con vercel dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET /api/memories → devuelve todos los recuerdos ────────────────
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`
        SELECT * FROM memories ORDER BY created_at ASC
      `
      return res.status(200).json(rows)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // ── POST /api/memories → guarda un nuevo recuerdo ───────────────────
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const { image_url, date, title, description } = body

      if (!image_url || !title || !description) {
        return res.status(400).json({ error: 'image_url, title y description son requeridos' })
      }

      const { rows } = await sql`
        INSERT INTO memories (image_url, date, title, description, accent)
        VALUES (${image_url}, ${date ?? ''}, ${title}, ${description}, '#fed7aa')
        RETURNING *
      `
      return res.status(201).json(rows[0])
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}

import { put } from '@vercel/blob'

// Desactiva el bodyParser para recibir el archivo como stream puro
export const config = {
  api: { bodyParser: false },
  maxDuration: 60,
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const filename = req.query.filename || `foto-${Date.now()}.jpg`

    // El archivo llega como stream directo → sin límite de 4.5 MB
    const blob = await put(`photos/${filename}`, req, {
      access: 'public',
      addRandomSuffix: true,
    })

    return res.status(200).json(blob)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

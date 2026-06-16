import { motion } from 'framer-motion'
import { useMemo } from 'react'

// Función determinista para evitar diferencias entre renders
function s(seed, offset) {
  return (Math.abs(Math.sin(seed * 9301 + offset * 49297 + 233)) % 1)
}

const TOTAL = 24

export default function SunflowerParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        id: i,
        left:     `${3 + s(i, 0) * 94}%`,
        size:     7 + s(i, 1) * 13,           // 7–20 px
        delay:    s(i, 2) * 14,               // 0–14 s
        duration: 16 + s(i, 3) * 16,          // 16–32 s
        opacity:  0.1 + s(i, 4) * 0.28,       // 0.10–0.38
        driftX:   (s(i, 5) - 0.5) * 90,       // -45 a +45 px
        spin:     s(i, 6) > 0.5 ? 360 : -360,
        // 1 de cada 4 es un girasol emoji; el resto son luces circulares
        isFlower: i % 4 === 0,
        // paleta: ámbar / naranja / amarillo girasol
        color: ['#fbbf24', '#f97316', '#fde68a', '#fb923c'][i % 4],
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 select-none"
          style={{ left: p.left }}
          initial={{ y: -50, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: '108vh',
            x: p.driftX,
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: p.spin,
          }}
          transition={{
            duration: p.duration,
            delay:    p.delay,
            repeat:   Infinity,
            ease:     'linear',
          }}
        >
          {p.isFlower ? (
            <span style={{ fontSize: p.size + 6 }}>🌻</span>
          ) : (
            <div
              style={{
                width:           p.size,
                height:          p.size,
                borderRadius:    '50%',
                backgroundColor: p.color,
                filter:          `blur(${p.size > 13 ? 2 : 1}px)`,
                boxShadow:       `0 0 ${p.size * 2}px ${p.color}80`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

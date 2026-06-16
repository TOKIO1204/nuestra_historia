import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const heartList = [
  { char: '♡', size: 'text-2xl', color: 'text-orange-300' },
  { char: '♥', size: 'text-4xl', color: 'text-orange-500' },
  { char: '♡', size: 'text-2xl', color: 'text-orange-300' },
]

export default function Footer({ onAdminOpen }) {
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  // Conteo de clicks para activar el botón admin discreto
  // (5 clicks sobre el crédito abre el modal, así no es obvio)
  const [clickCount, setClickCount] = useState(0)
  const handleCreditClick = () => {
    const next = clickCount + 1
    setClickCount(next)
    if (next >= 5) {
      setClickCount(0)
      onAdminOpen()
    }
  }

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden py-28 px-6"
      style={{
        background:
          'linear-gradient(160deg, #fffbf0 0%, #ffedd5 45%, #fff7ed 70%, #fffbf0 100%)',
      }}
    >
      {/* Glow de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 65%, rgba(249,115,22,0.14) 0%, transparent 75%)',
        }}
      />

      {/* Girasoles decorativos de fondo */}
      {['8%', '92%'].map((left, i) => (
        <motion.span
          key={i}
          className="absolute top-12 text-6xl opacity-10 select-none pointer-events-none"
          style={{ left }}
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 3 }}
        >
          🌻
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        {/* Corazones */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {heartList.map((h, i) => (
            <motion.span
              key={i}
              className={`${h.size} ${h.color}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.18, duration: 0.5, type: 'spring', stiffness: 220 }}
            >
              {h.char}
            </motion.span>
          ))}
        </div>

        {/* Mensaje script */}
        <motion.p
          className="font-script text-3xl md:text-4xl text-orange-600 leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 1 }}
        >
          Gracias por ser exactamente quien eres,<br />
          <span className="text-sunflower-600">Lizbeth.</span>
        </motion.p>

        <motion.div
          className="w-12 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-sunflower-400 mx-auto mb-7"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.9 }}
        />

        {/* Mensaje principal */}
        <motion.p
          className="font-serif text-ink-mid text-base md:text-lg leading-relaxed italic font-light max-w-lg mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.75, duration: 1 }}
        >
          Cada recuerdo contigo es un regalo. Hoy, en tu cumpleaños,
          quiero que sepas que eres la parte más bonita de todos mis días.
          Te amo más de lo que cualquier foto o palabra puede expresar.
        </motion.p>

        {/* Girasol final */}
        <motion.span
          className="block text-5xl"
          initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.95, duration: 0.9, type: 'spring', stiffness: 180 }}
        >
          🌻
        </motion.span>

        {/* Crédito + botón admin oculto */}
        <div className="mt-14 pt-7 border-t border-orange-200/60 flex items-center justify-center gap-3">
          {/* 5 clicks discretos sobre el texto abre el admin */}
          <p
            className="font-sans text-xs text-ink-soft tracking-widest uppercase cursor-default select-none"
            onClick={handleCreditClick}
          >
            Hecho con amor · {new Date().getFullYear()}
          </p>

          {/* Botón 🌻 visible solo para quien sabe que existe */}
          <button
            onClick={onAdminOpen}
            title="Agregar recuerdo"
            className="text-base opacity-20 hover:opacity-70 active:opacity-90 transition-opacity duration-300 select-none"
            aria-label="Abrir panel de administrador"
          >
            🌻
          </button>
        </div>
      </motion.div>
    </footer>
  )
}

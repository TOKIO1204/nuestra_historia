import { motion } from 'framer-motion'

const NAME = 'Lizbeth Loza Mendoza'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } },
}

const fadeUp = {
  hidden:   { opacity: 0, y: 36 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-parchment bg-noise">
      {/* Gradiente radial cálido de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 65% at 50% 45%, rgba(251,146,60,0.12) 0%, rgba(251,191,36,0.08) 55%, transparent 100%)',
        }}
      />

      {/* Contenido principal */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl"
      >
        {/* Ícono decorativo */}
        <motion.div variants={fadeUp} className="text-4xl mb-6 animate-float">
          🌻
        </motion.div>

        {/* Subtítulo script */}
        <motion.p
          variants={fadeUp}
          className="font-script text-orange-500 text-2xl mb-5 tracking-wide"
        >
          Para ti, que iluminas mis días
        </motion.p>

        {/* Título principal */}
        <motion.h1
          variants={fadeUp}
          className="font-serif font-semibold leading-tight text-ink mb-3"
        >
          {/* "Feliz Cumpleaños," en bloque */}
          <span className="block text-4xl md:text-6xl mb-2">
            Feliz{' '}
            <em className="text-gradient-orange not-italic">Cumpleaños</em>,
          </span>

          {/* Nombre letra por letra */}
          <span className="block text-3xl md:text-5xl tracking-wide">
            {NAME.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay:    1.1 + i * 0.055,
                  duration: 0.55,
                  ease:     [0.22, 1, 0.36, 1],
                }}
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Separador naranja */}
        <motion.div
          variants={fadeUp}
          className="w-20 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent my-6 mx-auto"
        />

        {/* Párrafo descriptivo — contraste alto */}
        <motion.p
          variants={fadeUp}
          className="font-sans text-ink-mid text-base md:text-lg font-light leading-relaxed max-w-md"
        >
          Hoy quiero llevarte a través de los momentos que más atesoro.
          Cada foto guarda un pedacito de lo que somos y de todo lo que
          me haces sentir.
        </motion.p>

        {/* Corazón decorativo */}
        <motion.p
          variants={fadeUp}
          className="font-script text-orange-400 text-4xl mt-5"
        >
          ♡
        </motion.p>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
      >
        <span className="font-sans text-xs text-ink-soft tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-orange-300 flex items-start justify-center p-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-orange-400"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import TimelineCard from './TimelineCard'

function SectionHeader() {
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      className="text-center mb-16 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-script text-orange-500 text-2xl block mb-3">
        nuestra historia
      </span>
      <h2 className="font-serif text-3xl md:text-4xl text-ink font-semibold">
        Los momentos que nos definen
      </h2>
      <div className="w-14 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-sunflower-400 mx-auto mt-4" />
    </motion.div>
  )
}

function SkeletonCard({ flip }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-14 px-10 max-w-5xl mx-auto">
      <div className={`${flip ? 'md:order-2' : ''} w-64 aspect-[3/4] bg-orange-100 rounded-sm animate-pulse shrink-0`} />
      <div className={`${flip ? 'md:order-1' : ''} space-y-3 w-full max-w-xs`}>
        <div className="h-4 bg-orange-100 rounded-full animate-pulse w-28" />
        <div className="h-6 bg-orange-100 rounded-full animate-pulse w-44" />
        <div className="h-2 bg-orange-100 rounded-full animate-pulse w-8 my-2" />
        <div className="h-4 bg-orange-100 rounded-full animate-pulse w-full" />
        <div className="h-4 bg-orange-100 rounded-full animate-pulse w-4/5" />
        <div className="h-4 bg-orange-100 rounded-full animate-pulse w-3/5" />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="py-8">
      {[0, 1, 2].map(i => <SkeletonCard key={i} flip={i % 2 !== 0} />)}
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="py-24 text-center px-6">
      <p className="text-5xl mb-5">🌻</p>
      <p className="font-serif text-ink text-xl mb-2">No se pudieron cargar los recuerdos</p>
      <p className="font-sans text-ink-soft text-sm">{message}</p>
      <p className="font-sans text-ink-soft text-sm">
        Revisa tu conexión y las variables de entorno de Vercel
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-24 text-center px-6">
      <motion.p
        className="text-6xl mb-5 block"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🌻
      </motion.p>
      <p className="font-script text-orange-400 text-3xl mb-3">
        Tu historia está por comenzar
      </p>
      <p className="font-sans text-ink-mid text-sm max-w-xs mx-auto leading-relaxed">
        Toca el botón 🌻 en el footer para agregar el primer recuerdo
      </p>
    </div>
  )
}

export default function Timeline({ memories, loading, error }) {
  return (
    <section className="relative py-20">
      {/* Línea vertical naranja */}
      <div className="timeline-line" />

      <SectionHeader />

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && memories.length === 0 && <EmptyState />}

      {!loading && !error && memories.map((memory, index) => (
        <TimelineCard key={memory.id} memory={memory} index={index} />
      ))}

      {/* Sunflower final de la línea */}
      {!loading && (
        <div className="relative flex justify-center mt-4">
          <span className="relative z-10 text-3xl animate-float">🌻</span>
        </div>
      )}
    </section>
  )
}

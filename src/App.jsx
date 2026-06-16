import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SunflowerParticles from './components/SunflowerParticles'
import Hero               from './components/Hero'
import Timeline           from './components/Timeline'
import Footer             from './components/Footer'
import AdminModal         from './components/AdminModal'
import { useMemories }   from './hooks/useMemories'

export default function App() {
  const { memories, loading, error, addMemory } = useMemories()
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <main className="relative min-h-screen bg-parchment">
      {/* Partículas globales — fixed, z-0 */}
      <SunflowerParticles />

      {/* Contenido principal — z-10 */}
      <div className="relative z-10">
        <Hero />
        <Timeline memories={memories} loading={loading} error={error} />
        <Footer onAdminOpen={() => setAdminOpen(true)} />
      </div>

      {/* Modal de administrador — z-50, con AnimatePresence para exit animation */}
      <AnimatePresence>
        {adminOpen && (
          <AdminModal
            onAdd={addMemory}
            onClose={() => setAdminOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

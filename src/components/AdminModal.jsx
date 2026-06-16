import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ADMIN_PIN   = import.meta.env.VITE_ADMIN_PIN
const INITIAL_STEP = ADMIN_PIN ? 'pin' : 'form'

// ── Subcomponentes ────────────────────────────────────────────────────────────

const inputCls =
  'w-full border border-orange-200 rounded-xl px-4 py-3 bg-cream-50 text-ink ' +
  'placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ' +
  'focus:border-orange-400 transition-all font-sans text-sm'

function PinStep({ onVerify }) {
  const [pin, setPin]       = useState('')
  const [wrong, setWrong]   = useState(false)

  const verify = () => {
    if (pin === ADMIN_PIN) { onVerify() }
    else { setWrong(true); setPin('') }
  }

  return (
    <motion.div
      key="pin"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 py-2"
    >
      <p className="font-sans text-ink-mid text-sm text-center">
        Ingresa tu PIN de administrador
      </p>
      <input
        type="password"
        value={pin}
        onChange={e => { setPin(e.target.value); setWrong(false) }}
        onKeyDown={e => e.key === 'Enter' && verify()}
        placeholder="••••••"
        autoFocus
        className={`${inputCls} text-center text-xl tracking-[0.5em] ${wrong ? 'border-red-400 focus:ring-red-300/50' : ''}`}
      />
      <AnimatePresence>
        {wrong && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-xs text-center -mt-2"
          >
            PIN incorrecto, intenta de nuevo
          </motion.p>
        )}
      </AnimatePresence>
      <button
        onClick={verify}
        className="w-full bg-gradient-to-r from-orange-500 to-sunflower-500 hover:from-orange-600 hover:to-sunflower-600 text-white font-sans font-semibold py-3 rounded-xl transition-all shadow-sm"
      >
        Continuar →
      </button>
    </motion.div>
  )
}

function UploadForm({ onSubmit, status, errorMsg }) {
  const fileRef = useRef(null)
  const [file,    setFile]    = useState(null)
  const [preview, setPreview] = useState(null)
  const [form,    setForm]    = useState({ date: '', title: '', description: '' })

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const field = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const canSubmit = file && form.title.trim() && form.description.trim() && status === 'idle'

  return (
    <motion.form
      key="form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={e => { e.preventDefault(); onSubmit({ file, ...form }) }}
      className="space-y-4 py-1"
    >
      {/* ── File picker ─────────────────────── */}
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFile}
        className="hidden"
      />

      {preview ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group"
        >
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
            <p className="text-white font-sans text-sm font-semibold">📷 Cambiar foto</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 active:bg-orange-100 flex flex-col items-center justify-center gap-3 transition-colors"
        >
          <span className="text-5xl">📷</span>
          <p className="font-sans text-orange-500 text-sm font-medium">
            Toca para seleccionar una foto
          </p>
          <p className="font-sans text-ink-soft text-xs">JPG, PNG, HEIC — desde cámara o galería</p>
        </button>
      )}

      {/* ── Campos ──────────────────────────── */}
      <div>
        <label className="block font-sans text-xs text-ink-soft mb-1.5 ml-1">
          Ocasión o fecha <span className="text-orange-400/60">(opcional)</span>
        </label>
        <input
          type="text"
          value={form.date}
          onChange={field('date')}
          placeholder="Ej: Una tarde perfecta…"
          className={inputCls}
        />
      </div>

      <div>
        <label className="block font-sans text-xs text-ink-soft mb-1.5 ml-1">
          Título <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={field('title')}
          placeholder="El momento que más atesoro"
          required
          className={`${inputCls} font-serif`}
        />
      </div>

      <div>
        <label className="block font-sans text-xs text-ink-soft mb-1.5 ml-1">
          Dedicatoria <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={field('description')}
          placeholder="Escribe algo especial para este recuerdo…"
          required
          rows={3}
          className={`${inputCls} resize-none leading-relaxed font-serif`}
        />
      </div>

      {/* ── Error ───────────────────────────── */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 px-3"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Submit ──────────────────────────── */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-gradient-to-r from-orange-500 to-sunflower-500 text-white font-sans font-semibold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
      >
        💛 Guardar Recuerdo
      </button>
    </motion.form>
  )
}

function UploadingState() {
  return (
    <motion.div
      key="uploading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-5 py-10"
    >
      <motion.span
        className="text-6xl block"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        🌻
      </motion.span>
      <p className="font-script text-orange-500 text-2xl">Guardando tu recuerdo…</p>
      <p className="font-sans text-ink-soft text-xs">Subiendo imagen y guardando en la base de datos</p>

      {/* Barra de progreso indeterminada */}
      <div className="w-48 h-1.5 bg-orange-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-orange-400 to-sunflower-400 rounded-full"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

function SuccessState() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-10 text-center"
    >
      <motion.span
        className="text-7xl block"
        initial={{ rotate: -20, scale: 0.5 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        🌻
      </motion.span>
      <p className="font-script text-orange-500 text-3xl">¡Recuerdo guardado!</p>
      <p className="font-sans text-ink-mid text-sm">
        Ya aparece en la línea de tiempo de Lizbeth
      </p>
      <div className="flex gap-1 mt-2">
        {['♡', '♥', '♡'].map((c, i) => (
          <motion.span
            key={i}
            className={`text-${i === 1 ? '2xl' : 'xl'} text-orange-${i === 1 ? '500' : '300'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function AdminModal({ onAdd, onClose }) {
  const [step,     setStep]    = useState(INITIAL_STEP)
  const [status,   setStatus]  = useState('idle')   // idle | uploading | error | success
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = useCallback(async (payload) => {
    setStatus('uploading')
    setErrorMsg('')
    try {
      await onAdd(payload)
      setStatus('success')
      setTimeout(onClose, 2200)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
      // Vuelve a idle para permitir reintento
      setTimeout(() => setStatus('idle'), 100)
    }
  }, [onAdd, onClose])

  const isLocked = status === 'uploading' || status === 'success'

  return (
    // Overlay
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={() => !isLocked && onClose()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full sm:max-w-md bg-cream-100 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle para móvil */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-orange-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-sunflower-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="font-script text-white text-2xl leading-tight">Nuevo Recuerdo</p>
            <p className="font-sans text-white/80 text-xs mt-0.5">para Lizbeth Loza Mendoza</p>
          </div>
          <span className="text-4xl">🌻</span>
        </div>

        {/* Cuerpo scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 'pin' && (
              <PinStep key="pin" onVerify={() => setStep('form')} />
            )}

            {step === 'form' && status !== 'uploading' && status !== 'success' && (
              <UploadForm
                key="form"
                onSubmit={handleSubmit}
                status={status}
                errorMsg={errorMsg}
              />
            )}

            {status === 'uploading' && <UploadingState key="uploading" />}
            {status === 'success'   && <SuccessState   key="success"   />}
          </AnimatePresence>
        </div>

        {/* Botón cerrar — solo cuando no está procesando */}
        <AnimatePresence>
          {!isLocked && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center text-white text-lg font-light transition-colors"
              aria-label="Cerrar"
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

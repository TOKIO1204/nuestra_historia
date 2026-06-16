import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const PhotoPlaceholder = ({ accent, title, onClick, uploading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={uploading}
    className="w-full h-full flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed border-orange-300 transition-all hover:border-orange-400 hover:brightness-95 active:scale-95 disabled:cursor-wait"
    style={{ background: `${accent}40` }}
  >
    {uploading ? (
      <>
        <motion.span
          className="text-4xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          🌻
        </motion.span>
        <p className="font-sans text-xs text-ink-mid text-center px-4">
          Subiendo foto…
        </p>
      </>
    ) : (
      <>
        <span className="text-4xl opacity-60">📷</span>
        <p className="font-sans text-xs text-ink-mid text-center px-4 leading-relaxed font-medium">
          {title}
        </p>
        <span className="font-sans text-xs text-orange-500 font-semibold underline underline-offset-2">
          Toca para agregar tu foto
        </span>
      </>
    )}
  </button>
)

const TextContent = ({ memory, align }) => (
  <div className={`max-w-xs ${align === 'right' ? 'text-right' : 'text-left'}`}>
    <span className="font-script text-orange-500 text-xl block mb-1">
      {memory.date}
    </span>

    <h3 className="font-serif text-ink text-xl md:text-2xl font-semibold leading-snug mb-2">
      {memory.title}
    </h3>

    <div
      className={`w-8 h-0.5 bg-orange-400 mb-3 ${align === 'right' ? 'ml-auto' : ''}`}
    />

    <p className="font-serif text-ink-mid text-base md:text-lg leading-relaxed italic">
      "{memory.description}"
    </p>
  </div>
)

export default function TimelineCard({ memory, index, onImageUpload }) {
  const ref        = useRef(null)
  const fileRef    = useRef(null)
  const isInView   = useInView(ref, { once: true, margin: '-80px 0px' })
  const isLeft     = index % 2 === 0
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return
    setUploading(true)
    try {
      await onImageUpload(memory, file)
    } catch (err) {
      console.error('Error subiendo foto:', err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const photoVariant = {
    hidden: {
      opacity: 0,
      x:       isLeft ? -70 : 70,
      rotate:  isLeft ? -3 : 3,
    },
    visible: {
      opacity: 1,
      x:       0,
      rotate:  0,
      transition: {
        type:      'spring',
        stiffness: 110,
        damping:   14,
        mass:      0.9,
        delay:     0.05,
      },
    },
  }

  const textVariant = {
    hidden:  { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y:       0,
      transition: { duration: 0.65, delay: 0.28, ease: 'easeOut' },
    },
  }

  const PhotoCard = (
    <motion.div
      variants={photoVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="polaroid w-64 md:w-72 aspect-[3/4] relative cursor-pointer"
      whileHover={{
        scale:      1.04,
        rotate:     isLeft ? 1.5 : -1.5,
        transition: { duration: 0.3 },
      }}
    >
      {memory.image ? (
        <img
          src={memory.image}
          alt={memory.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <PhotoPlaceholder
            accent={memory.accent || '#fed7aa'}
            title={memory.title}
            onClick={() => fileRef.current?.click()}
            uploading={uploading}
          />
        </>
      )}
      <p className="absolute bottom-2 left-0 right-0 text-center text-xs font-sans text-ink-soft tracking-wide">
        {memory.date}
      </p>
    </motion.div>
  )

  const TextBlock = (
    <motion.div
      variants={textVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <TextContent memory={memory} align={isLeft ? 'left' : 'right'} />
    </motion.div>
  )

  return (
    <div ref={ref} className="relative flex items-center justify-center w-full py-16 md:py-20">
      <motion.div
        className="timeline-dot top-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.05 }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center w-full max-w-5xl px-6 md:px-10 gap-8 md:gap-0">
        <div
          className={`flex ${
            isLeft
              ? 'md:justify-end md:pr-14'
              : 'md:justify-end md:pr-14 md:order-3'
          }`}
        >
          {isLeft ? PhotoCard : TextBlock}
        </div>

        <div className="hidden md:block w-4" />

        <div
          className={`flex ${
            isLeft
              ? 'md:justify-start md:pl-14'
              : 'md:justify-start md:pl-14 md:order-1'
          }`}
        >
          {isLeft ? TextBlock : PhotoCard}
        </div>
      </div>
    </div>
  )
}

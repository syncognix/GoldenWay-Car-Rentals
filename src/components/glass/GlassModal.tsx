import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useSmoothScroll } from '../../providers/scroll-context'
import { Icon } from '../ui/Icon'
import './GlassModal.css'

type Props = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  /** Optional keyboard navigation (←/→) for galleries. */
  onPrev?: () => void
  onNext?: () => void
}

/** Accessible glass dialog: focus trap, Esc to close, scroll lock, focus restore. */
export function GlassModal({ open, onClose, label, children, onPrev, onNext }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { lock, unlock } = useSmoothScroll()
  // Latest handlers, so the open/close effect only depends on `open`.
  const handlers = useRef({ onClose, onPrev, onNext })
  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext }
  })

  useEffect(() => {
    if (!open) return
    lock()
    const prev = document.activeElement as HTMLElement | null
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlers.current.onClose()
      if (e.key === 'ArrowLeft') handlers.current.onPrev?.()
      if (e.key === 'ArrowRight') handlers.current.onNext?.()
      if (e.key === 'Tab' && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, a[href]'))
        if (!f.length) return
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
      prev?.focus?.()
    }
  }, [open, lock, unlock])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="glass-modal surface-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="glass-modal__dialog"
            initial={{ y: 30, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ y: 20, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-modal__bar">
              {onPrev && (
                <button type="button" className="glass-modal__btn" onClick={onPrev} aria-label="Previous">
                  <Icon name="arrowLeft" />
                </button>
              )}
              {onNext && (
                <button type="button" className="glass-modal__btn" onClick={onNext} aria-label="Next">
                  <Icon name="arrowRight" />
                </button>
              )}
              <button type="button" className="glass-modal__btn" onClick={onClose} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

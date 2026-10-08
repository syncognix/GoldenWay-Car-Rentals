import { useState, type ReactNode } from 'react'
import './SmartImage.css'

type Props = {
  src?: string
  alt: string
  /** Rendered if the image is missing or fails to load. */
  fallback: ReactNode
  className?: string
  priority?: boolean
}

/** Image that fades in once decoded and degrades to a designed fallback. */
export function SmartImage(props: Props) {
  // Re-mount per source so load state never leaks between images.
  return <SmartImageInner key={props.src ?? 'none'} {...props} />
}

function SmartImageInner({ src, alt, fallback, className, priority }: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')

  if (!src || state === 'error') return <div className={`smart-image smart-image--fallback ${className ?? ''}`}>{fallback}</div>

  return (
    <div className={`smart-image ${state === 'loaded' ? 'is-loaded' : ''} ${className ?? ''}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
      />
    </div>
  )
}

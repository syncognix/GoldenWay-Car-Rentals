import { useRef, type ComponentPropsWithoutRef, type ReactNode, type PointerEvent, type Ref } from 'react'
import { Link } from 'react-router'
import { Icon, type IconName } from './Icon'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import './Button.css'

type Variant = 'primary' | 'glass' | 'outline' | 'text'
type Size = 'sm' | 'md' | 'lg'

type Common = {
  variant?: Variant
  size?: Size
  icon?: IconName | null
  leadingIcon?: IconName
  magnetic?: boolean
  block?: boolean
  className?: string
  children: ReactNode
}

type AsLink = Common & { to: string; href?: never } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'className'>
type AsAnchor = Common & { href: string; to?: never } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'className'>
type AsButton = Common & { to?: never; href?: never } & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>

export type ButtonProps = AsLink | AsAnchor | AsButton

/**
 * Premium button system.
 *  primary — champagne (dark) / ink (light) with a light sweep
 *  glass   — frosted, for use over imagery
 *  outline — hairline border
 *  text    — label + travelling arrow
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon = 'arrowRight',
    leadingIcon,
    magnetic = false,
    block = false,
    className,
    children,
    ...rest
  } = props
  const ref = useRef<HTMLElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const isMagnetic = magnetic && fine && !reduced

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) / r.width
    const y = (e.clientY - r.top - r.height / 2) / r.height
    el.style.setProperty('--mx', `${x * 10}px`)
    el.style.setProperty('--my', `${y * 8}px`)
  }
  const onLeave = () => {
    ref.current?.style.setProperty('--mx', '0px')
    ref.current?.style.setProperty('--my', '0px')
  }

  const cls = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', isMagnetic && 'btn--magnetic', className]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      <span className="btn__sweep" aria-hidden="true" />
      {leadingIcon && <Icon name={leadingIcon} className="btn__lead" size={size === 'sm' ? 15 : 17} />}
      <span className="btn__label">{children}</span>
      {icon && (
        <span className="btn__icon" aria-hidden="true">
          <Icon name={icon} size={size === 'sm' ? 14 : 16} />
          <Icon name={icon} size={size === 'sm' ? 14 : 16} />
        </span>
      )}
    </>
  )

  const handlers = isMagnetic ? { onPointerMove: onMove, onPointerLeave: onLeave } : {}

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...anchorRest } = rest as AsLink
    return (
      <Link ref={ref as Ref<HTMLAnchorElement>} to={to} className={cls} {...anchorRest} {...handlers}>
        {inner}
      </Link>
    )
  }
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AsAnchor
    const external = /^https?:/.test(href)
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchorRest}
        {...handlers}
      >
        {inner}
      </a>
    )
  }
  const { type = 'button', ...buttonRest } = rest as AsButton
  return (
    <button ref={ref as Ref<HTMLButtonElement>} type={type} className={cls} {...buttonRest} {...handlers}>
      {inner}
    </button>
  )
}

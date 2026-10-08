import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Icon } from '../ui/Icon'
import './Field.css'

type Base = {
  label: string
  error?: string
  hint?: ReactNode
  className?: string
  /** Compact glass styling for use over imagery. */
  tone?: 'default' | 'glass'
}

function Wrapper({
  id,
  label,
  error,
  hint,
  className,
  tone = 'default',
  required,
  children,
}: Base & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={`field field--${tone} ${error ? 'has-error' : ''} ${className ?? ''}`}>
      <label htmlFor={id} className="field__label t-mono">
        {label}
        {required && (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          <Icon name="alert" size={13} /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined

export function TextField({ label, error, hint, className, tone, ...input }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className} tone={tone} required={input.required}>
      <input id={id} className="field__control" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)} {...input} />
    </Wrapper>
  )
}

export function TextAreaField({ label, error, hint, className, tone, ...input }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className} tone={tone} required={input.required}>
      <textarea
        id={id}
        className="field__control field__control--area"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
      />
    </Wrapper>
  )
}

export function SelectField({
  label,
  error,
  hint,
  className,
  tone,
  children,
  ...select
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} className={className} tone={tone} required={select.required}>
      <div className="field__select">
        <select id={id} className="field__control" aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error, hint)} {...select}>
          {children}
        </select>
        <Icon name="chevronDown" size={16} className="field__chevron" />
      </div>
    </Wrapper>
  )
}

type CheckProps = { label: ReactNode; error?: string; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function CheckField({ label, error, className, ...input }: CheckProps) {
  const id = useId()
  return (
    <div className={`check ${error ? 'has-error' : ''} ${className ?? ''}`}>
      <input id={id} type="checkbox" className="check__input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...input} />
      <label htmlFor={id} className="check__label">
        <span className="check__box" aria-hidden="true">
          <Icon name="check" size={13} />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="field__error" role="alert">
          <Icon name="alert" size={13} /> {error}
        </p>
      )}
    </div>
  )
}

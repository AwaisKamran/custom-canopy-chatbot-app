'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  containerClassName?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, className, error, containerClassName, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    return (
      <div className={containerClassName}>
        <label
          htmlFor={id}
          className="mb-3 mt-5 block text-xs font-medium text-muted-foreground"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              error && !isFocused
                ? 'border-red-500 focus-visible:ring-red-500'
                : '',
              className
            )}
            {...props}
          />
          {error && !isFocused && (
            <span className="text-red-500 text-xs mt-1 block">{error}</span>
          )}
        </div>
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export { InputField }

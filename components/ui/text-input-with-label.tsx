'use client'

import React, { useEffect, useState } from 'react'

type TextInputWithLabelProps = {
  label: string | React.ReactNode
  value: string
  error?: string
  onChange: (value: string) => void
  type?: string
  [key: string]: any
}

const TextInputWithLabel = ({
  label,
  value,
  error,
  onChange,
  type,
  ...rest
}: TextInputWithLabelProps) => {
  const [text, setText] = useState(value)

  function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '')

    const length = digits.length
    if (length === 0) return ''
    if (length < 4) return digits
    if (length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (type === 'tel') {
      newValue = formatPhoneNumber(newValue)
    }

    setText(newValue)
    onChange(newValue)
  }

  useEffect(() => {
    setText(value)
  }, [value])

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
        <label
          htmlFor="text-input"
          className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700 min-w-[20%] w-fit"
        >
          {label}
        </label>
        <input
          id="text-input"
          type="text"
          value={text}
          onChange={handleChange}
          className={`w-full px-4 py-2 text-base text-gray-800 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500 focus:border-red-500 border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
          {...rest}
        />
      </div>
    </div>
  )
}

export default TextInputWithLabel

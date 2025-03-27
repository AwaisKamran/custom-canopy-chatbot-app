'use client'

import React, { useState } from 'react'

type TextInputWithLabelProps = {
  label: string
  value: string
  onChange: (value: string) => void
  [key: string]: any
}

const TextInputWithLabel = ({
  label,
  value,
  onChange,
  ...rest
}: TextInputWithLabelProps) => {
  const [text, setText] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setText(newValue)
    onChange(newValue)
  }

  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <label
        htmlFor="text-input"
        className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700 min-w-[20%]"
      >
        {label}
      </label>
      <input
        id="text-input"
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Enter something..."
        className={`w-full px-4 py-2 text-base text-gray-800 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 error:border-red-500`}
        {...rest}
      />
    </div>
  )
}

export default TextInputWithLabel

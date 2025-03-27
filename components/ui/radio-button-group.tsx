import React, { useState } from 'react'
import clsx from 'clsx'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { EditableOption } from '@/lib/types'

interface RadioOptionProps {
  options: EditableOption[]
  onSelect: (options: EditableOption[]) => void
  onEdit?: (option: EditableOption) => void
  disabled: boolean
  isMultiSelect?: boolean
}

export const RadioButtonGroup = ({
  options,
  onSelect,
  onEdit,
  disabled,
  isMultiSelect = false
}: RadioOptionProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Array<EditableOption>>(
    options || []
  )

  const updateSelections = (option: EditableOption) => {
    if (isMultiSelect) {
      return selectedOptions.map((item: EditableOption) =>
        item.value === option.value
          ? { ...item, selected: !item.selected }
          : item
      )
    } else {
      return [...options, { ...option, selected: true }]
    }
  }

  const handleSelect = (option: EditableOption) => {
    const updatedSelections = updateSelections(option)
    setSelectedOptions(updatedSelections)
    if (!isMultiSelect) {
      onSelect(updatedSelections)
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <div className="grid grid-cols-2 gap-2 w-full self-start">
        {options.map((option, index) => (
          <div key={option.value} className="relative w-full">
            <button
              key={option.value}
              type="button"
              className={clsx(
                'py-2 px-4 mb-2 w-full rounded-md text-zinc-600 dark:text-white flex-auto whitespace-nowrap border-0.5 border-neutral-400 disabled:opacity-50 disabled:pointer-events-none',
                selectedOptions[index]?.selected
                  ? 'bg-slate-400 dark:bg-cyan-800'
                  : 'bg-slate-200 dark:bg-slate-400'
              )}
              onClick={() => handleSelect(option)}
              disabled={disabled}
            >
              {option.name}
            </button>
            {option.edit && options[index]?.selected && onEdit && (
              <button
                className="absolute -top-1.5 -right-1.5 w-5 h-5 p-0.5 text text-slate-400 border-0.5 border-slate-400 bg-slate-400 dark:bg-cyan-800 rounded-full flex whitespace-nowrap items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                onClick={e => {
                  e.stopPropagation()
                  onEdit(option)
                }}
                disabled={disabled}
              >
                <Pencil1Icon fillOpacity={1} fill="#ffffff" />
              </button>
            )}
          </div>
        ))}
      </div>
      {isMultiSelect && (
        <button
          className="w-full py-2 mb-2 rounded-md text-zinc-600 dark:text-white flex-auto whitespace-nowrap border-0.5 border-neutral-400 bg-slate-400 dark:bg-cyan-800 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => onSelect(selectedOptions)}
          disabled={
            disabled ||
            selectedOptions.every(
              (option: any, index: number) =>
                option.selected === options[index].selected
            )
          }
        >
          Okay
        </button>
      )}
    </div>
  )
}

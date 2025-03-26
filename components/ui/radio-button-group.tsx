import React, { useState } from 'react'
import clsx from 'clsx'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { EditableOption } from '@/lib/types'

interface RadioOptionProps {
  options: EditableOption[]
  onSelect: (options: EditableOption[]) => void
  onEdit: (option: EditableOption) => void
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

  const handleSelect = (option: string) => {
    const updatedSelections = selectedOptions.map(
      (item: EditableOption) => {
        return item.value === option
          ? { ...item, selected: !item.selected }
          : item
      }
    )
    setSelectedOptions(updatedSelections)
    if (!isMultiSelect) {
      onSelect(updatedSelections)
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <div className="grid grid-cols-2 gap-2 w-full self-start">
        {selectedOptions.map(option => (
          <button
            key={option.value}
            type="button"
            className={clsx(
              'relative py-2 px-4 mb-2 rounded-md text-zinc-600 dark:text-white flex-auto whitespace-nowrap border-0.5 border-neutral-400 disabled:opacity-50 disabled:pointer-events-none',
              option.selected
                ? 'bg-slate-400 dark:bg-cyan-800'
                : 'bg-slate-200 dark:bg-slate-400'
            )}
            onClick={() => handleSelect(option.value)}
            disabled={disabled}
          >
            {option.name}
            {option.edit && (
              <button
                className="absolute -top-1.5 -right-1.5 w-5 h-5 p-0.5 text text-slate-400 border-0.5 border-slate-400 bg-slate-400 dark:bg-cyan-800 rounded-full flex items-center justify-center"
                onClick={e => {
                  e.stopPropagation()
                  onEdit(option)
                }}
              >
                <Pencil1Icon fillOpacity={1} fill="#ffffff" />
              </button>
            )}
          </button>
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

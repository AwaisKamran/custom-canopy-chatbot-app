import React, { useState } from 'react'
import clsx from 'clsx'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { EditableOption } from '@/lib/types'
import { useAIState } from 'ai/rsc'

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
  const [aiState, _] = useAIState()

  const updateSelections = (option: EditableOption) => {
    if (isMultiSelect) {
      return selectedOptions.map((item: EditableOption) =>
        item.value === option.value
          ? { ...item, selected: !item.selected }
          : item
      )
    } else {
      return options.map((item: EditableOption) =>
        item.value === option.value
          ? { ...item, selected: true }
          : { ...item, selected: false }
      )
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
        {options?.map((option, index) => (
          <div key={option.value} className="relative w-full">
            <button
              key={option.value}
              type="button"
              className={clsx(
                'chat-button',
                selectedOptions[index]?.selected
                  ? ''
                  : 'bg-button text-button-foreground'
              )}
              onClick={() => handleSelect(option)}
              disabled={disabled}
            >
              {option.name}
            </button>
            {option.edit && options[index]?.selected && onEdit && (
              <button
                className={clsx(
                  'absolute -top-1.5 -right-1.5 w-5 h-5 p-0.5 chat-button rounded-full',
                  selectedOptions[index]?.selected
                    ? ''
                    : 'bg-button text-button-foreground'
                )}
                onClick={e => {
                  e.stopPropagation()
                  onEdit(option)
                }}
                disabled={disabled}
              >
                <Pencil1Icon
                  fillOpacity={1}
                  className="fill-neutral-900 dark:fill-neutral-100"
                />
              </button>
            )}
          </div>
        ))}
      </div>
      {isMultiSelect && (
        <button
          className="chat-button"
          onClick={() => onSelect(selectedOptions)}
          disabled={
            disabled ||
            selectedOptions.every(
              (option: any, index: number) =>
                option.selected === options[index].selected
            ) ||
            aiState.loading
          }
        >
          Okay
        </button>
      )}
    </div>
  )
}

import clsx from 'clsx'

interface RadioOptionProps {
  options: { name: string; value: string }[]
  selectedOption: string
  onSelect: (option: string) => void
  disabled: boolean
}

export const RadioButtonGroup = ({
  options,
  selectedOption,
  onSelect,
  disabled
}: RadioOptionProps) => {
  return (
    <div className="flex justify-between w-full">
      {options.map(option => (
        <button
          key={option.value}
          className={clsx(
            'py-2 rounded-md dark:text-white w-full mx-1 disabled:cursor-not-allowed border-0.5 border-neutral-400',
            selectedOption === option.value
              ? 'bg-slate-400 text-white dark:bg-cyan-800'
              : 'bg-slate-200 text-zinc-600 dark:bg-slate-400'
          )}
          onClick={() => onSelect(option.value)}
          disabled={disabled}
        >
          {option.name}
        </button>
      ))}
    </div>
  )
}

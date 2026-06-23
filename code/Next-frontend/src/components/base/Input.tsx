import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      type = 'text',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-2.5 rounded-lg
              bg-white
              border border-gray-300
              text-slate-900
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors
              ${error ? 'border-red-500' : ''}
              ${icon ? 'pl-10' : ''}
              ${className}
            `}
            {...props}
          />

          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
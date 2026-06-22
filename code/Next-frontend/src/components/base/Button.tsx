import React from 'react'
import { SpinnerIcon } from '../icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // 🎨 Các style cho từng variant
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-900',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-500/80 active:bg-secondary-500/60',
    ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  }

  // 📏 Các size padding
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // 🔄 Spinner Loading
  const LoadingSpinner = () => (
    <SpinnerIcon className="animate-spin h-5 w-5" />
  )

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  )
}

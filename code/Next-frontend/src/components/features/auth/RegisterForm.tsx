'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { registerSchema, type RegisterFormData } from '@/schemas/auth'
import Input from '@/components/base/Input'
import Button from '@/components/base/Button'
import { UI_TEXT } from '@/constants/ui-text'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  isLoading?: boolean
}

export default function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 🔄 Form submit handler
  const handleFormSubmit = async (data: RegisterFormData) => {
    console.log('DATA:', data)

    try {
      setErrorMessage('')
      setSuccessMessage('')
      await onSubmit(data)
      setSuccessMessage(UI_TEXT.AUTH.REGISTER.SUCCESS_MSG)
      setTimeout(() => { router.push('/login') }, 1500)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : UI_TEXT.AUTH.REGISTER.ERROR_MSG
      )
    }
  }
  console.log('ERRORS:', errors)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* ✅ Success Alert */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-500 text-green-500 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">✅</span>
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* ⚠️ Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-500 text-red-500 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* 👤 Full Name Input */}
      <Input
        label={UI_TEXT.AUTH.REGISTER.FULL_NAME_LABEL}
        placeholder={UI_TEXT.AUTH.REGISTER.FULL_NAME_PLACEHOLDER}
        type="text"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      {/* 📱 Phone Number Input */}
      <Input
        label={UI_TEXT.AUTH.REGISTER.PHONE_LABEL}
        placeholder={UI_TEXT.AUTH.REGISTER.PHONE_PLACEHOLDER}
        type="tel"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      {/* 📧 Email Input */}
      <Input
        label={UI_TEXT.AUTH.REGISTER.EMAIL_LABEL}
        placeholder={UI_TEXT.AUTH.REGISTER.EMAIL_PLACEHOLDER}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 🔐 Password Input */}
      <Input
        label={UI_TEXT.AUTH.REGISTER.PASSWORD_LABEL}
        placeholder={UI_TEXT.AUTH.REGISTER.PASSWORD_PLACEHOLDER}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 🔐 Confirm Password Input */}
      <Input
        label={UI_TEXT.AUTH.REGISTER.CONFIRM_PASSWORD_LABEL}
        placeholder={UI_TEXT.AUTH.REGISTER.PASSWORD_PLACEHOLDER}
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* 🔘 Submit Button */}
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? UI_TEXT.AUTH.REGISTER.LOADING_BTN : UI_TEXT.AUTH.REGISTER.SUBMIT_BTN}
      </Button>

      {/* 📝 Login Link */}
      <div className="text-center text-sm text-gray-600">
        {UI_TEXT.AUTH.REGISTER.ALREADY_HAVE_ACCOUNT}{' '}
        <Link
          href="/login"
          className="text-primary-500 hover:text-primary-700 font-medium"
        >
          {UI_TEXT.AUTH.REGISTER.LOGIN_LINK}
        </Link>
      </div>
    </form>
  )
}
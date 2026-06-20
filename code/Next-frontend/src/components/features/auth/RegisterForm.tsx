'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { registerSchema, type RegisterFormData } from '@/schemas/auth'
import Input from '@/components/base/Input'
import Button from '@/components/base/Button'

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
    setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.')
      setTimeout(() => {        router.push('/login')     }, 1500)
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : 'Đăng ký thất bại. Vui lòng thử lại.'
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
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        type="text"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      {/* 📱 Phone Number Input */}
      <Input
        label="Số điện thoại"
        placeholder="0901234567"
        type="tel"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      {/* 📧 Email Input */}
      <Input
        label="Email Address"
        placeholder="name@example.com"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* 🔐 Password Input */}
      <Input
        label="Password"
        placeholder="••••••••"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 🔐 Confirm Password Input */}
      <Input
        label="Confirm Password"
        placeholder="••••••••"
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
        {isLoading ? 'Đang đăng ký...' : 'Continue →'}
      </Button>

      {/* 📝 Login Link */}
      <div className="text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link
          href="/login"
          className="text-primary-500 hover:text-primary-700 font-medium"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  )
}
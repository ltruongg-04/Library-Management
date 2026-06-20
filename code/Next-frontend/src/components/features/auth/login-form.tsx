"use client";

import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { useState } from "react";

import { BaseButton } from "@/components/base/base-button";
import { BaseInput } from "@/components/base/base-input";

export function LoginForm() {
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [errors, setErrors] = useState<{ email?: string; password?: string }>(
 {}
 );

 function validate() {
 const next: typeof errors = {};
 if (!email) next.email = "Email không được để trống.";
 else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
 next.email = "Email không hợp lệ.";
 if (!password) next.password = "Mật khẩu không được để trống.";
 else if (password.length < 6)
 next.password = "Mật khẩu phải có ít nhất 6 ký tự.";
 return next;
 }

 async function handleSubmit() {
 const next = validate();
 if (Object.keys(next).length) {
 setErrors(next);
 return;
 }
 setErrors({});
 setIsLoading(true);
 try {
 // TODO: replace with real auth call
 await new Promise((r) => setTimeout(r, 1000));
 } finally {
 setIsLoading(false);
 }
 }

 return (
 <div className="w-full max-w-md animate-slide-up">
 {/* Heading */}
 <div className="mb-8">
 <h1 className="text-4xl font-semibold text-on-surface ">
 Welcome back
 </h1>
 <p className="mt-2 text-sm text-on-surface-variant ">
 Sign in to access your curated collections and AI assistant.
 </p>
 </div>

 {/* Form fields */}
 <div className="space-y-5">
 <BaseInput
 label="Email Address"
 type="email"
 placeholder="scholar@lumina.edu"
 autoComplete="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 error={errors.email}
 leadingIcon={<Mail size={16} strokeWidth={1.5} />}
 />

 <div className="space-y-1.5">
 <BaseInput
 label="Password"
 type={showPassword ? "text" : "password"}
 placeholder="••••••••"
 autoComplete="current-password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 error={errors.password}
 leadingIcon={<Lock size={16} strokeWidth={1.5} />}
 trailingIcon={
 <button
 type="button"
 onClick={() => setShowPassword((v) => !v)}
 className="text-outline hover:text-on-surface transition-colors focus:outline-none"
 aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
 >
 {showPassword ? (
 <EyeOff size={16} strokeWidth={1.5} />
 ) : (
 <Eye size={16} strokeWidth={1.5} />
 )}
 </button>
 }
 />

 <div className="flex justify-end">
 <Link
 href="/forgot-password"
 className="text-xs text-secondary-500 hover:text-primary-700 transition-colors"
 >
 Forgot password?
 </Link>
 </div>
 </div>

 <BaseButton isLoading={isLoading} onClick={handleSubmit}>
 <span>Sign In</span>
 <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
 </BaseButton>
 </div>

 {/* Divider */}
 <div className="my-8 flex items-center gap-4">
 <div className="h-px flex-1 bg-surface-container-high " />
 <span className="text-xs uppercase tracking-wider text-outline font-mono">
 Or continue with
 </span>
 <div className="h-px flex-1 bg-surface-container-high " />
 </div>

 {/* Social logins */}
 <div className="grid grid-cols-2 gap-4">
 <button
 type="button"
 className="inline-flex h-12 items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
 >
 <GoogleIcon />
 Google
 </button>

 <button
 type="button"
 className="inline-flex h-12 items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-lowest text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
 >
 <AppleIcon />
 Apple
 </button>
 </div>

 {/* Sign up */}
 <p className="mt-8 text-center text-sm text-on-surface-variant ">
 Don&apos;t have an account?{" "}
 <Link
 href="/register"
 className="font-semibold text-primary-500 underline underline-offset-4 decoration-primary-100 hover:text-primary-700 transition-colors"
 >
 Sign up here
 </Link>
 </p>
 </div>
 );
}

function GoogleIcon() {
 return (
 <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
 <path
 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 fill="#4285F4"
 />
 <path
 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
 fill="#34A853"
 />
 <path
 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
 fill="#FBBC05"
 />
 <path
 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
 fill="#EA4335"
 />
 </svg>
 );
}

function AppleIcon() {
 return (
 <svg
 className="h-5 w-5 text-on-surface "
 fill="currentColor"
 viewBox="0 0 24 24"
 aria-hidden="true"
 >
 <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.89-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-1.736 6.32-5.505 6.32-.876 0-1.214-.23-2.316-.23-1.1 0-1.554.26-2.368.26-3.856 0-5.834-6.42-5.834-6.42s-1.042-2.73-1.042-5.46c0-3.32 2.083-5.22 4.14-5.22 1.666 0 2.617.9 3.435.9.827 0 2.222-1.14 4.01-1.14 1.83 0 3.325.86 4.095 2.15-3.567 1.82-2.983 6.64.496 7.85-.09.31-.63 1.05-1.11 1.99z" />
 </svg>
 );
}
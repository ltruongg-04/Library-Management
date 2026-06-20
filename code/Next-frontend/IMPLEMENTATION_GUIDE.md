📋 FILE STRUCTURE - HƯỚNG DẪN THIẾT KẾ TRANG ĐĂNG NHẬP

## 📂 Cấu trúc Files cần tạo:

### 1️⃣ THIẾT LẬP THEME & CONFIG

```
tailwind.config.ts
├─ TODO: Thêm color palette
   ├─ primary (Deep Indigo: #2e3192)
   ├─ secondary (Electric Blue: #00658d)
   └─ error (Red: #ba1a1a)
```

### 2️⃣ VALIDATION SCHEMA

```
src/schemas/auth.ts
├─ TODO: Import zod
├─ TODO: Tạo loginSchema với:
│  ├─ email (required, valid format)
│  ├─ password (required, min 6 chars)
│  └─ rememberMe (optional boolean)
└─ TODO: Export type LoginFormData
```

### 3️⃣ BASE COMPONENTS (Reusable UI)

```
src/components/base/
├─ Button.tsx
│  ├─ Props: variant, size, isLoading, fullWidth
│  ├─ Variants: primary, secondary, ghost
│  └─ Sizes: sm, md, lg
├─ Input.tsx
│  ├─ Props: label, error, helperText, icon
│  └─ Styles: border, focus ring, error state
├─ Checkbox.tsx
│  ├─ Props: label, checked, onChange
│  └─ Color: #2e3192
└─ Card.tsx
   ├─ Card: wrapper component
   ├─ CardHeader: header section
   ├─ CardContent: main content
   └─ CardFooter: footer section
```

### 4️⃣ AUTH LOGIC

```
src/services/auth.ts
├─ TODO: Tạo authService object với functions:
│  ├─ login(email, password): fetch POST /api/auth/login
│  ├─ logout(): clear localStorage
│  ├─ getToken(): get token từ localStorage
│  └─ saveToken(token): save vào localStorage
└─ Handle API responses & errors
```

### 5️⃣ STATE MANAGEMENT

```
src/providers/auth.tsx
├─ TODO: Tạo AuthContext
├─ TODO: Tạo AuthProvider component
│  ├─ State: user, isLoading, isAuthenticated
│  ├─ Functions: login(), logout()
│  └─ Wrap app với provider
└─ TODO: Export useAuth hook
   └─ Access context values
```

### 6️⃣ FORM COMPONENT

```
src/components/features/LoginForm.tsx
├─ TODO: Setup useForm (react-hook-form)
├─ TODO: Validation: zodResolver(loginSchema)
├─ TODO: Render:
│  ├─ Email input
│  ├─ Password input
│  ├─ Remember me checkbox
│  ├─ Forgot password link
│  ├─ Submit button
│  ├─ Sign up link
│  └─ Error alert
└─ Props: onSubmit, isLoading
```

### 7️⃣ PAGE LAYOUT

```
src/components/features/LoginPage.tsx
├─ TODO: Gradient background
│  └─ from-[#e1e0ff] via-white to-[#c6e7ff]
├─ TODO: Decorative circles (blurred)
├─ TODO: Logo section
│  ├─ Logo icon
│  ├─ Brand name
│  └─ Subtitle
├─ TODO: Card wrapper
│  └─ LoginForm component
└─ TODO: Footer text
```

### 8️⃣ ROUTES

```
src/app/
├─ layout.tsx
│  ├─ TODO: Wrap AuthProvider
│  ├─ TODO: Import global CSS
│  └─ TODO: Setup lang="vi"
├─ globals.css
│  ├─ TODO: @tailwind directives
│  └─ TODO: Reset styles
└─ auth/login/
   └─ page.tsx
      ├─ TODO: Get useAuth
      ├─ TODO: Check isAuthenticated
      ├─ TODO: Handle login
      └─ TODO: Redirect on success
```

---

## 🎯 PRIORITY - Thứ tự tạo files:

1. `tailwind.config.ts` - Setup colors
2. `src/schemas/auth.ts` - Define validation
3. `src/components/base/*` - Base components
4. `src/services/auth.ts` - API logic
5. `src/providers/auth.tsx` - State management
6. `src/components/features/LoginForm.tsx` - Form
7. `src/components/features/LoginPage.tsx` - Page layout
8. `src/app/layout.tsx` - Root layout
9. `src/app/globals.css` - Global styles
10. `src/app/auth/login/page.tsx` - Login route

---

## 💡 TECHNOLOGY STACK:

- **React**: UI library
- **Next.js**: Framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Hook Form**: Form management
- **Zod**: Validation
- **React Context**: State management

---

## 🚀 AFTER IMPLEMENTATION:

1. Run: `npm install` (dependencies)
2. Run: `npm run dev` (start dev server)
3. Visit: http://localhost:3000/auth/login
4. Test login form

---

**File này là template/guide - mỗi file .tsx đã tạo với TODO comments**
**Giờ bạn có thể mở từng file và implement theo comments!**

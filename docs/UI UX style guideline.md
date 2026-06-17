# 📘 TÀI LIỆU UI/UX STYLE GUIDELINE — HỆ THỐNG QUẢN LÝ THƯ VIỆN (LMS)

> **Phiên bản:** 1.0  
> **Ngày tạo:** 16/06/2026  
> **Công nghệ Frontend:** Next.js · TypeScript · TailwindCSS  
> **Tham chiếu:** [SRS Document](./srs.md) · [User Stories](./user-stories.md)

---

## Mục lục

1. [Triết lý thiết kế (Design Philosophy)](#1-triết-lý-thiết-kế-design-philosophy)
2. [Bảng màu (Color Palette)](#2-bảng-màu-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Grid System](#4-spacing--grid-system)
5. [Iconography](#5-iconography)
6. [Component Library](#6-component-library)
7. [Layout Patterns](#7-layout-patterns)
8. [Navigation & Information Architecture](#8-navigation--information-architecture)
9. [Trạng thái & Phản hồi (States & Feedback)](#9-trạng-thái--phản-hồi-states--feedback)
10. [Animation & Micro-interaction](#10-animation--micro-interaction)
11. [Responsive & Breakpoints](#11-responsive--breakpoints)
12. [Dark Mode](#12-dark-mode)
13. [Accessibility (A11y)](#13-accessibility-a11y)
14. [Thiết kế theo vai trò (Role-based Design)](#14-thiết-kế-theo-vai-trò-role-based-design)
15. [Quy tắc đặt tên CSS/Component](#15-quy-tắc-đặt-tên-csscomponent)
16. [Hình ảnh & Media](#16-hình-ảnh--media)
17. [Form & Validation](#17-form--validation)
18. [Bảng & Dữ liệu (Table & Data Display)](#18-bảng--dữ-liệu-table--data-display)
19. [AI Feature UI Patterns](#19-ai-feature-ui-patterns)
20. [Tài liệu tham khảo & Nguồn cảm hứng](#20-tài-liệu-tham-khảo--nguồn-cảm-hứng)

---

## 1. Triết lý thiết kế (Design Philosophy)

### 1.1. Tầm nhìn

Giao diện LMS hướng tới phong cách **"Illuminated Intelligence"** — sự tổng hòa giữa **Clean Tech, Corporate Modernism** và phong cách thiết kế **SaaS cao cấp**. Hệ thống cân bằng sức mạnh quyền uy của một thư viện truyền thống với tốc độ mượt mà của lõi AI hiện đại. Người dùng phải cảm thấy:

- **Tin cậy tĩnh lặng (Quiet Confidence)** — công nghệ mạnh mẽ nhưng không phô trương, dữ liệu minh bạch
- **Thông thoáng** — khoảng trắng rộng (deep whitespace), căn chỉnh sắc nét (razor-sharp alignment)
- **Thông minh** — AI đóng vai trò cốt lõi, tương tác tự nhiên qua các hiệu ứng chuyển động có mục đích

### 1.2. Nguyên tắc cốt lõi

| #   | Nguyên tắc                 | Mô tả                                                                         |
| --- | -------------------------- | ----------------------------------------------------------------------------- |
| 1   | **Clarity First**          | Ưu tiên sự rõ ràng. Mỗi trang/component chỉ phục vụ MỘT mục đích chính        |
| 2   | **Consistent**             | Thống nhất về màu sắc, spacing, font, component trên toàn bộ hệ thống         |
| 3   | **Accessible**             | Tuân thủ WCAG 2.1 AA — tương phản đủ, hỗ trợ keyboard navigation              |
| 4   | **Progressive Disclosure** | Hiển thị thông tin quan trọng nhất trước, chi tiết bổ sung khi người dùng cần |
| 5   | **Responsive**             | Hoạt động tốt trên Desktop (≥1024px), Tablet (≥768px) và Mobile (≥320px)      |
| 6   | **Performance**            | Tối ưu hiệu năng: lazy loading, skeleton screen, tránh layout shift           |

---

## 2. Bảng màu (Color Palette)

### 2.1. Màu chính (Primary Colors)

Tông màu chính mang phong cách **"Deep Indigo"** — gợi lên sự tin cậy, và truyền thống học thuật.

| Token         | Hex       | Sử dụng                  |
| ------------- | --------- | ------------------------ |
| `primary-50`  | `#e1e0ff` | Background nhẹ (fixed)   |
| `primary-100` | `#c0c1ff` | Hover background         |
| `primary-300` | `#9da1ff` | Inactive/border          |
| `primary-500` | `#2e3192` | **Primary button, link** |
| `primary-700` | `#15157d` | **Primary hover / text** |
| `primary-900` | `#04006d` | Active / Text đậm        |

### 2.2. Màu phụ (Secondary — Electric Blue)

Tông màu Electric Blue báo hiệu tương tác và lõi AI. Gradient AI đi từ Electric Blue sang Deep Purple.

| Token           | Hex       | Sử dụng                  |
| --------------- | --------- | ------------------------ |
| `secondary-50`  | `#c6e7ff` | Background phụ           |
| `secondary-300` | `#2dbcfe` | Highlight / Progress     |
| `secondary-500` | `#00658d` | **Interactive, Links**   |
| `tertiary-300`  | `#c792ff` | AI Gradient Point        |
| `tertiary-500`  | `#3e0070` | **Deep Purple (AI)**     |

### 2.3. Màu trạng thái (Semantic Colors)

| Token         | Hex       | Sử dụng                                        |
| ------------- | --------- | ---------------------------------------------- |
| `success-500` | `#00658d` | Thành công, sách còn hàng, phiếu mượn hoàn tất (Dùng secondary) |
| `error-500`   | `#ba1a1a` | Lỗi, từ chối, quá hạn                          |
| `error-50`    | `#ffdad6` | Background error                               |

### 2.4. Neutral Colors (Grayscale)

Sử dụng "Cool Gray" tạo cảm giác môi trường làm việc sạch sẽ, công nghệ cao.

| Token         | Hex       | Sử dụng                       |
| ------------- | --------- | ----------------------------- |
| `surface-low` | `#ffffff` | Background chính              |
| `surface-high`| `#f8f9fa` | Background vùng chứa (Soft Gray)|
| `outline`     | `#777683` | Border, separator             |
| `on-surface-variant`| `#464652` | Body text secondary        |
| `on-surface`  | `#191c1d` | Body text primary             |

### 2.5. Tailwind Config

```typescript
// tailwind.config.ts — Phần colors
const colors = {
  primary: {
    50: "#e1e0ff",
    100: "#c0c1ff",
    500: "#2e3192",
    700: "#15157d",
    900: "#04006d",
  },
  secondary: {
    50: "#c6e7ff",
    300: "#2dbcfe",
    500: "#00658d",
  },
  tertiary: {
    300: "#c792ff",
    500: "#3e0070",
  },
  error: { 50: "#ffdad6", 500: "#ba1a1a", 700: "#93000a" },
  surface: {
    lowest: "#ffffff",
    default: "#f8f9fa",
    high: "#e7e8e9",
  },
  content: {
    primary: "#191c1d",
    secondary: "#464652",
    outline: "#777683",
  }
};
```

---

## 3. Typography

### 3.1. Font Family

| Mục đích      | Font             | Fallback                | Lý do                                   |
| ------------- | ---------------- | ----------------------- | --------------------------------------- |
| **Heading**   | `Inter`          | `system-ui, sans-serif` | Hiện đại, dễ đọc, hỗ trợ tiếng Việt tốt |
| **Body**      | `Inter`          | `system-ui, sans-serif` | Nhất quán toàn bộ hệ thống              |
| **Monospace** | `JetBrains Mono` | `Consolas, monospace`   | Hiển thị mã phiếu mượn, ID              |

```html
<!-- Import trong layout.tsx hoặc _document.tsx -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

### 3.2. Type Scale

Sử dụng hệ thống scale dựa trên typography của thiết kế "Lumina Library".

| Token               | Size (px) | Font             | Line Height | Weight | Sử dụng                 |
| ------------------- | --------- | ---------------- | ----------- | ------ | ----------------------- |
| `text-display-lg`   | 48        | Inter            | 56px        | 700    | Landing hero            |
| `text-headline-lg`  | 32        | Inter            | 40px        | 600    | Page title, hero        |
| `text-title-md`     | 20        | Inter            | 28px        | 600    | Section title           |
| `text-body-md`      | 16        | Inter            | 24px        | 400    | **Body text mặc định**  |
| `text-body-sm`      | 14        | Inter            | 20px        | 400    | Sidebar, metadata phụ   |
| `text-label-caps`   | 12        | JetBrains Mono   | 16px        | 500    | Mã sách, tag, badge     |

### 3.3. Quy tắc Typography

- **Heading:** Luôn dùng `font-semibold` (600) hoặc `font-bold` (700)
- **Body:** Dùng `font-normal` (400), `font-medium` (500) cho emphasis
- **Chiều dài dòng tối ưu:** 60–80 ký tự (khoảng `max-w-prose` = 65ch)
- **Tuyệt đối không dùng ALL CAPS** cho đoạn văn dài. Chỉ dùng cho label ngắn, badge
- **Tiếng Việt:** Luôn test dấu (ắ, ầ, ổ, ứ, ễ) khi chọn font để đảm bảo rendering chính xác

---

## 4. Spacing & Grid System

### 4.1. Spacing Scale (Base 4px)

| Token | Value | Sử dụng thường gặp                        |
| ----- | ----- | ----------------------------------------- |
| `0`   | 0px   | —                                         |
| `0.5` | 2px   | Micro gap                                 |
| `1`   | 4px   | Khoảng cách tối thiểu trong component     |
| `1.5` | 6px   | Padding icon nhỏ                          |
| `2`   | 8px   | Gap giữa icon và label                    |
| `3`   | 12px  | Padding trong badge, chip                 |
| `4`   | 16px  | **Padding tiêu chuẩn trong card, button** |
| `5`   | 20px  | —                                         |
| `6`   | 24px  | Gap giữa các form field                   |
| `8`   | 32px  | Margin giữa các section nhỏ               |
| `10`  | 40px  | —                                         |
| `12`  | 48px  | Margin giữa các section lớn               |
| `16`  | 64px  | Page section padding                      |
| `20`  | 80px  | Hero section padding                      |
| `24`  | 96px  | Large section gap                         |

### 4.2. Grid System

```
Container:  max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8
Grid:       grid grid-cols-12 gap-6
```

| Layout            | Desktop (≥1440px)     | Tablet (≥768px)   | Mobile (<768px)          |
| ----------------- | --------------------- | ----------------- | ------------------------ |
| Sidebar + Content | Sidebar 280px cố định | Collapsed sidebar | Full-width stack         |
| Book Grid         | 4-5 cột               | 3 cột             | 2 cột (1 cột mobile nhỏ) |
| Form Layout       | 2 cột (label + input) | 2 cột             | 1 cột stack              |
| Dashboard Stats   | 4 cards/row           | 2 cards/row       | 1 card/row               |

### 4.3. Border Radius (Shapes)

Mềm mại hóa các góc cứng để giao diện thân thiện hơn nhưng không làm mất sự chuyên nghiệp.

| Token          | Value  | Sử dụng                       |
| -------------- | ------ | ----------------------------- |
| `rounded-sm`   | 4px    | Checkbox, tag nhỏ             |
| `rounded`      | 8px    | **Button, Card, Input**       |
| `rounded-full` | 9999px | Chatbot trigger, AI Search bar|

---

## 5. Iconography

### 5.1. Icon Library

Sử dụng **Lucide React** (fork của Feather Icons) — lightweight, tree-shakable, nhất quán.

```bash
npm install lucide-react
```

### 5.2. Quy tắc sử dụng Icon

| Quy tắc           | Chi tiết                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| **Kích thước**    | 16px (inline text), 20px (button), 24px (navigation), 32px (empty state) |
| **Stroke width**  | 1.5px (mặc định), 2px (cho icon nhỏ 16px)                                |
| **Màu**           | Kế thừa từ parent (`currentColor`), không hard-code màu                  |
| **Luôn có label** | Icon standalone phải có `aria-label` hoặc tooltip                        |
| **Nhất quán**     | Mỗi hành động chỉ dùng MỘT icon duy nhất trên toàn hệ thống              |

### 5.3. Icon Mapping chính

| Hành động           | Icon | Lucide name         |
| ------------------- | ---- | ------------------- |
| Tìm kiếm            | 🔍   | `Search`            |
| Thêm vào yêu thích  | ♡    | `Heart`             |
| Giỏ hàng/Phiếu mượn | 🛒   | `ShoppingCart`      |
| Thông báo           | 🔔   | `Bell`              |
| Profile             | 👤   | `User`              |
| Cài đặt             | ⚙️   | `Settings`          |
| Đăng xuất           | ↪    | `LogOut`            |
| Sách                | 📖   | `BookOpen`          |
| Lọc                 | ☰   | `SlidersHorizontal` |
| Xóa                 | 🗑   | `Trash2`            |
| Chỉnh sửa           | ✏️   | `Pencil`            |
| Đóng                | ✕    | `X`                 |
| Chatbot AI          | 💬   | `MessageCircle`     |
| Quét mã             | 📱   | `ScanBarcode`       |

---

## 6. Component Library

### 6.1. Button

#### Variants

| Variant         | Sử dụng                             | Ví dụ                       |
| --------------- | ----------------------------------- | --------------------------- |
| **Primary**     | Hành động chính duy nhất trên trang | "Đặt mượn sách", "Xác nhận" |
| **Secondary**   | Hành động phụ, ít quan trọng hơn    | "Hủy", "Quay lại"           |
| **Outline**     | Hành động bổ trợ                    | "Xem thêm", "Lọc"           |
| **Ghost**       | Hành động inline, ít nhấn mạnh      | "Chỉnh sửa", icon button    |
| **Destructive** | Hành động nguy hiểm                 | "Xóa sách", "Hủy phiếu"     |
| **Link**        | Điều hướng                          | "Xem chi tiết →"            |

#### Sizes

| Size | Height | Padding | Font        | Sử dụng              |
| ---- | ------ | ------- | ----------- | -------------------- |
| `sm` | 32px   | `px-3`  | `text-sm`   | Table action, inline |
| `md` | 40px   | `px-4`  | `text-sm`   | **Mặc định**         |
| `lg` | 48px   | `px-6`  | `text-base` | CTA chính, hero      |

#### States

```
Default → Hover (darken 10%) → Active/Pressed (darken 15%) → Focus (ring-2 ring-primary-500 ring-offset-2) → Disabled (opacity-50 cursor-not-allowed) → Loading (spinner + disabled)
```

#### Mẫu code

```tsx
// components/ui/Button.tsx
<button
  className={cn(
    // Base
    "inline-flex items-center justify-center gap-2 rounded font-medium",
    "transition-colors duration-150 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    // Variant: Primary
    "bg-primary-500 text-white hover:bg-primary-700 active:bg-primary-900",
    // Size: md
    "h-10 px-4 text-body-sm",
  )}
>
  {children}
</button>
```

---

### 6.2. Input & Form Controls

#### Text Input

```
Height:         40px (md), 48px (lg)
Padding:        px-3 py-2
Background:     bg-surface-high (Soft Gray)
Border:         Không border ở trạng thái mặc định
Border Radius:  rounded (8px)
Focus:          1px solid primary-500 (Deep Indigo)
Error:          1px solid error-500
Placeholder:    text-content-outline
```

#### Cấu trúc Form Field

```
┌─────────────────────────────────────┐
│ Label *                    (helper) │  ← text-sm font-medium text-neutral-700
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔍  Placeholder text...        │ │  ← Input with optional leading icon
│ └─────────────────────────────────┘ │
│ ⚠ Thông báo lỗi validation         │  ← text-sm text-error-500, chỉ hiện khi có lỗi
└─────────────────────────────────────┘
```

#### Các loại Form Control

| Component         | Mô tả                                             |
| ----------------- | ------------------------------------------------- |
| `TextInput`       | Input text cơ bản, hỗ trợ leading/trailing icon   |
| `TextArea`        | Nhiều dòng, min-h-[120px]                         |
| `Select`          | Dropdown chọn 1 option                            |
| `MultiSelect`     | Chọn nhiều (thể loại sách, tác giả)               |
| `DatePicker`      | Chọn ngày mượn/trả — dùng cho flow đặt mượn sách  |
| `DateRangePicker` | Lọc theo khoảng thời gian (báo cáo, lịch sử)      |
| `Checkbox`        | Multi-select dạng list                            |
| `RadioGroup`      | Single-select                                     |
| `Switch/Toggle`   | On/Off (bật/tắt thông báo, dark mode)             |
| `FileUpload`      | Upload ảnh bìa sách — hỗ trợ drag & drop, preview |
| `SearchInput`     | Input tìm kiếm có debounce 300ms, clear button    |

---

### 6.3. Card

Card là component cốt lõi — dùng để hiển thị sách, thống kê, phiếu mượn.

#### Book Card

```
┌──────────────────────┐
│  ┌──────────────────┐ │
│  │                  │ │  ← Ảnh bìa sách (aspect-ratio: 3/4)
│  │    Book Cover    │ │     hover: scale(1.03) + shadow
│  │                  │ │
│  └──────────────────┘ │
│  📖 Thể loại           │  ← Badge nhỏ, text-xs
│  Tên sách (2 dòng)    │  ← text-base font-semibold, line-clamp-2
│  Tác giả               │  ← text-sm text-neutral-500
│  ★ 4.5  ·  156 đánh giá│  ← Rating + review count
│  ┌────────────────────┐│
│  │ Còn 5 cuốn         ││  ← Stock status badge
│  └────────────────────┘│
│  ♡                     │  ← Wishlist toggle (góc trên phải, absolute)
└──────────────────────┘
```

**Specs:**

- Border: Không viền (sử dụng shadow để nổi)
- Border Radius: Bìa sách có border-radius nhỏ `2px`, toàn card là `8px`
- Shadow: `shadow-level-1` mặc định, `shadow-level-2` on hover
- Padding: `p-0` (ảnh full-width) + `p-6` (content area - 24px)
- Transition: `transition-all duration-200 ease-out`
- Background: `bg-surface-lowest` (Trắng)

#### Stats Card (Dashboard Admin/Librarian)

```
┌──────────────────────────┐
│ 📈  Tổng sách mượn        │  ← Icon + Label
│                            │
│     1,247                  │  ← text-3xl font-bold
│     ▲ 12.5% so với tháng  │  ← Trend indicator (success/error color)
│       trước                │
└──────────────────────────┘
```

---

### 6.4. Badge & Status Indicator

#### Status Badge cho phiếu mượn

| Trạng thái              | Màu       | CSS Classes                                          |
| ----------------------- | --------- | ---------------------------------------------------- |
| Chờ duyệt               | `warning` | `bg-warning-50 text-warning-700 border-warning-200`  |
| Đã duyệt / Chờ lấy sách | `info`    | `bg-info-50 text-info-700 border-info-200`           |
| Đang mượn               | `primary` | `bg-primary-50 text-primary-700 border-primary-200`  |
| Đã trả sách             | `success` | `bg-success-50 text-success-700 border-success-200`  |
| Quá hạn                 | `error`   | `bg-error-50 text-error-700 border-error-200`        |
| Đã hủy                  | `neutral` | `bg-neutral-100 text-neutral-500 border-neutral-200` |

#### Stock Badge cho sách

| Trạng thái | Hiển thị                        |
| ---------- | ------------------------------- |
| Còn > 5    | ● Còn hàng (`text-success-500`) |
| Còn 1–5    | ● Sắp hết (`text-warning-500`)  |
| Hết        | ● Hết hàng (`text-error-500`)   |

---

### 6.5. Modal & Dialog

```
Overlay:    bg-black/50 backdrop-blur-sm
Container:  bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4
Header:     px-6 pt-6 pb-0
Body:       px-6 py-4
Footer:     px-6 pb-6 pt-2 flex justify-end gap-3 border-t border-neutral-100
Animation:  fade-in (overlay) + scale-up from 95% (content)
```

**Phân loại:**

| Loại       | Max Width            | Dùng khi                           |
| ---------- | -------------------- | ---------------------------------- |
| **Small**  | `max-w-sm` (384px)   | Xác nhận đơn giản (Có/Không)       |
| **Medium** | `max-w-lg` (512px)   | Form đơn giản, chi tiết phiếu mượn |
| **Large**  | `max-w-2xl` (672px)  | Form phức tạp, thêm sách mới       |
| **Full**   | `max-w-5xl` (1024px) | Xem trước dữ liệu, báo cáo         |

---

### 6.6. Toast / Notification

```
Position:   bottom-right (cố định), top-right cho Admin dashboard
Duration:   5 giây (auto dismiss), persistent cho error quan trọng
Max show:   3 toast đồng thời, queue các toast tiếp theo
Animation:  slide-in from right + fade
```

| Loại    | Icon               | Ví dụ                                         |
| ------- | ------------------ | --------------------------------------------- |
| Success | ✅ `CheckCircle`   | "Đặt mượn sách thành công!"                   |
| Error   | ❌ `XCircle`       | "Không thể tạo phiếu mượn. Vui lòng thử lại." |
| Warning | ⚠️ `AlertTriangle` | "Sách này sắp hết hàng (còn 2 cuốn)"          |
| Info    | ℹ️ `Info`          | "Phiếu mượn #1234 đã được duyệt"              |

---

### 6.7. Table

Dùng cho danh sách sách (Librarian), phiếu mượn, users (Admin).

```
Header:     bg-neutral-50 text-neutral-600 text-xs uppercase tracking-wider font-semibold
Row:        border-b border-neutral-100, hover:bg-neutral-50
Cell:       px-4 py-3 text-sm
Selected:   bg-primary-50 border-l-2 border-primary-500
Pagination: Ngoài table, flex justify-between items-center
```

**Tính năng:**

- Sortable columns (nhấn header để sắp xếp)
- Sticky header khi scroll
- Bulk selection (checkbox column)
- Inline actions (Edit, Delete) ở cột cuối
- Empty state khi không có dữ liệu

---

### 6.8. Sidebar Navigation (Admin/Librarian)

```
Width:      280px (expanded), 72px (collapsed)
Background: bg-neutral-900 (dark) hoặc bg-white border-r (light)
Item:       px-4 py-2.5 rounded-lg
Active:     bg-primary-500/10 text-primary-500 font-medium
Hover:      bg-neutral-100 (light) / bg-neutral-800 (dark)
Icon size:  20px
Transition: width 200ms ease-in-out
```

---

## 7. Layout Patterns

### 7.1. Public Pages (Guest/Customer)

```
┌─────────────────────────────────────────────────────┐
│                    Top Header Bar                     │  ← Logo + Search + Cart + Auth buttons
│                    Navigation Bar                     │  ← Main nav: Trang chủ, Danh mục, Giới thiệu...
├─────────────────────────────────────────────────────┤
│                                                       │
│                    Page Content                       │
│                                                       │
├─────────────────────────────────────────────────────┤
│                       Footer                          │  ← Links, contact, copyright
└─────────────────────────────────────────────────────┘
│  🤖 AI Chatbot FAB (floating action button)          │  ← Góc dưới phải
```

### 7.2. Dashboard (Admin/Librarian)

```
┌──────┬──────────────────────────────────────────────┐
│      │                Top Bar                        │  ← Breadcrumb + Search + Notifications + Avatar
│      ├──────────────────────────────────────────────┤
│ Side │                                                │
│ bar  │              Main Content Area                 │
│      │                                                │
│ Nav  │                                                │
│      │                                                │
└──────┴──────────────────────────────────────────────┘
```

### 7.3. Page Template — Danh sách (List Page)

```
┌─────────────────────────────────────────────────────┐
│ [Breadcrumb] Trang chủ > Quản lý sách                │
│                                                       │
│ Quản lý sách                         [+ Thêm sách]  │  ← Page title + Primary action
│                                                       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 🔍 Tìm kiếm...  │ Thể loại ▼ │ Trạng thái ▼    │ │  ← Filter bar
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Table / Grid content                              │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ← 1 2 3 ... 10 →        Hiển thị 1-20 / 256 kết quả │  ← Pagination
└─────────────────────────────────────────────────────┘
```

### 7.4. Page Template — Chi tiết (Detail Page)

```
┌─────────────────────────────────────────────────────┐
│ [Breadcrumb] Trang chủ > Sách > Chi tiết sách        │
│                                                       │
│ ┌──────────┐  Tên sách đầy đủ                       │
│ │          │  ★★★★☆ 4.2 (89 đánh giá)               │
│ │  Cover   │  Tác giả: Nguyễn Nhật Ánh               │
│ │  Image   │  NXB: Nhà xuất bản Trẻ                  │
│ │          │  Thể loại: Văn học, Tiểu thuyết          │
│ │          │  Tình trạng: ● Còn 12 cuốn              │
│ └──────────┘                                          │
│              [♡ Yêu thích]  [🛒 Đặt mượn sách]      │
│                                                       │
│ ┌─ Tab: Mô tả ─┬─ Đánh giá ─┬─ Sách liên quan ────┐ │
│ │                                                     │ │
│ │ Tab content...                                      │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 8. Navigation & Information Architecture

### 8.1. Public Navigation

```
Logo  |  Trang chủ  |  Danh mục sách ▼  |  Giới thiệu  |  Liên hệ  |  [🔍]  [♡]  [🛒]  [Đăng nhập]
```

- **Mega menu** cho "Danh mục sách" — hiển thị top categories + sách nổi bật
- **Search bar** mở rộng khi click — hỗ trợ AI Semantic Search
- **Sticky header** khi scroll xuống — thu gọn height từ 80px → 64px

### 8.2. Customer Navigation (After Login)

Thêm vào header:

```
... [🔔 Thông báo]  [👤 Avatar ▼]
                      ├─ Hồ sơ cá nhân
                      ├─ Lịch sử mượn sách
                      ├─ Danh sách yêu thích
                      ├─ Thẻ thư viện
                      └─ Đăng xuất
```

### 8.3. Admin Sidebar Navigation

```
📊 Dashboard
──────────────
📚 Quản lý sách
   ├─ Danh sách sách
   ├─ Danh mục
   ├─ Tác giả
   └─ Nhà xuất bản
──────────────
📋 Phiếu mượn
   ├─ Phiếu chờ duyệt
   ├─ Đang mượn
   └─ Quá hạn
──────────────
👥 Người dùng
   ├─ Tài khoản
   ├─ Vai trò & Quyền
   └─ Hạng thành viên
──────────────
💳 Tài chính
   ├─ Đối soát
   ├─ Hoàn tiền
   └─ Cổng thanh toán
──────────────
📈 Báo cáo
   ├─ Thống kê doanh thu
   ├─ Thống kê mượn trả
   └─ AI xu hướng
──────────────
⚙️ Cài đặt
   ├─ Chính sách nghiệp vụ
   ├─ Banner & CMS
   ├─ Audit Logs
   └─ Cấu hình hệ thống
```

### 8.4. Breadcrumb

```
Trang chủ / Quản lý sách / Chỉnh sửa — "Tên sách"
```

- Luôn hiển thị (trừ trang chủ)
- Separator: `/` hoặc `>` (icon `ChevronRight`)
- Item cuối cùng: `text-neutral-500`, không có link

---

## 9. Trạng thái & Phản hồi (States & Feedback)

### 9.1. Loading States

| State                | Component                     | Mô tả                                                                             |
| -------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| **Skeleton**         | Card, Table row, Profile      | Placeholder hình dạng giống content thật — `bg-neutral-200 animate-pulse rounded` |
| **Spinner**          | Button, inline loading        | Spinner tròn 16px–24px, dùng khi đang submit form                                 |
| **Progress Bar**     | File upload, batch processing | Thanh tiến trình ngang, `bg-primary-500`, có %                                    |
| **Full-page Loader** | First load, route change      | Logo + spinner center screen, dùng `Suspense`                                     |

**Quy tắc:** Ưu tiên Skeleton > Spinner > Full-page. Không bao giờ để trang trống không có feedback.

### 9.2. Empty States

```
┌─────────────────────────────────────┐
│                                       │
│           📚 (Illustration)           │
│                                       │
│    Chưa có sách nào trong danh mục   │  ← text-lg font-medium
│    Bắt đầu bằng cách thêm sách mới  │  ← text-sm text-neutral-500
│                                       │
│         [+ Thêm sách mới]            │  ← CTA Button
│                                       │
└─────────────────────────────────────┘
```

### 9.3. Error States

| Tình huống            | Xử lý                                                                |
| --------------------- | -------------------------------------------------------------------- |
| **Form validation**   | Inline error dưới input, text-sm text-error-500, icon ⚠️             |
| **API error**         | Toast notification + inline message                                  |
| **404 Not Found**     | Trang 404 custom với illustration + link quay về                     |
| **500 Server Error**  | Trang 500 custom + nút "Thử lại"                                     |
| **Network offline**   | Banner cố định ở top: "Bạn đang offline. Vui lòng kiểm tra kết nối." |
| **Permission denied** | Toast error + redirect về trang phù hợp với role                     |

### 9.4. Success States

- **Form submit:** Toast success + redirect/close modal
- **Delete:** Confirmation modal trước → Toast success sau khi xóa
- **Thanh toán:** Trang success riêng với confetti animation (nhẹ)

---

## 10. Animation & Micro-interaction

### 10.1. Nguyên tắc chung

- **Subtle:** Animation phải nhẹ nhàng, KHÔNG gây xao lãng
- **Meaningful:** Chỉ animate khi tạo ra giá trị (hướng dẫn mắt, phản hồi hành động)
- **Fast:** Duration 150–300ms cho interaction, 300–500ms cho layout change
- **Easing:** `ease-out` cho entrance, `ease-in` cho exit, `ease-in-out` cho transform

### 10.2. Danh sách Animation

| Animation           | Duration | Easing      | Dùng khi                              |
| ------------------- | -------- | ----------- | ------------------------------------- |
| **Fade in**         | 200ms    | ease-out    | Modal overlay, tooltip                |
| **Slide up**        | 300ms    | ease-out    | Modal content, dropdown               |
| **Scale up**        | 200ms    | ease-out    | Modal enter (95% → 100%)              |
| **Hover lift**      | 200ms    | ease-out    | Card hover (translateY -2px + shadow) |
| **Button press**    | 100ms    | ease-in     | Button active (scale 0.98)            |
| **Skeleton pulse**  | 1.5s     | ease-in-out | Loading skeleton, loop                |
| **Slide in right**  | 300ms    | ease-out    | Toast notification                    |
| **Page transition** | 200ms    | ease-out    | Route change fade                     |
| **Collapse/Expand** | 200ms    | ease-in-out | Accordion, sidebar toggle             |
| **Spinner**         | 600ms    | linear      | Loading spinner, loop                 |

### 10.3. Hover Effects

```css
/* Book Card hover */
.book-card {
  transition:
    transform 200ms ease-out,
    box-shadow 200ms ease-out;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1); /* shadow-level-2 */
}

/* Book cover zoom on hover */
.book-cover {
  transition: transform 300ms ease-out;
}
.book-card:hover .book-cover {
  transform: scale(1.05);
}
```

### 10.4. Reduce Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Responsive & Breakpoints

### 11.1. Breakpoints (Tailwind mặc định)

| Token | Min Width | Target                           |
| ----- | --------- | -------------------------------- |
| `sm`  | 640px     | Mobile landscape                 |
| `md`  | 768px     | Tablet portrait                  |
| `lg`  | 1024px    | Tablet landscape / Small desktop |
| `xl`  | 1280px    | **Desktop chính**                |
| `2xl` | 1536px    | Large desktop                    |

### 11.2. Chiến lược Responsive

- **Mobile-first:** Viết CSS cho mobile trước, dùng breakpoint mở rộng lên
- **Book grid:** `grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- **Sidebar:** Ẩn trên mobile, hiện dạng slide-over khi nhấn hamburger menu
- **Table:** Trên mobile, chuyển thành card layout hoặc horizontal scroll
- **Typography:** Heading giảm size trên mobile (VD: `text-3xl md:text-4xl lg:text-5xl`)

### 11.3. Touch Targets

- **Minimum touch target:** 44×44px (WCAG recommendation)
- **Spacing giữa touch targets:** Tối thiểu 8px
- **Mobile input height:** 48px (thay vì 40px trên desktop)

---

## 12. Dark Mode

### 12.1. Chiến lược

- **System preference** mặc định (`prefers-color-scheme`)
- **User toggle** — lưu preference vào `localStorage`
- **Implement:** Tailwind `dark:` variant + CSS custom properties

### 12.2. Color Mapping

| Element          | Light Mode              | Dark Mode               |
| ---------------- | ----------------------- | ----------------------- |
| Page background  | `neutral-0` (#FFFFFF)   | `neutral-950` (#020617) |
| Card background  | `neutral-0` (#FFFFFF)   | `neutral-900` (#0F172A) |
| Elevated surface | `neutral-50` (#F8FAFC)  | `neutral-800` (#1E293B) |
| Border           | `neutral-200` (#E2E8F0) | `neutral-700` (#334155) |
| Body text        | `neutral-700` (#334155) | `neutral-300` (#CBD5E1) |
| Heading text     | `neutral-900` (#0F172A) | `neutral-50` (#F8FAFC)  |
| Primary button   | Giữ nguyên              | Giữ nguyên              |
| Input background | `neutral-0` (#FFFFFF)   | `neutral-800` (#1E293B) |

### 12.3. Quy tắc Dark Mode

- **KHÔNG** chỉ invert màu. Phải tinh chỉnh từng cặp foreground/background
- **Giảm saturation** nhẹ cho màu semantic (success, error) trên dark background
- **Giảm shadow intensity** — thay bằng subtle border hoặc elevation bằng background
- **Ảnh bìa sách:** Thêm subtle dark overlay khi hover thay vì brighten

---

## 13. Accessibility (A11y)

### 13.1. Tiêu chuẩn

Tuân thủ **WCAG 2.1 Level AA** trở lên.

### 13.2. Checklist

| #   | Tiêu chí                | Chi tiết                                                                         |
| --- | ----------------------- | -------------------------------------------------------------------------------- |
| 1   | **Color Contrast**      | Tối thiểu 4.5:1 cho text thường, 3:1 cho text lớn (≥18px bold)                   |
| 2   | **Keyboard Navigation** | Tất cả interactive elements phải reachable bằng Tab, Enter, Space, Escape        |
| 3   | **Focus Indicator**     | Visible focus ring (`ring-2 ring-primary-500 ring-offset-2`) — KHÔNG tắt outline |
| 4   | **Screen Reader**       | Dùng semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`)      |
| 5   | **Alt Text**            | Tất cả ảnh bìa sách phải có alt text mô tả: `alt="Bìa sách: {tên sách}"`         |
| 6   | **ARIA Labels**         | Icon button phải có `aria-label`. VD: `aria-label="Thêm vào yêu thích"`          |
| 7   | **Error Announcement**  | Lỗi form phải được announce bằng `aria-live="polite"`                            |
| 8   | **Skip Link**           | Link "Skip to main content" ẩn, hiện khi focus                                   |
| 9   | **Language**            | `<html lang="vi">`                                                               |
| 10  | **Motion**              | Respect `prefers-reduced-motion`                                                 |

---

## 14. Thiết kế theo vai trò (Role-based Design)

### 14.1. Nguyên tắc phân biệt vai trò qua UI

| Vai trò               | Tone & Feel                         | Đặc điểm UI                                                               |
| --------------------- | ----------------------------------- | ------------------------------------------------------------------------- |
| **Guest / Customer**  | Warm, inviting, consumer-friendly   | Card-based layout, ảnh lớn, ít text kỹ thuật, CTA rõ ràng                 |
| **Librarian / Staff** | Professional, efficient, data-dense | Table-based layout, nhiều filter/sort, bulk actions, quick-access toolbar |
| **Admin**             | Powerful, comprehensive, analytical | Dashboard charts, nested navigation, configuration panels, audit logs     |

### 14.2. Color Accent theo vai trò

| Vai trò   | Sidebar Accent   | Avatar Badge       |
| --------- | ---------------- | ------------------ |
| Customer  | Không có sidebar | `bg-primary-500`   |
| Librarian | `primary-500`    | `bg-secondary-500` |
| Admin     | `primary-800`    | `bg-error-500`     |

### 14.3. Thiết kế cho Librarian — Tối ưu hiệu suất

- **Quick actions toolbar** — các hành động thường xuyên ở đầu trang
- **Keyboard shortcuts** — VD: `Ctrl+N` tạo phiếu mượn, `Ctrl+F` focus tìm kiếm
- **Batch operations** — chọn nhiều phiếu để duyệt/từ chối cùng lúc
- **Split view** — danh sách bên trái, chi tiết bên phải (optional)

---

## 15. Quy tắc đặt tên CSS/Component

### 15.1. Component Naming

```
src/components/
├── ui/                    # Primitive components (Button, Input, Badge...)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── PageContainer.tsx
├── features/              # Feature-specific compound components
│   ├── book/
│   │   ├── BookCard.tsx
│   │   ├── BookGrid.tsx
│   │   ├── BookDetail.tsx
│   │   └── BookSearchBar.tsx
│   ├── borrow/
│   │   ├── BorrowForm.tsx
│   │   ├── BorrowStatusBadge.tsx
│   │   └── BorrowHistoryTable.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── ai/
│       ├── ChatbotWidget.tsx
│       ├── RecommendationCarousel.tsx
│       └── SemanticSearchInput.tsx
└── shared/                # Shared compound components
    ├── RatingStars.tsx
    ├── EmptyState.tsx
    ├── ConfirmDialog.tsx
    └── FileUpload.tsx
```

### 15.2. Naming Convention

| Loại                | Convention                        | Ví dụ                                 |
| ------------------- | --------------------------------- | ------------------------------------- |
| **Component**       | PascalCase                        | `BookCard`, `BorrowForm`              |
| **File**            | PascalCase.tsx                    | `BookCard.tsx`                        |
| **CSS class**       | kebab-case (nếu custom)           | `.book-card`, `.search-bar`           |
| **Tailwind**        | Utility-first                     | `className="flex items-center gap-2"` |
| **Constants**       | SCREAMING_SNAKE                   | `MAX_BORROW_DAYS`, `API_BASE_URL`     |
| **Hooks**           | camelCase, prefix `use`           | `useAuth`, `useBookSearch`            |
| **Types/Interface** | PascalCase, prefix `I` (optional) | `Book`, `BorrowRequest`, `IUser`      |

---

## 16. Hình ảnh & Media

### 16.1. Ảnh bìa sách (Book Cover)

| Property          | Value                                                           |
| ----------------- | --------------------------------------------------------------- |
| **Aspect Ratio**  | 3:4 (chuẩn sách)                                                |
| **Sizes**         | Thumbnail: 120×160, Card: 200×267, Detail: 320×427              |
| **Format**        | WebP (ưu tiên) + JPEG fallback                                  |
| **Lazy loading**  | `loading="lazy"` cho grid, `loading="eager"` cho above-the-fold |
| **Placeholder**   | Skeleton blur gradient hoặc ảnh generic "No Cover"              |
| **Border Radius** | `rounded-lg` (12px)                                             |
| **Shadow**        | `shadow-md` on hover                                            |

### 16.2. Avatar

| Size | Pixels | Sử dụng                 |
| ---- | ------ | ----------------------- |
| `xs` | 24×24  | Comment, inline mention |
| `sm` | 32×32  | Table cell, list item   |
| `md` | 40×40  | Header, sidebar         |
| `lg` | 64×64  | Profile card            |
| `xl` | 96×96  | Profile page            |

- Shape: `rounded-full`
- Fallback: Chữ cái đầu trên nền gradient (`initials avatar`)
- Border: `ring-2 ring-white` khi trên nền có ảnh

### 16.3. Banner & Illustration

- **Hero banner:** Full-width, max-height 400px, overlay gradient cho text readability
- **Empty state illustration:** SVG, max 200×200px, dùng màu primary/neutral
- **Không dùng stock photo chung chung** — ưu tiên illustration hoặc ảnh sách thực tế

---

## 17. Form & Validation

### 17.1. Validation Strategy

| Thời điểm     | Loại             | Mô tả                                                         |
| ------------- | ---------------- | ------------------------------------------------------------- |
| **On blur**   | Field-level      | Validate khi user rời khỏi input (blur event)                 |
| **On change** | After first blur | Sau khi blur lần đầu + có lỗi, validate realtime khi user sửa |
| **On submit** | Form-level       | Validate toàn bộ form, focus vào field lỗi đầu tiên           |

### 17.2. Error Message Format

```
❌ [Tên field] + [Vấn đề gì] + [Gợi ý sửa (nếu có)]
```

**Ví dụ:**

- ❌ "Email không hợp lệ. Vui lòng nhập đúng định dạng: example@email.com"
- ❌ "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
- ❌ "Ngày trả phải sau ngày mượn ít nhất 1 ngày"

### 17.3. Form Layout

- **1 cột** cho form đăng ký, đăng nhập (tập trung, đơn giản)
- **2 cột** cho form thêm/sửa sách (nhiều field, tận dụng không gian)
- **Nhóm field liên quan** bằng `<fieldset>` + heading nhỏ
- **Required indicator:** Dấu `*` đỏ sau label: `<span class="text-error-500">*</span>`
- **Optional indicator:** Text "(không bắt buộc)" sau label

---

## 18. Bảng & Dữ liệu (Table & Data Display)

### 18.1. Table Component Specs

```
┌─────────────────────────────────────────────────────┐
│ ☐  │ Tên sách ↕      │ Tác giả  │ Tồn kho │  ...  │  ← Header row
├─────────────────────────────────────────────────────┤
│ ☐  │ Dế Mèn...       │ Tô Hoài  │   12    │  ...  │  ← Data row
│ ☐  │ Số Đỏ            │ Vũ Trọng │    3    │  ...  │  ← Highlighted (low stock)
├─────────────────────────────────────────────────────┤
│ Đã chọn: 2  [Duyệt] [Từ chối]   │ ← 1/10 trang → │  ← Footer
└─────────────────────────────────────────────────────┘
```

### 18.2. Pagination

- **Mặc định:** 20 items/trang
- **Options:** 10 | 20 | 50 | 100
- **Hiển thị:** "Hiển thị 1-20 của 256 kết quả"
- **Navigation:** ← First | Prev | 1 | 2 | 3 | ... | 10 | Next | Last →
- **Mobile:** Đơn giản hóa: ← Prev | Page X of Y | Next →

### 18.3. Data Formatting

| Loại dữ liệu | Format             | Ví dụ                                     |
| ------------ | ------------------ | ----------------------------------------- |
| Ngày         | dd/MM/yyyy         | 16/06/2026                                |
| Ngày giờ     | dd/MM/yyyy HH:mm   | 16/06/2026 14:30                          |
| Tiền         | ###.###đ           | 150.000đ                                  |
| Số           | #,###              | 1,247                                     |
| Trạng thái   | Badge component    | `<Badge variant="success">Đã trả</Badge>` |
| Tên dài      | Truncate + tooltip | "Đắc Nhân Tâm — Phiên bản đặc bi..."      |

---

## 19. AI Feature UI Patterns

### 19.1. AI Chatbot Widget

```
Trigger:    Floating Action Button (FAB) — góc dưới phải
            56×56px, rounded-full, bg-primary-500
            Icon: MessageCircle, pulse animation khi có gợi ý

Chat panel: max-w-md, height 70vh
            Slide up từ FAB
            Header: "🤖 Trợ lý thư viện AI" + close button
            Body: Chat messages, scroll
            Input: Text input + send button

Message:    User — bg-primary-50, align right
            AI — bg-neutral-50, align left, typing indicator "..."

Suggested:  Chip buttons trên input bar
            "Tóm tắt sách này" | "Gợi ý sách tương tự" | "Lộ trình đọc"
```

### 19.2. AI Semantic Search

```
┌─────────────────────────────────────────────────┐
│ 🔍 Tìm sách bằng AI...                      [×] │  ← Expanded search bar
│                                                   │
│ 💡 Thử: "sách về tâm lý cho người mới bắt đầu"  │  ← AI suggestion hint
│                                                   │
│ Kết quả AI:                                       │
│ ┌─────────────────────────────────────────────┐   │
│ │ 📖 Tư Duy Nhanh và Chậm  ★4.8  ✨95% phù hợp│   │  ← Match score badge
│ │ 📖 Đắc Nhân Tâm          ★4.6  ✨88% phù hợp│   │
│ └─────────────────────────────────────────────┘   │
│                                                   │
│ ⚡ Powered by AI Semantic Search                  │  ← Subtle AI attribution
└─────────────────────────────────────────────────┘
```

**Fallback UI:** Khi AI không khả dụng, hiện inline notice:

> ⚠️ Tìm kiếm AI tạm thời không khả dụng. Đang sử dụng tìm kiếm tiêu chuẩn.

### 19.3. AI Recommendation Section

```
┌─────────────────────────────────────────────────────┐
│ ✨ Gợi ý dành riêng cho bạn                  Xem thêm → │
│                                                           │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │ Book │ │ Book │ │ Book │ │ Book │ │ Book │   ←→ scroll │
│ │  1   │ │  2   │ │  3   │ │  4   │ │  5   │            │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘            │
│                                                           │
│ 🤖 Dựa trên sở thích đọc sách của bạn                   │  ← Attribution
└─────────────────────────────────────────────────────────┘
```

### 19.4. AI Indicator

Mỗi khi nội dung được tạo hoặc hỗ trợ bởi AI, phải có indicator rõ ràng:

- **Icon:** ✨ (sparkle) hoặc 🤖 trước label
- **Badge:** `AI` badge nhỏ, `bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full`
- **Attribution:** Text nhỏ "Powered by AI" ở cuối section

---

## 20. Tài liệu tham khảo & Nguồn cảm hứng

### 20.1. Design System tham khảo

| Tên               | Link                     | Học gì                                      |
| ----------------- | ------------------------ | ------------------------------------------- |
| Shadcn/ui         | https://ui.shadcn.com    | Component primitives cho Next.js + Tailwind |
| Radix UI          | https://www.radix-ui.com | Accessible primitives                       |
| Ant Design        | https://ant.design       | Dashboard & Admin UI patterns               |
| Material Design 3 | https://m3.material.io   | Color system, typography, motion            |

### 20.2. UI Inspiration

| Tham khảo         | Lý do                                    |
| ----------------- | ---------------------------------------- |
| Goodreads         | Flow đánh giá sách, recommendation       |
| Libby (OverDrive) | UX mượn sách điện tử, thẻ thư viện       |
| Notion            | Clean UI, sidebar navigation             |
| Linear            | Dashboard efficiency, keyboard shortcuts |
| Stripe Dashboard  | Data table, financial UI                 |

### 20.3. Tool & Resource

| Tool         | Mục đích                           |
| ------------ | ---------------------------------- |
| Figma        | Thiết kế mockup & prototype        |
| Storybook    | Document & test component isolated |
| Chromatic    | Visual regression testing          |
| Lighthouse   | Performance & Accessibility audit  |
| axe DevTools | Accessibility testing              |

---

## Phụ lục A: Tailwind Config hoàn chỉnh (Gợi ý)

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e1e0ff",
          100: "#c0c1ff",
          500: "#2e3192",
          700: "#15157d",
          900: "#04006d",
        },
        secondary: {
          50: "#c6e7ff",
          300: "#2dbcfe",
          500: "#00658d",
        },
        tertiary: {
          300: "#c792ff",
          500: "#3e0070",
        },
        error: { 50: "#ffdad6", 500: "#ba1a1a", 700: "#93000a" },
        surface: {
          lowest: "#ffffff",
          default: "#f8f9fa",
          high: "#e7e8e9",
        },
        content: {
          primary: "#191c1d",
          secondary: "#464652",
          outline: "#777683",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        card: "8px",
        button: "8px",
      },
      boxShadow: {
        "level-1": "0 4px 12px rgba(0, 0, 0, 0.05)",
        "level-2": "0 12px 32px rgba(0, 0, 0, 0.1)",
        "ai-glow": "0 0 16px rgba(0, 101, 141, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Phụ lục B: Checklist trước khi merge UI

- [ ] Tất cả component tuân thủ design tokens (màu, spacing, font) trong guideline
- [ ] Responsive trên 3 breakpoints: Mobile (375px), Tablet (768px), Desktop (1280px)
- [ ] Dark mode hoạt động chính xác
- [ ] Keyboard navigation hoạt động (Tab, Enter, Escape)
- [ ] Color contrast ratio ≥ 4.5:1 (kiểm tra bằng axe DevTools)
- [ ] Tất cả ảnh có `alt` text
- [ ] Loading states (skeleton/spinner) cho mọi async operation
- [ ] Empty states cho mọi danh sách có thể rỗng
- [ ] Error states cho mọi form và API call
- [ ] Animation respect `prefers-reduced-motion`
- [ ] Text tiếng Việt hiển thị đúng dấu trên mọi font size
- [ ] Performance: Lighthouse score ≥ 90 (Performance, Accessibility)

---

> **Lưu ý:** Tài liệu này là "living document" — sẽ được cập nhật liên tục trong quá trình phát triển. Mọi thay đổi về design token hoặc pattern mới cần được cập nhật vào đây TRƯỚC khi implement.

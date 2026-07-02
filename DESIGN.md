---
name: Lumina Library
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464652'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777683'
  outline-variant: '#c7c5d4'
  surface-tint: '#4f54b4'
  primary: '#15157d'
  on-primary: '#ffffff'
  primary-container: '#2e3192'
  on-primary-container: '#9da1ff'
  inverse-primary: '#c0c1ff'
  secondary: '#00658d'
  on-secondary: '#ffffff'
  secondary-container: '#2dbcfe'
  on-secondary-container: '#004866'
  tertiary: '#3e0070'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c00a2'
  on-tertiary-container: '#c792ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#04006d'
  on-primary-fixed-variant: '#373a9b'
  secondary-fixed: '#c6e7ff'
  secondary-fixed-dim: '#82cfff'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#004c6b'
  tertiary-fixed: '#efdbff'
  tertiary-fixed-dim: '#dcb8ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6700b5'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1440px
  sidebar-width: 280px
---

## Brand & Style
The design system is built on the philosophy of **"Illuminated Intelligence."** It balances the authoritative weight of a traditional library with the frictionless speed of modern AI. The aesthetic is **Clean Tech**: a synthesis of Corporate Modernism and high-end SaaS design.

The target audience includes both academic researchers seeking precision and casual readers looking for effortless discovery. The emotional response should be one of "quiet confidence"—where the technology is powerful but never overwhelming. We prioritize deep whitespace, razor-sharp alignment, and purposeful motion to guide users through vast data landscapes.

## Colors
The palette uses **Deep Indigo** as the anchor for trust and academic tradition, while **Electric Blue** signals the AI-powered core. 

- **Primary:** Deep Indigo is used for persistent UI elements like headers, sidebar backgrounds, and primary actions.
- **Secondary:** Electric Blue is reserved for interactive states, progress indicators, and links.
- **AI Accent:** A signature gradient moving from Electric Blue to Deep Purple is used exclusively for "Intelligent" features—Semantic Search focus states, AI Chatbot bubbles, and "Recommended for You" badges.
- **Neutrals:** We utilize a "Cool Gray" scale to maintain a clinical, clean environment. Backgrounds use a layered approach of White (#FFFFFF) and Soft Gray (#F8F9FA) to separate content zones.

## Typography
This design system utilizes **Inter** for all primary interfaces to ensure maximum legibility and a neutral, professional tone. Its tall x-height makes it ideal for data-dense library catalogs.

For technical metadata (ISBNs, call numbers, system logs), we introduce **JetBrains Mono** to provide a subtle "tech-forward" distinction that separates administrative data from literary content. 

**Hierarchy Rules:**
- **Titles:** Use Semi-bold (600) for section headers to provide strong visual anchoring.
- **Body:** Standardize on 16px for readability. For sidebars and secondary meta-information, drop to 14px.
- **Micro-copy:** Use the Label-caps style for category tags and status badges.

## Layout & Spacing
The design system employs a **12-column fluid grid** for the main catalog and a **fixed sidebar** for the management backoffice.

- **Desktop (1440px+):** 24px margins with 24px gutters. The sidebar is fixed at 280px.
- **Tablet (768px - 1439px):** 16px margins. Sidebar collapses into a rail or becomes a hidden drawer.
- **Mobile (<767px):** 16px margins. Layout reflows to a single column; the top bar becomes the primary navigation hub.

Spacing follows an 8px geometric scale. Use `lg` (24px) for padding within book cards and `xl` (48px) for vertical section breathing room.

## Elevation & Depth
Depth in this design system is used to indicate "interactability" and "intelligence." 

- **Level 0 (Flat):** Main background surfaces and secondary input fields.
- **Level 1 (Subtle):** Book cards and navigation bars. Use a highly diffused shadow: `0 4px 12px rgba(0, 0, 0, 0.05)`.
- **Level 2 (Active):** Modals, dropdowns, and hovered cards. Increase shadow to `0 12px 32px rgba(0, 0, 0, 0.1)`.
- **The "AI Glow":** For AI-specific components like the Semantic Search bar, use a soft outer glow instead of a traditional shadow, utilizing the `secondary_color_hex` at 20% opacity to suggest energy and activity.

## Shapes
We use a **Rounded** (8px) corner strategy to soften the corporate feel and make the interface more approachable. 

- **Small Components:** Checkboxes and small tags use 4px (Soft).
- **Standard Components:** Buttons, Cards, and Inputs use 8px (Rounded).
- **AI Components:** The AI Chatbot trigger and floating search bars use a **Pill-shape** (fully rounded) to differentiate them from standard structural elements.

## Components

### Buttons
- **Primary:** Solid Deep Indigo with white text. High contrast for critical actions (e.g., "Borrow," "Save Changes").
- **Secondary (Ghost):** Electric Blue border and text with a transparent background. Used for "View Details" or "Cancel."
- **AI Action:** Gradient background with white text, used specifically for "Generate Summary" or "Start AI Search."

### Cards
Cards for book displays should be white with a Level 1 shadow. The book cover should have a slight 2px border radius. Metadata (Title, Author) is aligned left, while the "AI Match Score" is displayed as a circular pill in the top-right corner.

### AI Semantic Search
The search bar is the centerpiece. It is larger than standard inputs (56px height) and features a persistent 2px stroke using the AI Gradient. On focus, it emits a soft Electric Blue glow.

### Navigation
- **Top Bar (Public):** Transparent-to-white blur effect (Glassmorphism) with high-density navigation links.
- **Sidebar (Admin):** Deep Indigo background with "Active State" indicators using a vertical Electric Blue bar on the left edge of the menu item.

### Form Fields
Inputs use a Soft Gray (#F8F9FA) background with no border in their default state, gaining a 1px Indigo border on focus to minimize visual noise during data entry.
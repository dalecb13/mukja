# Mukja Brand & Style Guide

> 먹자 (mukja) — "Let's eat!" in Korean

## Brand Essence

Mukja is about the joy of discovering and sharing food experiences with friends. Our design reflects warmth, community, and the rich visual language of Korean cuisine.

---

## Color Palette

### Primary — Gochugaru Red
Inspired by Korean chili flakes. Warm, inviting, appetizing.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | `#E03E3E` | Main actions, CTAs |
| `primary-600` | `#C92A2A` | Hover states |
| `primary-700` | `#A61E1E` | Active states |

### Secondary — Sesame
Warm neutrals inspired by sesame seeds. Grounding and sophisticated.

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-100` | `#F8F6F3` | Card backgrounds |
| `secondary-500` | `#A69783` | Subtle accents |
| `secondary-800` | `#544838` | Text on light |

### Accent — Banchan Green
Fresh and vibrant, like Korean side dishes.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-500` | `#22C55E` | Success, positive |

### Warm — Doenjang Gold
Rich and earthy, like fermented soybean paste.

| Token | Hex | Usage |
|-------|-----|-------|
| `warm-500` | `#D97706` | Highlights, badges |

### Background
- **Primary**: `#FFFBF7` — Warm off-white (like rice paper)
- **Secondary**: `#F8F6F3` — Subtle warmth
- **Inverse**: `#1C1917` — Dark mode base

---

## Typography

### Font Families

**Display & Headings**: Fraunces
- A soft optical serif with personality
- Used for hero text, headings, brand moments
- Web: `"Fraunces", Georgia, serif`

**Body**: DM Sans
- Clean, modern, highly readable
- Used for all body text, UI elements
- Web: `"DM Sans", system-ui, sans-serif`

### Type Scale

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| Display Large | 60px | Bold | Hero headlines |
| Display Medium | 48px | Bold | Page titles |
| H1 | 30px | Bold | Section headers |
| H2 | 24px | Semibold | Card titles |
| H3 | 20px | Semibold | Subsections |
| Body Large | 18px | Regular | Lead paragraphs |
| Body Medium | 16px | Regular | Default body |
| Body Small | 14px | Regular | Secondary text |
| Caption | 12px | Regular | Helper text |

---

## Spacing

Based on an **8px grid** with 4px half-steps.

```
4px  → Fine details (icon padding)
8px  → Tight spacing (inline elements)
16px → Standard spacing (component padding)
24px → Comfortable spacing (section gaps)
32px → Generous spacing (card padding)
48px → Section spacing
64px → Page section breaks
```

---

## Border Radius

Soft, approachable corners—like Korean ceramic bowls.

| Token | Value | Usage |
|-------|-------|-------|
| `radius-md` | 8px | Inputs, small cards |
| `radius-lg` | 12px | Buttons, badges |
| `radius-xl` | 16px | Cards, containers |
| `radius-2xl` | 20px | Modals |
| `radius-full` | 9999px | Avatars, pills |

---

## Shadows

Warm, soft shadows that feel like candlelight.

```css
/* Elevation levels */
--shadow-sm   /* Cards, inputs */
--shadow-md   /* Dropdowns, popovers */
--shadow-lg   /* Modals, floating elements */

/* Glow effects for emphasis */
--shadow-primary-glow  /* Primary button focus */
--shadow-accent-glow   /* Success states */
```

---

## Animation

### Principles
1. **Purposeful** — Motion guides, not distracts
2. **Natural** — Inspired by steam rising from food
3. **Quick** — Responsive, not sluggish

### Timing
- **Fast**: 150ms — Micro-interactions (hover, toggle)
- **Normal**: 200ms — Standard transitions
- **Slow**: 300ms — Emphasis, entrances

### Easing
- **Default**: `ease-out` — Natural deceleration
- **Spring**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` — Playful bounce

---

## Component Guidelines

### Buttons

```tsx
// Primary - Main actions
<Button variant="primary" text="Find Restaurants" />

// Secondary - Less emphasis
<Button variant="secondary" text="View Details" />

// Outline - Tertiary actions
<Button variant="outline" text="Cancel" />

// Ghost - Minimal visual weight
<Button variant="ghost" text="Skip" />
```

### Cards
- Background: `secondary-100` or white
- Border radius: `radius-xl` (16px)
- Shadow: `shadow-sm`
- Padding: 24px

### Inputs
- Border radius: `radius-md` (8px)
- Border: 1px `neutral-300`
- Focus ring: `primary-500` with glow

---

## Usage

### React Native
```tsx
import { theme, colors, Button } from '@repo/ui';

// Use tokens directly
const styles = {
  backgroundColor: colors.background.primary,
  padding: theme.spacing[4],
};
```

### Web (Next.js)
```css
/* Import CSS variables */
@import '@repo/ui/styles/variables.css';

.card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}
```

---

## Google Fonts Import

Add to your HTML `<head>` or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap" rel="stylesheet">
```

---

*Last updated: December 2024*


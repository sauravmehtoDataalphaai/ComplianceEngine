# Compact Design System
## Rule-Craft UI/UX Design System

### 🎯 Design Principles
- **Compact & Dense**: Maximize information density without sacrificing readability
- **Consistent**: Uniform spacing, typography, and component sizes
- **Responsive**: Seamless experience across all screen sizes
- **Modern**: Clean Shadcn UI aesthetic with Tailwind CSS

---

## 📐 Spacing Scale

### Padding & Margin
```css
p-2    /* 8px  - Tight spacing for compact elements */
p-2.5  /* 10px - Small padding */
p-3    /* 12px - Standard compact padding */
p-3.5  /* 14px - Medium padding */
p-4    /* 16px - Larger padding (use sparingly) */
```

### Gaps
```css
gap-1    /* 4px  - Minimal gap */
gap-1.5  /* 6px  - Small gap */
gap-2    /* 8px  - Standard compact gap */
gap-2.5  /* 10px - Medium gap */
gap-3    /* 12px - Larger gap (use sparingly) */
```

### Vertical Spacing
```css
space-y-1    /* 4px  - Minimal vertical spacing */
space-y-1.5  /* 6px  - Small vertical spacing */
space-y-2    /* 8px  - Standard compact spacing */
space-y-2.5  /* 10px - Medium vertical spacing */
space-y-3    /* 12px - Larger spacing (use sparingly) */
```

---

## 📝 Typography Scale

### Font Sizes
```css
text-xs   /* 12px - Body text, descriptions, labels */
text-sm   /* 14px - Small headings, emphasized text */
text-base /* 16px - Card titles, section headings */
text-lg   /* 18px - Page titles (sm breakpoint) */
text-xl   /* 20px - Page titles (desktop) */
```

### Font Weights
```css
font-normal   /* 400 - Body text */
font-medium   /* 500 - Labels, emphasized text */
font-semibold /* 600 - Headings, titles */
```

### Line Heights
```css
leading-none      /* 1.0 - Tight headings */
leading-tight     /* 1.25 - Compact text */
leading-relaxed   /* 1.625 - Readable body text */
```

---

## 🎨 Component Sizes

### Buttons
```css
/* Default */
min-h-8 px-3 py-1.5 text-xs

/* Small */
min-h-7 px-2.5 text-xs

/* Large */
min-h-9 px-6

/* Icon */
h-8 w-8
```

### Form Elements
```css
/* Input */
h-8 px-2.5 py-1.5 text-xs

/* Select */
h-8 px-2.5 py-1.5 text-xs

/* Textarea */
min-h-[60px] px-2.5 py-1.5 text-xs

/* Label */
text-xs font-medium
```

### Cards
```css
/* Header */
p-3 sm:p-4 space-y-1

/* Content */
p-3 sm:p-4 pt-0

/* Footer */
p-3 sm:p-4 pt-0
```

### Icons
```css
h-3.5 w-3.5  /* Small icons (buttons, inline) */
h-4 w-4      /* Standard icons */
h-5 w-5      /* Larger icons (use sparingly) */
```

---

## 🎯 Layout Patterns

### Page Container
```tsx
<div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
```

### Flex Container
```tsx
<div className="flex items-center gap-2 sm:gap-3 flex-wrap">
```

### Form Section
```tsx
<div className="space-y-2 sm:space-y-3">
```

---

## 🎨 Color Usage

### Text Colors
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text, descriptions
- `text-destructive` - Errors, warnings
- `text-emerald-600` - Success states
- `text-amber-600` - Warning states

### Background Colors
- `bg-background` - Main background
- `bg-card` - Card backgrounds
- `bg-muted` - Subtle backgrounds, code blocks
- `bg-primary` - Primary actions
- `bg-secondary` - Secondary elements

---

## 📱 Responsive Breakpoints

### Mobile First
```css
/* Base (Mobile) */
p-3 gap-2 text-xs

/* Small (Tablet) */
sm:p-4 sm:gap-3 sm:text-sm

/* Large (Desktop) */
lg:gap-4 lg:text-base
```

### Common Patterns
```tsx
// Padding
className="p-3 sm:p-4"

// Gaps
className="gap-2 sm:gap-3"

// Font sizes
className="text-xs sm:text-sm"

// Spacing
className="space-y-2 sm:space-y-3"
```

---

## 🧩 Component Standards

### Headers
```tsx
<h1 className="text-lg sm:text-xl font-semibold">
  Page Title
</h1>
<p className="text-xs text-muted-foreground mt-0.5">
  Description
</p>
```

### Cards
```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="pt-0">
    {/* Content */}
  </CardContent>
</Card>
```

### Buttons
```tsx
<Button size="sm">
  <Icon className="h-3.5 w-3.5" />
  <span className="hidden sm:inline">Full Text</span>
  <span className="sm:hidden">Short</span>
</Button>
```

### Form Fields
```tsx
<div className="space-y-1.5">
  <Label htmlFor="field">Label</Label>
  <Input id="field" placeholder="..." />
</div>
```

---

## ✅ Checklist for New Components

- [ ] Uses compact spacing (p-2, p-3, gap-2, gap-3)
- [ ] Font sizes are xs or sm (text-xs, text-sm)
- [ ] Responsive with sm: breakpoints
- [ ] Icons are h-3.5 w-3.5 or h-4 w-4
- [ ] Consistent with existing components
- [ ] No layout breaking on mobile
- [ ] Proper line-height for readability
- [ ] Uses design system colors

---

## 📊 Spacing Reference

| Use Case | Spacing |
|----------|---------|
| Page padding | `p-3 sm:p-4` |
| Card padding | `p-3 sm:p-4` |
| Card header | `p-3 sm:p-4` |
| Card content | `p-3 sm:p-4 pt-0` |
| Button padding | `px-3 py-1.5` |
| Input padding | `px-2.5 py-1.5` |
| Element gaps | `gap-2 sm:gap-3` |
| Section spacing | `space-y-2 sm:space-y-3` |
| Icon sizes | `h-3.5 w-3.5` or `h-4 w-4` |

---

## 🎯 Typography Reference

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title | `text-lg sm:text-xl` | `font-semibold` | `leading-tight` |
| Card Title | `text-base` | `font-semibold` | `leading-tight` |
| Body Text | `text-xs` | `font-normal` | `leading-relaxed` |
| Labels | `text-xs` | `font-medium` | `leading-tight` |
| Descriptions | `text-xs` | `font-normal` | `leading-relaxed` |
| Code | `text-xs` | `font-mono` | `leading-tight` |

---

## 🔧 Tailwind Config Extensions

```js
// Compact spacing scale
spacing: {
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '3.5': '14px',
  '4': '16px',
}
```

---

## 📱 Responsive Patterns

### Mobile-First Approach
Always start with mobile styles, then add larger breakpoints:

```tsx
// ❌ Bad
className="p-6 sm:p-4"

// ✅ Good
className="p-3 sm:p-4"
```

### Adaptive Text
```tsx
// Hide/show text based on screen size
<span className="hidden sm:inline">Full Text</span>
<span className="sm:hidden">Short</span>
```

### Flexible Layouts
```tsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
```

---

## 🎨 Visual Hierarchy

1. **Primary**: Page titles, main headings
2. **Secondary**: Card titles, section headings
3. **Tertiary**: Body text, descriptions
4. **Muted**: Helper text, timestamps

Use font size, weight, and color to establish hierarchy while maintaining compact design.


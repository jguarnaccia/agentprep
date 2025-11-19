# 📁 AgentPrep New UI Architecture

## Complete File Structure

```
agentprep/
│
├── 📱 app/
│   ├── 🎨 styles/
│   │   └── theme.ts                    # Mantine theme (colors, fonts, spacing)
│   │
│   ├── layout.tsx                      # ✨ UPDATED - Mantine providers
│   ├── page.tsx                        # ✨ REDESIGNED - Beautiful landing page
│   ├── globals.css                     # Existing global styles
│   │
│   ├── 🏠 dashboard/
│   │   └── page.tsx                    # ✨ NEW - Complete dashboard
│   │
│   ├── 📘 example/
│   │   └── page.tsx                    # ✨ NEW - Component showcase
│   │
│   ├── 📚 study/
│   │   └── page.tsx                    # ⏳ TO MIGRATE - Wrap with AppLayout
│   │
│   ├── 🎴 flashcards/
│   │   └── page.tsx                    # ⏳ TO MIGRATE - Use FlashcardTemplate
│   │
│   ├── 🧠 scenarios/
│   │   └── page.tsx                    # ⏳ TO MIGRATE - Use LessonTemplate
│   │
│   ├── 📖 guide/
│   │   └── page.tsx                    # ⏳ TO MIGRATE - Use LessonTemplate
│   │
│   ├── ✨ ai-generator/
│   │   └── page.tsx                    # ⏳ TO MIGRATE - Wrap with AppLayout
│   │
│   ├── 📝 notes/
│   │   └── page.tsx                    # ⏳ TO MIGRATE - Wrap with AppLayout
│   │
│   └── 📊 my-tests/
│       └── page.tsx                    # ⏳ TO MIGRATE - Wrap with AppLayout
│
├── 🧩 components/
│   ├── 🏗️ layout/
│   │   └── AppLayout.tsx               # ✨ NEW - Sidebar + Header navigation
│   │
│   ├── 📄 templates/
│   │   ├── DashboardTemplate.tsx       # ✨ NEW - Dashboard layout
│   │   ├── LessonTemplate.tsx          # ✨ NEW - Study/lesson layout
│   │   ├── FlashcardTemplate.tsx       # ✨ NEW - Flashcard with 3D flip
│   │   ├── GameTemplate.tsx            # ✨ NEW - Game/Jeopardy layout
│   │   ├── NegotiationTemplate.tsx     # ✨ NEW - Contract simulator
│   │   └── index.ts                    # Template exports
│   │
│   ├── 🎨 ui/
│   │   ├── StatCard.tsx                # ✨ NEW - Stat display card
│   │   ├── FeatureCard.tsx             # ✨ NEW - Feature card component
│   │   ├── LoadingState.tsx            # ✨ NEW - Loading UI
│   │   ├── ErrorState.tsx              # ✨ NEW - Error display
│   │   └── index.ts                    # UI exports
│   │
│   ├── QuestionCard.tsx                # ✅ EXISTING - Keep as is
│   ├── FlashcardCard.tsx               # ✅ EXISTING - Keep as is
│   ├── StudyGuide.tsx                  # ✅ EXISTING - Keep as is
│   ├── StudyGuideV2.tsx                # ✅ EXISTING - Keep as is
│   └── NotesTab.tsx                    # ✅ EXISTING - Keep as is
│
├── 📚 lib/
│   ├── 🎬 animations/
│   │   ├── variants.ts                 # ✨ NEW - Animation presets
│   │   └── index.ts                    # Animation exports
│   │
│   ├── supabase.ts                     # ✅ EXISTING - Database client
│   ├── types.ts                        # ✅ EXISTING - TypeScript types
│   ├── progress.ts                     # ✅ EXISTING - Progress tracking
│   └── flashcard-utils.ts              # ✅ EXISTING - Flashcard helpers
│
├── 📦 Configuration Files
│   ├── package.json                    # ✨ UPDATED - New dependencies
│   ├── postcss.config.mjs              # ✨ UPDATED - Mantine config
│   ├── tsconfig.json                   # ✅ EXISTING
│   ├── next.config.ts                  # ✅ EXISTING
│   └── tailwind.config.ts              # ✅ EXISTING
│
└── 📖 Documentation
    ├── QUICK-START.md                  # ✨ NEW - Quick installation guide
    ├── MIGRATION-GUIDE.md              # ✨ NEW - Detailed migration steps
    ├── UI-REDESIGN-COMPLETE.md         # ✨ NEW - Complete feature overview
    ├── MANTINE-SETUP-INSTRUCTIONS.md   # ✨ NEW - Setup instructions
    └── README.md                       # ✅ EXISTING - Project readme
```

---

## 🎯 What Each File Does

### 🎨 Theme & Styling
- **`theme.ts`** - Central configuration for colors, fonts, spacing, shadows
- **`globals.css`** - Custom CSS and Tailwind utilities

### 🏗️ Layout
- **`AppLayout.tsx`** - Wrapper with sidebar navigation + header (use on every page)

### 📄 Templates (Reusable Page Layouts)
- **`DashboardTemplate`** - Stats cards, progress, activity feed
- **`LessonTemplate`** - Content with sidebar, navigation, badges
- **`FlashcardTemplate`** - 3D card flip, navigation controls
- **`GameTemplate`** - Tab-based game boards
- **`NegotiationTemplate`** - Step-by-step workflow

### 🎨 UI Components
- **`StatCard`** - Display metrics with icons and progress
- **`FeatureCard`** - Feature highlights with hover effects
- **`LoadingState`** - Consistent loading spinner
- **`ErrorState`** - Error messages with retry button

### 🎬 Animations
- **`variants.ts`** - Pre-built Framer Motion animations
  - fadeInUp, fadeInDown, fadeInLeft, fadeInRight
  - scaleIn, slideUp, flipCard
  - staggerContainer, pageTransition
  - And more!

---

## 🔄 Migration Status

### ✅ Complete
- [x] Landing page redesigned
- [x] Dashboard created
- [x] AppLayout with sidebar
- [x] 5 page templates
- [x] 4 UI components
- [x] Theme system
- [x] Animation library
- [x] Example page

### ⏳ To Migrate
- [ ] Study Mode (`/app/study/page.tsx`)
- [ ] Flashcards (`/app/flashcards/page.tsx`)
- [ ] Scenarios (`/app/scenarios/page.tsx`)
- [ ] Study Guide (`/app/guide/page.tsx`)
- [ ] AI Generator (`/app/ai-generator/page.tsx`)
- [ ] Notes (`/app/notes/page.tsx`)
- [ ] My Tests (`/app/my-tests/page.tsx`)

---

## 🎯 How Files Work Together

### Example: Study Mode Page

```tsx
// /app/study/page.tsx
import { AppLayout } from '@/components/layout/AppLayout';        // ← Layout
import { LessonTemplate } from '@/components/templates';          // ← Template
import { StatCard, LoadingState } from '@/components/ui';         // ← UI Components
import { motion } from 'framer-motion';                           // ← Animations
import { fadeInUp } from '@/lib/animations';                      // ← Animation presets
import { Button, Card, Select } from '@mantine/core';             // ← Mantine components

export default function StudyPage() {
  return (
    <AppLayout>                              {/* Sidebar + Header */}
      <motion.div variants={fadeInUp}>       {/* Animation */}
        <LessonTemplate                      {/* Page Template */}
          title="Study Mode"
          content={
            <Card>                           {/* Mantine Component */}
              <StatCard {...stats} />        {/* Custom UI Component */}
            </Card>
          }
        />
      </motion.div>
    </AppLayout>
  );
}
```

---

## 🚀 Quick Start Flow

```
1. Install dependencies
   └── npm install @mantine/core @mantine/hooks @mantine/notifications
       framer-motion @tabler/icons-react

2. Install PostCSS plugins
   └── npm install --save-dev postcss-preset-mantine postcss-simple-vars

3. Start dev server
   └── npm run dev

4. View new pages
   ├── Landing: localhost:3000
   ├── Dashboard: localhost:3000/dashboard
   └── Examples: localhost:3000/example

5. Migrate existing pages
   └── Wrap with <AppLayout>
   └── Replace Tailwind with Mantine
   └── Add animations
```

---

## 💡 Key Concepts

### 1. **Everything is Modular**
   - Templates provide structure
   - UI components are reusable
   - Animations are pre-configured
   - Theme changes apply globally

### 2. **Three Layers of Styling**
   ```
   Theme (theme.ts)
      ↓
   Mantine Components (Button, Card, etc.)
      ↓
   Custom Components (StatCard, FeatureCard, etc.)
   ```

### 3. **Consistent Patterns**
   - All pages wrapped in `<AppLayout>`
   - All content uses Mantine components
   - All animations use motion variants
   - All colors from theme

---

## 🎨 Color System

```typescript
// Red shades (patriotic red)
red[0] → lightest
red[5] → primary ← Use this most
red[9] → darkest

// Blue shades (patriotic blue)
blue[0] → lightest
blue[5] → primary ← Use this most
blue[9] → darkest

// Dark theme colors
dark[0] → lightest (text)
dark[8] → darkest (background)
```

---

## ✅ Migration Checklist

For each page:
- [ ] Import `AppLayout`
- [ ] Wrap content with `<AppLayout>`
- [ ] Replace `<div>` with `<Card>` or `<Paper>`
- [ ] Replace buttons with `<Button>`
- [ ] Replace inputs with Mantine form components
- [ ] Add motion animations
- [ ] Test responsiveness
- [ ] Verify dark theme works

---

## 🆘 Common Issues

### "Mantine styles not loading"
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

### "Icons not showing"
- Install: `npm install @tabler/icons-react`

### "Theme not applying"
- Check `theme` is imported in `layout.tsx`
- Verify `MantineProvider` wraps app

---

## 📚 Resources

- **Mantine Docs:** https://mantine.dev
- **Framer Motion:** https://www.framer.com/motion/
- **Tabler Icons:** https://tabler.io/icons
- **Example Page:** http://localhost:3000/example

---

**Ready to build? Let's go! 🚀**

# 🎨 AgentPrep UI Redesign - Complete Migration Guide

## 📦 What's Been Created

### ✅ New Architecture
```
/app
  /styles
    theme.ts                    # Mantine theme configuration
  layout.tsx                    # Updated with Mantine providers
  page.tsx                      # Redesigned landing page
  /dashboard
    page.tsx                    # New dashboard page

/components
  /layout
    AppLayout.tsx               # Main app shell with sidebar + header
  /templates
    DashboardTemplate.tsx       # Dashboard page template
    LessonTemplate.tsx          # Lesson/content page template
    FlashcardTemplate.tsx       # Flashcard study template
    GameTemplate.tsx            # Game/Jeopardy template
    NegotiationTemplate.tsx     # Contract negotiation template
    index.ts                    # Template exports
```

## 🚀 Installation Steps

### 1. Install Required Packages

```bash
npm install @mantine/core@7.15.1 @mantine/hooks@7.15.1 @mantine/notifications@7.15.1 framer-motion@11.15.0 @tabler/icons-react@3.29.0
```

### 2. Install PostCSS Plugins

```bash
npm install --save-dev postcss-preset-mantine postcss-simple-vars
```

### 3. Verify Installation

```bash
npm run dev
```

Visit `http://localhost:3000` to see the new landing page!

---

## 🎯 How to Use the Templates

### Dashboard Template Example

```tsx
import { DashboardTemplate } from '@/components/templates';

<DashboardTemplate
  stats={[
    {
      title: 'Questions',
      value: '247',
      icon: <IconBook size={28} />,
      color: 'blue',
      subtitle: '832 total',
      progress: 30,
    },
  ]}
  progressOverview={<YourProgressComponent />}
  recentActivity={<YourActivityComponent />}
  quickActions={<YourActionsComponent />}
/>
```

### Lesson Template Example

```tsx
import { LessonTemplate } from '@/components/templates';

<LessonTemplate
  title="Salary Cap Basics"
  category="Article VII"
  difficulty="medium"
  content={<YourLessonContent />}
  navigation={{
    onNext: () => goToNext(),
    onPrevious: () => goToPrevious(),
    hasNext: true,
    hasPrevious: true,
  }}
  sidebar={<YourSidebarContent />}
/>
```

### Flashcard Template Example

```tsx
import { FlashcardTemplate } from '@/components/templates';

<FlashcardTemplate
  front={<Text>Question here</Text>}
  back={<Text>Answer here</Text>}
  isFlipped={flipped}
  onFlip={() => setFlipped(!flipped)}
  currentCard={1}
  totalCards={100}
  onNext={() => nextCard()}
  onPrevious={() => prevCard()}
  category="Salary Cap"
  difficulty="medium"
/>
```

---

## 📝 Migrating Existing Pages

### Step 1: Wrap with AppLayout

**Before:**
```tsx
export default function StudyPage() {
  return (
    <div>
      {/* your content */}
    </div>
  );
}
```

**After:**
```tsx
import { AppLayout } from '@/components/layout/AppLayout';

export default function StudyPage() {
  return (
    <AppLayout>
      {/* your content */}
    </AppLayout>
  );
}
```

### Step 2: Replace UI Components

**Before (Tailwind):**
```tsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-2xl font-bold">Title</h2>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Click me
  </button>
</div>
```

**After (Mantine):**
```tsx
import { Card, Title, Button } from '@mantine/core';

<Card shadow="sm" padding="lg" radius="md">
  <Title order={2}>Title</Title>
  <Button color="blue">
    Click me
  </Button>
</Card>
```

### Step 3: Add Animations

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <YourContent />
</motion.div>
```

---

## 🎨 Theme Customization

Edit `/app/styles/theme.ts` to customize:

```typescript
export const theme: MantineThemeOverride = {
  primaryColor: 'red',  // Change to 'blue', 'green', etc.
  
  colors: {
    // Add custom color palettes
  },
  
  fontFamily: 'Your Font, sans-serif',
  
  // Adjust spacing, shadows, radius, etc.
};
```

---

## 🔄 Page-by-Page Migration Plan

### ✅ Already Completed
- [x] Landing page (`/`)
- [x] Dashboard (`/dashboard`)
- [x] App layout with sidebar
- [x] Theme configuration

### 📋 To Migrate (Priority Order)

#### 1. Study Mode (`/app/study/page.tsx`)
**Current State:** Fully functional with 832 questions
**Migration Steps:**
1. Wrap with `<AppLayout>`
2. Use `LessonTemplate` for question display
3. Replace filter UI with Mantine components
4. Add smooth transitions

**Example Migration:**
```tsx
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button, Group, Badge } from '@mantine/core';

export default function StudyPage() {
  return (
    <AppLayout>
      <Card>
        {/* Your existing study logic */}
      </Card>
    </AppLayout>
  );
}
```

#### 2. Flashcards (`/app/flashcards/page.tsx`)
**Use:** `FlashcardTemplate`
**Features to add:**
- Card flip animations (already in template)
- Progress tracking UI
- Filter sidebar with Mantine components

#### 3. Scenarios (`/app/scenarios/page.tsx`)
**Use:** `LessonTemplate` or custom layout
**Features:**
- Scenario cards with Mantine styling
- Reading progress indicator
- Navigation between scenarios

#### 4. Study Guide (`/app/guide/page.tsx`)
**Use:** `LessonTemplate`
**Features:**
- Table of contents sidebar
- Article navigation
- Search functionality with Mantine

#### 5. AI Test Generator (`/app/ai-generator/page.tsx`)
**Use:** Custom layout with Mantine forms
**Features:**
- Form inputs for test parameters
- Loading states with Mantine loaders
- Results display with cards

#### 6. My Tests (`/app/my-tests/page.tsx`)
**Use:** List layout with Mantine table
**Features:**
- Test history table
- Score visualization
- Detail view modal

#### 7. Notes (`/app/notes/page.tsx`)
**Use:** Custom layout
**Features:**
- Rich text editor
- Notes list sidebar
- Search and filter

---

## 🎯 Common Components to Replace

### Buttons
```tsx
// Before
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click
</button>

// After
<Button color="blue">Click</Button>
```

### Cards
```tsx
// Before
<div className="bg-white rounded-lg shadow-md p-6">
  Content
</div>

// After
<Card shadow="sm" padding="lg" radius="md">
  Content
</Card>
```

### Modals
```tsx
import { Modal } from '@mantine/core';

<Modal opened={opened} onClose={close} title="Title">
  Content
</Modal>
```

### Forms
```tsx
import { TextInput, Select, Checkbox } from '@mantine/core';

<TextInput label="Name" />
<Select label="Choose" data={['Option 1', 'Option 2']} />
<Checkbox label="Agree" />
```

### Notifications
```tsx
import { notifications } from '@mantine/notifications';

notifications.show({
  title: 'Success',
  message: 'Action completed!',
  color: 'green',
});
```

---

## 🎨 Animation Patterns

### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  <YourContent />
</motion.div>
```

### Staggered Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Card>Content</Card>
</motion.div>
```

---

## 🐛 Troubleshooting

### Issue: Mantine styles not loading
**Solution:**
1. Check that `@mantine/core/styles.css` is imported in `layout.tsx`
2. Clear `.next` folder: `rm -rf .next`
3. Restart dev server

### Issue: Icons not showing
**Solution:**
```bash
npm install @tabler/icons-react
```

### Issue: Theme not applying
**Solution:**
Verify `theme.ts` is properly imported in `layout.tsx`:
```tsx
import { theme } from './styles/theme';
<MantineProvider theme={theme}>
```

### Issue: PostCSS errors
**Solution:**
```bash
npm install --save-dev postcss-preset-mantine postcss-simple-vars
```

---

## 📚 Resources

- **Mantine Docs:** https://mantine.dev
- **Framer Motion:** https://www.framer.com/motion/
- **Tabler Icons:** https://tabler.io/icons

---

## ✅ Next Steps

1. **Install dependencies** (see Installation Steps above)
2. **Test the new landing page** at `/`
3. **Visit the dashboard** at `/dashboard`
4. **Start migrating pages** one by one using the templates
5. **Customize the theme** in `/app/styles/theme.ts`
6. **Add animations** to enhance user experience

---

## 🎯 Migration Checklist

- [ ] Install Mantine packages
- [ ] Install PostCSS plugins
- [ ] Test landing page
- [ ] Test dashboard
- [ ] Migrate Study Mode
- [ ] Migrate Flashcards
- [ ] Migrate Scenarios
- [ ] Migrate Study Guide
- [ ] Migrate AI Test Generator
- [ ] Migrate My Tests
- [ ] Migrate Notes
- [ ] Add animations throughout
- [ ] Customize theme colors
- [ ] Test on mobile devices
- [ ] Final QA and polish

---

## 💪 You're Ready!

All the foundations are in place. Start with the landing page and dashboard, then migrate one page at a time. The templates make it easy to maintain consistency across the entire app.

**Need help?** Refer to the component examples in this guide or check the Mantine documentation.

Good luck! 🚀

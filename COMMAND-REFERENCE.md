# ⚡ Command Reference - AgentPrep UI Redesign

Quick reference for all commands you'll need during implementation.

---

## 🚀 Installation Commands

### Install All Dependencies (One Command)
```bash
npm install @mantine/core@7.15.1 @mantine/hooks@7.15.1 @mantine/notifications@7.15.1 framer-motion@11.15.0 @tabler/icons-react@3.29.0 && npm install --save-dev postcss-preset-mantine postcss-simple-vars
```

### Or Install Step by Step

**Mantine Core Packages:**
```bash
npm install @mantine/core@7.15.1 @mantine/hooks@7.15.1 @mantine/notifications@7.15.1
```

**Animation & Icons:**
```bash
npm install framer-motion@11.15.0 @tabler/icons-react@3.29.0
```

**PostCSS Plugins:**
```bash
npm install --save-dev postcss-preset-mantine postcss-simple-vars
```

---

## 🛠️ Development Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Run Linter
```bash
npm run lint
```

### Clear Build Cache
```bash
rm -rf .next
```

### Clear Node Modules (Nuclear Option)
```bash
rm -rf node_modules package-lock.json && npm install
```

---

## 🧪 Testing URLs

### After `npm run dev`, visit:

**New Pages:**
```
http://localhost:3000          # Landing page
http://localhost:3000/dashboard # Dashboard
http://localhost:3000/example   # Component examples
```

**Existing Pages (After Migration):**
```
http://localhost:3000/study          # Study Mode
http://localhost:3000/flashcards     # Flashcards
http://localhost:3000/scenarios      # Scenarios
http://localhost:3000/guide          # Study Guide
http://localhost:3000/ai-generator   # AI Test Generator
http://localhost:3000/notes          # Notes
http://localhost:3000/my-tests       # Test History
```

---

## 📦 Package Management

### Check Installed Versions
```bash
npm list @mantine/core @mantine/hooks @mantine/notifications framer-motion @tabler/icons-react
```

### Update Dependencies
```bash
npm update @mantine/core @mantine/hooks @mantine/notifications
```

### Check for Outdated Packages
```bash
npm outdated
```

---

## 🔍 Debugging Commands

### Check for TypeScript Errors
```bash
npx tsc --noEmit
```

### View Build Analysis
```bash
npm run build && npm run start
```

### Check Bundle Size
```bash
npm run build
# Look for output in .next/analyze/
```

---

## 📁 File Operations

### View Project Structure
```bash
tree -I 'node_modules|.next|.git' -L 3
```

### Find Files by Name
```bash
find . -name "*.tsx" -not -path "./node_modules/*"
```

### Count Lines of Code
```bash
find ./app ./components ./lib -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

---

## 🎨 Component Import Examples

### Layout
```typescript
import { AppLayout } from '@/components/layout/AppLayout';
```

### Templates
```typescript
import { DashboardTemplate } from '@/components/templates';
import { LessonTemplate } from '@/components/templates';
import { FlashcardTemplate } from '@/components/templates';
import { GameTemplate } from '@/components/templates';
import { NegotiationTemplate } from '@/components/templates';
```

### UI Components
```typescript
import { StatCard, FeatureCard, LoadingState, ErrorState } from '@/components/ui';
```

### Mantine Components
```typescript
import { Button, Card, Text, Title, Container, Stack, Group } from '@mantine/core';
```

### Icons
```typescript
import { IconBook, IconCards, IconBrain } from '@tabler/icons-react';
```

### Animations
```typescript
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
```

### Notifications
```typescript
import { notifications } from '@mantine/notifications';
```

---

## 🎬 Animation Usage Examples

### Basic Fade In
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  <YourContent />
</motion.div>
```

### Using Variants
```typescript
import { fadeInUp } from '@/lib/animations';

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
  <YourContent />
</motion.div>
```

### Staggered Children
```typescript
import { staggerContainer } from '@/lib/animations';

<motion.div
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎨 Mantine Component Examples

### Button
```typescript
<Button color="blue" variant="filled" size="md">
  Click Me
</Button>
```

### Card
```typescript
<Card shadow="sm" padding="lg" radius="md">
  Content
</Card>
```

### Text Input
```typescript
<TextInput
  label="Name"
  placeholder="Enter name"
  required
/>
```

### Select
```typescript
<Select
  label="Choose option"
  data={['Option 1', 'Option 2']}
/>
```

### Modal
```typescript
<Modal opened={opened} onClose={close} title="Title">
  Content
</Modal>
```

### Notification
```typescript
notifications.show({
  title: 'Success',
  message: 'Action completed',
  color: 'green',
});
```

---

## 🔧 Git Commands (If Needed)

### Commit All Changes
```bash
git add .
git commit -m "feat: implement new UI with Mantine"
git push
```

### Create Feature Branch
```bash
git checkout -b feature/ui-redesign
```

### View Changes
```bash
git status
git diff
```

---

## 📚 Documentation Commands

### Open Documentation in Browser

**Mantine:**
```bash
open https://mantine.dev
```

**Framer Motion:**
```bash
open https://www.framer.com/motion/
```

**Tabler Icons:**
```bash
open https://tabler.io/icons
```

**Next.js:**
```bash
open https://nextjs.org/docs
```

---

## 🎯 Quick Migration Template

### Wrap Existing Page with Layout
```typescript
// Before
export default function YourPage() {
  return (
    <div>
      {/* your content */}
    </div>
  );
}

// After
import { AppLayout } from '@/components/layout/AppLayout';

export default function YourPage() {
  return (
    <AppLayout>
      {/* your content */}
    </AppLayout>
  );
}
```

---

## 🚨 Troubleshooting Commands

### If Mantine Styles Don't Load
```bash
rm -rf .next
npm run dev
```

### If TypeScript Errors
```bash
npm install --save-dev @types/react@19 @types/react-dom@19
```

### If Module Not Found
```bash
npm install
npm run dev
```

### If Port 3000 Busy
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

---

## 📊 Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Build and Export
```bash
npm run build
npm run start
```

---

## 🎨 Theme Customization

### Edit Theme File
```bash
# Open in VS Code
code app/styles/theme.ts

# Or your preferred editor
nano app/styles/theme.ts
```

### Change Primary Color
Find and replace in `theme.ts`:
```typescript
primaryColor: 'red'  // Change to 'blue', 'green', etc.
```

---

## 📝 Quick Code Snippets

### Create New Stat Card
```typescript
<StatCard
  icon={<IconBook size={24} />}
  title="Your Stat"
  value="123"
  subtitle="Total count"
  color="blue"
  progress={45}
/>
```

### Create Feature Card
```typescript
<FeatureCard
  title="Feature Name"
  description="Feature description"
  icon={<IconCards size={32} />}
  color="red"
  href="/feature-page"
  badge="NEW"
/>
```

### Show Notification
```typescript
notifications.show({
  title: 'Success!',
  message: 'Your action was successful',
  color: 'green',
  icon: <IconCheck size={18} />,
});
```

---

## 🎯 All-in-One Install & Run

```bash
# Copy and paste this entire block
npm install @mantine/core@7.15.1 @mantine/hooks@7.15.1 @mantine/notifications@7.15.1 framer-motion@11.15.0 @tabler/icons-react@3.29.0 && \
npm install --save-dev postcss-preset-mantine postcss-simple-vars && \
rm -rf .next && \
npm run dev
```

**This command:**
1. Installs all dependencies
2. Installs dev dependencies
3. Clears build cache
4. Starts dev server

**Done! Visit http://localhost:3000** 🚀

---

## 📞 Quick Help

**Stuck? Check these files in order:**
1. `START-HERE-UI-REDESIGN.md` - Complete overview
2. `QUICK-START.md` - Installation guide
3. `MIGRATION-GUIDE.md` - Migration steps
4. `BEFORE-AFTER-GUIDE.md` - Code examples

**Still stuck? Visit:**
- http://localhost:3000/example (see working examples)
- https://mantine.dev (component docs)
- https://www.framer.com/motion/ (animation docs)

---

**Save this file for quick reference! ⭐**

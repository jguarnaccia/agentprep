# Component Architecture & Visual Map

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AppLayout (Mantine)                     │
│  ┌─────────────┐                                            │
│  │   Sidebar   │  ┌──────────────────────────────────────┐ │
│  │             │  │                                        │ │
│  │ Dashboard   │  │                                        │ │
│  │ Study Mode  │  │       Page Content Area                │ │
│  │ Flashcards  │  │   (Modern Study Sections)              │ │
│  │ Scenarios   │  │                                        │ │
│  │ Study Guide │  │   ┌──────────────────────────────┐    │ │
│  │ AI Generator│  │   │  FlashcardsSection           │    │ │
│  │ My Tests    │  │   │  ScenariosSection            │    │ │
│  │ Notes       │  │   │  StudyModeSection            │    │ │
│  │             │  │   │  StudyGuideSection           │    │ │
│  └─────────────┘  │   │  AITestGeneratorSection      │    │ │
│                   │   │  MyTestsSection              │    │ │
│                   │   │  NotesSection                │    │ │
│                   │   └──────────────────────────────┘    │ │
│                   └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Breakdown

### 1. FlashcardsSection
```
FlashcardsSection
├── Header (Title + Description)
├── Stats Bar (4 cards)
│   ├── Total Cards
│   ├── Mastered (Green gradient)
│   ├── Review (Amber gradient)
│   └── New (Blue gradient)
├── Flashcard Sets Grid
│   └── Card (for each set)
│       ├── Progress bar (top)
│       ├── Title + Icon
│       ├── Description
│       ├── Stats Grid (3 mini cards)
│       ├── Tags (with icons)
│       ├── Action Buttons (Study/View)
│       └── Last studied timestamp
└── Study Mode (when active)
    ├── Back button
    ├── Progress indicator
    ├── Flashcard (3D flip)
    │   ├── Front (Question)
    │   └── Back (Answer with gradient bg)
    ├── Controls
    │   ├── Previous button
    │   ├── Mark Difficult button
    │   ├── Flip button
    │   └── Next button
    └── Keyboard shortcuts hint
```

### 2. ScenariosSection
```
ScenariosSection
├── Header
├── Stats Bar (3 cards)
│   ├── Completed
│   ├── Success Rate (Purple gradient)
│   └── Avg Time
├── Scenarios Grid
│   └── Scenario Card
│       ├── Difficulty badge
│       ├── Topic badge
│       ├── Title
│       ├── Description
│       └── Arrow icon
└── Active Scenario View
    ├── Back button
    ├── Badges (Difficulty + Topic)
    ├── Title + Description
    ├── Scenario Card
    │   ├── Situation (with icon)
    │   ├── Question
    │   └── Answer Options (4 buttons)
    ├── Submit button
    └── Result + Explanation (after submit)
        ├── Result Banner (Correct/Incorrect)
        ├── AI Explanation Card
        └── Next Scenario button
```

### 3. StudyModeSection
```
StudyModeSection
├── Header
├── Hero CTA Card (Gradient)
│   ├── Icon + Title
│   ├── Quick Stats (3 cards)
│   └── Begin Study button
├── Stats Grid (4 cards)
│   ├── Sessions
│   ├── Questions (Emerald gradient)
│   ├── Best Streak (Amber gradient)
│   └── Accuracy (Blue gradient)
├── Weekly Progress Card
│   ├── Goal text
│   ├── Percentage
│   └── Progress bar
├── Study Recommendations (2 cards)
│   ├── Focus Areas Card
│   │   └── List of weak topics
│   └── Recent Achievements Card
│       └── Achievement badges
└── Study Tips Card (Blue gradient)
```

### 4. StudyGuideSection
```
StudyGuideSection (Two-panel layout)
├── Left Sidebar
│   ├── Header + Search
│   ├── Article List
│   │   └── Article Item (collapsible)
│   │       ├── Article title
│   │       └── Section list
│   │           └── Section button
│   └── Bookmarks Section
└── Main Content Area
    ├── Section Header
    │   ├── Section number badge
    │   ├── Highlighted badge (if highlighted)
    │   ├── Title
    │   └── Action buttons
    │       ├── Highlight
    │       ├── Bookmark
    │       └── Ask AI
    ├── Content Card
    │   ├── Main text
    │   └── Subsections (if any)
    ├── Key Points Card (Blue gradient)
    └── Related Sections Card
```

### 5. AITestGeneratorSection
```
AITestGeneratorSection
├── Header (with icon)
├── Main Card
│   ├── Stats Banner (Gradient top)
│   │   ├── Tests Generated
│   │   ├── Avg Score
│   │   └── Total Questions
│   ├── Form Sections
│   │   ├── Number Selection (4 buttons)
│   │   ├── Topics Grid (8 checkboxes)
│   │   ├── Difficulty Selection (4 buttons)
│   │   └── Additional Options (checkbox)
│   ├── Test Preview Card (Violet gradient)
│   ├── Validation Warning (if needed)
│   └── Generate Button
└── Pro Tips Card
```

### 6. MyTestsSection
```
MyTestsSection
├── Header
├── Stats Overview (4 cards)
│   ├── Tests Taken
│   ├── Avg Score (Indigo gradient)
│   ├── Questions (Emerald gradient)
│   └── Study Time (Violet gradient)
├── Filter Buttons (5 options)
├── Test History List
│   └── Test Card
│       ├── Header (Title + Difficulty badge)
│       ├── Metadata (Date, Time, Questions)
│       ├── Score Badge (Color-coded)
│       ├── Progress Bar
│       ├── Topics (Tags)
│       └── Action Buttons
│           ├── Review Answers
│           ├── Retake Test
│           └── View Analytics
└── Performance Insights Card (Indigo gradient)
```

### 7. NotesSection
```
NotesSection (Two-panel layout)
├── Left Sidebar
│   ├── Header + New Button
│   ├── Search Bar
│   ├── Notes List
│   │   └── Note Card
│   │       ├── Title
│   │       ├── Content preview
│   │       ├── Tags
│   │       └── Date
│   └── Stats Footer
└── Main Content Area
    ├── Create Mode (when creating)
    │   ├── Title input
    │   ├── Content textarea
    │   └── Create/Cancel buttons
    ├── View Mode (when viewing)
    │   ├── Note Header
    │   │   ├── Title + Actions
    │   │   ├── Metadata
    │   │   ├── Tags
    │   │   └── Linked Article
    │   ├── Content Card
    │   └── AI Summary Card (Violet gradient)
    └── Empty State (no note selected)
        └── Create prompt
```

## 🎨 Color System by Section

### Flashcards
- **Primary**: Blue (#3B82F6) → Indigo (#4F46E5)
- **Accent**: Red (#EF4444) for cards icon
- **Background**: Slate → Blue/Indigo gradients

### Scenarios  
- **Primary**: Purple (#A855F7) → Pink (#EC4899)
- **Accent**: Various for difficulty badges
- **Background**: Slate → Purple/Pink gradients

### Study Mode
- **Primary**: Emerald (#10B981) → Teal (#14B8A6)
- **Accent**: Amber (#F59E0B) for streaks
- **Background**: Slate → Emerald/Teal gradients

### Study Guide
- **Primary**: Blue (#3B82F6) → Indigo (#4F46E5)
- **Accent**: Yellow (#EAB308) for highlights
- **Background**: Slate → Amber/Orange gradients

### AI Generator
- **Primary**: Violet (#8B5CF6) → Purple (#A855F7)
- **Accent**: Amber (#F59E0B) for warnings
- **Background**: Slate → Violet/Purple gradients

### My Tests
- **Primary**: Indigo (#4F46E5) → Blue (#3B82F6)
- **Accent**: Green/Red for scores
- **Background**: Slate → Indigo/Blue gradients

### Notes
- **Primary**: Amber (#F59E0B) → Orange (#F97316)
- **Accent**: Violet (#8B5CF6) for AI features
- **Background**: Slate → Yellow/Amber gradients

## 🎭 Component States

### Cards
```
Default → Hover (scale: 1.02) → Active (gradient border)
                ↓
           Shadow increase
```

### Buttons
```
Default → Hover (darker bg) → Active (pressed) → Disabled (opacity 50%)
```

### Progress Bars
```
Empty (bg-slate-100) → Animate fill (gradient) → Complete (100% width)
```

## 📐 Layout Patterns

### Full-Width Sections
- Flashcards
- Scenarios
- Study Mode
- AI Generator
- My Tests

### Two-Panel Layouts
- Study Guide (Sidebar + Content)
- Notes (List + Editor)

### Grid Layouts
```
1 column  (mobile < 640px)
2 columns (tablet 640-1024px)
3-4 columns (desktop > 1024px)
```

## 🔄 Navigation Flow

```
Dashboard
    ↓
┌───────────┬──────────────┬─────────────┐
│ Flashcards│  Scenarios   │ Study Mode  │
└───────────┴──────────────┴─────────────┘
    ↓              ↓              ↓
Study View   Case Study    Adaptive Quiz
    ↓              ↓              ↓
Complete     Complete      Complete
    ↓              ↓              ↓
    └──────────────┴──────────────┘
                   ↓
            My Tests (History)
                   ↓
            View Results
```

## 💡 Key Design Principles

1. **Consistency**: Same spacing system (p-6, gap-4, etc.) across all sections
2. **Hierarchy**: Clear visual hierarchy with font sizes and weights
3. **Feedback**: Immediate visual feedback for all interactions
4. **Progressive Disclosure**: Show details on demand, not all at once
5. **Smooth Transitions**: Framer Motion for all state changes
6. **Responsive First**: Mobile-optimized, scales up gracefully
7. **Accessibility**: High contrast, clear focus states (to be enhanced)

## 🎯 Interactive Elements

### Primary Actions
- Large gradient buttons
- Full-width on mobile
- Icon + text labels
- Hover shadows

### Secondary Actions
- Outlined buttons
- White background
- Subtle hover effects
- Border color changes

### Tertiary Actions
- Text links
- Hover underlines
- Color shifts
- Small icons

## 🖼️ Visual Hierarchy

```
Level 1: Page Title (text-3xl font-bold)
    ↓
Level 2: Section Heading (text-2xl font-bold)
    ↓
Level 3: Card Title (text-xl font-semibold)
    ↓
Level 4: Subsection (text-lg font-semibold)
    ↓
Level 5: Body Text (text-base)
    ↓
Level 6: Labels (text-sm font-medium)
    ↓
Level 7: Metadata (text-xs text-slate-500)
```

## 🎨 Spacing System

```
Gap-2  = 8px   (tight elements)
Gap-3  = 12px  (related items)
Gap-4  = 16px  (standard spacing)
Gap-6  = 24px  (section spacing)
Gap-8  = 32px  (major sections)

P-4    = 16px  (compact cards)
P-6    = 24px  (standard cards)
P-8    = 32px  (spacious cards)
```

This architecture ensures consistency, maintainability, and a premium user experience across all study sections!

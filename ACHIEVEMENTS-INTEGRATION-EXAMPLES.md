# 🔌 ACHIEVEMENTS INTEGRATION EXAMPLES

## Complete examples for integrating achievements into existing features

---

## 📚 STUDY MODE INTEGRATION

### **File: `/lib/hooks/useStudyData.ts`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAchievements } from './useAchievements';
import { AchievementNotificationManager } from '@/components/achievements/AchievementUnlockToast';
import { Achievement } from '@/lib/achievements/definitions';

export function useStudyData() {
  const { user } = useAuth();
  const { checkForNewAchievements } = useAchievements();
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  
  // ... your existing state ...

  const handleAnswer = async (questionId: number, isCorrect: boolean) => {
    // ... your existing answer logic ...

    // ✅ CHECK FOR ACHIEVEMENTS AFTER ANSWER
    const unlocked = await checkForNewAchievements();
    if (unlocked.length > 0) {
      setNewAchievements(prev => [...prev, ...unlocked]);
    }
  };

  return {
    // ... your existing returns ...
    newAchievements,
    AchievementNotifications: () => (
      <AchievementNotificationManager achievements={newAchievements} />
    )
  };
}
```

### **In Your Study Component:**
```typescript
export default function StudyPage() {
  const { 
    questions,
    handleAnswer,
    AchievementNotifications // ← Use this
  } = useStudyData();

  return (
    <div>
      {/* Your study UI */}
      <QuestionCard onAnswer={handleAnswer} />
      
      {/* Achievement notifications */}
      <AchievementNotifications />
    </div>
  );
}
```

---

## 🎴 FLASHCARD INTEGRATION

### **File: `/lib/hooks/useFlashcards.ts`**

```typescript
'use client';

import { useState } from 'react';
import { useAchievements } from './useAchievements';
import { Achievement } from '@/lib/achievements/definitions';

export function useFlashcards() {
  const { checkForNewAchievements } = useAchievements();
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const handleFlashcardReview = async (flashcardId: number, confidence: string) => {
    // ... your existing flashcard review logic ...

    // ✅ CHECK FOR ACHIEVEMENTS
    const unlocked = await checkForNewAchievements();
    if (unlocked.length > 0) {
      setNewAchievements(prev => [...prev, ...unlocked]);
    }
  };

  return {
    // ... your existing returns ...
    newAchievements
  };
}
```

---

## 📝 NOTES INTEGRATION

### **File: Component that creates notes**

```typescript
'use client';

import { useState } from 'react';
import { useAchievements } from '@/lib/hooks/useAchievements';

export function NotesEditor() {
  const { checkForNewAchievements } = useAchievements();
  const [newAchievements, setNewAchievements] = useState([]);

  const handleCreateNote = async (content: string) => {
    // ... save note to database ...

    // ✅ CHECK FOR ACHIEVEMENTS
    const unlocked = await checkForNewAchievements();
    if (unlocked.length > 0) {
      setNewAchievements(unlocked);
    }
  };

  return (
    <>
      <textarea onChange={/* ... */} />
      <button onClick={() => handleCreateNote(content)}>Save Note</button>
      
      <AchievementNotificationManager achievements={newAchievements} />
    </>
  );
}
```

---

## 🎯 TEST COMPLETION INTEGRATION

### **File: Test results page**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAchievements } from '@/lib/hooks/useAchievements';

export function TestResultsPage() {
  const { checkForNewAchievements } = useAchievements();
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    // After test is saved to database
    checkForAchievements();
  }, []);

  const checkForAchievements = async () => {
    const unlocked = await checkForNewAchievements();
    if (unlocked.length > 0) {
      setNewAchievements(unlocked);
    }
  };

  return (
    <>
      <h1>Test Results</h1>
      {/* ... your results display ... */}
      
      <AchievementNotificationManager achievements={newAchievements} />
    </>
  );
}
```

---

## 🏠 DASHBOARD INTEGRATION

### **File: `/app/dashboard/page.tsx`**

Add recent achievements feed and streak checking:

```typescript
'use client';

import { useAchievements } from '@/lib/hooks/useAchievements';
import { AchievementBadge } from '@/components/achievements/AchievementBadge';

export default function DashboardPage() {
  const { 
    unlockedAchievements,
    stats,
    checkForNewAchievements 
  } = useAchievements();

  // Check for streak achievements on page load
  useEffect(() => {
    checkForNewAchievements();
  }, []);

  // Get most recent 3 achievements
  const recentAchievements = unlockedAchievements.slice(0, 3);

  return (
    <div>
      {/* Your existing dashboard content */}

      {/* Recent Achievements Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>
        <div className="flex gap-4">
          {recentAchievements.map(achievement => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={true}
              size="md"
            />
          ))}
        </div>
      </section>

      {/* Current Streak Display */}
      <section className="mt-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🔥 Current Streak</h3>
          <p className="text-4xl font-bold">{stats?.currentStreak || 0} days</p>
          <p className="text-sm mt-2">Keep it going!</p>
        </div>
      </section>
    </div>
  );
}
```

---

## 👤 PROFILE PAGE INTEGRATION

### **File: `/app/profile/page.tsx`**

Complete achievements showcase:

```typescript
'use client';

import { useAchievements } from '@/lib/hooks/useAchievements';
import { AchievementsGrid } from '@/components/achievements/AchievementsGrid';

export default function ProfilePage() {
  const { 
    allAchievements,
    unlockedAchievements,
    totalPoints,
    completionPercentage,
    loading 
  } = useAchievements();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {/* ... your existing profile info ... */}
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {unlockedAchievements.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Achievements
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {totalPoints}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Points
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">
            {completionPercentage}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Completion
          </div>
        </div>
      </div>

      {/* Full Achievements Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Achievements</h2>
        <AchievementsGrid
          allAchievements={allAchievements}
          unlockedAchievements={unlockedAchievements}
        />
      </section>
    </div>
  );
}
```

---

## 🎬 SCENARIO COMPLETION INTEGRATION

### **File: Scenarios component**

```typescript
'use client';

import { useAchievements } from '@/lib/hooks/useAchievements';

export function ScenarioPlayer() {
  const { checkForNewAchievements } = useAchievements();
  const [newAchievements, setNewAchievements] = useState([]);

  const handleScenarioComplete = async (scenarioId: number) => {
    // ... save scenario completion to database ...

    // ✅ CHECK FOR ACHIEVEMENTS
    const unlocked = await checkForNewAchievements();
    if (unlocked.length > 0) {
      setNewAchievements(unlocked);
    }
  };

  return (
    <>
      {/* Your scenario UI */}
      <button onClick={() => handleScenarioComplete(scenario.id)}>
        Complete Scenario
      </button>
      
      <AchievementNotificationManager achievements={newAchievements} />
    </>
  );
}
```

---

## 🎨 GLOBAL APP INTEGRATION

### **File: `/app/layout.tsx`**

For app-wide achievement notifications:

```typescript
'use client';

import { useState, createContext, useContext } from 'react';
import { Achievement } from '@/lib/achievements/definitions';
import { AchievementNotificationManager } from '@/components/achievements/AchievementUnlockToast';

// Create context for global achievements
const AchievementsContext = createContext({
  addAchievements: (achievements: Achievement[]) => {}
});

export function RootLayout({ children }) {
  const [globalAchievements, setGlobalAchievements] = useState<Achievement[]>([]);

  const addAchievements = (achievements: Achievement[]) => {
    setGlobalAchievements(prev => [...prev, ...achievements]);
  };

  return (
    <AchievementsContext.Provider value={{ addAchievements }}>
      <html>
        <body>
          {children}
          
          {/* Global achievement notifications */}
          <AchievementNotificationManager achievements={globalAchievements} />
        </body>
      </html>
    </AchievementsContext.Provider>
  );
}

// Hook to use in any component
export function useGlobalAchievements() {
  return useContext(AchievementsContext);
}
```

---

## ⚡ OPTIMIZED PATTERN

### **Centralized Achievement Checking**

Create a custom hook that combines checking with notifications:

```typescript
// File: /lib/hooks/useAchievementNotifications.ts

'use client';

import { useState, useCallback } from 'react';
import { useAchievements } from './useAchievements';
import { Achievement } from '@/lib/achievements/definitions';

export function useAchievementNotifications() {
  const { checkForNewAchievements } = useAchievements();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const checkAndNotify = useCallback(async () => {
    const unlocked = await checkForNewAchievements();
    if (unlocked.length > 0) {
      setAchievements(prev => [...prev, ...unlocked]);
    }
    return unlocked;
  }, [checkForNewAchievements]);

  return {
    achievements,
    checkAndNotify
  };
}
```

### **Usage:**
```typescript
const { achievements, checkAndNotify } = useAchievementNotifications();

// After any action
await checkAndNotify();

// In JSX
<AchievementNotificationManager achievements={achievements} />
```

---

## 🎯 TESTING PATTERN

### **Quick Test All Achievements:**

```typescript
// Add to your dev tools or testing component

export function AchievementTester() {
  const { checkForNewAchievements, refreshAchievements } = useAchievements();

  const testAllAchievements = async () => {
    console.log('Testing achievements...');
    
    // Refresh stats
    await refreshAchievements();
    
    // Check for unlocks
    const unlocked = await checkForNewAchievements();
    
    console.log(`Unlocked ${unlocked.length} achievements:`, unlocked);
  };

  return (
    <button onClick={testAllAchievements}>
      Test Achievements
    </button>
  );
}
```

---

## 📊 STATS DISPLAY PATTERN

### **Show Next Achievement Progress:**

```typescript
export function NextAchievementProgress() {
  const { stats, allAchievements, unlockedAchievements } = useAchievements();
  
  if (!stats) return null;

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
  
  // Find next unlockable achievement
  const nextAchievement = allAchievements.find(a => {
    if (unlockedIds.has(a.id)) return false;
    
    // Check if close to unlocking
    const { metric, target } = a.requirement;
    const current = stats[metric as keyof typeof stats] as number;
    
    return current < target && current >= target * 0.5; // 50% or more complete
  });

  if (!nextAchievement) return null;

  const { metric, target } = nextAchievement.requirement;
  const current = stats[metric as keyof typeof stats] as number;
  const progress = (current / target) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <h3 className="font-bold mb-2">Next Achievement</h3>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{nextAchievement.icon}</span>
        <div className="flex-1">
          <div className="font-medium">{nextAchievement.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {current} / {target}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 READY TO INTEGRATE!

Pick the patterns that fit your app structure and add achievements wherever users take actions!

**Key Points:**
- ✅ Call `checkForNewAchievements()` after ANY user action
- ✅ Use `AchievementNotificationManager` for notifications
- ✅ Display achievements on Profile and Dashboard
- ✅ Show progress bars for motivation

**The system handles everything else automatically!** 🎉

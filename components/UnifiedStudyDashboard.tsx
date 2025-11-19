'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlashcardsSection,
  ScenariosSection,
  StudyModeSection,
  StudyGuideSection,
  AITestGeneratorSection,
  MyTestsSection,
  NotesSection
} from './study-sections';

export type StudyTab = 
  | 'flashcards' 
  | 'scenarios' 
  | 'study-mode' 
  | 'study-guide' 
  | 'ai-generator' 
  | 'my-tests' 
  | 'notes';

interface UnifiedStudyDashboardProps {
  initialTab?: StudyTab;
}

export function UnifiedStudyDashboard({ initialTab = 'flashcards' }: UnifiedStudyDashboardProps) {
  const [activeTab, setActiveTab] = useState<StudyTab>(initialTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'flashcards':
        return <FlashcardsSection />;
      case 'scenarios':
        return <ScenariosSection />;
      case 'study-mode':
        return <StudyModeSection />;
      case 'study-guide':
        return <StudyGuideSection />;
      case 'ai-generator':
        return <AITestGeneratorSection />;
      case 'my-tests':
        return <MyTestsSection />;
      case 'notes':
        return <NotesSection />;
      default:
        return <FlashcardsSection />;
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

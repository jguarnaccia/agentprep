// ============================================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================================
// Complete catalog of all achievements in StadiumU
// Each achievement tracks user milestones and accomplishments
// ============================================================================

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type AchievementCategory = 
  | 'beginner'
  | 'streak' 
  | 'questions' 
  | 'mastery' 
  | 'performance' 
  | 'flashcards' 
  | 'special';

export interface AchievementRequirement {
  type: 'count' | 'streak' | 'percentage' | 'completion' | 'consecutive';
  target: number;
  metric: string; // What to measure (e.g., 'questions_answered', 'study_streak')
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji icon
  tier: AchievementTier;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  points: number; // For future leaderboard
}

// ============================================================================
// ACHIEVEMENT CATALOG
// ============================================================================

export const ACHIEVEMENTS: Achievement[] = [
  // ==========================================================================
  // 🏅 BEGINNER ACHIEVEMENTS (Welcome tier)
  // ==========================================================================
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Answer your first question',
    icon: '👣',
    tier: 'bronze',
    category: 'beginner',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'questions_answered'
    },
    points: 10
  },
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Review 5 flashcards',
    icon: '🎴',
    tier: 'bronze',
    category: 'beginner',
    requirement: {
      type: 'count',
      target: 5,
      metric: 'flashcards_reviewed'
    },
    points: 10
  },
  {
    id: 'note_taker',
    title: 'Note Taker',
    description: 'Create your first note',
    icon: '📝',
    tier: 'bronze',
    category: 'beginner',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'notes_created'
    },
    points: 10
  },
  {
    id: 'test_drive',
    title: 'Test Drive',
    description: 'Complete your first test',
    icon: '🎯',
    tier: 'bronze',
    category: 'beginner',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'tests_completed'
    },
    points: 10
  },
  {
    id: 'scenario_master',
    title: 'Scenario Master',
    description: 'Complete your first scenario',
    icon: '🎬',
    tier: 'bronze',
    category: 'beginner',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'scenarios_completed'
    },
    points: 10
  },

  // ==========================================================================
  // 🔥 STREAK ACHIEVEMENTS
  // ==========================================================================
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Study for 3 days in a row',
    icon: '🔥',
    tier: 'bronze',
    category: 'streak',
    requirement: {
      type: 'streak',
      target: 3,
      metric: 'study_streak'
    },
    points: 25
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Study for 7 days in a row',
    icon: '⚡',
    tier: 'silver',
    category: 'streak',
    requirement: {
      type: 'streak',
      target: 7,
      metric: 'study_streak'
    },
    points: 50
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Study for 30 days in a row',
    icon: '💎',
    tier: 'gold',
    category: 'streak',
    requirement: {
      type: 'streak',
      target: 30,
      metric: 'study_streak'
    },
    points: 150
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Study for 100 days in a row',
    icon: '👑',
    tier: 'platinum',
    category: 'streak',
    requirement: {
      type: 'streak',
      target: 100,
      metric: 'study_streak'
    },
    points: 500
  },

  // ==========================================================================
  // 📚 QUESTION MILESTONES
  // ==========================================================================
  {
    id: 'quick_start',
    title: 'Quick Start',
    description: 'Answer 10 questions',
    icon: '🚀',
    tier: 'bronze',
    category: 'questions',
    requirement: {
      type: 'count',
      target: 10,
      metric: 'questions_answered'
    },
    points: 15
  },
  {
    id: 'building_knowledge',
    title: 'Building Knowledge',
    description: 'Answer 50 questions',
    icon: '📖',
    tier: 'silver',
    category: 'questions',
    requirement: {
      type: 'count',
      target: 50,
      metric: 'questions_answered'
    },
    points: 30
  },
  {
    id: 'half_century',
    title: 'Half Century',
    description: 'Answer 100 questions',
    icon: '💯',
    tier: 'silver',
    category: 'questions',
    requirement: {
      type: 'count',
      target: 100,
      metric: 'questions_answered'
    },
    points: 50
  },
  {
    id: 'knowledge_vault',
    title: 'Knowledge Vault',
    description: 'Answer 500 questions',
    icon: '🏛️',
    tier: 'gold',
    category: 'questions',
    requirement: {
      type: 'count',
      target: 500,
      metric: 'questions_answered'
    },
    points: 200
  },
  {
    id: 'master_scholar',
    title: 'Master Scholar',
    description: 'Answer all 814 questions',
    icon: '🎓',
    tier: 'platinum',
    category: 'questions',
    requirement: {
      type: 'count',
      target: 814,
      metric: 'questions_answered'
    },
    points: 1000
  },

  // ==========================================================================
  // 🎯 MASTERY ACHIEVEMENTS
  // ==========================================================================
  {
    id: 'first_victory',
    title: 'First Victory',
    description: 'Master your first question',
    icon: '🌟',
    tier: 'bronze',
    category: 'mastery',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'questions_mastered'
    },
    points: 20
  },
  {
    id: 'rising_star',
    title: 'Rising Star',
    description: 'Master 25 questions',
    icon: '⭐',
    tier: 'silver',
    category: 'mastery',
    requirement: {
      type: 'count',
      target: 25,
      metric: 'questions_mastered'
    },
    points: 75
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Master 100 questions',
    icon: '💫',
    tier: 'gold',
    category: 'mastery',
    requirement: {
      type: 'count',
      target: 100,
      metric: 'questions_mastered'
    },
    points: 250
  },
  {
    id: 'mastery_legend',
    title: 'Mastery Legend',
    description: 'Master 500 questions',
    icon: '🏆',
    tier: 'platinum',
    category: 'mastery',
    requirement: {
      type: 'count',
      target: 500,
      metric: 'questions_mastered'
    },
    points: 750
  },

  // ==========================================================================
  // ⭐ PERFORMANCE ACHIEVEMENTS
  // ==========================================================================
  {
    id: 'perfect_10',
    title: 'Perfect 10',
    description: 'Get 10 questions correct in a row',
    icon: '🎪',
    tier: 'silver',
    category: 'performance',
    requirement: {
      type: 'consecutive',
      target: 10,
      metric: 'correct_streak'
    },
    points: 50
  },
  {
    id: 'flawless',
    title: 'Flawless',
    description: 'Complete a test with 100% score',
    icon: '✨',
    tier: 'gold',
    category: 'performance',
    requirement: {
      type: 'percentage',
      target: 100,
      metric: 'test_score'
    },
    points: 100
  },
  {
    id: 'overachiever',
    title: 'Overachiever',
    description: 'Score 95%+ on 5 tests',
    icon: '🌠',
    tier: 'gold',
    category: 'performance',
    requirement: {
      type: 'count',
      target: 5,
      metric: 'high_score_tests'
    },
    points: 150
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 50 questions in one session',
    icon: '⚡',
    tier: 'silver',
    category: 'performance',
    requirement: {
      type: 'count',
      target: 50,
      metric: 'questions_per_session'
    },
    points: 75
  },

  // ==========================================================================
  // 🎴 FLASHCARD ACHIEVEMENTS
  // ==========================================================================
  {
    id: 'flash_beginner',
    title: 'Flash Beginner',
    description: 'Review 25 flashcards',
    icon: '🃏',
    tier: 'bronze',
    category: 'flashcards',
    requirement: {
      type: 'count',
      target: 25,
      metric: 'flashcards_reviewed'
    },
    points: 25
  },
  {
    id: 'flash_master',
    title: 'Flash Master',
    description: 'Review 100 flashcards',
    icon: '🎴',
    tier: 'silver',
    category: 'flashcards',
    requirement: {
      type: 'count',
      target: 100,
      metric: 'flashcards_reviewed'
    },
    points: 50
  },
  {
    id: 'flash_legend',
    title: 'Flash Legend',
    description: 'Review 500 flashcards',
    icon: '🌈',
    tier: 'gold',
    category: 'flashcards',
    requirement: {
      type: 'count',
      target: 500,
      metric: 'flashcards_reviewed'
    },
    points: 150
  },
  {
    id: 'full_deck',
    title: 'Full Deck',
    description: 'Master 100 flashcards',
    icon: '🎰',
    tier: 'gold',
    category: 'flashcards',
    requirement: {
      type: 'count',
      target: 100,
      metric: 'flashcards_mastered'
    },
    points: 200
  },

  // ==========================================================================
  // 📝 SPECIAL ACHIEVEMENTS
  // ==========================================================================
  {
    id: 'organized_mind',
    title: 'Organized Mind',
    description: 'Create 10 notes',
    icon: '🗂️',
    tier: 'silver',
    category: 'special',
    requirement: {
      type: 'count',
      target: 10,
      metric: 'notes_created'
    },
    points: 40
  },
  {
    id: 'study_guide_pro',
    title: 'Study Guide Pro',
    description: 'Read all 42 CBA articles',
    icon: '📚',
    tier: 'gold',
    category: 'special',
    requirement: {
      type: 'completion',
      target: 42,
      metric: 'articles_read'
    },
    points: 200
  },
  {
    id: 'scenario_solver',
    title: 'Scenario Solver',
    description: 'Complete 50 scenarios',
    icon: '🎭',
    tier: 'silver',
    category: 'special',
    requirement: {
      type: 'count',
      target: 50,
      metric: 'scenarios_completed'
    },
    points: 100
  },
  {
    id: 'all_rounder',
    title: 'All Rounder',
    description: 'Use all 7 study features',
    icon: '🌟',
    tier: 'gold',
    category: 'special',
    requirement: {
      type: 'completion',
      target: 7,
      metric: 'features_used'
    },
    points: 150
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Study before 8 AM',
    icon: '🌅',
    tier: 'bronze',
    category: 'special',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'early_morning_study'
    },
    points: 15
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Study after 10 PM',
    icon: '🦉',
    tier: 'bronze',
    category: 'special',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'late_night_study'
    },
    points: 15
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Study on Saturday and Sunday',
    icon: '🏋️',
    tier: 'silver',
    category: 'special',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'weekend_study'
    },
    points: 30
  },
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Return after 7+ day break',
    icon: '🔄',
    tier: 'bronze',
    category: 'special',
    requirement: {
      type: 'count',
      target: 1,
      metric: 'study_comeback'
    },
    points: 20
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get achievements by tier
 */
export function getAchievementsByTier(tier: AchievementTier): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.tier === tier);
}

/**
 * Get all achievement IDs
 */
export function getAllAchievementIds(): string[] {
  return ACHIEVEMENTS.map(a => a.id);
}

/**
 * Calculate total possible points
 */
export function getTotalPossiblePoints(): number {
  return ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
}

/**
 * Get tier color for UI display
 */
export function getTierColor(tier: AchievementTier): string {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
  };
  return colors[tier];
}

/**
 * Get tier gradient for UI display
 */
export function getTierGradient(tier: AchievementTier): string {
  const gradients = {
    bronze: 'from-amber-700 to-amber-500',
    silver: 'from-gray-400 to-gray-300',
    gold: 'from-yellow-500 to-yellow-300',
    platinum: 'from-slate-300 to-slate-100'
  };
  return gradients[tier];
}

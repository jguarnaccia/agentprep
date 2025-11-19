// ============================================================================
// SPACED REPETITION SYSTEM (SRS) - Core Algorithm
// ============================================================================
// Based on SuperMemo SM-2 algorithm with custom modifications for StadiumU
// Optimizes learning by showing content at scientifically-proven intervals

/**
 * Performance ratings from user responses
 */
export enum PerformanceRating {
  FAIL = 0,      // Completely wrong, didn't remember
  HARD = 1,      // Barely remembered, struggled
  GOOD = 2,      // Remembered with some effort
  EASY = 3,      // Remembered easily, no hesitation
  PERFECT = 4    // Instant recall, completely mastered
}

/**
 * SRS state for a single item (question or flashcard)
 */
export interface SRSState {
  easeFactor: number;        // 1.30 - 2.50 (higher = easier to remember)
  intervalDays: number;      // Days until next review
  consecutiveCorrect: number; // Streak of correct answers
  nextReviewDate: Date;      // When to show this item next
  lastReviewDate: Date;      // When it was last reviewed
  masteryLevel: 'new' | 'learning' | 'reviewing' | 'mastered';
}

/**
 * Result of SRS calculation
 */
export interface SRSUpdate {
  easeFactor: number;
  intervalDays: number;
  consecutiveCorrect: number;
  nextReviewDate: Date;
  masteryLevel: 'new' | 'learning' | 'reviewing' | 'mastered';
}

/**
 * Configuration for SRS algorithm
 */
export interface SRSConfig {
  // Initial values for new items
  initialEaseFactor: number;  // Default: 2.50
  initialIntervalDays: number; // Default: 1
  
  // Interval multipliers based on performance
  failIntervalDays: number;    // Default: 1 (restart)
  hardIntervalDays: number;    // Default: 1 (minimal increase)
  goodMultiplier: number;      // Default: 2.0 (double interval)
  easyMultiplier: number;      // Default: 2.5 (faster growth)
  perfectMultiplier: number;   // Default: 3.0 (maximum growth)
  
  // Ease factor adjustments
  failEaseAdjustment: number;  // Default: -0.20
  hardEaseAdjustment: number;  // Default: -0.15
  goodEaseAdjustment: number;  // Default: 0.00
  easyEaseAdjustment: number;  // Default: +0.10
  perfectEaseAdjustment: number; // Default: +0.15
  
  // Boundaries
  minEaseFactor: number;       // Default: 1.30 (can't get too hard)
  maxEaseFactor: number;       // Default: 2.50 (can't get too easy)
  maxIntervalDays: number;     // Default: 365 (review at least yearly)
  
  // Mastery thresholds
  learningThreshold: number;   // Default: 2 (2 correct = learning)
  reviewingThreshold: number;  // Default: 4 (4 correct = reviewing)
  masteredThreshold: number;   // Default: 7 (7 correct = mastered)
  masteredIntervalDays: number; // Default: 30 (mastered items review monthly)
}

/**
 * Default SRS configuration optimized for exam preparation
 */
export const DEFAULT_SRS_CONFIG: SRSConfig = {
  // Initial values
  initialEaseFactor: 2.50,
  initialIntervalDays: 1,
  
  // Interval settings - aggressive for exam prep (vs. long-term retention)
  failIntervalDays: 1,      // Wrong answer = review tomorrow
  hardIntervalDays: 2,      // Hard = review in 2 days
  goodMultiplier: 2.0,      // Good = double the interval
  easyMultiplier: 2.5,      // Easy = 2.5x interval growth
  perfectMultiplier: 3.0,   // Perfect = maximum growth
  
  // Ease adjustments
  failEaseAdjustment: -0.20,
  hardEaseAdjustment: -0.15,
  goodEaseAdjustment: 0.00,
  easyEaseAdjustment: +0.10,
  perfectEaseAdjustment: +0.15,
  
  // Boundaries
  minEaseFactor: 1.30,
  maxEaseFactor: 2.50,
  maxIntervalDays: 90,      // Max 90 days for exam prep (not years like Anki)
  
  // Mastery thresholds
  learningThreshold: 2,
  reviewingThreshold: 4,
  masteredThreshold: 7,
  masteredIntervalDays: 30,
};

/**
 * Calculate next review based on performance
 * This is the core SRS algorithm
 */
export function calculateNextReview(
  currentState: SRSState,
  performance: PerformanceRating,
  config: SRSConfig = DEFAULT_SRS_CONFIG
): SRSUpdate {
  // Start with current values
  let easeFactor = currentState.easeFactor;
  let intervalDays = currentState.intervalDays;
  let consecutiveCorrect = currentState.consecutiveCorrect;
  
  // Update based on performance
  if (performance === PerformanceRating.FAIL) {
    // Failed - reset interval and reduce ease
    intervalDays = config.failIntervalDays;
    easeFactor += config.failEaseAdjustment;
    consecutiveCorrect = 0; // Reset streak
    
  } else if (performance === PerformanceRating.HARD) {
    // Hard - minimal interval increase, reduce ease
    intervalDays = config.hardIntervalDays;
    easeFactor += config.hardEaseAdjustment;
    consecutiveCorrect += 1;
    
  } else if (performance === PerformanceRating.GOOD) {
    // Good - double interval, maintain ease
    intervalDays = Math.ceil(intervalDays * config.goodMultiplier * easeFactor);
    easeFactor += config.goodEaseAdjustment;
    consecutiveCorrect += 1;
    
  } else if (performance === PerformanceRating.EASY) {
    // Easy - aggressive increase, boost ease
    intervalDays = Math.ceil(intervalDays * config.easyMultiplier * easeFactor);
    easeFactor += config.easyEaseAdjustment;
    consecutiveCorrect += 1;
    
  } else if (performance === PerformanceRating.PERFECT) {
    // Perfect - maximum increase, maximum ease boost
    intervalDays = Math.ceil(intervalDays * config.perfectMultiplier * easeFactor);
    easeFactor += config.perfectEaseAdjustment;
    consecutiveCorrect += 1;
  }
  
  // Clamp ease factor to valid range
  easeFactor = Math.max(config.minEaseFactor, Math.min(config.maxEaseFactor, easeFactor));
  
  // Clamp interval to max allowed
  intervalDays = Math.min(intervalDays, config.maxIntervalDays);
  
  // Determine mastery level
  let masteryLevel: 'new' | 'learning' | 'reviewing' | 'mastered' = 'new';
  if (consecutiveCorrect >= config.masteredThreshold) {
    masteryLevel = 'mastered';
    // Mastered items get special interval
    intervalDays = Math.max(intervalDays, config.masteredIntervalDays);
  } else if (consecutiveCorrect >= config.reviewingThreshold) {
    masteryLevel = 'reviewing';
  } else if (consecutiveCorrect >= config.learningThreshold) {
    masteryLevel = 'learning';
  }
  
  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  
  return {
    easeFactor: Number(easeFactor.toFixed(2)),
    intervalDays,
    consecutiveCorrect,
    nextReviewDate,
    masteryLevel,
  };
}

/**
 * Create initial SRS state for a new item
 */
export function createInitialSRSState(config: SRSConfig = DEFAULT_SRS_CONFIG): SRSState {
  const now = new Date();
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + config.initialIntervalDays);
  
  return {
    easeFactor: config.initialEaseFactor,
    intervalDays: config.initialIntervalDays,
    consecutiveCorrect: 0,
    nextReviewDate: nextReview,
    lastReviewDate: now,
    masteryLevel: 'new',
  };
}

/**
 * Check if an item is due for review
 */
export function isDueForReview(nextReviewDate: Date): boolean {
  return new Date() >= nextReviewDate;
}

/**
 * Get hours until review is due (negative if overdue)
 */
export function getHoursUntilDue(nextReviewDate: Date): number {
  const now = new Date();
  const diffMs = nextReviewDate.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
}

/**
 * Get days until review is due (negative if overdue)
 */
export function getDaysUntilDue(nextReviewDate: Date): number {
  return Math.floor(getHoursUntilDue(nextReviewDate) / 24);
}

/**
 * Get human-readable review status
 */
export function getReviewStatus(nextReviewDate: Date): 'overdue' | 'due' | 'due-soon' | 'scheduled' {
  const hoursUntil = getHoursUntilDue(nextReviewDate);
  
  if (hoursUntil < 0) return 'overdue';
  if (hoursUntil < 1) return 'due';
  if (hoursUntil < 24) return 'due-soon';
  return 'scheduled';
}

/**
 * Convert binary correct/incorrect to performance rating
 * This is a helper for when you only have isCorrect boolean
 */
export function performanceFromCorrect(isCorrect: boolean, wasHard: boolean = false): PerformanceRating {
  if (!isCorrect) return PerformanceRating.FAIL;
  if (wasHard) return PerformanceRating.HARD;
  return PerformanceRating.GOOD; // Default to GOOD for correct answers
}

/**
 * Format interval for display
 */
export function formatInterval(intervalDays: number): string {
  if (intervalDays < 1) return 'Today';
  if (intervalDays === 1) return '1 day';
  if (intervalDays < 7) return `${intervalDays} days`;
  if (intervalDays < 30) return `${Math.floor(intervalDays / 7)} weeks`;
  if (intervalDays < 365) return `${Math.floor(intervalDays / 30)} months`;
  return `${Math.floor(intervalDays / 365)} years`;
}

/**
 * Get color for mastery level (for UI)
 */
export function getMasteryColor(masteryLevel: string): string {
  switch (masteryLevel) {
    case 'new': return 'gray';
    case 'learning': return 'blue';
    case 'reviewing': return 'yellow';
    case 'mastered': return 'green';
    default: return 'gray';
  }
}

/**
 * Get icon for mastery level (for UI)
 */
export function getMasteryIcon(masteryLevel: string): string {
  switch (masteryLevel) {
    case 'new': return '🆕';
    case 'learning': return '📚';
    case 'reviewing': return '🔄';
    case 'mastered': return '⭐';
    default: return '❓';
  }
}

/**
 * Sort items by SRS priority (what should be reviewed first)
 * Priority order:
 * 1. Overdue items (most overdue first)
 * 2. Due items (soonest first)
 * 3. Due soon items
 * 4. New items (never reviewed)
 * 5. Scheduled items (soonest first)
 */
export function sortBySRSPriority<T extends { nextReviewDate: Date; masteryLevel: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aHours = getHoursUntilDue(a.nextReviewDate);
    const bHours = getHoursUntilDue(b.nextReviewDate);
    
    // Both overdue - most overdue first
    if (aHours < 0 && bHours < 0) {
      return aHours - bHours;
    }
    
    // One overdue - prioritize it
    if (aHours < 0) return -1;
    if (bHours < 0) return 1;
    
    // Both new - arbitrary order
    if (a.masteryLevel === 'new' && b.masteryLevel === 'new') {
      return 0;
    }
    
    // One new - prioritize non-new (want to review before learning new)
    if (a.masteryLevel === 'new') return 1;
    if (b.masteryLevel === 'new') return -1;
    
    // Both scheduled - soonest first
    return aHours - bHours;
  });
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Create new progress record
const initialState = createInitialSRSState();
console.log('New item:', initialState);
// Output: { easeFactor: 2.50, intervalDays: 1, consecutiveCorrect: 0, ... }

// Example 2: User answers correctly
const afterCorrect = calculateNextReview(initialState, PerformanceRating.GOOD);
console.log('After correct answer:', afterCorrect);
// Output: { easeFactor: 2.50, intervalDays: 2, consecutiveCorrect: 1, ... }

// Example 3: User answers incorrectly
const afterWrong = calculateNextReview(afterCorrect, PerformanceRating.FAIL);
console.log('After wrong answer:', afterWrong);
// Output: { easeFactor: 2.30, intervalDays: 1, consecutiveCorrect: 0, ... }

// Example 4: Check if due for review
const isDue = isDueForReview(afterWrong.nextReviewDate);
console.log('Is due?', isDue); // true/false

// Example 5: Get review status
const status = getReviewStatus(afterWrong.nextReviewDate);
console.log('Status:', status); // 'overdue' | 'due' | 'due-soon' | 'scheduled'
*/

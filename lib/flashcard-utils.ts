// lib/flashcard-utils.ts - Utilities for improved flashcard functionality

export interface UnifiedFlashcard {
  id: string;
  question: string;
  answer: string;
  article_number: string;
  article_title: string;
  section_number?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  citation: string;
  source: 'ai' | 'bobby_marks';
}

// Roman numeral mapping for proper sorting
const ROMAN_MAP: { [key: string]: number } = {
  'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
  'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
  'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25, 'XXVI': 26, 'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30,
  'XXXI': 31, 'XXXII': 32, 'XXXIII': 33, 'XXXIV': 34, 'XXXV': 35, 'XXXVI': 36, 'XXXVII': 37, 'XXXVIII': 38, 'XXXIX': 39, 'XL': 40,
  'XLI': 41, 'XLII': 42
};

/**
 * Clean article number to remove duplicate "Article" text
 */
export function cleanArticleNumber(articleNumber: string): string {
  if (!articleNumber) return '';
  
  // Remove duplicate "Article" text (e.g., "Article Article VII" -> "Article VII")
  let cleaned = articleNumber.replace(/Article\s+Article\s+/gi, 'Article ');
  
  // Ensure it starts with "Article" if it contains roman numerals
  if (/[IVX]+/.test(cleaned) && !cleaned.toLowerCase().startsWith('article')) {
    cleaned = `Article ${cleaned}`;
  }
  
  return cleaned.trim();
}

/**
 * Convert Roman numeral to number for sorting
 */
export function romanToNumber(roman: string): number {
  // Extract just the roman numeral part from strings like "Article VII" or "VII"
  const match = roman.match(/([IVX]+)/);
  if (match) {
    return ROMAN_MAP[match[1]] || 999;
  }
  return 999;
}

/**
 * Sort articles in proper Roman numeral order
 */
export function sortByArticle<T extends { article_number: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    const aNum = romanToNumber(a.article_number);
    const bNum = romanToNumber(b.article_number);
    if (aNum !== bNum) return aNum - bNum;
    
    // Secondary sort by topic if article numbers are the same
    if ('topic' in a && 'topic' in b) {
      return (a as any).topic.localeCompare((b as any).topic);
    }
    
    return 0;
  });
}

/**
 * Get unique articles and sort them properly
 */
export function getUniqueArticles(flashcards: { article_number: string }[]): string[] {
  const articles = flashcards
    .map(card => cleanArticleNumber(card.article_number))
    .filter(article => article && article.trim() !== '');
  
  const unique = Array.from(new Set(articles));
  return unique.sort((a, b) => romanToNumber(a) - romanToNumber(b));
}

/**
 * Format topic name for display
 */
export function formatTopicName(topic: string): string {
  return topic
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get difficulty badge classes
 */
export function getDifficultyClasses(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500';
    case 'hard':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Filter flashcards based on criteria
 */
export function filterFlashcards<T extends { 
  question: string; 
  answer: string; 
  article_number: string; 
  topic: string; 
  difficulty: string;
}>(
  cards: T[],
  filters: {
    search?: string;
    articles?: string[];
    topics?: string[];
    difficulties?: string[];
  }
): T[] {
  let filtered = cards;

  // Search filter
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(card => 
      card.question.toLowerCase().includes(query) ||
      card.answer.toLowerCase().includes(query) ||
      card.article_number.toLowerCase().includes(query) ||
      card.topic.toLowerCase().includes(query)
    );
  }

  // Article filter
  if (filters.articles && filters.articles.length > 0) {
    filtered = filtered.filter(card => 
      filters.articles!.some(article => 
        cleanArticleNumber(card.article_number).toLowerCase().includes(article.toLowerCase())
      )
    );
  }

  // Topic filter
  if (filters.topics && filters.topics.length > 0) {
    filtered = filtered.filter(card => 
      filters.topics!.includes(card.topic)
    );
  }

  // Difficulty filter
  if (filters.difficulties && filters.difficulties.length > 0) {
    filtered = filtered.filter(card => 
      filters.difficulties!.includes(card.difficulty)
    );
  }

  return filtered;
}
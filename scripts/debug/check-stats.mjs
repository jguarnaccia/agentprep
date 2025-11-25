import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStats(userId) {
  console.log('\n=== CHECKING STATS FOR USER ===');
  console.log('User ID:', userId);
  
  // Get all questions
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, category, difficulty');
    
  if (qError) {
    console.error('Error fetching questions:', qError);
    return;
  }
  
  console.log('\nTotal questions in database:', questions.length);
  console.log('Sample question IDs:', questions.slice(0, 5).map(q => q.id));
  
  // Get user progress
  const { data: progress, error: pError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);
    
  if (pError) {
    console.error('Error fetching progress:', pError);
    return;
  }
  
  console.log('\nTotal progress records:', progress.length);
  console.log('Sample progress question_ids:', progress.slice(0, 5).map(p => p.question_id));
  
  // Check for orphaned progress records
  const progressMap = new Map(progress.map(p => [p.question_id, p]));
  const questionIds = new Set(questions.map(q => q.id));
  
  const orphanedProgress = progress.filter(p => !questionIds.has(p.question_id));
  
  if (orphanedProgress.length > 0) {
    console.log('\n⚠️  ORPHANED PROGRESS RECORDS (no matching question):');
    console.log(orphanedProgress.map(p => ({
      question_id: p.question_id,
      correct: p.correct_count,
      incorrect: p.incorrect_count
    })));
  }
  
  // Calculate stats
  let neverSeenCount = 0;
  let needsReviewCount = 0;
  
  questions.forEach(q => {
    const prog = progressMap.get(q.id);
    if (!prog) {
      neverSeenCount++;
    } else if (prog.incorrect_count > prog.correct_count) {
      needsReviewCount++;
    }
  });
  
  console.log('\n=== CALCULATED STATS ===');
  console.log('Never Seen (New Material):', neverSeenCount);
  console.log('Needs Review (Previously Incorrect):', needsReviewCount);
  console.log('Has Some Progress:', progress.length);
}

// Get user ID from command line or use test ID
const userId = process.argv[2] || '9422c51c-10f1-4e93-8882-406e6e4265f7';

checkStats(userId).catch(console.error);

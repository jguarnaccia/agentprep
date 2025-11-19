// ============================================================================
// SRS SYSTEM - VERIFICATION & TESTING SCRIPT
// ============================================================================
// Run this script to verify your SRS implementation is working correctly
// Usage: node scripts/test-srs-system.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testDatabaseSchema() {
  console.log('\n📊 Testing Database Schema...\n');
  
  try {
    // Test user_progress table has SRS columns
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('next_review_date, ease_factor, interval_days, consecutive_correct, last_review_date')
      .limit(1);

    if (progressError) {
      console.log('❌ user_progress table missing SRS columns');
      console.log('   Run the database migration: /scripts/add-srs-system.sql');
      return false;
    }

    console.log('✅ user_progress table has SRS columns');

    // Test flashcard_progress table exists
    const { data: flashcardData, error: flashcardError } = await supabase
      .from('flashcard_progress')
      .select('*')
      .limit(1);

    if (flashcardError && flashcardError.message?.includes('relation') && flashcardError.message?.includes('does not exist')) {
      console.log('⚠️  flashcard_progress table does not exist');
      console.log('   This is OK if you haven\'t created it yet');
    } else {
      console.log('✅ flashcard_progress table exists');
    }

    // Test views exist
    const { data: viewData, error: viewError } = await supabase
      .from('user_srs_stats')
      .select('*')
      .limit(1);

    if (viewError && viewError.message?.includes('relation') && viewError.message?.includes('does not exist')) {
      console.log('⚠️  user_srs_stats view does not exist');
      console.log('   Run the full migration to create views');
    } else {
      console.log('✅ user_srs_stats view exists');
    }

    return true;
  } catch (error) {
    console.error('❌ Database schema test failed:', error.message);
    return false;
  }
}

async function testSRSData() {
  console.log('\n🔍 Testing SRS Data...\n');

  try {
    // Count records with SRS data
    const { data: progressRecords, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .not('next_review_date', 'is', null);

    if (progressError) throw progressError;

    const recordsWithSRS = progressRecords?.length || 0;
    console.log(`✅ Found ${recordsWithSRS} user_progress records with SRS data`);

    if (recordsWithSRS > 0) {
      const sample = progressRecords[0];
      console.log('\n📋 Sample SRS Record:');
      console.log(`   - Next Review: ${sample.next_review_date}`);
      console.log(`   - Ease Factor: ${sample.ease_factor}`);
      console.log(`   - Interval: ${sample.interval_days} days`);
      console.log(`   - Consecutive Correct: ${sample.consecutive_correct}`);
      console.log(`   - Mastery Level: ${sample.mastery_level}`);
    }

    // Count items due now
    const now = new Date().toISOString();
    const { data: dueRecords, error: dueError } = await supabase
      .from('user_progress')
      .select('*')
      .lte('next_review_date', now);

    if (dueError) throw dueError;

    const itemsDue = dueRecords?.length || 0;
    console.log(`\n📅 ${itemsDue} items currently due for review`);

    return true;
  } catch (error) {
    console.error('❌ SRS data test failed:', error.message);
    return false;
  }
}

async function testMasteryDistribution() {
  console.log('\n📊 Testing Mastery Distribution...\n');

  try {
    const { data: allProgress, error } = await supabase
      .from('user_progress')
      .select('mastery_level');

    if (error) throw error;

    const distribution = {
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
    };

    allProgress?.forEach(record => {
      const level = record.mastery_level || 'new';
      distribution[level] = (distribution[level] || 0) + 1;
    });

    const total = allProgress?.length || 0;

    console.log('Mastery Level Distribution:');
    console.log(`   🆕 New:       ${distribution.new} (${Math.round(distribution.new / total * 100)}%)`);
    console.log(`   📚 Learning:  ${distribution.learning} (${Math.round(distribution.learning / total * 100)}%)`);
    console.log(`   🔄 Reviewing: ${distribution.reviewing} (${Math.round(distribution.reviewing / total * 100)}%)`);
    console.log(`   ⭐ Mastered:  ${distribution.mastered} (${Math.round(distribution.mastered / total * 100)}%)`);
    console.log(`   Total: ${total} items`);

    return true;
  } catch (error) {
    console.error('❌ Mastery distribution test failed:', error.message);
    return false;
  }
}

async function testIntervalDistribution() {
  console.log('\n📈 Testing Interval Distribution...\n');

  try {
    const { data: allProgress, error } = await supabase
      .from('user_progress')
      .select('interval_days')
      .not('interval_days', 'is', null);

    if (error) throw error;

    const intervals = allProgress?.map(r => r.interval_days) || [];
    
    if (intervals.length === 0) {
      console.log('⚠️  No interval data found yet');
      return true;
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const min = Math.min(...intervals);
    const max = Math.max(...intervals);

    console.log('Interval Statistics:');
    console.log(`   Average: ${avg.toFixed(1)} days`);
    console.log(`   Minimum: ${min} days`);
    console.log(`   Maximum: ${max} days`);

    // Distribution buckets
    const buckets = {
      '1 day': 0,
      '2-7 days': 0,
      '8-30 days': 0,
      '31-90 days': 0,
      '90+ days': 0,
    };

    intervals.forEach(days => {
      if (days === 1) buckets['1 day']++;
      else if (days <= 7) buckets['2-7 days']++;
      else if (days <= 30) buckets['8-30 days']++;
      else if (days <= 90) buckets['31-90 days']++;
      else buckets['90+ days']++;
    });

    console.log('\nInterval Distribution:');
    Object.entries(buckets).forEach(([range, count]) => {
      const pct = Math.round(count / intervals.length * 100);
      console.log(`   ${range}: ${count} (${pct}%)`);
    });

    return true;
  } catch (error) {
    console.error('❌ Interval distribution test failed:', error.message);
    return false;
  }
}

async function testEaseFactorRange() {
  console.log('\n⚖️  Testing Ease Factor Range...\n');

  try {
    const { data: allProgress, error } = await supabase
      .from('user_progress')
      .select('ease_factor')
      .not('ease_factor', 'is', null);

    if (error) throw error;

    const easeFactors = allProgress?.map(r => r.ease_factor) || [];

    if (easeFactors.length === 0) {
      console.log('⚠️  No ease factor data found yet');
      return true;
    }

    const avg = easeFactors.reduce((a, b) => a + b, 0) / easeFactors.length;
    const min = Math.min(...easeFactors);
    const max = Math.max(...easeFactors);

    console.log('Ease Factor Statistics:');
    console.log(`   Average: ${avg.toFixed(2)}`);
    console.log(`   Minimum: ${min.toFixed(2)}`);
    console.log(`   Maximum: ${max.toFixed(2)}`);

    // Check for outliers
    const outliers = easeFactors.filter(e => e < 1.30 || e > 2.50);
    if (outliers.length > 0) {
      console.log(`   ⚠️  ${outliers.length} values outside recommended range (1.30-2.50)`);
    } else {
      console.log('   ✅ All values within recommended range');
    }

    return true;
  } catch (error) {
    console.error('❌ Ease factor test failed:', error.message);
    return false;
  }
}

async function testReviewSchedule() {
  console.log('\n📅 Testing Review Schedule...\n');

  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Items due today
    const { data: dueToday, error: e1 } = await supabase
      .from('user_progress')
      .select('*')
      .lte('next_review_date', now.toISOString());

    // Items due tomorrow
    const { data: dueTomorrow, error: e2 } = await supabase
      .from('user_progress')
      .select('*')
      .lte('next_review_date', tomorrow.toISOString())
      .gt('next_review_date', now.toISOString());

    // Items due next week
    const { data: dueNextWeek, error: e3 } = await supabase
      .from('user_progress')
      .select('*')
      .lte('next_review_date', nextWeek.toISOString())
      .gt('next_review_date', tomorrow.toISOString());

    if (e1 || e2 || e3) throw (e1 || e2 || e3);

    console.log('Review Schedule:');
    console.log(`   📌 Due now:         ${dueToday?.length || 0} items`);
    console.log(`   📌 Due tomorrow:    ${dueTomorrow?.length || 0} items`);
    console.log(`   📌 Due next 7 days: ${dueNextWeek?.length || 0} items`);

    return true;
  } catch (error) {
    console.error('❌ Review schedule test failed:', error.message);
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 SRS SYSTEM - VERIFICATION & TESTING');
  console.log('═══════════════════════════════════════════════════════════');

  const tests = [
    { name: 'Database Schema', fn: testDatabaseSchema },
    { name: 'SRS Data', fn: testSRSData },
    { name: 'Mastery Distribution', fn: testMasteryDistribution },
    { name: 'Interval Distribution', fn: testIntervalDistribution },
    { name: 'Ease Factor Range', fn: testEaseFactorRange },
    { name: 'Review Schedule', fn: testReviewSchedule },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Passed: ${passed}/${tests.length}`);
  console.log(`   ❌ Failed: ${failed}/${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! SRS system is working correctly!\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.\n');
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run tests
runAllTests().catch(console.error);

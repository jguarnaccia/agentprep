const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeScenarioDistribution() {
  console.log('📊 Analyzing scenario distribution by topic...\n');
  
  const { data: scenarios, error } = await supabase
    .from('scenarios')
    .select('topic');
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  // Count by topic
  const topicCounts = scenarios.reduce((acc, s) => {
    acc[s.topic] = (acc[s.topic] || 0) + 1;
    return acc;
  }, {});
  
  // Sort by count
  const sorted = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  
  console.log('Topic Distribution:\n');
  console.log('Topic'.padEnd(40) + 'Count  Status');
  console.log('='.repeat(60));
  
  let needsMore = [];
  
  sorted.forEach(([topic, count]) => {
    const status = count >= 25 ? '✅' : `❌ Need ${25 - count} more`;
    const needsMoreFlag = count < 25 ? ' ⚠️' : '';
    console.log(`${topic.padEnd(40)}${String(count).padEnd(7)}${status}${needsMoreFlag}`);
    
    if (count < 25) {
      needsMore.push({ topic, current: count, needed: 25 - count });
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total scenarios: ${scenarios.length}`);
  console.log(`Topics with <25 scenarios: ${needsMore.length}`);
  console.log(`Total scenarios needed: ${needsMore.reduce((sum, t) => sum + t.needed, 0)}`);
  
  if (needsMore.length > 0) {
    console.log('\n📝 Topics needing more scenarios:\n');
    needsMore.forEach(t => {
      console.log(`   ${t.topic}: ${t.current} → need ${t.needed} more`);
    });
  }
  
  console.log('\n');
}

analyzeScenarioDistribution().catch(console.error);

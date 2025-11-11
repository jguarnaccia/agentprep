const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
  console.log('🔍 Checking article_numbers in database...\n');
  
  const { data, error } = await supabase
    .from('cba_content')
    .select('article_number')
    .order('article_number');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  // Get unique article numbers
  const unique = [...new Set(data.map(d => d.article_number))];
  
  console.log(`Found ${unique.length} unique article_numbers:\n`);
  unique.forEach(num => console.log(`  - ${num}`));
}

checkArticles();

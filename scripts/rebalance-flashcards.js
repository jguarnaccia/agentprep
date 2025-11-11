// scripts/rebalance-flashcards.js
// Rebalance flashcards to ensure all 42 articles are represented in exactly 1000 cards

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Article importance weighting (higher = more cards)
const ARTICLE_WEIGHTS = {
  'Article VII': 4,   // Salary Cap - CRITICAL
  'Article XI': 4,    // Free Agency - CRITICAL
  'Article II': 4,    // Uniform Player Contract - CRITICAL
  'Article VI': 3,    // Player Salaries - IMPORTANT
  'Article XIV': 3,   // Luxury Tax - IMPORTANT
  'Article XXII': 3,  // Player Health - IMPORTANT
  'Article XXIX': 3,  // Grievance and Arbitration - IMPORTANT
  'Article XXXIII': 3, // Anti-Drug Program - IMPORTANT
  'Article XXXVI': 4,  // Player Agents - CRITICAL for certification
  // All other articles get weight 1 (minimum representation)
};

async function rebalanceFlashcards() {
  console.log('🎯 Starting flashcard rebalancing...');
  console.log('Goal: All 42 articles represented in exactly 1000 cards\n');
  
  try {
    // Get ALL flashcards from database
    const { data: allCards, error } = await supabase
      .from('ai_flashcards')
      .select('*')
      .order('article_number, created_at');
    
    if (error) {
      console.error('❌ Error fetching all cards:', error);
      return;
    }
    
    console.log(`📊 Found ${allCards.length} total flashcards in database`);
    
    // Group cards by article
    const cardsByArticle = {};
    allCards.forEach(card => {
      const article = card.article_number;
      if (!cardsByArticle[article]) {
        cardsByArticle[article] = [];
      }
      cardsByArticle[article].push(card);
    });
    
    const currentArticles = Object.keys(cardsByArticle).sort();
    console.log(`📋 Current articles: ${currentArticles.length}`);
    
    // Check for missing articles
    const expectedArticles = [
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
      'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
      'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
      'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL',
      'XLI', 'XLII'
    ].map(num => `Article ${num}`);
    
    const missingArticles = expectedArticles.filter(article => !currentArticles.includes(article));
    
    if (missingArticles.length > 0) {
      console.log(`⚠️  Missing ${missingArticles.length} articles:`, missingArticles.join(', '));
      console.log('💡 We\'ll work with available articles for now\n');
    }
    
    // Calculate target distribution
    const availableArticles = currentArticles;
    const totalWeight = availableArticles.reduce((sum, article) => {
      return sum + (ARTICLE_WEIGHTS[article] || 1);
    }, 0);
    
    const targetDistribution = {};
    const minCardsPerArticle = 5; // Minimum representation
    let reservedCards = availableArticles.length * minCardsPerArticle;
    let remainingCards = 1000 - reservedCards;
    
    console.log(`📐 Calculation:`);
    console.log(`   - ${availableArticles.length} articles × ${minCardsPerArticle} min cards = ${reservedCards} reserved`);
    console.log(`   - ${remainingCards} cards to distribute by weight\n`);
    
    // First pass: assign minimum cards
    availableArticles.forEach(article => {
      targetDistribution[article] = minCardsPerArticle;
    });
    
    // Second pass: distribute remaining cards by weight
    availableArticles.forEach(article => {
      const weight = ARTICLE_WEIGHTS[article] || 1;
      const additionalCards = Math.floor((weight / totalWeight) * remainingCards);
      targetDistribution[article] += additionalCards;
    });
    
    // Adjust to exactly 1000 cards
    let currentTotal = Object.values(targetDistribution).reduce((sum, count) => sum + count, 0);
    const adjustment = 1000 - currentTotal;
    
    if (adjustment !== 0) {
      console.log(`🔧 Adjusting by ${adjustment} cards to reach exactly 1000`);
      // Distribute the adjustment to the most important articles
      const importantArticles = availableArticles.filter(article => ARTICLE_WEIGHTS[article] >= 3);
      if (importantArticles.length > 0) {
        const perArticle = Math.floor(Math.abs(adjustment) / importantArticles.length);
        const remainder = Math.abs(adjustment) % importantArticles.length;
        
        importantArticles.forEach((article, index) => {
          if (adjustment > 0) {
            targetDistribution[article] += perArticle + (index < remainder ? 1 : 0);
          } else {
            targetDistribution[article] = Math.max(minCardsPerArticle, 
              targetDistribution[article] - perArticle - (index < remainder ? 1 : 0));
          }
        });
      }
    }
    
    // Display target distribution
    console.log('🎯 Target distribution:');
    const sortedTargets = Object.entries(targetDistribution).sort(([a], [b]) => {
      const romanMap = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
        'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
        'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25, 'XXVI': 26, 'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30,
        'XXXI': 31, 'XXXII': 32, 'XXXIII': 33, 'XXXIV': 34, 'XXXV': 35, 'XXXVI': 36, 'XXXVII': 37, 'XXXVIII': 38, 'XXXIX': 39, 'XL': 40,
        'XLI': 41, 'XLII': 42
      };
      const extractRoman = (str) => str.match(/([IVX]+)/)?.[1] || '';
      return (romanMap[extractRoman(a)] || 999) - (romanMap[extractRoman(b)] || 999);
    });
    
    let finalTotal = 0;
    sortedTargets.forEach(([article, target]) => {
      const current = cardsByArticle[article]?.length || 0;
      const weight = ARTICLE_WEIGHTS[article] || 1;
      const status = current >= target ? '✅' : current === 0 ? '❌' : '⚠️';
      console.log(`   ${status} ${article}: ${target} cards (have ${current}, weight: ${weight})`);
      finalTotal += target;
    });
    
    console.log(`\n📊 Final total: ${finalTotal} cards`);
    
    // Create the balanced selection
    console.log('\n🔄 Creating balanced selection...');
    const balancedCards = [];
    const selectionLog = [];
    
    sortedTargets.forEach(([article, targetCount]) => {
      const availableCards = cardsByArticle[article] || [];
      
      if (availableCards.length === 0) {
        selectionLog.push(`❌ ${article}: No cards available`);
        return;
      }
      
      if (availableCards.length <= targetCount) {
        // Take all available cards
        balancedCards.push(...availableCards);
        selectionLog.push(`📝 ${article}: Took all ${availableCards.length} cards`);
      } else {
        // Select cards with good distribution
        const selected = selectBestCards(availableCards, targetCount);
        balancedCards.push(...selected);
        selectionLog.push(`🎯 ${article}: Selected ${selected.length}/${availableCards.length} cards`);
      }
    });
    
    console.log('\n📋 Selection log:');
    selectionLog.forEach(log => console.log(log));
    
    console.log(`\n✅ Balanced selection complete: ${balancedCards.length} cards`);
    
    // Create a new table with the balanced selection
    const createBalancedTable = await confirm('\nCreate a new "balanced_flashcards" table with the 1000 selected cards? (y/n): ');
    
    if (createBalancedTable) {
      await createBalancedFlashcardsTable(balancedCards);
    } else {
      console.log('\n💾 Balanced card IDs saved to balanced-card-ids.json');
      const fs = require('fs');
      fs.writeFileSync('balanced-card-ids.json', JSON.stringify({
        cardIds: balancedCards.map(card => card.id),
        metadata: {
          totalCards: balancedCards.length,
          articlesIncluded: sortedTargets.length,
          createdAt: new Date().toISOString()
        }
      }, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Error during rebalancing:', error);
  }
}

function selectBestCards(cards, targetCount) {
  // Strategy: Select cards with good diversity in difficulty and topics
  const byDifficulty = { easy: [], medium: [], hard: [] };
  cards.forEach(card => {
    byDifficulty[card.difficulty] = byDifficulty[card.difficulty] || [];
    byDifficulty[card.difficulty].push(card);
  });
  
  const selected = [];
  const targetPerDifficulty = {
    easy: Math.floor(targetCount * 0.3),
    medium: Math.floor(targetCount * 0.5),
    hard: Math.floor(targetCount * 0.2)
  };
  
  // Adjust to exact target
  const remaining = targetCount - Object.values(targetPerDifficulty).reduce((sum, count) => sum + count, 0);
  targetPerDifficulty.medium += remaining;
  
  ['easy', 'medium', 'hard'].forEach(difficulty => {
    const available = byDifficulty[difficulty] || [];
    const target = targetPerDifficulty[difficulty];
    
    if (available.length <= target) {
      selected.push(...available);
    } else {
      // Select evenly spaced cards
      const step = available.length / target;
      for (let i = 0; i < target; i++) {
        const index = Math.floor(i * step);
        selected.push(available[index]);
      }
    }
  });
  
  // Fill any remaining slots with random selection
  while (selected.length < targetCount && selected.length < cards.length) {
    const remaining = cards.filter(card => !selected.includes(card));
    if (remaining.length > 0) {
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    } else {
      break;
    }
  }
  
  return selected.slice(0, targetCount);
}

async function createBalancedFlashcardsTable(cards) {
  console.log('\n🏗️  Creating balanced_flashcards table...');
  
  try {
    // Create the table
    const { error: createError } = await supabase.rpc('create_balanced_flashcards_table');
    
    if (createError && !createError.message.includes('already exists')) {
      console.error('❌ Error creating table:', createError);
      return;
    }
    
    // Insert the balanced cards
    console.log('📥 Inserting balanced cards...');
    
    const { error: insertError } = await supabase
      .from('balanced_flashcards')
      .insert(cards);
    
    if (insertError) {
      console.error('❌ Error inserting cards:', insertError);
      return;
    }
    
    console.log('✅ Balanced flashcards table created successfully!');
    console.log('\n💡 Update your app to use "balanced_flashcards" table instead of "ai_flashcards"');
    
  } catch (error) {
    console.error('💥 Error creating balanced table:', error);
  }
}

function confirm(question) {
  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

rebalanceFlashcards();
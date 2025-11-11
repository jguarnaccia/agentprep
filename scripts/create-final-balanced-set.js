// scripts/create-final-balanced-set.js
// Final script to clean duplicates and create exactly 1000 balanced cards

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Article importance weighting
const ARTICLE_WEIGHTS = {
  'Article VII': 5,   // Salary Cap - CRITICAL
  'Article XI': 5,    // Free Agency - CRITICAL  
  'Article II': 4,    // Uniform Player Contract - CRITICAL
  'Article XXXVI': 4, // Player Agents - CRITICAL
  'Article VI': 3,    // Player Salaries - IMPORTANT
  'Article XIV': 3,   // Luxury Tax - IMPORTANT
  'Article XXII': 3,  // Player Health - IMPORTANT
  'Article XXIX': 3,  // Grievance and Arbitration - IMPORTANT
  'Article XXXIII': 3, // Anti-Drug Program - IMPORTANT
};

function standardizeArticleNumber(articleNumber) {
  if (!articleNumber) return '';
  
  // Remove any existing "Article" prefix and clean
  let cleaned = articleNumber.replace(/^Article\s+/i, '').trim();
  
  // If it's a roman numeral, add "Article" prefix
  if (/^[IVX]+$/.test(cleaned)) {
    return `Article ${cleaned}`;
  }
  
  // If it already has Article, clean and return
  if (/^Article\s+[IVX]+$/i.test(articleNumber)) {
    return articleNumber;
  }
  
  return articleNumber; // Return as-is if we can't parse it
}

async function createFinalBalancedSet() {
  console.log('🎯 Creating final balanced flashcard set...');
  console.log('Goal: Fix duplicates and create exactly 1000 cards\n');
  
  try {
    // Load the saved data
    const fs = require('fs');
    const balancedData = JSON.parse(fs.readFileSync('balanced-flashcards.json', 'utf8'));
    const allCards = balancedData.cards;
    
    console.log(`📥 Loaded ${allCards.length} cards from balanced-flashcards.json`);
    
    // Standardize article numbers and group
    console.log('🔧 Standardizing article numbers...');
    const cardsByStandardArticle = {};
    
    allCards.forEach(card => {
      const standardArticle = standardizeArticleNumber(card.article_number);
      card.article_number = standardArticle; // Update the card
      
      if (!cardsByStandardArticle[standardArticle]) {
        cardsByStandardArticle[standardArticle] = [];
      }
      cardsByStandardArticle[standardArticle].push(card);
    });
    
    console.log('\n📊 Standardized distribution:');
    const sortedArticles = Object.entries(cardsByStandardArticle).sort(([a], [b]) => {
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
    
    sortedArticles.forEach(([article, cards]) => {
      const weight = ARTICLE_WEIGHTS[article] || 1;
      console.log(`   ${article}: ${cards.length} cards (weight: ${weight})`);
    });
    
    console.log(`\n📋 Total after standardization: ${Object.values(cardsByStandardArticle).flat().length} cards`);
    console.log(`📋 Unique articles: ${sortedArticles.length}`);
    
    // Calculate new targets for exactly 1000 cards
    const articles = Object.keys(cardsByStandardArticle);
    const minPerArticle = 10; // Increase minimum for better representation
    const totalWeight = articles.reduce((sum, art) => sum + (ARTICLE_WEIGHTS[art] || 1), 0);
    const remainingCards = 1000 - (articles.length * minPerArticle);
    
    console.log(`\n📐 New distribution plan:`);
    console.log(`   ${articles.length} articles × ${minPerArticle} min = ${articles.length * minPerArticle}`);
    console.log(`   ${remainingCards} cards to distribute by weight\n`);
    
    // Calculate final targets
    const finalTargets = {};
    articles.forEach(article => {
      const weight = ARTICLE_WEIGHTS[article] || 1;
      const additional = Math.floor((weight / totalWeight) * remainingCards);
      finalTargets[article] = minPerArticle + additional;
    });
    
    // Fine-tune to exactly 1000
    let currentTotal = Object.values(finalTargets).reduce((sum, count) => sum + count, 0);
    const adjustment = 1000 - currentTotal;
    
    if (adjustment > 0) {
      // Add to the most important articles
      const importantArticles = articles
        .filter(art => ARTICLE_WEIGHTS[art] >= 3)
        .sort((a, b) => (ARTICLE_WEIGHTS[b] || 1) - (ARTICLE_WEIGHTS[a] || 1));
      
      let remaining = adjustment;
      importantArticles.forEach(article => {
        if (remaining > 0) {
          const canAdd = Math.min(remaining, cardsByStandardArticle[article].length - finalTargets[article]);
          finalTargets[article] += canAdd;
          remaining -= canAdd;
        }
      });
      
      // If still have remaining, distribute to any article that can take more
      if (remaining > 0) {
        articles.forEach(article => {
          if (remaining > 0) {
            const canAdd = Math.min(remaining, cardsByStandardArticle[article].length - finalTargets[article]);
            finalTargets[article] += canAdd;
            remaining -= canAdd;
          }
        });
      }
    }
    
    // Create final selection
    console.log('🎯 Final selection:');
    const finalCards = [];
    
    sortedArticles.forEach(([article]) => {
      const available = cardsByStandardArticle[article];
      const target = finalTargets[article];
      const toTake = Math.min(target, available.length);
      
      if (available.length <= toTake) {
        finalCards.push(...available);
        console.log(`   ${article}: ${available.length}/${available.length} cards (all)`);
      } else {
        // Select with good distribution
        const selected = selectBestCards(available, toTake);
        finalCards.push(...selected);
        console.log(`   ${article}: ${selected.length}/${available.length} cards`);
      }
    });
    
    console.log(`\n✅ Final balanced set: ${finalCards.length} cards`);
    
    // Show final stats
    const topicCounts = {};
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    
    finalCards.forEach(card => {
      const topic = card.topic || 'general';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      difficultyCounts[card.difficulty || 'medium']++;
    });
    
    console.log('\n📊 Final topic distribution:');
    Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([topic, count]) => {
        console.log(`   ${topic}: ${count} cards`);
      });
    
    console.log('\n📊 Final difficulty distribution:');
    Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
      const percentage = ((count / finalCards.length) * 100).toFixed(1);
      console.log(`   ${difficulty}: ${count} cards (${percentage}%)`);
    });
    
    // Save final set
    fs.writeFileSync('final-balanced-flashcards.json', JSON.stringify({
      metadata: {
        totalCards: finalCards.length,
        articlesCount: articles.length,
        createdAt: new Date().toISOString(),
        distribution: finalTargets
      },
      cards: finalCards
    }, null, 2));
    
    console.log('\n💾 Saved final set to final-balanced-flashcards.json');
    console.log('\n🎯 Summary:');
    console.log(`   ✅ Exactly ${finalCards.length} cards`);
    console.log(`   ✅ All ${articles.length} unique articles represented`);
    console.log(`   ✅ Critical articles prioritized`);
    console.log(`   ✅ Ready for import to database`);
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

function selectBestCards(cards, targetCount) {
  // Ensure good distribution across difficulties
  const byDifficulty = { easy: [], medium: [], hard: [] };
  
  cards.forEach(card => {
    const difficulty = card.difficulty || 'medium';
    if (!byDifficulty[difficulty]) byDifficulty[difficulty] = [];
    byDifficulty[difficulty].push(card);
  });
  
  const selected = [];
  const targetPerDifficulty = {
    easy: Math.floor(targetCount * 0.3),
    medium: Math.floor(targetCount * 0.5), 
    hard: Math.floor(targetCount * 0.2)
  };
  
  // Adjust for exact count
  const remaining = targetCount - Object.values(targetPerDifficulty).reduce((sum, count) => sum + count, 0);
  targetPerDifficulty.medium += remaining;
  
  // Select from each difficulty
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
        if (index < available.length) {
          selected.push(available[index]);
        }
      }
    }
  });
  
  return selected.slice(0, targetCount);
}

createFinalBalancedSet();
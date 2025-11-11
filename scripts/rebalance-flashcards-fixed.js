// scripts/rebalance-flashcards-fixed.js
// Fixed version that properly handles all 3,324 cards

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

async function rebalanceFlashcardsFixed() {
  console.log('🎯 Starting FIXED flashcard rebalancing...');
  console.log('Goal: Get all 3,324 cards and balance to 1000\n');
  
  try {
    // Fetch ALL cards without limits
    console.log('📥 Fetching ALL flashcards...');
    let allCards = [];
    let page = 0;
    const pageSize = 1000;
    
    while (true) {
      const { data: pageData, error } = await supabase
        .from('ai_flashcards')
        .select('*')
        .order('created_at')
        .range(page * pageSize, (page + 1) * pageSize - 1);
      
      if (error) throw error;
      if (!pageData || pageData.length === 0) break;
      
      allCards = allCards.concat(pageData);
      console.log(`   Page ${page + 1}: ${pageData.length} cards (total: ${allCards.length})`);
      
      if (pageData.length < pageSize) break;
      page++;
    }
    
    console.log(`\n📊 Total flashcards: ${allCards.length}\n`);
    
    // Group by article
    const cardsByArticle = {};
    allCards.forEach(card => {
      const article = card.article_number;
      if (!cardsByArticle[article]) cardsByArticle[article] = [];
      cardsByArticle[article].push(card);
    });
    
    console.log('📋 Article distribution (all cards):');
    Object.entries(cardsByArticle)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([article, cards]) => {
        const weight = ARTICLE_WEIGHTS[article] || 1;
        console.log(`   ${article}: ${cards.length} cards (weight: ${weight})`);
      });
    
    // Calculate targets
    const articles = Object.keys(cardsByArticle);
    const minPerArticle = 8;
    const totalWeight = articles.reduce((sum, art) => sum + (ARTICLE_WEIGHTS[art] || 1), 0);
    const remainingCards = 1000 - (articles.length * minPerArticle);
    
    console.log(`\n📐 Distribution plan:`);
    console.log(`   ${articles.length} articles × ${minPerArticle} min = ${articles.length * minPerArticle}`);
    console.log(`   ${remainingCards} cards to distribute by weight\n`);
    
    // Calculate targets
    const targets = {};
    articles.forEach(article => {
      const weight = ARTICLE_WEIGHTS[article] || 1;
      const additional = Math.floor((weight / totalWeight) * remainingCards);
      targets[article] = minPerArticle + additional;
    });
    
    // Select cards
    const balancedCards = [];
    console.log('🎯 Selection results:');
    
    Object.entries(targets).forEach(([article, target]) => {
      const available = cardsByArticle[article];
      const toTake = Math.min(target, available.length);
      
      if (available.length <= toTake) {
        balancedCards.push(...available);
      } else {
        // Select evenly distributed cards
        const selected = [];
        const step = available.length / toTake;
        for (let i = 0; i < toTake; i++) {
          const index = Math.floor(i * step);
          selected.push(available[index]);
        }
        balancedCards.push(...selected);
      }
      
      console.log(`   ${article}: ${toTake}/${available.length} cards`);
    });
    
    console.log(`\n✅ Final selection: ${balancedCards.length} cards`);
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('balanced-flashcards.json', JSON.stringify({
      metadata: {
        totalCards: balancedCards.length,
        articlesCount: articles.length,
        createdAt: new Date().toISOString()
      },
      cards: balancedCards
    }, null, 2));
    
    console.log('💾 Saved to balanced-flashcards.json');
    console.log('\nNext: Import this file to create balanced_flashcards table');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

rebalanceFlashcardsFixed();
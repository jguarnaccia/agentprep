// scripts/create-perfect-1000.js
// Final script to create exactly 1000 cards with optimal distribution

const fs = require('fs');

async function createPerfect1000() {
  console.log('🎯 Creating PERFECT 1000-card set...');
  
  try {
    // Load the final balanced set
    const data = JSON.parse(fs.readFileSync('final-balanced-flashcards.json', 'utf8'));
    const currentCards = data.cards;
    
    console.log(`📥 Current set: ${currentCards.length} cards`);
    console.log(`🎯 Need: ${1000 - currentCards.length} more cards\n`);
    
    // Group by article
    const cardsByArticle = {};
    currentCards.forEach(card => {
      const article = card.article_number;
      if (!cardsByArticle[article]) cardsByArticle[article] = [];
      cardsByArticle[article].push(card);
    });
    
    // Load the original balanced set to find more cards
    const originalData = JSON.parse(fs.readFileSync('balanced-flashcards.json', 'utf8'));
    const allAvailableCards = originalData.cards;
    
    // Standardize and group all available cards
    const allCardsByArticle = {};
    allAvailableCards.forEach(card => {
      // Standardize article number
      let standardArticle = card.article_number;
      if (!standardArticle.toLowerCase().startsWith('article') && /^[IVX]+$/.test(standardArticle)) {
        standardArticle = `Article ${standardArticle}`;
      }
      card.article_number = standardArticle;
      
      if (!allCardsByArticle[standardArticle]) allCardsByArticle[standardArticle] = [];
      allCardsByArticle[standardArticle].push(card);
    });
    
    console.log('📊 Available cards by article:');
    Object.entries(allCardsByArticle)
      .sort()
      .forEach(([article, cards]) => {
        const currentCount = cardsByArticle[article]?.length || 0;
        const available = cards.length - currentCount;
        console.log(`   ${article}: ${currentCount} selected, ${available} more available`);
      });
    
    // Calculate how many more cards we can add
    const neededCards = 1000 - currentCards.length;
    console.log(`\n🎯 Need to add ${neededCards} more cards`);
    
    // Find articles that have more cards available
    const articlesWithMore = [];
    Object.entries(allCardsByArticle).forEach(([article, allCards]) => {
      const currentCount = cardsByArticle[article]?.length || 0;
      const available = allCards.length - currentCount;
      
      if (available > 0) {
        articlesWithMore.push({
          article,
          currentCount,
          available,
          allCards,
          currentCards: cardsByArticle[article] || []
        });
      }
    });
    
    console.log(`\n📋 ${articlesWithMore.length} articles have additional cards available`);
    
    // Sort by priority (articles with weights get priority)
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
    
    articlesWithMore.sort((a, b) => {
      const weightA = ARTICLE_WEIGHTS[a.article] || 1;
      const weightB = ARTICLE_WEIGHTS[b.article] || 1;
      if (weightA !== weightB) return weightB - weightA; // Higher weight first
      return b.available - a.available; // More available cards first
    });
    
    // Add cards strategically
    const finalCards = [...currentCards];
    let cardsToAdd = neededCards;
    
    console.log('\n🔄 Adding cards strategically:');
    
    while (cardsToAdd > 0 && articlesWithMore.some(art => art.available > 0)) {
      for (const articleInfo of articlesWithMore) {
        if (cardsToAdd <= 0) break;
        if (articleInfo.available <= 0) continue;
        
        // Find cards not already selected
        const currentCardIds = new Set(articleInfo.currentCards.map(c => c.id));
        const availableCards = articleInfo.allCards.filter(c => !currentCardIds.has(c.id));
        
        if (availableCards.length > 0) {
          // Add one card from this article
          const cardToAdd = availableCards[0];
          finalCards.push(cardToAdd);
          articleInfo.currentCards.push(cardToAdd);
          articleInfo.available--;
          cardsToAdd--;
          
          console.log(`   Added 1 card to ${articleInfo.article} (${cardsToAdd} remaining)`);
        }
      }
    }
    
    console.log(`\n✅ Final result: ${finalCards.length} cards`);
    
    if (finalCards.length < 1000) {
      console.log(`⚠️  Could only reach ${finalCards.length} cards`);
      console.log('   This is because some articles have very limited cards available');
    }
    
    // Show final distribution
    const finalDistribution = {};
    finalCards.forEach(card => {
      const article = card.article_number;
      finalDistribution[article] = (finalDistribution[article] || 0) + 1;
    });
    
    console.log('\n📊 Final distribution:');
    Object.entries(finalDistribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([article, count]) => {
        const weight = ARTICLE_WEIGHTS[article] || 1;
        const indicator = weight >= 3 ? '⭐' : '';
        console.log(`   ${article}: ${count} cards ${indicator}`);
      });
    
    // Save the perfect set
    const perfectData = {
      metadata: {
        totalCards: finalCards.length,
        articlesCount: Object.keys(finalDistribution).length,
        createdAt: new Date().toISOString(),
        note: 'Optimized for exactly 1000 cards with maximum article coverage'
      },
      cards: finalCards
    };
    
    fs.writeFileSync('perfect-1000-flashcards.json', JSON.stringify(perfectData, null, 2));
    console.log('\n💾 Saved to perfect-1000-flashcards.json');
    
    // Final stats
    const topicCounts = {};
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    
    finalCards.forEach(card => {
      const topic = card.topic || 'general';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      difficultyCounts[card.difficulty || 'medium']++;
    });
    
    console.log('\n📊 Final statistics:');
    console.log(`   Total Cards: ${finalCards.length}`);
    console.log(`   Articles Covered: ${Object.keys(finalDistribution).length}`);
    console.log(`   Easy: ${difficultyCounts.easy} (${(difficultyCounts.easy/finalCards.length*100).toFixed(1)}%)`);
    console.log(`   Medium: ${difficultyCounts.medium} (${(difficultyCounts.medium/finalCards.length*100).toFixed(1)}%)`);
    console.log(`   Hard: ${difficultyCounts.hard} (${(difficultyCounts.hard/finalCards.length*100).toFixed(1)}%)`);
    
    console.log('\n🎯 Next step: Import this set to create the balanced_flashcards table!');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

createPerfect1000();
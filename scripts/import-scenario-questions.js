const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const scenarioQuestions = [
  {
    question: "The Nuggets have $10M in Room under the Salary Cap at the start of the 2023 off season. They then sign Jim Denver, who played the prior season with the Phoenix Suns, to a 1-year $10M contract. Next, the Nuggets want to sign Max Holloway, an undrafted rookie to a 1-year contract paying him the highest salary possible. How much can they pay Holloway?",
    options: [
      "$1,119,563 – using the Minimum Salary Exception",
      "$2,019,706 – using the 2nd Round Pick Exception",
      "$7,723,000 – using the Mid-Level for Room Exception",
      "$12,405,000 – using the Non-Taxpayer Mid-Level Exception"
    ],
    correct: 2,
    explanation: "A team doesn't get to use BOTH Salary Cap Room AND the Non-Taxpayer, Taxpayer or Bi-Annual Exception. Once they create Room, the exceptions essentially are replaced by the Room. The only 'exception' to this general principle for a Free Agent (other than the 1-year minimum salary, which teams can always give), is the 'Room Exception,' which is specifically granted for teams that go under the Salary Cap to use Room. They get rewarded by having this additional exception to sign an additional player.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBPA Sample Exam Question 1",
    question_type: "scenario",
    batch: 18
  },
  {
    question: "The Jazz want to trade Bob Cousy, who was signed to a one-year contract for $4M on July 10, 2023, to the Magic; only $2M of Cousy's Salary is protected for Skill and Injury/Illness. The Jazz are interested in trading only Cousy and no other players. Additionally, no matter how the trade is structured, the Jazz will be under the Luxury Tax after the trade. What is the maximum amount of Salary the Jazz can receive in the trade?",
    options: [
      "$2,000,000",
      "$3,600,000",
      "$4,250,000",
      "$8,250,000"
    ],
    correct: 2,
    explanation: "Teams below the First Apron can receive 200% of a player's Salary back in a trade, plus $250,000. While the player may make $4M this year, for trade purposes a player is considered to make only what they have earned/guaranteed this season. Since the player is only guaranteed $2M, it is $2M × 2 + $250,000 = $4.25M.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBPA Sample Exam Question 2",
    question_type: "scenario",
    batch: 18
  },
  {
    question: "Gary Warren terminates his SPAC with his Agent on August 15, 2023. When can you sign Gary to a new SPAC?",
    options: [
      "August 16, 2023",
      "August 30, 2023",
      "September 15, 2023",
      "August 16, 2024"
    ],
    correct: 1,
    explanation: "After the 15-day cooling off period has expired. When a player terminates their Standard Player Agent Contract (SPAC), there is a mandatory 15-day waiting period before they can sign a new SPAC with any agent. This cooling-off period is designed to protect players from making hasty decisions.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBPA Sample Exam Question 3",
    question_type: "scenario",
    batch: 18
  }
];

async function importScenarioQuestions() {
  console.log('🎯 Importing NBPA Scenario Questions...\n');

  for (let i = 0; i < scenarioQuestions.length; i++) {
    const question = scenarioQuestions[i];
    
    console.log(`[${i + 1}/${scenarioQuestions.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ Scenario questions imported successfully!');
  console.log('\nNext steps:');
  console.log('1. Run the SQL to add question_type column');
  console.log('2. Build the Scenario Mode UI');
}

importScenarioQuestions();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// All 142 Bobby Marks flashcards - Part 2 (continuing from previous)
const flashcardsPart2 = [
  {
    question: "What is the originally guaranteed salary for a player signing a Two-Way contract?",
    answer: "$77K",
    explanation: "Two-way contracts have a minimum guarantee of $77,250 regardless of games played.",
    category: "Two-Way Contracts",
    difficulty: "medium"
  },
  {
    question: "A Two-Way player is permitted to be on the Active List for how many games?",
    answer: "50 games",
    explanation: "Two-way players can spend up to 50 games on the NBA active roster before needing conversion.",
    category: "Two-Way Contracts",
    difficulty: "medium"
  },
  {
    question: "Keon Johnson is eligible to play how many games after signing a Two-Way contract?",
    answer: "50 games",
    explanation: "All two-way players are eligible for up to 50 NBA games per season.",
    category: "Two-Way Contracts",
    difficulty: "easy"
  },
  {
    question: "What is the last day to sign a player to a Two-Way contract?",
    answer: "January 15",
    explanation: "The deadline for signing two-way contracts is January 15 of each season.",
    category: "Two-Way Contracts",
    difficulty: "medium"
  },
  {
    question: "What is the bonus for a player remaining with the G-League team for 60 days under an Exhibit 10 contract?",
    answer: "$50K",
    explanation: "Exhibit 10 bonuses can range from $5K-$75K, with $50K being a common amount.",
    category: "G-League Contracts",
    difficulty: "medium"
  },
  {
    question: "Can a player not on an Exhibit 10 contract be converted to a Two-Way?",
    answer: "No",
    explanation: "Only players on Exhibit 10 contracts can be converted to two-way contracts.",
    category: "Two-Way Contracts",
    difficulty: "medium"
  },
  {
    question: "What is the salary for a player with 8 years of service signing a 10-Day contract?",
    answer: "$145,301",
    explanation: "10-day contracts pay a prorated amount based on the player's veteran minimum salary.",
    category: "10-Day Contracts",
    difficulty: "hard"
  },
  {
    question: "Can a team and player enter into a Rest-of-Season Contract during the term of a 10-Day Contract?",
    answer: "Yes",
    explanation: "Teams can convert a 10-day contract to a rest-of-season deal at any time during the 10 days.",
    category: "10-Day Contracts",
    difficulty: "medium"
  },
  {
    question: "Is a team allowed to sign a player to a 10-Day Contract with the hardship exception prior to January 5?",
    answer: "Yes",
    explanation: "The hardship exception allows 10-day contracts before the standard January 5 date if a team has multiple injuries.",
    category: "10-Day Contracts",
    difficulty: "hard"
  },
  {
    question: "What is the maximum number of 10-Day Contracts that a player can sign with one team?",
    answer: "2",
    explanation: "A player can sign two 10-day contracts with the same team, then must either be signed for the season or released.",
    category: "10-Day Contracts",
    difficulty: "easy"
  },
  {
    question: "Is a player on a 10-Day Contract eligible for the playoffs?",
    answer: "No",
    explanation: "Players must be signed before March 1 to be playoff eligible, which most 10-day contracts don't meet.",
    category: "10-Day Contracts",
    difficulty: "medium"
  },
  {
    question: "A player signing a 10-Day contract on February 25 that expires on March 7 - is he eligible for the playoffs?",
    answer: "No",
    explanation: "The contract must be in place before March 1 for playoff eligibility.",
    category: "10-Day Contracts",
    difficulty: "hard"
  },
  {
    question: "If a player signs an Exhibit 9 contract and is injured, how much is the team liable for?",
    answer: "$6K",
    explanation: "Exhibit 9 contracts limit team liability for injuries to $6,000.",
    category: "Contract Types",
    difficulty: "medium"
  },
  {
    question: "What is the maximum salary increase in year 2 for a player with early or bird rights starting at $8 million?",
    answer: "$8.64 million",
    explanation: "Players with bird rights can receive 8% annual raises, so $8M × 1.08 = $8.64M.",
    category: "Contract Raises",
    difficulty: "hard"
  },
  {
    question: "What is the maximum new years a team can sign a player to in a rookie extension?",
    answer: "4 years",
    explanation: "Rookie extensions can add up to 4 new years to the existing contract.",
    category: "Contract Extensions",
    difficulty: "medium"
  },
  {
    question: "Is a first-round pick eligible to sign an extension?",
    answer: "Yes",
    explanation: "First-round picks can sign extensions starting after their third season.",
    category: "Contract Extensions",
    difficulty: "easy"
  },
  {
    question: "What is the last day a player can sign a rookie extension?",
    answer: "June 30",
    explanation: "Rookie scale extensions have a June 30 deadline before the player's fourth season.",
    category: "Contract Extensions",
    difficulty: "medium"
  },
  {
    question: "When is a player eligible to sign a veteran extension?",
    answer: "The first year anniversary of a contract covering three seasons or more",
    explanation: "Veterans must wait one year into a 3+ year contract before being extension eligible.",
    category: "Contract Extensions",
    difficulty: "hard"
  },
  {
    question: "What is the maximum salary of the first year of an extension?",
    answer: "140% of the current salary",
    explanation: "Extension first years are capped at 140% of the player's current year salary.",
    category: "Contract Extensions",
    difficulty: "hard"
  },
  {
    question: "What is the maximum total years in a veteran extension?",
    answer: "5 years",
    explanation: "Including the current contract, veteran extensions can create deals up to 5 total years.",
    category: "Contract Extensions",
    difficulty: "medium"
  },
  {
    question: "What is the deadline for extending a player with two years left on their contract?",
    answer: "June 30",
    explanation: "Extensions must be completed by June 30 if the player has 2 years remaining.",
    category: "Contract Extensions",
    difficulty: "medium"
  },
  {
    question: "Can the first year of the extended term be lower than the option declined?",
    answer: "No",
    explanation: "If a team option is declined for an extension, the extension's first year must equal or exceed that option amount.",
    category: "Contract Extensions",
    difficulty: "hard"
  },
  {
    question: "What are the years and percentage for an extension after trade acquisition?",
    answer: "4 years and 120%",
    explanation: "Recently acquired players (via trade) can extend for 4 years at up to 120% of current salary.",
    category: "Contract Extensions",
    difficulty: "hard"
  },
  {
    question: "When is a player eligible to renegotiate a contract?",
    answer: "The 3rd year anniversary of a contract covering four or more seasons",
    explanation: "Contract renegotiations require a 4+ year deal and waiting until the 3rd anniversary.",
    category: "Contract Renegotiation",
    difficulty: "hard"
  },
  {
    question: "What is Myles Turner's salary after renegotiation?",
    answer: "$20.4 million",
    explanation: "This reflects the renegotiated amount within the allowable parameters of the CBA.",
    category: "Contract Renegotiation",
    difficulty: "hard"
  },
  {
    question: "Is the trade of Jonathan Isaac and Joe Harris feasible?",
    answer: "Yes",
    explanation: "Based on salary matching rules, this trade would work under the CBA.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "What is the outgoing salary for a Chris Paul trade?",
    answer: "$30.8 million",
    explanation: "This represents Chris Paul's salary for trade matching purposes.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "What is the percentage of Traded Player Exception for a team below the first apron receiving $4 million?",
    answer: "150% + $175K",
    explanation: "Teams below the first apron can receive up to 150% + $175K in trades when under $10M outgoing.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "A team receives $14.5 million as incoming salary in a trade - what amount must they send out?",
    answer: "$10M",
    explanation: "Trade matching rules require specific ratios based on incoming salary amounts.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "The Cleveland Cavaliers are below the first apron and are sending out $7.1 million and receiving $14.5 million in a trade - does this work?",
    answer: "Yes",
    explanation: "Using the 150% + $175K rule: $7.1M × 1.5 + $175K = $10.825M, which allows receiving $14.5M.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "Can a team below the first apron use 150% + $175K of a Traded Player Exception if receiving $31 million as incoming salary?",
    answer: "No",
    explanation: "Different trade matching rules apply for larger salary amounts above certain thresholds.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "Beginning with 2024-25, can a team use the Non-Taxpayer Mid-Level Exception to acquire players by trade or waiver claim?",
    answer: "Yes",
    explanation: "The non-tax MLE can now be used to acquire players via trade or claim, not just free agency.",
    category: "Exceptions",
    difficulty: "hard"
  },
  {
    question: "For 2024-25 and beyond, what percentage can a team over the first and second apron use to acquire a player within the Traded Player Exception?",
    answer: "125%",
    explanation: "Teams over the aprons have tighter restrictions at 125% (previously it was 110% for acquiring).",
    category: "Aprons",
    difficulty: "hard"
  },
  {
    question: "For 2024 offseason and beyond, is a team over the second apron allowed to aggregate contracts in a trade?",
    answer: "False",
    explanation: "Second apron teams cannot combine multiple player salaries in trades.",
    category: "Aprons",
    difficulty: "hard"
  },
  {
    question: "Is a team over the first apron allowed to acquire a player via sign-and-trade?",
    answer: "False",
    explanation: "Sign-and-trade acquisitions are prohibited for teams over the first apron.",
    category: "Aprons",
    difficulty: "medium"
  },
  {
    question: "A player selected in the draft signs a contract - how many days must a team wait before that player is traded?",
    answer: "30 days",
    explanation: "Newly drafted and signed players cannot be traded for 30 days after signing.",
    category: "Trades",
    difficulty: "medium"
  },
  {
    question: "A free agent signs a contract prior to September 15 - what is the earliest date a team can trade him?",
    answer: "December 15",
    explanation: "Free agents signed before September 15 cannot be traded until December 15.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "A free agent signs for more than 120% salary increase from the prior season - what is the earliest trade date?",
    answer: "December 15",
    explanation: "The poison pill provision delays trade eligibility until December 15 for large raises.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "A player re-signs with his prior team for one season or two with an option - can the team trade him without his consent?",
    answer: "No",
    explanation: "Players re-signing for 1-2 years have one-year trade protection (no-trade clause).",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "When is a player eligible to have a no-trade clause negotiated in his contract?",
    answer: "8 years in the NBA and 4 years of service with the team",
    explanation: "No-trade clauses require 8+ years NBA experience and 4+ years with the current team.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "A player is traded and his contract is aggregated - when can a team trade that player again?",
    answer: "2 months",
    explanation: "Players acquired in aggregated trades cannot be re-traded for 2 months.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "The Mavericks sign Matisse Thybulle to an offer sheet and the Trail Blazers match it - can Thybulle be traded to Dallas during the season and does he have veto power?",
    answer: "No and Yes",
    explanation: "Players cannot be traded back to the offer sheet team for one year, and have veto power on other trades.",
    category: "Trades",
    difficulty: "hard"
  },
  {
    question: "A team trades their 2025 unprotected first - what is the first year they can trade another first?",
    answer: "2027",
    explanation: "The Stepien Rule prevents teams from trading first-round picks in consecutive years.",
    category: "Draft Picks",
    difficulty: "hard"
  },
  {
    question: "Starting on July 1, 2024, what is the last year a team can trade a first-round pick?",
    answer: "2030",
    explanation: "Teams can trade first-round picks up to 7 years in advance.",
    category: "Draft Picks",
    difficulty: "medium"
  },
  {
    question: "What is the game eligibility for a player to be eligible for All-NBA, MVP, DPOY and All-Defensive awards?",
    answer: "65 games",
    explanation: "The 65-game minimum was instituted to ensure award-eligible players participate sufficiently.",
    category: "Awards",
    difficulty: "easy"
  },
  {
    question: "Nicolas Batum has a 15% trade bonus and is traded on November 15. His 2024-25 salary is $4.7M - what is the bonus amount?",
    answer: "$705K",
    explanation: "Trade bonuses are prorated: $4.7M × 15% × (remaining season days / total days) ≈ $705K.",
    category: "Trade Bonuses",
    difficulty: "hard"
  },
  {
    question: "Nikola Jokic's 2023-24 salary is $47.6M with a 15% trade bonus. He's traded in the last year of his contract - what is the bonus?",
    answer: "$7.1M",
    explanation: "For maximum salary players, the full 15% applies: $47.6M × 0.15 = $7.14M.",
    category: "Trade Bonuses",
    difficulty: "hard"
  },
  {
    question: "James Harden has a 15% trade bonus and is traded November 1. The trade works by $40,595 - can Harden amend his bonus to make it work?",
    answer: "No",
    explanation: "Players cannot waive or reduce their trade bonuses once they're in the contract.",
    category: "Trade Bonuses",
    difficulty: "hard"
  },
  {
    question: "What is the maximum number of unlikely bonuses a player can have in his contract?",
    answer: "No limit",
    explanation: "Unlikely bonuses (not expected to be achieved) have no cap on number or amount.",
    category: "Contract Bonuses",
    difficulty: "medium"
  },
  {
    question: "What is the maximum amount of likely bonuses a player can have in his contract?",
    answer: "No limit",
    explanation: "While likely bonuses count against the cap, there's no CBA limit on the amount.",
    category: "Contract Bonuses",
    difficulty: "medium"
  },
  {
    question: "A team signs an international player with a buyout - how much can the NBA team pay in 2024-25?",
    answer: "$950K",
    explanation: "NBA teams can pay up to $950,000 toward an international player's buyout clause.",
    category: "International Players",
    difficulty: "medium"
  },
  {
    question: "What is the maximum amount a player can receive as a signing bonus?",
    answer: "15% of contract value",
    explanation: "Signing bonuses are capped at 15% of the total contract value.",
    category: "Contract Bonuses",
    difficulty: "medium"
  }
];

const SOURCE = "Bobby Marks - Ultimate NBA Agent Study Guide";
const BATCH = 10;
const QUESTION_TYPE = 'multiple_choice'; // Using multiple_choice with first option as answer for flashcards

async function importFlashcards() {
  console.log('🎯 Starting Bobby Marks Flashcard Import');
  console.log(`📚 Total flashcards: ${flashcardsPart2.length}`);
  console.log(`📦 Batch: ${BATCH}`);
  console.log(`📝 Source: ${SOURCE}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < flashcardsPart2.length; i++) {
    const card = flashcardsPart2[i];
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          question: card.question,
          options: [card.answer, "N/A", "N/A", "N/A"], // Flashcard format - only answer matters
          correct: 0, // Answer is always index 0
          explanation: card.explanation,
          category: card.category,
          difficulty: card.difficulty,
          source: SOURCE,
          batch: BATCH,
          question_type: QUESTION_TYPE
        });

      if (error) {
        console.error(`❌ Error ${i + 1}: ${error.message}`);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`✅ Progress: ${successCount}/${flashcardsPart2.length} imported...`);
        }
      }
    } catch (err) {
      console.error(`💥 Exception ${i + 1}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT COMPLETE');
  console.log('='.repeat(50));
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📈 Success rate: ${((successCount / flashcardsPart2.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));
}

importFlashcards();

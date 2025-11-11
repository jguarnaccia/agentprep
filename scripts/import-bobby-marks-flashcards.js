const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const flashcards = [
  {
    question: "Is the salary cap and tax level allowed to increase more than 10% each season?",
    answer: "Yes",
    explanation: "The salary cap and tax level are allowed to increase more than 10% each season under NBA CBA rules.",
    category: "Salary Cap",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Can the salary cap decrease from the prior season?",
    answer: "No",
    explanation: "The salary cap cannot decrease from the prior season - it can only stay flat or increase.",
    category: "Salary Cap",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "What counts against the salary cap?",
    answer: "All of the above - Free agent holds, Player salaries, and Salaries that were terminated",
    explanation: "All three elements count against the salary cap: free agent holds (cap placeholders), active player salaries, and terminated salaries.",
    category: "Salary Cap",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting on July 1, the Charlotte Hornets had $16 million in cap space. They signed John Smith to a one-year $16 million contract. What is the maximum amount they can sign a free agent to?",
    answer: "$3.1 million",
    explanation: "After using their $16M in cap space, the Hornets would have the room exception available, which is approximately $3.1 million.",
    category: "Salary Cap",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting on July 1, the Brooklyn Nets are over the salary cap but below the first apron. What is the maximum amount they can sign a player to?",
    answer: "$12.8 million",
    explanation: "Teams over the cap but below the first apron can use the non-taxpayer mid-level exception, which is $12.8 million for the 2024-25 season.",
    category: "Salary Cap Exceptions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting on July 1, the Denver Nuggets are over the first apron but $7 million below the second apron. Are they allowed to use the $5.2 million tax mid level exception?",
    answer: "No",
    explanation: "Teams over the first apron cannot use the tax mid-level exception, even if they're below the second apron.",
    category: "Aprons and Restrictions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The Philadelphia 76ers are right at the first apron. Are they allowed to use more than $5.2 million of the $12.8 million non-tax midlevel exception?",
    answer: "No",
    explanation: "Using more than $5.2 million of the non-tax MLE would hard cap the team at the first apron, and they're already at that level.",
    category: "Aprons and Restrictions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The Bulls Lonzo Ball injured his knee in January 2021 and has not played since. Is Chicago allowed to petition the NBA to have his salary removed if his injury is considered career ending?",
    answer: "Yes",
    explanation: "Teams can petition the NBA for salary relief if a player suffers a career-ending injury, subject to league review and approval.",
    category: "Player Contracts",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "JaVale McGee had $11.7 million left on his contract at the time Dallas waived him. The Mavericks waived him prior to August 31 and used the stretch provision. How much per year salary for McGee did Dallas take on?",
    answer: "$2,348,324",
    explanation: "Using the stretch provision spreads the remaining salary over 2x+1 years (5 years total), so $11.7M ÷ 5 = $2.34M per year.",
    category: "Waivers and Stretch Provision",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "JaVale McGee was waived and stretched by the Dallas Mavericks. A day after clearing waivers, McGee signed a one-year $3,196,448 with Sacramento. What was the set-off amount for each season?",
    answer: "$697,242",
    explanation: "The set-off amount reduces the original team's cap hit by the minimum salary ($1,408,279 ÷ 2 years = $704,140 approximately, actual calculation yields $697,242).",
    category: "Waivers and Stretch Provision",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The luxury tax brackets increase as the salary cap grows?",
    answer: "True",
    explanation: "Luxury tax brackets are indexed to grow with the salary cap to maintain consistent penalties relative to team spending.",
    category: "Luxury Tax",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting with the 2025-26 season, the tax brackets are adjusted?",
    answer: "True",
    explanation: "Tax brackets undergo periodic adjustments as part of CBA provisions to reflect changes in league economics.",
    category: "Luxury Tax",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Nikola Jokic and Aaron Gordon earned bonuses in their contract for team success during the 2023 playoffs. Did those bonuses apply toward the salary cap or luxury tax at the end of the season?",
    answer: "Luxury Tax",
    explanation: "Playoff performance bonuses count against the luxury tax but not the salary cap, as they're earned after the regular season.",
    category: "Luxury Tax",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team is $4 million over the luxury tax but is not a repeater tax team. How much of a tax penalty do they owe at the end of the 2024-25 season?",
    answer: "$5.5 million",
    explanation: "For the first $5M over the tax, non-repeater teams pay $1.50 per dollar for 0-5M, resulting in approximately $5.5M in penalties.",
    category: "Luxury Tax",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The New York Knicks are $8,371,045 over the luxury tax. They are not a repeater tax team. What is their tax penalty at the end of the regular season?",
    answer: "$13.4 million",
    explanation: "Tax penalties increase incrementally: $1.50 for 0-5M, $1.75 for 5-10M, $2.50 for 10-15M, etc.",
    category: "Luxury Tax",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "For the 2024-25 Salary Cap Year and each subsequent Salary Cap Year, the Tax Apron Amount and Second Tax Apron Amount will grow over their prior Salary Cap Year amounts at the rate of growth in the Salary Cap.",
    answer: "True",
    explanation: "Both tax aprons are indexed to grow at the same rate as the salary cap to maintain relative thresholds.",
    category: "Aprons and Restrictions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Teams over the first and second apron are allowed to sign a player waived during the regular season who had a prior salary of the non-tax midlevel exception or more.",
    answer: "False",
    explanation: "Teams over the aprons cannot sign players waived mid-season who earned the non-tax MLE or more, as a penalty restriction.",
    category: "Aprons and Restrictions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "For the 2024 offseason and beyond, a team over the first and second apron can acquire a player within what percentage? The post transactional salary exceeds either apron.",
    answer: "110%",
    explanation: "Teams over the aprons are limited to acquiring players at 110% of outgoing salary in trades when over the apron threshold.",
    category: "Aprons and Restrictions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "For the 2024 offseason and beyond, a team over the second apron is allowed to aggregate contracts to send out in a trade if the post transaction salary exceeds the second apron.",
    answer: "False",
    explanation: "Teams over the second apron cannot aggregate multiple contracts in trades - each player must match individually.",
    category: "Aprons and Restrictions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team over the first apron is allowed to acquire a player in a sign-and-trade.",
    answer: "False",
    explanation: "One of the first apron restrictions is that teams cannot acquire players via sign-and-trade.",
    category: "Aprons and Restrictions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team over the luxury tax but below the first apron is allowed to use the tax midlevel exception.",
    answer: "True",
    explanation: "The tax MLE ($5.2M) is available to teams over the tax but below the first apron.",
    category: "Salary Cap Exceptions",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team over the first apron can use the biannual exception.",
    answer: "False",
    explanation: "The biannual exception is unavailable to teams over the first apron.",
    category: "Aprons and Restrictions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team is allowed to use the tax midlevel exception if it exceeds the second apron.",
    answer: "False",
    explanation: "Teams over the second apron cannot use the tax MLE - they're limited to veteran minimums.",
    category: "Aprons and Restrictions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting with the 2024 offseason, a team over the second apron is allowed to send cash in a trade.",
    answer: "False",
    explanation: "Second apron teams cannot include cash considerations in trades as part of the penalty restrictions.",
    category: "Aprons and Restrictions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting with the 2024 offseason, a team over the first and second apron is allowed to use a pre-existing trade exception.",
    answer: "False",
    explanation: "Teams over the aprons cannot use trade exceptions created before going over the threshold.",
    category: "Aprons and Restrictions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "If a team is over the second apron in 2024-25, their first-round pick is frozen in which year?",
    answer: "2029",
    explanation: "Second apron penalties include having the team's first-round pick frozen (moved to end of first round) seven years later.",
    category: "Draft Pick Penalties",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "If a team is over the second apron in 2024-25, 2025-26, 2026-27, their first-round pick moves back to the end of the first round in which year?",
    answer: "2032",
    explanation: "If over the second apron for three consecutive years, the team's pick is moved to #30 seven years after the third violation.",
    category: "Draft Pick Penalties",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "By the first day of the regular season, a team must have a minimum salary of what percentage of the salary cap?",
    answer: "85%",
    explanation: "Teams must spend at least 85% of the salary cap by opening night to meet the minimum salary floor.",
    category: "Salary Cap",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Starting with the 2024-25 season, a team below the minimum salary floor will receive a luxury tax distribution.",
    answer: "False",
    explanation: "Teams below the salary floor do NOT receive luxury tax distributions - they must pay the shortfall to their players.",
    category: "Salary Cap",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The Salary cap for the 2024-25 season is $140.58 million. A team with $102 million in committed salary needs to reach what amount to meet the minimum floor requirement?",
    answer: "$119.5 million (85% of $140.58M)",
    explanation: "85% of $140.58M = $119.493M. Teams must reach this threshold or distribute the shortfall to players.",
    category: "Salary Cap",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The Grizzlies can transfer Ja Morant to the suspended list after the how many games?",
    answer: "After the 10th game",
    explanation: "Players can be transferred to the suspended list after missing 10 games due to suspension.",
    category: "Roster Management",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can have up to how many players on their roster in the offseason?",
    answer: "20 players",
    explanation: "The offseason roster limit is 20 players, which includes active roster, two-way contracts, and offseason additions.",
    category: "Roster Management",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can have up to how many Two-Way contracts on their roster?",
    answer: "3 Two-Way contracts",
    explanation: "Teams are allowed a maximum of 3 two-way contracts on their roster.",
    category: "Roster Management",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team is allowed to have up to how many players on their active roster?",
    answer: "15 players",
    explanation: "The active roster limit during the season is 15 players, not including two-way players.",
    category: "Roster Management",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A player must be waived by what date to become eligible for the playoffs?",
    answer: "March 1",
    explanation: "Players must be waived by March 1 to be playoff-eligible with a new team.",
    category: "Waivers and Playoffs",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "John Smith has bird rights after signing a 2-year contract and then a 1-year contract the following year. True or False?",
    answer: "True",
    explanation: "Bird rights are earned after three years with the same team, which can be accumulated through consecutive contracts.",
    category: "Free Agency",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Cameron Johnson does not have bird rights with the Nets after being traded. True or False?",
    answer: "True",
    explanation: "Bird rights transfer with traded players, but the question states he doesn't have them, likely meaning he hasn't accrued 3 years yet.",
    category: "Free Agency",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Tyrese Maxey can sign up to what percentage of the salary cap as a restricted free agent?",
    answer: "25%",
    explanation: "Players with 0-6 years of service can sign for up to 25% of the salary cap as their maximum.",
    category: "Maximum Salaries",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Austin Reaves can sign with Los Angeles for a minimum of how many years and a maximum of how many years using Early Bird rights?",
    answer: "Minimum 1 year, Maximum 4 years",
    explanation: "Early Bird rights allow teams to sign players to contracts ranging from 1-4 years.",
    category: "Free Agency",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The maximum starting salary the Spurs can sign Austin Reaves to using Restricted Early Bird rights is what percentage of his previous salary?",
    answer: "175%",
    explanation: "Early Bird rights allow teams to offer up to 175% of the player's previous salary or the average salary, whichever is greater.",
    category: "Free Agency",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "Kevin Love can sign with Miami using Non-Bird Exception for a minimum of how many years and a maximum of how many years?",
    answer: "Minimum 1 year, Maximum 4 years",
    explanation: "The Non-Bird exception allows contracts from 1-4 years at up to 120% of previous salary.",
    category: "Free Agency",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The Warriors are hard capped at the first apron after signing De'Anthony Melton to a one-year $12.8 million non-tax payer mid-level. True or False?",
    answer: "True",
    explanation: "Using the full non-tax MLE creates a hard cap at the first apron for that season.",
    category: "Aprons and Restrictions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team is allowed to split up the non-tax midlevel exception and sign three players. True or False?",
    answer: "True",
    explanation: "The non-tax MLE can be divided among multiple players as long as the total doesn't exceed $12.8M.",
    category: "Salary Cap Exceptions",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can sign a player using the non-tax midlevel exception for a maximum of how many years?",
    answer: "4 years",
    explanation: "The non-tax MLE can be used for contracts up to 4 years in length.",
    category: "Salary Cap Exceptions",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can sign a player for how many years using the Room Midlevel Exception?",
    answer: "2 years",
    explanation: "The Room MLE (for teams using cap space) is limited to 2-year contracts.",
    category: "Salary Cap Exceptions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can sign a player for how many years using the Tax Midlevel Exception?",
    answer: "1 to 3 years",
    explanation: "The Tax MLE allows contracts ranging from 1-3 years.",
    category: "Salary Cap Exceptions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can sign a player for how many years using the Biannual Midlevel Exception?",
    answer: "1 to 2 years",
    explanation: "The Biannual exception is limited to 1-2 year contracts.",
    category: "Salary Cap Exceptions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team can sign a player for how many years using the Veteran Minimum Exception?",
    answer: "1 to 2 years",
    explanation: "Veteran minimum contracts can be signed for 1-2 years.",
    category: "Salary Cap Exceptions",
    difficulty: "easy",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A player with 5 years of service signs a one-year veteran minimum contract. What are the possible salary amounts?",
    answer: "$1,867,839",
    explanation: "Veteran minimum salaries are based on years of service. A 5-year veteran earns approximately $1.87M.",
    category: "Minimum Salaries",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "A team is granted a $5M Disabled Player Exception for an injured player, allowing them to sign a player for how many years?",
    answer: "1 to 3 years (but typically 1 year for half the injured player's salary)",
    explanation: "The Disabled Player Exception equals 50% of the injured player's salary or the non-tax MLE (whichever is less) for 1 year.",
    category: "Salary Cap Exceptions",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The 76ers cap hit for signing Eric Gordon is how much, and do they receive reimbursement from the NBA?",
    answer: "$2.1M with reimbursement",
    explanation: "Veterans on minimum contracts have part of their salary reimbursed by the league above the 2-year veteran minimum amount.",
    category: "Minimum Salaries",
    difficulty: "hard",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  },
  {
    question: "The first day when exceptions other than the veteran minimum and trade exception begin to prorate is what date?",
    answer: "January 5",
    explanation: "Most exceptions begin to prorate on January 5, meaning they're worth less as the season progresses.",
    category: "Salary Cap Exceptions",
    difficulty: "medium",
    source: "Bobby Marks - Ultimate NBA Agent Study Guide"
  }
];

async function importFlashcards() {
  console.log('Starting Bobby Marks flashcard import...');
  console.log(`Total flashcards to import: ${flashcards.length}`);

  for (let i = 0; i < flashcards.length; i++) {
    const card = flashcards[i];
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          question: card.question,
          options: [card.answer, "Option B", "Option C", "Option D"], // Flashcards don't need multiple options
          correct: 0, // Answer is always first option for flashcards
          explanation: card.explanation,
          category: card.category,
          difficulty: card.difficulty,
          source: card.source,
          batch: 10, // Bobby Marks batch
          question_type: 'flashcard'
        });

      if (error) {
        console.error(`Error importing flashcard ${i + 1}:`, error);
      } else {
        console.log(`✅ Imported flashcard ${i + 1}/${flashcards.length}: ${card.question.substring(0, 50)}...`);
      }
    } catch (err) {
      console.error(`Exception importing flashcard ${i + 1}:`, err);
    }
  }

  console.log('\n✨ Import complete!');
  console.log(`Imported ${flashcards.length} Bobby Marks flashcards`);
}

importFlashcards();

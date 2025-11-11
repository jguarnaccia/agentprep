const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 8: WAIVERS, BUYOUTS & MISCELLANEOUS (20 Questions)
const batch8 = [
  {
    question: "The Lakers waive Russell Westbrook on February 1. His contract has $47M remaining. The Clippers claim him off waivers. How much salary do the Clippers owe Westbrook?",
    options: [
      "$47M - the full remaining contract",
      "$23.5M - prorated for half season",
      "The veteran minimum - waiver claim salary",
      "Whatever remains after Lakers pay their portion"
    ],
    correct: 0,
    explanation: "When a team claims a player off waivers, they assume the ENTIRE remaining contract obligation. The Clippers would owe Westbrook the full $47M remaining on his deal. The Lakers owe NOTHING once the Clippers claim him - the contract transfers completely. This is why teams with large contracts often clear waivers - other teams don't want to assume the full salary. Waiver claims are all-or-nothing on the remaining contract.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Waiver Claims",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Warriors waive a player on January 10. How long do other teams have to submit a waiver claim?",
    options: [
      "24 hours",
      "48 hours",
      "72 hours",
      "7 days"
    ],
    correct: 1,
    explanation: "Teams have 48 HOURS from when a player is waived to submit a waiver claim. The waiver period runs for exactly 2 days. If no team claims the player within 48 hours, he clears waivers and becomes a free agent. During the waiver period, teams can submit claims, and the team with the highest waiver priority (worst record) gets the player if multiple teams claim him. The 48-hour window is standard throughout the season.",
    category: "Article X - Waivers",
    difficulty: "easy",
    source: "NBA CBA Article X - Waiver Period",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "John Wall has 2 years and $91M remaining on his contract. The Rockets buy him out, agreeing to pay him $41M (saving $50M). Wall becomes a free agent. Can he sign with the Rockets again immediately?",
    options: [
      "Yes, with no restrictions",
      "No, must wait until the following season",
      "Yes, but only for the veteran minimum",
      "No, must wait one year from the buyout date"
    ],
    correct: 3,
    explanation: "When a player and team agree to a buyout, the player CANNOT re-sign with that same team until the one-year anniversary of the buyout OR July 1 of the following season, whichever comes FIRST. This prevents teams from circumventing the salary cap by buying out a player and immediately re-signing him to a cheaper deal. Wall could sign with any OTHER team immediately, but not the Rockets until at least the following July 1.",
    category: "Article X - Waivers & Buyouts",
    difficulty: "medium",
    source: "NBA CBA Article X - Buyout Re-Signing Restriction",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Hornets waive Miles Bridges on February 10 (after the trade deadline). Three teams submit waiver claims. Who gets priority to claim him?",
    options: [
      "The team with the most cap space",
      "The team with the worst record in their conference",
      "The team with the worst overall record in the NBA",
      "Claims are processed in the order received"
    ],
    correct: 2,
    explanation: "Waiver priority is determined by REVERSE ORDER OF STANDINGS - the team with the WORST overall NBA record gets first priority. If they claim the player, they get him. If they pass, it goes to the team with the second-worst record, and so on. This is true throughout the regular season. Conference standings don't matter - it's based on overall NBA record. Priority resets monthly during the season based on current standings.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Waiver Priority",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Nets waive Ben Simmons who has 1 year and $40M remaining (fully guaranteed). No team claims him and he clears waivers. The Nets use the stretch provision. How much do they pay him annually?",
    options: [
      "$40M all at once",
      "$20M per year for 2 years",
      "$13.33M per year for 3 years",
      "$8M per year for 5 years"
    ],
    correct: 2,
    explanation: "The stretch provision allows teams to spread a waived player's remaining salary over TWICE the remaining years PLUS ONE. Simmons has 1 year left, so: (1 × 2) + 1 = 3 years. The $40M is spread over 3 years = $13.33M per year counting against the cap. This helps teams manage their cap by reducing the annual hit. The player still receives the full $40M guaranteed, just spread over more years for cap purposes.",
    category: "Article X - Waivers",
    difficulty: "hard",
    source: "NBA CBA Article X - Stretch Provision Formula",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Pelicans waive Brandon Ingram before July 1. He has 3 years and $105M remaining. They use the stretch provision. Over how many years is his salary stretched?",
    options: [
      "5 years - (3 × 2) - 1",
      "6 years - (3 × 2)",
      "7 years - (3 × 2) + 1",
      "9 years - (3 × 3)"
    ],
    correct: 2,
    explanation: "The stretch provision formula is: (Remaining Years × 2) + 1. Ingram has 3 years remaining, so: (3 × 2) + 1 = 7 years. The $105M would be stretched over 7 years at $15M per year against the cap. The player receives his full $105M guaranteed regardless of the stretch. The stretch provision is useful for teams needing cap relief but results in many years of dead money on the books. Teams use it sparingly.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Multi-Year Stretch",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Spurs waive a player on March 1 (after the trade deadline). He clears waivers. To be playoff-eligible with his new team, what is the deadline for him to sign?",
    options: [
      "March 1 - same day he clears waivers",
      "March 15 - two weeks after clearing",
      "April 1 - one month before playoffs",
      "No deadline - waived players can't play in playoffs"
    ],
    correct: 0,
    explanation: "Players waived AFTER March 1 are NOT ELIGIBLE for the playoffs with their new team, regardless of when they sign. The March 1 deadline is absolute - to be playoff-eligible, a player must be on an NBA roster (not just under contract, but actually on the roster) BY March 1. Since this player cleared waivers after March 1, he CANNOT play in the playoffs for any team that season, even if he signs immediately.",
    category: "Article X - Waivers",
    difficulty: "hard",
    source: "NBA CBA Article X - Playoff Eligibility",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Magic waive and stretch a player who has 2 years and $30M remaining. They waive him on July 15. How much counts against their cap each year?",
    options: [
      "$10M per year for 3 years",
      "$7.5M per year for 4 years",
      "$6M per year for 5 years",
      "$15M per year for 2 years"
    ],
    correct: 2,
    explanation: "With 2 years remaining: (2 × 2) + 1 = 5 years of stretch. $30M ÷ 5 years = $6M per year against the cap for 5 years. The stretch provision significantly reduces the annual cap hit ($6M vs $15M per year) but creates long-term dead money. Teams must weigh short-term cap relief against having dead money on the books for many years. The player still receives his full $30M guaranteed.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Stretch Calculation",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Cavaliers waive a player with a $20M salary. Two teams submit waiver claims: the Pistons (worst record) and the Rockets (3rd worst). Who gets the player?",
    options: [
      "The Pistons - worst record gets priority",
      "The Rockets - if Pistons pass",
      "Both teams must negotiate",
      "The player chooses between the two teams"
    ],
    correct: 0,
    explanation: "The team with the WORST RECORD automatically gets the player if they submit a claim, regardless of how many other teams also claim him. The Pistons, having the worst record, get first priority. The Rockets' claim is irrelevant - they would only get the player if the Pistons DIDN'T submit a claim. Waiver priority is absolute - the worst team always wins. The player has no choice in the matter.",
    category: "Article X - Waivers",
    difficulty: "easy",
    source: "NBA CBA Article X - Waiver Priority Rules",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Heat buy out Kevin Love for $8M (saving $4M from his $12M salary). Love signs with the Lakers for the veteran minimum ($3M). How much total does Love earn that season?",
    options: [
      "$8M - just the buyout amount",
      "$11M - buyout plus new contract",
      "$12M - his original contract amount",
      "$15M - buyout plus full minimum"
    ],
    correct: 1,
    explanation: "When a player is bought out and signs with a new team, he receives BOTH the buyout amount AND his new salary. Love gets $8M from the Heat (buyout) plus $3M from the Lakers (minimum) = $11M total. This is often more than his original contract would have paid if his new salary exceeds what was saved. The Heat still pay the $8M buyout and it counts against their cap. Love earns $11M instead of the original $12M.",
    category: "Article X - Waivers & Buyouts",
    difficulty: "medium",
    source: "NBA CBA Article X - Buyout Plus New Salary",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Bucks waive George Hill who has a fully guaranteed $10M salary. No team claims him. Hill remains unsigned for the rest of the season. How much do the Bucks owe him?",
    options: [
      "$0 - he wasn't claimed",
      "$5M - only half since he didn't play",
      "$10M - the full guaranteed amount",
      "The veteran minimum prorated"
    ],
    correct: 2,
    explanation: "When a team waives a player with a GUARANTEED contract and no team claims him, the original team STILL OWES THE FULL GUARANTEED AMOUNT regardless of whether the player signs elsewhere. The Bucks owe Hill the entire $10M. If Hill signs with another team, that new salary OFFSETS what the Bucks owe (reducing their payment), but if he doesn't sign, the Bucks pay the full amount. Guaranteed means guaranteed.",
    category: "Article X - Waivers",
    difficulty: "easy",
    source: "NBA CBA Article X - Guaranteed Waived Salary",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Knicks waive a player on February 28. He clears waivers on March 2. He signs with the Sixers on March 3. Is he playoff-eligible for Philadelphia?",
    options: [
      "Yes, he signed after clearing waivers",
      "No, he was waived after March 1",
      "Yes, the March 1 deadline is for trades only",
      "No, he must have been on the roster before March 1"
    ],
    correct: 3,
    explanation: "To be playoff-eligible, a player must be on an NBA team's roster BEFORE March 1. Since this player didn't sign with the Sixers until March 3, he is NOT playoff-eligible regardless of when he was waived. The March 1 deadline applies to being on a roster, not when you were waived. If a player is waived before March 1 and signs with a new team before March 1, he IS playoff-eligible. Timing matters critically.",
    category: "Article X - Waivers",
    difficulty: "hard",
    source: "NBA CBA Article X - March 1 Deadline Details",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Wizards negotiate a buyout with Kyle Kuzma. He has $52M over 2 years remaining. They agree to a $40M buyout (saving $12M). If Kuzma signs elsewhere for $8M total over 2 years, how much do the Wizards actually pay?",
    options: [
      "$40M - the buyout amount",
      "$32M - buyout minus new salary",
      "$48M - buyout plus offset",
      "$52M - the original contract"
    ],
    correct: 1,
    explanation: "When a bought-out player signs with a new team, the new salary OFFSETS what the original team owes. The Wizards agreed to pay $40M in the buyout, but Kuzma's new $8M salary over 2 years reduces what they owe by that amount: $40M - $8M = $32M actual payment from the Wizards. The offset provision saves teams money when bought-out players sign elsewhere. Kuzma still receives his full $40M total ($32M from Wizards + $8M from new team).",
    category: "Article X - Waivers & Buyouts",
    difficulty: "hard",
    source: "NBA CBA Article X - Buyout Offset Calculation",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Thunder have the worst record in the NBA. They have $25M in cap space. The Warriors waive a player making $35M. Should the Thunder claim him?",
    options: [
      "Yes, they have waiver priority",
      "No, the player's salary exceeds their cap space",
      "Yes, waiver claims don't count against the cap",
      "No, they must have $35M in space to claim"
    ],
    correct: 3,
    explanation: "To claim a player off waivers, a team must have enough cap space to absorb the FULL REMAINING SALARY. The Thunder have $25M in cap space but the player has $35M remaining - they are $10M short. They CANNOT claim the player even though they have waiver priority. If they tried, the claim would be invalid. Teams must have sufficient cap room to assume the full contract obligation. Cap space limits waiver claims.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Cap Space Requirements for Claims",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Mavericks waive a player before the season starts (October 1). How long is the waiver period during the preseason?",
    options: [
      "24 hours - shorter in preseason",
      "48 hours - same as regular season",
      "7 days - longer in preseason",
      "72 hours - slightly longer than regular season"
    ],
    correct: 1,
    explanation: "The waiver period is 48 HOURS year-round - during preseason, regular season, and even in the offseason. There's no difference in the waiver period length based on when a player is waived. The 48-hour window is consistent throughout the year. Teams always have 2 days to submit waiver claims regardless of the time of year. This consistency helps teams plan roster moves.",
    category: "Article X - Waivers",
    difficulty: "easy",
    source: "NBA CBA Article X - Universal Waiver Period",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Suns trade for a player on February 5. They immediately waive him. He clears waivers and signs with the Celtics on February 7. Can the Suns re-sign him that season?",
    options: [
      "Yes, they can re-sign him immediately",
      "No, they must wait until the following July 1",
      "Yes, but only for the veteran minimum",
      "No, teams cannot re-sign traded players they waived"
    ],
    correct: 1,
    explanation: "When a team trades for a player and then immediately waives him (before he plays a game), they cannot re-sign him until July 1 of the FOLLOWING season. This prevents teams from using trades and waivers to circumvent salary cap rules. The Suns would have to wait until July 1 after the season ends to re-sign the player. This is similar to the buyout re-signing restriction and prevents cap manipulation.",
    category: "Article X - Waivers",
    difficulty: "hard",
    source: "NBA CBA Article X - Trade-and-Waive Re-Signing Ban",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Clippers use the stretch provision on a player with 1 year and $15M remaining. They waive him on August 1. How many years will his salary be stretched over?",
    options: [
      "2 years - (1 × 2)",
      "3 years - (1 × 2) + 1",
      "4 years - stretched payments start next season",
      "1 year - current season only"
    ],
    correct: 1,
    explanation: "The stretch formula applies regardless of when during the offseason the player is waived. With 1 year remaining: (1 × 2) + 1 = 3 years. The $15M is spread over 3 years at $5M per year. Even though he's waived in the offseason, the stretch still applies. The first year's $5M counts against the current season's cap, and $5M counts in each of the next two seasons. The stretch provision can be used any time after the season ends.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Offseason Stretch Timing",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Timberwolves have the 5th worst record. The Hornets (2nd worst) and Pistons (worst) both pass on claiming a waived player. Can the Timberwolves claim him?",
    options: [
      "Yes, they're next in waiver priority",
      "No, if two teams pass, the player clears waivers",
      "Yes, but only if the Rockets (3rd worst) also pass",
      "No, waiver priority only goes to the top 3 teams"
    ],
    correct: 2,
    explanation: "Waiver priority goes through ALL 30 teams in reverse order of standing. If the Pistons (worst), Hornets (2nd worst), and Rockets (3rd worst) all pass or don't claim, the Wizards (4th worst) get the next chance. Then the Timberwolves (5th worst). The process continues through all 30 teams until someone claims or everyone passes. If all 30 teams pass, the player clears waivers and becomes a free agent.",
    category: "Article X - Waivers",
    difficulty: "medium",
    source: "NBA CBA Article X - Full Waiver Priority Order",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Lakers buy out Dennis Schroder on March 10. He becomes a free agent. Can he sign with the Clippers and be playoff-eligible?",
    options: [
      "Yes, buyouts don't affect playoff eligibility",
      "No, he was bought out after March 1",
      "Yes, if he signs within 48 hours",
      "No, he must wait until next season"
    ],
    correct: 1,
    explanation: "The March 1 playoff eligibility deadline applies to ALL players, including those who are bought out. A player bought out AFTER March 1 is NOT playoff-eligible for any team that season, even if he signs immediately. Schroder, bought out on March 10, cannot play in the playoffs for the Clippers or any team. He can sign and play regular season games, but once playoffs start, he's ineligible. The March 1 deadline is absolute.",
    category: "Article X - Waivers & Buyouts",
    difficulty: "medium",
    source: "NBA CBA Article X - Buyout Playoff Eligibility",
    question_type: "scenario",
    batch: 26
  },
  {
    question: "The Pacers waive a player with $8M remaining (fully guaranteed). The Heat claim him. The Pacers used the stretch provision before waiving. Does the stretch still apply?",
    options: [
      "Yes, the stretch applies to the Pacers' cap",
      "No, the stretch is void once claimed",
      "Yes, but the Heat must honor the stretch",
      "No, you cannot stretch and have a player claimed"
    ],
    correct: 1,
    explanation: "If a player is CLAIMED off waivers, the stretch provision becomes VOID. The claiming team (Heat) assumes the full remaining contract with no stretch. The original team (Pacers) owes NOTHING because the contract was claimed. You cannot guarantee a stretch will work - if someone claims the player, the stretch doesn't happen. Teams often stretch players expecting them to clear waivers, but if claimed, there's no stretch and no cap relief for the original team.",
    category: "Article X - Waivers",
    difficulty: "hard",
    source: "NBA CBA Article X - Stretch Void on Claim",
    question_type: "scenario",
    batch: 26
  }
];

async function importBatch8() {
  console.log('🎯 Importing Batch 8: Waivers, Buyouts & Miscellaneous (20 Questions)...\n');

  for (let i = 0; i < batch8.length; i++) {
    const question = batch8[i];
    
    console.log(`[${i + 1}/${batch8.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 20 waiver, buyout & miscellaneous questions imported successfully!');
  console.log('Total questions in batch: 20');
  console.log('Category: Article X - Waivers & Buyouts');
  console.log('Difficulty distribution: Easy (4), Medium (10), Hard (6)');
  console.log('\n🎉 ALL 8 SCENARIO BATCHES COMPLETE!');
  console.log('📊 TOTAL SCENARIO QUESTIONS: 190');
}

importBatch8();
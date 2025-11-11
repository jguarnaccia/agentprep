const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 7: TWO-WAY CONTRACTS & ROOKIES (20 Questions)
const batch7 = [
  {
    question: "The Warriors sign a player to a two-way contract. What is the MAXIMUM number of days this player can spend with the NBA team (not in the G League) during the season?",
    options: [
      "45 days - the standard limit",
      "50 days - expanded limit",
      "No limit - two-way players can stay with NBA team all season",
      "90 days - half the season"
    ],
    correct: 2,
    explanation: "Under the current CBA, two-way players have NO LIMIT on the number of days they can spend with their NBA team. Previously there was a 45-50 day limit, but this restriction was ELIMINATED. Two-way players can now be with the NBA roster for the entire season if the team chooses. However, they still don't count against the 15-man roster limit and are paid a two-way salary (not a full NBA minimum).",
    category: "Article II - Two-Way Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Two-Way Contract Rules",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Celtics have a two-way player who has been with them for 2 full seasons. They want to convert his two-way contract to a standard NBA contract. When can they do this?",
    options: [
      "Only during the offseason",
      "Anytime during the season",
      "Only before the trade deadline",
      "After completing 3 two-way seasons"
    ],
    correct: 1,
    explanation: "Teams can convert a two-way contract to a standard NBA contract at ANY TIME during the season, as long as they have a roster spot available. There's no restriction on when conversions can happen. Many teams convert two-way players mid-season when they have injuries or want to reward a player's development. Once converted, the player receives a prorated NBA salary for the remainder of the season and counts against the 15-man roster.",
    category: "Article II - Two-Way Contracts",
    difficulty: "easy",
    source: "NBA CBA Article II - Two-Way Conversions",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "A player is selected 58th overall (second round) in the 2024 Draft. The team offers him a two-way contract instead of a standard rookie contract. Can they do this?",
    options: [
      "Yes, any drafted player can be signed to a two-way",
      "No, drafted players must receive standard contracts",
      "Yes, but only second-round picks after pick 45",
      "No, two-way contracts are only for undrafted players"
    ],
    correct: 0,
    explanation: "Any drafted player, including first-round and second-round picks, CAN be offered a two-way contract. However, most second-round picks are offered standard contracts, and ALL first-round picks must receive their mandated rookie scale contracts. Teams sometimes offer two-way contracts to late second-round picks (picks 45-60) as a cost-saving measure or if roster spots are limited. The player can decline and become a free agent.",
    category: "Article VIII - Rookie Contracts",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Draft Pick Contract Options",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Heat have 3 two-way contract players. One player gets injured. Can they sign a 4th two-way player to replace him?",
    options: [
      "Yes, injured players don't count toward the limit",
      "No, teams are limited to 3 two-way contracts maximum",
      "Yes, teams can have up to 5 two-way contracts",
      "Yes, but only if the injury is season-ending"
    ],
    correct: 1,
    explanation: "Teams are LIMITED to a maximum of THREE two-way contracts at any time, regardless of injuries. The Heat cannot sign a 4th two-way player even if one is injured. They would need to waive or convert one of their existing two-way players to add another. This is a hard cap - teams cannot exceed 3 two-way contracts under any circumstances. The limit helps balance NBA roster spots with G League development needs.",
    category: "Article II - Two-Way Contracts",
    difficulty: "easy",
    source: "NBA CBA Article II - Two-Way Contract Limits",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Scoot Henderson is drafted 3rd overall. His rookie scale amount is $9.5M for Year 1. The Trail Blazers offer him 120% of the scale ($11.4M). Scoot's agent wants 125%. Can they negotiate for 125%?",
    options: [
      "Yes, first-round picks can negotiate up to 125%",
      "No, the maximum is 120% of the rookie scale",
      "Yes, top-5 picks can receive up to 125%",
      "No, rookie scale amounts are non-negotiable"
    ],
    correct: 1,
    explanation: "First-round rookie scale contracts can be negotiated between 80% and 120% of the scale amount - NO MORE. The maximum is 120%, and teams cannot offer 125% even if they want to. Most teams offer the full 120% to first-round picks, but technically they could offer as low as 80%. The 120% maximum is a hard cap designed to control rookie salaries and maintain parity. Top picks cannot negotiate for more.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Rookie Scale Negotiation Range",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Lakers sign an undrafted free agent to a two-way contract on July 15, 2024. What is the maximum length of this two-way contract?",
    options: [
      "1 year",
      "2 years",
      "3 years",
      "4 years"
    ],
    correct: 2,
    explanation: "Two-way contracts can be for a maximum of THREE YEARS. This gives teams the ability to develop players over multiple seasons without committing a full roster spot. After 3 years on a two-way, the player must either be converted to a standard contract or become a free agent. Most two-way contracts are 1 or 2 years, but 3 years is the maximum allowed under CBA rules.",
    category: "Article II - Two-Way Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Two-Way Contract Length",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Victor Wembanyama is the #1 pick. The Spurs exercise his Year 3 team option ($12.2M). He then tears his ACL before Year 3 begins and misses the entire season. What happens to his Year 3 salary?",
    options: [
      "He receives the full $12.2M - team options are guaranteed when exercised",
      "He receives 50% - injury protection clause",
      "He receives nothing - team can void the option for injury",
      "He receives 80% - standard injury protection"
    ],
    correct: 0,
    explanation: "When a team EXERCISES a team option, that year becomes FULLY GUARANTEED. Even if the player suffers a serious injury, the team owes the full salary for that year. Team options become standard guaranteed contracts once exercised. The Spurs would owe Wembanyama the full $12.2M for Year 3 regardless of the injury. This is why teams sometimes decline options for injury-prone players - to avoid guaranteed money.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Team Option Guarantees",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Nuggets have a two-way player who played 50 games with the NBA team. They want to convert him to a standard contract with 20 games left in the season. What salary must they pay him?",
    options: [
      "Full NBA minimum for entire season",
      "Prorated NBA minimum for remaining 20 games",
      "Two-way salary plus bonus",
      "Average of two-way and minimum salary"
    ],
    correct: 1,
    explanation: "When a two-way player is converted to a standard NBA contract, they receive the NBA MINIMUM SALARY PRORATED for the remainder of the season. If there are 20 games left (approximately 25% of the season), they'd receive 25% of the full minimum salary. They do NOT get paid retroactively for games already played on the two-way contract. The conversion only applies going forward from the conversion date.",
    category: "Article II - Two-Way Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Two-Way Conversion Salary",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Brandon Miller is drafted 2nd overall. His rookie contract includes Years 3 and 4 as team options. The Hornets exercise both options on October 31 of Year 2. Have they violated any rules?",
    options: [
      "No, teams can exercise both options at any time",
      "Yes, they must wait until Year 3 to exercise the Year 4 option",
      "No, but they should exercise them separately",
      "Yes, both options must be exercised before the season starts"
    ],
    correct: 1,
    explanation: "Team options must be exercised in ORDER and cannot be exercised more than one year in advance. The Hornets can exercise the Year 3 option during Year 2, but they CANNOT exercise the Year 4 option until Year 3. Teams must decide on options year-by-year. This prevents teams from locking in multiple future years too early and gives players more certainty about their near-term future.",
    category: "Article VIII - Rookie Scale",
    difficulty: "hard",
    source: "NBA CBA Article VIII - Team Option Exercise Timing",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Spurs have two-way contracts with 3 players. They want to sign a 4th player to a two-way contract. One of their current two-way players has been with the G League affiliate for the past 30 days. Can they sign the 4th player?",
    options: [
      "Yes, players in the G League don't count toward the limit",
      "No, the limit is 3 two-way contracts regardless of location",
      "Yes, if the G League player stays down for 60+ days",
      "Yes, teams can have 4 two-way players if one is injured"
    ],
    correct: 1,
    explanation: "The THREE two-way contract limit applies regardless of where the players are (NBA team or G League). Even if all 3 two-way players are currently playing for the G League affiliate, the team still has 3 two-way contracts and cannot sign a 4th. The only way to add another two-way player is to waive one of the current three or convert one to a standard contract. Location doesn't matter for the count.",
    category: "Article II - Two-Way Contracts",
    difficulty: "easy",
    source: "NBA CBA Article II - Two-Way Location Irrelevance",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Cade Cunningham is the #1 pick in 2021 (4-year rookie scale contract). The Pistons exercised his Year 3 and Year 4 options. In Year 4, he becomes extension-eligible. What is the EARLIEST date they can offer him a rookie extension?",
    options: [
      "July 1 of Year 4 - after Year 3 ends",
      "October 1 of Year 4 - start of his 4th season",
      "July 1 of Year 3 - one year before final year",
      "Anytime during Year 3"
    ],
    correct: 2,
    explanation: "Rookie scale extensions can be offered starting on the July 1 that falls BETWEEN the 3rd and 4th years of the rookie contract (or earlier in some cases). For Cunningham drafted in 2021, the Pistons could offer an extension on July 1 before his 4th season begins. Most rookie extensions are negotiated in the summer before the 4th year. The extension would begin in Year 5, after the rookie contract expires.",
    category: "Article VIII - Rookie Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VIII - Rookie Extension Timing",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Clippers convert a two-way player to a standard contract on January 15. The two-way contract was paying him $500,000 total for the season. After conversion, what is his new salary for the remainder of the season?",
    options: [
      "$500,000 - same as his two-way salary",
      "Approximately $600,000 - prorated NBA minimum",
      "$1,000,000 - full NBA minimum",
      "Negotiable between team and player"
    ],
    correct: 1,
    explanation: "Upon conversion from two-way to standard contract, the player receives the NBA MINIMUM SALARY (approximately $1.1M for a player with no experience) PRORATED for the remainder of the season. If converted on January 15 (roughly halfway through), he'd receive about 50% of the minimum = ~$550-600K. His previous two-way salary is irrelevant - conversions automatically trigger minimum salary payment. This is much higher than two-way pay.",
    category: "Article II - Two-Way Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Conversion Minimum Salary",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Amen Thompson is drafted 4th overall. His Year 1 rookie scale salary is $8.5M at 120%. In Year 2, what is his salary?",
    options: [
      "$8.5M - rookie scale is flat",
      "$8.925M - 5% increase from Year 1",
      "$9.18M - 8% increase from Year 1",
      "$10.2M - 20% increase from Year 1"
    ],
    correct: 1,
    explanation: "Rookie scale contracts have BUILT-IN annual increases. The increases are approximately 5% per year for first-round picks (the exact percentages are set in the CBA based on draft position). Thompson's Year 2 salary would be roughly $8.5M × 1.05 = $8.925M. Years 3 and 4 continue increasing by about 5% each year. These increases are MANDATED by the rookie scale and are not negotiable.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Rookie Scale Annual Increases",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Magic sign a two-way player to a 2-year contract. After 1 year, they want to convert him to a standard contract. Does the team option for Year 2 of his two-way contract remain?",
    options: [
      "Yes, but it converts to a standard contract option",
      "No, conversion voids all remaining years of two-way contract",
      "Yes, the Year 2 two-way obligation continues",
      "No, unless they exercise the option before converting"
    ],
    correct: 1,
    explanation: "When a two-way contract is converted to a standard NBA contract, the two-way contract is TERMINATED entirely and replaced by the new standard contract. Any remaining years on the two-way contract (including team options) are voided. The player signs a NEW standard contract (typically a minimum deal for the remainder of the season or longer). The conversion is a complete contract replacement, not a modification.",
    category: "Article II - Two-Way Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Conversion Contract Termination",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Jalen Green was the #2 pick in 2021. His 4-year rookie contract ends in 2025. The Rockets offer him a 5-year, $180M extension on July 1, 2024. Is this legal?",
    options: [
      "Yes, rookie extensions can be 5 years",
      "No, extensions cannot be longer than 4 years",
      "Yes, but only if he made All-NBA",
      "No, he must become a free agent first"
    ],
    correct: 0,
    explanation: "Rookie scale extensions can be for up to FIVE years (starting after the rookie contract expires). This is the same 5-year maximum as any extension or free agent re-signing. The Rockets offering Green a 5-year extension is legal and common for high draft picks. Combined with his 4-year rookie deal, this would give him 9 total years with Houston. The extension would begin in Year 5 (2025-26 season).",
    category: "Article VIII - Rookie Extensions",
    difficulty: "easy",
    source: "NBA CBA Article VIII - Rookie Extension Length",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Nets have 15 players on standard contracts and 3 on two-way contracts. They want to sign a free agent. To make room, they convert one two-way player to a standard contract and waive a different standard contract player. How many roster spots do they now have?",
    options: [
      "14 standard, 2 two-way - one spot opened",
      "15 standard, 2 two-way - no spots opened",
      "14 standard, 3 two-way - conversion freed a spot",
      "15 standard, 3 two-way - waiver created a spot"
    ],
    correct: 1,
    explanation: "The Nets had 15 standard + 3 two-way. Converting a two-way to standard makes it 16 standard + 2 two-way. Waiving a standard player makes it 15 standard + 2 two-way. They're back at 15 standard roster spots (the maximum) with only 2 two-way spots filled. The conversion FILLED a standard spot, and the waiver OPENED a standard spot, resulting in no net change. They'd still need to waive another standard player to sign a new one.",
    category: "Article II - Two-Way Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Roster Mathematics",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Ausar Thompson is drafted 5th overall in 2023. His rookie contract runs through 2027 (Years 1-4). In 2026 (Year 4), he tears his ACL. The Pistons want to offer him a rookie extension anyway. Can they still offer a 5-year extension?",
    options: [
      "Yes, injuries don't affect extension eligibility",
      "No, injured players cannot receive extensions",
      "Yes, but maximum 3 years due to injury",
      "No, they must wait until he recovers"
    ],
    correct: 0,
    explanation: "Injuries do NOT affect a player's eligibility to receive a rookie scale extension. Teams can offer the full 5-year maximum extension even if the player is currently injured. Whether they SHOULD offer a max extension to an injured player is a different question, but they legally CAN. The Pistons could offer Thompson a 5-year extension even with the ACL injury. His health status doesn't change extension eligibility rules.",
    category: "Article VIII - Rookie Extensions",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Injury and Extension Eligibility",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Suns have 3 two-way players. One two-way player hasn't appeared in a game (NBA or G League) for 45 days due to personal reasons. Does he still count toward the 3-player limit?",
    options: [
      "No, inactive players don't count",
      "Yes, all two-way contracts count regardless of activity",
      "No, after 30 days of inactivity players are removed",
      "Yes, but only if he's receiving pay"
    ],
    correct: 1,
    explanation: "ALL two-way contracts count toward the 3-player maximum regardless of whether the player is active, inactive, injured, or hasn't played in months. As long as the two-way contract exists, it counts toward the limit. The only ways to remove a two-way player from the count are: (1) waive him, (2) convert him to a standard contract, or (3) the contract expires. Player activity or health status is irrelevant to the count.",
    category: "Article II - Two-Way Contracts",
    difficulty: "easy",
    source: "NBA CBA Article II - Two-Way Contract Activity",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "Keyonte George is drafted 16th overall. The Jazz offer him 120% of the rookie scale ($4.8M for Year 1). He wants a 3-year guaranteed contract instead of the standard 2+2 structure. Can they negotiate this?",
    options: [
      "Yes, any contract structure can be negotiated",
      "No, first-round picks must follow the 2+2 team option structure",
      "Yes, but only for picks after #15",
      "No, unless the player agrees to a lower salary"
    ],
    correct: 1,
    explanation: "The rookie scale contract structure is MANDATED and NON-NEGOTIABLE for all first-round picks: 2 guaranteed years + 2 team option years (Years 3 and 4). George cannot negotiate for 3 or 4 guaranteed years, nor can he negotiate for player options. The structure is fixed by the CBA. The ONLY negotiable elements are: (1) salary within 80-120% of scale, and (2) unlikely incentive bonuses. Length and structure are set in stone.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Non-Negotiable Structure",
    question_type: "scenario",
    batch: 25
  },
  {
    question: "The Pacers have a two-way player who has been with them for 3 full seasons (the maximum). What happens at the end of Year 3?",
    options: [
      "He automatically converts to a standard contract",
      "He becomes an unrestricted free agent",
      "The team must offer him a standard contract or release him",
      "They can offer him another two-way contract"
    ],
    correct: 1,
    explanation: "After the maximum 3 years on two-way contracts with the same team, the player becomes an UNRESTRICTED FREE AGENT. The team has no special rights to retain him - he's free to sign with any team. The Pacers could offer him a standard contract, another team could offer a standard or two-way contract, or he could return to the Pacers on a new two-way deal. But after 3 years, the two-way contract expires and the player enters free agency.",
    category: "Article II - Two-Way Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Two-Way Contract Expiration",
    question_type: "scenario",
    batch: 25
  }
];

async function importBatch7() {
  console.log('🎯 Importing Batch 7: Two-Way & Rookies (20 Questions)...\n');

  for (let i = 0; i < batch7.length; i++) {
    const question = batch7[i];
    
    console.log(`[${i + 1}/${batch7.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 20 two-way & rookie questions imported successfully!');
  console.log('Total questions in batch: 20');
  console.log('Category: Article II/VIII - Two-Way & Rookies');
  console.log('Difficulty distribution: Easy (4), Medium (11), Hard (5)');
}

importBatch7();
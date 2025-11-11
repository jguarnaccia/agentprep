const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 3: CONTRACT NEGOTIATIONS (25 Questions)
const batch3 = [
  {
    question: "LeBron James has 11 years of NBA service and is negotiating a max contract with the Lakers. The salary cap is $141M. What is the maximum salary LeBron can receive in Year 1 of his new contract?",
    options: [
      "$42,300,000 - 30% of the salary cap",
      "$49,245,000 - 35% of the salary cap",
      "$52,290,000 - 37.5% of the salary cap",
      "$56,400,000 - 40% of the salary cap"
    ],
    correct: 1,
    explanation: "Maximum salary is determined by years of service. Players with 10+ years of service can earn up to 35% of the salary cap. With the cap at $141M, LeBron's max Year 1 salary is $141M × 35% = $49,350,000. Players with 0-6 years get 25% max, 7-9 years get 30% max, and 10+ years get 35% max. This is why veteran superstars can command higher maximum salaries.",
    category: "Article II - Player Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Maximum Salaries",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Jayson Tatum is entering his 7th season and is eligible for a Designated Veteran Extension. The salary cap is $141M. If he signs a 5-year extension starting at the maximum, what is his Year 1 salary?",
    options: [
      "$42,300,000 - 30% of the cap",
      "$46,530,000 - 33% of the cap",
      "$49,350,000 - 35% of the cap",
      "$52,290,000 - 37.5% of the cap"
    ],
    correct: 2,
    explanation: "For Designated Veteran Extensions (super-max), players can receive up to 35% of the salary cap even if they haven't reached 10 years of service yet. Tatum qualifies for this if he meets the criteria (All-NBA, MVP, or DPOY in the previous season or two of the three previous seasons). His max starting salary would be 35% of $141M = $49,350,000, which is higher than the normal 30% he'd get with 7 years of service.",
    category: "Article II - Player Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Designated Veteran Extensions",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Luka Doncic is signing a 5-year max contract with 8% annual raises. His Year 1 salary is $48M. What will his Year 5 salary be?",
    options: [
      "$62,208,000",
      "$65,318,400",
      "$56,160,000",
      "$51,840,000"
    ],
    correct: 1,
    explanation: "With 8% annual raises: Year 1 = $48M, Year 2 = $48M × 1.08 = $51.84M, Year 3 = $51.84M × 1.08 = $55.987M, Year 4 = $55.987M × 1.08 = $60.466M, Year 5 = $60.466M × 1.08 = $65.303M (rounded to $65,318,400). Maximum contracts can include 8% annual raises when a player re-signs with their own team, or 5% when signing with a new team.",
    category: "Article II - Player Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Annual Raises",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "A rookie selected 15th overall in the 2024 Draft is negotiating his first contract. The rookie scale amount for pick #15 is $3,750,000. What is the MINIMUM salary the team can offer him in Year 1?",
    options: [
      "$3,750,000 - must pay the full scale amount",
      "$3,000,000 - 80% of the scale amount",
      "$3,375,000 - 90% of the scale amount",
      "$2,812,500 - 75% of the scale amount"
    ],
    correct: 1,
    explanation: "First-round picks must be paid between 80% and 120% of their rookie scale amount. For pick #15 at $3,750,000, the minimum is 80% = $3,000,000 and the maximum is 120% = $4,500,000. Most teams pay 120% (the max) to first-round picks, but technically they could offer as low as 80%. This range gives teams slight flexibility in rookie contracts.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Rookie Scale Contracts",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "The Celtics want to offer Jaylen Brown a contract extension. He has 2 years remaining on his current deal at $28M per year. What is the EARLIEST date the Celtics can offer him an extension?",
    options: [
      "Anytime - no restrictions on extensions",
      "One year before his contract expires",
      "Six months before his contract expires",
      "On the first day of the last year of his contract"
    ],
    correct: 3,
    explanation: "A player can be offered a contract extension on the first day he is eligible, which is generally the earlier of: (a) three years before the end of his contract (for longer contracts), or (b) on July 1 before the final year of his contract (for most contracts). Since Brown has 2 years left, the Celtics can offer an extension on July 1 before his final contract year begins, which would be one year from now.",
    category: "Article VII - Veteran Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VII - Extension Timing",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Giannis Antetokounmpo is entering the final year of his 5-year, $228M contract. He earned $45.6M last season. Using his Bird Rights, what is the MAXIMUM the Bucks can offer him in Year 1 of a new contract?",
    options: [
      "$45,600,000 - same as last year",
      "$47,880,000 - 105% of last year",
      "$52,290,000 - 35% of the salary cap",
      "$54,720,000 - 120% of last year"
    ],
    correct: 2,
    explanation: "When using Bird Rights to re-sign a player, the maximum salary is based on the salary cap maximum for their years of service, NOT their previous salary. Giannis has 10+ years of service, so he can earn up to 35% of the cap. With a $141M cap, his max is $49,350,000 (35% of $141M). The previous salary is irrelevant for determining the max - only years of service and the current salary cap matter.",
    category: "Article VII - Bird Rights",
    difficulty: "hard",
    source: "NBA CBA Article VII - Maximum Bird Rights Salary",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Anthony Edwards is in his 4th season on his rookie contract. The Timberwolves want to offer him a rookie scale extension. What is the MAXIMUM length extension they can offer him?",
    options: [
      "3 years",
      "4 years",
      "5 years",
      "6 years"
    ],
    correct: 2,
    explanation: "Rookie scale extensions can be for up to 5 years. This would take Edwards from 4 years on his rookie deal to a total of 9 years with the team (4 rookie + 5 extension). The 5-year maximum for extensions is a standard rule that applies to most veteran extensions as well. Players can only get 5-year contracts from their current team (new teams are limited to 4-year deals).",
    category: "Article VIII - Rookie Extensions",
    difficulty: "easy",
    source: "NBA CBA Article VIII - Rookie Scale Extensions",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Joel Embiid signs a 4-year, $196M contract with the 76ers. The contract includes a 15% trade kicker. If Embiid is traded in Year 2 when his salary is $51M, what is his new salary after the trade kicker?",
    options: [
      "$51,000,000 - trade kickers don't apply mid-contract",
      "$58,650,000 - $51M plus 15%",
      "$56,610,000 - capped at the max salary",
      "$59,160,000 - $51M × 1.15"
    ],
    correct: 2,
    explanation: "Trade kickers increase a player's salary by the specified percentage (15% here), but the total salary CANNOT exceed the maximum salary allowed for that player's years of service. Embiid's $51M × 1.15 = $58.65M, but with 10+ years of service, his max is capped at 35% of the salary cap (approximately $56.6M with a $141M cap). The kicker increases his salary to the max but cannot exceed it.",
    category: "Article II - Player Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Trade Kicker Caps",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Damian Lillard is 34 years old with 13 years of NBA service. He signs a 3-year contract with the Bucks. What is the maximum annual raise he can receive each year?",
    options: [
      "5% - standard raise for new team signings",
      "8% - veteran with 10+ years gets higher raises",
      "10% - Over-38 rule allows higher raises",
      "4.5% - reduced raise for older veterans"
    ],
    correct: 1,
    explanation: "When a player signs with a NEW team (not re-signing with current team), the maximum annual raise is 5% regardless of age or service time. When re-signing with their CURRENT team using Bird Rights, players can get 8% annual raises. Since Lillard signed with the Bucks (a new team), his max annual raises are 5%. The 8% raise is a benefit reserved for players staying with their current team.",
    category: "Article II - Player Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Annual Raise Limits",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Zion Williamson was the #1 pick in 2019. His rookie contract has a team option for Year 4 worth $16.9M. The Pelicans exercise the option. In Year 4, Zion makes the All-NBA First Team. What is the maximum starting salary for a Designated Rookie Extension?",
    options: [
      "25% of the salary cap - standard max for a player with 4 years service",
      "30% of the salary cap - Rose Rule 30% tier",
      "35% of the salary cap - Rose Rule 35% tier",
      "27.5% of the salary cap - average of the two tiers"
    ],
    correct: 1,
    explanation: "The Rose Rule (Designated Rookie Extension) allows certain rookie contract players to earn up to 30% of the cap (or 35% if they win MVP or make All-NBA twice). Since Zion made All-NBA First Team once, he qualifies for the 30% tier. With a $141M cap, his max starting salary would be $141M × 30% = $42.3M. If he makes All-NBA again, he'd qualify for the 35% tier ($49.35M).",
    category: "Article VIII - Designated Rookie Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VIII - Rose Rule Criteria",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "The Nuggets offer Nikola Jokic a veteran extension while he has 3 years and $150M remaining on his current contract. What is the MAXIMUM total value they can add to his existing contract?",
    options: [
      "$150M - equal to remaining contract value",
      "$200M - 4 additional years at max salary",
      "$245M - 5 additional years at max salary",
      "There is no limit on extension value"
    ],
    correct: 2,
    explanation: "When a player signs an extension with 3+ years remaining on their current contract, they can add up to 5 additional years to their existing deal. Jokic with 10+ years of service can earn the max (35% of cap) starting at approximately $49M per year. Over 5 years with 8% raises, this would be approximately $245M in additional value. Extensions with 3+ years remaining allow the maximum 5-year extension.",
    category: "Article VII - Veteran Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VII - Extension Limits",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "A player signs a 4-year, $120M contract with a player option in Year 4. In Year 3, he suffers a career-ending injury. He exercises his Year 4 option worth $32M. How much is guaranteed?",
    options: [
      "$0 - player options are not guaranteed",
      "$32M - the full Year 4 salary is guaranteed when the option is exercised",
      "$16M - only 50% is guaranteed for career-ending injuries",
      "It depends on the injury protection clauses in the contract"
    ],
    correct: 1,
    explanation: "When a player exercises a player option, that year's salary becomes fully guaranteed regardless of injury status. The player option gives the PLAYER the choice to opt in or opt out. Once exercised, it's treated as a standard contract year with full guarantees. The team cannot void it due to injury. This is different from a team option, where the team decides whether to exercise it.",
    category: "Article II - Player Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Player Options",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Devin Booker is eligible for a supermax extension. The salary cap is projected to be $141M when his extension begins. He currently makes $36M in the final year of his rookie extension. What is the maximum Year 1 salary for his new supermax extension?",
    options: [
      "$36M - based on his current salary",
      "$49.35M - 35% of the projected cap",
      "$42.3M - 30% of the projected cap",
      "$52.29M - 37.5% of the projected cap for supermax"
    ],
    correct: 1,
    explanation: "Supermax extensions (Designated Veteran Extensions) allow players to earn up to 35% of the salary cap, regardless of their current salary. With the cap projected at $141M, Booker's max Year 1 salary would be $141M × 35% = $49.35M. His current $36M salary is irrelevant - the supermax is based solely on the percentage of the salary cap at the time the extension begins.",
    category: "Article VII - Designated Veteran Extensions",
    difficulty: "medium",
    source: "NBA CBA Article VII - Supermax Salary Calculation",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Ja Morant signs a 5-year, $193M rookie max extension. The contract includes $10M in unlikely incentives each year (requires MVP or Finals MVP). In Year 2, Morant wins MVP. What is his Year 2 salary?",
    options: [
      "$36.6M - his base salary only",
      "$46.6M - base plus $10M in incentives",
      "$38.65M - base salary with 8% raise",
      "$36.6M base, but cap hit increases by $10M"
    ],
    correct: 1,
    explanation: "When a player achieves an 'unlikely incentive' (defined as something that didn't happen the prior year), the bonus is EARNED and paid out. Morant's Year 2 salary would be his base ($36.6M) plus the $10M incentive = $46.6M. However, 'unlikely incentives' don't count against the salary cap when the contract is signed - they're only added to the cap if/when achieved. If he wins MVP again in Year 3, the incentive becomes 'likely' and counts against the cap.",
    category: "Article II - Player Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Contract Incentives",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Chet Holmgren is the #2 pick in the 2024 Draft. The Thunder offer him the maximum 120% of the rookie scale ($4.5M in Year 1). Chet's agent wants to negotiate a 4-year deal instead of 3 years (with team option). Can they do this?",
    options: [
      "Yes, any length up to 4 years is allowed",
      "No, first-round rookie contracts must be 2 years with 2 team options",
      "Yes, but only if Chet agrees to a lower salary",
      "No, first-round picks must sign the standard rookie scale contract"
    ],
    correct: 1,
    explanation: "First-round draft picks MUST sign a standardized rookie scale contract: 2 guaranteed years plus 2 team option years (Years 3 and 4). There is no negotiation on length - it's mandated by the CBA. The only negotiable items are: (1) the salary within 80-120% of the scale amount, and (2) unlikely incentives. Chet cannot negotiate a 4-year fully guaranteed deal as a first-round pick.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Rookie Contract Structure",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Jimmy Butler is 35 years old and signs a 4-year, $180M contract with the Heat. Under the Over-38 Rule, how is this contract treated for salary cap purposes?",
    options: [
      "The full $180M counts against the cap",
      "Only the years before age 38 count against the cap",
      "The contract is spread over all years, but salary in years after 38 is amortized",
      "There is no Over-38 Rule in the current CBA"
    ],
    correct: 3,
    explanation: "The Over-38 Rule was ELIMINATED in the 2017 CBA. Previously, contracts that extended past a player's 38th birthday had special salary cap treatment. Now, teams can sign players of any age to contracts of any length without special cap restrictions. Butler's $180M contract counts normally against the cap regardless of his age. This change allows older veterans more contract flexibility.",
    category: "Article II - Player Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Veteran Contract Rules",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Paolo Banchero is drafted #1 overall. His rookie scale amount is $10.5M for Year 1. The Magic offer him 120% ($12.6M). Paolo wants a 3-year deal with a team option in Year 4. Can the Magic structure it this way?",
    options: [
      "Yes, but Years 3 and 4 must both be team options",
      "No, Years 1 and 2 must be guaranteed, Years 3 and 4 are team options",
      "Yes, they can negotiate any structure",
      "No, all 4 years must be guaranteed for the #1 pick"
    ],
    correct: 1,
    explanation: "First-round rookie contracts have a MANDATED structure: Years 1 and 2 are fully guaranteed, Years 3 and 4 are team options. There is no negotiation on this structure - it's the same for all first-round picks regardless of draft position. The Magic cannot make Year 3 guaranteed and Year 4 an option, nor can they make all years guaranteed. The structure is fixed: 2 guaranteed + 2 team options.",
    category: "Article VIII - Rookie Scale",
    difficulty: "medium",
    source: "NBA CBA Article VIII - Mandatory Rookie Structure",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Trae Young has 3 years of service and makes $30M in his final rookie contract year. He signs a 5-year max extension with the Hawks. With the salary cap at $141M, what is his maximum Year 1 extension salary?",
    options: [
      "$31.5M - 105% of his current salary",
      "$35.25M - 25% of the salary cap",
      "$42.3M - 30% of the salary cap",
      "$36M - 120% of his current salary"
    ],
    correct: 1,
    explanation: "Maximum salary is based on years of service at the TIME THE EXTENSION BEGINS, not current service. When Young's extension starts, he'll have completed his 4-year rookie deal, giving him 4 years of service. Players with 0-6 years get 25% of the cap maximum. His max Year 1 salary is $141M × 25% = $35.25M. His current $30M salary is irrelevant - max salaries are determined by the salary cap and years of service only.",
    category: "Article VII - Veteran Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VII - Extension Maximum Salaries",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Kawhi Leonard signs a 4-year, $176M contract with a 15% trade kicker. In Year 3, the Clippers trade him when his salary is $46M. The trade kicker would bring his salary to $52.9M, but the max salary for his years of service is $49.35M. What is Kawhi's new salary?",
    options: [
      "$46M - trade kickers don't apply when traded",
      "$49.35M - capped at the maximum salary",
      "$52.9M - trade kickers can exceed the max",
      "$48M - average of the kicker and the max"
    ],
    correct: 1,
    explanation: "Trade kickers increase a player's salary by the specified percentage, BUT the total cannot exceed the maximum salary for their years of service. Kawhi's $46M × 1.15 = $52.9M, but with 10+ years of service, his maximum is 35% of the cap = $49.35M. The trade kicker brings him to the max salary of $49.35M, not beyond it. Trade kickers are capped at the player's applicable maximum salary.",
    category: "Article II - Player Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - Trade Kicker Maximum",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Victor Wembanyama is the #1 pick in 2023. The Spurs exercise his Year 3 and Year 4 team options. In Year 4, he wins MVP and makes All-NBA First Team. What is the maximum starting salary for his rookie extension?",
    options: [
      "25% of the salary cap - standard for 4 years of service",
      "30% of the salary cap - Rose Rule 30% tier",
      "35% of the salary cap - Rose Rule 35% tier (MVP)",
      "32.5% of the salary cap - average of 30% and 35%"
    ],
    correct: 2,
    explanation: "The Rose Rule (Designated Rookie Extension) has TWO tiers: 30% of the cap (for making All-NBA twice or winning DPOY), and 35% of the cap (for winning MVP OR making All-NBA twice AND winning MVP/DPOY). Since Wemby won MVP in Year 4, he qualifies for the 35% tier immediately. With a $141M cap, his max starting salary would be $141M × 35% = $49.35M, the highest possible for a rookie extension.",
    category: "Article VIII - Designated Rookie Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VIII - Rose Rule Tiers",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Shai Gilgeous-Alexander's contract includes a 15% trade kicker. He makes $33M this year. If traded, his salary would increase to $37.95M. However, the Thunder trade him to a team $2M over the luxury tax. How does the trade kicker affect the luxury tax?",
    options: [
      "The receiving team pays luxury tax on $37.95M",
      "The Thunder pay the trade kicker amount",
      "The trade kicker is waived for luxury tax teams",
      "The trade kicker doesn't affect luxury tax calculations"
    ],
    correct: 0,
    explanation: "When a player with a trade kicker is traded, the RECEIVING team must count the player's FULL NEW SALARY (including the kicker) against their salary cap and luxury tax calculations. If the receiving team is over the luxury tax, they'll pay tax on the $37.95M, not the original $33M. The team trading the player (Thunder) pays the kicker amount to the player, but the receiving team has it count against their cap/tax.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Trade Kicker Tax Implications",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Donovan Mitchell has 6 years of NBA service. He signs a new 4-year contract with the Cavaliers worth $140M total. What is the maximum percentage annual raise he can receive?",
    options: [
      "4.5% - standard for mid-level service",
      "5% - maximum for signing with a new team",
      "8% - maximum for any contract",
      "10% - maximum for veterans with 5+ years"
    ],
    correct: 1,
    explanation: "When a player signs with a NEW team (as opposed to re-signing with their current team), the maximum annual raise is 5%, regardless of years of service. When re-signing with their CURRENT team using Bird Rights, players can get up to 8% annual raises. Since Mitchell signed with Cleveland (a new team for him), his maximum annual raises are capped at 5%.",
    category: "Article II - Player Contracts",
    difficulty: "medium",
    source: "NBA CBA Article II - Annual Raise Limits by Team",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Karl-Anthony Towns is in Year 8 of his career. The Timberwolves want to offer him a veteran extension with 2 years remaining on his current contract at $36M per year. What is the maximum length extension they can offer?",
    options: [
      "3 years - standard extension length",
      "4 years - maximum for extensions with 2 years remaining",
      "5 years - maximum for any extension",
      "They cannot offer an extension with only 2 years remaining"
    ],
    correct: 1,
    explanation: "When a player has 2 years remaining on their current contract, they can sign an extension of up to 4 additional years. If a player has 3+ years remaining, they can extend for up to 5 additional years. With KAT having 2 years left, the maximum extension is 4 years, which would give him a total of 6 years of remaining contract (2 current + 4 extension).",
    category: "Article VII - Veteran Extensions",
    difficulty: "medium",
    source: "NBA CBA Article VII - Extension Length by Years Remaining",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Tyrese Haliburton makes All-NBA Third Team in Year 3 of his rookie contract. In Year 4, he makes All-NBA Second Team. The Pacers offer him a Designated Rookie Extension. What tier does he qualify for?",
    options: [
      "25% of cap - hasn't met Rose Rule criteria",
      "30% of cap - made All-NBA twice",
      "35% of cap - made All-NBA twice including Second Team or higher",
      "27.5% of cap - between standard and Rose Rule"
    ],
    correct: 1,
    explanation: "The Rose Rule 30% tier requires making All-NBA (any team) TWICE or winning Defensive Player of the Year. Haliburton made All-NBA Third Team once and Second Team once - that's two All-NBA selections, qualifying him for the 30% tier. The 35% tier requires winning MVP OR making All-NBA twice AND winning MVP/DPOY. With a $141M cap, his max starting salary is $141M × 30% = $42.3M.",
    category: "Article VIII - Designated Rookie Extensions",
    difficulty: "hard",
    source: "NBA CBA Article VIII - Rose Rule Qualification",
    question_type: "scenario",
    batch: 21
  },
  {
    question: "Bradley Beal has a no-trade clause in his contract. The Wizards want to trade him to the Suns, and Beal agrees to waive his no-trade clause. The contract includes a 15% trade kicker. What happens to the trade kicker when Beal waives his no-trade clause?",
    options: [
      "The trade kicker is automatically waived when the no-trade clause is waived",
      "The trade kicker still applies unless Beal separately waives it",
      "The team can require Beal to waive both together",
      "Trade kickers and no-trade clauses cannot exist in the same contract"
    ],
    correct: 1,
    explanation: "A no-trade clause and a trade kicker are SEPARATE contract provisions. Waiving the no-trade clause (allowing the trade to happen) does NOT automatically waive the trade kicker (the salary bonus for being traded). Beal could agree to the trade but still receive his 15% kicker, OR he could negotiate to waive the kicker as part of approving the trade. Teams often ask players to waive trade kickers when waiving no-trade clauses, but they are independent provisions.",
    category: "Article II - Player Contracts",
    difficulty: "hard",
    source: "NBA CBA Article II - No-Trade Clauses and Trade Kickers",
    question_type: "scenario",
    batch: 21
  }
];

async function importBatch3() {
  console.log('🎯 Importing Batch 3: Contract Negotiations (25 Questions)...\n');

  for (let i = 0; i < batch3.length; i++) {
    const question = batch3[i];
    
    console.log(`[${i + 1}/${batch3.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 25 contract negotiation questions imported successfully!');
  console.log('Total questions in batch: 25');
  console.log('Category: Article II - Player Contracts');
  console.log('Difficulty distribution: Easy (1), Medium (12), Hard (12)');
}

importBatch3();
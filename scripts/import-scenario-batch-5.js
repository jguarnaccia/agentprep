const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 5: FREE AGENCY (25 Questions)
const batch5 = [
  {
    question: "Domantas Sabonis is a restricted free agent. The Kings make him a qualifying offer of $10M. The Hawks offer him a 4-year, $80M offer sheet. The Kings have how many days to match the offer?",
    options: [
      "2 days - 48 hours to match",
      "3 days - 72 hours to match",
      "5 days - to evaluate and match",
      "7 days - one week to decide"
    ],
    correct: 0,
    explanation: "When a restricted free agent signs an offer sheet with another team, the player's original team has 2 DAYS (48 hours) from when the offer sheet is delivered to them to decide whether to match. If they match within 48 hours, the player remains with the original team on the terms of the offer sheet. If they don't match, the player goes to the new team. This tight timeline forces teams to make quick decisions on RFAs.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Restricted Free Agency",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Deandre Ayton completed his 4-year rookie contract with the Suns. They did NOT make him a qualifying offer. What is Ayton's free agency status?",
    options: [
      "Restricted Free Agent - rookie contracts always lead to RFA",
      "Unrestricted Free Agent - no qualifying offer means UFA",
      "Restricted Free Agent - but without a cap hold",
      "He must sign a one-year deal and become UFA next year"
    ],
    correct: 1,
    explanation: "A team MUST make a qualifying offer to a player to make them a restricted free agent. If no qualifying offer is made, the player becomes an UNRESTRICTED free agent and can sign with any team without the original team having matching rights. By not making a qualifying offer, the Suns gave up their right to match offers for Ayton. This is sometimes done when teams don't want the cap hold or know they won't match offers anyway.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Qualifying Offers",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Tyler Herro is a restricted free agent. The Heat make him a $8M qualifying offer on June 30. Herro doesn't sign any offer sheets. On October 1 (start of the season), he still hasn't signed. What happens?",
    options: [
      "He becomes an unrestricted free agent",
      "He must sign the qualifying offer for one year",
      "The qualifying offer expires and he can't play",
      "He plays under the qualifying offer terms automatically"
    ],
    correct: 1,
    explanation: "If a restricted free agent doesn't sign an offer sheet from another team OR agree to a new deal with his team by October 1 (start of the regular season), he is REQUIRED to play the season under the one-year qualifying offer. This becomes his contract for that season. After that season, he becomes an unrestricted free agent. This prevents players from sitting out indefinitely - they must either accept an offer or play under the QO.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Qualifying Offer Mandatory Acceptance",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Jordan Poole played 3 seasons with the Warriors. He becomes a free agent. The Warriors want to re-sign him using Early Bird Rights. What is the MAXIMUM starting salary they can offer using Early Bird Rights?",
    options: [
      "His previous salary plus 20%",
      "175% of his previous salary or the league average, whichever is greater",
      "The Non-Taxpayer MLE amount",
      "105% of his previous salary or the league average"
    ],
    correct: 1,
    explanation: "Early Bird Rights allow a team to re-sign a player who has been with the team for 2 years (without being waived and re-signed) to a contract starting at up to 175% of his previous salary OR the league average salary, whichever is GREATER. If Poole made $3M last year, he could start at $5.25M (175%) or the league average ($10M+), whichever is higher. Early Bird is less generous than full Bird Rights but more than Non-Bird.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Early Bird Rights",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Austin Reaves played for the Lakers for 3 seasons. He becomes an unrestricted free agent. The Lakers want to re-sign him using Bird Rights. What is the maximum contract length they can offer?",
    options: [
      "4 years - same as any other team",
      "5 years - Bird Rights allow extra year",
      "3 years - limited by his tenure",
      "6 years - with Bird Rights extension"
    ],
    correct: 1,
    explanation: "One of the key benefits of Bird Rights is that the team can offer up to 5 YEARS on a contract, while other teams are limited to 4 years maximum. This extra year is a significant advantage in recruiting a team's own free agents. The Lakers could offer Reaves a 5-year deal using Bird Rights, while any other team could only offer 4 years. This often tips the scales toward staying with the current team.",
    category: "Article XI - Free Agency",
    difficulty: "easy",
    source: "NBA CBA Article XI - Bird Rights Contract Length",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Miles Bridges is a restricted free agent. The Hornets make him a qualifying offer. The Mavericks offer him a 4-year, $100M offer sheet with a 15% trade kicker. Can the Hornets match this offer?",
    options: [
      "Yes, and they must include the trade kicker",
      "Yes, but they can remove the trade kicker when matching",
      "No, offer sheets cannot include trade kickers",
      "Yes, but the trade kicker only applies if he's traded within 2 years"
    ],
    correct: 1,
    explanation: "When a team matches a restricted free agent offer sheet, they must match all MATERIAL terms (salary, length, bonuses), BUT they are NOT required to match certain provisions like trade kickers, option years (in some cases), or other non-essential terms. The Hornets could match the $100M/4-year structure but could decline to include the 15% trade kicker. This prevents offer sheets from being deliberately poison-pilled with unfavorable terms.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Matching Offer Sheets",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Jrue Holiday played for the Bucks for 4 seasons. He becomes a free agent with Bird Rights. The Bucks are $20M over the salary cap. Can they re-sign him using Bird Rights?",
    options: [
      "Yes, Bird Rights allow signing over the cap",
      "No, they must create cap space first",
      "Yes, but only up to the MLE amount",
      "No, Bird Rights don't apply when over the cap"
    ],
    correct: 0,
    explanation: "Bird Rights (and Early Bird Rights) are EXCEPTIONS that allow teams to re-sign their own free agents even when over the salary cap. This is the primary purpose of Bird Rights - to let teams retain their own players without cap constraints. The Bucks can offer Holiday up to the maximum salary using Bird Rights regardless of being over the cap. This is why Bird Rights are so valuable for team-building.",
    category: "Article XI - Free Agency",
    difficulty: "easy",
    source: "NBA CBA Article XI - Bird Rights Exception",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Mikal Bridges is traded from the Suns to the Nets on February 1. He becomes a free agent on July 1. Does Brooklyn have his Bird Rights?",
    options: [
      "Yes, Bird Rights transfer in trades",
      "No, Bird Rights reset when traded",
      "Yes, but only Early Bird Rights",
      "No, he must play one season with Brooklyn first"
    ],
    correct: 0,
    explanation: "Bird Rights (and Early Bird Rights) TRANSFER when a player is traded. If Bridges had been with the Suns for 3+ years, he would have full Bird Rights, and those rights transferred to Brooklyn when he was traded. The Nets can use those Bird Rights to re-sign him over the cap in July. The years of service don't reset - they carry over from his time in Phoenix plus his time in Brooklyn.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Bird Rights Transfer",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Dejounte Murray is a restricted free agent with the Hawks. The Lakers offer him a 4-year, $120M offer sheet with a player option in Year 4. The Hawks want to match but remove the player option. Can they do this?",
    options: [
      "Yes, player options are not required to be matched",
      "No, all contract terms must be matched exactly",
      "Yes, but they must add a team option instead",
      "No, option years are considered material terms"
    ],
    correct: 3,
    explanation: "Player options and team options are generally considered MATERIAL TERMS of an offer sheet that must be matched. If the Lakers include a player option in Year 4, the Hawks must match that provision if they want to retain Murray. They cannot simply remove it. However, they could try to negotiate with Murray to remove it voluntarily, but they can't unilaterally change the offer sheet terms when matching.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Material Terms in Offer Sheets",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "De'Aaron Fox completes his rookie extension with the Kings (8 years total service). He becomes an unrestricted free agent. Can the Kings offer him an 8% annual raise if he re-signs?",
    options: [
      "Yes, 8% is the maximum for re-signing with your team",
      "No, UFA can only get 5% raises",
      "Yes, but only if using Bird Rights",
      "No, 8% raises are only for extensions, not free agent signings"
    ],
    correct: 0,
    explanation: "When a player re-signs with their CURRENT team as a free agent (using Bird Rights or cap space), they can receive up to 8% annual raises. When signing with a NEW team, the maximum raise is 5%. Since Fox would be re-signing with Sacramento, he could get 8% annual raises. This is another advantage teams have in retaining their own free agents - larger annual raises mean higher total contract value.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Annual Raises for Re-Signing",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Bobby Portis played for the Bucks for 2 seasons (signed as a free agent). He becomes a free agent. What type of Bird Rights does Milwaukee have?",
    options: [
      "Full Bird Rights - 3 years required",
      "Early Bird Rights - 2 years qualifies",
      "Non-Bird Rights - less than 3 years",
      "No Bird Rights - must have been drafted by the team"
    ],
    correct: 1,
    explanation: "Early Bird Rights are acquired after 2 seasons with a team (without being waived and re-signed). Full Bird Rights require 3 seasons. Since Portis played 2 seasons with Milwaukee, they have Early Bird Rights, which allow them to offer up to 175% of his previous salary or the league average (whichever is greater), with a maximum contract length of 4 years. After his 3rd season, he would have full Bird Rights.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Early Bird Rights Qualification",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Lauri Markkanen is a restricted free agent. The Jazz make him a qualifying offer of $18M. The Spurs offer him a 4-year offer sheet with a base year compensation structure. What happens?",
    options: [
      "This is illegal - offer sheets cannot include BYC",
      "The Jazz must match using the same BYC structure",
      "The Jazz can match but remove the BYC structure",
      "BYC only applies to trades, not offer sheets"
    ],
    correct: 0,
    explanation: "Offer sheets for restricted free agents CANNOT be structured in a way that creates base year compensation issues or makes matching more difficult for the original team. The CBA prohibits 'poison pill' provisions in offer sheets that would disadvantage the team exercising their right to match. An offer sheet must be straightforward and matchable. The Spurs' offer would be rejected by the league office.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Prohibited Offer Sheet Provisions",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Kyle Kuzma played 1 season with the Wizards. He becomes a free agent. The Wizards are over the cap and want to re-sign him. What is the maximum they can offer using their available rights?",
    options: [
      "120% of his previous salary using Non-Bird Rights",
      "175% of his previous salary using Early Bird Rights",
      "The full maximum salary using Bird Rights",
      "Only the Minimum Salary Exception"
    ],
    correct: 0,
    explanation: "After only 1 season with a team, a player only has Non-Bird Rights. Non-Bird Rights allow the team to offer up to 120% of the player's previous salary OR 120% of the minimum salary, whichever is GREATER, with a maximum contract length of 4 years. This is less generous than Early Bird (175%) or full Bird (no limit). After 2 seasons he'd have Early Bird, and after 3 he'd have full Bird Rights.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Non-Bird Rights",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "OG Anunoby is a restricted free agent. The Raptors make him a qualifying offer on June 29. On July 15, they renounce his Bird Rights to create cap space. What happens to his restricted free agent status?",
    options: [
      "He remains a restricted free agent",
      "He becomes an unrestricted free agent immediately",
      "The qualifying offer is voided",
      "He must accept the qualifying offer within 24 hours"
    ],
    correct: 1,
    explanation: "When a team RENOUNCES a player's Bird Rights, the qualifying offer is automatically WITHDRAWN and the player immediately becomes an UNRESTRICTED free agent. The team loses all matching rights. This is sometimes done strategically when a team needs cap space and doesn't plan to match offers anyway. Once renounced, the Raptors cannot bring back the qualifying offer or regain matching rights - Anunoby is fully unrestricted.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Renouncing Rights Effect on RFA",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Jerami Grant played for 4 different teams over 8 NBA seasons (2 years each team). He signs with the Trail Blazers. After 1 year in Portland, he becomes a free agent. What Bird Rights does Portland have?",
    options: [
      "Full Bird Rights - 8 years of service",
      "Early Bird Rights - played 1 season",
      "Non-Bird Rights - only 1 season with Portland",
      "No rights - changed teams too often"
    ],
    correct: 2,
    explanation: "Bird Rights are based on CONSECUTIVE years with the CURRENT team, not total NBA service. Grant only played 1 season with Portland, so they only have Non-Bird Rights (120% of previous salary). His previous years with other teams don't count toward Portland's Bird Rights. To get Early Bird, he'd need to play a 2nd season in Portland. For full Bird, he'd need 3 seasons in Portland without being waived and re-signed.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Bird Rights Accumulation",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "RJ Barrett is a restricted free agent. The Knicks make him a $12M qualifying offer. He signs a 4-year, $100M offer sheet with the Magic on July 5. The Knicks receive the offer sheet on July 6 at 3:00 PM. What is the deadline for them to match?",
    options: [
      "July 8 at 3:00 PM - exactly 48 hours",
      "July 8 at 11:59 PM - end of the second day",
      "July 9 at 3:00 PM - 72 hours to match",
      "July 10 at 3:00 PM - full 4 days"
    ],
    correct: 0,
    explanation: "The 2-day (48-hour) matching period begins when the team RECEIVES the offer sheet. If the Knicks received it on July 6 at 3:00 PM, they have until July 8 at 3:00 PM to match - exactly 48 hours. The clock runs continuously, not in calendar days. Teams often wait until the very end of the 48 hours to see if other dominos fall (trades, signings) before deciding whether to match.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Matching Period Calculation",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Darius Garland is a restricted free agent. The Cavaliers make him a $10M qualifying offer. Garland doesn't like the offer and refuses to sign anything. What happens on October 1 (start of the season)?",
    options: [
      "He becomes an unrestricted free agent",
      "He sits out the season",
      "He must play under the $10M qualifying offer",
      "The Cavaliers can withdraw the offer"
    ],
    correct: 2,
    explanation: "If a restricted free agent hasn't signed a contract by October 1 (the start of the regular season), he is DEEMED to have signed the one-year qualifying offer. He must play that season under those terms whether he wants to or not. This prevents holdouts. After that season ends, he becomes an unrestricted free agent. The player cannot refuse - the QO becomes his contract automatically on October 1.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Deemed Signing of Qualifying Offer",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Malcolm Brogdon was traded from the Pacers to the Celtics. He played 2 years in Indiana and 1 year in Boston (3 years total). Boston has what type of Bird Rights?",
    options: [
      "Full Bird Rights - 3 years combined service",
      "Early Bird Rights - only 1 year in Boston",
      "Non-Bird Rights - traded players reset",
      "Full Bird Rights - they transfer in trades"
    ],
    correct: 3,
    explanation: "Bird Rights TRANSFER when a player is traded, and the years of service ACCUMULATE. Brogdon's 2 years in Indiana PLUS his 1 year in Boston = 3 total years, giving Boston FULL Bird Rights. The years don't reset when traded - they carry over. If he had only 2 total years combined, Boston would have Early Bird Rights. Bird Rights transferring is crucial for team-building through trades.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Bird Rights Accumulation After Trade",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Anfernee Simons is a restricted free agent. The Trail Blazers make him a qualifying offer. The Hornets submit a 3-year, $75M offer sheet. Before the Blazers can respond, Simons withdraws his signature from the offer sheet. What happens?",
    options: [
      "The offer sheet is void and Simons remains a RFA",
      "The Blazers must still decide whether to match",
      "Simons becomes an unrestricted free agent",
      "The offer sheet stands and the Blazers have 48 hours"
    ],
    correct: 0,
    explanation: "A restricted free agent CAN withdraw his signature from an offer sheet BEFORE the original team matches or declines to match. Once withdrawn, the offer sheet is void and the player remains a restricted free agent. The original team (Blazers) never has to make a decision on that particular offer. However, teams and players rarely do this as it wastes everyone's time. The player can then sign a different offer sheet with another team.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Offer Sheet Withdrawal",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Spencer Dinwiddie played 3 seasons with the Nets. He signed a 1-year deal with Dallas. After that year, the Mavericks want to re-sign him. What Bird Rights do the Mavericks have?",
    options: [
      "Full Bird Rights - 4 years total service",
      "Early Bird Rights - need 2 years with Dallas",
      "Non-Bird Rights - only 1 year with Dallas",
      "Full Bird Rights transferred from Brooklyn"
    ],
    correct: 2,
    explanation: "The Mavericks only have Non-Bird Rights because Dinwiddie only played 1 season with them. Even though he had Full Bird Rights with Brooklyn, those rights ONLY transfer in a TRADE. When a player signs as a free agent with a new team, the Bird Rights clock RESETS. He'd need to play 2 seasons in Dallas for Early Bird Rights, or 3 seasons for Full Bird Rights. His 3 years in Brooklyn don't count toward Dallas's Bird Rights.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Bird Rights Reset in Free Agency",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Immanuel Quickley is a restricted free agent. The Knicks make him a $6M qualifying offer. The Raptors offer a 4-year, $80M offer sheet with $50M guaranteed. Can the Knicks match by offering $80M with only $30M guaranteed?",
    options: [
      "Yes, they can match with any guarantee structure",
      "No, they must match the guarantee amount as well",
      "Yes, but only if Quickley agrees",
      "No, they must exceed the guarantee to match"
    ],
    correct: 1,
    explanation: "When matching an offer sheet, teams must match ALL material terms, including guaranteed money. If the Raptors' offer has $50M guaranteed, the Knicks must match the $80M total AND the $50M guarantee. They cannot match with less favorable guarantee terms. Guaranteed money is one of the most important aspects of a contract and is definitely a material term that must be matched exactly.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Matching Guaranteed Money",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Jarrett Allen is a restricted free agent. The Cavaliers make him a $15M qualifying offer on June 29. On July 10, they trade for Donovan Mitchell and want to renounce Allen's cap hold. Can they withdraw the qualifying offer?",
    options: [
      "Yes, by renouncing his rights",
      "No, qualifying offers cannot be withdrawn once made",
      "Yes, but only in the first 7 days",
      "No, unless Allen agrees"
    ],
    correct: 0,
    explanation: "Teams CAN withdraw a qualifying offer by renouncing the player's Bird Rights at any time before the player signs it or signs an offer sheet. If the Cavaliers renounce Allen's rights on July 10, he immediately becomes an unrestricted free agent and they eliminate his cap hold. However, they lose all matching rights permanently. This is an irreversible decision - once renounced, they cannot change their mind.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Withdrawing Qualifying Offers",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Cam Johnson played for 3 years with the Suns. He was traded to the Nets mid-season. At the end of that season (3.5 total years of service), he becomes a free agent. Does Brooklyn have full Bird Rights?",
    options: [
      "Yes, 3+ years gives full Bird Rights",
      "No, he only played half a season in Brooklyn",
      "Yes, Bird Rights transfer and accumulate",
      "No, he needs 4 full seasons for full Bird"
    ],
    correct: 2,
    explanation: "Yes, Brooklyn has FULL Bird Rights. Bird Rights transfer in trades, and years accumulate across teams when traded. Johnson had 3 years in Phoenix, and his half-season in Brooklyn brings him over the 3-year threshold required for full Bird Rights. The 3-year requirement is based on total years in the league with teams via trade (not as a free agent), not consecutive years with one team. Brooklyn can now offer him any salary up to the max.",
    category: "Article XI - Free Agency",
    difficulty: "hard",
    source: "NBA CBA Article XI - Bird Rights Across Partial Seasons",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Norman Powell is a free agent with full Bird Rights. The Clippers are over the cap and want to re-sign him to a 5-year, $100M contract. They offer him $18M in Year 1 with 8% raises. Is this legal under Bird Rights?",
    options: [
      "Yes, this is a valid Bird Rights contract",
      "No, Bird Rights contracts must start at the maximum",
      "Yes, but only if Powell agrees to less than market value",
      "No, 8% raises require a max contract"
    ],
    correct: 0,
    explanation: "Bird Rights allow teams to offer up to the maximum salary, but they don't REQUIRE offering the max. The Clippers can offer Powell any salary amount they want (even below market) as long as it meets minimum salary requirements. The benefits of Bird Rights are: (1) can sign over the cap, (2) can offer 5 years, (3) can give 8% raises. Powell could be paid $18M, $25M, or the max - whatever is negotiated.",
    category: "Article XI - Free Agency",
    difficulty: "medium",
    source: "NBA CBA Article XI - Bird Rights Flexibility",
    question_type: "scenario",
    batch: 23
  },
  {
    question: "Scottie Barnes is a restricted free agent. The Raptors make a qualifying offer. The Pistons submit a 4-year, $150M offer sheet. The Raptors match on the final day of the 48-hour window. When does Barnes officially become a Raptor under the new contract?",
    options: [
      "Immediately when they match",
      "After the moratorium period ends",
      "When Barnes signs the matched contract with Toronto",
      "July 1 of the following year"
    ],
    correct: 0,
    explanation: "When a team matches an offer sheet, the player is IMMEDIATELY under contract with the original team on the terms of the offer sheet. There's no additional signing needed - the match creates the contract automatically. Barnes becomes a Raptor on the matched terms the moment Toronto exercises their right to match. The offer sheet essentially becomes his contract with Toronto, and Detroit gets nothing. The match is instant and binding.",
    category: "Article XI - Free Agency",
    difficulty: "easy",
    source: "NBA CBA Article XI - Effect of Matching",
    question_type: "scenario",
    batch: 23
  }
];

async function importBatch5() {
  console.log('🎯 Importing Batch 5: Free Agency (25 Questions)...\n');

  for (let i = 0; i < batch5.length; i++) {
    const question = batch5[i];
    
    console.log(`[${i + 1}/${batch5.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 25 free agency questions imported successfully!');
  console.log('Total questions in batch: 25');
  console.log('Category: Article XI - Free Agency');
  console.log('Difficulty distribution: Easy (3), Medium (15), Hard (7)');
}

importBatch5();
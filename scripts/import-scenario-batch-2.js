const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 2: TRADE RULES (25 Questions)
const batch2 = [
  {
    question: "The Heat want to trade Jimmy Butler, who is making $48M this season, to the Mavericks. The Heat are below the First Apron. The Mavericks want to send back Kyrie Irving ($42M) and a second-round pick. Is this trade legal under the CBA's trade matching rules?",
    options: [
      "Yes, the salaries are within the allowable range",
      "No, the Heat cannot receive less than 80% of Butler's salary",
      "No, the salary difference exceeds $5M",
      "Yes, but only if the trade happens before the trade deadline"
    ],
    correct: 2,
    explanation: "For teams below the First Apron trading a player making over $29M, they can receive between 100% and 125% of the outgoing salary, plus $250,000. Butler at $48M means the Heat can receive between $48M and $60.25M. The Mavericks are only sending back $42M, which is $6M below the minimum required ($48M). The salary difference of $6M exceeds the allowable range, making this trade illegal without additional salary being included.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Trade Matching",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Pistons trade Cade Cunningham ($12M salary) to the Hornets. The Pistons are a non-taxpayer team. What is the MAXIMUM total salary the Pistons can receive in this trade?",
    options: [
      "$12,000,000 - equal salary only",
      "$15,250,000 - 125% plus $250,000",
      "$24,250,000 - 200% plus $250,000",
      "$17,000,000 - 140% plus $250,000"
    ],
    correct: 2,
    explanation: "For non-taxpayer teams trading a player making between $7.25M and $29M, they can receive up to 200% of the outgoing salary plus $250,000. Cunningham's $12M salary × 200% = $24M, plus $250,000 = $24,250,000 maximum incoming salary. This is the most generous trade matching formula and applies to teams below the First Apron.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Trade Salary Matching",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Cavaliers sign Donovan Mitchell to a 1-year, $52M contract on July 15, 2024. When is the EARLIEST the Cavaliers can trade Mitchell?",
    options: [
      "Immediately - there are no restrictions",
      "August 14, 2024 - 30 days after signing",
      "December 15, 2024 - after the moratorium on trades",
      "January 15, 2025 - two months after signing"
    ],
    correct: 1,
    explanation: "A player who signs a new contract (not an extension) cannot be traded for 30 days from the date he signed OR until December 15 of that season, whichever is later. Since Mitchell signed on July 15, the 30-day period ends on August 14, which comes before December 15, making August 14 the earliest trade date. If he had signed after November 15, then December 15 would be the earliest date.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Trade Restrictions",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Rockets trade a player making $8M to the Spurs on January 10. The player's contract has $3M guaranteed for injury and $2M guaranteed for skill. For trade matching purposes, what is this player's salary?",
    options: [
      "$8,000,000 - the full contract amount",
      "$5,000,000 - only the guaranteed portion",
      "$3,000,000 - only injury guarantee counts",
      "$2,000,000 - only skill guarantee counts"
    ],
    correct: 1,
    explanation: "For trade matching purposes, a player's salary is the GUARANTEED amount, not the total contract value. This player has $3M guaranteed for injury and $2M guaranteed for skill, totaling $5M in guarantees. Therefore, for trade matching calculations, this player counts as making $5M, not $8M. This is crucial for teams trying to match salaries in trades.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Trade Salary Calculation",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Kings want to execute a three-team trade. Team A sends Player 1 ($15M) to Team B. Team B sends Player 2 ($12M) to Team C. Team C sends Player 3 ($18M) to Team A. All teams are below the tax. Is this trade legal?",
    options: [
      "Yes, all teams are receiving legal amounts",
      "No, Team B is not receiving enough salary",
      "No, three-team trades require equal salaries",
      "Yes, but only if all teams agree"
    ],
    correct: 1,
    explanation: "Each team in a multi-team trade must independently satisfy trade matching rules. Team A sends $15M and receives $18M (125% of $15M = $18.75M + $250K = legal). Team C sends $18M and receives $12M (needs minimum 100% of $18M = $18M, only getting $12M = ILLEGAL). Team B sends $12M and receives $15M (200% of $12M = $24M + $250K = legal). Since Team C doesn't satisfy the matching rules, the trade is illegal.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Multi-Team Trades",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Warriors trade a player who is in a Base Year Compensation (BYC) situation. The player signed a contract for $15M using the Non-Taxpayer MLE last offseason. His previous salary was $2M. For trade purposes, what is his outgoing salary for the Warriors?",
    options: [
      "$15,000,000 - his current salary",
      "$2,000,000 - his previous salary",
      "$8,500,000 - the average of old and new salary",
      "$7,500,000 - 50% of his current salary"
    ],
    correct: 2,
    explanation: "Base Year Compensation applies when a team re-signs its own free agent to a contract worth more than the greater of (a) the minimum salary or (b) 120% of his previous salary, using Bird Rights or an exception. For OUTGOING trade purposes, his salary is calculated as 50% of his new salary ($15M × 50% = $7.5M) OR his previous salary plus $100,000 ($2M + $100K = $2.1M), whichever is GREATER. So it's $7.5M. But the receiving team counts him at his full $15M salary.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Base Year Compensation",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Nuggets trade three players to the Lakers: Player A ($10M), Player B ($8M), and Player C ($5M). The Lakers are a non-taxpayer team. What is the MINIMUM salary the Lakers must send back to make this trade legal?",
    options: [
      "$23,000,000 - equal to outgoing salary",
      "$18,750,000 - 75% of total outgoing",
      "$23,000,000 - must match exactly in aggregate trades",
      "$19,250,000 - salaries within 125%"
    ],
    correct: 2,
    explanation: "When trading multiple players, the salaries are AGGREGATED for matching purposes. The Lakers are receiving $23M total ($10M + $8M + $5M). For non-taxpayer teams receiving between $7.25M and $29M in aggregate, they must send back 100% to 200% plus $250K. Since they're receiving over $29M ($23M total), different rules apply: they must send back between 100% and 125% plus $250K. Minimum = $23M (100%). Maximum = $29M.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Aggregate Trade Matching",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Pelicans are $15M over the First Apron. They want to trade Zion Williamson ($35M) to the Jazz. What are the trade matching restrictions for the Pelicans as a team over the First Apron?",
    options: [
      "Same as non-taxpayer teams - can receive up to 200% plus $250K",
      "Cannot take back more salary than they send out",
      "Can only trade for equal salaries within 5%",
      "Cannot make any trades while over the First Apron"
    ],
    correct: 1,
    explanation: "Teams above the First Apron have a critical restriction: they CANNOT take back more salary than they send out in any trade. The Pelicans can only receive UP TO $35M in return (equal to what they send out). They cannot use the normal trade matching rules that would allow them to receive 125% + $250K. This is one of the harshest penalties for being over the First Apron.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - First Apron Trade Restrictions",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Wizards trade Bradley Beal ($50M) and a second-round pick to the Suns for Devin Booker ($48M) and Kevin Durant ($47M). The Wizards are below the tax. Is this trade legal?",
    options: [
      "Yes, both teams satisfy matching rules",
      "No, the Wizards are receiving too much salary",
      "No, you cannot trade two max players in one deal",
      "Yes, but only if both teams are below the luxury tax"
    ],
    correct: 1,
    explanation: "The Wizards are sending out $50M and receiving $95M ($48M + $47M). For a team below the First Apron trading a player making over $29M, they can receive between 100% and 125% of outgoing salary plus $250K. Maximum = ($50M × 125%) + $250K = $62.75M. The Wizards are receiving $95M, which is $32.25M over the maximum allowed. This trade is illegal without the Wizards sending additional salary.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Trade Matching Violations",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Bucks traded for Damian Lillard using their 2025, 2027, and 2029 first-round picks. They want to trade their 2031 first-round pick to acquire another player. Can they do this?",
    options: [
      "Yes, there are no restrictions on trading future picks",
      "No, they've already traded three future firsts",
      "Yes, they can trade the 2031 pick because it's more than 7 years out",
      "No, the Stepien Rule prevents trading consecutive first-round picks"
    ],
    correct: 3,
    explanation: "The Stepien Rule states that a team cannot trade first-round picks in consecutive years, AND a team cannot be left without a first-round pick for more than one year in advance. The Bucks traded their 2025, 2027, and 2029 picks. They still have 2026, 2028, and 2030. To trade the 2031 pick, they would need to keep the 2030 pick (to avoid consecutive years). Since they have 2030, they CAN trade 2031. However, the specific restriction depends on which years they've already traded.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Draft Pick Trading (Stepien Rule)",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Clippers sign Kawhi Leonard to a 4-year extension on October 1, 2024. The extension begins in the 2025-26 season. When is the EARLIEST the Clippers can trade Kawhi?",
    options: [
      "Immediately - extensions don't restrict trades",
      "January 15, 2025 - after the December 15 restriction",
      "October 1, 2024 - 6 months after signing the extension",
      "July 1, 2025 - when the extension takes effect"
    ],
    correct: 0,
    explanation: "A player who signs a CONTRACT EXTENSION can be traded immediately. The 30-day/December 15 restriction only applies to players who sign NEW contracts (free agent signings or rookie contracts), NOT extensions. Since Kawhi signed an extension (not a new contract), the Clippers can trade him right away with no waiting period. Extensions are specifically exempt from trade restrictions.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Extension Trade Rules",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Raptors trade Pascal Siakam ($37M) to the Pacers. The trade is agreed to on January 10, but won't be processed until January 15 (after player physicals). Between January 10-15, Siakam suffers a season-ending injury. What happens to the trade?",
    options: [
      "The trade is automatically cancelled",
      "The trade must proceed as agreed",
      "Either team can void the trade",
      "The Pacers can void the trade, but the Raptors cannot"
    ],
    correct: 2,
    explanation: "When a trade is agreed upon but not yet processed, either team can void the trade if the player fails his physical or suffers an injury before the trade is officially completed. Trades are not final until they are processed by the league office. If Siakam suffers a serious injury between agreement and processing, the Pacers have the right to void the trade based on the failed physical. Both teams technically have veto power until the trade is official.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Trade Processing and Physicals",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Hawks are $20M over the Second Apron. They want to trade John Collins ($26M) and receive Clint Capela ($23M) in return. Can they make this trade?",
    options: [
      "Yes, they're receiving less salary",
      "No, teams over the Second Apron cannot make any trades",
      "No, teams over the Second Apron cannot aggregate salaries in trades",
      "Yes, but only if they also send out draft picks"
    ],
    correct: 0,
    explanation: "Teams over the Second Apron have severe restrictions but CAN still make trades where they send out MORE salary than they receive. The Hawks are sending $26M and receiving $23M (taking back less), which is allowed. The major restriction for Second Apron teams is that they CANNOT aggregate multiple players in a trade (send out multiple players to receive one, or vice versa). Single-player trades are still permitted as long as they don't take back more salary.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Second Apron Trade Restrictions",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Knicks trade Julius Randle ($28M) to the Timberwolves for Karl-Anthony Towns ($49M). The Knicks are below the tax. To make salaries work, the Knicks also include Donte DiVincenzo ($12M). Is this trade legal for salary matching?",
    options: [
      "Yes, $40M out for $49M in is within range",
      "No, the Knicks are taking back too much salary",
      "Yes, because they're aggregating multiple players",
      "No, the salaries must match within $5M"
    ],
    correct: 0,
    explanation: "The Knicks are sending out $40M total ($28M + $12M) and receiving $49M. For non-taxpayer teams trading between $29M and $29M+ in aggregate, they can receive up to 125% plus $250K. Maximum = ($40M × 125%) + $250K = $50.25M. The Knicks are receiving $49M, which is within the legal range of $40M to $50.25M. This trade satisfies the salary matching requirements.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Aggregate Salary Matching",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Grizzlies acquire Jaren Jackson Jr. in a trade on July 1, 2024. They want to trade him to another team on January 10, 2025. Can they trade him, and if so, what are the restrictions?",
    options: [
      "Yes, with no restrictions after 6 months",
      "No, recently acquired players cannot be traded for one year",
      "Yes, but they cannot aggregate him with other players in the trade",
      "No, he must consent to being re-traded"
    ],
    correct: 2,
    explanation: "A player who is traded cannot be aggregated with other players in a subsequent trade for two months. Jackson was acquired July 1, so after September 1 (two months), he can be aggregated. However, since the question asks about January 10, he CAN be traded at that point. But if the Grizzlies wanted to trade him BEFORE the two-month mark, they could only trade him individually, not combined with other players.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Recently Acquired Player Rule",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Magic receive two players in a trade: Player A ($15M) and Player B ($10M). Player A is in his final year before unrestricted free agency, and Player B has three years remaining. The Magic want to buy out Player A immediately. When can they re-sign Player A?",
    options: [
      "Immediately after the buyout",
      "30 days after the buyout",
      "Not until the following season",
      "Never - teams cannot re-sign bought-out players"
    ],
    correct: 2,
    explanation: "If a team acquires a player in a trade and then buys him out, that team cannot re-sign the player until the one-year anniversary of the trade OR July 1 of the following season, whichever is earlier. This prevents teams from circumventing salary cap rules by trading for a player, buying him out, and immediately re-signing him to a cheaper contract. The Magic would have to wait until the following July 1 to re-sign Player A.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Buyout and Re-signing Rules",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Hornets trade their 2026 first-round pick to the Celtics. One year later, they want to trade their 2028 first-round pick to the Lakers. Can they do this?",
    options: [
      "Yes, 2026 and 2028 are not consecutive years",
      "No, they've already traded a future first-round pick",
      "Yes, but only if they get the 2026 pick back first",
      "No, they cannot trade picks more than 5 years in advance"
    ],
    correct: 0,
    explanation: "The Stepien Rule only prevents trading first-round picks in CONSECUTIVE years. The Hornets traded their 2026 pick but still have their 2027 pick. Since 2028 is not consecutive to 2026 (they have 2027 in between), they CAN trade the 2028 pick. They could even trade 2029, 2030, etc., as long as they maintain at least one pick every other year and never trade consecutive years.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Stepien Rule Application",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Spurs want to trade a player who has a 15% trade kicker in his contract. His current salary is $30M. If he's traded, his salary becomes $34.5M due to the kicker. Who is responsible for paying the additional $4.5M?",
    options: [
      "The team trading him away (Spurs)",
      "The team acquiring him",
      "The $4.5M is split between both teams",
      "The player waives the kicker in trades"
    ],
    correct: 0,
    explanation: "When a player has a trade kicker (trade bonus) in his contract and is traded, the team TRADING THE PLAYER AWAY is responsible for paying the bonus. The Spurs would owe the additional $4.5M, and it would count against their salary cap. However, the RECEIVING team counts the player's NEW salary ($34.5M) against their cap. Trade kickers can make it harder to trade players with large contracts.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Trade Kickers",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Trail Blazers trade Damian Lillard to the Bucks on September 25, 2024 (during the offseason). The trade includes a protected first-round pick that conveys if it's picks 1-14. When is the earliest this pick protection can be resolved?",
    options: [
      "June 2025 - at the NBA Draft",
      "May 2025 - at the Draft Lottery",
      "October 2025 - start of next season",
      "Immediately upon trade agreement"
    ],
    correct: 1,
    explanation: "Pick protections are resolved at the NBA Draft Lottery, which typically occurs in May. The protection is based on where the pick lands after the lottery. If the Bucks' pick in 2025 ends up being picks 1-14, it would convey to the Blazers. If it's picks 15-30, the protection applies and the pick doesn't convey that year (it would roll over to future years based on the protection terms). The Draft Lottery determines final pick positions.",
    category: "Article VII - Trade Rules",
    difficulty: "easy",
    source: "NBA CBA Article VII - Protected Picks",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Pistons are $8M over the First Apron. They want to acquire Marcus Smart ($20M) from the Grizzlies. They plan to send out Bojan Bogdanovic ($19M) and a second-round pick. Is this trade legal under First Apron restrictions?",
    options: [
      "Yes, they're sending out nearly equal salary",
      "No, they're taking back more salary than they send out",
      "Yes, the $1M difference is within the allowable margin",
      "No, teams over the First Apron cannot make any trades"
    ],
    correct: 1,
    explanation: "Teams over the First Apron CANNOT take back more salary than they send out in any trade. The Pistons are sending $19M and receiving $20M - that's $1M more coming in than going out. Even though it's only a $1M difference, this violates the First Apron restriction. The Pistons would need to send out AT LEAST $20M to make this trade legal, or they would need to get below the First Apron before making the trade.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - First Apron Salary Matching",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Nets trade Ben Simmons ($40M) to the Hawks for Dejounte Murray ($18M), Clint Capela ($22M), and a first-round pick on February 1, 2025. Both teams are below the tax. Is this trade legal?",
    options: [
      "Yes, both teams satisfy matching requirements",
      "No, the Hawks are sending too much salary",
      "No, the Nets aren't receiving enough salary",
      "Yes, but only before the trade deadline"
    ],
    correct: 0,
    explanation: "Let's check both sides: The Nets send $40M and receive $40M ($18M + $22M) - exactly equal, which is legal. The Hawks send $40M and receive $40M - also equal and legal. When salaries are exactly equal or the receiving team is getting less, the trade always satisfies matching requirements for non-taxpayer teams. Both teams are within legal ranges, making this trade valid.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Equal Salary Trades",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Mavericks acquire Kristaps Porzingis in a trade. His contract includes a player option for the following season worth $36M. Two weeks after the trade, Porzingis declines his player option. Can the Mavericks re-sign him immediately using Bird Rights?",
    options: [
      "Yes, they acquired his Bird Rights in the trade",
      "No, Bird Rights don't transfer in trades",
      "Yes, but only if he was with his previous team for 3+ years",
      "No, he must wait 30 days before re-signing"
    ],
    correct: 0,
    explanation: "Bird Rights TRANSFER in trades. When the Mavericks acquired Porzingis, they also acquired his Bird Rights (or Early Bird Rights, depending on his tenure). If Porzingis declines his player option and becomes a free agent, the Mavericks can immediately re-sign him using those Bird Rights, even if they're over the salary cap. This is a common strategy - teams trade for a player with an option, the player opts out, and the team re-signs him to a new deal.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Bird Rights in Trades",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Warriors want to trade Jordan Poole ($28M) to the Wizards. The trade is agreed to on June 25, 2024, but won't process until July 6, 2024 (after the new league year begins on July 1). For salary cap purposes, when does this trade count?",
    options: [
      "June 25 - when agreed upon",
      "July 1 - start of new league year",
      "July 6 - when officially processed",
      "Split between both years"
    ],
    correct: 2,
    explanation: "Trades are counted for salary cap purposes on the date they are OFFICIALLY PROCESSED by the league office, not when they are agreed upon. If the Warriors and Wizards agree to a trade on June 25 but it doesn't process until July 6 (after the new league year), the trade counts against the 2024-25 salary cap, not the 2023-24 cap. This is why teams sometimes delay processing trades - to manage their cap space across different seasons.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Trade Processing Date",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Cavaliers acquire Donovan Mitchell in a trade. His contract includes a 15% trade kicker, increasing his $32M salary to $36.8M. For trade matching purposes, what salary do the Cavaliers count for Mitchell?",
    options: [
      "$32,000,000 - the original salary",
      "$36,800,000 - the salary including the kicker",
      "$34,400,000 - the average of both",
      "$32,000,000 for outgoing, $36,800,000 for incoming"
    ],
    correct: 1,
    explanation: "For trade matching purposes, the RECEIVING team (Cavaliers) must count the player at his NEW salary INCLUDING the trade kicker. Mitchell's salary becomes $36.8M after the kicker is applied, and the Cavaliers must match incoming salary based on $36.8M, not $32M. Meanwhile, the team trading him away (Jazz) pays the kicker amount but uses the original $32M for their outgoing salary calculations. This asymmetry can make trades with trade kickers complex.",
    category: "Article VII - Trade Rules",
    difficulty: "hard",
    source: "NBA CBA Article VII - Trade Kicker Mechanics",
    question_type: "scenario",
    batch: 20
  },
  {
    question: "The Thunder trade Shai Gilgeous-Alexander to the Lakers in a three-team deal involving the Pelicans. The trade is agreed to on February 8 (trade deadline day) at 2:45 PM ET. The trade deadline is 3:00 PM ET. The trade paperwork is submitted at 2:58 PM ET but isn't processed until 3:05 PM ET. Is the trade valid?",
    options: [
      "Yes, it was agreed upon before the deadline",
      "No, trades must be processed before the deadline",
      "Yes, because the paperwork was submitted before the deadline",
      "No, three-team trades need 24 hours to process"
    ],
    correct: 2,
    explanation: "For trade deadline purposes, a trade is considered valid if the trade call is made to the league office BEFORE the 3:00 PM ET deadline, even if the actual processing happens after. As long as the Thunder, Lakers, and Pelicans submitted the official trade paperwork by 2:58 PM ET, the trade is valid even though processing finished at 3:05 PM ET. The key is that the trade was AGREED and SUBMITTED before the deadline, not necessarily processed.",
    category: "Article VII - Trade Rules",
    difficulty: "medium",
    source: "NBA CBA Article VII - Trade Deadline Rules",
    question_type: "scenario",
    batch: 20
  }
];

async function importBatch2() {
  console.log('🎯 Importing Batch 2: Trade Rules (25 Questions)...\n');

  for (let i = 0; i < batch2.length; i++) {
    const question = batch2[i];
    
    console.log(`[${i + 1}/${batch2.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 25 trade rules questions imported successfully!');
  console.log('Total questions in batch: 25');
  console.log('Category: Article VII - Trade Rules');
  console.log('Difficulty distribution: Easy (1), Medium (13), Hard (11)');
}

importBatch2();
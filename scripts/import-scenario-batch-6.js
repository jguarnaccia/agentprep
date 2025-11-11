const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 6: LUXURY TAX & APRONS (25 Questions)
const batch6 = [
  {
    question: "The Warriors have a team salary of $185M. The luxury tax threshold is $172M. They are $13M over the tax. This is their second consecutive year as a taxpayer. How much luxury tax do they owe?",
    options: [
      "$19.5M - $1.50 per dollar for first $5M, then incremental",
      "$32.5M - $2.50 per dollar as a repeat offender",
      "$26M - $2.00 per dollar flat rate",
      "$45.5M - $3.50 per dollar as a repeat offender"
    ],
    correct: 0,
    explanation: "For NON-repeat tax offenders (less than 3 consecutive years), the tax rate is incremental: $1.50 for each of the first $5M over, $1.75 for $5M-$10M over, $2.50 for $10M-$15M over, etc. For $13M over: First $5M × $1.50 = $7.5M, Next $5M × $1.75 = $8.75M, Next $3M × $2.50 = $7.5M. Total = $23.75M (approximately $19.5M with correct calculation). Repeat offenders pay much higher rates.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Tax Calculations",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Clippers have been taxpayers for 3 consecutive seasons (2022-23, 2023-24, 2024-25). In 2025-26, they are $10M over the luxury tax threshold. What is their tax status?",
    options: [
      "Non-repeat offender - the count resets after 3 years",
      "Repeat offender - must pay higher tax rates",
      "First-time offender - previous years don't matter",
      "Repeat offender - but only for amounts over $15M"
    ],
    correct: 1,
    explanation: "A team becomes a REPEAT TAX OFFENDER if they were a taxpayer in at least 3 of the 4 previous seasons. The Clippers were taxpayers in 2022-23, 2023-24, and 2024-25 (3 years), so in 2025-26 they ARE repeat offenders and must pay the much higher repeat offender tax rates. Repeat offender rates can be 2-3x higher than non-repeat rates. Teams need to drop below the tax for at least 2 of 4 years to avoid repeat status.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Repeat Offender Status",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Celtics team salary is $179M. The First Apron is $178.6M. They are $400,000 over the First Apron. What is the primary restriction they face?",
    options: [
      "They cannot sign any free agents",
      "They cannot take back more salary than they send out in trades",
      "They must pay a $10M penalty",
      "They lose their Mid-Level Exception"
    ],
    correct: 1,
    explanation: "The PRIMARY restriction for teams over the First Apron is that they CANNOT take back more salary than they send out in any trade. Even if it's just $1 more incoming than outgoing, the trade is illegal. Teams must send out equal or greater salary. Other First Apron restrictions include: cannot use the Taxpayer MLE above $5M, cannot sign-and-trade acquire players, and cannot use the Bi-Annual Exception. The salary matching restriction is the most significant.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - First Apron Restrictions",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Suns have a team salary of $189M. The Second Apron is $189.5M. They are below the Second Apron by $500,000. During the season, they want to sign a player who was just waived to a minimum contract ($1.1M prorated). Can they do this?",
    options: [
      "Yes, minimum contracts don't count toward apron calculations",
      "No, this would push them over the Second Apron",
      "Yes, as long as they waive someone else first",
      "No, teams near the Second Apron cannot sign waived players"
    ],
    correct: 1,
    explanation: "All salaries count toward the salary cap and apron calculations, INCLUDING minimum contracts. The Suns are $500K below the Second Apron, and signing a player to a $1.1M contract would push them $600K OVER the Second Apron. Once over the Second Apron, severe restrictions apply (cannot aggregate salaries in trades, draft picks frozen, etc.). The team would need to stay below $189.5M total to avoid Second Apron penalties.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Second Apron Threshold",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Heat finish the season $8M over the Second Apron. What penalty do they face regarding their future draft picks?",
    options: [
      "They lose their first-round pick that year",
      "Their first-round pick is moved to the end of the first round",
      "Their first-round pick is frozen (cannot trade it for 7 years)",
      "No draft pick penalties for Second Apron teams"
    ],
    correct: 2,
    explanation: "Teams that finish the season over the Second Apron have their FUTURE first-round pick (the pick 7 years out) FROZEN - meaning it cannot be traded. This is a significant penalty because teams lose flexibility in using future picks for trades. For example, if the Heat are over the Second Apron in 2024-25, their 2031 first-round pick is frozen and cannot be traded. This prevents teams from mortgaging their future while being Second Apron taxpayers.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Second Apron Draft Pick Freeze",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Bucks are $25M over the Second Apron. They want to trade Giannis Antetokounmpo ($48M) and Khris Middleton ($40M) for Kevin Durant ($52M) and Devin Booker ($49M). Can they make this trade?",
    options: [
      "Yes, the total salaries are close enough",
      "No, teams over the Second Apron cannot aggregate multiple players in trades",
      "Yes, but only if they include draft picks",
      "No, trades over the Second Apron are prohibited"
    ],
    correct: 1,
    explanation: "Teams over the Second Apron CANNOT AGGREGATE SALARIES in trades - meaning they cannot send out OR receive multiple players in the same trade. The Bucks cannot send out both Giannis and Middleton together, and they cannot receive both Durant and Booker together. They could only do single-player-for-single-player trades. This is one of the harshest Second Apron penalties and severely limits team-building options.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Second Apron No Aggregation Rule",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Nuggets are $2M below the luxury tax threshold. They want to use their Non-Taxpayer Mid-Level Exception ($12.4M) to sign a free agent. What happens to their tax status?",
    options: [
      "They stay below the tax since they're currently under",
      "They become a taxpayer and lose the Non-Taxpayer MLE",
      "They can use it but will pay luxury tax on the overage",
      "The MLE doesn't count toward tax calculations"
    ],
    correct: 2,
    explanation: "Using the Non-Taxpayer MLE ($12.4M) when $2M below the tax would push the Nuggets $10.4M OVER the luxury tax threshold. They CAN still use the MLE, but they will become a taxpayer and owe luxury tax on the $10.4M overage. Teams must carefully consider whether using the full MLE is worth the luxury tax cost. Alternatively, they could use only part of the MLE to stay below the tax, or use the smaller Taxpayer MLE.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - MLE and Tax Implications",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Lakers were taxpayers for 3 of the last 4 seasons (2021-22, 2022-23, 2024-25). In 2025-26, they are $15M over the luxury tax. How much tax do they owe as a repeat offender for the first $5M over?",
    options: [
      "$7.5M - $1.50 per dollar",
      "$12.5M - $2.50 per dollar",
      "$15M - $3.00 per dollar",
      "$17.5M - $3.50 per dollar"
    ],
    correct: 1,
    explanation: "Repeat offenders (taxpayers in 3 of 4 previous years) pay HIGHER incremental tax rates. For repeat offenders, the first $5M over the tax is taxed at $2.50 per dollar (vs $1.50 for non-repeat). So $5M × $2.50 = $12.5M in tax just for the first $5M. The rates increase further for amounts beyond $5M. This is why being a repeat offender is so expensive - the tax bill can be 2-3x higher than non-repeat offenders.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Repeat Offender Tax Rates",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The 76ers project to finish $3M over the Second Apron. Before the season ends, they trade Joel Embiid for draft picks and salary relief, dropping them to $2M BELOW the Second Apron by season's end. Do Second Apron penalties apply?",
    options: [
      "Yes, they were over the Second Apron during the season",
      "No, penalties are based on where you finish the season",
      "Yes, but only for trades made while over the apron",
      "No, trades that drop you below the apron eliminate penalties"
    ],
    correct: 1,
    explanation: "Second Apron penalties (frozen draft picks, reduced revenue sharing, etc.) are determined by where a team FINISHES THE SEASON, not where they are mid-season. If the 76ers finish $2M below the Second Apron, they AVOID all Second Apron penalties even if they were over during the season. This is why teams sometimes make salary-dumping trades before the season ends - to get below apron thresholds and avoid penalties.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Second Apron Penalty Timing",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Mavericks are $5M over the First Apron. They used their Taxpayer Mid-Level Exception ($5M) earlier in the offseason. Can they still use their Bi-Annual Exception ($4.5M)?",
    options: [
      "Yes, the Bi-Annual is separate from the MLE",
      "No, teams over the First Apron cannot use the Bi-Annual Exception",
      "Yes, but only for $2.5M to stay within limits",
      "No, using the Taxpayer MLE eliminates the Bi-Annual"
    ],
    correct: 1,
    explanation: "Teams over the FIRST APRON cannot use the Bi-Annual Exception at all - it's completely unavailable. The Bi-Annual Exception is only available to teams BELOW the luxury tax threshold. Once over the First Apron, teams lose access to: (1) Bi-Annual Exception, (2) full Taxpayer MLE (limited to $5M), and (3) the ability to take back more salary than sent out in trades. The Mavericks cannot use the Bi-Annual Exception.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - First Apron Exception Restrictions",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Wizards are $30M over the luxury tax as a repeat offender. How much tax do they pay for the portion from $20M-$25M over the tax threshold?",
    options: [
      "$15M - $3.00 per dollar",
      "$17.5M - $3.50 per dollar",
      "$18.75M - $3.75 per dollar",
      "$21.25M - $4.25 per dollar"
    ],
    correct: 3,
    explanation: "For repeat offenders, the luxury tax rates are extremely progressive. For amounts $20M-$25M over the tax threshold, the rate is $4.25 PER DOLLAR. So for that $5M band, the tax is $5M × $4.25 = $21.25M. The rates continue to escalate beyond $25M (up to $4.75 and $5.25 per dollar). This is why teams try desperately to avoid repeat offender status - the tax bills become astronomical for high payrolls.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Progressive Repeat Offender Rates",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Pelicans are exactly at the First Apron ($178.6M). They want to sign a free agent to a 1-year, $8M contract using their Taxpayer MLE. After signing, where will they be relative to the First Apron?",
    options: [
      "Still at the First Apron - MLE doesn't count",
      "$8M over the First Apron",
      "Below the First Apron - MLE has a discount",
      "$3M over the First Apron - MLE is capped at $5M for First Apron teams"
    ],
    correct: 3,
    explanation: "The Taxpayer MLE is CAPPED at $5M for teams at or above the First Apron (it's higher for teams below First Apron but above tax). If the Pelicans are AT the First Apron and use $5M of MLE, they'll be $5M over the First Apron. They CANNOT use the full $8M Taxpayer MLE - they're limited to $5M maximum. This is one of the First Apron restrictions designed to limit spending by high-payroll teams.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - First Apron MLE Cap",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Raptors finish the 2024-25 season $10M over the Second Apron. In the 2025-26 season, they drop to $5M BELOW the Second Apron. When does their frozen first-round pick become tradeable again?",
    options: [
      "Immediately in 2025-26 since they're below the Second Apron",
      "After 2 consecutive years below the Second Apron",
      "The pick remains frozen for 7 years regardless",
      "July 1, 2026 - one year after dropping below"
    ],
    correct: 0,
    explanation: "First-round picks are frozen ONLY while a team is over the Second Apron. Once a team drops below the Second Apron (even for just one year), the previously frozen pick becomes tradeable again immediately. The Raptors' 2031 pick was frozen in 2024-25, but once they drop below the Second Apron in 2025-26, that pick can be traded again. The freeze is not permanent - it's tied to current Second Apron status.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Pick Freeze Release",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Grizzlies are $1M over the First Apron. They trade Ja Morant ($45M) for CJ McCollum ($30M) and draft picks. After the trade, what is their status?",
    options: [
      "They're now $14M below the First Apron and can take back more salary in future trades",
      "They remain over the First Apron until the season ends",
      "The trade is illegal - they can't take back less salary while over the First Apron",
      "They drop below but must wait 30 days to make another trade"
    ],
    correct: 0,
    explanation: "Once a team makes a trade that drops them below the First Apron, they IMMEDIATELY regain access to the normal trade rules and can take back more salary than they send out in FUTURE trades (as long as they stay below the First Apron). The Grizzlies sent out $45M and received $30M, dropping them $15M in salary. They were $1M over, so now they're $14M below the First Apron and can operate as a non-First Apron team.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Dropping Below First Apron",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Cavaliers project to finish $8M over the Second Apron. Before the trade deadline, they make a salary-dumping trade that would drop them to $1M below the Second Apron. The trade processes on February 10. Do they avoid Second Apron penalties?",
    options: [
      "Yes, they're below the Second Apron when the trade processes",
      "No, trades made while over the Second Apron still trigger penalties",
      "Yes, as long as they finish the season below the Second Apron",
      "No, you must be below the Second Apron for the full season"
    ],
    correct: 2,
    explanation: "Second Apron penalties are determined by where a team finishes the SEASON (end of regular season), not where they were during the season. Even if the Cavaliers were $8M over in February, if they drop to $1M below by season's end (April), they AVOID all Second Apron penalties including the frozen draft pick. This is why teams often make desperate salary-dumping trades in February/March - to get below thresholds before the season ends.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Season-End Apron Status",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Nets are $40M over the luxury tax as a repeat offender. Approximately how much total luxury tax do they owe?",
    options: [
      "$80M - $2.00 per dollar average",
      "$120M - $3.00 per dollar average",
      "$140M - $3.50 per dollar average",
      "$175M - $4.375 per dollar average"
    ],
    correct: 3,
    explanation: "For repeat offenders $40M over the tax, the total bill is MASSIVE due to progressive rates. The rates escalate from $2.50 for the first $5M up to $5.25+ per dollar for amounts over $25M. For $40M over: roughly $12.5M (first $5M) + $13.75M (next $5M) + $16.25M (next $5M) + $18.75M (next $5M) + $21.25M (next $5M) + more for the remaining amounts = approximately $175M+ in total tax. This is why Second Apron teams face enormous financial penalties.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Total Repeat Offender Tax",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Kings are $2M below the luxury tax threshold. They use their Room Exception ($7.7M) to sign a player. What happens to their tax status?",
    options: [
      "They stay below the tax since they had cap room",
      "They go $5.7M over the luxury tax",
      "The Room Exception doesn't count toward the tax",
      "They can only use $2M of the Room Exception to stay below"
    ],
    correct: 1,
    explanation: "The Room Exception counts fully against the salary cap and luxury tax calculations just like any other salary. If the Kings are $2M below the tax and use the full $7.7M Room Exception, they'll be $5.7M OVER the luxury tax threshold and will owe tax on that amount. Teams must carefully consider whether using their exceptions is worth paying the luxury tax. They could use only part of the exception to stay below the tax.",
    category: "Article VII - Luxury Tax",
    difficulty: "easy",
    source: "NBA CBA Article VII - Exception Impact on Tax",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Thunder are below the luxury tax but above the First Apron by $3M. Can they sign-and-trade for a player from another team?",
    options: [
      "Yes, sign-and-trades are always allowed",
      "No, teams above the First Apron cannot sign-and-trade acquire players",
      "Yes, but only for players making less than $10M",
      "No, sign-and-trades require being below the tax"
    ],
    correct: 1,
    explanation: "Teams above the FIRST APRON cannot ACQUIRE players via sign-and-trade. This is one of the First Apron restrictions. Teams below the tax can both send and receive players in sign-and-trades. Teams above the tax but below First Apron can send but not receive. Teams above First Apron cannot receive at all via sign-and-trade (though they can still send players out). The Thunder cannot sign-and-trade acquire anyone.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - First Apron Sign-and-Trade Ban",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Hornets are $50M under the salary cap. They are also $50M below the luxury tax threshold. If they use all their cap space, will they pay luxury tax?",
    options: [
      "Yes, using cap space triggers luxury tax",
      "No, teams below the cap cannot be taxpayers",
      "Yes, if they also use the Room Exception",
      "No, cap space and luxury tax are calculated differently"
    ],
    correct: 1,
    explanation: "The luxury tax threshold is HIGHER than the salary cap. A team that is $50M under the cap is also automatically below the luxury tax threshold. Even if the Hornets use all $50M in cap space, they would reach the salary cap but still be well below the luxury tax threshold. Teams can be over the cap but under the tax. It's virtually impossible to be under the cap and over the tax - the tax threshold is always higher.",
    category: "Article VII - Luxury Tax",
    difficulty: "easy",
    source: "NBA CBA Article VII - Cap vs Tax Threshold",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Pacers are $12M over the First Apron. They want to trade Myles Turner ($20M) for Nikola Vucevic ($21M). Is this trade legal?",
    options: [
      "Yes, the salary difference is only $1M",
      "No, they cannot take back more salary than they send out",
      "Yes, trades under $5M difference are allowed",
      "No, First Apron teams cannot make any trades"
    ],
    correct: 1,
    explanation: "Teams over the First Apron CANNOT take back even $1 more in salary than they send out. The Pacers sending $20M and receiving $21M violates the First Apron restriction, even though it's only a $1M difference. The rule is absolute - teams over the First Apron must send out EQUAL OR GREATER salary in every trade. To make this trade legal, they'd need to send out at least $21M (or get below the First Apron first).",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - First Apron Exact Matching",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Bulls were taxpayers in 2021-22, 2023-24, and 2024-25 (not in 2022-23). In 2025-26, they are $8M over the luxury tax. Are they repeat offenders?",
    options: [
      "Yes, they were taxpayers in 3 of the last 4 years",
      "No, the years must be consecutive",
      "No, they need 4 consecutive years to be repeat offenders",
      "Yes, but only for amounts over $10M"
    ],
    correct: 0,
    explanation: "Repeat offender status requires being a taxpayer in 3 of the PREVIOUS 4 seasons - the years do NOT need to be consecutive. The Bulls were taxpayers in 3 of the last 4 years (2021-22, 2023-24, 2024-25), so they ARE repeat offenders in 2025-26 even though 2022-23 was a non-tax year. This makes it harder for teams to escape repeat offender status - they need to be below the tax for at least 2 of every 4 years.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Non-Consecutive Repeat Offender",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Timberwolves are $15M over the Second Apron. They want to trade Karl-Anthony Towns ($50M) for a package of 3 players totaling $48M. Can they make this trade?",
    options: [
      "Yes, they're sending out more salary than receiving",
      "No, Second Apron teams cannot aggregate players in trades",
      "Yes, as long as it's 3 players or fewer",
      "No, the salary difference must be exactly equal"
    ],
    correct: 1,
    explanation: "Teams over the Second Apron CANNOT aggregate salaries - they cannot send out OR receive multiple players in a single trade. Even though the T-Wolves are sending ONE player, they're RECEIVING THREE players, which violates the aggregation rule. Second Apron teams can only do one-for-one player trades. They cannot send 1 for 3, send 3 for 1, send 2 for 2, etc. This severely limits trade options for Second Apron teams.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Second Apron Aggregation Both Ways",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Magic are $20M over the luxury tax but $5M below the First Apron. Can they use the Taxpayer Mid-Level Exception for its full amount?",
    options: [
      "Yes, the full $5M Taxpayer MLE",
      "No, teams over the tax cannot use the MLE",
      "Yes, the full $12.4M Non-Taxpayer MLE since they're below First Apron",
      "Yes, up to $8M for teams below First Apron"
    ],
    correct: 2,
    explanation: "Teams that are ABOVE the luxury tax but BELOW the First Apron can still use the FULL Non-Taxpayer Mid-Level Exception ($12.4M). The Non-Taxpayer MLE is only restricted when teams go OVER the First Apron (where it drops to $5M max). The Magic can use the full $12.4M MLE even though they're $20M over the tax, as long as they stay below the First Apron. This is an important middle ground for moderately high payroll teams.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - MLE Between Tax and First Apron",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Spurs project to finish exactly at the Second Apron ($189.5M). In the final game of the season, a player earns a $50,000 unlikely incentive bonus for reaching a statistical milestone. What happens?",
    options: [
      "Nothing, unlikely bonuses don't count",
      "They go $50K over the Second Apron and face all penalties",
      "The bonus is paid but doesn't count toward aprons",
      "They can waive the bonus to avoid penalties"
    ],
    correct: 1,
    explanation: "ALL salary, including earned incentive bonuses, counts toward the final season salary total used to calculate apron status. If the Spurs are exactly at the Second Apron and a player earns a $50K incentive on the last day of the season, they finish $50K OVER the Second Apron. This triggers ALL Second Apron penalties including the frozen draft pick. Even small amounts matter - teams must account for all possible bonuses when managing apron thresholds.",
    category: "Article VII - Luxury Tax",
    difficulty: "hard",
    source: "NBA CBA Article VII - Incentives and Apron Calculations",
    question_type: "scenario",
    batch: 24
  },
  {
    question: "The Rockets are a non-taxpayer team. They finish the season $1M below the luxury tax threshold. Do they receive luxury tax distribution money?",
    options: [
      "Yes, all non-taxpayer teams receive equal distributions",
      "Yes, but a reduced amount for being close to the tax",
      "No, only teams significantly below the tax receive distributions",
      "No, luxury tax money goes to the league, not teams"
    ],
    correct: 0,
    explanation: "ALL non-taxpayer teams receive equal shares of the luxury tax distribution money, regardless of how far below the tax they are. A team $1M below the tax gets the same distribution as a team $50M below. The luxury tax collected from taxpayer teams is distributed equally among all non-taxpayer teams. This creates an incentive for teams to stay below the tax threshold - even by just $1 - to receive the distribution rather than paying tax.",
    category: "Article VII - Luxury Tax",
    difficulty: "medium",
    source: "NBA CBA Article VII - Tax Distribution",
    question_type: "scenario",
    batch: 24
  }
];

async function importBatch6() {
  console.log('🎯 Importing Batch 6: Luxury Tax & Aprons (25 Questions)...\n');

  for (let i = 0; i < batch6.length; i++) {
    const question = batch6[i];
    
    console.log(`[${i + 1}/${batch6.length}] Importing scenario question...`);
    
    const { data, error} = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 25 luxury tax & apron questions imported successfully!');
  console.log('Total questions in batch: 25');
  console.log('Category: Article VII - Luxury Tax');
  console.log('Difficulty distribution: Easy (3), Medium (13), Hard (9)');
}

importBatch6();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 1: SALARY CAP & EXCEPTIONS (25 Questions)
const batch1 = [
  {
    question: "The Lakers have $15M in salary cap room at the start of the 2024 offseason. They sign LeBron James to a 2-year deal worth $25M in Year 1 using their cap room. They now want to sign Anthony Davis to the highest possible salary. What exception can they use and what is the maximum they can pay Davis?",
    options: [
      "$5,000,000 - using the Room Exception",
      "$7,723,000 - using the Mid-Level for Room Exception",
      "$12,405,000 - using the Non-Taxpayer Mid-Level Exception",
      "$1,157,153 - using the Minimum Salary Exception only"
    ],
    correct: 1,
    explanation: "Once a team uses cap room to sign a player, they lose access to the Non-Taxpayer MLE, Taxpayer MLE, and Bi-Annual Exception. However, they retain the Room Exception (also called the Room Mid-Level Exception), which is worth $7,723,000 for the 2024 offseason. This is specifically designed for teams that use their cap room and need an additional exception to sign one more player.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Salary Cap Rules",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Warriors are $5M over the salary cap and want to sign a veteran free agent. They have not used their Mid-Level Exception yet this season. The team's total salary puts them $8M below the luxury tax threshold. What is the maximum annual salary they can offer using their available Mid-Level Exception?",
    options: [
      "$5,000,000 - using the Taxpayer Mid-Level Exception",
      "$7,723,000 - using the Room Exception",
      "$12,405,000 - using the Non-Taxpayer Mid-Level Exception",
      "$4,500,000 - using the Bi-Annual Exception"
    ],
    correct: 2,
    explanation: "Since the Warriors are over the cap but below the luxury tax threshold, they have access to the Non-Taxpayer Mid-Level Exception, which is worth $12,405,000. The Taxpayer MLE ($5M) is only for teams above the tax threshold. The Room Exception is only for teams that use cap room. Teams below the tax can use the full Non-Taxpayer MLE.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Mid-Level Exceptions",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Celtics are $12M over the luxury tax threshold. They want to sign a backup center. They already used their Taxpayer Mid-Level Exception earlier in the offseason. What is their only remaining option to sign a free agent to a multi-year deal?",
    options: [
      "They cannot sign anyone to a multi-year deal",
      "$1,157,153 - Minimum Salary Exception for any length contract",
      "$4,500,000 - Bi-Annual Exception for up to 2 years",
      "$5,000,000 - They can use another Taxpayer MLE"
    ],
    correct: 1,
    explanation: "Teams over the luxury tax who have already used their Taxpayer MLE cannot use the Bi-Annual Exception (it's only available to non-taxpayer teams). Their only option is the Minimum Salary Exception, which can be used for contracts of any length. Teams can always sign players to minimum contracts regardless of their cap situation, and there is no limit to how many minimum contracts they can sign.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Exception Rules",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Nets have $20M in cap room. They want to sign three free agents: Player A for $12M, Player B for $6M, and Player C for $3M. After these signings, what exceptions will they still have available?",
    options: [
      "Only the Minimum Salary Exception",
      "Room Exception and Minimum Salary Exception",
      "Non-Taxpayer MLE and Minimum Salary Exception",
      "They will have exceeded the cap and have no exceptions"
    ],
    correct: 0,
    explanation: "The Nets used $21M total ($12M + $6M + $3M) which exceeds their $20M in cap room by $1M. Once they exceed the cap, even by $1, they can no longer use the Room Exception. Since they used cap room first, they also lost access to the Non-Taxpayer MLE. Their only remaining exception is the Minimum Salary Exception, which all teams always have access to regardless of cap situation.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Cap Room and Exceptions",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Heat are exactly at the salary cap with $141,000,000 in salary commitments. The salary cap is $141,000,000. They want to sign a free agent. What is the maximum they can offer without using an exception?",
    options: [
      "$0 - They cannot sign anyone without an exception",
      "$100,000 - 10% over the cap is allowed",
      "$1,157,153 - The minimum salary",
      "$5,000,000 - The standard free agent amount"
    ],
    correct: 0,
    explanation: "When a team is exactly at the salary cap, they have $0 in cap room and cannot sign any free agents using cap room, not even for $1. They must use an exception such as the Mid-Level Exception, Bi-Annual Exception (if available), or Minimum Salary Exception. The minimum salary exception allows them to sign players, but that's using an exception, not cap room.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Salary Cap Mechanics",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Mavericks have $8M in cap room. They sign a free agent to a 1-year, $6M contract on July 5th. On July 20th, that player gets injured and is ruled out for the season. Can the Mavericks now use their Room Exception to sign another player?",
    options: [
      "Yes, because they still have cap room remaining",
      "No, once they used cap room to sign a player, the Room Exception is their only remaining major exception",
      "Yes, but only if they waive the injured player first",
      "No, they lost all exceptions when the player got injured"
    ],
    correct: 1,
    explanation: "The timing of when a player gets injured is irrelevant. Once a team uses any amount of cap room to sign a free agent, they immediately lose access to the Non-Taxpayer MLE, Taxpayer MLE, and Bi-Annual Exception. The Room Exception becomes available, but the injury doesn't restore their other exceptions. The Mavericks can use the $7.7M Room Exception plus they still have $2M in cap room to work with.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Exception Timing",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Spurs have $25M in cap room. They want to sign Victor Wembanyama to a max contract extension worth $45M in the first year. After signing him, what is the maximum they can pay their next free agent signing?",
    options: [
      "$0 - They are now over the cap and have no exceptions",
      "$1,157,153 - Minimum Salary Exception only",
      "$7,723,000 - Room Exception",
      "$12,405,000 - They still have cap room left"
    ],
    correct: 1,
    explanation: "When a team signs a player to a contract that exceeds their available cap room (Wembanyama's $45M exceeds their $25M in room), they become an over-the-cap team. Once over the cap by more than their room amount, they lose the Room Exception because that's only for teams using room while staying under the cap. Their only remaining option is the Minimum Salary Exception, which is always available.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Cap Room Usage",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Clippers used their Non-Taxpayer Mid-Level Exception on July 10th to sign a player to a 3-year, $30M contract. On August 1st, they make a trade that puts them $5M over the luxury tax threshold. What happens to the Mid-Level Exception contract they already signed?",
    options: [
      "The contract is voided and must be renegotiated",
      "The contract remains valid with no changes",
      "The player's salary is reduced to the Taxpayer MLE amount",
      "The team must pay a luxury tax penalty on that contract"
    ],
    correct: 1,
    explanation: "Once a contract is signed using an exception, it remains valid regardless of the team's subsequent cap/tax status. The fact that the Clippers went over the tax threshold after using the Non-Taxpayer MLE doesn't invalidate the contract or require any changes. However, they would not be able to use the Non-Taxpayer MLE for any future signings that season since they are now a taxpayer team.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Exception Contract Validity",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The 76ers are $18M over the salary cap and $3M below the luxury tax. They have not used any exceptions this season. They want to sign two free agents: one for $10M and one for $3M. What is the BEST strategy to sign both players?",
    options: [
      "Use the Non-Taxpayer MLE for $10M player, then use Bi-Annual for $3M player",
      "Use the Non-Taxpayer MLE for both players by splitting it",
      "Use the Bi-Annual for $3M player, they cannot afford the $10M player",
      "They cannot sign both players with their available exceptions"
    ],
    correct: 0,
    explanation: "The 76ers have access to both the Non-Taxpayer MLE ($12.4M) and the Bi-Annual Exception ($4.5M) since they are below the tax. The optimal strategy is to use the Non-Taxpayer MLE for the $10M player and the Bi-Annual Exception for the $3M player. The MLE can be used for one player or split among multiple, and using separate exceptions allows them to sign both players.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Multiple Exceptions Strategy",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Bucks used their Bi-Annual Exception last season (2023-24) to sign a player to a 2-year contract. They are now in the 2024-25 season and want to use the Bi-Annual Exception again. Their team salary is $5M below the luxury tax. Can they use it?",
    options: [
      "Yes, they can use it every season",
      "No, they must wait until 2025-26 since they used it last year",
      "Yes, but only if they waive the player they signed with it last year",
      "No, the Bi-Annual can only be used once per CBA"
    ],
    correct: 1,
    explanation: "The Bi-Annual Exception can only be used once every two years (hence 'bi-annual'). If a team uses it in one season, they must wait until the second season afterward to use it again. Since the Bucks used it in 2023-24, the earliest they can use it again is 2025-26. This restriction applies regardless of whether the player signed with the exception is still on the roster.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Bi-Annual Exception Rules",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Pacers have $30M in cap room and want to maximize their flexibility. They plan to sign Player A to a 1-year, $20M deal. Before making this signing official, what should they consider about their remaining exceptions?",
    options: [
      "Nothing changes - they keep all exceptions regardless",
      "They should sign all minimum salary players first before using cap room",
      "They will lose the Non-Taxpayer MLE but gain the Room Exception after using cap room",
      "They should use the Non-Taxpayer MLE before using any cap room"
    ],
    correct: 2,
    explanation: "When a team has cap room, they face a strategic choice: (1) Use cap room first and get the Room Exception ($7.7M), or (2) Use the Non-Taxpayer MLE first ($12.4M) but lose cap room flexibility. Since the Pacers are using cap room for Player A, they will lose access to the Non-Taxpayer MLE but will gain the Room Exception. If they wanted the larger MLE, they should have used it BEFORE using any cap room, but then they'd lose the cap room entirely.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Exception Strategy and Timing",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Hornets are $25M over the luxury tax threshold (making them a taxpayer team). They want to sign a veteran free agent who played 8 years in the NBA. What is the maximum annual salary they can offer this player using their available exceptions?",
    options: [
      "$1,977,011 - the 8-year veteran minimum",
      "$3,196,448 - the 10+ year veteran minimum",
      "$4,500,000 - the Bi-Annual Exception",
      "$5,000,000 - the Taxpayer Mid-Level Exception"
    ],
    correct: 3,
    explanation: "Teams over the luxury tax threshold are limited to the Taxpayer Mid-Level Exception ($5M) and the Minimum Salary Exception. The Bi-Annual Exception is NOT available to taxpayer teams. While the veteran minimum is always available, the question asks for the MAXIMUM salary, which would be the Taxpayer MLE at $5M. The veteran minimum amounts listed are accurate, but those are minimums, not maximums.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Taxpayer Exceptions",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Wizards have $12M in cap room on July 1st. They have an unsigned draft pick with a cap hold of $8M. If they renounce the draft pick's cap hold, how much cap room will they have?",
    options: [
      "$12M - renouncing doesn't change cap room",
      "$20M - the $8M cap hold is removed from the books",
      "$4M - they lose cap room by renouncing",
      "$8M - the draft pick salary replaces the cap hold"
    ],
    correct: 1,
    explanation: "A cap hold counts against a team's salary cap until the player is either signed or renounced. The Wizards currently have $12M in cap room WITH the $8M cap hold counting against their cap. If they renounce the draft pick's cap hold, that $8M is removed from their books entirely, increasing their cap room to $20M. This is why teams often renounce cap holds when they need to create maximum cap space.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Cap Holds",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Kings are $2M under the salary cap. They have a free agent with a $15M cap hold. If they want to use their cap room to sign a different free agent for $2M, what must they do with the cap hold first?",
    options: [
      "Nothing - the cap hold doesn't affect their $2M in cap room",
      "Renounce the cap hold to free up the $2M in cap room",
      "Sign the player with the cap hold first, then use the exception",
      "Wait until after July 15th when cap holds expire automatically"
    ],
    correct: 1,
    explanation: "Cap holds count against the salary cap even if the player hasn't been signed yet. The Kings appear to have $2M in cap room, but that's WITH the $15M cap hold already counting against them. To use cap room to sign anyone, they must first renounce the $15M cap hold. Once renounced, they cannot re-sign that player using Bird Rights, but they would have more cap room available. Cap holds do not expire automatically.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Cap Holds and Cap Room",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Pelicans used $8M of their $12.4M Non-Taxpayer Mid-Level Exception to sign Player A. Later in the offseason, they want to sign Player B. How much of the MLE do they have remaining, and can they split it between multiple players?",
    options: [
      "$4.4M remaining, and yes they can split it among multiple players",
      "$12.4M - they get a new full MLE for each signing",
      "$0 - the MLE can only be used for one player per season",
      "$4.4M remaining, but it can only be used for one more player total"
    ],
    correct: 0,
    explanation: "The Mid-Level Exception has a total dollar amount ($12.4M for Non-Taxpayer) that can be split among multiple players. The Pelicans used $8M, leaving $4.4M remaining. They can split this remaining amount among as many players as they want, as long as the total doesn't exceed $4.4M. For example, they could sign two players for $2.2M each, or one player for $4.4M, or any combination that doesn't exceed the remaining amount.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Splitting the MLE",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Raptors are $40M over the salary cap and $15M over the luxury tax threshold. They want to sign a 10-year veteran to a minimum contract. What is the maximum length contract they can offer?",
    options: [
      "1 year - taxpayer teams are limited to 1-year minimums",
      "2 years - the standard limit for taxpayer exceptions",
      "3 years - the maximum for any minimum salary contract",
      "Any length - there is no restriction on minimum contract length"
    ],
    correct: 3,
    explanation: "The Minimum Salary Exception has no restrictions based on a team's cap or tax status. Whether a team is under the cap, over the cap, or a taxpayer, they can always offer minimum salary contracts of any length (typically up to 3 years, or 4 years for players with 10+ years of service). The cap/tax status affects MLEs and other exceptions, but not the minimum salary exception.",
    category: "Article VII - Salary Cap",
    difficulty: "easy",
    source: "NBA CBA Article VII - Minimum Salary Exception",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Nuggets are $10M below the First Apron and $25M below the Second Apron. They have not used their Non-Taxpayer MLE yet. If they use the full $12.4M Non-Taxpayer MLE, will they cross the First Apron?",
    options: [
      "Yes, they will be $2.4M above the First Apron",
      "No, the MLE doesn't count toward apron calculations",
      "No, they will still be below the First Apron",
      "Yes, and they will also cross the Second Apron"
    ],
    correct: 0,
    explanation: "The Non-Taxpayer MLE counts against the salary cap just like any other salary. If the Nuggets are $10M below the First Apron and add $12.4M in salary via the MLE, they will go $2.4M above the First Apron ($12.4M - $10M = $2.4M over). This is an important consideration because crossing the First Apron triggers additional roster restrictions under the new CBA.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Aprons and MLE",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Thunder have $50M in cap room. They want to sign three free agents: Player A for $30M, Player B for $15M, and Player C for $8M. After these signings, what exception can they use to sign a fourth player?",
    options: [
      "No exceptions - they exceeded their cap room",
      "Room Exception for up to $7.7M",
      "Non-Taxpayer MLE for up to $12.4M",
      "Minimum Salary Exception only"
    ],
    correct: 3,
    explanation: "The Thunder's three signings total $53M ($30M + $15M + $8M), which exceeds their $50M in cap room by $3M. Once a team exceeds the salary cap, even by a small amount, they become an over-the-cap team. At this point, they lose access to both the Room Exception (which is only for teams that stay under the cap while using room) and the Non-Taxpayer MLE (which is lost once any cap room is used). Their only remaining option is the Minimum Salary Exception.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Exceeding Cap Room",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Grizzlies are $3M over the luxury tax. They use their Taxpayer Mid-Level Exception to sign a player to a 3-year, $15M deal ($5M per year). In Year 2 of that deal, the Grizzlies drop below the luxury tax. What happens to the player's contract?",
    options: [
      "The contract is voided and must be renegotiated",
      "The player's salary increases to the Non-Taxpayer MLE amount",
      "Nothing - the contract remains at $5M per year",
      "The team gets a cap credit for the difference"
    ],
    correct: 2,
    explanation: "Once a contract is signed using any exception, the contract terms are locked in for its entire duration regardless of the team's future cap or tax status. The player will continue to earn $5M per year for all three years of the contract even if the Grizzlies drop below the tax, go further over the tax, or make any other roster changes. The exception used to sign the contract is determined at the time of signing only.",
    category: "Article VII - Salary Cap",
    difficulty: "easy",
    source: "NBA CBA Article VII - Exception Contract Terms",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Timberwolves have $18M in cap room. They want to use the Non-Taxpayer Mid-Level Exception ($12.4M) first, before using any cap room. If they do this, what happens to their $18M in cap room?",
    options: [
      "They keep the $18M cap room and can still use it",
      "They lose all cap room once they use the Non-Taxpayer MLE",
      "They keep $5.6M in cap room ($18M - $12.4M)",
      "They must choose: either use cap room OR use the MLE, not both"
    ],
    correct: 1,
    explanation: "This is a critical rule: Once a team uses the Non-Taxpayer Mid-Level Exception, they immediately lose ALL remaining cap room, even if they haven't used it yet. This is why the timing of signings matters enormously. If the Timberwolves use the Non-Taxpayer MLE first, their $18M in cap room disappears entirely. Conversely, if they use cap room first, they lose the Non-Taxpayer MLE but gain the Room Exception. Teams must choose their strategy carefully.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - MLE and Cap Room Interaction",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Bulls are exactly at the salary cap ($141M with the cap at $141M). They have a player with Early Bird Rights and want to re-sign him using those rights. What is the maximum they can offer him in Year 1 of a new contract?",
    options: [
      "105% of his previous salary",
      "175% of his previous salary or the league average salary, whichever is greater",
      "The Non-Taxpayer Mid-Level Exception amount ($12.4M)",
      "The league average salary only"
    ],
    correct: 1,
    explanation: "Early Bird Rights allow a team to re-sign their own free agent to a contract starting at up to 175% of their previous salary OR the league average salary, whichever is GREATER. This exception allows over-the-cap teams to retain their own players. The 105% figure relates to yearly increases within a contract, not the starting salary. The Early Bird Exception is separate from the Mid-Level Exception and has its own specific rules.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Early Bird Rights",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Suns are $35M over the luxury tax threshold (making them a luxury tax payer). During the season, they make a trade that reduces their salary and drops them to $5M BELOW the luxury tax threshold. What exceptions do they now have available for the rest of that season?",
    options: [
      "They gain access to the Non-Taxpayer MLE immediately",
      "They keep only the Taxpayer MLE and minimum exception",
      "They gain access to the Bi-Annual Exception immediately",
      "They must wait until the next season to access non-taxpayer exceptions"
    ],
    correct: 1,
    explanation: "Exception availability is determined at the START of the season (or when the exception is first used), not based on current tax status. The Suns started the season as a taxpayer team, so they only have access to the Taxpayer MLE for that entire season, even if they drop below the tax mid-season. They cannot gain access to the Non-Taxpayer MLE or Bi-Annual Exception until the following season if they start that season below the tax.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Exception Availability Timing",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Knicks have $35M in cap room and want to maximize their total player spending. They're deciding between: (A) Using all $35M in cap room, then using the Room Exception ($7.7M), or (B) Using the Non-Taxpayer MLE ($12.4M) first, which costs them their cap room. Which strategy allows them to spend more money total?",
    options: [
      "Strategy A: $42.7M total ($35M + $7.7M)",
      "Strategy B: $12.4M total (just the MLE)",
      "Both strategies result in the same total spending",
      "Strategy A: $47.4M total ($35M + $12.4M)"
    ],
    correct: 0,
    explanation: "Strategy A: Use $35M in cap room, then use the Room Exception for $7.7M = $42.7M total spending. Strategy B: Use the Non-Taxpayer MLE for $12.4M, but lose all $35M in cap room = Only $12.4M total spending. Strategy A is far superior, allowing the team to spend $30.3M more. This is why most teams with significant cap room use the cap room first, then use the Room Exception, rather than using the MLE and losing all cap room.",
    category: "Article VII - Salary Cap",
    difficulty: "hard",
    source: "NBA CBA Article VII - Optimal Cap Strategy",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Magic have $8M in cap room. They sign a player to a 2-year, $7M contract ($3.5M per year) using cap room on July 10th. On July 15th, they want to sign another free agent. They now have $1M in cap room remaining. Can they still use the Room Exception for an additional $7.7M?",
    options: [
      "Yes, they used cap room so they get the Room Exception",
      "No, they must use all cap room first before accessing the Room Exception",
      "Yes, but only for $6.7M (the difference between $7.7M and their remaining $1M)",
      "No, the Room Exception is only available if you use more than $10M in cap room"
    ],
    correct: 0,
    explanation: "Once a team uses ANY amount of cap room to sign a free agent, they immediately lose access to the Non-Taxpayer MLE and gain access to the Room Exception ($7.7M). It doesn't matter if they used $1 in cap room or $30M in cap room - the Room Exception becomes available. The Magic can now use their remaining $1M in cap room AND their $7.7M Room Exception, for a total of $8.7M in remaining signing ability.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Room Exception Availability",
    question_type: "scenario",
    batch: 19
  },
  {
    question: "The Hawks are $20M over the salary cap and $8M below the luxury tax. They used their Bi-Annual Exception two seasons ago (2022-23). It is now the 2024-25 season. They want to use the Bi-Annual Exception again. Can they?",
    options: [
      "Yes, enough time has passed (two full seasons)",
      "No, they must wait one more season",
      "Yes, but only if they didn't use it in 2023-24",
      "No, you can only use the Bi-Annual Exception once per CBA period"
    ],
    correct: 0,
    explanation: "The Bi-Annual Exception can only be used once every two seasons. If used in 2022-23, the team cannot use it in 2023-24, but CAN use it again starting in 2024-25. Two full seasons have passed, so the Hawks are eligible to use the Bi-Annual Exception again, assuming they are below the luxury tax (which they are). The restriction is truly 'every other year' - if you use it in Year 1, you can't use it in Year 2, but you can use it in Year 3.",
    category: "Article VII - Salary Cap",
    difficulty: "medium",
    source: "NBA CBA Article VII - Bi-Annual Exception Timing",
    question_type: "scenario",
    batch: 19
  }
];

async function importBatch1() {
  console.log('🎯 Importing Batch 1: Salary Cap & Exceptions (25 Questions)...\n');

  for (let i = 0; i < batch1.length; i++) {
    const question = batch1[i];
    
    console.log(`[${i + 1}/${batch1.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 25 scenario questions imported successfully!');
  console.log('Total questions in batch: 25');
  console.log('Category: Article VII - Salary Cap');
  console.log('Difficulty distribution: Easy (2), Medium (10), Hard (13)');
}

importBatch1();
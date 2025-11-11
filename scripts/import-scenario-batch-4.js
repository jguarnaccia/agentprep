const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// BATCH 4: AGENT REGULATIONS (25 Questions)
const batch4 = [
  {
    question: "You represent a player who terminates his Standard Player Agent Contract (SPAC) with you on June 1, 2024. Another agent contacts you asking when they can sign this player. What do you tell them?",
    options: [
      "June 2, 2024 - the next day",
      "June 16, 2024 - after the 15-day cooling off period",
      "July 1, 2024 - start of the new league year",
      "June 1, 2025 - one year after termination"
    ],
    correct: 1,
    explanation: "When a player terminates their SPAC with an agent, there is a mandatory 15-day cooling-off period before the player can sign a new SPAC with any agent, including their previous agent. This period runs from the date of termination. The earliest the player can sign with a new agent is June 16, 2024. This rule is designed to protect players from making hasty decisions about changing representation.",
    category: "Article IV - Agent Regulations",
    difficulty: "easy",
    source: "NBA RPCA - Cooling Off Period",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You just became NBPA certified as an agent on March 1, 2024. A veteran player making $25M per year wants to sign with you. Under NBPA regulations, can you represent this player?",
    options: [
      "Yes, with no restrictions",
      "No, new agents cannot represent players making over $15M",
      "Yes, but you must have a co-agent with 3+ years experience",
      "No, you must wait one year before representing veteran players"
    ],
    correct: 2,
    explanation: "New NBPA-certified agents (certified for less than 3 years) cannot be the sole agent for a player making more than a certain salary threshold (approximately $15M) unless they have a co-agent who has been certified for 3+ years. This ensures veteran players have experienced representation. You CAN represent this $25M player, but only with a qualified co-agent. After 3 years of certification, this restriction is lifted.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - New Agent Restrictions",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You negotiate a 4-year, $120M contract for your client with the Lakers. Under NBPA regulations, what is the MAXIMUM agent fee you can charge?",
    options: [
      "$3,600,000 - 3% of the total contract",
      "$4,800,000 - 4% of the total contract",
      "$6,000,000 - 5% of the total contract",
      "$12,000,000 - 10% of the total contract"
    ],
    correct: 0,
    explanation: "NBPA regulations cap agent fees for negotiating player contracts at 3% of the player's compensation for that contract. For a $120M contract, the maximum fee is $120M × 3% = $3.6M. This fee typically covers the entire length of the contract and all contract-related services. Agents cannot charge more than 3% for contract negotiation services, though they may charge separate fees for marketing/endorsement deals.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Maximum Agent Fees",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your client is a rookie drafted in the first round. You negotiate his rookie scale contract. Under NBPA rules, when can you collect your agent fee?",
    options: [
      "Immediately when the contract is signed",
      "After the player receives his first paycheck",
      "In equal installments over the life of the contract",
      "Within 30 days of contract execution"
    ],
    correct: 2,
    explanation: "NBPA regulations require that agent fees for player contracts be paid in EQUAL INSTALLMENTS over the life of the contract, proportional to when the player receives compensation. Agents cannot take their entire fee upfront. If the rookie has a 4-year contract, the agent receives 1/4 of their fee each year as the player is paid. This protects players from agents taking large upfront fees.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Fee Payment Timing",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a player in contract negotiations with the Celtics. The team offers you a $50,000 consulting fee to help with their salary cap planning. Can you accept this fee?",
    options: [
      "Yes, as long as you disclose it to your client",
      "Yes, consulting fees are separate from agent representation",
      "No, you cannot receive compensation from NBA teams while representing a player",
      "Yes, but only if it's less than $25,000"
    ],
    correct: 2,
    explanation: "NBPA regulations STRICTLY PROHIBIT agents from receiving any compensation, gifts, or benefits from NBA teams while representing players. This creates a clear conflict of interest - the agent's duty is solely to the player, not the team. Accepting any payment from a team while representing a player would violate NBPA regulations and could result in decertification. The agent must decline all team payments.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Conflict of Interest Rules",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "A college player declares for the NBA Draft and signs with you on April 1, 2024. On May 15, 2024, he decides to withdraw from the draft and return to college. What happens to your SPAC?",
    options: [
      "The SPAC remains valid until he enters the draft again",
      "The SPAC is automatically terminated",
      "The SPAC is suspended until he turns professional",
      "You can choose to terminate or keep the SPAC active"
    ],
    correct: 1,
    explanation: "Under NBPA and NCAA rules, if a player signs with an agent and then withdraws from the NBA Draft to return to college (before the withdrawal deadline), the Standard Player Agent Contract is automatically TERMINATED to preserve the player's college eligibility. The player loses his college eligibility if he remains signed with an agent. The SPAC must be terminated for the player to return to NCAA competition.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - Draft Withdrawal and Eligibility",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a player who signs a 3-year, $30M contract. You also negotiate a shoe endorsement deal worth $5M per year for 5 years. What is the MAXIMUM total fee you can charge for both services?",
    options: [
      "$900,000 - 3% of the player contract only",
      "$4,400,000 - 3% of player contract + 4% of endorsement",
      "$1,650,000 - 3% of both contracts combined",
      "$5,400,000 - 3% of player contract + 20% of endorsement"
    ],
    correct: 1,
    explanation: "Agent fees are calculated separately for player contracts and marketing/endorsement deals. For the $30M player contract: maximum 3% = $900K. For endorsement deals, agents typically charge 4% (though some states allow up to 20%). For the $25M endorsement deal: 4% = $1M (some agents charge up to 20% = $5M, but 4% is standard). Total potential = $900K + $1M = $1.9M at 4% endorsement rate, or up to $5.9M if charging 20% on endorsements.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - Separate Fee Structures",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your client asks you to loan him $100,000 to purchase a house while his contract negotiations are ongoing. Under NBPA regulations, can you provide this loan?",
    options: [
      "Yes, with a written loan agreement at market interest rates",
      "Yes, as long as it's interest-free and documented",
      "No, agents cannot provide loans to clients under any circumstances",
      "Yes, but only up to $50,000"
    ],
    correct: 2,
    explanation: "NBPA regulations STRICTLY PROHIBIT agents from loaning money to players or providing any financial benefits to players. This includes loans, gifts, paying bills, or any form of financial assistance. This rule prevents agents from creating financial dependencies that could compromise the player's decision-making. Agents who provide loans to clients risk decertification. Players should work with financial advisors, not their agents, for loans.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Prohibited Financial Activities",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent Player A on the Lakers and Player B on the Celtics. The Lakers want to trade for Player B. Both players ask you to negotiate on their behalf in the trade discussions. Under NBPA rules, what must you do?",
    options: [
      "Negotiate for both players since you represent them",
      "Recuse yourself from the trade negotiations entirely",
      "Get written consent from both players acknowledging the conflict of interest",
      "Negotiate for the player who signed with you first"
    ],
    correct: 2,
    explanation: "When an agent represents players on different teams involved in a potential trade, there is a CLEAR CONFLICT OF INTEREST. NBPA regulations require the agent to: (1) Fully disclose the conflict to both players, (2) Obtain WRITTEN CONSENT from both players acknowledging the conflict and agreeing to continue representation, OR (3) Withdraw from representing one of the players in the trade. Most agents get written consent and represent both, but full disclosure is mandatory.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - Conflicts of Interest",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "A high school senior who will be draft-eligible in two years wants to sign a SPAC with you now. Can you sign him?",
    options: [
      "Yes, you can sign him at any age",
      "Yes, but the SPAC doesn't become effective until he's draft-eligible",
      "No, players must be draft-eligible to sign a SPAC",
      "Yes, with parental consent since he's a minor"
    ],
    correct: 2,
    explanation: "Under NBPA regulations, a player must be DRAFT-ELIGIBLE (at least 19 years old and one year removed from high school) before they can sign a Standard Player Agent Contract. High school seniors cannot sign SPACs. The earliest a player can sign is typically during their freshman year of college (if they're 19) or one year after high school graduation. Attempting to sign ineligible players violates NBPA regulations.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Player Eligibility Requirements",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your NBPA certification expires on December 31, 2024. You have a client with ongoing contract negotiations that will conclude in February 2025. What must you do?",
    options: [
      "Complete the negotiation before your certification expires",
      "Renew your certification before it expires to continue representing the client",
      "Transfer the client to another certified agent",
      "You can finish the negotiation even after certification expires"
    ],
    correct: 1,
    explanation: "NBPA certification must be CURRENT and ACTIVE for an agent to represent players. If your certification expires, you cannot continue representing clients or negotiating contracts, even for ongoing matters. You must renew your certification BEFORE it expires to maintain your client relationships. If you fail to renew, your clients must find new representation. NBPA agents must renew certification periodically and maintain continuing education requirements.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Certification Renewal",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a player who is negotiating a contract with the Heat. The team's GM offers to pay you an additional $25,000 'finder's fee' if you convince your client to accept their offer. What should you do?",
    options: [
      "Accept it since it helps facilitate the deal",
      "Accept it but disclose it to your client",
      "Decline it and report the team to the NBPA",
      "Accept it only if it's paid after the contract is signed"
    ],
    correct: 2,
    explanation: "This is a SERIOUS VIOLATION of NBPA regulations. Teams are absolutely prohibited from offering any compensation to agents, and agents are prohibited from accepting it. This creates a massive conflict of interest. You must: (1) DECLINE the offer immediately, (2) REPORT the team to the NBPA for attempting to bribe an agent, and (3) Inform your client of the team's unethical behavior. Both the team and the agent could face severe penalties.",
    category: "Article IV - Agent Regulations",
    difficulty: "easy",
    source: "NBA RPCA - Prohibited Team Payments",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your client signs a 4-year, $80M contract. You charge the maximum 3% fee ($2.4M). Your client asks if he can pay the entire fee upfront in Year 1 instead of over 4 years. Can you accept this arrangement?",
    options: [
      "Yes, if both parties agree in writing",
      "Yes, but you must discount the fee by 10%",
      "No, fees must be paid proportionally over the contract term",
      "Yes, but only if the player requests it"
    ],
    correct: 2,
    explanation: "NBPA regulations REQUIRE that agent fees be paid in proportion to when the player receives his compensation. Even if the player wants to pay the entire fee upfront, the agent CANNOT accept it. The fee must be spread over the 4-year contract term, with approximately $600K paid each year as the player is paid. This rule protects players from agents taking large upfront fees and prevents agents from having conflicts of interest.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Fee Payment Structure",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a player in China's CBA who wants to sign with an NBA team. Your NBPA certification allows you to negotiate NBA contracts. Can you also negotiate his CBA contract?",
    options: [
      "Yes, NBPA certification covers all basketball leagues",
      "No, NBPA certification only covers NBA contracts",
      "Yes, but you must register with the Chinese Basketball Association",
      "Yes, as long as the player intends to play in the NBA eventually"
    ],
    correct: 1,
    explanation: "NBPA certification ONLY authorizes agents to negotiate contracts with NBA teams and represent players in NBA-related matters. To negotiate contracts in other leagues (CBA, EuroLeague, etc.), agents must comply with those leagues' regulations, which often require separate registration or certification. You can represent the player in NBA negotiations but would need to follow CBA rules (or refer the player to a CBA-certified agent) for his Chinese contract.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Scope of Certification",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a drafted rookie. Before signing his rookie contract, he asks you to review and negotiate a shoe endorsement deal with Nike. The deal would pay $2M per year for 5 years. What is the maximum fee you can charge for negotiating this endorsement deal?",
    options: [
      "$300,000 - 3% of the total deal (same as player contracts)",
      "$400,000 - 4% of the total deal",
      "$2,000,000 - 20% of the total deal",
      "$1,000,000 - 10% of the total deal"
    ],
    correct: 1,
    explanation: "For marketing and endorsement deals, agent fees are NOT subject to the same 3% cap as player contracts. Typical fees for endorsement deals range from 4% to 20%, depending on state law and the agent-player agreement. Many agents charge 4% for endorsements (industry standard), though some charge up to 20% in states that allow it. For a $10M Nike deal, at 4% the fee would be $400K; at 20% it would be $2M. The specific rate should be clearly stated in the SPAC.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Endorsement Deal Fees",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "A player terminates his SPAC with his previous agent on July 1, 2024, and signs with you on July 16, 2024 (after the 15-day cooling-off period). His previous agent negotiated a contract that the player signed on June 15, 2024. Who is entitled to the agent fee for that contract?",
    options: [
      "You, since you're the current agent when the fee is paid",
      "The previous agent, who negotiated the contract",
      "Split 50/50 between both agents",
      "Neither agent can collect if representation changed"
    ],
    correct: 1,
    explanation: "The agent who NEGOTIATED THE CONTRACT is entitled to the commission for that contract, even if the player later changes agents. The previous agent earned the fee by negotiating and securing the deal before the SPAC was terminated. This fee continues to be paid over the life of the contract. As the new agent, you would only earn fees for NEW contracts you negotiate. This protects agents from losing earned commissions when players switch representation.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - Fee Entitlement After Termination",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You're negotiating a contract for your client with the Warriors. The team's GM is your former college roommate. Under NBPA regulations, what must you do?",
    options: [
      "Nothing - personal relationships don't matter",
      "Disclose the relationship to your client in writing",
      "Recuse yourself from the negotiation",
      "Disclose the relationship to the NBPA"
    ],
    correct: 1,
    explanation: "NBPA regulations require agents to disclose ANY potential conflicts of interest to their clients in writing. A close personal relationship with a team executive (college roommate, family member, business partner, etc.) constitutes a potential conflict that must be disclosed. The client can then decide whether to continue with you representing them in negotiations with that team. Full transparency and disclosure are required, but the relationship alone doesn't prohibit the representation if the client consents.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Disclosure of Conflicts",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your client is a restricted free agent. His current team offers a qualifying offer, and another team offers an offer sheet. You recommend he sign the offer sheet. If his current team matches, are you entitled to a fee for negotiating the offer sheet?",
    options: [
      "Yes, you negotiated the offer sheet terms",
      "No, the contract ultimately came from his original team",
      "Yes, but only 1.5% instead of 3%",
      "Only if the other team's offer is not matched"
    ],
    correct: 0,
    explanation: "When a restricted free agent signs an offer sheet that is then MATCHED by his original team, the agent IS entitled to the full 3% fee. Even though the original team matched, the agent negotiated the terms of the offer sheet, which became the contract terms when matched. The agent's work in negotiating favorable terms for the offer sheet directly benefited the player, so the full commission is earned regardless of which team ultimately employs the player.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - RFA Offer Sheet Fees",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a player who is negotiating his first contract. He asks you to pay for his family's travel to attend the press conference where he'll sign. Can you pay for these expenses?",
    options: [
      "Yes, travel expenses for family are allowed",
      "Yes, but only up to $5,000",
      "No, agents cannot provide any financial benefits to players or their families",
      "Yes, if you deduct it from your agent fee"
    ],
    correct: 2,
    explanation: "NBPA regulations prohibit agents from providing ANY financial benefits to players or their families, including paying for travel, meals, lodging, or other expenses. This is considered a prohibited financial inducement. Even if the player requests it or offers to reimburse you later, you cannot pay. The rule is strict to prevent agents from using financial benefits to recruit or retain clients. Violating this can result in decertification.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Prohibited Financial Inducements",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "A college player signs with you in April 2024 while draft-eligible. On June 1, 2024, he goes undrafted. On June 2, he asks to terminate the SPAC. Under the NBPA rules, when can he sign with a different agent?",
    options: [
      "June 3, 2024 - immediately after termination",
      "June 17, 2024 - after the 15-day cooling-off period",
      "July 1, 2024 - start of the new league year",
      "June 2, 2025 - one year after termination"
    ],
    correct: 1,
    explanation: "Even though the player went undrafted and may be disappointed, the standard 15-day cooling-off period still applies when a SPAC is terminated. The player cannot sign with a new agent until 15 days after terminating the contract (June 17, 2024). This rule applies to ALL SPAC terminations, regardless of the reason for termination. The cooling-off period protects players from making impulsive decisions about changing representation.",
    category: "Article IV - Agent Regulations",
    difficulty: "easy",
    source: "NBA RPCA - Cooling-Off Period Application",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent two players: one is a max player making $50M, and the other is a minimum player making $2M. Can you charge different percentage fees to each player?",
    options: [
      "Yes, fees can be negotiated individually with each client",
      "No, you must charge the same percentage to all clients",
      "Yes, but only if you charge the minimum player a lower percentage",
      "No, NBPA requires a uniform 3% fee for all contracts"
    ],
    correct: 0,
    explanation: "Agent fees are negotiated individually with each client and can vary, as long as they don't exceed the 3% maximum set by NBPA regulations. You could charge one client 3% and another client 2%, or even 1.5%, depending on your agreement with each player. Many agents charge lower percentages to star players (who negotiate larger contracts) and higher percentages to role players. The key is that NO fee can exceed 3% for player contract negotiations.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Fee Flexibility",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your client signs a 3-year contract with the Nuggets. Two years later, he asks you to help recruit a free agent to join the team. The Nuggets' GM offers to pay you a $50,000 consulting fee if the free agent signs. Can you accept?",
    options: [
      "Yes, since you're not representing the free agent",
      "Yes, as long as your client consents",
      "No, agents cannot receive compensation from teams regardless of the circumstances",
      "Yes, if the free agent is not your client"
    ],
    correct: 2,
    explanation: "NBPA regulations ABSOLUTELY PROHIBIT agents from receiving ANY form of compensation from NBA teams, period. It doesn't matter if you're representing the free agent, helping recruit, or providing consulting services. While you represent ANY player, you cannot accept money from teams. This is a bright-line rule to prevent conflicts of interest. You must decline the offer and should report the team for attempting to pay an agent inappropriately.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Absolute Prohibition on Team Payments",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "A player signs a SPAC with you on January 1, 2024. On July 1, 2024, he terminates the contract. You had been negotiating a contract extension for him that was 90% complete. Are you entitled to any compensation for the work done?",
    options: [
      "Yes, full 3% of the extension you negotiated",
      "Yes, compensation for time spent (quantum meruit)",
      "No, you only get paid if a contract is signed",
      "Yes, but only 1.5% since the contract wasn't completed"
    ],
    correct: 2,
    explanation: "Under NBPA regulations and standard SPAC terms, agents are only entitled to fees when a contract is ACTUALLY SIGNED. If negotiations are ongoing and the player terminates the SPAC before a deal is reached, the agent typically receives NO compensation for the work done, even if the deal was nearly complete. This is why SPACs typically run for multiple years - to protect the agent's investment in negotiating deals. The new agent would receive the fee if they complete the deal.",
    category: "Article IV - Agent Regulations",
    difficulty: "hard",
    source: "NBA RPCA - Fee Entitlement Without Signed Contract",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "You represent a player who wants to hire his brother as an assistant agent. His brother is not NBPA-certified. Can the brother help with contract negotiations?",
    options: [
      "Yes, family members are exempt from certification requirements",
      "Yes, as long as you supervise him",
      "No, only NBPA-certified agents can negotiate NBA contracts",
      "Yes, if he registers as an associate agent"
    ],
    correct: 2,
    explanation: "ONLY NBPA-certified agents can negotiate NBA player contracts or represent players in contract matters. Family members, assistants, lawyers, and associates who are not certified cannot participate in contract negotiations with teams, even under supervision. If the brother wants to help, he must become NBPA-certified himself. Non-certified individuals can help with other matters (marketing, scheduling, etc.) but cannot engage in contract negotiation activities.",
    category: "Article IV - Agent Regulations",
    difficulty: "medium",
    source: "NBA RPCA - Certification Requirements",
    question_type: "scenario",
    batch: 22
  },
  {
    question: "Your client is traded mid-season from the Lakers to the Nets. The Nets' GM calls you to discuss your client's contract situation. Under NBPA regulations, can you speak with the GM about your client's contract?",
    options: [
      "Yes, the team now employs your client",
      "No, you must wait for your client's permission first",
      "Yes, but only about existing contract terms, not future negotiations",
      "Yes, as long as you're discussing factual contract information"
    ],
    correct: 0,
    explanation: "Once a player is traded to a new team, that team becomes his employer and can discuss contract matters with the player's agent. The agent can speak with the new team's front office about the player's existing contract, potential extensions, or any contract-related issues. However, the agent should still keep the player informed about these discussions as a matter of good practice and fiduciary duty. The new team has a legitimate interest in understanding their new player's contract situation.",
    category: "Article IV - Agent Regulations",
    difficulty: "easy",
    source: "NBA RPCA - Team Communications",
    question_type: "scenario",
    batch: 22
  }
];

async function importBatch4() {
  console.log('🎯 Importing Batch 4: Agent Regulations (25 Questions)...\n');

  for (let i = 0; i < batch4.length; i++) {
    const question = batch4[i];
    
    console.log(`[${i + 1}/${batch4.length}] Importing scenario question...`);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(question);

    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Success');
    }
  }

  console.log('\n✅ All 25 agent regulation questions imported successfully!');
  console.log('Total questions in batch: 25');
  console.log('Category: Article IV - Agent Regulations');
  console.log('Difficulty distribution: Easy (4), Medium (14), Hard (7)');
}

importBatch4();
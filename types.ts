
export type Language = 'zh' | 'en';

export interface Translation {
  // Nav
  navHome: string;
  navAbout: string;
  navCandidates: string;
  navVoting: string;
  navRelax: string;
  connectWallet: string;
  
  // Hero
  heroTitle: string;
  heroSub: string;
  heroBadge: string;
  heroCtaVote: string;
  heroCtaLab: string;
  heroQuote: string;
  heroQuoteSub: string;

  // Stats
  statCensorshipTitle: string;
  statCensorshipValue: string;
  statCensorshipUnit: string;
  statCensorshipDesc: string;
  statCensorshipSource: string;
  statJournalistTitle: string;
  statJournalistValue: string;
  statJournalistUnit: string;
  statJournalistDesc: string;
  statJournalistSource: string;

  // About
  aboutTitle: string;
  aboutSub: string;
  missionTitle: string;
  missionDesc: string;
  tokenModelTitle: string;
  tokenDistTitle: string;
  tokenRewardTitle: string;
  tokenRewardDesc: string;
  tokenComplianceTitle: string;
  tokenComplianceDesc: string;
  legalDisclaimerTitle: string;
  legalDisclaimerDesc: string;

  // Candidates
  candidateTitle: string;
  candidateSub: string;
  candidateBadge: string;
  viewDetails: string;
  voteBtn: string;
  archiveTitle: string;
  archiveVerified: string;
  closeArchive: string;

  // Voting
  votingTitle: string;
  votingSub: string;
  votingThreshold: string;
  votingPurpose: string;
  votingPurposeDesc: string;
  votingStatus: string;
  votingWalletStatus: string;
  votingPower: string;
  votingQualified: string;
  votingInsufficient: string;
  votingAction: string;

  // Games
  labTitle: string;
  labSub: string;
  labBack: string;
  gameVerifierTitle: string;
  gameVerifierDesc: string;
  gameTrapsTitle: string;
  gameTrapsDesc: string;
  gameManipulationTitle: string;
  gameManipulationDesc: string;
  gameCorrect: string;
  gameWrong: string;
  gameNext: string;
  gameFinish: string;
  gameRestart: string;

  // Footer
  footerQuote: string;
  footerContact: string;
  footerArchive: string;
  footerGovernance: string;
}

export interface Candidate {
  id: number;
  name: string;
  region: string;
  bio: string;
  achievement: string;
  votes: number;
  imageUrl: string;
  publishDate: string;
  sourceType: string;
  fullArchive: string;
}

export interface NewsItem {
  id: number;
  title: string;
  isTrue: boolean;
  explanation: string;
}

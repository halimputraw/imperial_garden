import { Language } from '@/store/language-store';

// ─── String map type ──────────────────────────────────────────────────────────
// Add new keys here first, then fill in all 3 languages below

export interface Strings {
    // ── General ──
    appName: string;
    loading: string;
    back: string;
    close: string;
    confirm: string;
    cancel: string;
    comingSoon: string;
    level: string;
    seconds: string;

    // ── Tab bar ──
    tabMap: string;
    tabHome: string;
    tabGames: string;
    tabFriends: string;
    tabSettings: string;

    // ── Map screen ──
    mapTitle: string;
    mapDailyQuest: string;
    mapDailyQuestDesc: string;
    mapZoneMarket: string;
    mapZoneCafe: string;
    mapZoneEstate: string;
    mapZonePark: string;
    mapHarbour: string;
    mapEnterZone: string;
    mapActivities: string;

    // ── Home screen ──
    homeTitle: string;
    homeLevel: string;
    homeFurniture: string;
    homeLocked: string;
    homeScore: string;
    homeMyRoom: string;
    homeHint: string;
    homeDecorate: string;

    // ── Games screen ──
    gamesTitle: string;
    gamesDailyChallenge: string;
    gamesDailyChallengeDesc: string;
    gamesAllGames: string;
    gamesAllGamesSubtitle: string;
    gamesUnlockHint: string;
    gamesBrainTip: string;
    gamesDuration: string;
    gamesLocked: string;

    // ── My Home shop ──
    shopUnlock: string;
    shopUnlockConfirm: string;
    shopUnlockSuccess: string;
    shopNotEnoughCoins: string;
    shopCoinsNeeded: string;
    shopAlreadyUnlocked: string;

    // ── Leaderboard ──
    leaderboardTitle: string;
    leaderboardWeekly: string;
    leaderboardRank: string;
    leaderboardPlayer: string;
    leaderboardCoins: string;
    leaderboardYou: string;
    leaderboardEmpty: string;

    // ── Home tabs ──
    homeTabRoom: string;
    homeTabLeaderboard: string;

    // ── Wager ──
    wagerTitle: string;
    wagerSubtitle: string;
    wagerChooseAmount: string;
    wagerWinCondition: string;
    wagerPayout: string;
    wagerSkip: string;
    wagerConfirm: string;
    wagerWon: string;
    wagerLost: string;
    wagerWonDesc: string;
    wagerLostDesc: string;
    wagerActive: string;
    wagerCommunityAvg: string;
    wagerInsufficientCoins: string;

    // ── Game: market memory ──
    marketMemoryTitle: string;
    marketMemorySubtitle: string;
    marketMemoryHowToPlay: string;
    marketMemoryStep1: string;
    marketMemoryStep2: string;
    marketMemoryStep3: string;
    marketMemoryStep4: string;
    marketMemoryRewardPreview: string;
    marketMemoryStart: string;
    marketMemoryMemorisePrompt: string;
    marketMemoryMemoriseSubPrompt: string;
    marketMemoryTip: string;
    marketMemoryHidden: string;
    marketMemoryHiddenSub: string;
    marketMemoryQuizPrompt: string;
    marketMemoryQuizSubPrompt: string;
    marketMemorySubmit: string;
    marketMemorySelectFirst: string;

    // ── Mahjong match game ──
    mahjongTitle: string;
    mahjongSubtitle: string;
    mahjongHowToPlay: string;
    mahjongStep1: string;
    mahjongStep2: string;
    mahjongStep3: string;
    mahjongStep4: string;
    mahjongRewardPreview: string;
    mahjongStart: string;
    mahjongPreviewPrompt: string;
    mahjongPreviewSub: string;
    mahjongPlayPrompt: string;
    mahjongPlaySub: string;
    mahjongMoves: string;
    mahjongTime: string;
    mahjongComplete: string;
    mahjongCompleteSub: string;
    mahjongBestMoves: string;
    mahjongTimeTaken: string;

    // ── Dim sum order game ──
    dimSumTitle: string;
    dimSumSubtitle: string;
    dimSumHowToPlay: string;
    dimSumStep1: string;
    dimSumStep2: string;
    dimSumStep3: string;
    dimSumStep4: string;
    dimSumRewardPreview: string;
    dimSumStart: string;
    dimSumRound: string;
    dimSumOf: string;
    dimSumShowPrompt: string;
    dimSumShowSub: string;
    dimSumQuizPrompt: string;
    dimSumQuizSub: string;
    dimSumCorrectTap: string;
    dimSumWrongTap: string;
    dimSumRoundComplete: string;
    dimSumNextRound: string;
    dimSumComplete: string;
    dimSumCompleteSub: string;
    dimSumTotalScore: string;
    dimSumPerfect: string;
    dimSumAttempts: string;
    dimSumProgress: string;

    // ── Tram route game ──
    tramTitle: string;
    tramSubtitle: string;
    tramHowToPlay: string;
    tramStep1: string;
    tramStep2: string;
    tramStep3: string;
    tramStep4: string;
    tramRewardPreview: string;
    tramStart: string;
    tramRound: string;
    tramOf: string;
    tramPrompt: string;
    tramPromptSub: string;
    tramConfirm: string;
    tramCorrect: string;
    tramWrong: string;
    tramShowAnswer: string;
    tramNextRound: string;
    tramComplete: string;
    tramCompleteSub: string;
    tramTotalScore: string;
    tramPerfect: string;
    tramAnswerWas: string;

    // ── Reward screen ──
    rewardTitle: string;
    rewardCorrect: string;
    rewardWrong: string;
    rewardCoins: string;
    rewardTotalCoins: string;
    rewardMoCATitle: string;
    rewardMoCASubtitle: string;
    rewardThisTime: string;
    rewardLastTime: string;
    rewardEncouragementHigh: string;
    rewardEncouragementMid: string;
    rewardEncouragementLow: string;
    rewardScoreLabelHigh: string;
    rewardScoreLabelMid: string;
    rewardScoreLabelLow: string;
    rewardPlayAgain: string;
    rewardBackToMap: string;
    rewardGameDone: string;
    scoreUnit: string;

    // ── Zone screen ──
    zoneNeighbours: string;
    zoneGames: string;
    zoneNowAt: string;
    zoneNoGames: string;
    zoneNotFound: string;

    // ── Friends screen ──
    friendsTitle: string;
    friendsTabFriends: string;
    friendsTabEvents: string;
    friendsOnline: string;
    friendsOffline: string;
    friendsAddFriend: string;
    friendsVisit: string;
    friendsQuest: string;
    friendsNowHere: string;
    friendsHoursAgo: string;
    friendsEventsFull: string;
    friendsEventsJoin: string;
    friendsEventsPeople: string;
    friendsEventsUpcoming: string;

    // ── Settings screen ──
    settingsTitle: string;
    settingsLanguage: string;
    settingsLanguageDesc: string;
    settingsAccount: string;
    settingsAccountDesc: string;
    settingsAbout: string;
    settingsAboutDesc: string;
    settingsVersion: string;
    settingsLanguagePickerTitle: string;

    // ── MoCA domains ──
    domainMemory: string;
    domainAttention: string;
    domainLanguage: string;
    domainExecutive: string;
    domainVisuospatial: string;
    domainOrientation: string;

    // Zone descriptions
    zoneMarketDesc: string;
    zoneCafeDesc: string;
    zoneEstateDesc: string;
    zoneParkDesc: string;

    // Zone activities (each zone has 4 activities)
    zoneMarketActivities: string[];
    zoneCafeActivities: string[];
    zoneEstateActivities: string[];
    zoneParkActivities: string[];

    // ── Game titles, descriptions, domains ──
    gameTitleMarketMemory: string;
    gameTitleMahjongMatch: string;
    gameTitleDimSumOrder: string;
    gameTitleTramRoute: string;
    gameTitleNewsWords: string;
    gameTitleCalendarQuiz: string;

    gameDescMarketMemory: string;
    gameDescMahjongMatch: string;
    gameDescDimSumOrder: string;
    gameDescTramRoute: string;
    gameDescNewsWords: string;
    gameDescCalendarQuiz: string;

    // ── MoCA analysis tab ──
    tabMoca: string;
    mocaTitle: string;
    mocaSubtitle: string;
    mocaEstimatedScore: string;
    mocaAreasMeasured: string;
    mocaPoints: string;
    mocaGamesPlayed: string;
    mocaProjectedNote: string;
    mocaBandNormal: string;
    mocaBandNormalDesc: string;
    mocaBandMild: string;
    mocaBandMildDesc: string;
    mocaBandLow: string;
    mocaBandLowDesc: string;
    mocaStrongest: string;
    mocaNeedsPractice: string;
    mocaDomainBreakdown: string;
    mocaNotTested: string;
    mocaPlays: string;
    mocaPlayToTest: string;
    mocaGameComingSoon: string;
    mocaHistoryTitle: string;
    mocaRecentTitle: string;
    mocaEmptyTitle: string;
    mocaEmptyDesc: string;
    mocaDisclaimer: string;


    // ── Calendar quiz (orientation) ──
    calTitle: string;
    calSubtitle: string;
    calHowToPlay: string;
    calStep1: string;
    calStep2: string;
    calStep3: string;
    calRewardPreview: string;
    calStart: string;
    calNpcName: string;
    calProgress: string;
    calQDate: string;
    calQMonth: string;
    calQYear: string;
    calQWeekday: string;
    calQCity: string;
    calQTimeOfDay: string;
    calDateOption: string;
    calYearOption: string;
    calMonthNames: string[];
    calWeekdayNames: string[];
    calCityHongKong: string;
    calCityMacau: string;
    calCityShenzhen: string;
    calCityGuangzhou: string;
    calTimeMorning: string;
    calTimeAfternoon: string;
    calTimeEvening: string;
    calTimeNight: string;
    calCorrect: string;
    calWrong: string;

    // ── Onboarding ──
    onboardingWelcome: string;
    onboardingTagline: string;
    onboardingGetStarted: string;
    onboardingSelectLanguage: string;
    onboardingSelectLanguageSub: string;
    onboardingSelectRegion: string;
    onboardingSelectRegionSub: string;
    onboardingVerifyId: string;
    onboardingVerifyIdSub: string;
    onboardingIdNumber: string;
    onboardingIdPlaceholder: string;
    onboardingTakeIdPhoto: string;
    onboardingTakeIdPhotoSub: string;
    onboardingTakeSelfie: string;
    onboardingTakeSelfieSub: string;
    onboardingVerifying: string;
    onboardingVerified: string;
    onboardingVerifiedSub: string;
    onboardingSetupProfile: string;
    onboardingSetupProfileSub: string;
    onboardingYourName: string;
    onboardingNamePlaceholder: string;
    onboardingChooseAvatar: string;
    onboardingNext: string;
    onboardingDone: string;
    onboardingSkip: string;
    onboardingMockPhotoTaken: string;
    onboardingIdFormat: string;
    onboardingInvalidId: string;
}

// ─── English ──────────────────────────────────────────────────────────────────

const en: Strings = {
    // General
    appName: 'Imperial Garden',
    loading: 'Loading...',
    back: '‹ Back',
    close: '✕',
    confirm: 'Confirm',
    cancel: 'Cancel',
    comingSoon: 'More coming soon!',
    level: 'Level',
    seconds: 'sec',

    // Tab bar
    tabMap: 'Map',
    tabHome: 'My Home',
    tabGames: 'Games',
    tabFriends: 'Friends',
    tabSettings: 'Settings',

    // Map screen
    mapTitle: '🗺 HK Map',
    mapDailyQuest: '📋',
    mapDailyQuestDesc: "Today's Quest: Buy 5 things at the wet market!",
    mapZoneMarket: 'Wet Market',
    mapZoneCafe: 'Cha Chaan Teng',
    mapZoneEstate: 'Housing Estate',
    mapZonePark: 'Victoria Park',
    mapHarbour: 'Victoria Harbour',
    mapEnterZone: 'Enter',
    mapActivities: 'What can you do here?',

    // Home screen
    homeTitle: "'s Cosy Home",
    homeLevel: '🏠 Level',
    homeFurniture: 'Furniture',
    homeLocked: 'Locked',
    homeScore: 'Points',
    homeMyRoom: 'My Room',
    homeHint:
        'Complete games and quests to earn points and unlock more furniture!',
    homeDecorate: '🎨 Decorate My Home',

    // My Home shop
    shopUnlock: 'Unlock',
    shopUnlockConfirm: 'Spend coins to unlock this item?',
    shopUnlockSuccess: 'Unlocked! 🎉',
    shopNotEnoughCoins: 'Not enough coins!',
    shopCoinsNeeded: 'coins needed',
    shopAlreadyUnlocked: 'Already unlocked',

    // Leaderboard
    leaderboardTitle: '🏆 Leaderboard',
    leaderboardWeekly: 'Weekly Rankings',
    leaderboardRank: 'Rank',
    leaderboardPlayer: 'Player',
    leaderboardCoins: 'Coins',
    leaderboardYou: 'You',
    leaderboardEmpty: 'No players yet this week',

    // Home tabs
    homeTabRoom: '🏠 My Room',
    homeTabLeaderboard: '🏆 Rankings',

    // Wager
    wagerTitle: '🎰 Place a Wager?',
    wagerSubtitle: 'Beat the community average to win big!',
    wagerChooseAmount: 'Choose your wager:',
    wagerWinCondition: 'Win condition: beat community average score',
    wagerPayout: '2.5x payout if you win',
    wagerSkip: 'Skip, just play',
    wagerConfirm: 'Place Wager →',
    wagerWon: '🎉 Wager Won!',
    wagerLost: '😔 Wager Lost',
    wagerWonDesc: 'You beat the community average!',
    wagerLostDesc: 'Better luck next time!',
    wagerActive: '🎰 Wager Active',
    wagerCommunityAvg: 'Community avg',
    wagerInsufficientCoins: 'Not enough coins to wager',

    // Games screen
    gamesTitle: '🎮 Games',
    gamesDailyChallenge: 'Daily Challenge',
    gamesDailyChallengeDesc: 'Complete 3 games to earn bonus 🪙 100!',
    gamesAllGames: 'All Games',
    gamesAllGamesSubtitle: 'Each game trains a different brain skill',
    gamesUnlockHint: 'Complete more games to unlock',
    gamesBrainTip:
        'Playing brain games regularly helps maintain cognitive ability. Once a day is best!',
    gamesDuration: 'About',
    gamesLocked: 'Locked',

    // Market memory game
    marketMemoryTitle: 'Market Memory',
    marketMemorySubtitle: 'Memory Game',
    marketMemoryHowToPlay: 'How to play?',
    marketMemoryStep1: '1️⃣  Look at the market items carefully',
    marketMemoryStep2: '2️⃣  Remember them (only 5 seconds!)',
    marketMemoryStep3: '3️⃣  Pick the ones you remember',
    marketMemoryStep4: '4️⃣  More correct = more points!',
    marketMemoryRewardPreview: 'Complete to earn',
    marketMemoryStart: 'Start Game →',
    marketMemoryMemorisePrompt: 'Remember these items!',
    marketMemoryMemoriseSubPrompt: 'Remember them — you will be tested!',
    marketMemoryTip: 'Try saying each item out loud to help you remember!',
    marketMemoryHidden: 'Items hidden!',
    marketMemoryHiddenSub: "Now let's test your memory...",
    marketMemoryQuizPrompt: 'Which items do you remember?',
    marketMemoryQuizSubPrompt: 'Tap the items you saw',
    marketMemorySubmit: 'Submit Answers →',
    marketMemorySelectFirst: 'Select items first...',

    // Mahjong match
    mahjongTitle: 'Mahjong Match',
    mahjongSubtitle: 'Attention Game',
    mahjongHowToPlay: 'How to play?',
    mahjongStep1: '1️⃣  All tiles are shown briefly',
    mahjongStep2: '2️⃣  Tiles flip face down',
    mahjongStep3: '3️⃣  Tap two tiles to flip them up',
    mahjongStep4: '4️⃣  Find all 8 pairs — fewer moves wins!',
    mahjongRewardPreview: 'Complete to earn',
    mahjongStart: 'Start Game →',
    mahjongPreviewPrompt: 'Remember the tiles!',
    mahjongPreviewSub: 'They will flip face down soon...',
    mahjongPlayPrompt: 'Find all matching pairs!',
    mahjongPlaySub: 'Tap two tiles to flip them',
    mahjongMoves: 'Moves',
    mahjongTime: 'Time',
    mahjongComplete: '🎉 All pairs found!',
    mahjongCompleteSub: 'Well done!',
    mahjongBestMoves: 'Best possible: 8 moves',
    mahjongTimeTaken: 'Time taken',

    // Dim sum order
    dimSumTitle: 'Dim Sum Order',
    dimSumSubtitle: 'Executive Function Game',
    dimSumHowToPlay: 'How to play?',
    dimSumStep1: '1️⃣  Remember the order of the dishes shown',
    dimSumStep2: '2️⃣  They will disappear after a few seconds',
    dimSumStep3: '3️⃣  Tap the dishes in the correct order',
    dimSumStep4: '4️⃣  Watch out for extra dishes to trick you!',
    dimSumRewardPreview: 'Complete to earn',
    dimSumStart: 'Start Game →',
    dimSumRound: 'Round',
    dimSumOf: 'of',
    dimSumShowPrompt: 'Remember the order!',
    dimSumShowSub: 'Dishes will disappear soon...',
    dimSumQuizPrompt: 'Tap in the correct order!',
    dimSumQuizSub: 'Tap the dishes in the order you saw them',
    dimSumCorrectTap: '✓ Correct!',
    dimSumWrongTap: '✗ Wrong! Try again from the start',
    dimSumRoundComplete: '🎉 Round complete!',
    dimSumNextRound: 'Next Round →',
    dimSumComplete: '🍡 All rounds complete!',
    dimSumCompleteSub: 'You have a great memory for dim sum!',
    dimSumTotalScore: 'Total Score',
    dimSumPerfect: 'Perfect!',
    dimSumAttempts: 'Attempts',
    dimSumProgress: 'Progress',

    // Tram route
    tramTitle: 'Tram Route',
    tramSubtitle: 'Visuospatial Game',
    tramHowToPlay: 'How to play?',
    tramStep1: '1️⃣  Look at the tram map',
    tramStep2: '2️⃣  Arrange the stops in the correct order',
    tramStep3: '3️⃣  Drag stops left or right to reorder',
    tramStep4: '4️⃣  5 rounds — gets harder each time!',
    tramRewardPreview: 'Complete to earn',
    tramStart: 'Start Game →',
    tramRound: 'Round',
    tramOf: 'of',
    tramPrompt: 'Arrange the stops in order!',
    tramPromptSub: 'Drag stops to rearrange — west to east',
    tramConfirm: 'Confirm Order →',
    tramCorrect: '✓ Correct!',
    tramWrong: '✗ Wrong — try again!',
    tramShowAnswer: 'Show Answer',
    tramNextRound: 'Next Round →',
    tramComplete: '🚋 All rounds complete!',
    tramCompleteSub: 'You know HK tram routes well!',
    tramTotalScore: 'Total Score',
    tramPerfect: 'Perfect score!',
    tramAnswerWas: 'Correct order was:',

    // Reward screen
    rewardTitle: '🎉 Game Complete!',
    rewardCorrect: 'Correct',
    rewardWrong: 'Wrong',
    rewardCoins: 'Coins',
    rewardTotalCoins: 'Total Coins',
    rewardMoCATitle: '🧠 Cognitive Tracking',
    rewardMoCASubtitle: 'Based on the Montreal Cognitive Assessment (MoCA)',
    rewardThisTime: 'This time',
    rewardLastTime: 'Last time',
    rewardEncouragementHigh:
        'Excellent memory! Keep it up — daily practice is great for brain health.',
    rewardEncouragementMid:
        'Well done! Memory improves with regular practice. Play once a day for best results.',
    rewardEncouragementLow:
        "No worries — practice makes perfect! Keep playing and you'll improve.",
    rewardScoreLabelHigh: 'Excellent!',
    rewardScoreLabelMid: 'Well done!',
    rewardScoreLabelLow: 'Keep going!',
    rewardPlayAgain: '🔄 Play Again',
    rewardBackToMap: 'Back to Map 🗺️',
    rewardGameDone: 'Game Complete',
    scoreUnit: 'pts',

    // Zone screen
    zoneNeighbours: 'Neighbours',
    zoneGames: 'Games to Play',
    zoneNowAt: 'is now at',
    zoneNoGames: 'More games coming soon!',
    zoneNotFound: 'Zone not found 🤔',

    // Friends screen
    friendsTitle: '👥 Friends',
    friendsTabFriends: '👥 Friends',
    friendsTabEvents: '🎉 Events',
    friendsOnline: '🟢 Online Now',
    friendsOffline: '⚪ Recently Online',
    friendsAddFriend: '＋ Find New Friends',
    friendsVisit: 'Visit',
    friendsQuest: 'Quest',
    friendsNowHere: '🟢 Online now',
    friendsHoursAgo: 'ago',
    friendsEventsFull: 'Full',
    friendsEventsJoin: 'Join Event →',
    friendsEventsPeople: 'people',
    friendsEventsUpcoming: 'Upcoming Events',

    // Settings screen
    settingsTitle: '⚙️ Settings',
    settingsLanguage: '🌐 Language',
    settingsLanguageDesc: 'English',
    settingsAccount: '👤 Account',
    settingsAccountDesc: 'Profile and HKID verification',
    settingsAbout: 'ℹ️ About',
    settingsAboutDesc: 'Version and information',
    settingsVersion: 'Version 1.0.0',
    settingsLanguagePickerTitle: 'Choose Language',

    // MoCA domains
    domainMemory: 'Memory',
    domainAttention: 'Attention',
    domainLanguage: 'Language',
    domainExecutive: 'Executive',
    domainVisuospatial: 'Visuospatial',
    domainOrientation: 'Orientation',

    // Zone descriptions + activities
    zoneMarketDesc: 'The wet market is the heart of Hong Kong — fresh produce, fish and meat, with friendly neighbours shopping every day.',
    zoneCafeDesc: 'The cha chaan teng is uniquely Hong Kong. A cup of milk tea and a pineapple bun are part of every local\'s memory.',
    zoneEstateDesc: 'Public housing estates are home to many Hong Kongers, full of warmth and neighbourly spirit.',
    zoneParkDesc: 'Victoria Park is one of Hong Kong\'s largest parks — a favourite spot for morning exercise, chess and meeting friends.',
    zoneMarketActivities: ['🥬 Buy vegetables', '🐟 Buy fish', '🗣️ Chat with neighbours', '🛍️ Find bargains'],
    zoneCafeActivities: ['☕ Drink milk tea', '🍞 Eat toast', '📰 Read the paper', '💬 Have a chat'],
    zoneEstateActivities: ['🏠 Visit neighbours', '🛗 Take the lift', '🌿 Tend the garden', '📮 Check the mail'],
    zoneParkActivities: ['🌸 Morning exercise', '🎭 Watch performances', '♟️ Play chess', '👥 Meet friends'],

    // Game titles
    gameTitleMarketMemory: 'Market Memory',
    gameTitleMahjongMatch: 'Mahjong Match',
    gameTitleDimSumOrder: 'Dim Sum Order',
    gameTitleTramRoute: 'Tram Route',
    gameTitleNewsWords: 'News Words',
    gameTitleCalendarQuiz: 'What Day Is It?',

    // Game descriptions
    gameDescMarketMemory: 'Remember market items and test your memory across 5 rounds!',
    gameDescMahjongMatch: 'Flip tiles and find all matching mahjong pairs!',
    gameDescDimSumOrder: 'Arrange the dim sum in the correct order to train your executive skills!',
    gameDescTramRoute: 'Find the fastest tram route from Sheung Wan to Shau Kei Wan!',
    gameDescNewsWords: 'Complete today\'s news crossword to keep your language skills sharp!',
    gameDescCalendarQuiz: 'Answer 6 questions about today\'s date, day, city and time!',

    // MoCA analysis tab
    tabMoca: 'MoCA',
    mocaTitle: 'Brain Report',
    mocaSubtitle: 'MoCA-style analysis of your games',
    mocaEstimatedScore: 'Estimated MoCA score',
    mocaAreasMeasured: 'areas measured',
    mocaPoints: 'pts',
    mocaGamesPlayed: 'games played',
    mocaProjectedNote: 'Score is projected to 30 from the areas you have played so far.',
    mocaBandNormal: 'Looking good',
    mocaBandNormalDesc: 'Your results are in the typical range. Keep playing every day!',
    mocaBandMild: 'Keep training',
    mocaBandMildDesc: 'Some areas could use more practice. Try the games marked below.',
    mocaBandLow: 'Let\'s check in',
    mocaBandLowDesc: 'Your scores are lower than usual. It may help to talk to a doctor or family member.',
    mocaStrongest: 'Strongest',
    mocaNeedsPractice: 'Needs practice',
    mocaDomainBreakdown: 'Brain areas',
    mocaNotTested: 'Not tested yet',
    mocaPlays: 'plays',
    mocaPlayToTest: 'Go to Games',
    mocaGameComingSoon: 'Game coming soon',
    mocaHistoryTitle: 'Score history',
    mocaRecentTitle: 'Recent games',
    mocaEmptyTitle: 'No games played yet',
    mocaEmptyDesc: 'Play a few brain games and your report will appear here.',
    mocaDisclaimer: 'This is an estimate based on game scores, not a medical diagnosis. For a real MoCA test, please see a doctor.',

    // Calendar quiz (orientation)
    calTitle: 'What Day Is It?',
    calSubtitle: 'Orientation Game',
    calHowToPlay: 'How to play?',
    calStep1: '1️⃣  Mrs Chan will ask you 6 questions',
    calStep2: '2️⃣  Tap the right answer about today',
    calStep3: '3️⃣  Watch the calendar fill in!',
    calRewardPreview: 'Complete to earn',
    calStart: 'Start Game →',
    calNpcName: 'Mrs Chan',
    calProgress: 'Question {n} of {total}',
    calQDate: 'What is the date today?',
    calQMonth: 'What month is it?',
    calQYear: 'What year is it?',
    calQWeekday: 'What day of the week is it?',
    calQCity: 'Which city are we in?',
    calQTimeOfDay: 'Is it morning, afternoon or evening?',
    calDateOption: '{n}',
    calYearOption: '{n}',
    calMonthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    calWeekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    calCityHongKong: 'Hong Kong',
    calCityMacau: 'Macau',
    calCityShenzhen: 'Shenzhen',
    calCityGuangzhou: 'Guangzhou',
    calTimeMorning: 'Morning',
    calTimeAfternoon: 'Afternoon',
    calTimeEvening: 'Evening',
    calTimeNight: 'Late night',
    calCorrect: '✓ Correct!',
    calWrong: '✗ The answer is',

    // Onboarding
    onboardingWelcome: 'Imperial Garden',
    onboardingTagline: 'Stay sharp, stay connected.',
    onboardingGetStarted: 'Get Started →',
    onboardingSelectLanguage: 'Choose your language',
    onboardingSelectLanguageSub: 'You can change this later in Settings',
    onboardingSelectRegion: 'Where do you live?',
    onboardingSelectRegionSub: 'We will personalise your experience',
    onboardingVerifyId: 'Verify your identity',
    onboardingVerifyIdSub: 'Your ID is used to keep your account safe',
    onboardingIdNumber: 'ID Number',
    onboardingIdPlaceholder: 'Enter your ID number',
    onboardingTakeIdPhoto: 'Take a photo of your ID card',
    onboardingTakeIdPhotoSub: 'Place your ID card on a flat surface',
    onboardingTakeSelfie: 'Take a selfie holding your ID',
    onboardingTakeSelfieSub: 'Hold your ID next to your face',
    onboardingVerifying: 'Verifying your identity...',
    onboardingVerified: '✓ Identity Verified!',
    onboardingVerifiedSub: 'Your account is now secure',
    onboardingSetupProfile: 'Set up your profile',
    onboardingSetupProfileSub: 'Tell us a bit about yourself',
    onboardingYourName: 'Your name',
    onboardingNamePlaceholder: 'Enter your name',
    onboardingChooseAvatar: 'Choose your avatar',
    onboardingNext: 'Next →',
    onboardingDone: 'Enter the Garden →',
    onboardingSkip: 'Skip for now',
    onboardingMockPhotoTaken: '📸 Photo taken!',
    onboardingIdFormat: 'Format',
    onboardingInvalidId: 'Please enter a valid ID number',
};

// ─── Cantonese (Traditional Chinese) ─────────────────────────────────────────

const zhHK: Strings = {
    // General
    appName: '皇家花園',
    loading: '載入中...',
    back: '‹ 返回',
    close: '✕',
    confirm: '確認',
    cancel: '取消',
    comingSoon: '更多即將推出！',
    level: '等級',
    seconds: '秒',

    // Tab bar
    tabMap: '地圖',
    tabHome: '我的家',
    tabGames: '遊戲',
    tabFriends: '朋友',
    tabSettings: '設定',

    // Map screen
    mapTitle: '🗺 香港地圖',
    mapDailyQuest: '📋',
    mapDailyQuestDesc: '今日任務：去街市買 5 樣嘢！',
    mapZoneMarket: '街市',
    mapZoneCafe: '茶餐廳',
    mapZoneEstate: '公共屋邨',
    mapZonePark: '維多利亞公園',
    mapHarbour: '維多利亞港',
    mapEnterZone: '進入',
    mapActivities: '可以做咩？',

    // Home screen
    homeTitle: '嘅溫馨小屋',
    homeLevel: '🏠 等級',
    homeFurniture: '家具',
    homeLocked: '未解鎖',
    homeScore: '積分',
    homeMyRoom: '我嘅房間',
    homeHint: '完成遊戲同任務可以獲得積分，用嚟解鎖更多家具！',
    homeDecorate: '🎨 裝飾我的家',

    // My Home shop
    shopUnlock: '解鎖',
    shopUnlockConfirm: '花費積分解鎖呢件家具？',
    shopUnlockSuccess: '解鎖成功！🎉',
    shopNotEnoughCoins: '積分唔夠！',
    shopCoinsNeeded: '積分',
    shopAlreadyUnlocked: '已解鎖',

    // Leaderboard
    leaderboardTitle: '🏆 排行榜',
    leaderboardWeekly: '本週排名',
    leaderboardRank: '排名',
    leaderboardPlayer: '玩家',
    leaderboardCoins: '積分',
    leaderboardYou: '你',
    leaderboardEmpty: '今週暫時未有玩家',

    // Home tabs
    homeTabRoom: '🏠 我的房間',
    homeTabLeaderboard: '🏆 排行榜',

    // Wager
    wagerTitle: '🎰 想唔想下注？',
    wagerSubtitle: '打敗社區平均分就可以贏取更多積分！',
    wagerChooseAmount: '選擇下注金額：',
    wagerWinCondition: '勝出條件：超越社區平均分',
    wagerPayout: '贏咗獲得 2.5 倍回報',
    wagerSkip: '唔下注，直接玩',
    wagerConfirm: '確認下注 →',
    wagerWon: '🎉 下注勝出！',
    wagerLost: '😔 下注失敗',
    wagerWonDesc: '你打敗咗社區平均分！',
    wagerLostDesc: '下次再試！',
    wagerActive: '🎰 下注進行中',
    wagerCommunityAvg: '社區平均分',
    wagerInsufficientCoins: '積分唔夠下注',

    // Games screen
    gamesTitle: '🎮 遊戲',
    gamesDailyChallenge: '今日挑戰',
    gamesDailyChallengeDesc: '完成 3 個遊戲，獲得額外 🪙 100！',
    gamesAllGames: '所有遊戲',
    gamesAllGamesSubtitle: '每個遊戲訓練唔同嘅腦部能力',
    gamesUnlockHint: '完成更多遊戲解鎖',
    gamesBrainTip: '定期玩腦部遊戲有助保持認知能力，每日玩一次效果最好！',
    gamesDuration: '約',
    gamesLocked: '未解鎖',

    // Market memory game
    marketMemoryTitle: '街市記憶',
    marketMemorySubtitle: 'Market Memory',
    marketMemoryHowToPlay: '點樣玩？',
    marketMemoryStep1: '1️⃣  仔細睇住街市嘅貨品',
    marketMemoryStep2: '2️⃣  記低佢哋（得 5 秒！）',
    marketMemoryStep3: '3️⃣  答出你記得嘅貨品',
    marketMemoryStep4: '4️⃣  答啱越多，積分越高！',
    marketMemoryRewardPreview: '完成可獲得',
    marketMemoryStart: '開始遊戲 →',
    marketMemoryMemorisePrompt: '記住呢啲嘢！',
    marketMemoryMemoriseSubPrompt: '記低佢哋，之後要答！',
    marketMemoryTip: '試吓大聲讀出每樣嘢，幫助記憶！',
    marketMemoryHidden: '貨品收起咗！',
    marketMemoryHiddenSub: '而家考考你嘅記憶力⋯',
    marketMemoryQuizPrompt: '揀出你記得嘅貨品',
    marketMemoryQuizSubPrompt: '揀出你記得嘅貨品',
    marketMemorySubmit: '提交答案 →',
    marketMemorySelectFirst: '揀選貨品先...',

    // Mahjong match
    mahjongTitle: '麻雀配對',
    mahjongSubtitle: '專注力遊戲',
    mahjongHowToPlay: '點樣玩？',
    mahjongStep1: '1️⃣  所有牌短暫顯示',
    mahjongStep2: '2️⃣  牌面向下翻轉',
    mahjongStep3: '3️⃣  輕按兩張牌翻開',
    mahjongStep4: '4️⃣  搵出所有 8 對牌 — 步數越少越好！',
    mahjongRewardPreview: '完成可獲得',
    mahjongStart: '開始遊戲 →',
    mahjongPreviewPrompt: '記住啲牌！',
    mahjongPreviewSub: '佢哋就快會翻轉...',
    mahjongPlayPrompt: '搵出所有相同嘅牌！',
    mahjongPlaySub: '輕按兩張牌嚟翻開',
    mahjongMoves: '步數',
    mahjongTime: '時間',
    mahjongComplete: '🎉 全部配對完成！',
    mahjongCompleteSub: '做得好！',
    mahjongBestMoves: '最佳步數：8 步',
    mahjongTimeTaken: '用咗時間',

    // Dim sum order
    dimSumTitle: '點心排序',
    dimSumSubtitle: '執行能力遊戲',
    dimSumHowToPlay: '點樣玩？',
    dimSumStep1: '1️⃣  記住點心出現嘅次序',
    dimSumStep2: '2️⃣  點心會喺幾秒後消失',
    dimSumStep3: '3️⃣  按正確次序輕按點心',
    dimSumStep4: '4️⃣  小心有多餘嘅點心混淆你！',
    dimSumRewardPreview: '完成可獲得',
    dimSumStart: '開始遊戲 →',
    dimSumRound: '第',
    dimSumOf: '關',
    dimSumShowPrompt: '記住次序！',
    dimSumShowSub: '點心就快會消失...',
    dimSumQuizPrompt: '按正確次序輕按！',
    dimSumQuizSub: '按你見到嘅次序輕按點心',
    dimSumCorrectTap: '✓ 答啱！',
    dimSumWrongTap: '✗ 答錯！由頭再試',
    dimSumRoundComplete: '🎉 過關！',
    dimSumNextRound: '下一關 →',
    dimSumComplete: '🍡 全部完成！',
    dimSumCompleteSub: '你對點心次序記憶力好好！',
    dimSumTotalScore: '總分',
    dimSumPerfect: '滿分！',
    dimSumAttempts: '次數',
    dimSumProgress: '進度',

    // Tram route
    tramTitle: '電車路線',
    tramSubtitle: '視空間遊戲',
    tramHowToPlay: '點樣玩？',
    tramStep1: '1️⃣  睇吓電車路線圖',
    tramStep2: '2️⃣  將站名排列成正確次序',
    tramStep3: '3️⃣  拖動站名嚟重新排列',
    tramStep4: '4️⃣  共 5 關 — 越嚟越難！',
    tramRewardPreview: '完成可獲得',
    tramStart: '開始遊戲 →',
    tramRound: '第',
    tramOf: '關',
    tramPrompt: '將站名排成正確次序！',
    tramPromptSub: '拖動站名重新排列 — 由西至東',
    tramConfirm: '確認次序 →',
    tramCorrect: '✓ 答啱！',
    tramWrong: '✗ 答錯 — 再試一次！',
    tramShowAnswer: '睇答案',
    tramNextRound: '下一關 →',
    tramComplete: '🚋 全部完成！',
    tramCompleteSub: '你對香港電車路線好熟悉！',
    tramTotalScore: '總分',
    tramPerfect: '滿分！',
    tramAnswerWas: '正確次序係：',

    // Reward screen
    rewardTitle: '🎉 遊戲完成！',
    rewardCorrect: '答啱',
    rewardWrong: '答錯',
    rewardCoins: '積分',
    rewardTotalCoins: '總積分',
    rewardMoCATitle: '🧠 認知能力追蹤',
    rewardMoCASubtitle: '根據蒙特利爾認知評估（MoCA）',
    rewardThisTime: '今次',
    rewardLastTime: '上次',
    rewardEncouragementHigh: '你嘅記憶力非常好！繼續保持，每日練習對腦部健康好有益。',
    rewardEncouragementMid: '做得不錯！記憶力需要定期練習，每日玩一次效果最好。',
    rewardEncouragementLow: '唔緊要，熟能生巧！多練習幾次，記憶力一定會進步。',
    rewardScoreLabelHigh: '非常好！',
    rewardScoreLabelMid: '做得好！',
    rewardScoreLabelLow: '繼續努力！',
    rewardPlayAgain: '🔄 再玩一次',
    rewardBackToMap: '返回地圖 🗺️',
    rewardGameDone: '遊戲完成',
    scoreUnit: '分',

    // Zone screen
    zoneNeighbours: '街坊',
    zoneGames: '可以玩嘅遊戲',
    zoneNowAt: '而家喺',
    zoneNoGames: '更多遊戲即將推出！',
    zoneNotFound: '揾唔到呢個地區 🤔',
    

    // Friends screen
    friendsTitle: '👥 朋友',
    friendsTabFriends: '👥 朋友',
    friendsTabEvents: '🎉 社區活動',
    friendsOnline: '🟢 而家喺度',
    friendsOffline: '⚪ 最近喺度',
    friendsAddFriend: '＋ 搵新朋友',
    friendsVisit: '探訪',
    friendsQuest: '任務',
    friendsNowHere: '🟢 而家喺度',
    friendsHoursAgo: '前',
    friendsEventsFull: '已滿',
    friendsEventsJoin: '參加活動 →',
    friendsEventsPeople: '人',
    friendsEventsUpcoming: '即將舉行嘅活動',

    // Settings screen
    settingsTitle: '⚙️ 設定',
    settingsLanguage: '🌐 語言',
    settingsLanguageDesc: '廣東話',
    settingsAccount: '👤 帳戶',
    settingsAccountDesc: '個人資料及香港身份證驗證',
    settingsAbout: 'ℹ️ 關於',
    settingsAboutDesc: '版本及資訊',
    settingsVersion: '版本 1.0.0',
    settingsLanguagePickerTitle: '選擇語言',

    // MoCA domains
    domainMemory: '記憶力',
    domainAttention: '專注力',
    domainLanguage: '語言能力',
    domainExecutive: '執行能力',
    domainVisuospatial: '視空間',
    domainOrientation: '定向能力',

    // Zone descriptions + activities
    zoneMarketDesc: '街市係香港嘅心臟，新鮮食材同熱鬧氣氛令人精神爽利。',
    zoneCafeDesc: '茶餐廳係香港獨有嘅文化，一杯奶茶令你精神百倍。',
    zoneEstateDesc: '公共屋邨係香港人嘅家，充滿溫馨同回憶。',
    zoneParkDesc: '維多利亞公園係一個充滿生氣嘅地方，可以見到好多街坊朋友。',
    zoneMarketActivities: ['🥬 買菜', '🐟 買魚', '🗣️ 傾偈', '🛍️ 執平貨'],
    zoneCafeActivities: ['☕ 飲奶茶', '🍞 食多士', '📰 睇報紙', '💬 聊天'],
    zoneEstateActivities: ['🏠 探訪鄰居', '🛗 搭電梯', '🌿 花圃', '📮 信箱'],
    zoneParkActivities: ['🌸 晨運', '🎭 睇表演', '♟️ 下棋', '👥 見朋友'],

    // Game titles
    gameTitleMarketMemory: '街市記憶',
    gameTitleMahjongMatch: '麻雀配對',
    gameTitleDimSumOrder: '點心排序',
    gameTitleTramRoute: '電車路線',
    gameTitleNewsWords: '新聞填字',
    gameTitleCalendarQuiz: '今日係幾號？',

    // Game descriptions
    gameDescMarketMemory: '記住街市嘅貨品，5 關挑戰你嘅記憶力！',
    gameDescMahjongMatch: '翻開麻雀牌，搵出所有相同嘅牌！',
    gameDescDimSumOrder: '按照正確次序排列點心，訓練你嘅執行能力！',
    gameDescTramRoute: '搵出由上環去筲箕灣嘅最快路線！',
    gameDescNewsWords: '完成今日新聞嘅填字遊戲，保持語言能力！',
    gameDescCalendarQuiz: '回答 6 條關於今日日期、星期、城市同時間嘅問題！',

    // MoCA analysis tab
    tabMoca: '分析',
    mocaTitle: '腦力報告',
    mocaSubtitle: '根據你玩過嘅遊戲做 MoCA 分析',
    mocaEstimatedScore: '估計 MoCA 分數',
    mocaAreasMeasured: '個範疇已測試',
    mocaPoints: '分',
    mocaGamesPlayed: '局遊戲',
    mocaProjectedNote: '分數係根據你已經玩過嘅範疇推算到 30 分。',
    mocaBandNormal: '表現唔錯',
    mocaBandNormalDesc: '你嘅結果喺正常範圍，繼續每日玩啦！',
    mocaBandMild: '繼續練習',
    mocaBandMildDesc: '有啲範疇可以多啲練習，試吓下面嘅遊戲。',
    mocaBandLow: '留意一下',
    mocaBandLowDesc: '你嘅分數比平時低，可以同醫生或者屋企人傾吓。',
    mocaStrongest: '最強項',
    mocaNeedsPractice: '要多練',
    mocaDomainBreakdown: '腦力範疇',
    mocaNotTested: '未測試',
    mocaPlays: '次',
    mocaPlayToTest: '去玩遊戲',
    mocaGameComingSoon: '遊戲即將推出',
    mocaHistoryTitle: '分數紀錄',
    mocaRecentTitle: '最近玩過',
    mocaEmptyTitle: '仲未玩過遊戲',
    mocaEmptyDesc: '玩幾局腦力遊戲，你嘅報告就會喺度出現。',
    mocaDisclaimer: '呢個係根據遊戲分數嘅估計，唔係醫學診斷。如需正式 MoCA 測試，請見醫生。',

    // Calendar quiz (orientation)
    calTitle: '今日係幾號？',
    calSubtitle: '定向能力遊戲',
    calHowToPlay: '點樣玩？',
    calStep1: '1️⃣  陳師奶會問你 6 條問題',
    calStep2: '2️⃣  揀啱今日嘅答案',
    calStep3: '3️⃣  睇住月曆慢慢填滿！',
    calRewardPreview: '完成可獲得',
    calStart: '開始遊戲 →',
    calNpcName: '陳師奶',
    calProgress: '第 {n} 題（共 {total} 題）',
    calQDate: '今日係幾號？',
    calQMonth: '而家係幾月？',
    calQYear: '今年係邊年？',
    calQWeekday: '今日星期幾？',
    calQCity: '我哋而家喺邊個城市？',
    calQTimeOfDay: '而家係朝早、下晝定夜晚？',
    calDateOption: '{n}號',
    calYearOption: '{n}年',
    calMonthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    calWeekdayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    calCityHongKong: '香港',
    calCityMacau: '澳門',
    calCityShenzhen: '深圳',
    calCityGuangzhou: '廣州',
    calTimeMorning: '朝早',
    calTimeAfternoon: '下晝',
    calTimeEvening: '夜晚',
    calTimeNight: '深夜',
    calCorrect: '✓ 啱晒！',
    calWrong: '✗ 答案係',

    // Onboarding
    onboardingWelcome: '皇家花園',
    onboardingTagline: '保持靈敏，保持聯繫。',
    onboardingGetStarted: '開始 →',
    onboardingSelectLanguage: '選擇你的語言',
    onboardingSelectLanguageSub: '之後可以喺設定更改',
    onboardingSelectRegion: '你住喺邊度？',
    onboardingSelectRegionSub: '我們會根據你的位置個人化你的體驗',
    onboardingVerifyId: '驗證你的身份',
    onboardingVerifyIdSub: '你的身份證用嚟保障你的帳戶安全',
    onboardingIdNumber: '身份證號碼',
    onboardingIdPlaceholder: '輸入你的身份證號碼',
    onboardingTakeIdPhoto: '拍攝你的身份證',
    onboardingTakeIdPhotoSub: '將身份證放喺平坦的表面上',
    onboardingTakeSelfie: '拿住身份證自拍',
    onboardingTakeSelfieSub: '將身份證放喺面旁邊',
    onboardingVerifying: '正在驗證你的身份...',
    onboardingVerified: '✓ 身份驗證成功！',
    onboardingVerifiedSub: '你的帳戶已經安全',
    onboardingSetupProfile: '設定你的個人資料',
    onboardingSetupProfileSub: '告訴我們一啲關於你的資料',
    onboardingYourName: '你的名字',
    onboardingNamePlaceholder: '輸入你的名字',
    onboardingChooseAvatar: '選擇你的頭像',
    onboardingNext: '下一步 →',
    onboardingDone: '進入花園 →',
    onboardingSkip: '暫時跳過',
    onboardingMockPhotoTaken: '📸 相片已拍攝！',
    onboardingIdFormat: '格式',
    onboardingInvalidId: '請輸入有效的身份證號碼',
};

// ─── Simplified Chinese ───────────────────────────────────────────────────────

const zhCN: Strings = {
    // General
    appName: '皇家花园',
    loading: '加载中...',
    back: '‹ 返回',
    close: '✕',
    confirm: '确认',
    cancel: '取消',
    comingSoon: '更多即将推出！',
    level: '等级',
    seconds: '秒',

    // Tab bar
    tabMap: '地图',
    tabHome: '我的家',
    tabGames: '游戏',
    tabFriends: '朋友',
    tabSettings: '设置',

    // Map screen
    mapTitle: '🗺 香港地图',
    mapDailyQuest: '📋',
    mapDailyQuestDesc: '今日任务：去菜市场买 5 样东西！',
    mapZoneMarket: '菜市场',
    mapZoneCafe: '茶餐厅',
    mapZoneEstate: '公共屋苑',
    mapZonePark: '维多利亚公园',
    mapHarbour: '维多利亚港',
    mapEnterZone: '进入',
    mapActivities: '可以做什么？',

    // Home screen
    homeTitle: '的温馨小屋',
    homeLevel: '🏠 等级',
    homeFurniture: '家具',
    homeLocked: '未解锁',
    homeScore: '积分',
    homeMyRoom: '我的房间',
    homeHint: '完成游戏和任务可以获得积分，用来解锁更多家具！',
    homeDecorate: '🎨 装饰我的家',

    // My Home shop
    shopUnlock: '解锁',
    shopUnlockConfirm: '花费积分解锁这件家具？',
    shopUnlockSuccess: '解锁成功！🎉',
    shopNotEnoughCoins: '积分不够！',
    shopCoinsNeeded: '积分',
    shopAlreadyUnlocked: '已解锁',

    // Leaderboard
    leaderboardTitle: '🏆 排行榜',
    leaderboardWeekly: '本周排名',
    leaderboardRank: '排名',
    leaderboardPlayer: '玩家',
    leaderboardCoins: '积分',
    leaderboardYou: '你',
    leaderboardEmpty: '本周暂时没有玩家',

    // Home tabs
    homeTabRoom: '🏠 我的房间',
    homeTabLeaderboard: '🏆 排行榜',

    // Wager
    wagerTitle: '🎰 想下注吗？',
    wagerSubtitle: '打败社区平均分就可以赢取更多积分！',
    wagerChooseAmount: '选择下注金额：',
    wagerWinCondition: '胜出条件：超越社区平均分',
    wagerPayout: '赢了获得 2.5 倍回报',
    wagerSkip: '不下注，直接玩',
    wagerConfirm: '确认下注 →',
    wagerWon: '🎉 下注胜出！',
    wagerLost: '😔 下注失败',
    wagerWonDesc: '你打败了社区平均分！',
    wagerLostDesc: '下次再试！',
    wagerActive: '🎰 下注进行中',
    wagerCommunityAvg: '社区平均分',
    wagerInsufficientCoins: '积分不够下注',

    // Games screen
    gamesTitle: '🎮 游戏',
    gamesDailyChallenge: '今日挑战',
    gamesDailyChallengeDesc: '完成 3 个游戏，获得额外 🪙 100！',
    gamesAllGames: '所有游戏',
    gamesAllGamesSubtitle: '每个游戏训练不同的大脑能力',
    gamesUnlockHint: '完成更多游戏解锁',
    gamesBrainTip: '定期玩益智游戏有助保持认知能力，每天玩一次效果最好！',
    gamesDuration: '约',
    gamesLocked: '未解锁',

    // Market memory game
    marketMemoryTitle: '菜市场记忆',
    marketMemorySubtitle: 'Market Memory',
    marketMemoryHowToPlay: '怎么玩？',
    marketMemoryStep1: '1️⃣  仔细看菜市场的货品',
    marketMemoryStep2: '2️⃣  记住它们（只有 5 秒！）',
    marketMemoryStep3: '3️⃣  选出你记得的货品',
    marketMemoryStep4: '4️⃣  答对越多，积分越高！',
    marketMemoryRewardPreview: '完成可获得',
    marketMemoryStart: '开始游戏 →',
    marketMemoryMemorisePrompt: '记住这些东西！',
    marketMemoryMemoriseSubPrompt: '记住它们，之后要回答！',
    marketMemoryTip: '试着大声读出每样东西，帮助记忆！',
    marketMemoryHidden: '货品已隐藏！',
    marketMemoryHiddenSub: '现在考考你的记忆力⋯',
    marketMemoryQuizPrompt: '选出你记得的货品',
    marketMemoryQuizSubPrompt: '选出你看到的货品',
    marketMemorySubmit: '提交答案 →',
    marketMemorySelectFirst: '请先选择货品...',

    // Mahjong match
    mahjongTitle: '麻将配对',
    mahjongSubtitle: '专注力游戏',
    mahjongHowToPlay: '怎么玩？',
    mahjongStep1: '1️⃣  所有牌短暂显示',
    mahjongStep2: '2️⃣  牌面向下翻转',
    mahjongStep3: '3️⃣  轻按两张牌翻开',
    mahjongStep4: '4️⃣  找出所有 8 对牌 — 步数越少越好！',
    mahjongRewardPreview: '完成可获得',
    mahjongStart: '开始游戏 →',
    mahjongPreviewPrompt: '记住这些牌！',
    mahjongPreviewSub: '它们即将翻转...',
    mahjongPlayPrompt: '找出所有相同的牌！',
    mahjongPlaySub: '轻按两张牌来翻开',
    mahjongMoves: '步数',
    mahjongTime: '时间',
    mahjongComplete: '🎉 全部配对完成！',
    mahjongCompleteSub: '做得好！',
    mahjongBestMoves: '最佳步数：8 步',
    mahjongTimeTaken: '用时',

    // Dim sum order
    dimSumTitle: '点心排序',
    dimSumSubtitle: '执行能力游戏',
    dimSumHowToPlay: '怎么玩？',
    dimSumStep1: '1️⃣  记住点心出现的顺序',
    dimSumStep2: '2️⃣  点心会在几秒后消失',
    dimSumStep3: '3️⃣  按正确顺序轻点点心',
    dimSumStep4: '4️⃣  小心有多余的点心混淆你！',
    dimSumRewardPreview: '完成可获得',
    dimSumStart: '开始游戏 →',
    dimSumRound: '第',
    dimSumOf: '关',
    dimSumShowPrompt: '记住顺序！',
    dimSumShowSub: '点心即将消失...',
    dimSumQuizPrompt: '按正确顺序轻点！',
    dimSumQuizSub: '按你看到的顺序轻点点心',
    dimSumCorrectTap: '✓ 答对了！',
    dimSumWrongTap: '✗ 答错了！从头再试',
    dimSumRoundComplete: '🎉 过关！',
    dimSumNextRound: '下一关 →',
    dimSumComplete: '🍡 全部完成！',
    dimSumCompleteSub: '你对点心顺序记忆力很好！',
    dimSumTotalScore: '总分',
    dimSumPerfect: '满分！',
    dimSumAttempts: '次数',
    dimSumProgress: '进度',

    // Tram route
    tramTitle: '电车路线',
    tramSubtitle: '视空间游戏',
    tramHowToPlay: '怎么玩？',
    tramStep1: '1️⃣  看看电车路线图',
    tramStep2: '2️⃣  将站名排列成正确顺序',
    tramStep3: '3️⃣  拖动站名来重新排列',
    tramStep4: '4️⃣  共 5 关 — 越来越难！',
    tramRewardPreview: '完成可获得',
    tramStart: '开始游戏 →',
    tramRound: '第',
    tramOf: '关',
    tramPrompt: '将站名排成正确顺序！',
    tramPromptSub: '拖动站名重新排列 — 由西至东',
    tramConfirm: '确认顺序 →',
    tramCorrect: '✓ 答对了！',
    tramWrong: '✗ 答错了 — 再试一次！',
    tramShowAnswer: '看答案',
    tramNextRound: '下一关 →',
    tramComplete: '🚋 全部完成！',
    tramCompleteSub: '你对香港电车路线很熟悉！',
    tramTotalScore: '总分',
    tramPerfect: '满分！',
    tramAnswerWas: '正确顺序是：',

    // Reward screen
    rewardTitle: '🎉 游戏完成！',
    rewardCorrect: '答对',
    rewardWrong: '答错',
    rewardCoins: '积分',
    rewardTotalCoins: '总积分',
    rewardMoCATitle: '🧠 认知能力追踪',
    rewardMoCASubtitle: '基于蒙特利尔认知评估（MoCA）',
    rewardThisTime: '本次',
    rewardLastTime: '上次',
    rewardEncouragementHigh: '你的记忆力非常好！继续保持，每天练习对大脑健康很有益。',
    rewardEncouragementMid: '做得不错！记忆力需要定期练习，每天玩一次效果最好。',
    rewardEncouragementLow: '没关系，熟能生巧！多练习几次，记忆力一定会进步。',
    rewardScoreLabelHigh: '非常好！',
    rewardScoreLabelMid: '做得好！',
    rewardScoreLabelLow: '继续加油！',
    rewardPlayAgain: '🔄 再玩一次',
    rewardBackToMap: '返回地图 🗺️',
    rewardGameDone: '游戏完成',
    scoreUnit: '分',

    // Zone screen
    zoneNeighbours: '邻居',
    zoneGames: '可以玩的游戏',
    zoneNowAt: '现在在',
    zoneNoGames: '更多游戏即将推出！',
    zoneNotFound: '找不到此地区 🤔',

    // Friends screen
    friendsTitle: '👥 朋友',
    friendsTabFriends: '👥 朋友',
    friendsTabEvents: '🎉 社区活动',
    friendsOnline: '🟢 现在在线',
    friendsOffline: '⚪ 最近在线',
    friendsAddFriend: '＋ 寻找新朋友',
    friendsVisit: '探访',
    friendsQuest: '任务',
    friendsNowHere: '🟢 现在在线',
    friendsHoursAgo: '前',
    friendsEventsFull: '已满',
    friendsEventsJoin: '参加活动 →',
    friendsEventsPeople: '人',
    friendsEventsUpcoming: '即将举行的活动',

    // Settings screen
    settingsTitle: '⚙️ 设置',
    settingsLanguage: '🌐 语言',
    settingsLanguageDesc: '简体中文',
    settingsAccount: '👤 账户',
    settingsAccountDesc: '个人资料及香港身份证验证',
    settingsAbout: 'ℹ️ 关于',
    settingsAboutDesc: '版本及信息',
    settingsVersion: '版本 1.0.0',
    settingsLanguagePickerTitle: '选择语言',

    // MoCA domains
    domainMemory: '记忆力',
    domainAttention: '专注力',
    domainLanguage: '语言能力',
    domainExecutive: '执行能力',
    domainVisuospatial: '视空间',
    domainOrientation: '定向能力',

    // Zone descriptions + activities
    zoneMarketDesc: '菜市场是香港的心脏，新鲜食材和热闹气氛令人精神爽利。',
    zoneCafeDesc: '茶餐厅是香港独有的文化，一杯奶茶令你精神百倍。',
    zoneEstateDesc: '公共屋苑是香港人的家，充满温馨和回忆。',
    zoneParkDesc: '维多利亚公园是一个充满生气的地方，可以见到很多街坊朋友。',
    zoneMarketActivities: ['🥬 买菜', '🐟 买鱼', '🗣️ 聊天', '🛍️ 淘便宜货'],
    zoneCafeActivities: ['☕ 喝奶茶', '🍞 吃多士', '📰 看报纸', '💬 聊天'],
    zoneEstateActivities: ['🏠 探访邻居', '🛗 乘电梯', '🌿 花圃', '📮 查信箱'],
    zoneParkActivities: ['🌸 晨运', '🎭 看表演', '♟️ 下棋', '👥 见朋友'],

    // Game titles
    gameTitleMarketMemory: '菜市场记忆',
    gameTitleMahjongMatch: '麻将配对',
    gameTitleDimSumOrder: '点心排序',
    gameTitleTramRoute: '电车路线',
    gameTitleNewsWords: '新闻填字',
    gameTitleCalendarQuiz: '今天是几号？',

    // Game descriptions
    gameDescMarketMemory: '记住菜市场的货品，5 关挑战你的记忆力！',
    gameDescMahjongMatch: '翻开麻将牌，找出所有相同的牌！',
    gameDescDimSumOrder: '按照正确顺序排列点心，训练你的执行能力！',
    gameDescTramRoute: '找出从上环到筲箕湾的最快路线！',
    gameDescNewsWords: '完成今日新闻的填字游戏，保持语言能力！',
    gameDescCalendarQuiz: '回答 6 个关于今天日期、星期、城市和时间的问题！',

    // MoCA analysis tab
    tabMoca: '分析',
    mocaTitle: '脑力报告',
    mocaSubtitle: '根据你玩过的游戏进行 MoCA 分析',
    mocaEstimatedScore: '估计 MoCA 分数',
    mocaAreasMeasured: '个范畴已测试',
    mocaPoints: '分',
    mocaGamesPlayed: '局游戏',
    mocaProjectedNote: '分数是根据你已经玩过的范畴推算到 30 分。',
    mocaBandNormal: '表现不错',
    mocaBandNormalDesc: '你的结果在正常范围，继续每天玩吧！',
    mocaBandMild: '继续练习',
    mocaBandMildDesc: '有些范畴可以多练习，试试下面的游戏。',
    mocaBandLow: '留意一下',
    mocaBandLowDesc: '你的分数比平时低，可以和医生或家人聊聊。',
    mocaStrongest: '最强项',
    mocaNeedsPractice: '需要多练',
    mocaDomainBreakdown: '脑力范畴',
    mocaNotTested: '未测试',
    mocaPlays: '次',
    mocaPlayToTest: '去玩游戏',
    mocaGameComingSoon: '游戏即将推出',
    mocaHistoryTitle: '分数记录',
    mocaRecentTitle: '最近玩过',
    mocaEmptyTitle: '还没玩过游戏',
    mocaEmptyDesc: '玩几局脑力游戏，你的报告就会在这里出现。',
    mocaDisclaimer: '这是根据游戏分数的估计，不是医学诊断。如需正式 MoCA 测试，请看医生。',

    // Calendar quiz (orientation)
    calTitle: '今天几号？',
    calSubtitle: '定向能力游戏',
    calHowToPlay: '怎么玩？',
    calStep1: '1️⃣  陈太太会问你 6 个问题',
    calStep2: '2️⃣  选出今天的正确答案',
    calStep3: '3️⃣  看着日历慢慢填满！',
    calRewardPreview: '完成可获得',
    calStart: '开始游戏 →',
    calNpcName: '陈太太',
    calProgress: '第 {n} 题（共 {total} 题）',
    calQDate: '今天几号？',
    calQMonth: '现在是几月？',
    calQYear: '今年是哪一年？',
    calQWeekday: '今天星期几？',
    calQCity: '我们现在在哪个城市？',
    calQTimeOfDay: '现在是早上、下午还是晚上？',
    calDateOption: '{n}日',
    calYearOption: '{n}年',
    calMonthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    calWeekdayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    calCityHongKong: '香港',
    calCityMacau: '澳门',
    calCityShenzhen: '深圳',
    calCityGuangzhou: '广州',
    calTimeMorning: '早上',
    calTimeAfternoon: '下午',
    calTimeEvening: '晚上',
    calTimeNight: '深夜',
    calCorrect: '✓ 答对了！',
    calWrong: '✗ 答案是',

    // Onboarding
    onboardingWelcome: '皇家花园',
    onboardingTagline: '保持敏锐，保持联系。',
    onboardingGetStarted: '开始 →',
    onboardingSelectLanguage: '选择你的语言',
    onboardingSelectLanguageSub: '之后可以在设置中更改',
    onboardingSelectRegion: '你住在哪里？',
    onboardingSelectRegionSub: '我们会根据你的位置个性化你的体验',
    onboardingVerifyId: '验证你的身份',
    onboardingVerifyIdSub: '你的身份证用于保障你的账户安全',
    onboardingIdNumber: '身份证号码',
    onboardingIdPlaceholder: '输入你的身份证号码',
    onboardingTakeIdPhoto: '拍摄你的身份证',
    onboardingTakeIdPhotoSub: '将身份证放在平坦的表面上',
    onboardingTakeSelfie: '拿着身份证自拍',
    onboardingTakeSelfieSub: '将身份证放在脸旁边',
    onboardingVerifying: '正在验证你的身份...',
    onboardingVerified: '✓ 身份验证成功！',
    onboardingVerifiedSub: '你的账户已经安全',
    onboardingSetupProfile: '设置你的个人资料',
    onboardingSetupProfileSub: '告诉我们一些关于你的信息',
    onboardingYourName: '你的名字',
    onboardingNamePlaceholder: '输入你的名字',
    onboardingChooseAvatar: '选择你的头像',
    onboardingNext: '下一步 →',
    onboardingDone: '进入花园 →',
    onboardingSkip: '暂时跳过',
    onboardingMockPhotoTaken: '📸 照片已拍摄！',
    onboardingIdFormat: '格式',
    onboardingInvalidId: '请输入有效的身份证号码',
};

const pt: Strings = {
    // General
    appName: 'Jardim Imperial',
    loading: 'A carregar...',
    back: '‹ Voltar',
    close: '✕',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    comingSoon: 'Em breve!',
    level: 'Nível',
    seconds: 'seg',
    scoreUnit: 'pts',
    zoneNotFound: 'Zona não encontrada 🤔',

    // Tab bar
    tabMap: 'Mapa',
    tabHome: 'Minha Casa',
    tabGames: 'Jogos',
    tabFriends: 'Amigos',
    tabSettings: 'Definições',

    // Map screen
    mapTitle: '🗺 Mapa de HK',
    mapDailyQuest: '📋',
    mapDailyQuestDesc: 'Missão de hoje: Comprar 5 coisas no mercado!',
    mapZoneMarket: 'Mercado',
    mapZoneCafe: 'Cha Chaan Teng',
    mapZoneEstate: 'Bairro Residencial',
    mapZonePark: 'Parque Vitória',
    mapHarbour: 'Porto de Victoria',
    mapEnterZone: 'Entrar',
    mapActivities: 'O que pode fazer aqui?',

    // Home screen
    homeTitle: '\'s Casa Aconchegante',
    homeLevel: '🏠 Nível',
    homeFurniture: 'Mobília',
    homeLocked: 'Bloqueado',
    homeScore: 'Pontos',
    homeMyRoom: 'O Meu Quarto',
    homeHint: 'Complete jogos e missões para ganhar pontos e desbloquear mais mobília!',
    homeDecorate: '🎨 Decorar a Minha Casa',
    homeTabRoom: '🏠 O Meu Quarto',
    homeTabLeaderboard: '🏆 Classificação',

    // Games screen
    gamesTitle: '🎮 Jogos',
    gamesDailyChallenge: 'Desafio Diário',
    gamesDailyChallengeDesc: 'Complete 3 jogos e ganhe 🪙 100 extra!',
    gamesAllGames: 'Todos os Jogos',
    gamesAllGamesSubtitle: 'Cada jogo treina uma habilidade cerebral diferente',
    gamesUnlockHint: 'Complete mais jogos para desbloquear',
    gamesBrainTip: 'Jogar jogos cerebrais regularmente ajuda a manter a função cognitiva!',
    gamesDuration: 'Cerca de',
    gamesLocked: 'Bloqueado',

    // Game titles
    gameTitleMarketMemory: 'Memória do Mercado',
    gameTitleMahjongMatch: 'Jogo de Mahjong',
    gameTitleDimSumOrder: 'Ordem do Dim Sum',
    gameTitleTramRoute: 'Rota do Elétrico',
    gameTitleNewsWords: 'Palavras das Notícias',
    gameTitleCalendarQuiz: 'Quiz do Calendário',

    // Game descriptions
    gameDescMarketMemory: 'Lembre os itens do mercado e teste a sua memória em 5 rondas!',
    gameDescMahjongMatch: 'Vire as peças e encontre todos os pares de mahjong.',
    gameDescDimSumOrder: 'Lembre a ordem dos pratos de dim sum e selecione-os corretamente!',
    gameDescTramRoute: 'Arranje as paragens do elétrico na ordem correta!',
    gameDescNewsWords: 'Complete o puzzle de palavras cruzadas das notícias de hoje!',
    gameDescCalendarQuiz: 'Responda a perguntas sobre a data e estação de hoje!',

    // Market memory
    marketMemoryTitle: 'Memória do Mercado',
    marketMemorySubtitle: 'Jogo de Memória',
    marketMemoryHowToPlay: 'Como jogar?',
    marketMemoryStep1: '1️⃣  Observe os itens do mercado com atenção',
    marketMemoryStep2: '2️⃣  Lembre-os — tem 5 segundos!',
    marketMemoryStep3: '3️⃣  Selecione os que se lembra',
    marketMemoryStep4: '4️⃣  Mais correto = mais pontos em 5 rondas!',
    marketMemoryRewardPreview: 'Complete para ganhar',
    marketMemoryStart: 'Começar →',
    marketMemoryMemorisePrompt: 'Lembre estes itens!',
    marketMemoryMemoriseSubPrompt: 'Lembre-os — será testado!',
    marketMemoryTip: 'Tente dizer cada item em voz alta para ajudar a lembrar!',
    marketMemoryHidden: 'Itens escondidos!',
    marketMemoryHiddenSub: 'Agora vamos testar a sua memória...',
    marketMemoryQuizPrompt: 'Quais itens se lembra?',
    marketMemoryQuizSubPrompt: 'Toque nos itens que viu',
    marketMemorySubmit: 'Submeter Respostas →',
    marketMemorySelectFirst: 'Selecione itens primeiro...',

    // Mahjong
    mahjongTitle: 'Jogo de Mahjong',
    mahjongSubtitle: 'Jogo de Atenção',
    mahjongHowToPlay: 'Como jogar?',
    mahjongStep1: '1️⃣  Todas as peças são mostradas brevemente',
    mahjongStep2: '2️⃣  As peças viram para baixo',
    mahjongStep3: '3️⃣  Toque em duas peças para as virar',
    mahjongStep4: '4️⃣  Encontre todos os 8 pares — menos jogadas = melhor!',
    mahjongRewardPreview: 'Complete para ganhar',
    mahjongStart: 'Começar →',
    mahjongPreviewPrompt: 'Lembre as peças!',
    mahjongPreviewSub: 'Elas vão virar em breve...',
    mahjongPlayPrompt: 'Encontre todos os pares!',
    mahjongPlaySub: 'Toque em duas peças para as virar',
    mahjongMoves: 'Jogadas',
    mahjongTime: 'Tempo',
    mahjongComplete: '🎊 Todos os pares encontrados!',
    mahjongCompleteSub: 'Muito bem!',
    mahjongBestMoves: 'Melhor possível: 8 jogadas',
    mahjongTimeTaken: 'Tempo gasto',

    // Dim sum
    dimSumTitle: 'Ordem do Dim Sum',
    dimSumSubtitle: 'Jogo de Função Executiva',
    dimSumHowToPlay: 'Como jogar?',
    dimSumStep1: '1️⃣  Lembre a ordem dos pratos mostrados',
    dimSumStep2: '2️⃣  Eles desaparecem após alguns segundos',
    dimSumStep3: '3️⃣  Toque nos pratos na ordem correta',
    dimSumStep4: '4️⃣  Cuidado com pratos extra para confundir!',
    dimSumRewardPreview: 'Complete para ganhar',
    dimSumStart: 'Começar →',
    dimSumRound: 'Ronda',
    dimSumOf: 'de',
    dimSumShowPrompt: 'Lembre a ordem!',
    dimSumShowSub: 'Os pratos vão desaparecer em breve...',
    dimSumQuizPrompt: 'Toque na ordem correta!',
    dimSumQuizSub: 'Toque nos pratos na ordem que viu',
    dimSumCorrectTap: '✓ Correto!',
    dimSumWrongTap: '✗ Errado! Tente novamente',
    dimSumRoundComplete: '🎉 Ronda completa!',
    dimSumNextRound: 'Próxima Ronda →',
    dimSumComplete: '🍡 Todas as rondas completas!',
    dimSumCompleteSub: 'Tem boa memória para dim sum!',
    dimSumTotalScore: 'Pontuação Total',
    dimSumPerfect: 'Perfeito!',
    dimSumAttempts: 'Tentativas',
    dimSumProgress: 'Progresso',

    // Tram route
    tramTitle: 'Rota do Elétrico',
    tramSubtitle: 'Jogo Visuoespacial',
    tramHowToPlay: 'Como jogar?',
    tramStep1: '1️⃣  Observe o mapa do elétrico',
    tramStep2: '2️⃣  Arranje as paragens na ordem correta',
    tramStep3: '3️⃣  Arraste as paragens para reordenar',
    tramStep4: '4️⃣  5 rondas — fica mais difícil!',
    tramRewardPreview: 'Complete para ganhar',
    tramStart: 'Começar →',
    tramRound: 'Ronda',
    tramOf: 'de',
    tramPrompt: 'Arranje as paragens em ordem!',
    tramPromptSub: 'Arraste as paragens — de oeste para este',
    tramConfirm: 'Confirmar Ordem →',
    tramCorrect: '✓ Correto!',
    tramWrong: '✗ Errado — tente novamente!',
    tramShowAnswer: 'Ver Resposta',
    tramNextRound: 'Próxima Ronda →',
    tramComplete: '🚋 Todas as rondas completas!',
    tramCompleteSub: 'Conhece bem as rotas do elétrico!',
    tramTotalScore: 'Pontuação Total',
    tramPerfect: 'Perfeito!',
    tramAnswerWas: 'A ordem correta era:',

    // Reward
    rewardTitle: '🎉 Jogo Completo!',
    rewardCorrect: 'Correto',
    rewardWrong: 'Errado',
    rewardCoins: 'Moedas',
    rewardTotalCoins: 'Total de Moedas',
    rewardMoCATitle: '🧠 Acompanhamento Cognitivo',
    rewardMoCASubtitle: 'Baseado na Avaliação Cognitiva de Montreal (MoCA)',
    rewardThisTime: 'Agora',
    rewardLastTime: 'Antes',
    rewardEncouragementHigh: 'Excelente memória! Continue assim — a prática diária é ótima para a saúde cerebral.',
    rewardEncouragementMid: 'Muito bem! A memória melhora com prática regular.',
    rewardEncouragementLow: 'Não desanime — continue a praticar e vai melhorar!',
    rewardScoreLabelHigh: 'Excelente!',
    rewardScoreLabelMid: 'Muito bem!',
    rewardScoreLabelLow: 'Continue!',
    rewardPlayAgain: '🔄 Jogar Novamente',
    rewardBackToMap: 'Voltar ao Mapa 🗺️',
    rewardGameDone: 'Jogo Completo',

    // Zone
    zoneNeighbours: 'Vizinhos',
    zoneGames: 'Jogos Disponíveis',
    zoneNowAt: 'está agora em',
    zoneNoGames: 'Mais jogos em breve!',

    // Zone descriptions
    zoneMarketDesc: 'O mercado é o coração de Hong Kong — produtos frescos, peixe e carne, com vizinhos amigáveis a fazer compras todos os dias.',
    zoneCafeDesc: 'O cha chaan teng é único de Hong Kong. Uma chávena de chá com leite e um pão com manteiga fazem parte da memória de todos.',
    zoneEstateDesc: 'Os bairros residenciais públicos são o lar de muitos habitantes de Hong Kong, cheios de calor e espírito de vizinhança.',
    zoneParkDesc: 'O Parque Vitória é um dos maiores parques de Hong Kong — um local favorito para exercício matinal, xadrez e encontrar amigos.',
    zoneMarketActivities: ['🥬 Comprar legumes', '🐟 Comprar peixe', '🗣️ Conversar com vizinhos', '🛍️ Encontrar pechinchas'],
    zoneCafeActivities: ['☕ Beber chá com leite', '🍞 Comer torrada', '📰 Ler o jornal', '💬 Conversar'],
    zoneEstateActivities: ['🏠 Visitar vizinhos', '🛗 Apanhar o elevador', '🌿 Jardim', '📮 Ver o correio'],
    zoneParkActivities: ['🌸 Exercício matinal', '🎭 Ver espetáculos', '♟️ Jogar xadrez', '👥 Encontrar amigos'],

    // Friends
    friendsTitle: '👥 Amigos',
    friendsTabFriends: '👥 Amigos',
    friendsTabEvents: '🎉 Eventos',
    friendsOnline: '🟢 Online Agora',
    friendsOffline: '⚪ Recentemente Online',
    friendsAddFriend: '＋ Encontrar Novos Amigos',
    friendsVisit: 'Visitar',
    friendsQuest: 'Missão',
    friendsNowHere: '🟢 Online agora',
    friendsHoursAgo: 'atrás',
    friendsEventsFull: 'Cheio',
    friendsEventsJoin: 'Participar →',
    friendsEventsPeople: 'pessoas',
    friendsEventsUpcoming: 'Próximos Eventos',

    // Settings
    settingsTitle: '⚙️ Definições',
    settingsLanguage: '🌐 Idioma',
    settingsLanguageDesc: 'Português',
    settingsAccount: '👤 Conta',
    settingsAccountDesc: 'Perfil e verificação de identidade',
    settingsAbout: 'ℹ️ Sobre',
    settingsAboutDesc: 'Versão e informações',
    settingsVersion: 'Versão 1.0.0',
    settingsLanguagePickerTitle: 'Escolher Idioma',

    // MoCA domains
    domainMemory: 'Memória',
    domainAttention: 'Atenção',
    domainLanguage: 'Linguagem',
    domainExecutive: 'Executivo',
    domainVisuospatial: 'Visuoespacial',
    domainOrientation: 'Orientação',

    // Shop
    shopUnlock: 'Desbloquear',
    shopUnlockConfirm: 'Gastar moedas para desbloquear este item?',
    shopUnlockSuccess: 'Desbloqueado! 🎉',
    shopNotEnoughCoins: 'Moedas insuficientes!',
    shopCoinsNeeded: 'moedas necessárias',
    shopAlreadyUnlocked: 'Já desbloqueado',

    // Leaderboard
    leaderboardTitle: '🏆 Classificação',
    leaderboardWeekly: 'Classificação Semanal',
    leaderboardRank: 'Classificação',
    leaderboardPlayer: 'Jogador',
    leaderboardCoins: 'Moedas',
    leaderboardYou: 'Você',
    leaderboardEmpty: 'Sem jogadores esta semana',

    // Wager
    wagerTitle: '🎰 Fazer uma Aposta?',
    wagerSubtitle: 'Supere a média da comunidade para ganhar mais!',
    wagerChooseAmount: 'Escolha o valor da aposta:',
    wagerWinCondition: 'Condição de vitória: superar a pontuação média da comunidade',
    wagerPayout: 'Pagamento 2.5x se ganhar',
    wagerSkip: 'Saltar, só jogar',
    wagerConfirm: 'Apostar →',
    wagerWon: '🎉 Aposta Ganha!',
    wagerLost: '😔 Aposta Perdida',
    wagerWonDesc: 'Superou a média da comunidade!',
    wagerLostDesc: 'Melhor sorte da próxima vez!',
    wagerActive: '🎰 Aposta Ativa',
    wagerCommunityAvg: 'Média da comunidade',
    wagerInsufficientCoins: 'Moedas insuficientes para apostar',

    // Onboarding
    onboardingWelcome: 'Jardim Imperial',
    onboardingTagline: 'Mantenha-se ativo, mantenha-se ligado.',
    onboardingGetStarted: 'Começar →',
    onboardingSelectLanguage: 'Escolha o seu idioma',
    onboardingSelectLanguageSub: 'Pode alterar mais tarde nas Definições',
    onboardingSelectRegion: 'Onde vive?',
    onboardingSelectRegionSub: 'Vamos personalizar a sua experiência',
    onboardingVerifyId: 'Verifique a sua identidade',
    onboardingVerifyIdSub: 'O seu cartão de identidade é usado para manter a sua conta segura',
    onboardingIdNumber: 'Número de Identificação',
    onboardingIdPlaceholder: 'Introduza o seu número de identificação',
    onboardingTakeIdPhoto: 'Fotografe o seu cartão de identidade',
    onboardingTakeIdPhotoSub: 'Coloque o cartão numa superfície plana',
    onboardingTakeSelfie: 'Tire uma selfie com o seu cartão',
    onboardingTakeSelfieSub: 'Segure o cartão ao lado do seu rosto',
    onboardingVerifying: 'A verificar a sua identidade...',
    onboardingVerified: '✓ Identidade Verificada!',
    onboardingVerifiedSub: 'A sua conta está agora segura',
    onboardingSetupProfile: 'Configure o seu perfil',
    onboardingSetupProfileSub: 'Conte-nos um pouco sobre si',
    onboardingYourName: 'O seu nome',
    onboardingNamePlaceholder: 'Introduza o seu nome',
    onboardingChooseAvatar: 'Escolha o seu avatar',
    onboardingNext: 'Seguinte →',
    onboardingDone: 'Entrar no Jardim →',
    onboardingSkip: 'Saltar por agora',
    onboardingMockPhotoTaken: '📸 Fotografia tirada!',
    onboardingIdFormat: 'Formato',
    onboardingInvalidId: 'Por favor introduza um número de identificação válido',

    // MoCA analysis tab
    tabMoca: 'MoCA',
    mocaTitle: 'Relatório Cerebral',
    mocaSubtitle: 'Análise estilo MoCA dos seus jogos',
    mocaEstimatedScore: 'Pontuação MoCA estimada',
    mocaAreasMeasured: 'áreas medidas',
    mocaPoints: 'pts',
    mocaGamesPlayed: 'jogos',
    mocaProjectedNote: 'A pontuação é projetada para 30 com base nas áreas que já jogou.',
    mocaBandNormal: 'Boa forma',
    mocaBandNormalDesc: 'Os seus resultados estão na faixa normal. Continue a jogar todos os dias!',
    mocaBandMild: 'Continue a treinar',
    mocaBandMildDesc: 'Algumas áreas precisam de mais prática. Experimente os jogos indicados abaixo.',
    mocaBandLow: 'Vamos verificar',
    mocaBandLowDesc: 'As suas pontuações estão abaixo do habitual. Pode ser útil falar com um médico ou familiar.',
    mocaStrongest: 'Mais forte',
    mocaNeedsPractice: 'Precisa de prática',
    mocaDomainBreakdown: 'Áreas cerebrais',
    mocaNotTested: 'Ainda não testado',
    mocaPlays: 'jogadas',
    mocaPlayToTest: 'Ir para Jogos',
    mocaGameComingSoon: 'Jogo em breve',
    mocaHistoryTitle: 'Histórico de pontuações',
    mocaRecentTitle: 'Jogos recentes',
    mocaEmptyTitle: 'Ainda não jogou nenhum jogo',
    mocaEmptyDesc: 'Jogue alguns jogos cerebrais e o seu relatório aparecerá aqui.',
    mocaDisclaimer: 'Esta é uma estimativa baseada em pontuações de jogos, não um diagnóstico médico. Para um teste MoCA real, consulte um médico.',

    // Calendar quiz
    calTitle: 'Que dia é hoje?',
    calSubtitle: 'Jogo de Orientação',
    calHowToPlay: 'Como jogar?',
    calStep1: '1️⃣  A Sra. Chan vai fazer-lhe 6 perguntas',
    calStep2: '2️⃣  Toque na resposta correta sobre hoje',
    calStep3: '3️⃣  Veja o calendário a preencher-se!',
    calRewardPreview: 'Complete para ganhar',
    calStart: 'Começar →',
    calNpcName: 'Sra. Chan',
    calProgress: 'Pergunta {n} de {total}',
    calQDate: 'Qual é a data de hoje?',
    calQMonth: 'Que mês é este?',
    calQYear: 'Em que ano estamos?',
    calQWeekday: 'Que dia da semana é hoje?',
    calQCity: 'Em que cidade estamos?',
    calQTimeOfDay: 'É de manhã, tarde ou noite?',
    calDateOption: 'dia {n}',
    calYearOption: '{n}',
    calMonthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    calWeekdayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    calCityHongKong: 'Hong Kong',
    calCityMacau: 'Macau',
    calCityShenzhen: 'Shenzhen',
    calCityGuangzhou: 'Guangzhou',
    calTimeMorning: 'Manhã',
    calTimeAfternoon: 'Tarde',
    calTimeEvening: 'Noite',
    calTimeNight: 'Madrugada',
    calCorrect: '✓ Correto!',
    calWrong: '✗ A resposta é',
};

// ─── Strings map + hook ───────────────────────────────────────────────────────

export const strings: Record<Language, Strings> = {
  en,
  'zh-HK': zhHK,
  'zh-CN': zhCN,
  pt
};

// Convenience hook — use this in every screen
// const t = useStrings();  →  t.mapTitle, t.tabMap, etc.
export const useStrings = () => {
  const { useLanguageStore } = require('@/store/language-store');
  const language = useLanguageStore((s: any) => s.language);
  return strings[language as Language] ?? strings['zh-HK'];
};
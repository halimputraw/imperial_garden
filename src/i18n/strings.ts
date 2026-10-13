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
    marketMemoryStep1: '1️⃣  Look at 5 market items',
    marketMemoryStep2: '2️⃣  Remember them (only 5 seconds!)',
    marketMemoryStep3: '3️⃣  Pick the ones you remember',
    marketMemoryStep4: '4️⃣  More correct = more points!',
    marketMemoryRewardPreview: 'Complete to earn',
    marketMemoryStart: 'Start Game →',
    marketMemoryMemorisePrompt: 'Remember these 5 items!',
    marketMemoryMemoriseSubPrompt: 'Remember them — you will be tested!',
    marketMemoryTip: 'Try saying each item out loud to help you remember!',
    marketMemoryHidden: 'Items hidden!',
    marketMemoryHiddenSub: "Now let's test your memory...",
    marketMemoryQuizPrompt: 'Which 5 items do you remember?',
    marketMemoryQuizSubPrompt: 'Tap the items you saw',
    marketMemorySubmit: 'Submit Answers →',
    marketMemorySelectFirst: 'Select items first...',

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
    gameDescMarketMemory: 'Remember 5 items from the wet market and test your memory!',
    gameDescMahjongMatch: 'Find matching mahjong tiles within the time limit!',
    gameDescDimSumOrder: 'Arrange the dim sum in the correct order to train your executive skills!',
    gameDescTramRoute: 'Find the fastest tram route from Sheung Wan to Shau Kei Wan!',
    gameDescNewsWords: 'Complete today\'s news crossword to keep your language skills sharp!',
    gameDescCalendarQuiz: 'Answer questions about today\'s date, day and season!',
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
    marketMemoryStep1: '1️⃣  睇住 5 樣街市貨品',
    marketMemoryStep2: '2️⃣  記低佢哋（得 5 秒！）',
    marketMemoryStep3: '3️⃣  答出你記得嘅貨品',
    marketMemoryStep4: '4️⃣  答啱越多，積分越高！',
    marketMemoryRewardPreview: '完成可獲得',
    marketMemoryStart: '開始遊戲 →',
    marketMemoryMemorisePrompt: '記住呢 5 樣嘢！',
    marketMemoryMemoriseSubPrompt: '記低佢哋，之後要答！',
    marketMemoryTip: '試吓大聲讀出每樣嘢，幫助記憶！',
    marketMemoryHidden: '貨品收起咗！',
    marketMemoryHiddenSub: '而家考考你嘅記憶力⋯',
    marketMemoryQuizPrompt: '你記得邊 5 樣？',
    marketMemoryQuizSubPrompt: '揀出你記得嘅貨品',
    marketMemorySubmit: '提交答案 →',
    marketMemorySelectFirst: '揀選貨品先...',

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
    gameDescMarketMemory: '記住街市入面嘅 5 樣嘢，考驗你嘅記憶力！',
    gameDescMahjongMatch: '係有限時間內搵出相同嘅麻雀牌！',
    gameDescDimSumOrder: '按照正確次序排列點心，訓練你嘅執行能力！',
    gameDescTramRoute: '搵出由上環去筲箕灣嘅最快路線！',
    gameDescNewsWords: '完成今日新聞嘅填字遊戲，保持語言能力！',
    gameDescCalendarQuiz: '回答關於今日日期、星期同節氣嘅問題！',
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
    marketMemoryStep1: '1️⃣  看 5 样菜市场货品',
    marketMemoryStep2: '2️⃣  记住它们（只有 5 秒！）',
    marketMemoryStep3: '3️⃣  选出你记得的货品',
    marketMemoryStep4: '4️⃣  答对越多，积分越高！',
    marketMemoryRewardPreview: '完成可获得',
    marketMemoryStart: '开始游戏 →',
    marketMemoryMemorisePrompt: '记住这 5 样东西！',
    marketMemoryMemoriseSubPrompt: '记住它们，之后要回答！',
    marketMemoryTip: '试着大声读出每样东西，帮助记忆！',
    marketMemoryHidden: '货品已隐藏！',
    marketMemoryHiddenSub: '现在考考你的记忆力⋯',
    marketMemoryQuizPrompt: '你记得哪 5 样？',
    marketMemoryQuizSubPrompt: '选出你看到的货品',
    marketMemorySubmit: '提交答案 →',
    marketMemorySelectFirst: '请先选择货品...',

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
    gameDescMarketMemory: '记住菜市场里的 5 样东西，考验你的记忆力！',
    gameDescMahjongMatch: '在有限时间内找出相同的麻将牌！',
    gameDescDimSumOrder: '按照正确顺序排列点心，训练你的执行能力！',
    gameDescTramRoute: '找出从上环到筲箕湾的最快路线！',
    gameDescNewsWords: '完成今日新闻的填字游戏，保持语言能力！',
    gameDescCalendarQuiz: '回答关于今日日期、星期和节气的问题！',
};

// ─── Strings map + hook ───────────────────────────────────────────────────────

export const strings: Record<Language, Strings> = {
  en,
  'zh-HK': zhHK,
  'zh-CN': zhCN,
};

// Convenience hook — use this in every screen
// const t = useStrings();  →  t.mapTitle, t.tabMap, etc.
export const useStrings = () => {
  const { useLanguageStore } = require('@/store/language-store');
  const language = useLanguageStore((s: any) => s.language);
  return strings[language as Language];
};
export const zh = {
  // 通用
  common: {
    back: '返回',
    home: '首页',
    loading: '加载中...',
    noData: '暂无数据',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    more: '更多',
  },

  // 导航
  nav: {
    home: '首页',
    game: '游戏',
    library: '内容库',
    create: '创作',
  },

  // 首页
  home: {
    title: '文化人生模拟器',
    subtitle: '选择你的文化背景',
    description: '体验不同文化背景下的人生故事，做出选择，书写属于你的传奇',
    selectCulture: '选择文化',
    official: '官方',
    startGame: '开始游戏',
    libraryButton: '内容库',
  },

  // 游戏页面
  game: {
    attributes: '人物属性',
    age: '年龄',
    years: '岁',
    specialAttributes: '特殊属性',
    yourChoice: '你的选择：',
    lifeTrajectory: '人生轨迹',
    eventHistory: '事件历史',
  },

  // 属性名称
  attributes: {
    学识: '学识',
    技艺: '技艺',
    财富: '财富',
    声望: '声望',
    健康: '健康',
    诗才: '诗才',
    仕途: '仕途',
    画技: '画技',
    艺术声望: '艺术声望',
  },

  // 人生阶段
  stages: {
    childhood: '童年期',
    youth: '青少年期',
    adult: '成年期',
    elder: '晚年期',
    childhoodAge: '0-12岁',
    youthAge: '13-20岁',
    adultAge: '21-50岁',
    elderAge: '51岁+',
    childhoodDesc: '文化启蒙阶段',
    youthDesc: '学习成长阶段',
    adultDesc: '主要人生阶段',
    elderDesc: '总结与结局阶段',
  },

  // 结局页面
  ending: {
    title: '人生落幕',
    subtitle: '这就是你在{culture}中的一生',
    playAgain: '再次体验',
    backHome: '返回首页',
    lifeReport: '人生报告卡',
    lifeEvents: '人生事件',
    totalAttributes: '总属性值',
    saved: '你的人生故事已保存，感谢体验',
  },

  // 成就等级
  achievement: {
    legendary: '传奇',
    excellent: '卓越',
    good: '良好',
    ordinary: '普通',
    poor: '困顿',
    legendaryDesc: '名垂青史',
    excellentDesc: '功成名就',
    goodDesc: '小有成就',
    ordinaryDesc: '平凡一生',
    poorDesc: '潦倒终生',
  },

  // 内容库
  library: {
    title: '内容库',
    cultures: '文化模板',
    stats: '统计数据',
    availableCultures: '可用文化模板',
    gameStats: '游戏统计',
    totalPlays: '总游玩次数',
    cultureCount: '文化模板数',
    avgPlayTime: '平均游戏时长',
    recentGames: '最近游戏记录',
    playCount: '次游玩',
    avgEvents: '平均 {count} 个事件',
    game: '游戏',
    events: '个事件',
    times: '次',
  },

  // 页脚
  footer: {
    copyright: '© 2026 文化人生模拟器 · 体验不同文化的人生故事',
  },

  // 错误消息
  error: {
    loadFailed: '加载失败',
    saveFailed: '保存失败',
    networkError: '网络错误',
    unknownError: '未知错误',
  },
};

export type TranslationKeys = typeof zh;

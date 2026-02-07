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
    community: '社区',
    myCreations: '我的创作',
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
    loginRequired: '请先登录',
  },

  // 创作中心
  create: {
    title: '创作中心',
    subtitle: '创作你的文化故事',
    description: '发挥创意，创作新的文化模板、事件和结局，与社区分享你的作品',
    createCulture: '创作文化模板',
    createEvent: '创作事件',
    createEnding: '创作结局',
    cultureTitle: '文化模板',
    eventTitle: '事件',
    endingTitle: '结局',
    myCreations: '我的创作',
    communityCreations: '社区创作',
    pendingReview: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    submit: '提交创作',
    cancel: '取消',
    preview: '预览',
    
    // 表单字段
    cultureName: '文化名称',
    cultureDescription: '文化描述',
    era: '时代',
    region: '地区',
    specialAttributes: '特殊属性',
    attributeName: '属性名称',
    attributeDescription: '属性描述',
    initialValue: '初始值',
    addAttribute: '添加属性',
    removeAttribute: '移除属性',
    
    eventTitleField: '事件标题',
    eventDescriptionField: '事件描述',
    selectCulture: '选择文化',
    selectStage: '选择阶段',
    choices: '选择项',
    choiceText: '选择文本',
    effects: '属性影响',
    requirements: '触发条件',
    addChoice: '添加选择',
    removeChoice: '移除选择',
    
    endingTitleField: '结局标题',
    endingDescriptionField: '结局描述',
    achievementLevel: '成就等级',
    conditions: '触发条件',
    
    // 提示信息
    createSuccess: '创作提交成功，等待审核',
    createFailed: '创作提交失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    reviewSuccess: '审核成功',
    reviewFailed: '审核失败',
    
    // 统计
    totalCreations: '总创作数',
    approvedCount: '已通过',
    pendingCount: '待审核',
    rejectedCount: '已拒绝',
  },

  // 社区
  community: {
    title: '社区创作',
    subtitle: '探索其他创作者的作品',
    filterAll: '全部',
    filterCulture: '文化模板',
    filterEvent: '事件',
    filterEnding: '结局',
    createdBy: '创作者',
    createdAt: '创建时间',
    rating: '评分',
    ratingCount: '评价数',
    noRating: '暂无评价',
    viewDetail: '查看详情',
    rate: '评价',
    yourRating: '你的评分',
    comment: '评论',
    submitRating: '提交评价',
  },

  // 用户
  user: {
    login: '登录',
    logout: '登出',
    username: '用户名',
    enterUsername: '请输入用户名',
    loginAsAdmin: '以管理员身份登录',
    welcome: '欢迎',
    notLoggedIn: '未登录',
    loginPrompt: '登录后可以创作和评价内容',
  },
};

export type TranslationKeys = typeof zh;

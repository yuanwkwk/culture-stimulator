import type { TranslationKeys } from './zh';

export const en: TranslationKeys = {
  // Common
  common: {
    back: 'Back',
    home: 'Home',
    loading: 'Loading...',
    noData: 'No data available',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    more: 'More',
  },

  // Navigation
  nav: {
    home: 'Home',
    game: 'Game',
    library: 'Library',
    create: 'Create',
  },

  // Home page
  home: {
    title: 'Cultural Life Simulator',
    subtitle: 'Choose Your Cultural Background',
    description: 'Experience life stories from different cultural backgrounds, make choices, and write your own legend',
    selectCulture: 'Select Culture',
    official: 'Official',
    startGame: 'Start Game',
    libraryButton: 'Library',
  },

  // Game page
  game: {
    attributes: 'Character Attributes',
    age: 'Age',
    years: 'years old',
    specialAttributes: 'Special Attributes',
    yourChoice: 'Your Choice:',
    lifeTrajectory: 'Life Trajectory',
    eventHistory: 'Event History',
  },

  // Attribute names
  attributes: {
    学识: 'Knowledge',
    技艺: 'Skills',
    财富: 'Wealth',
    声望: 'Reputation',
    健康: 'Health',
    诗才: 'Poetry Talent',
    仕途: 'Official Career',
  },

  // Life stages
  stages: {
    childhood: 'Childhood',
    youth: 'Youth',
    adult: 'Adulthood',
    elder: 'Elder Years',
    childhoodAge: '0-12 years',
    youthAge: '13-20 years',
    adultAge: '21-50 years',
    elderAge: '51+ years',
    childhoodDesc: 'Cultural enlightenment stage',
    youthDesc: 'Learning and growth stage',
    adultDesc: 'Main life stage',
    elderDesc: 'Summary and ending stage',
  },

  // Ending page
  ending: {
    title: 'Life Concluded',
    subtitle: 'This is your life in {culture}',
    playAgain: 'Play Again',
    backHome: 'Back to Home',
    lifeReport: 'Life Report Card',
    lifeEvents: 'Life Events',
    totalAttributes: 'Total Attributes',
    saved: 'Your life story has been saved. Thank you for playing',
  },

  // Achievement levels
  achievement: {
    legendary: 'Legendary',
    excellent: 'Excellent',
    good: 'Good',
    ordinary: 'Ordinary',
    poor: 'Poor',
    legendaryDesc: 'Immortalized in history',
    excellentDesc: 'Successful and renowned',
    goodDesc: 'Minor achievements',
    ordinaryDesc: 'Ordinary life',
    poorDesc: 'Destitute life',
  },

  // Library
  library: {
    title: 'Library',
    cultures: 'Culture Templates',
    stats: 'Statistics',
    availableCultures: 'Available Culture Templates',
    gameStats: 'Game Statistics',
    totalPlays: 'Total Plays',
    cultureCount: 'Culture Templates',
    avgPlayTime: 'Average Play Time',
    recentGames: 'Recent Games',
    playCount: 'plays',
    avgEvents: 'Average {count} events',
    game: 'Game',
    events: 'events',
    times: 'times',
  },

  // Footer
  footer: {
    copyright: '© 2026 Cultural Life Simulator · Experience life stories from different cultures',
  },

  // Error messages
  error: {
    loadFailed: 'Failed to load',
    saveFailed: 'Failed to save',
    networkError: 'Network error',
    unknownError: 'Unknown error',
  },
};

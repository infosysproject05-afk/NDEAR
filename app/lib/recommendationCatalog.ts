export type InterestId =
  | 'technology'
  | 'data'
  | 'cybersecurity'
  | 'business'
  | 'design'
  | 'healthcare'
  | 'education'

export type LearningFormat = 'online' | 'in-person' | 'either'

export type LearnerPreferences = {
  interests: InterestId[]
  location: string
  learningFormat: LearningFormat
}

export type RecommendationFeedback = Record<string, 'useful' | 'not-for-me'>

export type CatalogCourse = {
  id: string
  title: string
  provider: string
  description: string
  url: string
  tags: InterestId[]
  format: LearningFormat
}

export type CatalogCareer = {
  id: string
  title: string
  description: string
  url: string
  searchTitle: string
  tags: InterestId[]
  skills: string[]
  keywords: string[]
}

export const DEFAULT_LEARNER_PREFERENCES: LearnerPreferences = {
  interests: [],
  location: '',
  learningFormat: 'either'
}

export const INTEREST_OPTIONS: { id: InterestId; label: string }[] = [
  { id: 'technology', label: 'Software and technology' },
  { id: 'data', label: 'Data and analytics' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'business', label: 'Business and leadership' },
  { id: 'design', label: 'Design and creative work' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education and teaching' }
]

export const LEARNING_COURSES: CatalogCourse[] = [
  {
    id: 'ms-data-analyst',
    title: 'Training for Data Analysts',
    provider: 'Microsoft Learn',
    description:
      'A guided learning plan for data analysis, reporting, and Power BI.',
    url: 'https://learn.microsoft.com/en-us/training/career-paths/data-analyst',
    tags: ['data', 'business'],
    format: 'online'
  },
  {
    id: 'ms-developer',
    title: 'Training for Developers',
    provider: 'Microsoft Learn',
    description: 'Explore practical learning paths for software development.',
    url: 'https://learn.microsoft.com/en-us/training/career-paths/developer',
    tags: ['technology'],
    format: 'online'
  },
  {
    id: 'ibm-skillsbuild',
    title: 'Explore the IBM SkillsBuild catalog',
    provider: 'IBM SkillsBuild',
    description:
      'Free online learning in areas including AI, cybersecurity, and data.',
    url: 'https://skillsbuild.org/learning-catalog',
    tags: ['technology', 'data', 'cybersecurity', 'business'],
    format: 'online'
  },
  {
    id: 'ms-training-catalog',
    title: 'Browse Microsoft Learn training',
    provider: 'Microsoft Learn',
    description: 'Browse role based learning paths and technical training.',
    url: 'https://learn.microsoft.com/en-us/training/paths/',
    tags: ['technology', 'data', 'cybersecurity', 'business'],
    format: 'online'
  },
  {
    id: 'openlearn-health',
    title: 'Health, Sports & Psychology courses',
    provider: 'OpenLearn · The Open University',
    description:
      'Browse free online courses in health, wellbeing, and psychology.',
    url: 'https://www.open.edu/openlearn/body-mind/free-courses',
    tags: ['healthcare'],
    format: 'online'
  },
  {
    id: 'openlearn-education',
    title: 'Education & Development courses',
    provider: 'OpenLearn · The Open University',
    description:
      'Browse free online courses in education, teaching, and learning.',
    url: 'https://www.open.edu/openlearn/education/free-courses',
    tags: ['education'],
    format: 'online'
  },
  {
    id: 'figma-design-basics',
    title: 'Design fundamentals for high school students',
    provider: 'Figma',
    description:
      'Follow step-by-step design tutorials and practice with sample files.',
    url: 'https://www.figma.com/resource-library/k-12-design-basics/',
    tags: ['design'],
    format: 'online'
  },
  {
    id: 'openlearn-arts',
    title: 'History & the Arts courses',
    provider: 'OpenLearn · The Open University',
    description:
      'Browse free online courses across arts and creative subjects.',
    url: 'https://www.open.edu/openlearn/history-the-arts/free-courses',
    tags: ['design'],
    format: 'online'
  }
]

export const CAREER_CATALOG: CatalogCareer[] = [
  {
    id: 'software-developer',
    title: 'Software developer',
    description: 'Design and build software, apps, and services.',
    url: 'https://www.onetonline.org/link/summary/15-1252.00',
    searchTitle: 'Software developer',
    tags: ['technology'],
    skills: ['Programming', 'Software design', 'Problem solving'],
    keywords: [
      'software',
      'programming',
      'coding',
      'javascript',
      'python',
      'web development',
      'computer science',
      'developer'
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data scientist',
    description:
      'Use statistics, programming, and data to answer complex questions.',
    url: 'https://www.onetonline.org/link/summary/15-2051.00',
    searchTitle: 'Data scientist',
    tags: ['data', 'technology'],
    skills: ['Statistics', 'Data analysis', 'Programming'],
    keywords: [
      'data',
      'analytics',
      'statistics',
      'sql',
      'excel',
      'machine learning',
      'analysis'
    ]
  },
  {
    id: 'security-analyst',
    title: 'Information security analyst',
    description:
      'Protect computer networks and information from security risks.',
    url: 'https://www.onetonline.org/link/summary/15-1212.00',
    searchTitle: 'Information security analyst',
    tags: ['cybersecurity', 'technology'],
    skills: ['Network security', 'Risk analysis', 'Incident response'],
    keywords: [
      'security',
      'cybersecurity',
      'network',
      'privacy',
      'risk',
      'incident'
    ]
  },
  {
    id: 'project-manager',
    title: 'Project management specialist',
    description:
      'Coordinate schedules, resources, and teams to deliver projects.',
    url: 'https://www.onetonline.org/link/summary/13-1082.00',
    searchTitle: 'Project manager',
    tags: ['business', 'technology'],
    skills: ['Planning', 'Leadership', 'Communication'],
    keywords: [
      'business',
      'management',
      'leadership',
      'project',
      'strategy',
      'communication'
    ]
  },
  {
    id: 'digital-designer',
    title: 'Web and digital interface designer',
    description:
      'Design and test websites and digital interfaces for usability.',
    url: 'https://www.onetonline.org/link/summary/15-1255.00',
    searchTitle: 'UX designer',
    tags: ['design', 'technology'],
    skills: ['User research', 'Visual design', 'Prototyping'],
    keywords: ['design', 'user experience', 'ux', 'visual', 'creative', 'art']
  },
  {
    id: 'registered-nurse',
    title: 'Registered nurse',
    description:
      'Assess patient needs and deliver and coordinate nursing care.',
    url: 'https://www.onetonline.org/link/summary/29-1141.00',
    searchTitle: 'Registered nurse',
    tags: ['healthcare'],
    skills: ['Patient care', 'Communication', 'Clinical judgement'],
    keywords: [
      'health',
      'care',
      'nursing',
      'medical',
      'biology',
      'community',
      'wellbeing'
    ]
  },
  {
    id: 'elementary-teacher',
    title: 'Elementary school teacher',
    description:
      'Teach academic and social skills to elementary school students.',
    url: 'https://www.onetonline.org/link/summary/25-2021.00',
    searchTitle: 'Teacher',
    tags: ['education'],
    skills: ['Teaching', 'Communication', 'Lesson planning'],
    keywords: [
      'education',
      'teaching',
      'learning',
      'training',
      'instruction',
      'curriculum'
    ]
  }
]

export function getLiveJobsUrl(title: string, location: string): string {
  const params = new URLSearchParams({ keywords: title })
  if (location.trim()) params.set('location', location.trim())
  return `https://www.linkedin.com/jobs/search/?${params.toString()}`
}

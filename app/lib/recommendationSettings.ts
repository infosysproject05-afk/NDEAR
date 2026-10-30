import AsyncStorage from '@react-native-async-storage/async-storage'
import { AsyncStorageKey } from './asyncStorage'
import {
  DEFAULT_LEARNER_PREFERENCES,
  InterestId,
  LearnerPreferences,
  LearningFormat,
  RecommendationFeedback
} from './recommendationCatalog'

const INTEREST_IDS: InterestId[] = [
  'technology',
  'data',
  'cybersecurity',
  'business',
  'design',
  'healthcare',
  'education'
]

export async function loadLearnerPreferences(): Promise<LearnerPreferences> {
  try {
    const stored = await AsyncStorage.getItem(
      AsyncStorageKey.RecommendationPreferences
    )
    if (!stored) return DEFAULT_LEARNER_PREFERENCES
    const value = JSON.parse(stored) as Partial<LearnerPreferences>
    const interests = Array.isArray(value.interests)
      ? value.interests.filter((id): id is InterestId =>
          INTEREST_IDS.includes(id as InterestId)
        )
      : []
    const learningFormat: LearningFormat =
      value.learningFormat === 'online' || value.learningFormat === 'in-person'
        ? value.learningFormat
        : 'either'
    return {
      interests,
      location: typeof value.location === 'string' ? value.location : '',
      learningFormat
    }
  } catch {
    return DEFAULT_LEARNER_PREFERENCES
  }
}

export async function saveLearnerPreferences(
  preferences: LearnerPreferences
): Promise<void> {
  await AsyncStorage.setItem(
    AsyncStorageKey.RecommendationPreferences,
    JSON.stringify(preferences)
  )
}

export async function loadRecommendationFeedback(): Promise<RecommendationFeedback> {
  try {
    const stored = await AsyncStorage.getItem(
      AsyncStorageKey.RecommendationFeedback
    )
    const parsed: unknown = stored ? JSON.parse(stored) : {}
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) => value === 'useful' || value === 'not-for-me'
      )
    ) as RecommendationFeedback
  } catch {
    return {}
  }
}

export async function saveRecommendationFeedback(
  feedback: RecommendationFeedback
): Promise<void> {
  await AsyncStorage.setItem(
    AsyncStorageKey.RecommendationFeedback,
    JSON.stringify(feedback)
  )
}

export async function restoreDismissedRecommendations(): Promise<number> {
  const feedback = await loadRecommendationFeedback()
  const restoredCount = Object.values(feedback).filter(
    (value) => value === 'not-for-me'
  ).length
  const remainingFeedback = Object.fromEntries(
    Object.entries(feedback).filter(([, value]) => value !== 'not-for-me')
  ) as RecommendationFeedback
  await saveRecommendationFeedback(remainingFeedback)
  return restoredCount
}

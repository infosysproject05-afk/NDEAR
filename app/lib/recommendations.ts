import { CredentialRecordRaw } from '../types/credential'
import { getCredentialName } from './credentialName'
import { getSubject } from './credentialDisplay/shared/utils/credentialSubject'
import { getValidAlignments } from './credentialDisplay/shared/utils/alignment'
import {
  CAREER_CATALOG,
  CatalogCareer,
  getLiveJobsUrl,
  LearnerPreferences,
  LEARNING_COURSES,
  RecommendationFeedback
} from './recommendationCatalog'

export type CourseRecommendation = {
  id: string
  title: string
  provider: string
  description: string
  url: string
  evidence: string
  score: number
  isStartingPoint: boolean
}

export type CareerRecommendation = {
  id: string
  title: string
  description: string
  url: string
  jobsUrl: string
  evidence: string
  matchedSkills: string[]
  missingSkills: string[]
  matchedCredentials: CredentialRecordRaw[]
  score: number
  isStartingPoint: boolean
}

export type ShareRecommendation = {
  id: string
  credential: CredentialRecordRaw
  reason: string
  score: number
  relatedGoal: string
}

export type WalletRecommendations = {
  courses: CourseRecommendation[]
  careers: CareerRecommendation[]
  credentialsToShare: ShareRecommendation[]
}

function getCredentialText(record: CredentialRecordRaw): string {
  const subject = getSubject(record.credential)
  const achievement = subject.hasCredential ?? subject.achievement
  const firstAchievement = Array.isArray(achievement)
    ? achievement[0]
    : achievement
  const alignments = getValidAlignments(firstAchievement?.alignment)
    .map(
      ({ targetName, targetDescription }) =>
        `${targetName} ${targetDescription ?? ''}`
    )
    .join(' ')
  const tags = Array.isArray(firstAchievement?.tag)
    ? firstAchievement.tag.join(' ')
    : ''
  const subjectSkills = [
    subject.skill,
    subject.skills,
    subject.competency,
    subject.competencies,
    subject.fieldOfStudy,
    subject.degree?.name
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => typeof value === 'string')
    .join(' ')
  return `${getCredentialName(record.credential)} ${firstAchievement?.description ?? ''} ${firstAchievement?.fieldOfStudy ?? ''} ${tags} ${alignments} ${subjectSkills}`.toLowerCase()
}

function hasTerm(text: string, term: string): boolean {
  const normalized = term.toLowerCase().trim()
  if (!normalized) return false
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const phrase = escaped.replace(/\s+/g, '\\s+')
  return new RegExp(`(^|[^a-z0-9])${phrase}([^a-z0-9]|$)`, 'i').test(text)
}

function recordSignalCount(
  records: CredentialRecordRaw[],
  terms: string[]
): number {
  return records.reduce((score, record) => {
    const text = getCredentialText(record)
    return (
      score +
      terms.reduce((count, term) => count + (hasTerm(text, term) ? 1 : 0), 0)
    )
  }, 0)
}

function feedbackScore(feedback: RecommendationFeedback, id: string): number {
  return feedback[id] === 'useful' ? 2 : 0
}

export function getWalletRecommendations(
  credentials: CredentialRecordRaw[],
  preferences: LearnerPreferences,
  feedback: RecommendationFeedback
): WalletRecommendations {
  const credentialTexts = credentials.map(getCredentialText)
  const walletText = credentialTexts.join(' ')
  const hasProfile = preferences.interests.length > 0 || credentials.length > 0
  const hasCredentials = credentials.length > 0

  const courses = LEARNING_COURSES.filter(
    (course) =>
      preferences.learningFormat === 'either' ||
      course.format === 'either' ||
      course.format === preferences.learningFormat
  )
    .map((course) => {
      const interestMatches = preferences.interests.filter((interest) =>
        course.tags.includes(interest)
      ).length
      const skillMatches = recordSignalCount(
        credentials,
        course.tags.flatMap((tag) =>
          CAREER_CATALOG.filter((career) => career.tags.includes(tag)).flatMap(
            (career) => career.keywords
          )
        )
      )
      const score =
        interestMatches * 3 +
        skillMatches +
        feedbackScore(feedback, `course:${course.id}`)
      return {
        id: course.id,
        title: course.title,
        provider: course.provider,
        description: course.description,
        url: course.url,
        score,
        isStartingPoint: !hasCredentials,
        evidence:
          interestMatches || skillMatches
            ? [
                interestMatches ? 'matches your interests' : '',
                skillMatches ? 'builds on skills in your credentials' : ''
              ]
                .filter(Boolean)
                .join(' and ')
            : 'A general starting point while you build your wallet.'
      }
    })
    .filter((course) => feedback[`course:${course.id}`] !== 'not-for-me')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const careers = CAREER_CATALOG.map((career) => {
    const matchedCredentials = credentials.filter((record) => {
      const text = getCredentialText(record)
      return career.keywords.some((keyword) => hasTerm(text, keyword))
    })
    const matchedSkills = career.skills.filter((skill) => {
      const skillWords = skill.toLowerCase().split(/\s+/)
      return skillWords.some(
        (word) => word.length > 3 && hasTerm(walletText, word)
      )
    })
    const interestMatches = preferences.interests.filter((interest) =>
      career.tags.includes(interest)
    ).length
    const keywordMatches = recordSignalCount(credentials, career.keywords)
    const score =
      interestMatches * 3 +
      keywordMatches * 2 +
      feedbackScore(feedback, `career:${career.id}`)
    const matchingNames = matchedCredentials
      .slice(0, 2)
      .map((record) => getCredentialName(record.credential))
    return {
      id: career.id,
      title: career.title,
      description: career.description,
      url: career.url,
      jobsUrl: getLiveJobsUrl(career.searchTitle, preferences.location),
      matchedSkills,
      missingSkills: career.skills.filter(
        (skill) => !matchedSkills.includes(skill)
      ),
      matchedCredentials,
      score,
      isStartingPoint: !hasCredentials,
      evidence: matchingNames.length
        ? `Related to ${matchingNames.join(' and ')}`
        : interestMatches
          ? 'Matches an interest you selected.'
          : hasProfile
            ? 'Suggested from the career catalog; compare its skills with your goals.'
            : 'A general career starting point. Add interests to personalize this list.'
    }
  })
    .filter((career) => feedback[`career:${career.id}`] !== 'not-for-me')
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  const careersByTag = new Map(
    CAREER_CATALOG.map((career) => [career.id, career])
  )
  const credentialsToShare = credentials
    .map((credential) => {
      const text = getCredentialText(credential)
      const relatedCareer = CAREER_CATALOG.map((career: CatalogCareer) => ({
        career,
        hits: career.keywords.filter((keyword) => hasTerm(text, keyword)).length
      })).sort((a, b) => b.hits - a.hits)[0]
      const score =
        (relatedCareer?.hits ?? 0) +
        preferences.interests.filter((interest) =>
          careersByTag
            .get(relatedCareer?.career.id ?? '')
            ?.tags.includes(interest)
        ).length
      const id = `share:${String(credential._id)}`
      return {
        id,
        credential,
        score: score + feedbackScore(feedback, id),
        relatedGoal: relatedCareer?.hits ? relatedCareer.career.title : '',
        reason: relatedCareer?.hits
          ? `Could help support an application related to ${relatedCareer.career.title}. Review it before sharing.`
          : 'This is part of your learning record. Review it before deciding whether to share.'
      }
    })
    .filter((item) => feedback[item.id] !== 'not-for-me')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return { courses, careers, credentialsToShare }
}

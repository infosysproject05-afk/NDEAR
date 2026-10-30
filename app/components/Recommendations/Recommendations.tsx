import React, { useCallback, useMemo, useState } from 'react'
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { CredentialRecordRaw } from '../../types/credential'
import { useDynamicStyles } from '../../hooks'
import { getCredentialName } from '../../lib/credentialName'
import { getWalletRecommendations } from '../../lib/recommendations'
import { useShareCredentials } from '../../hooks/useShareCredentials'
import { createDynamicStyleSheet } from '../../lib/dynamicStyles'
import {
  LearnerPreferences,
  RecommendationFeedback,
  DEFAULT_LEARNER_PREFERENCES
} from '../../lib/recommendationCatalog'
import {
  loadLearnerPreferences,
  loadRecommendationFeedback,
  saveRecommendationFeedback
} from '../../lib/recommendationSettings'
import { displayGlobalModal } from '../../lib/globalModal'

type Props = {
  credentials: CredentialRecordRaw[]
  onOpenPreferences: () => void
  onOpenCredential: (credential: CredentialRecordRaw) => void
}
type RecommendationTab = 'courses' | 'careers' | 'share'

const stylesSheet = createDynamicStyleSheet(({ theme }) => ({
  container: { marginTop: 22, marginBottom: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headingBlock: { flex: 1, paddingRight: 8 },
  title: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 21,
    color: theme.color.textPrimary
  },
  intro: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 13,
    color: theme.color.textSecondary,
    marginTop: 4,
    marginBottom: 14
  },
  tuneButton: { padding: 6 },
  tuneText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 12,
    color: theme.color.linkColor
  },
  tabs: { marginBottom: 10 },
  tab: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 7,
    backgroundColor: theme.color.foregroundPrimary
  },
  activeTab: { backgroundColor: theme.color.brightAccent },
  tabText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 12,
    color: theme.color.textSecondary
  },
  activeTabText: { color: theme.color.textPrimaryDark },
  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 9,
    backgroundColor: theme.color.foregroundPrimary
  },
  badge: {
    fontFamily: theme.fontFamily.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    color: theme.color.brightAccent,
    marginBottom: 7
  },
  cardTitle: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 15,
    color: theme.color.textPrimary
  },
  cardBody: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.textSecondary,
    marginTop: 5
  },
  evidence: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 11,
    color: theme.color.brightAccent,
    marginTop: 8
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginBottom: 4,
    paddingVertical: 4
  },
  actionText: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 12,
    color: theme.color.linkColor,
    marginRight: 4
  },
  feedbackRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.color.backgroundPrimary,
    marginTop: 10,
    paddingTop: 8
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    paddingVertical: 4
  },
  feedbackText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 11,
    color: theme.color.textSecondary,
    marginLeft: 4
  },
  feedbackSelected: { color: theme.color.brightAccent },
  empty: {
    borderRadius: 16,
    padding: 15,
    backgroundColor: theme.color.foregroundPrimary
  },
  emptyText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.textSecondary
  }
}))

const TABS: { id: RecommendationTab; label: string }[] = [
  { id: 'courses', label: 'Courses' },
  { id: 'careers', label: 'Career paths' },
  { id: 'share', label: 'Share credentials' }
]

export default function Recommendations({
  credentials,
  onOpenPreferences,
  onOpenCredential
}: Props): React.ReactElement {
  const { styles, theme, mixins } = useDynamicStyles(stylesSheet)
  const [preferences, setPreferences] = useState<LearnerPreferences>(
    DEFAULT_LEARNER_PREFERENCES
  )
  const [feedback, setFeedback] = useState<RecommendationFeedback>({})
  const [activeTab, setActiveTab] = useState<RecommendationTab>('courses')
  const share = useShareCredentials()

  useFocusEffect(
    useCallback(() => {
      let active = true
      Promise.all([
        loadLearnerPreferences(),
        loadRecommendationFeedback()
      ]).then(([loadedPreferences, loadedFeedback]) => {
        if (active) {
          setPreferences(loadedPreferences)
          setFeedback(loadedFeedback)
        }
      })
      return () => {
        active = false
      }
    }, [])
  )

  const recommendations = useMemo(
    () => getWalletRecommendations(credentials, preferences, feedback),
    [credentials, preferences, feedback]
  )

  async function updateFeedback(id: string, value: 'useful' | 'not-for-me') {
    const next = { ...feedback }
    if (next[id] === value) delete next[id]
    else next[id] = value
    setFeedback(next)
    try {
      await saveRecommendationFeedback(next)
    } catch (error) {
      console.warn('Could not save recommendation feedback', error)
    }
  }

  async function confirmShare(credential: CredentialRecordRaw) {
    const name = getCredentialName(credential.credential)
    const issuer = credential.credential.issuer
    const issuerName =
      typeof issuer === 'string' ? issuer : issuer?.name || issuer?.id
    const confirmed = await displayGlobalModal({
      title: 'Review before sharing',
      confirmText: 'Continue to share',
      body: (
        <>
          <Text style={mixins.modalBodyText}>
            You are preparing to share the full credential{' '}
            <Text style={mixins.boldText}>{name}</Text>
            {issuerName ? `, issued by ${issuerName}` : ''}. This can include
            personal information in the credential.
          </Text>
          <Text style={mixins.modalBodyText}>
            Review the credential first if needed. After you continue, choose a
            recipient in the system share sheet. Nothing is sent until you
            complete that step.
          </Text>
        </>
      )
    })
    if (confirmed) await share([credential])
  }

  function renderFeedback(id: string) {
    return (
      <View style={styles.feedbackRow}>
        <FeedbackButton
          label="Useful"
          icon="thumb-up"
          selected={feedback[id] === 'useful'}
          onPress={() => updateFeedback(id, 'useful')}
        />
        <FeedbackButton
          label="Not for me"
          icon="thumb-down"
          selected={feedback[id] === 'not-for-me'}
          onPress={() => updateFeedback(id, 'not-for-me')}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingBlock}>
          <Text style={styles.title}>Picked for your journey</Text>
          <Text style={styles.intro}>
            Suggestions use your interests and credentials. Your choices stay on
            this device.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.tuneButton}
          onPress={onOpenPreferences}
          accessibilityRole="button"
          accessibilityLabel="Tune recommendations"
        >
          <Text style={styles.tuneText}>Tune</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        accessibilityRole="tablist"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, active && styles.activeTab]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {activeTab === 'courses' &&
        (recommendations.courses.length ? (
          recommendations.courses.map((course) => (
            <View key={course.id} style={styles.card}>
              {course.isStartingPoint && (
                <Text style={styles.badge}>STARTING POINT</Text>
              )}
              <Text style={styles.cardTitle}>{course.title}</Text>
              <Text style={styles.cardBody}>{course.description}</Text>
              <Text style={styles.evidence}>
                {course.provider} · {course.evidence}
              </Text>
              <TouchableOpacity
                style={styles.action}
                onPress={() => Linking.openURL(course.url)}
                accessibilityRole="link"
              >
                <Text style={styles.actionText}>Open learning resource</Text>
                <MaterialIcons
                  name="open-in-new"
                  size={16}
                  color={theme.color.linkColor}
                />
              </TouchableOpacity>
              {renderFeedback(`course:${course.id}`)}
            </View>
          ))
        ) : (
          <Empty text="No curated courses match that format yet. Choose online or either in Tune recommendations to see online learning resources." />
        ))}

      {activeTab === 'careers' && (
        <>
          <Text style={styles.cardBody}>
            Matches are inferred from credential text and your interests. They
            do not confirm qualifications; review the linked career profile.
          </Text>
          {recommendations.careers.length ? (
            recommendations.careers.map((career) => (
              <View key={career.id} style={styles.card}>
                {career.isStartingPoint && (
                  <Text style={styles.badge}>STARTING POINT</Text>
                )}
                <Text style={styles.cardTitle}>{career.title}</Text>
                <Text style={styles.cardBody}>{career.description}</Text>
                {!!career.matchedSkills.length && (
                  <Text style={styles.cardBody}>
                    Skills evidenced: {career.matchedSkills.join(', ')}
                  </Text>
                )}
                {!!career.missingSkills.length && (
                  <Text style={styles.cardBody}>
                    Skills to explore: {career.missingSkills.join(', ')}
                  </Text>
                )}
                <Text style={styles.evidence}>{career.evidence}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => Linking.openURL(career.url)}
                    accessibilityRole="link"
                  >
                    <Text style={styles.actionText}>U.S. career profile</Text>
                    <MaterialIcons
                      name="open-in-new"
                      size={16}
                      color={theme.color.linkColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => Linking.openURL(career.jobsUrl)}
                    accessibilityRole="link"
                  >
                    <Text style={styles.actionText}>
                      {preferences.location
                        ? `Search jobs near ${preferences.location}`
                        : 'Search live jobs'}
                    </Text>
                    <MaterialIcons
                      name="open-in-new"
                      size={16}
                      color={theme.color.linkColor}
                    />
                  </TouchableOpacity>
                </View>
                {renderFeedback(`career:${career.id}`)}
              </View>
            ))
          ) : (
            <Empty text="No career suggestions match your current filters. Update your interests to see more." />
          )}
        </>
      )}

      {activeTab === 'share' &&
        (recommendations.credentialsToShare.length ? (
          recommendations.credentialsToShare.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {getCredentialName(item.credential.credential)}
              </Text>
              <Text style={styles.cardBody}>{item.reason}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => onOpenCredential(item.credential)}
                  accessibilityRole="button"
                >
                  <Text style={styles.actionText}>Review credential</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => confirmShare(item.credential)}
                  accessibilityRole="button"
                >
                  <Text style={styles.actionText}>Share after review</Text>
                  <MaterialIcons
                    name="ios-share"
                    size={16}
                    color={theme.color.linkColor}
                  />
                </TouchableOpacity>
              </View>
              {renderFeedback(item.id)}
            </View>
          ))
        ) : (
          <Empty text="Add a credential to get suggestions about what you could share." />
        ))}
    </View>
  )
}

function FeedbackButton({
  label,
  icon,
  selected,
  onPress
}: {
  label: string
  icon: 'thumb-up' | 'thumb-down'
  selected: boolean
  onPress: () => void
}): React.ReactElement {
  const { styles, theme } = useDynamicStyles(stylesSheet)
  return (
    <TouchableOpacity
      style={styles.feedbackButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <MaterialIcons
        name={icon}
        size={15}
        color={selected ? theme.color.brightAccent : theme.color.textSecondary}
      />
      <Text style={[styles.feedbackText, selected && styles.feedbackSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

function Empty({ text }: { text: string }): React.ReactElement {
  const { styles } = useDynamicStyles(stylesSheet)
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  )
}

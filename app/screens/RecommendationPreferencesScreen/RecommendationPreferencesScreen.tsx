import React, { useEffect, useState } from 'react'
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Button } from 'react-native-elements'
import { NavHeader } from '../../components'
import { useDynamicStyles } from '../../hooks'
import {
  DEFAULT_LEARNER_PREFERENCES,
  InterestId,
  LearnerPreferences,
  LearningFormat,
  INTEREST_OPTIONS
} from '../../lib/recommendationCatalog'
import {
  loadLearnerPreferences,
  restoreDismissedRecommendations,
  saveLearnerPreferences
} from '../../lib/recommendationSettings'
import dynamicStyleSheet from './RecommendationPreferencesScreen.styles'
import { RecommendationPreferencesScreenProps } from './RecommendationPreferencesScreen.d'

const FORMATS: { id: LearningFormat; label: string }[] = [
  { id: 'online', label: 'Online' },
  { id: 'in-person', label: 'In person' },
  { id: 'either', label: 'Either' }
]

export default function RecommendationPreferencesScreen({
  navigation
}: RecommendationPreferencesScreenProps): React.ReactElement {
  const { styles, theme } = useDynamicStyles(dynamicStyleSheet)
  const [preferences, setPreferences] = useState<LearnerPreferences>(
    DEFAULT_LEARNER_PREFERENCES
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    loadLearnerPreferences().then((loaded) => {
      if (active) {
        setPreferences(loaded)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  function toggleInterest(id: InterestId) {
    setPreferences((current) => ({
      ...current,
      interests: current.interests.includes(id)
        ? current.interests.filter((item) => item !== id)
        : [...current.interests, id]
    }))
  }

  async function save() {
    setSaving(true)
    try {
      await saveLearnerPreferences(preferences)
      navigation.goBack()
    } catch {
      Alert.alert('Could not save preferences', 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function restoreDismissed() {
    try {
      const count = await restoreDismissedRecommendations()
      Alert.alert(
        count ? 'Suggestions restored' : 'Nothing to restore',
        count
          ? `${count} dismissed suggestion${count === 1 ? '' : 's'} can appear again.`
          : 'You have not dismissed any suggestions.'
      )
    } catch {
      Alert.alert('Could not restore suggestions', 'Please try again.')
    }
  }

  return (
    <View style={styles.container}>
      <NavHeader title="Recommendation goals" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading} accessibilityRole="header">
          What are you interested in?
        </Text>
        <Text style={styles.description}>
          Choose a few areas to personalize course and career suggestions. You
          can change these any time.
        </Text>

        <Text style={styles.sectionTitle}>Your interests</Text>
        <View style={styles.choices}>
          {INTEREST_OPTIONS.map((option) => {
            const selected = preferences.interests.includes(option.id)
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => toggleInterest(option.id)}
                style={[styles.choice, selected && styles.choiceSelected]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <Text
                  style={[
                    styles.choiceText,
                    selected && styles.choiceTextSelected
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={styles.sectionTitle}>Preferred learning format</Text>
        <View style={styles.choices}>
          {FORMATS.map((format) => {
            const selected = preferences.learningFormat === format.id
            return (
              <TouchableOpacity
                key={format.id}
                onPress={() =>
                  setPreferences((current) => ({
                    ...current,
                    learningFormat: format.id
                  }))
                }
                style={[styles.choice, selected && styles.choiceSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <Text
                  style={[
                    styles.choiceText,
                    selected && styles.choiceTextSelected
                  ]}
                >
                  {format.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={styles.sectionTitle}>Location for job searches</Text>
        <TextInput
          value={preferences.location}
          onChangeText={(location) =>
            setPreferences((current) => ({ ...current, location }))
          }
          placeholder="City, region, or country"
          placeholderTextColor={theme.color.inputInactive}
          style={styles.textInput}
          accessibilityLabel="Preferred job location"
          returnKeyType="done"
          editable={!loading}
        />
        <Text style={styles.hint}>
          When you tap Search live jobs, this location is added to a LinkedIn
          job search URL. It stays on this device until you open that search.
        </Text>

        <Text style={styles.privacy}>
          Your interests and location are saved on this device. They are not
          added to or shared with your credentials.
        </Text>
        <Button
          title="Save preferences"
          onPress={save}
          disabled={loading || saving}
          loading={saving}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonTitle}
          accessibilityLabel="Save recommendation preferences"
        />
        <Button
          title="Restore dismissed suggestions"
          type="clear"
          onPress={restoreDismissed}
          titleStyle={{ color: theme.color.linkColor }}
          accessibilityLabel="Restore suggestions marked not for me"
        />
      </ScrollView>
    </View>
  )
}

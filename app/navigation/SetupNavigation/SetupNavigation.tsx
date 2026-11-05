import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  AccessibilityInfo,
  TextInput,
  Platform
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Button, CheckBox } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack'
import { useAppDispatch, useDynamicStyles } from '../../hooks'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import appConfig, { FEATURE_FLAGS } from '../../../app.config'
import {
  initialize,
  pollWalletState,
  selectWalletState
} from '../../store/slices/wallet'
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'
import SafeScreenView from '../../components/SafeScreenView/SafeScreenView'
import AccessibleView from '../../components/AccessibleView/AccessibleView'
import PasswordForm from '../../components/PasswordForm/PasswordForm'
import WalletArtwork from '../../components/WalletArtwork/WalletArtwork'
import { useAccessibilityFocus } from '../../hooks'
import {
  saveStudentProfile,
  syncAndImportStudentCertificates
} from '../../lib/studentCertificates'

import dynamicStyleSheet from './SetupNavigation.styles'
import type {
  StartStepProps,
  CreateStepProps,
  PasswordStepProps,
  ProfileStepProps,
  SetupNavigationParamList,
  ForFadeType
} from './SetupNavigation.d'

import { DetailsScreen } from '../../screens'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

const Stack = createStackNavigator<SetupNavigationParamList>()

const forFade: ForFadeType = ({ current }) => ({
  cardStyle: {
    opacity: current.progress
  }
})

export default function SetupNavigation(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="StartStep" component={StartStep} />
      {FEATURE_FLAGS.passwordProtect && (
        <Stack.Screen name="PasswordStep" component={PasswordStep} />
      )}
      <Stack.Screen name="ProfileStep" component={ProfileStep} />
      <Stack.Screen
        name="CreateStep"
        component={CreateStep}
        options={{ cardStyleInterpolator: forFade }}
      />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
    </Stack.Navigator>
  )
}

function StartStep({ navigation }: StartStepProps) {
  const { styles, mixins } = useDynamicStyles(dynamicStyleSheet)

  return (
    <SafeScreenView style={[styles.container, styles.containerMiddle]}>
      <WalletArtwork />
      <Text style={styles.title} accessibilityRole="header">
        {appConfig.displayName}
      </Text>
      <Text style={styles.paragraph}>
        A place to store all your credentials. They stay on your device until
        you decide to share them.
      </Text>
      <View style={mixins.buttonGroup}>
        <Button
          buttonStyle={[mixins.button, mixins.buttonPrimary]}
          containerStyle={mixins.buttonContainer}
          titleStyle={mixins.buttonTitle}
          title="Quick Setup"
          onPress={() => {
            if (FEATURE_FLAGS.passwordProtect) {
              navigation.navigate('PasswordStep')
            } else {
              const generatedPassword = uuidv4()
              navigation.navigate('ProfileStep', {
                password: generatedPassword,
                enableBiometrics: false
              })
            }
          }}
        />
      </View>
    </SafeScreenView>
  )
}

function PasswordStep({ navigation }: PasswordStepProps) {
  const { theme, mixins, styles } = useDynamicStyles(dynamicStyleSheet)

  const [enableBiometrics, setEnableBiometrics] = useState(false)
  const { isBiometricsSupported } = useSelector(selectWalletState)
  const [password, setPassword] = useState<string>()

  function _goToNextStep() {
    if (password !== undefined) {
      navigation.navigate('ProfileStep', { password, enableBiometrics })
    }
  }

  function _onPressBiometrics() {
    setEnableBiometrics(!enableBiometrics)
  }

  return (
    <SafeScreenView style={styles.container}>
      <AccessibleView style={styles.stepContainer} label="Step 1 of 3">
        <Text style={[styles.stepText, styles.stepTextActive]}>Step 1</Text>
        <View style={styles.stepDivider} />
        <Text style={styles.stepText}>2</Text>
        <View style={styles.stepDivider} />
        <Text style={styles.stepText}>3</Text>
      </AccessibleView>
      <Text style={styles.header} accessibilityRole="header">
        Password
      </Text>
      <Text style={styles.paragraphRegular}>
        Setup a password to secure your wallet. You will not be able to recover
        a lost password.
      </Text>
      <View style={styles.body}>
        <PasswordForm
          onChangePassword={setPassword}
          style={styles.inputGroup}
          focusOnMount
        />
        {isBiometricsSupported && (
          <>
            <View style={styles.inputSeparator} />
            <TouchableWithoutFeedback onPress={_onPressBiometrics}>
              <View style={styles.biometricsButton}>
                <CheckBox
                  checked={enableBiometrics}
                  checkedColor={theme.color.buttonPrimary}
                  containerStyle={[
                    mixins.checkboxContainer,
                    styles.checkboxContainer
                  ]}
                />
                <Text style={styles.biometricsButtonText}>
                  Use biometrics to unlock
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </>
        )}
      </View>
      <View style={mixins.buttonGroup}>
        <Button
          buttonStyle={[mixins.button, styles.buttonClear]}
          containerStyle={styles.buttonClearContainer}
          titleStyle={[mixins.buttonTitle, styles.buttonClearTitle]}
          title="Cancel"
          onPress={() => navigation.navigate('StartStep')}
        />
        <View style={mixins.buttonSeparator} />
        <Button
          buttonStyle={[mixins.button, mixins.buttonPrimary]}
          containerStyle={mixins.buttonContainer}
          titleStyle={mixins.buttonTitle}
          title="Next"
          onPress={_goToNextStep}
          disabled={!password}
          disabledStyle={mixins.buttonDisabled}
          disabledTitleStyle={mixins.buttonTitle}
          testID="next-button"
          iconRight
          icon={
            <MaterialIcons
              style={styles.arrowIcon}
              name="arrow-forward"
              color={theme.color.backgroundSecondary}
              size={theme.iconSize}
            />
          }
        />
      </View>
    </SafeScreenView>
  )
}

function ProfileStep({ navigation, route }: ProfileStepProps) {
  const { theme, mixins, styles } = useDynamicStyles(dynamicStyleSheet)

  const { password, enableBiometrics } = route.params
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [dobError, setDobError] = useState('')

  const isValid =
    fullName.trim().length >= 2 && /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)

  function _validateDob(value: string) {
    setDateOfBirth(value)
    if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setDobError('Use format YYYY-MM-DD')
    } else {
      setDobError('')
    }
  }

  function _goToCreateStep() {
    if (!isValid) return
    navigation.navigate('CreateStep', {
      password,
      enableBiometrics,
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirth.trim()
    })
  }

  return (
    <SafeScreenView style={styles.container}>
      <AccessibleView style={styles.stepContainer} label="Step 2 of 3">
        <Text style={styles.stepText}>1</Text>
        <View style={styles.stepDivider} />
        <Text style={[styles.stepText, styles.stepTextActive]}>Step 2</Text>
        <View style={styles.stepDivider} />
        <Text style={styles.stepText}>3</Text>
      </AccessibleView>
      <Text style={styles.header} accessibilityRole="header">
        Your Profile
      </Text>
      <Text style={styles.paragraphRegular}>
        Enter your details so we can automatically find and sync your
        certificates from educational institutions.
      </Text>
      <View style={[styles.body, { paddingTop: 20 }]}>
        {/* Full Name */}
        <View style={profileInputStyles}>
          <Text style={profileLabelStyle(theme)}>Full Name</Text>
          <TextInput
            style={profileTextInputStyle(theme)}
            placeholder="e.g. Priya Sharma"
            placeholderTextColor={theme.color.textSecondary}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            accessibilityLabel="Full name"
          />
        </View>

        <View style={styles.inputSeparator} />

        {/* Date of Birth */}
        <View style={profileInputStyles}>
          <Text style={profileLabelStyle(theme)}>Date of Birth</Text>
          <TextInput
            style={profileTextInputStyle(theme, !!dobError)}
            placeholder="YYYY-MM-DD  (e.g. 2004-08-15)"
            placeholderTextColor={theme.color.textSecondary}
            value={dateOfBirth}
            onChangeText={_validateDob}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={10}
            accessibilityLabel="Date of birth"
          />
          {dobError ? (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {dobError}
            </Text>
          ) : null}
          <Text
            style={{
              color: theme.color.textSecondary,
              fontSize: 12,
              marginTop: 6
            }}
          >
            Your DOB is used only to auto-fetch your credentials. It is stored
            securely on this device.
          </Text>
        </View>
      </View>

      <View style={mixins.buttonGroup}>
        <Button
          buttonStyle={[mixins.button, styles.buttonClear]}
          containerStyle={styles.buttonClearContainer}
          titleStyle={[mixins.buttonTitle, styles.buttonClearTitle]}
          title="Back"
          onPress={() => navigation.goBack()}
        />
        <View style={mixins.buttonSeparator} />
        <Button
          buttonStyle={[mixins.button, mixins.buttonPrimary]}
          containerStyle={mixins.buttonContainer}
          titleStyle={mixins.buttonTitle}
          title="Next"
          onPress={_goToCreateStep}
          disabled={!isValid}
          disabledStyle={mixins.buttonDisabled}
          disabledTitleStyle={mixins.buttonTitle}
          testID="profile-next-button"
          iconRight
          icon={
            <MaterialIcons
              style={styles.arrowIcon}
              name="arrow-forward"
              color={theme.color.backgroundSecondary}
              size={theme.iconSize}
            />
          }
        />
      </View>
    </SafeScreenView>
  )
}

// Inline style helpers for profile inputs (avoids adding to stylesheet)
const profileInputStyles = {
  width: '100%' as const,
  paddingHorizontal: 4
}

function profileLabelStyle(theme: any) {
  return {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
    marginBottom: 6
  }
}

function profileTextInputStyle(theme: any, hasError = false) {
  return {
    borderWidth: 1,
    borderColor: hasError ? 'red' : theme.color.iconInactive,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.color.foregroundPrimary,
    color: theme.color.textPrimary,
    fontSize: theme.fontSize.regular,
    fontFamily: theme.fontFamily.regular,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    width: '100%' as const
  }
}

function CreateStep({ route }: CreateStepProps) {
  const { styles, mixins } = useDynamicStyles(dynamicStyleSheet)

  const { password, enableBiometrics, fullName, dateOfBirth } = route.params
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState('')
  const [titleRef, focusTitle] = useAccessibilityFocus<Text>()

  async function _initializeWallet() {
    // 1. Save student profile to local storage
    await saveStudentProfile({ fullName, dateOfBirth })

    // 2. Initialize wallet (create encrypted database)
    await dispatch(initialize({ passphrase: password, enableBiometrics }))

    // 3. Auto-fetch certificates in the background
    setSyncStatus('Syncing your certificates…')
    try {
      const imported = await syncAndImportStudentCertificates(
        fullName,
        dateOfBirth
      )
      if (imported > 0) {
        setSyncStatus(`✓ Added ${imported} certificate(s) to your wallet!`)
      } else {
        setSyncStatus('No new certificates found yet.')
      }
    } catch {
      setSyncStatus(
        'Could not sync certificates. You can retry from the home screen.'
      )
    }

    await dispatch(pollWalletState())
  }

  useEffect(() => {
    focusTitle()
    const t = setTimeout(() => {
      setLoading(false)
      AccessibilityInfo.announceForAccessibility('Finished creating wallet')
    }, 2000)

    return () => clearTimeout(t)
  }, [])

  return (
    <SafeScreenView style={styles.container}>
      <AccessibleView style={styles.stepContainer} label="Step 3 of 3">
        <Text style={styles.stepText}>1</Text>
        <View style={styles.stepDivider} />
        <Text style={styles.stepText}>2</Text>
        <View style={styles.stepDivider} />
        <Text style={[styles.stepText, styles.stepTextActive]}>Step 3</Text>
      </AccessibleView>
      <Text style={styles.header} ref={titleRef} accessibilityRole="header">
        Creating Wallet
      </Text>
      <Text style={styles.paragraphRegular}>This will only take a moment.</Text>
      {syncStatus ? (
        <Text
          style={[
            styles.paragraphRegular,
            { marginTop: 12, fontStyle: 'italic' }
          ]}
        >
          {syncStatus}
        </Text>
      ) : null}
      <View style={styles.loadingContainer}>
        <LoadingIndicator loading={loading} />
      </View>
      <View style={mixins.buttonGroup}>
        <Button
          buttonStyle={[mixins.button, mixins.buttonPrimary]}
          containerStyle={mixins.buttonContainer}
          titleStyle={mixins.buttonTitle}
          title="Take Me To My Wallet"
          onPress={_initializeWallet}
          disabled={loading}
          disabledStyle={mixins.buttonDisabled}
          disabledTitleStyle={mixins.buttonTitle}
        />
      </View>
    </SafeScreenView>
  )
}

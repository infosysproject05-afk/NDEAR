import React, { useState } from 'react'
import { ScrollView, AccessibilityInfo, Switch, View, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { FEATURE_FLAGS, WAS } from '../../../app.config'
import ScreenIntro from '../../components/ScreenIntro/ScreenIntro'

import dynamicStyleSheet from './SettingsNavigation.styles'
import { NavHeader, ConfirmModal, BackupItemModal } from '../../components'
import {
  lock,
  reset,
  selectWalletState,
  toggleBiometrics
} from '../../store/slices/wallet'
import {
  SettingsItemProps,
  SettingsProps,
  SettingsNavigationParamList
} from './SettingsNavigation.d'
import {
  AddExistingProfileScreen,
  DetailsScreen,
  DeveloperScreen,
  ManageProfilesScreen,
  RestoreWalletScreen,
  CredentialScreen,
  PublicLinkScreen
} from '../../screens'
import ProfileCredentialScreen from '../../screens/ProfileCredentialScreen'
import {
  useAppDispatch,
  useDynamicStyles,
  useResetNavigationOnBlur
} from '../../hooks'
import { SettingsNavigationProps } from '../'
import { exportWallet } from '../../lib/export'
import { registerWallet } from '../../lib/registerWallet'
import WASScreen from '../../screens/WAS/WasScreen'
import WasConnect from '../../screens/WAS/WasConnect'

const Stack = createStackNavigator<SettingsNavigationParamList>()

function SettingsItem({
  title,
  onPress,
  rightComponent,
  disabled,
  testID
}: SettingsItemProps): React.ReactElement {
  const { styles, theme } = useDynamicStyles(dynamicStyleSheet)
  const _rightComponent = rightComponent || (
    <ListItem.Chevron
      hasTVPreferredFocus={undefined}
      color={theme.color.textSecondary}
    />
  )

  return (
    <TouchableOpacity
      style={[
        styles.listItemContainer,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 60
        },
        disabled && styles.listItemContainerDisabled
      ]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessible={true}
      accessibilityLabel={title}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.listItemTitle}>{title}</Text>
      </View>
      {_rightComponent}
    </TouchableOpacity>
  )
}

function Settings({ navigation }: SettingsProps): React.ReactElement {
  const { styles, theme } = useDynamicStyles(dynamicStyleSheet)

  const dispatch = useAppDispatch()
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [backupModalOpen, setBackupModalOpen] = useState(false)
  const { isBiometricsSupported } = useSelector(selectWalletState)
  const { isBiometricsEnabled: initialBiometryValue } =
    useSelector(selectWalletState)
  const [isBiometricsEnabled, setIsBiometricsEnabled] =
    useState(initialBiometryValue)

  async function resetWallet() {
    dispatch(reset())
  }

  function lockWallet() {
    AccessibilityInfo.announceForAccessibility('Locked Wallet')
    dispatch(lock())
  }

  async function onToggleBiometrics() {
    const initialState = isBiometricsEnabled
    setIsBiometricsEnabled(!initialState)

    try {
      await dispatch(toggleBiometrics())
    } catch (err) {
      setIsBiometricsEnabled(initialState)
      console.error('Could not toggle biometrics', err)
    }
  }

  const biometricSwitch = (
    <Switch
      style={styles.switch}
      thumbColor={
        isBiometricsEnabled
          ? theme.color.backgroundSecondary
          : theme.color.backgroundPrimary
      }
      trackColor={{
        true: theme.color.switchActive,
        false: theme.color.iconInactive
      }}
      ios_backgroundColor={theme.color.iconInactive}
      value={isBiometricsEnabled}
      onValueChange={onToggleBiometrics}
      disabled={!isBiometricsSupported}
    />
  )

  return (
    <>
      <NavHeader title="Settings" testID="Settings" />
      <ScrollView contentContainerStyle={styles.settingsContainer}>
        <ScreenIntro
          eyebrow="MAKE IT YOURS"
          title="Your wallet. Your way."
          description="Manage your profiles, security, and backups in one place."
          icon="tune"
        />
        <SettingsItem
          key="biometrics"
          title="Use biometrics to unlock"
          onPress={onToggleBiometrics}
          rightComponent={biometricSwitch}
          disabled={!isBiometricsSupported}
        />
        <SettingsItem
          key="profiles"
          title="Manage profiles"
          onPress={() => navigation.navigate('ManageProfilesScreen')}
          testID="manage-profiles-button"
        />
        <SettingsItem
          key="register"
          title="Register wallet"
          onPress={registerWallet}
        />
        <SettingsItem
          key="restore"
          title="Restore wallet"
          onPress={() => navigation.navigate('RestoreWalletScreen')}
        />
        <SettingsItem
          key="backup"
          title="Backup wallet"
          onPress={() => setBackupModalOpen(true)}
        />
        <SettingsItem
          key="reset"
          title="Reset wallet"
          onPress={() => setResetModalOpen(true)}
        />
        {FEATURE_FLAGS.passwordProtect && (
          <SettingsItem
            key="signout"
            title="Sign out"
            onPress={lockWallet}
            testID="signout-button"
          />
        )}
      </ScrollView>
      <ConfirmModal
        open={resetModalOpen}
        onRequestClose={() => setResetModalOpen(false)}
        onConfirm={resetWallet}
        confirmText="Yes"
        title="Are you sure you would like to reset your wallet?"
      />
      <BackupItemModal
        open={backupModalOpen}
        onRequestClose={() => setBackupModalOpen(false)}
        onBackup={exportWallet}
        backupItemName="Wallet"
        backupModalText="This will backup your wallet contents into a file for you to download."
      />
    </>
  )
}

export default function SettingsNavigation({
  navigation
}: SettingsNavigationProps): React.ReactElement {
  useResetNavigationOnBlur(navigation)

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Settings"
    >
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="ManageProfilesScreen"
        component={ManageProfilesScreen}
      />
      <Stack.Screen
        name="AddExistingProfileScreen"
        component={AddExistingProfileScreen}
      />
      <Stack.Screen
        name="ProfileCredentialScreen"
        component={ProfileCredentialScreen}
      />
      <Stack.Screen name="CredentialScreen" component={CredentialScreen} />
      <Stack.Screen name="PublicLinkScreen" component={PublicLinkScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen
        name="RestoreWalletScreen"
        component={RestoreWalletScreen}
      />
      <Stack.Screen name="DeveloperScreen" component={DeveloperScreen} />
      {WAS.enabled && (
        <>
          <Stack.Screen name="WASScreen" component={WASScreen} />
          <Stack.Screen name="WasConnect" component={WasConnect} />
        </>
      )}
    </Stack.Navigator>
  )
}

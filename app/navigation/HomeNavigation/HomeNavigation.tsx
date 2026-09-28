import React, { useEffect, useRef } from 'react'
import { Animated, Platform } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'

import dynamicStyleSheet from './HomeNavigation.styles'
import CredentialNavigation from '../CredentialNavigation/CredentialNavigation'
import ShareNavigation from '../ShareNavigation/ShareNavigation'
import SettingsNavigation from '../SettingsNavigation/SettingsNavigation'
import type { HomeNavigationParamList, TabIconProps } from './HomeNavigation.d'
import AddNavigation from '../AddNavigation/AddNavigation'
import { useDynamicStyles } from '../../hooks'
import { useReducedMotion } from '../../components/Motion/Motion'

const Tab = createBottomTabNavigator<HomeNavigationParamList>()

const labelSuffix = Platform.OS === 'ios' ? ', tab' : ''

export default function HomeNavigation(): React.ReactElement {
  const { styles, theme } = useDynamicStyles(dynamicStyleSheet)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        unmountOnBlur: true,
        tabBarStyle: styles.barStyle,
        tabBarActiveTintColor: theme.color.brightAccent,
        tabBarInactiveTintColor: theme.color.iconInactive
      }}
    >
      <Tab.Screen
        name="CredentialNavigation"
        component={CredentialNavigation}
        options={{
          title: 'My Wallet',
          tabBarIcon: HomeTabIcon,
          tabBarAccessibilityLabel: `My Wallet, (1 of 4)${labelSuffix}`
        }}
      />
      <Tab.Screen
        name="ShareNavigation"
        component={ShareNavigation}
        options={{
          title: 'Share',
          tabBarIcon: ShareTabIcon,
          tabBarAccessibilityLabel: `Share, (2 of 4)${labelSuffix}`
        }}
      />
      <Tab.Screen
        name="AddNavigation"
        component={AddNavigation}
        options={{
          title: 'Add',
          tabBarIcon: AddTabIcon,
          tabBarAccessibilityLabel: `Add, (3 of 4)${labelSuffix}`
        }}
      />
      <Tab.Screen
        name="SettingsNavigation"
        component={SettingsNavigation}
        options={{
          title: 'Settings',
          tabBarIcon: SettingsTabIcon,
          tabBarAccessibilityLabel: `Settings, (4 of 4)${labelSuffix}`,
          tabBarTestID: 'settings-tab'
        }}
      />
    </Tab.Navigator>
  )
}

function TabGlyph({
  color,
  focused = false,
  name,
  testID
}: TabIconProps & {
  focused?: boolean
  name: React.ComponentProps<typeof MaterialIcons>['name']
  testID?: string
}) {
  const { theme } = useDynamicStyles()
  const reduced = useReducedMotion()
  const scale = useRef(new Animated.Value(1)).current
  useEffect(() => {
    if (reduced) {
      scale.setValue(1)
      return
    }
    const animation = Animated.spring(scale, {
      toValue: focused ? 1.08 : 1,
      speed: 22,
      bounciness: 5,
      useNativeDriver: true
    })
    animation.start()
    return () => animation.stop()
  }, [focused, reduced, scale])
  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        backgroundColor: focused ? theme.color.highlightAndroid : 'transparent',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 3
      }}
    >
      <MaterialIcons name={name} color={color} size={22} testID={testID} />
    </Animated.View>
  )
}

const HomeTabIcon = (props: TabIconProps) => (
  <TabGlyph {...props} name="account-balance-wallet" />
)
const ShareTabIcon = (props: TabIconProps) => (
  <TabGlyph {...props} name="ios-share" />
)
const AddTabIcon = (props: TabIconProps) => (
  <TabGlyph {...props} name="add-circle-outline" />
)
const SettingsTabIcon = (props: TabIconProps) => (
  <TabGlyph {...props} name="tune" testID="settings-tab-icon" />
)

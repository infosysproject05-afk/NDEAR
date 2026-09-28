import React from 'react'
import { Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useDynamicStyles } from '../../hooks'
import { createDynamicStyleSheet } from '../../lib/dynamicStyles'
import Motion from '../Motion/Motion'

type Props = {
  eyebrow: string
  title: string
  description: string
  icon: React.ComponentProps<typeof MaterialIcons>['name']
}

export default function ScreenIntro({
  eyebrow,
  title,
  description,
  icon
}: Props) {
  const { styles, theme } = useDynamicStyles(sheet)
  return (
    <Motion style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <View
          style={styles.icon}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <MaterialIcons
            name={icon}
            size={24}
            color={theme.color.brightAccent}
          />
        </View>
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </Motion>
  )
}

const sheet = createDynamicStyleSheet(({ theme, mixins }) => ({
  container: { marginBottom: 24, paddingTop: 8 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  eyebrow: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2,
    color: theme.color.brightAccent,
    flex: 1
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: theme.color.highlightAndroid,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.8,
    color: theme.color.textPrimary,
    marginBottom: 10
  },
  description: { ...mixins.paragraphText, fontSize: 15, lineHeight: 23 }
}))

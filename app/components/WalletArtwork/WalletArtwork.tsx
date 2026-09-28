import React from 'react'
import { Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Motion from '../Motion/Motion'
import { useDynamicStyles } from '../../hooks'
import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default function WalletArtwork() {
  const { styles } = useDynamicStyles(sheet)
  return (
    <Motion
      style={styles.scene}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.halo} />
      <View style={styles.back} />
      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="school" size={26} color="#DDD6FE" />
          <Text style={styles.label}>LEARNER WALLET</Text>
        </View>
        <View>
          <Text style={styles.title}>Your next chapter.</Text>
          <Text style={styles.subtitle}>Always with you.</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.line} />
          <MaterialIcons name="auto-awesome" size={24} color="#C4B5FD" />
        </View>
      </View>
      <View style={styles.badge}>
        <MaterialIcons
          name="account-balance-wallet"
          size={24}
          color="#6D4AFF"
        />
      </View>
    </Motion>
  )
}

const sheet = createDynamicStyleSheet(({ theme }) => ({
  scene: {
    height: 230,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  halo: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: theme.color.highlightAndroid
  },
  back: {
    position: 'absolute',
    width: 246,
    height: 152,
    borderRadius: 24,
    backgroundColor: '#B8A4FA',
    transform: [{ rotate: '-10deg' }, { translateY: -9 }]
  },
  card: {
    width: 252,
    height: 160,
    borderRadius: 24,
    backgroundColor: '#30235E',
    padding: 22,
    justifyContent: 'space-between',
    transform: [{ rotate: '3deg' }],
    shadowColor: '#190C45',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#E9E2FF'
  },
  title: { fontFamily: theme.fontFamily.bold, fontSize: 20, color: '#FFFFFF' },
  subtitle: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 13,
    color: '#D5CBEF',
    marginTop: 4
  },
  line: { width: 62, height: 5, borderRadius: 4, backgroundColor: '#8F77C9' },
  badge: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }]
  }
}))

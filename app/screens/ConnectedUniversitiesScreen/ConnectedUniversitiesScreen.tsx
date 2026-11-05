import React from 'react'
import { Linking, ScrollView, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { NavHeader } from '../../components'
import { useDynamicStyles } from '../../hooks'
import dynamicStyleSheet from './ConnectedUniversitiesScreen.styles'
import { ConnectedUniversitiesScreenProps } from './ConnectedUniversitiesScreen.d'

const ANITS_URL = 'https://certificate-qc86.vercel.app/'

export default function ConnectedUniversitiesScreen({
  navigation
}: ConnectedUniversitiesScreenProps): React.ReactElement {
  const { styles } = useDynamicStyles(dynamicStyleSheet)

  return (
    <>
      <NavHeader
        title="Connected Universities"
        goBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.intro}>
          Universities connected to your credential wallet appear here.
        </Text>
        <View style={styles.universityCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="school" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.nameBlock}>
              <Text style={styles.label}>CONNECTED UNIVERSITY</Text>
              <Text style={styles.name}>ANITS</Text>
            </View>
            <MaterialIcons name="check-circle" size={22} color="#8EE6C4" />
          </View>
          <Text style={styles.websiteLabel}>University website</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(ANITS_URL)}
            accessibilityRole="link"
            accessibilityLabel="Open ANITS university website"
          >
            {ANITS_URL}
          </Text>
        </View>
      </ScrollView>
    </>
  )
}

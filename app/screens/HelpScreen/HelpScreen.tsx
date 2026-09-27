import React from 'react'
import { ScrollView, Image, Text } from 'react-native'

import appConfig from '../../../app.config'
import walletImage from '../../assets/wallet.png'
import dynamicStyleSheet from './HelpScreen.styles'
import { NavHeader } from '../../components'
import { useDynamicStyles } from '../../hooks'
import { HelpProps } from './HelpScreen.d'

export default function HelpScreen({
  navigation
}: HelpProps): React.ReactElement {
  const { styles } = useDynamicStyles(dynamicStyleSheet)

  return (
    <>
      <NavHeader goBack={() => navigation.navigate('Settings')} title="Help" />
      <ScrollView contentContainerStyle={styles.bodyContainerCenter}>
        <Image
          style={styles.image}
          source={walletImage}
          accessible
          accessibilityLabel={`${appConfig.displayName} Logo`}
        />
        <Text style={styles.aboutTitleBolded}>{appConfig.displayName}</Text>
        <Text style={styles.paragraphCenter}>
          Learner Credential Wallet is a cross-platform mobile application for
          storing, verifying, and sharing digital learner credentials.
        </Text>
      </ScrollView>
    </>
  )
}

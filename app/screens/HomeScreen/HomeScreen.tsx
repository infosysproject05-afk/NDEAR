import React, { useState } from 'react'
import {
  Text,
  View,
  FlatList,
  ScrollView,
  AccessibilityInfo,
  Linking
} from 'react-native'
import { Button } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler'

import { CredentialItem, NavHeader, ConfirmModal } from '../../components'
import { navigationRef } from '../../navigation/navigationRef'
import { LinkConfig } from '../../../app.config'

import WalletArtwork from '../../components/WalletArtwork/WalletArtwork'
import Motion from '../../components/Motion/Motion'

import dynamicStyleSheet from './HomeScreen.styles'
import { HomeScreenProps, RenderItemProps } from './HomeScreen.d'
import { CredentialRecordRaw } from '../../model'
import { useAppDispatch, useDynamicStyles } from '../../hooks'
import { useShareCredentials } from '../../hooks/useShareCredentials'
import {
  deleteCredential,
  selectRawCredentialRecords
} from '../../store/slices/credential'
import { getCredentialName } from '../../lib/credentialName'

type AddMethod = {
  icon: React.ComponentProps<typeof MaterialIcons>['name']
  title: string
  hint: string
}

/* Mirrors the routes available on the Add screen, so the empty state teaches
 * the same three entry points the user will find there.
 */
const ADD_METHODS: AddMethod[] = [
  {
    icon: 'qr-code-scanner',
    title: 'Scan a QR code',
    hint: 'Point your camera at a code from an issuer to receive a credential.'
  },
  {
    icon: 'link',
    title: 'Open an issuer link',
    hint: 'Follow a link from a school or employer, then approve the request.'
  },
  {
    icon: 'file-upload',
    title: 'Import from a file',
    hint: 'Restore a JSON backup or add a credential you already hold.'
  }
]

export default function HomeScreen({
  navigation
}: HomeScreenProps): React.ReactElement {
  const { styles, theme, mixins } = useDynamicStyles(dynamicStyleSheet)

  const rawCredentialRecords = useSelector(selectRawCredentialRecords)
  const [itemToDelete, setItemToDelete] = useState<CredentialRecordRaw | null>(
    null
  )
  const dispatch = useAppDispatch()
  const share = useShareCredentials()

  const itemToDeleteName = itemToDelete
    ? getCredentialName(itemToDelete.credential)
    : ''

  async function handleShareFromSwipe(item: CredentialRecordRaw) {
    await share([item])
  }

  function renderItem({ item }: RenderItemProps) {
    const { credential } = item
    const onSelect = () =>
      navigation.navigate('CredentialScreen', { rawCredentialRecord: item })

    return (
      <View style={styles.swipeItemOuter}>
        <View>
          <Swipeable
            renderLeftActions={() => (
              <TouchableOpacity
                onPress={() => handleShareFromSwipe(item)}
                style={[mixins.buttonIconContainer, styles.noShadow]}
              >
                <View style={[styles.swipeButton, mixins.buttonPrimary]}>
                  <MaterialIcons
                    name="share"
                    size={theme.iconSize}
                    color={theme.color.backgroundPrimary}
                  />
                </View>
              </TouchableOpacity>
            )}
            renderRightActions={() => (
              <TouchableOpacity
                onPress={() => setItemToDelete(item)}
                style={[mixins.buttonIconContainer, styles.noShadow]}
              >
                <View style={[styles.swipeButton, mixins.buttonError]}>
                  <MaterialIcons
                    name="delete"
                    size={theme.iconSize}
                    color={theme.color.backgroundPrimary}
                  />
                </View>
              </TouchableOpacity>
            )}
          >
            <CredentialItem
              rawCredentialRecord={item}
              showStatusBadges
              credential={credential}
              onSelect={onSelect}
              chevron
            />
          </Swipeable>
        </View>
      </View>
    )
  }

  function goToCredentialAdd() {
    if (navigationRef.isReady()) {
      navigationRef.navigate('HomeNavigation', {
        screen: 'AddNavigation',
        params: {
          screen: 'AddScreen'
        }
      })
    }
  }

  function AddCredentialButton(): React.ReactElement {
    return (
      <Button
        title="Add Credential"
        buttonStyle={[mixins.buttonPrimary, styles.addButton]}
        containerStyle={[mixins.buttonIconContainer, mixins.noFlex]}
        titleStyle={mixins.buttonTitle}
        onPress={goToCredentialAdd}
        iconRight
        testID="Add Credential"
        accessibilityLabel="Add Credential"
        icon={
          <MaterialIcons
            name="add-circle-outline"
            size={theme.iconSize}
            color={theme.color.textPrimaryDark}
          />
        }
      />
    )
  }

  async function deleteItem() {
    if (itemToDelete === null) return
    dispatch(deleteCredential(itemToDelete))
    setItemToDelete(null)
    AccessibilityInfo.announceForAccessibility('Credential Deleted')
  }

  function EmptyWallet(): React.ReactElement {
    return (
      <ScrollView
        style={styles.emptyScroll}
        contentContainerStyle={styles.emptyContent}
        testID="empty-wallet"
      >
        <WalletArtwork />

        <Text style={styles.eyebrow}>YOUR JOURNEY STARTS HERE</Text>
        <Text style={styles.header} accessibilityRole="header">
          Big achievements. One little wallet.
        </Text>
        <Text style={styles.emptyBody}>
          Looks like your wallet is empty.{'\n\n'}
          Credentials you add are stored on this device — signed by the issuer,
          tamper-evident, and shared only when you choose to.
        </Text>

        <View style={styles.ctaWrapper}>
          <AddCredentialButton />
        </View>

        <View style={styles.ruleRow}>
          <View style={styles.ruleLine} />
          <Text style={styles.ruleLabel}>THREE WAYS TO ADD</Text>
          <View style={styles.ruleLine} />
        </View>

        {ADD_METHODS.map((method, index) => (
          <View key={method.title}>
            <View
              style={styles.step}
              accessible
              accessibilityLabel={`${method.title}. ${method.hint}`}
            >
              <View style={styles.stepIconWrap}>
                <MaterialIcons
                  name={method.icon}
                  size={20}
                  color={theme.color.iconActive}
                />
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{method.title}</Text>
                <Text style={styles.stepHint}>{method.hint}</Text>
              </View>
            </View>
            {index < ADD_METHODS.length - 1 && <View style={styles.stepRule} />}
          </View>
        ))}

        <LearnMoreLink />
      </ScrollView>
    )
  }

  function WalletSummary(): React.ReactElement {
    return (
      <Motion>
        <Text style={styles.dashboardEyebrow}>YOUR PERSONAL COLLECTION</Text>
        <Text style={styles.dashboardTitle} accessibilityRole="header">
          My wallet
        </Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryOrb} pointerEvents="none" />
          <View style={styles.summaryTop}>
            <Text style={styles.summaryLabel}>A WORLD OF POTENTIAL</Text>
            <MaterialIcons
              name="account-balance-wallet"
              size={28}
              color="#D8CCFF"
            />
          </View>
          <Text style={styles.summaryCount}>{rawCredentialRecords.length}</Text>
          <Text style={styles.summaryCaption}>
            {rawCredentialRecords.length === 1
              ? 'credential in your wallet'
              : 'credentials in your wallet'}
          </Text>
          <View style={styles.summaryBottom}>
            <MaterialIcons name="school" size={18} color="#D8CCFF" />
            <Text style={styles.summaryNote}>Your learning. Your story.</Text>
          </View>
        </View>
        <AddCredentialButton />
        <Text style={styles.collectionTitle}>Your credentials</Text>
        <Text style={styles.collectionHint}>
          Swipe a card to share or remove it.
        </Text>
      </Motion>
    )
  }

  function LearnMoreLink(): React.ReactElement {
    return (
      <View style={styles.learnMoreContainer}>
        <Text
          style={styles.learnMoreText}
          onPress={() => Linking.openURL(LinkConfig.appWebsite.home)}
          accessibilityRole="link"
          accessibilityLabel="Learn more about the LCW at lcw.app"
          testID="learn-more-link"
        >
          <Text style={styles.learnMoreLink}>Learn more</Text> about the LCW
        </Text>
      </View>
    )
  }

  return (
    <>
      <NavHeader title="Home" testID="Home Screen" />
      {rawCredentialRecords.length === 0 ? (
        <EmptyWallet />
      ) : (
        <FlatList
          contentContainerStyle={mixins.credentialListContainer}
          data={rawCredentialRecords}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}-${item._id}`}
          ListHeaderComponent={<WalletSummary />}
          ListFooterComponent={<LearnMoreLink />}
        />
      )}
      <ConfirmModal
        open={itemToDelete !== null}
        onRequestClose={() => setItemToDelete(null)}
        onConfirm={deleteItem}
        title="Delete Credential"
        confirmText="Delete"
        accessibilityFocusContent
      >
        <Text style={styles.modalBodyText}>
          Are you sure you want to remove {itemToDeleteName} from your wallet?
        </Text>
      </ConfirmModal>
    </>
  )
}

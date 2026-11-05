import AsyncStorage from '@react-native-async-storage/async-storage'
import { IVerifiableCredential } from '@digitalcredentials/ssi'

import store from '../store'
import { addCredential } from '../store/slices/credential'
import { selectRawCredentialRecords } from '../store/slices/credential'
import { selectRawProfileRecords } from '../store/slices/profile'

const API = 'https://certificate-3g1x.onrender.com/api/certificates'
const PENDING_HANDOFF_KEY = 'ndear_pending_certificate_handoff'

function isCertificateHandoff(url: string): boolean {
  return url.startsWith('ndear://certificate/import')
}

function queryValue(url: string, key: string): string {
  const query = url.split('?')[1] ?? ''
  return new URLSearchParams(query).get(key) ?? ''
}

async function importHandoff(url: string): Promise<void> {
  await AsyncStorage.setItem(PENDING_HANDOFF_KEY, url)
  const name = queryValue(url, 'name')
  const dob = queryValue(url, 'dob')
  const certificateId = queryValue(url, 'certificateId')
  if (!name || !dob) {
    await AsyncStorage.removeItem(PENDING_HANDOFF_KEY)
    return
  }

  const response = await fetch(
    `${API}/student?fullName=${encodeURIComponent(name)}&dateOfBirth=${encodeURIComponent(dob)}`
  )
  if (!response.ok)
    throw new Error(`Certificate lookup failed with status ${response.status}`)
  const data = await response.json()
  const certificates = Array.isArray(data.certificates) ? data.certificates : []
  const matching = certificateId
    ? certificates.filter(
        (credential: { _raw?: { certificateId?: string } }) =>
          credential._raw?.certificateId === certificateId
      )
    : certificates
  const profile = selectRawProfileRecords(store.getState())[0]
  if (!profile) return

  const existingIds = new Set(
    selectRawCredentialRecords(store.getState()).map(
      (record) => record.credential.id
    )
  )
  for (const credential of matching) {
    if (!existingIds.has(credential.id)) {
      await store
        .dispatch(
          addCredential({
            credential: credential as IVerifiableCredential,
            profileRecordId: profile._id
          })
        )
        .unwrap()
    }
  }
  await AsyncStorage.removeItem(PENDING_HANDOFF_KEY)
}

export async function handleCertificateHandoff(url: string): Promise<boolean> {
  if (!isCertificateHandoff(url)) return false
  try {
    await importHandoff(url)
  } catch (error) {
    console.warn('[certificateHandoff] Import failed:', error)
  }
  return true
}

export async function retryPendingCertificateHandoff(): Promise<void> {
  const pending = await AsyncStorage.getItem(PENDING_HANDOFF_KEY)
  if (pending) await handleCertificateHandoff(pending)
}

import AsyncStorage from '@react-native-async-storage/async-storage'
import { IVerifiableCredential } from '@digitalcredentials/ssi'

import store from '../store'
import {
  addCredential,
  selectRawCredentialRecords
} from '../store/slices/credential'
import { selectRawProfileRecords } from '../store/slices/profile'

const CERTIFICATE_API = 'https://certificate-3g1x.onrender.com/api/certificates'

export const STUDENT_PROFILE_KEY = 'ndear_student_profile'
export const CACHED_CERTIFICATES_KEY = 'ndear_cached_certificates'

export type StudentProfile = {
  fullName: string
  dateOfBirth: string
}

export type FetchedCertificate = {
  '@context': string[]
  id: string
  type: string[]
  issuer: { id: string; name: string }
  issuanceDate: string
  credentialSubject: {
    id: string
    name: string
    dateOfBirth: string
    hasCredential: {
      type: string[]
      name: string
      description: string
      duration: string
    }
  }
  _raw: {
    certificateId: string
    recipientName: string
    dateOfBirth: string
    courseName: string
    organizationName: string
    issueDate: string
    duration: string
  }
}

/**
 * Saves the student's profile (full name + DOB) to AsyncStorage.
 */
export async function saveStudentProfile(
  profile: StudentProfile
): Promise<void> {
  await AsyncStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile))
}

/**
 * Retrieves the student's saved profile from AsyncStorage.
 */
export async function getStudentProfile(): Promise<StudentProfile | null> {
  const raw = await AsyncStorage.getItem(STUDENT_PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StudentProfile
  } catch {
    return null
  }
}

/**
 * Fetches all certificates for a student from the Certificate Studio backend
 * using their full name and date of birth.
 * Returns an empty array if none are found or if the request fails.
 */
export async function fetchCertificatesFromStudio(
  fullName: string,
  dateOfBirth: string
): Promise<FetchedCertificate[]> {
  try {
    const params = new URLSearchParams({
      fullName: fullName.trim(),
      dateOfBirth: dateOfBirth.trim()
    })
    const response = await fetch(
      `${CERTIFICATE_API}/student?${params.toString()}`,
      {
        headers: { Accept: 'application/json' }
      }
    )
    if (!response.ok) return []
    const data = await response.json()
    if (!data.found || !Array.isArray(data.certificates)) return []
    return data.certificates as FetchedCertificate[]
  } catch (err) {
    console.warn('[studentCertificates] Fetch failed:', err)
    return []
  }
}

/**
 * Saves fetched certificates to AsyncStorage for offline access.
 */
export async function cacheCertificates(
  certificates: FetchedCertificate[]
): Promise<void> {
  await AsyncStorage.setItem(
    CACHED_CERTIFICATES_KEY,
    JSON.stringify(certificates)
  )
}

/**
 * Returns locally cached certificates (offline fallback).
 */
export async function getCachedCertificates(): Promise<FetchedCertificate[]> {
  const raw = await AsyncStorage.getItem(CACHED_CERTIFICATES_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as FetchedCertificate[]
  } catch {
    return []
  }
}

/**
 * Full sync: fetch from the backend and cache locally.
 * Returns the list of certificates (from network or local cache on failure).
 */
export async function syncStudentCertificates(
  fullName: string,
  dateOfBirth: string
): Promise<FetchedCertificate[]> {
  const online = await fetchCertificatesFromStudio(fullName, dateOfBirth)
  if (online.length > 0) {
    await cacheCertificates(online)
    console.log(
      `[studentCertificates] Synced ${online.length} certificate(s) for ${fullName}`
    )
    return online
  }
  // Fallback to local cache
  const cached = await getCachedCertificates()
  console.log(
    `[studentCertificates] Using ${cached.length} cached certificate(s)`
  )
  return cached
}

/**
 * Fetches newly-issued certificates and imports them into the active wallet
 * profile. Existing credentials are left unchanged.
 */
export async function syncAndImportStudentCertificates(
  fullName: string,
  dateOfBirth: string
): Promise<number> {
  const certificates = await fetchCertificatesFromStudio(fullName, dateOfBirth)
  if (certificates.length === 0) return 0

  await cacheCertificates(certificates)

  const profile = selectRawProfileRecords(store.getState())[0]
  if (!profile) {
    throw new Error(
      'No active wallet profile is available for certificate import.'
    )
  }

  const existingIds = new Set(
    selectRawCredentialRecords(store.getState()).map(
      (record) => record.credential.id
    )
  )
  let imported = 0
  for (const certificate of certificates) {
    if (existingIds.has(certificate.id)) continue
    await store
      .dispatch(
        addCredential({
          credential: certificate as IVerifiableCredential,
          profileRecordId: profile._id
        })
      )
      .unwrap()
    existingIds.add(certificate.id)
    imported += 1
  }

  return imported
}

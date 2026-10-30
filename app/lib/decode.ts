import qs from 'query-string'

import { CredentialRequestParams } from './credentialRequest'

import { CredentialRecordRaw } from '../model'

import { IVerifiableCredential } from '@digitalcredentials/ssi'
import { getSubject } from './credentialDisplay/shared'
import { isDeepLink } from './walletRequestApi'
import { credentialsFromVpqr } from './credentialsFromVpqr'
import { credentialsFromPresentation } from './credentialsFromPresentation'
import { isVerifiableCredential, isVerifiablePresentation } from './validate'

export const regexPattern = {
  vpqr: /^VP1-[A-Z|0-9]+/,
  url: /^https?:\/\/.+/,
  json: /^{.*}$/s
}

export function isLegacyCredentialRequest(url: string): boolean {
  if (!isDeepLink(url)) {
    return false
  }
  // TODO: Use native URL object instead of 'qs'
  const queryParams = qs.parse(url.split('?')[1])
  return 'vc_request_url' in queryParams && 'issuer' in queryParams
}

export function legacyRequestParamsFromUrl(
  url: string
): CredentialRequestParams {
  const params = qs.parse(url.split('?')[1])
  return params as CredentialRequestParams
}

async function credentialsFromJson(
  text: string
): Promise<IVerifiableCredential[]> {
  const data = JSON.parse(text)

  if (data?.vp && isVerifiablePresentation(data.vp)) {
    return credentialsFromPresentation(data.vp)
  }

  if (isVerifiablePresentation(data)) {
    return credentialsFromPresentation(data)
  }

  if (isVerifiableCredential(data)) {
    return [data]
  }

  throw new Error('Credential(s) could not be decoded from the JSON.')
}

/**
 * A method for decoding credentials from a variety text formats.
 * Used on the Add Credential screen (when a user scans QR code or pastes
 * something into the text box).
 *
 * @param text - A string containing a VPQR, URL, or JSON object.
 * @returns {Promise<IVerifiableCredential[]>} - An array of credentials.
 */
export async function credentialsFrom(
  text: string
): Promise<IVerifiableCredential[]> {
  text = text.trim()

  if (regexPattern.url.test(text)) {
    let fetchUrl = text

    // If the scanned URL is a verifier web link with ?vc= or #verify?vc=
    try {
      const parsedUrl = new URL(text)
      const hash = parsedUrl.hash ? parsedUrl.hash.slice(1) : ''
      const hashParams = new URLSearchParams(
        hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : hash
      )
      const rawHashVc = /^verify\?vc=(.*)$/s.exec(hash)?.[1]
      const vcParam = rawHashVc
        ? decodeURIComponent(rawHashVc)
        : hashParams.get('vc') || parsedUrl.searchParams.get('vc')

      if (vcParam && /^https?:\/\//i.test(vcParam)) {
        fetchUrl = vcParam
      }
    } catch {
      // Continue with original url if URL parsing is not applicable
    }

    const response = await fetch(fetchUrl, {
      headers: {
        Accept: 'application/json, application/ld+json'
      }
    })
    text = await response.text().then((t) => t.trim())
  }

  if (regexPattern.vpqr.test(text)) {
    return credentialsFromVpqr(text)
  }

  if (regexPattern.json.test(text)) {
    return credentialsFromJson(text)
  }

  throw new Error('No credentials were resolved from the text')
}

/**
 * Returns a unique identifier for a credential record.
 * Uses the database record ID to ensure uniqueness across all credentials,
 * even if they have the same or missing credential.id field.
 *
 * This addresses the issue where multiple credentials with the same or missing
 * credential.id would collide when used as cache keys for public links.
 */
export function credentialIdFor(
  rawCredentialRecord: CredentialRecordRaw
): string {
  return (
    rawCredentialRecord._id.toHexString?.() || String(rawCredentialRecord._id)
  )
}

# learner-credential-wallet Changelog

## 2.2.10 - build 107

### Added

- New Help section on LCW for getting started
- Support VC-API Interaction URL format in QR Code scanning
- Add gallery to LCW website and repo
- Look into using maestro for automated UI testing
- Maestro UI Testing – “Learn more about the LCW” Link Flow
- Maestro UI Testing – Issuer Information Flow
- Maestro UI Testing – Credential Management Flow
- Maestro UI Testing – Credential Verification Status Flow
- Maestro UI Testing – About Screen Flow
- Maestro UI Testing – Sign Out Flow
- Maestro UI Testing – Profile Management Flow
- Maestro UI Testing – Shared Credentials Flow
- Create link on onboarding screen during password creation

### Changed
- LCW: Change linter library, update rules

### Fixed
- Links disabled for issuers that are in registry
- Remove excess logs related to light/dark theme


## 2.2.9 - build 103

### Added

- Generalize public link creation to allow all credentials, including expired ones

### Changed

- [EPIC] Update app store pages
- Change helpful message on LCW dashboard
- Refactor dark mode / light mode

### Fixed

- VPR: Credential request does not differentiate between credentials from different profiles
- Cannot go back from credential preview from managed profiles
- Fix legacy peer deps
- Issuing is buggy using deeplink and camera but ok from app qr scan


## 2.2.8 - build 102

### Added

- Visualizing credentials for different profiles
- New display rule for open badges
- Disable url links for credentials from non DCC-supported registries
- Better handling of duplicate credentials
- Use external VC type definitions
- Support VC-API Interaction URL format in QR Code scanning
- Refactor handling of VPR requests from deep links etc

### Fixed

- VC-API mismatch on exchange participation response
- Issues with PresentationPreview screen from PublicLink creation work

## 2.2.7 - build 100-101

### Added

- Add Alignments to Open Badges 3.0 Display
- Android: Support 16KB memory page sizes
- Show duplicate profiles skipped when restoring wallet
- Remove Scan QR code button on Developer menu
- Link to LCW app page (for trying it)

### Fixed

- Credential Details Page – Options menu becomes transparent on click
- OWF: Fix warnings
- View Link becomes invalid after first use on Share Credential screen
- Duplicate profile names allowed when renaming existing profile
- Public Link Page – Unnecessary status refetch causing UI flicker
- “Unable to Create Public Link” Modal “Close” button is not responsive

## 2.2.6 - build 96-99

### Added

- Upgrade to Expo SDK 53
- React(19) and RN(0.79) Upgrade
- "Scan a shared QR code" text and UI consistency
- Encourage devs to use their own verifier instance on LCW
- Runtime Warning – Credential Verification lacks log value
- Require Cycle Warnings across model, store, components, and navigation
- Disable coverage by default when running npm tests
- Remove Accept All Button When Only One Credential in Available Credentials Screen
- Update Instructions at Top of Add Credential Screen
- Update README
- LCW: Set up test coverage
- "Scan a shared QR code" text consistency
- Users confused about shared link expiration

### Fixed

- Issue with share credentials option - cannot select credential to create public link
- LCW: Coverage command failing while tests pass under npm test
- UI Overlap on Manage Profiles screen
- Wallet restore creates duplicate profiles & app allows duplicate profile names
- Enable scrolling on Manage Profile screen
- Issuer logo should pull from registry first, then fallback to VC logo second, default stock photo third
- Some Credly Badges Fail Verify - Special Characters Issue?
- Navigation order is inconsistent on two different pages - accessibility issue

## 2.2.5 - build 95

### Added

- [EPIC] Wallet attached storage
- Feature Flag: Wallet attached storage
- Consent screens for wallet attached storage
- Feature Flag: Password prompt at wallet setup
- Update Android API level to 35
- Upgrade to Expo SDK 52
- Updated age rating questions on Apple store for LCW

### Fixed

- Creating public links on w.a.s. branch is broken
- Tarballs are empty when exporting w.a.s. space
- BUG: iOS - Creating public links is broken when sharing a credential

## 2.2.4 - build 94

### Added

- Verifiable Presentation Requests

### Fixed

- Remove need for legacy-peer-deps flag during installation

## 2.2.3 - build 93

### Added

- Capability to Unbake Open Badge 3.0
- Integrate verifier-core in LCW & Adjust Response Handling
- Install and Configure verifier-core in LCW
- Content & Design for Error Messaging Based on Updates to Verifier Core
- Design for Issuer & Issuer Registry Display
- Updating Issuer & Issuer Registry Display
- Integrate verifier-core and shared known issuer registry list

### Fixed

- Identify and remove duplicate validation logic in LCW
- Animated: 'use Native Driver' not specified
- ViewPropTypes error on Android and iOS

## 2.1.8 - build 88

### Added

- Add eddsa-rdfc-2022

### Fixed

- 'Wallet initialization failed' error when setting up wallet

## 2.1.7 - build 87

### Changed

- Remove checkbox from for pw protection for Backup screen

### Fixed

- Update where we get credential name from in wallet
- PDF Export is Available for All Credentials Even When RenderMethod Isn't in the Credential
- Remove CHAPI Registration as Part of App Install
- Remove period from "Create a Public Link" instructions on Bottom Nav Share

## 2.1.6 - build 86

### Fixed

- Deep Linking for QR codes

## 2.1.5 - build 85

### Added

- Add QR code to PDFs for verification

## 2.1.4 - build 84

### Fixed

- Fix PDF export

## 2.1.3 - build 83

### Fixed

- Fix verifyCredential not working without a credentialStatus

## 2.1.2 - build 82

### Fixed

- Fix signature verification (`@sphereon/isomorphic-webcrypto` was failing upstream in `jsonld-signatures`),
  and has been replaced with `expo-crypto` usage. Also fixes StatusList `Buffer` error.
- Update Target API Level
- "Issued To" Not Displaying When Using Identifier in CredentialSubject
- Wallet not verifying creds
- After issuing VC via CHAPI, LCW shows error
- Error: crypto.subtle not found (IOS ISSUE)
- 'Select to Speak' accessibility control on Android causes bottom nav row to disappear
- Check more markdown/HTML in achievement.criteria.narrative

## 2.1.1 - build 81

### Changed

- Update to latest library versions, add support for VC DM 2.0.

### Fixed

- Title adjustment on BGV credential
- Register Wallet button not working on Android on Build 58+.

## 2.1.0 - build 80

- First official release to app stores post RN Upgrade and conversion to Expo. Releases are now back on `main` branch.

### Added

- Add support for the OBv3 name property (derived from `identifierHash` when `identifierType == 'name'`).

## 2.0.24 - build 79 (Pre-RN Upgrade `demo` branch)

### Changed

- Fix 'Register Wallet' button on Android.

## 2.0.23 - build 78 (Pre-RN Upgrade `demo` branch)

### Changed

- Update sample VC templates from dev menu.
- Fix PDF generation Share call.

## 2.0.21 - build 76

### Changed

- Update to latest Bitstring Status List dependency.

## 2.0.8 - build 63

### Changed

- Fix 'Android add button not clickable' issue
- Remove Custom Setup Option PR
- Update SplashScreen image PR
- Update warning text on wallet setup, include 6 char minimum, issue
- Fix CI build error (`@nuintun/qrcode` patch), issue
- Fix Issue Date and Expiration Date, issue
- Fix Cancel button styling during LI share, issue

## 1.17.3 - build 52 - 2022-12-08

### Changed

- (Fix) Roll back PR (which broke Send Credential button).

## 1.17.2 - build 51 - 2022-12-07

### Changed

- Fix config implementation, verifier-plus integration

For previous history, see Git commits.

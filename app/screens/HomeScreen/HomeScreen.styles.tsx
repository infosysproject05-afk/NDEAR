import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ mixins, theme }) => ({
  addButton: {
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dashboardEyebrow: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2,
    color: theme.color.brightAccent,
    marginTop: 8,
    marginBottom: 8
  },
  dashboardTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 34,
    letterSpacing: -1,
    color: theme.color.textPrimary,
    marginBottom: 22
  },
  summaryCard: {
    backgroundColor: '#30235E',
    borderRadius: 26,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 16
  },
  summaryOrb: {
    position: 'absolute',
    right: -65,
    top: 25,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 35,
    borderColor: '#493578'
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summaryLabel: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#D8CCFF',
    flex: 1
  },
  summaryCount: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 52,
    color: '#FFFFFF',
    marginTop: 12
  },
  summaryCaption: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 14,
    color: '#E7DFFF'
  },
  summaryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 8
  },
  summaryNote: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 12,
    color: '#D8CCFF'
  },
  collectionTitle: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 20,
    color: theme.color.textPrimary,
    marginTop: 24,
    marginBottom: 6
  },
  collectionHint: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 12,
    color: theme.color.textSecondary,
    marginBottom: 12
  },
  /* Plain empty-state box, shared with ProfileCredentialScreen. */
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16
  },

  /* ---------- empty state: shell ---------- */
  emptyScroll: {
    flex: 1,
    backgroundColor: theme.color.backgroundPrimary
  },
  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40
  },

  /* ---------- empty state: copy ---------- */
  eyebrow: {
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.small,
    color: theme.color.textSecondary,
    letterSpacing: 2,
    marginBottom: 12
  },
  header: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 32,
    letterSpacing: -1,
    color: theme.color.textHeader,
    lineHeight: 40,
    marginBottom: 12
  },
  emptyBody: {
    ...mixins.paragraphText,
    maxWidth: 440,
    marginBottom: 28
  },
  ctaWrapper: {
    marginBottom: 32
  },

  /* ---------- empty state: "three ways to add" ---------- */
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  ruleLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.color.foregroundPrimary
  },
  ruleLabel: {
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.small,
    color: theme.color.textSecondary,
    letterSpacing: 1.5,
    marginHorizontal: 12
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.color.foregroundPrimary,
    marginBottom: 10
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.color.highlightAndroid,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  stepText: {
    flex: 1
  },
  stepTitle: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.regular,
    color: theme.color.textPrimary,
    marginBottom: 2
  },
  stepHint: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.small,
    color: theme.color.textSecondary,
    lineHeight: 18
  },
  stepRule: {
    height: 1,
    backgroundColor: theme.color.foregroundPrimary,
    opacity: 0.55,
    marginLeft: 56
  },

  /* ---------- credential list view ---------- */
  swipeItemOuter: {
    borderRadius: theme.borderRadius
  },
  swipeItem: {
    overflow: 'hidden'
  },
  swipeButtonContainer: {
    flex: 1
  },
  swipeButton: {
    ...mixins.buttonIcon,
    flex: 1,
    justifyContent: 'center'
  },
  noShadow: {
    shadowOpacity: 0,
    elevation: 0,
    flex: 1,
    marginVertical: 10
  },

  /* ---------- shared ---------- */
  modalBodyText: {
    ...mixins.paragraphText,
    textAlign: 'center',
    lineHeight: 24,
    marginVertical: 8
  },
  learnMoreContainer: {
    marginTop: 28,
    alignItems: 'center'
  },
  learnMoreText: {
    ...mixins.paragraphText,
    textAlign: 'center'
  },
  learnMoreLink: {
    color: theme.color.linkColor,
    textDecorationLine: 'underline'
  }
}))

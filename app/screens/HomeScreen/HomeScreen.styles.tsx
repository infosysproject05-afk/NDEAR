import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

/* Home — empty state follows the "editorial ledger" direction that the colour
 * tokens already imply: iron-gall ink as the single accent, warm-slate
 * surfaces, Rubik Bold for the voice and RobotoMono for the marginalia
 * (eyebrow, section rule). Spacing sits on a 4px grid.
 */
export default createDynamicStyleSheet(({ mixins, theme }) => ({
  /* Plain empty-state box, shared with ProfileCredentialScreen. */
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28
  },

  /* ---------- empty state: shell ---------- */
  emptyScroll: {
    flex: 1,
    backgroundColor: theme.color.backgroundPrimary
  },
  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40
  },

  /* ---------- empty state: card-stack motif ----------
   * Three offset rectangles read as a short stack of records. Decorative
   * only — hidden from assistive tech in the component.
   */
  hero: {
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36
  },
  heroCard: {
    position: 'absolute',
    width: 224,
    height: 136,
    borderRadius: theme.borderRadius + 4
  },
  heroCardBack: {
    backgroundColor: theme.color.foregroundPrimary,
    opacity: 0.4,
    transform: [{ rotate: '-9deg' }, { translateY: 8 }]
  },
  heroCardMid: {
    backgroundColor: theme.color.foregroundPrimary,
    opacity: 0.7,
    transform: [{ rotate: '-4.5deg' }, { translateY: 4 }]
  },
  heroCardFront: {
    ...mixins.shadow,
    backgroundColor: theme.color.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.color.highlightAndroid,
    padding: 18,
    justifyContent: 'space-between'
  },
  heroCardTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  heroSeal: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: theme.color.highlightAndroid,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  heroCardLabel: {
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.small,
    color: theme.color.textSecondary,
    letterSpacing: 2
  },
  heroLine: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.color.foregroundPrimary
  },
  heroLineWide: {
    width: '72%',
    marginBottom: 8
  },
  heroLineNarrow: {
    width: '44%'
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
    fontSize: theme.fontSize.header,
    color: theme.color.textHeader,
    lineHeight: 32,
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
    paddingVertical: 14
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.color.foregroundPrimary,
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
    ...mixins.shadow
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

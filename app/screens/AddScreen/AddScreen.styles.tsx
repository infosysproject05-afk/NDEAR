import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ mixins, theme }) => ({
  container: {
    padding: 24,
    flex: 1
  },
  paragraph: {
    ...mixins.paragraphText,
    marginBottom: 16,
    marginTop: 8
  },
  shareButton: {
    ...mixins.buttonPrimary
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 16
  },
  header: {
    ...mixins.headerText,
    fontSize: theme.fontSize.regular,
    marginBottom: 6
  },
  input: {
    ...mixins.input,
    flex: 1,
    height: 190,
    minHeight: 44,
    zIndex: -1
  },
  actionButton: {
    paddingHorizontal: 16
  },
  actionButtonInactive: {
    backgroundColor: theme.color.foregroundPrimary
  },
  actionButtonInactiveTitle: {
    color: theme.color.textPrimary
  },
  actionButtonContainer: {
    bottom: 8,
    right: 8,
    position: 'absolute'
  },
  actionInputContainer: {
    flexDirection: 'row'
  }
}))

import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  container: {
    padding: 16
  },
  warningText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fontFamily.regular,
    color: theme.color.warningEmphasis,
    backgroundColor: theme.color.warningSurface,
    padding: 12,
    borderRadius: theme.borderRadius,
    marginBottom: 12
  }
}))

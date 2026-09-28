import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  menuItemTitle: {
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.regular
  },
  menuItemContainer: {
    backgroundColor: theme.color.foregroundPrimary,
    borderColor: theme.color.highlightAndroid,
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    marginVertical: 5,
    padding: 20
  }
}))

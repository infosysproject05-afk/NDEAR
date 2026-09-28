import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  label: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 10,
    marginBottom: 4
  },
  item: { paddingTop: 4 },
  barStyle: {
    backgroundColor: theme.color.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.color.highlightAndroid,
    elevation: 0
  }
}))

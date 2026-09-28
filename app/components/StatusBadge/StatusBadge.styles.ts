import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    marginHorizontal: 2,
    minHeight: 24,
    paddingVertical: 3,
    marginBottom: 4
  },
  icon: {
    marginRight: 4,
    marginLeft: 0
  },
  label: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.small,
    letterSpacing: 0.3
  }
}))

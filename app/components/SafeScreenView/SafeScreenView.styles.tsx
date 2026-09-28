import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  container: {
    backgroundColor: theme.color.backgroundPrimary
  },
  contentContainer: {
    flexGrow: 1
  }
}))

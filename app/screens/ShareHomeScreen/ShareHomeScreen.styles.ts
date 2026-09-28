import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  credentialList: {
    borderRadius: theme.borderRadius,
    overflow: 'hidden'
  },
  paragraph: {
    fontSize: 14,
    fontFamily: theme.fontFamily.regular,
    lineHeight: 22,
    color: theme.color.textSecondary,
    marginTop: 8
  },
  sendButton: {
    marginTop: 32
  }
}))

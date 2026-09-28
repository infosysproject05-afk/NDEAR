import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme, mixins }) => ({
  container: {
    padding: 20,
    flexGrow: 1
  },
  list: {
    flex: 1
  },
  contentContainer: {
    padding: 20
  },
  input: {
    ...mixins.input,
    backgroundColor: theme.color.foregroundPrimary
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center'
  }
}))

import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme, mixins }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.color.backgroundPrimary
  },
  image: {
    height: 72,
    resizeMode: 'contain'
  },
  title: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.title,
    letterSpacing: -1.2,
    lineHeight: 40,
    color: theme.color.textPrimary,
    padding: 24,
    textAlign: 'center'
  },
  paragraph: {
    ...mixins.paragraphText,
    textAlign: 'center',
    marginBottom: 28
  },
  passwordEntry: {
    ...mixins.input,
    width: '100%',
    marginBottom: 6
  },
  passwordError: {
    borderColor: theme.color.error
  },
  buttonPrimary: {
    backgroundColor: theme.color.buttonPrimary,
    padding: 24,
    borderRadius: theme.borderRadius
  },
  buttonPrimaryTitle: {
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.regular,
    color: theme.color.textPrimaryDark
  },
  buttonPrimaryContainer: {
    width: '100%',
    marginTop: 20
  },
  buttonClear: {
    ...mixins.button,
    backgroundColor: theme.color.transparent,
    marginVertical: 8
  },
  buttonClearContainer: {
    width: '100%'
  },
  buttonClearTitle: {
    ...mixins.buttonTitle,
    marginLeft: 12,
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
    textDecorationLine: 'underline'
  }
}))

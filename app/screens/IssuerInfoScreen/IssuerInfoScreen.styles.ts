import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  bodyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.color.backgroundPrimary
  },
  dataContainer: {
    flexGrow: 1,
    marginVertical: 12
  },
  dataLabel: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textSecondary,
    marginBottom: 8
  },
  dataValue: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.regular,
    color: theme.color.textSecondary,
    flex: 1
  },
  link: {
    fontFamily: theme.fontFamily.regular,
    color: theme.color.linkColor,
    textDecorationLine: 'underline'
  },
  disabledLink: {
    fontFamily: theme.fontFamily.regular,
    color: theme.color.textSecondary,
    textDecorationLine: 'none'
  },
  warningText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fontFamily.regular,
    color: theme.color.warningEmphasis,
    backgroundColor: theme.color.warningSurface,
    padding: 12,
    borderRadius: theme.borderRadius,
    marginBottom: 12
  },
  connectedUniversity: {
    padding: 16,
    marginBottom: 20,
    borderRadius: theme.borderRadius,
    backgroundColor: '#123B39',
    borderWidth: 1,
    borderColor: '#287A68'
  },
  connectedUniversityLabel: {
    fontSize: 10,
    fontFamily: theme.fontFamily.medium,
    letterSpacing: 1.2,
    color: '#8EE6C4'
  },
  connectedUniversityName: {
    fontSize: 20,
    fontFamily: theme.fontFamily.bold,
    color: '#FFFFFF',
    marginVertical: 4
  },
  bulletList: {
    marginTop: -4
  },

  // 🔽 Added styles for registry rendering
  sectionTitle: {
    fontSize: theme.fontSize.regular,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
    marginBottom: 16
  },
  registryBlock: {
    marginBottom: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.textSecondary
  },
  registryTitle: {
    fontSize: theme.fontSize.regular,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
    marginBottom: 8
  },
  registryImage: {
    width: 45,
    height: 40,
    borderRadius: 4,
    marginBottom: 12,
    resizeMode: 'contain',
    backgroundColor: theme.color.textSecondary
  }
}))

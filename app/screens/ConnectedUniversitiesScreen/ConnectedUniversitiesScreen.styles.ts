import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme }) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundPrimary
  },
  content: {
    padding: 20
  },
  intro: {
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.regular,
    lineHeight: 22,
    marginBottom: 20
  },
  universityCard: {
    padding: 18,
    borderRadius: theme.borderRadius,
    backgroundColor: '#123B39',
    borderWidth: 1,
    borderColor: '#287A68'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#159A73',
    marginRight: 12
  },
  nameBlock: {
    flex: 1
  },
  label: {
    color: '#8EE6C4',
    fontFamily: theme.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 1.2
  },
  name: {
    color: '#FFFFFF',
    fontFamily: theme.fontFamily.bold,
    fontSize: 22,
    marginTop: 3
  },
  websiteLabel: {
    color: '#B6D7D1',
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.small,
    marginBottom: 6
  },
  link: {
    color: '#8BDCE8',
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.regular,
    textDecorationLine: 'underline'
  }
}))

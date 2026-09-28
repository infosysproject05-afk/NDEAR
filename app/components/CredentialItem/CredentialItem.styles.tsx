import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme, mixins }) => ({
  listItemContainer: {
    ...mixins.button,
    backgroundColor: theme.color.foregroundPrimary,
    paddingVertical: 20,
    paddingHorizontal: mixins.button.paddingHorizontal,
    minHeight: 96,
    borderWidth: 1,
    borderColor: theme.color.highlightAndroid
  },
  listItemOuterContainer: {
    ...mixins.shadow,
    marginVertical: 8,
    borderRadius: mixins.button.borderRadius
  },
  listItemContentContainer: {
    flexDirection: 'column'
  },
  listItemTextContainer: {
    flex: 1
  },
  listItemTopContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemTitle: {
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.regular,
    marginBottom: 6
  },
  listItemSubtitle: {
    color: theme.color.textSecondary,
    fontFamily: theme.fontFamily.regular,
    fontSize: 13,
    lineHeight: 20
  },
  notVerifiedIcon: {
    width: theme.issuerIconSize - 8,
    height: theme.issuerIconSize - 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.color.textSecondary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

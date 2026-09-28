import { createDynamicStyleSheet } from '../../dynamicStyles'

export default createDynamicStyleSheet(({ theme, mixins }) => ({
  cardContainer: {
    backgroundColor: theme.color.backgroundSecondary,
    borderRadius: theme.borderRadius,
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: theme.color.highlightAndroid
  },
  header: {
    ...mixins.headerText,
    color: theme.color.textPrimary,
    fontSize: theme.fontSize.header,
    lineHeight: 30,
    marginBottom: 8,
    flex: 1
  },
  headerInRow: {
    ...mixins.headerText,
    color: theme.color.textPrimary,
    fontSize: theme.fontSize.header,
    lineHeight: 30,
    marginBottom: -8,
    flex: 1
  },
  dataContainer: {
    flexGrow: 1,
    marginVertical: 12
  },
  dataLabel: {
    letterSpacing: 0.7,
    fontSize: theme.fontSize.small,
    fontFamily: theme.fontFamily.bold,
    color: theme.color.textPrimary,
    marginBottom: 8
  },

  issuerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },

  issuerContent: {
    flex: 1,
    // marginLeft: 12,
    justifyContent: 'center'
  },

  issuerButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 6,
    // paddingHorizontal: 16,
    paddingVertical: 10
  },

  dataValue: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.regular,
    color: theme.color.textPrimary,
    flex: 1
  },
  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between'
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexColumn: {
    flexDirection: 'column'
  },
  fullWidthImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain'
  },
  imageBackground: {
    backgroundColor: theme.color.foregroundPrimary
  },
  dateStyles: {
    flexDirection: 'row'
  },
  warningText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.fontFamily.regular,
    color: theme.color.warningEmphasis,
    backgroundColor: theme.color.warningSurface,
    padding: 12,
    borderRadius: theme.borderRadius,
    marginBottom: 12
  }
}))

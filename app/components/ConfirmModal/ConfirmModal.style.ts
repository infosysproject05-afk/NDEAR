import { StyleSheet } from 'react-native'
import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme, mixins }) => ({
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.75,
    backgroundColor: theme.color.modalBackground
  },
  modalOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  modalContainer: {
    backgroundColor: theme.color.foregroundPrimary,
    padding: 24,
    borderRadius: 28
  },
  modalTitle: {
    color: theme.color.textPrimary,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.medium,
    marginVertical: 8,
    textAlign: 'center'
  },
  buttonGroupContainer: {
    marginTop: 16
  },
  buttonPrimary: {
    ...mixins.button,
    ...mixins.buttonPrimary,
    flexGrow: 1
  },
  buttonSecondary: {
    ...mixins.button,
    backgroundColor: theme.color.buttonSecondary,
    flexGrow: 1
  },
  buttonSecondaryTitle: {
    ...mixins.buttonTitle,
    color: theme.color.textPrimary
  }
}))

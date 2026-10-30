import { createDynamicStyleSheet } from '../../lib/dynamicStyles'

export default createDynamicStyleSheet(({ theme, mixins }) => ({
  container: { flex: 1, backgroundColor: theme.color.backgroundPrimary },
  content: { paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 40 },
  heading: {
    fontFamily: theme.fontFamily.bold,
    fontSize: 26,
    color: theme.color.textPrimary,
    marginBottom: 8
  },
  description: { ...mixins.paragraphText, marginBottom: 22 },
  sectionTitle: {
    fontFamily: theme.fontFamily.medium,
    fontSize: 16,
    color: theme.color.textPrimary,
    marginBottom: 10,
    marginTop: 16
  },
  choices: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  choice: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.color.foregroundPrimary
  },
  choiceSelected: { backgroundColor: theme.color.brightAccent },
  choiceText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 13,
    color: theme.color.textPrimary
  },
  choiceTextSelected: { color: theme.color.textPrimaryDark },
  textInput: {
    backgroundColor: theme.color.foregroundPrimary,
    color: theme.color.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 8
  },
  hint: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.textSecondary,
    marginBottom: 12
  },
  privacy: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: theme.color.textSecondary,
    marginVertical: 20
  },
  saveButton: { ...mixins.buttonPrimary, minHeight: 50 },
  saveButtonTitle: { ...mixins.buttonTitle }
}))

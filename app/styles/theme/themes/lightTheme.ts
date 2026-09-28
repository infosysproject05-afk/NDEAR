import type { ThemeType } from '..'
import { Color } from '../../colors'
import { FontFamily } from '../../fonts'
import { ColorScheme } from '../../colorScheme'

export const lightTheme: ThemeType = {
  name: 'LightTheme',
  color: {
    linkColor: Color.Indigo,
    backgroundPrimary: Color.Gray100,
    backgroundSecondary: Color.White,
    foregroundPrimary: Color.White,
    textHeader: Color.Gray900,
    textPrimary: Color.Gray700,
    brightAccent: Color.Indigo,
    textSecondary: Color.Gray600,
    textPrimaryDark: Color.White,
    iconActive: Color.Indigo,
    iconInactive: Color.Gray500,
    inputInactive: Color.Gray600,
    buttonPrimary: Color.Indigo,
    buttonSecondary: Color.Gray300,
    buttonDisabled: Color.Gray500,
    shadow: Color.Gray900,
    success: Color.DarkGreen,
    error: Color.Red,
    warning: Color.Amber,
    warningEmphasis: Color.DarkAmber,
    warningSurface: Color.AmberSurfaceLight,
    errorLight: Color.DarkRed,
    transparent: Color.Transparent,
    switchActive: Color.Indigo,
    modalBackground: Color.Gray900,
    highlightAndroid: Color.TransparentIndigoDeep
  },
  fontFamily: {
    regular: FontFamily.RubikRegular,
    medium: FontFamily.RubikMedium,
    bold: FontFamily.RubikBold,
    mono: FontFamily.RobotoMonoRegular
  },
  fontSize: {
    title: 34,
    header: 26,
    medium: 18,
    regular: 16,
    small: 12
  },
  borderRadius: 20,
  iconSize: 24,
  issuerIconSize: 48,
  statusBarStyle: ColorScheme.Dark,
  keyboardAppearance: ColorScheme.Light,
  // Tinted shadow (Gray900, not pure black) so cards settle onto the surface
  // instead of looking cut out of it.
  shadowOpacity: 0.08
}

export enum Color {
  /* Brand — iron-gall ink.
   * Academic records were written in iron-gall ink, which oxidises from
   * blue-black toward violet. That's the brand axis: a deep indigo-violet for
   * light surfaces, a lifted violet for dark ones. It is deliberately kept
   * clear of the green/amber/red band so the accent never reads as a status.
   */
  Indigo = '#4F46B8',
  IndigoMid = '#7B73E8',
  IndigoBright = '#A5A0F5',
  TransparentIndigo = 'rgba(123, 115, 232, 0.28)',
  TransparentIndigoDeep = 'rgba(79, 70, 184, 0.28)',

  /* Status — a credential is valid, expiring, or refused. These carry meaning,
   * so they stay legible against both surface families and never double as
   * decoration.
   */
  Green = '#3DBF6B',
  DarkGreen = '#1F7A43',

  Red = '#E05252',
  LightRed = '#FF7A70',
  DarkRed = '#B02A22',

  Amber = '#E0A32E',
  Yellow = '#E0A32E',
  /* Warning-banner pairs. Split by theme because a single pale-amber panel
   * cannot hold legible text on both a white and a near-black surface — the
   * hardcoded Bootstrap pair (#856404 on #FFF3CD) this replaces only worked
   * in light mode. Both pairs clear 5:1 against their own background.
   */
  DarkAmber = '#7A4E00',
  AmberSurfaceLight = '#FBF0D9',
  AmberSurfaceDark = '#3A2E12',

  Transparent = 'transparent',
  White = '#FFFFFF',
  Black = '#000000',

  /* Neutrals — warm slate, tinted very slightly toward the ink hue rather than
   * a neutral gray ramp. Surfaces then feel related to the brand instead of
   * sitting under it.
   */
  Gray100 = '#F4F5F8',
  Gray200 = '#E6E8EF',
  Gray300 = '#CFD3DF',
  Gray400 = '#9BA1B4',
  Gray500 = '#6E7488',
  Gray600 = '#4A5064',
  Gray700 = '#2E3346',
  Gray800 = '#1D2133',
  Gray900 = '#121524'
}

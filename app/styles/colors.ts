export enum Color {
  /* Violet accents, soft lavender surfaces, and midnight dark mode. */
  Indigo = '#6845D9',
  IndigoMid = '#B39AF9',
  IndigoBright = '#C5B4FF',
  TransparentIndigo = 'rgba(179, 154, 249, 0.14)',
  TransparentIndigoDeep = 'rgba(104, 69, 217, 0.09)',

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
  Gray100 = '#F6F5FA',
  Gray200 = '#E9E5F1',
  Gray300 = '#D5D0E3',
  Gray400 = '#A6A0B8',
  Gray500 = '#767087',
  Gray600 = '#625B74',
  Gray700 = '#29253D',
  Gray800 = '#171425',
  Gray900 = '#100D1B'
}

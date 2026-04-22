// src/theme/index.js

const sharedPaper = {
  accent: '#E63946',
  accentDeep: '#C1272D',
  ink: '#141210',
  cream: '#F4EDE0',
  creamLight: '#FBF6EC',
  creamShadow: '#EFE6D4',
  rule: '#141210',
  muted: '#5a4a38',
  subtle: '#8a7556',
  faint: '#b8a684',
  hairline: '#c4b89a',
  warning: '#D97706',
  overlayDark: 'rgba(20, 18, 16, 0.55)',
  accentTint: '#FFF5F2',
};

const darkPalette = {
  ...sharedPaper,
  bg: '#0A1018',
  bgElev: '#111823',
  card: '#141B26',
  cardDeep: '#0F151E',
  cardBorder: '#1E2735',
  cardBorderSoft: '#1A222E',
  textPrimary: '#FFFFFF',
  textSecondary: '#C4CBD8',
  textMuted: '#6B7689',
  textSubtle: '#4A5363',

  green: '#A3E635',
  greenSoft: 'rgba(163, 230, 53, 0.12)',
  greenBorder: 'rgba(163, 230, 53, 0.35)',

  orange: '#F59E0B',
  orangeSoft: 'rgba(245, 158, 11, 0.06)',
  orangeBorder: 'rgba(245, 158, 11, 0.40)',

  red: '#EF4444',
  redSoft: 'rgba(239, 68, 68, 0.10)',
  redBorder: 'rgba(239, 68, 68, 0.45)',
  redSolid: '#DC2626',

  blue: '#2563EB',
  lightBlue: '#22D3EE',

  onScoreDark: '#0A1018',
  scoreOutline: 'transparent',
};

const lightPalette = {
  ...sharedPaper,
  bg: '#F5F7FB',
  bgElev: '#FFFFFF',
  card: '#FFFFFF',
  cardDeep: '#F1F3F8',
  cardBorder: '#E3E7EE',
  cardBorderSoft: '#EDEFF4',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',

  green: '#4D7C0F',
  greenSoft: 'rgba(132, 204, 22, 0.12)',
  greenBorder: 'rgba(77, 124, 15, 0.45)',

  orange: '#C2410C',
  orangeSoft: 'rgba(234, 88, 12, 0.08)',
  orangeBorder: 'rgba(194, 65, 12, 0.45)',

  red: '#B91C1C',
  redSoft: 'rgba(220, 38, 38, 0.08)',
  redBorder: 'rgba(185, 28, 28, 0.50)',
  redSolid: '#DC2626',

  blue: '#1D4ED8',
  lightBlue: '#0891B2',

  onScoreDark: '#FFFFFF',
  scoreOutline: 'transparent',
};

export const getColors = (mode) => (mode === 'light' ? lightPalette : darkPalette);

// Backwards-compat default (used by modals that import `colors`)
export const colors = darkPalette;

export const fonts = {
  displayRegular: 'Fraunces_400Regular',
  displayMedium: 'Fraunces_500Medium',
  displaySemibold: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  displayBlack: 'Fraunces_800ExtraBold',
  displayItalic: 'Fraunces_400Regular_Italic',
  displayItalicMedium: 'Fraunces_500Medium_Italic',
  displayItalicBold: 'Fraunces_700Bold_Italic',
  monoRegular: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemibold: 'IBMPlexMono_600SemiBold',
  monoBold: 'IBMPlexMono_700Bold',
};

export const sizes = {
  scoreMain: 120,
  scoreSlash: 104,
  overs: 34,
  masthead: 30,
  folioTitle: 28,
  emptyMark: 72,
  matchTeams: 20,
  scoreButton: 22,
  ballMark: 17,
  navNumeral: 24,
  extraFigure: 44,
  body: 14,
  bodySmall: 13,
  label: 9,
  labelSmall: 8,
  caption: 10,
  input: 20,
  inputPlaceholder: 16,
};

export const spacing = { xs: 4, sm: 6, md: 10, lg: 14, xl: 22, xxl: 32 };
export const radii = { sm: 3, md: 4, lg: 6, xl: 20 };

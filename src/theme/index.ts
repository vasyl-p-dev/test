import { Platform, TextStyle } from 'react-native';

/**
 * Color palette — organized by color family. Each family has named hue levels:
 *   color  — the canonical / "true" value of this family
 *   extraLight / light / dark / extraDark — variations, lightest → darkest
 * Families only include the levels present in the palette. Values match the
 * Figma UI-lib (file 5cd80olxcsBrvxyiqdVFJD, node 5:562, "Colours light mode").
 */
export const colors = {
  white: {
    color: '#FFFFFF',
    light: '#F5F7FF',
  },
  grey: {
    extraLight: '#BBBBBB',
    light: '#8F94A3',
    dark: '#6C727F',
    extraDark: '#131313',
  },
  tertiary: {
    color: '#2C14DD',
    light: 'rgba(44, 20, 221, 0.1)',
  },
  success: {
    color: '#009218',
  },
  error: {
    color: '#D22C2C',
    light: '#FDECEC',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radii = {
  input: 10,
  card: 16,
  hero: 48,
  pill: 300,
  chip: 16,
  iconBtn: 20,
  avatar: 100,
};

const ios = (s: string, fallback = 'sans-serif') => (Platform.OS === 'ios' ? s : fallback);

export const typography = {
  h1: { fontFamily: ios('Inter-Bold'), fontWeight: '700', fontSize: 32, lineHeight: 40 },
  h2: { fontFamily: ios('Inter-Bold'), fontWeight: '700', fontSize: 24, letterSpacing: -0.5 },
  h3: { fontFamily: ios('Inter-Medium'), fontWeight: '500', fontSize: 16, lineHeight: 20 },
  body: { fontFamily: ios('Inter-Medium'), fontWeight: '500', fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: ios('Inter-Medium'), fontWeight: '500', fontSize: 14, lineHeight: 22 },
  caption: { fontFamily: ios('Inter-SemiBold'), fontWeight: '600', fontSize: 12, letterSpacing: -0.12 },
  captionRegular: { fontFamily: ios('Inter-Regular'), fontWeight: '400', fontSize: 12 },
  captionBig: { fontFamily: ios('Inter-SemiBold'), fontWeight: '600', fontSize: 14 },
  input: { fontFamily: ios('Inter-Medium'), fontWeight: '500', fontSize: 14, letterSpacing: -0.4 },
  inputCaption: { fontFamily: ios('Inter-SemiBold'), fontWeight: '600', fontSize: 10, letterSpacing: -0.12 },
  button: { fontFamily: ios('Inter-SemiBold'), fontWeight: '600', fontSize: 16, lineHeight: 24 },
} satisfies Record<string, TextStyle>;

export const theme = { colors, spacing, radii, typography };
export type Theme = typeof theme;

/**
 * Mukja Typography System
 * 
 * Font choices:
 * - Display/Headings: "Fraunces" - a soft serif with personality
 * - Body: "DM Sans" - clean, modern, highly readable
 * 
 * For React Native, these map to system fonts with similar characteristics.
 */

export const fontFamilies = {
  // Web font families
  web: {
    display: '"Fraunces", Georgia, "Times New Roman", serif',
    body: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  // React Native font families (system fonts with similar feel)
  native: {
    display: 'System', // Use Georgia on iOS, Noto Serif on Android when available
    body: 'System',
    mono: 'monospace',
  },
} as const;

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const fontSizes = {
  // Fluid scale based on modular ratio 1.25 (Major Third)
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
} as const;

export const lineHeights = {
  none: 1,
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

// Pre-composed text styles
export const textStyles = {
  // Display styles (for hero text, large headings)
  displayLarge: {
    fontSize: fontSizes['6xl'],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  displayMedium: {
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  displaySmall: {
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
  },

  // Heading styles
  h1: {
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights.snug,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.snug,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.snug,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.normal,
  },

  // Body styles
  bodyLarge: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.relaxed,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },

  // Label styles
  labelLarge: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wide,
  },
  labelMedium: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wider,
  },

  // Caption/utility
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.wide,
  },
  overline: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.tight,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyToken = {
  fontFamilies: typeof fontFamilies;
  fontWeights: typeof fontWeights;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  letterSpacing: typeof letterSpacing;
  textStyles: typeof textStyles;
};


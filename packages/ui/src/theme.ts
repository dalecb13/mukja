/**
 * Mukja Theme
 * 
 * A unified theme object that combines all design tokens
 * for easy consumption across React Native and web.
 */

import { colors } from './tokens/colors';
import {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  textStyles,
} from './tokens/typography';
import { spacing, semanticSpacing } from './tokens/spacing';
import { radii, semanticRadii } from './tokens/radii';
import { shadowsWeb, shadowsNative } from './tokens/shadows';
import {
  durations,
  easings,
  animationConfigs,
  transitions,
} from './tokens/animations';

export const theme = {
  colors,
  typography: {
    fontFamilies,
    fontWeights,
    fontSizes,
    lineHeights,
    letterSpacing,
    textStyles,
  },
  spacing,
  semanticSpacing,
  radii,
  semanticRadii,
  shadows: {
    web: shadowsWeb,
    native: shadowsNative,
  },
  animation: {
    durations,
    easings,
    configs: animationConfigs,
    transitions,
  },
} as const;

// Light theme (default)
export const lightTheme = {
  ...theme,
  mode: 'light' as const,
  // Semantic color mappings for light mode
  semantic: {
    background: {
      primary: colors.background.primary,
      secondary: colors.background.secondary,
      tertiary: colors.background.tertiary,
      inverse: colors.background.inverse,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      tertiary: colors.text.tertiary,
      inverse: colors.text.inverse,
      muted: colors.text.muted,
    },
    border: {
      default: colors.neutral[200],
      subtle: colors.neutral[100],
      strong: colors.neutral[300],
    },
    interactive: {
      default: colors.primary[500],
      hover: colors.primary[600],
      active: colors.primary[700],
      disabled: colors.neutral[300],
    },
  },
};

// Dark theme
export const darkTheme = {
  ...theme,
  mode: 'dark' as const,
  // Semantic color mappings for dark mode
  semantic: {
    background: {
      primary: colors.neutral[900],
      secondary: colors.neutral[800],
      tertiary: colors.neutral[700],
      inverse: colors.neutral[50],
    },
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[300],
      tertiary: colors.neutral[400],
      inverse: colors.neutral[900],
      muted: colors.neutral[500],
    },
    border: {
      default: colors.neutral[700],
      subtle: colors.neutral[800],
      strong: colors.neutral[600],
    },
    interactive: {
      default: colors.primary[400],
      hover: colors.primary[300],
      active: colors.primary[500],
      disabled: colors.neutral[600],
    },
  },
};

export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';





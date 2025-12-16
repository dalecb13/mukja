/**
 * Mukja Brand Colors
 * 
 * Inspired by warm dining experiences, Korean cuisine aesthetics,
 * and the joy of sharing food with friends.
 */

export const colors = {
  // Primary - Gochugaru Red (Korean chili flake inspired)
  primary: {
    50: '#FFF5F5',
    100: '#FFE3E3',
    200: '#FFC9C9',
    300: '#FFA8A8',
    400: '#FF8787',
    500: '#E03E3E', // Main primary
    600: '#C92A2A',
    700: '#A61E1E',
    800: '#831515',
    900: '#5C0D0D',
  },

  // Secondary - Sesame (warm neutral)
  secondary: {
    50: '#FDFCFB',
    100: '#F8F6F3',
    200: '#EDE8E3',
    300: '#DDD5CB',
    400: '#C4B8A9',
    500: '#A69783', // Main secondary
    600: '#8B7A66',
    700: '#6F5F4D',
    800: '#544838',
    900: '#3A3127',
  },

  // Accent - Banchan Green (side dish inspired)
  accent: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main accent
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warm - Doenjang Gold (fermented soybean paste inspired)
  warm: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#D97706', // Main warm
    600: '#B45309',
    700: '#92400E',
    800: '#78350F',
    900: '#5C2D0E',
  },

  // Neutrals - Charcoal (grilled/ssam inspired)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
    950: '#0C0A09',
  },

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Background variants
  background: {
    primary: '#FFFBF7', // Warm off-white (like rice paper)
    secondary: '#F8F6F3',
    tertiary: '#EDE8E3',
    inverse: '#1C1917',
  },

  // Text variants
  text: {
    primary: '#1C1917',
    secondary: '#57534E',
    tertiary: '#78716C',
    inverse: '#FAFAF9',
    muted: '#A8A29E',
  },
} as const;

export type ColorToken = typeof colors;





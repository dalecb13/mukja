/**
 * Mukja Shadow System
 * 
 * Warm, soft shadows that create depth without harshness.
 * Inspired by the gentle shadows cast by candlelight dining.
 */

// Web shadows (CSS box-shadow format)
export const shadowsWeb = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(28, 25, 23, 0.05)',
  sm: '0 1px 3px 0 rgba(28, 25, 23, 0.08), 0 1px 2px -1px rgba(28, 25, 23, 0.08)',
  md: '0 4px 6px -1px rgba(28, 25, 23, 0.08), 0 2px 4px -2px rgba(28, 25, 23, 0.08)',
  lg: '0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.08)',
  xl: '0 20px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.08)',
  '2xl': '0 25px 50px -12px rgba(28, 25, 23, 0.2)',
  inner: 'inset 0 2px 4px 0 rgba(28, 25, 23, 0.05)',
  // Colored shadows for emphasis
  primaryGlow: '0 4px 14px -3px rgba(224, 62, 62, 0.3)',
  accentGlow: '0 4px 14px -3px rgba(34, 197, 94, 0.3)',
  warmGlow: '0 4px 14px -3px rgba(217, 119, 6, 0.3)',
} as const;

// React Native shadows (iOS shadowX format + Android elevation)
export const shadowsNative = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.2,
    shadowRadius: 50,
    elevation: 16,
  },
} as const;

export type ShadowsWebToken = typeof shadowsWeb;
export type ShadowsNativeToken = typeof shadowsNative;





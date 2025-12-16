/**
 * Mukja Spacing System
 * 
 * Based on an 8px grid with a 4px half-step for fine-tuning.
 * This creates visual rhythm and consistency across the app.
 */

export const spacing = {
  0: 0,
  0.5: 2,   // Half of base unit
  1: 4,     // Quarter step
  1.5: 6,
  2: 8,     // Base unit
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,    // 2x base
  5: 20,
  6: 24,    // 3x base
  7: 28,
  8: 32,    // 4x base
  9: 36,
  10: 40,   // 5x base
  11: 44,
  12: 48,   // 6x base
  14: 56,
  16: 64,   // 8x base
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// Semantic spacing aliases
export const semanticSpacing = {
  // Component internal spacing
  componentPaddingXs: spacing[2],   // 8px
  componentPaddingSm: spacing[3],   // 12px
  componentPaddingMd: spacing[4],   // 16px
  componentPaddingLg: spacing[6],   // 24px
  componentPaddingXl: spacing[8],   // 32px

  // Gap between elements
  gapXs: spacing[1],    // 4px
  gapSm: spacing[2],    // 8px
  gapMd: spacing[4],    // 16px
  gapLg: spacing[6],    // 24px
  gapXl: spacing[8],    // 32px

  // Section spacing
  sectionPaddingSm: spacing[8],   // 32px
  sectionPaddingMd: spacing[12],  // 48px
  sectionPaddingLg: spacing[16],  // 64px
  sectionPaddingXl: spacing[24],  // 96px

  // Screen edge padding
  screenPaddingXs: spacing[3],    // 12px (compact)
  screenPaddingSm: spacing[4],    // 16px (mobile)
  screenPaddingMd: spacing[6],    // 24px (tablet)
  screenPaddingLg: spacing[8],    // 32px (desktop)
} as const;

export type SpacingToken = typeof spacing;
export type SemanticSpacingToken = typeof semanticSpacing;





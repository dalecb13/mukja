/**
 * Mukja Border Radius System
 * 
 * Soft, approachable corners that feel warm and inviting,
 * like the rounded edges of Korean ceramic bowls.
 */

export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Semantic radius aliases
export const semanticRadii = {
  button: radii.lg,       // 12px - buttons feel clickable but soft
  card: radii.xl,         // 16px - cards have generous rounding
  input: radii.md,        // 8px - inputs are subtly rounded
  badge: radii.full,      // pill shape for badges/tags
  avatar: radii.full,     // circular avatars
  modal: radii['2xl'],    // 20px - modals are prominent
  tooltip: radii.md,      // 8px - tooltips are subtle
  image: radii.lg,        // 12px - images have soft corners
} as const;

export type RadiiToken = typeof radii;
export type SemanticRadiiToken = typeof semanticRadii;







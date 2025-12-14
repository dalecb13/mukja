/**
 * Mukja Animation System
 * 
 * Smooth, purposeful animations that feel natural and delightful.
 * Inspired by the gentle movements of steam rising from hot food.
 */

// Duration in milliseconds
export const durations = {
  instant: 0,
  fastest: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 500,
  // For page transitions and complex animations
  enter: 300,
  exit: 200,
  page: 400,
} as const;

// Easing curves (CSS cubic-bezier)
export const easings = {
  // Standard easings
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Expressive easings (more personality)
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',     // Bouncy
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',            // Soft deceleration
  snappy: 'cubic-bezier(0.6, 0, 0.4, 1)',               // Quick and decisive
  smooth: 'cubic-bezier(0.45, 0, 0.15, 1)',             // Smooth throughout
  
  // Entrance/exit specific
  enterScreen: 'cubic-bezier(0, 0, 0.2, 1)',            // Decelerate into view
  exitScreen: 'cubic-bezier(0.4, 0, 1, 1)',             // Accelerate out of view
} as const;

// Pre-composed animation configs for React Native Animated/Reanimated
export const animationConfigs = {
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  },
  springGentle: {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  },
  springBouncy: {
    damping: 10,
    mass: 1,
    stiffness: 180,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  },
  springStiff: {
    damping: 25,
    mass: 1,
    stiffness: 300,
    overshootClamping: true,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  },
} as const;

// CSS transition presets
export const transitions = {
  fast: `all ${durations.fast}ms ${easings.easeOut}`,
  normal: `all ${durations.normal}ms ${easings.easeOut}`,
  slow: `all ${durations.slow}ms ${easings.easeOut}`,
  color: `color ${durations.fast}ms ${easings.easeOut}, background-color ${durations.fast}ms ${easings.easeOut}`,
  transform: `transform ${durations.normal}ms ${easings.spring}`,
  opacity: `opacity ${durations.fast}ms ${easings.easeOut}`,
} as const;

export type DurationsToken = typeof durations;
export type EasingsToken = typeof easings;
export type AnimationConfigsToken = typeof animationConfigs;
export type TransitionsToken = typeof transitions;




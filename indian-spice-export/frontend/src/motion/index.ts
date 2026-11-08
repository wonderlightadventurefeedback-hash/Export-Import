import { Variants, Transition } from "framer-motion";

/**
 * Editorial Motion Foundations
 * Calm, confident, luxurious easing curves.
 */
export const EASING = {
  editorial: [0.22, 1, 0.36, 1] as const, // Smooth luxury ease out
  sharp: [0.65, 0, 0.35, 1] as const, // Confident transition
  subtle: [0.25, 0.1, 0.25, 1] as const,
};

export const TRANSITION_DEFAULTS: Transition = {
  duration: 0.65,
  ease: EASING.editorial,
};

// Word-by-word or character reveal container
export const headlineWordContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

export const headlineWordItem: Variants = {
  hidden: {
    opacity: 0,
    y: "115%",
  },
  visible: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 0.8,
      ease: EASING.editorial,
    },
  },
};

// Fade and rise scroll reveal
export const fadeRiseVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASING.editorial,
    },
  },
};

// Staggered list container
export const staggerListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Staggered card item
export const staggerCardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASING.editorial,
    },
  },
};

// Hairline drawing variant
export const hairlineVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.9,
      ease: EASING.editorial,
    },
  },
};

// Ken Burns subtle zoom
export const kenBurnsVariants: Variants = {
  initial: { scale: 1.05 },
  animate: {
    scale: 1,
    transition: {
      duration: 10,
      ease: "easeOut",
    },
  },
};

// Route curtain wipe
export const curtainVariants: Variants = {
  initial: { scaleY: 1, transformOrigin: "bottom" },
  animate: {
    scaleY: 0,
    transformOrigin: "top",
    transition: {
      duration: 0.55,
      ease: EASING.sharp,
    },
  },
  exit: {
    scaleY: 1,
    transformOrigin: "bottom",
    transition: {
      duration: 0.45,
      ease: EASING.editorial,
    },
  },
};

// Page content fade
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.editorial,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.35,
      ease: EASING.sharp,
    },
  },
};

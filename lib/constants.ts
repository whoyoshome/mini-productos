/**
 * Application-wide constants
 */

// Pagination
export const DEFAULT_PAGE_SIZE = 3;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 24;

// Image loading
export const IMAGE_LOAD_TIMEOUT_MS = 4000;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 9999,
  TOAST: 100,
  DIALOG: 60,
  MODAL_BACKDROP: 100,
  MODAL_CONTENT: 101,
} as const;

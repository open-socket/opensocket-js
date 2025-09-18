/**
 * OpenSocket Core - Vendor-agnostic real-time communication
 * @module @open-socket/core
 * @version 0.0.0
 */

// Main exports
export { OpenSocket, createOpenSocket } from './opensocket';
export type { OpenSocketConfig } from './opensocket';

// Export all types
export * from './types';

// Export version
export const VERSION = '0.0.0';

// Default export
export { OpenSocket as default } from './opensocket';

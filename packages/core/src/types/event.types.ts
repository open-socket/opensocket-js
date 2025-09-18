/**
 * Event types and interfaces
 * @module @open-socket/core/types/event
 */

/**
 * Provider event types
 */
export type ProviderEvent =
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error'
  | 'suspended'
  | 'state_change';

/**
 * Channel event types
 */
export type ChannelEvent = 'subscribed' | 'unsubscribed' | 'error' | 'message' | 'state_change';

/**
 * Generic event handler
 */
export type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

/**
 * Event emitter interface
 */
export interface EventEmitter {
  /**
   * Subscribe to an event
   * @param event - Event name
   * @param handler - Event handler
   */
  on(event: string, handler: EventHandler): void;

  /**
   * Subscribe to an event (once)
   * @param event - Event name
   * @param handler - Event handler
   */
  once(event: string, handler: EventHandler): void;

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param handler - Event handler
   */
  off(event: string, handler: EventHandler): void;

  /**
   * Emit an event
   * @param event - Event name
   * @param data - Event data
   */
  emit(event: string, data?: unknown): void;

  /**
   * Remove all listeners for an event
   * @param event - Event name
   */
  removeAllListeners(event?: string): void;
}

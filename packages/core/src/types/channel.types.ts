/**
 * Channel types and interfaces
 * @module @open-socket/core/types/channel
 */

import type { Message, MessageHandler } from './message.types';
import type { IPresence } from './presence.types';

/**
 * Channel subscription handle
 */
export interface Subscription {
  /** Unique subscription ID */
  readonly id: string;
  /** Unsubscribe from the channel */
  unsubscribe(): Promise<void>;
}

/**
 * History query options
 */
export interface HistoryOptions {
  /** Maximum number of messages to retrieve */
  limit?: number;
  /** Start time (Unix timestamp or ISO string) */
  start?: number | string;
  /** End time (Unix timestamp or ISO string) */
  end?: number | string;
  /** Retrieve in reverse order */
  reverse?: boolean;
  /** Start after this message ID */
  after?: string;
  /** Start before this message ID */
  before?: string;
}

/**
 * Channel options for creation
 */
export interface ChannelOptions {
  /** Enable encryption for this channel */
  encrypted?: boolean;
  /** Channel is private (requires authentication) */
  private?: boolean;
  /** Channel supports presence */
  presence?: boolean;
  /** Custom channel parameters */
  params?: Record<string, unknown>;
  /** Channel-specific authentication */
  auth?: {
    headers?: Record<string, string>;
    params?: Record<string, string>;
  };
}

/**
 * Channel interface for pub/sub operations
 */
export interface IChannel<T = unknown> {
  /** Channel name */
  readonly name: string;

  /** Channel state */
  readonly state: ChannelState;

  /**
   * Subscribe to channel events
   * @param event - Event name or wildcard (*)
   * @param handler - Message handler
   */
  subscribe(event: string, handler: MessageHandler<T>): Promise<Subscription>;

  /**
   * Subscribe to all channel events
   * @param handler - Message handler
   */
  subscribe(handler: MessageHandler<T>): Promise<Subscription>;

  /**
   * Publish a message to the channel
   * @param event - Event name
   * @param data - Message data
   */
  publish(event: string, data: T): Promise<void>;

  /**
   * Get presence instance for this channel
   * @throws If presence is not supported
   */
  presence(): IPresence;

  /**
   * Get message history for this channel
   * @param options - History query options
   * @throws If history is not supported
   */
  history(options?: HistoryOptions): Promise<Message<T>[]>;

  /**
   * Leave the channel and cleanup resources
   */
  leave(): Promise<void>;

  /**
   * Bind multiple event handlers at once
   * @param handlers - Map of event names to handlers
   */
  bind(handlers: Record<string, MessageHandler<T>>): void;

  /**
   * Unbind event handlers
   * @param event - Event name to unbind
   * @param handler - Specific handler to unbind (optional)
   */
  unbind(event?: string, handler?: MessageHandler<T>): void;
}

/**
 * Channel connection state
 */
export enum ChannelState {
  /** Initial state */
  INITIALIZED = 'initialized',
  /** Subscribing to channel */
  SUBSCRIBING = 'subscribing',
  /** Successfully subscribed */
  SUBSCRIBED = 'subscribed',
  /** Unsubscribing from channel */
  UNSUBSCRIBING = 'unsubscribing',
  /** Unsubscribed from channel */
  UNSUBSCRIBED = 'unsubscribed',
  /** Channel error state */
  FAILED = 'failed',
}

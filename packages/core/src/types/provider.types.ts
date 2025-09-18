/**
 * Provider types and interfaces
 * @module @open-socket/core/types/provider
 */

import type { IChannel, ChannelOptions } from './channel.types';
import type { ConnectionOptions, ConnectionState } from './connection.types';
import type { EventHandler, ProviderEvent } from './event.types';

/**
 * Provider capabilities indicating supported features
 */
export interface ProviderCapabilities {
  /** Supports presence features */
  presence: boolean;
  /** Supports message history */
  history: boolean;
  /** Supports encryption */
  encryption: boolean;
  /** Supports binary data */
  binary: boolean;
  /** Supports message acknowledgments */
  acknowledgments: boolean;
  /** Supports webhooks */
  webhooks: boolean;
  /** Authentication methods supported */
  authentication: {
    token: boolean;
    apiKey: boolean;
    custom: boolean;
  };
}

/**
 * Main provider interface that all providers must implement
 */
export interface IProvider {
  /** Provider name identifier */
  readonly name: string;

  /** Provider version */
  readonly version: string;

  /**
   * Connect to the provider
   * @param options - Connection options
   */
  connect(options?: ConnectionOptions): Promise<void>;

  /**
   * Disconnect from the provider
   */
  disconnect(): Promise<void>;

  /**
   * Get or create a channel
   * @param name - Channel name
   * @param options - Channel options
   */
  channel(name: string, options?: ChannelOptions): IChannel;

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState;

  /**
   * Subscribe to provider events
   * @param event - Event name
   * @param handler - Event handler
   */
  on(event: ProviderEvent, handler: EventHandler): void;

  /**
   * Unsubscribe from provider events
   * @param event - Event name
   * @param handler - Event handler
   */
  off(event: ProviderEvent, handler: EventHandler): void;

  /**
   * Get provider capabilities
   */
  capabilities(): ProviderCapabilities;

  /**
   * Cleanup resources
   */
  destroy(): Promise<void>;
}

/**
 * Provider constructor options
 */
export interface ProviderOptions {
  /** Enable debug mode */
  debug?: boolean;
  /** Custom logger */
  logger?: Console;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum reconnection attempts */
  maxReconnectAttempts?: number;
  /** Reconnection interval in milliseconds */
  reconnectInterval?: number;
  /** Queue messages when disconnected */
  queueOfflineMessages?: boolean;
}

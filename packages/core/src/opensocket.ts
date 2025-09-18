/**
 * Main OpenSocket class
 * @module @open-socket/core
 */

import type {
  IProvider,
  ProviderOptions,
  IChannel,
  ChannelOptions,
  ConnectionOptions,
  ProviderEvent,
  EventHandler,
  Middleware,
  MiddlewareContext,
} from './types';
import { ConnectionState, MiddlewareChain, MiddlewareOperation } from './types';
import { OpenSocketError, ErrorCode } from './types';

/**
 * OpenSocket configuration options
 */
export interface OpenSocketConfig extends ProviderOptions {
  /** Provider instance to use */
  provider: IProvider;
  /** Middleware to apply */
  middleware?: Middleware[];
  /** Global channel options */
  channelDefaults?: ChannelOptions;
}

/**
 * Main OpenSocket class for managing real-time connections
 */
export class OpenSocket {
  private provider: IProvider | null = null;
  private middlewareChain: MiddlewareChain;
  private channels: Map<string, IChannel> = new Map();
  private config: OpenSocketConfig | null = null;
  private isInitialized = false;

  constructor() {
    this.middlewareChain = new MiddlewareChain();
  }

  /**
   * Initialize OpenSocket with a provider
   * @param config - OpenSocket configuration
   */
  async initialize(config: OpenSocketConfig): Promise<void> {
    if (this.isInitialized) {
      throw new OpenSocketError('OpenSocket is already initialized', ErrorCode.INVALID_STATE);
    }

    this.config = config;
    this.provider = config.provider;

    // Add middleware
    if (config.middleware) {
      config.middleware.forEach(m => this.middlewareChain.use(m));
    }

    this.isInitialized = true;

    // Ensure async nature for consistent API
    await Promise.resolve();
  }

  /**
   * Connect to the provider
   * @param options - Connection options
   */
  async connect(options?: ConnectionOptions): Promise<void> {
    if (!this.provider) {
      throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
    }

    const context: MiddlewareContext = {
      provider: this.provider,
      operation: MiddlewareOperation.CONNECT,
      data: { options },
    };

    return this.middlewareChain.execute(context, async () => {
      if (!this.provider) {
        throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
      }
      await this.provider.connect(options);
    });
  }

  /**
   * Disconnect from the provider
   */
  async disconnect(): Promise<void> {
    if (!this.provider) {
      throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
    }

    const context: MiddlewareContext = {
      provider: this.provider,
      operation: MiddlewareOperation.DISCONNECT,
    };

    return this.middlewareChain.execute(context, async () => {
      // Leave all channels
      for (const channel of this.channels.values()) {
        await channel.leave();
      }
      this.channels.clear();

      // Disconnect provider
      if (!this.provider) {
        throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
      }
      await this.provider.disconnect();
    });
  }

  /**
   * Get or create a channel
   * @param name - Channel name
   * @param options - Channel options
   */
  channel(name: string, options?: ChannelOptions): IChannel {
    if (!this.provider) {
      throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
    }

    // Return existing channel if available
    const existingChannel = this.channels.get(name);
    if (existingChannel) {
      return existingChannel;
    }

    // Merge with default options
    const channelOptions = {
      ...this.config?.channelDefaults,
      ...options,
    };

    // Create new channel
    const channel = this.provider.channel(name, channelOptions);
    this.channels.set(name, channel);

    return channel;
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    if (!this.provider) {
      return ConnectionState.DISCONNECTED;
    }
    return this.provider.getConnectionState();
  }

  /**
   * Subscribe to provider events
   * @param event - Event name
   * @param handler - Event handler
   */
  on(event: ProviderEvent, handler: EventHandler): void {
    if (!this.provider) {
      throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
    }
    this.provider.on(event, handler);
  }

  /**
   * Unsubscribe from provider events
   * @param event - Event name
   * @param handler - Event handler
   */
  off(event: ProviderEvent, handler: EventHandler): void {
    if (!this.provider) {
      throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
    }
    this.provider.off(event, handler);
  }

  /**
   * Get provider capabilities
   */
  capabilities() {
    if (!this.provider) {
      throw new OpenSocketError('Provider not initialized', ErrorCode.PROVIDER_NOT_INITIALIZED);
    }
    return this.provider.capabilities();
  }

  /**
   * Get the current provider
   */
  getProvider(): IProvider | null {
    return this.provider;
  }

  /**
   * Change the provider (requires disconnect first)
   * @param provider - New provider instance
   */
  async switchProvider(provider: IProvider): Promise<void> {
    if (this.getConnectionState() === ConnectionState.CONNECTED) {
      await this.disconnect();
    }

    this.provider = provider;
    this.channels.clear();
  }

  /**
   * Destroy OpenSocket and cleanup resources
   */
  async destroy(): Promise<void> {
    if (this.provider) {
      await this.disconnect();
      await this.provider.destroy();
      this.provider = null;
    }
    this.channels.clear();
    this.isInitialized = false;
  }

  /**
   * Add middleware
   * @param middleware - Middleware to add
   */
  use(middleware: Middleware): void {
    this.middlewareChain.use(middleware);
  }
}

/**
 * Create a new OpenSocket instance
 * @param config - OpenSocket configuration
 */
export async function createOpenSocket(config: OpenSocketConfig): Promise<OpenSocket> {
  const openSocket = new OpenSocket();
  await openSocket.initialize(config);
  return openSocket;
}

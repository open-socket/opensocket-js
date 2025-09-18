/**
 * Mock provider for testing
 * @module @open-socket/testing-utils/mock-provider
 */

import type {
  IProvider,
  IChannel,
  ChannelOptions,
  ConnectionOptions,
  ProviderEvent,
  EventHandler,
  ProviderCapabilities,
  Subscription,
  MessageHandler,
  Message,
  HistoryOptions,
  IPresence,
  PresenceMember,
  PresenceHandler,
} from '@open-socket/core';
import { ConnectionState, PresenceEvent, ChannelState, NotSupportedError } from '@open-socket/core';

/**
 * Mock channel implementation
 */
class MockChannel<T = unknown> implements IChannel<T> {
  public readonly name: string;
  public state: ChannelState = ChannelState.INITIALIZED;
  private handlers: Map<string, Set<MessageHandler<T>>> = new Map();
  private messages: Message<T>[] = [];
  private subscriptions: Map<string, Subscription> = new Map();
  private nextSubscriptionId = 1;

  constructor(
    name: string,
    private options?: ChannelOptions
  ) {
    this.name = name;
  }

  subscribe(
    eventOrHandler: string | MessageHandler<T>,
    handler?: MessageHandler<T>
  ): Promise<Subscription> {
    const event = typeof eventOrHandler === 'string' ? eventOrHandler : '*';
    const messageHandler = typeof eventOrHandler === 'function' ? eventOrHandler : handler;
    if (!messageHandler) {
      throw new Error('Handler must be provided');
    }

    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.add(messageHandler);
    }

    const id = `sub-${this.nextSubscriptionId++}`;
    const subscription: Subscription = {
      id,
      unsubscribe: async () => {
        this.handlers.get(event)?.delete(messageHandler);
        this.subscriptions.delete(id);
      },
    };

    this.subscriptions.set(id, subscription);
    this.state = ChannelState.SUBSCRIBED;
    return Promise.resolve(subscription);
  }

  publish(event: string, data: T): Promise<void> {
    const message: Message<T> = {
      id: `msg-${Date.now()}-${Math.random()}`,
      channel: this.name,
      event,
      data,
      timestamp: Date.now(),
    };

    this.messages.push(message);

    // Notify handlers
    const handlers = this.handlers.get(event) || new Set();
    const wildcardHandlers = this.handlers.get('*') || new Set();

    for (const handler of [...handlers, ...wildcardHandlers]) {
      setTimeout(() => handler(message), 0);
    }

    return Promise.resolve();
  }

  presence(): IPresence {
    if (!this.options?.presence) {
      throw new NotSupportedError('presence', 'MockProvider');
    }
    return new MockPresence();
  }

  async history(options?: HistoryOptions): Promise<Message<T>[]> {
    if (!this.options?.presence) {
      return [];
    }

    let result = [...this.messages];

    if (options?.limit) {
      result = result.slice(-options.limit);
    }

    if (options?.reverse) {
      result.reverse();
    }

    return result;
  }

  async leave(): Promise<void> {
    this.state = ChannelState.UNSUBSCRIBED;
    this.handlers.clear();
    this.subscriptions.clear();
  }

  bind(handlers: Record<string, MessageHandler<T>>): void {
    Object.entries(handlers).forEach(([event, handler]) => {
      this.subscribe(event, handler);
    });
  }

  unbind(event?: string, handler?: MessageHandler<T>): void {
    if (!event) {
      this.handlers.clear();
    } else if (!handler) {
      this.handlers.delete(event);
    } else {
      this.handlers.get(event)?.delete(handler);
    }
  }
}

/**
 * Mock presence implementation
 */
class MockPresence implements IPresence {
  private members: Map<string, PresenceMember> = new Map();
  private handlers: Set<PresenceHandler> = new Set();
  private currentMemberId?: string;

  subscribe(
    handlerOrEvent: PresenceHandler | PresenceEvent,
    _handler?: (member: PresenceMember) => void
  ): void {
    if (typeof handlerOrEvent === 'function') {
      this.handlers.add(handlerOrEvent);
    }
  }

  unsubscribe(handler?: PresenceHandler): void {
    if (handler) {
      this.handlers.delete(handler);
    } else {
      this.handlers.clear();
    }
  }

  async get(): Promise<PresenceMember[]> {
    return Array.from(this.members.values());
  }

  async enter(data?: Record<string, unknown>): Promise<void> {
    const memberId = `member-${Date.now()}`;
    this.currentMemberId = memberId;

    const member: PresenceMember = {
      id: memberId,
      data,
      status: 'online',
      lastSeen: Date.now(),
    };

    this.members.set(memberId, member);
    this.notifyHandlers(PresenceEvent.ENTER, member);
  }

  async leave(): Promise<void> {
    if (this.currentMemberId) {
      const member = this.members.get(this.currentMemberId);
      if (member) {
        this.members.delete(this.currentMemberId);
        this.notifyHandlers(PresenceEvent.LEAVE, member);
      }
    }
  }

  async update(data: Record<string, unknown>): Promise<void> {
    if (this.currentMemberId) {
      const member = this.members.get(this.currentMemberId);
      if (member) {
        member.data = { ...member.data, ...data };
        this.notifyHandlers(PresenceEvent.UPDATE, member);
      }
    }
  }

  async count(): Promise<number> {
    return this.members.size;
  }

  private notifyHandlers(event: PresenceEvent, member: PresenceMember): void {
    this.handlers.forEach(handler => {
      setTimeout(() => handler(event, member), 0);
    });
  }
}

/**
 * Mock provider for testing OpenSocket
 */
export class MockProvider implements IProvider {
  public readonly name = 'MockProvider';
  public readonly version = '1.0.0';

  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private channels: Map<string, MockChannel> = new Map();
  private eventHandlers: Map<ProviderEvent, Set<EventHandler>> = new Map();
  private options: ConnectionOptions | undefined;

  public simulateError = false;
  public simulateDelay = 0;

  private capabilities_: ProviderCapabilities = {
    presence: true,
    history: true,
    encryption: true,
    binary: true,
    acknowledgments: true,
    webhooks: false,
    authentication: {
      token: true,
      apiKey: true,
      custom: true,
    },
  };

  async connect(options?: ConnectionOptions): Promise<void> {
    if (this.simulateError) {
      throw new Error('Simulated connection error');
    }

    if (this.simulateDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.simulateDelay));
    }

    this.options = options;
    this.state = ConnectionState.CONNECTING;
    this.emit('state_change', { state: this.state });

    await new Promise(resolve => setTimeout(resolve, 10));

    this.state = ConnectionState.CONNECTED;
    this.emit('connected', {});
    this.emit('state_change', { state: this.state });
  }

  async disconnect(): Promise<void> {
    this.state = ConnectionState.DISCONNECTING;
    this.emit('state_change', { state: this.state });

    await new Promise(resolve => setTimeout(resolve, 10));

    this.state = ConnectionState.DISCONNECTED;
    this.emit('disconnected', {});
    this.emit('state_change', { state: this.state });
  }

  channel(name: string, options?: ChannelOptions): IChannel {
    if (!this.channels.has(name)) {
      this.channels.set(name, new MockChannel(name, options));
    }
    const channel = this.channels.get(name);
    if (!channel) {
      throw new Error(`Channel ${name} not found`);
    }
    return channel;
  }

  getConnectionState(): ConnectionState {
    return this.state;
  }

  on(event: ProviderEvent, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.add(handler);
    }
  }

  off(event: ProviderEvent, handler: EventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  capabilities(): ProviderCapabilities {
    return this.capabilities_;
  }

  async destroy(): Promise<void> {
    await this.disconnect();
    this.channels.clear();
    this.eventHandlers.clear();
  }

  /**
   * Test helper: Emit an event
   */
  emit(event: ProviderEvent, data: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        setTimeout(() => handler(data), 0);
      });
    }
  }

  /**
   * Test helper: Set connection state
   */
  setConnectionState(state: ConnectionState): void {
    this.state = state;
    this.emit('state_change', { state });
  }

  /**
   * Test helper: Set capabilities
   */
  setCapabilities(capabilities: Partial<ProviderCapabilities>): void {
    this.capabilities_ = { ...this.capabilities_, ...capabilities };
  }

  /**
   * Test helper: Get all channels
   */
  getChannels(): Map<string, MockChannel> {
    return this.channels;
  }

  /**
   * Test helper: Get connection options
   */
  getConnectionOptions(): ConnectionOptions | undefined {
    return this.options;
  }

  /**
   * Test helper: Simulate receiving a message
   */
  simulateMessage(channelName: string, event: string, data: unknown): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.publish(event, data);
    }
  }
}

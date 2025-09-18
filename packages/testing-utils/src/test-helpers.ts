/**
 * Test helper utilities
 * @module @open-socket/testing-utils/test-helpers
 */

import type { IProvider, IChannel, Message } from '@open-socket/core';
import { MockProvider } from './mock-provider';

/**
 * Test helper utilities
 */
export class TestHelpers {
  /**
   * Create a mock provider with preset configuration
   */
  static createMockProvider(config?: {
    simulateError?: boolean;
    simulateDelay?: number;
    capabilities?: Record<string, boolean>;
  }): MockProvider {
    const provider = new MockProvider();
    
    if (config?.simulateError) {
      provider.simulateError = true;
    }
    
    if (config?.simulateDelay) {
      provider.simulateDelay = config.simulateDelay;
    }
    
    if (config?.capabilities) {
      provider.setCapabilities(config.capabilities as any);
    }
    
    return provider;
  }

  /**
   * Create a connected mock provider
   */
  static async createConnectedProvider(): Promise<MockProvider> {
    const provider = new MockProvider();
    await provider.connect();
    return provider;
  }

  /**
   * Create a channel with subscriptions
   */
  static async createChannelWithSubscriptions(
    provider: IProvider,
    channelName: string,
    events: string[]
  ): Promise<IChannel> {
    const channel = provider.channel(channelName);
    
    for (const event of events) {
      await channel.subscribe(event, () => {});
    }
    
    return channel;
  }

  /**
   * Generate test messages
   */
  static generateMessages(count: number, channelName = 'test'): Message[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `msg-${i}`,
      channel: channelName,
      event: `event-${i % 3}`,
      data: { index: i, test: true },
      timestamp: Date.now() + i
    }));
  }

  /**
   * Wait for messages to be received
   */
  static async waitForMessages(
    channel: IChannel,
    event: string,
    expectedCount: number,
    timeout = 5000
  ): Promise<Message[]> {
    const messages: Message[] = [];
    
    const subscription = await channel.subscribe(event, (msg) => {
      messages.push(msg);
    });
    
    const start = Date.now();
    while (messages.length < expectedCount && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    await subscription.unsubscribe();
    return messages;
  }

  /**
   * Simulate connection states
   */
  static async simulateConnectionStates(
    provider: MockProvider,
    states: string[],
    delay = 100
  ): Promise<void> {
    for (const state of states) {
      provider.setConnectionState(state as any);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Test error scenarios
   */
  static async testErrorScenario(
    fn: () => Promise<void>,
    expectedError?: string
  ): Promise<Error | null> {
    try {
      await fn();
      return null;
    } catch (error) {
      if (expectedError && !(error as Error).message.includes(expectedError)) {
        throw error;
      }
      return error as Error;
    }
  }

  /**
   * Create a test environment
   */
  static async createTestEnvironment(): Promise<{
    provider: MockProvider;
    channel: IChannel;
    cleanup: () => Promise<void>;
  }> {
    const provider = new MockProvider();
    await provider.connect();
    const channel = provider.channel('test-channel');
    
    return {
      provider,
      channel,
      cleanup: async () => {
        await channel.leave();
        await provider.destroy();
      }
    };
  }
}
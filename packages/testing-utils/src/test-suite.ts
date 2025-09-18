/**
 * Provider test suite implementation
 * @module @open-socket/testing-utils/test-suite
 */

import type { IProvider, Message } from '@open-socket/core';

/**
 * Create provider compatibility test suite
 * This is a simplified version - the full version is in opensocket-spec/test-suite
 */
export const createProviderTestSuite = (
  createProvider: () => IProvider,
  providerName: string
): void => {
  describe(`${providerName} Provider Compatibility Tests`, () => {
    let provider: IProvider;

    beforeEach(() => {
      provider = createProvider();
    });

    afterEach(async () => {
      await provider.destroy();
    });

    describe('Provider Lifecycle', () => {
      test('should connect and disconnect', async () => {
        await provider.connect();
        expect(provider.getConnectionState()).toBe('connected');

        await provider.disconnect();
        expect(provider.getConnectionState()).toBe('disconnected');
      });
    });

    describe('Channel Operations', () => {
      test('should create and use channels', async () => {
        await provider.connect();
        const channel = provider.channel('test-channel');

        expect(channel.name).toBe('test-channel');

        const messages: Message[] = [];
        await channel.subscribe('test', (msg: Message) => {
          messages.push(msg);
        });

        await channel.publish('test', { data: 'test' });

        // Wait for async propagation
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(messages).toHaveLength(1);
        expect(messages[0]?.data).toEqual({ data: 'test' });
      });
    });
  });
};

/**
 * Test utilities
 */
export const testUtils = {
  /**
   * Wait for a condition to be true
   */
  waitFor: async (condition: () => boolean, timeout = 5000, interval = 100): Promise<void> => {
    const start = Date.now();

    while (!condition() && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    if (!condition()) {
      throw new Error('Timeout waiting for condition');
    }
  },

  /**
   * Create a test message
   */
  createTestMessage: (data: unknown): Message => ({
    id: `msg-${Date.now()}-${Math.random()}`,
    channel: 'test-channel',
    event: 'test-event',
    data,
    timestamp: Date.now(),
  }),
};

import { OpenSocket, createOpenSocket } from './opensocket';
import { MockProvider } from '@open-socket/testing-utils';
import { ConnectionState } from './types';

describe('OpenSocket', () => {
  let openSocket: OpenSocket;
  let mockProvider: MockProvider;

  beforeEach(() => {
    mockProvider = new MockProvider();
    openSocket = new OpenSocket();
  });

  afterEach(async () => {
    await openSocket.destroy();
  });

  describe('Initialization', () => {
    it('should initialize with a provider', async () => {
      await openSocket.initialize({
        provider: mockProvider,
      });

      expect(openSocket.getProvider()).toBe(mockProvider);
    });

    it('should throw error if already initialized', async () => {
      await openSocket.initialize({ provider: mockProvider });

      await expect(openSocket.initialize({ provider: mockProvider })).rejects.toThrow(
        'already initialized'
      );
    });
  });

  describe('Connection Management', () => {
    beforeEach(async () => {
      await openSocket.initialize({ provider: mockProvider });
    });

    it('should connect to provider', async () => {
      await openSocket.connect();
      expect(openSocket.getConnectionState()).toBe(ConnectionState.CONNECTED);
    });

    it('should disconnect from provider', async () => {
      await openSocket.connect();
      await openSocket.disconnect();
      expect(openSocket.getConnectionState()).toBe(ConnectionState.DISCONNECTED);
    });
  });

  describe('Channel Management', () => {
    beforeEach(async () => {
      await openSocket.initialize({ provider: mockProvider });
      await openSocket.connect();
    });

    it('should create a channel', () => {
      const channel = openSocket.channel('test-channel');
      expect(channel.name).toBe('test-channel');
    });

    it('should return same channel instance', () => {
      const channel1 = openSocket.channel('test-channel');
      const channel2 = openSocket.channel('test-channel');
      expect(channel1).toBe(channel2);
    });
  });

  describe('createOpenSocket helper', () => {
    it('should create and initialize OpenSocket', async () => {
      const socket = await createOpenSocket({
        provider: mockProvider,
      });

      expect(socket).toBeInstanceOf(OpenSocket);
      expect(socket.getProvider()).toBe(mockProvider);
    });
  });
});

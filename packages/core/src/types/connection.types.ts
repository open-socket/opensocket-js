/**
 * Connection types and interfaces
 * @module @open-socket/core/types/connection
 */

/**
 * Connection state enumeration
 */
export enum ConnectionState {
  /** Initial state before connection */
  INITIALIZED = 'initialized',
  /** Currently connecting */
  CONNECTING = 'connecting',
  /** Successfully connected */
  CONNECTED = 'connected',
  /** Currently disconnecting */
  DISCONNECTING = 'disconnecting',
  /** Disconnected from provider */
  DISCONNECTED = 'disconnected',
  /** Connection suspended (temporary failure) */
  SUSPENDED = 'suspended',
  /** Connection failed permanently */
  FAILED = 'failed'
}

/**
 * Connection options for provider
 */
export interface ConnectionOptions {
  /** Authentication configuration */
  auth?: AuthOptions;
  /** Force new connection */
  forceNew?: boolean;
  /** Connection timeout in milliseconds */
  timeout?: number;
  /** Enable automatic reconnection */
  autoReconnect?: boolean;
  /** Maximum reconnection attempts */
  maxReconnectAttempts?: number;
  /** Reconnection interval in milliseconds */
  reconnectInterval?: number;
  /** Custom connection parameters */
  params?: Record<string, unknown>;
  /** Transport options */
  transports?: string[];
  /** WebSocket endpoint URL (for Socket.io) */
  url?: string;
  /** Cluster configuration (for Pusher) */
  cluster?: string;
}

/**
 * Authentication options
 */
export interface AuthOptions {
  /** API key or token */
  key?: string;
  /** Authentication token */
  token?: string;
  /** Authentication endpoint URL */
  endpoint?: string;
  /** Authentication headers */
  headers?: Record<string, string>;
  /** Authentication parameters */
  params?: Record<string, string>;
  /** Authentication method */
  method?: 'GET' | 'POST';
  /** Custom authentication callback */
  callback?: AuthCallback;
}

/**
 * Authentication callback function
 */
export type AuthCallback = (
  channel: string,
  socketId?: string
) => Promise<AuthResponse> | AuthResponse;

/**
 * Authentication response
 */
export interface AuthResponse {
  /** Authentication token or signature */
  auth: string;
  /** Additional authentication data */
  data?: Record<string, unknown>;
}
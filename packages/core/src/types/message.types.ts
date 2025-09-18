/**
 * Message types and interfaces
 * @module @open-socket/core/types/message
 */

/**
 * Message structure for real-time communication
 */
export interface Message<T = unknown> {
  /** Unique message ID */
  id: string;
  /** Channel name */
  channel: string;
  /** Event name */
  event: string;
  /** Message payload */
  data: T;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Additional message metadata */
  metadata?: MessageMetadata;
}

/**
 * Message metadata
 */
export interface MessageMetadata {
  /** Sender client ID */
  clientId?: string;
  /** Sender user ID */
  userId?: string;
  /** Message encoding */
  encoding?: string;
  /** Message was replayed from history */
  replayed?: boolean;
  /** Connection ID that sent the message */
  connectionId?: string;
  /** Custom metadata fields */
  [key: string]: unknown;
}

/**
 * Handler function for incoming messages
 */
export type MessageHandler<T = unknown> = (message: Message<T>) => void | Promise<void>;

/**
 * Options for publishing messages
 */
export interface PublishOptions {
  /** Require acknowledgment */
  ack?: boolean;
  /** Publish timeout in milliseconds */
  timeout?: number;
  /** Message metadata */
  metadata?: MessageMetadata;
  /** Message is retained */
  retained?: boolean;
}
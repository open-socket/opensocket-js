/**
 * Error types and classes
 * @module @open-socket/core/types/error
 */

/**
 * OpenSocket error codes
 */
export enum ErrorCode {
  /** Failed to establish connection */
  CONNECTION_FAILED = 'OS001',
  /** Authentication failed */
  AUTHENTICATION_FAILED = 'OS002',
  /** Channel operation failed */
  CHANNEL_ERROR = 'OS003',
  /** Failed to publish message */
  PUBLISH_FAILED = 'OS004',
  /** Failed to subscribe to channel */
  SUBSCRIPTION_FAILED = 'OS005',
  /** Operation timed out */
  TIMEOUT = 'OS006',
  /** Rate limit exceeded */
  RATE_LIMITED = 'OS007',
  /** Invalid operation for current state */
  INVALID_STATE = 'OS008',
  /** Feature not supported by provider */
  NOT_SUPPORTED = 'OS009',
  /** Network error occurred */
  NETWORK_ERROR = 'OS010',
  /** Invalid configuration */
  INVALID_CONFIG = 'OS011',
  /** Provider not initialized */
  PROVIDER_NOT_INITIALIZED = 'OS012',
  /** Channel not found */
  CHANNEL_NOT_FOUND = 'OS013',
  /** Unknown error */
  UNKNOWN = 'OS999'
}

/**
 * Base OpenSocket error class
 */
export class OpenSocketError extends Error {
  /** Error code */
  public readonly code: ErrorCode;
  
  /** Additional error details */
  public readonly details?: Record<string, unknown>;
  
  /** Original error that caused this error */
  public readonly cause?: Error;
  
  /** Timestamp when error occurred */
  public readonly timestamp: number;

  constructor(
    message: string,
    code: ErrorCode,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message);
    this.name = 'OpenSocketError';
    this.code = code;
    this.details = details;
    this.cause = cause;
    this.timestamp = Date.now();

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpenSocketError);
    }
  }

  /**
   * Convert error to JSON
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
      cause: this.cause?.message
    };
  }
}

/**
 * Connection error
 */
export class ConnectionError extends OpenSocketError {
  constructor(message: string, details?: Record<string, unknown>, cause?: Error) {
    super(message, ErrorCode.CONNECTION_FAILED, details, cause);
    this.name = 'ConnectionError';
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends OpenSocketError {
  constructor(message: string, details?: Record<string, unknown>, cause?: Error) {
    super(message, ErrorCode.AUTHENTICATION_FAILED, details, cause);
    this.name = 'AuthenticationError';
  }
}

/**
 * Channel error
 */
export class ChannelError extends OpenSocketError {
  constructor(message: string, details?: Record<string, unknown>, cause?: Error) {
    super(message, ErrorCode.CHANNEL_ERROR, details, cause);
    this.name = 'ChannelError';
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends OpenSocketError {
  constructor(message: string, details?: Record<string, unknown>, cause?: Error) {
    super(message, ErrorCode.TIMEOUT, details, cause);
    this.name = 'TimeoutError';
  }
}

/**
 * Feature not supported error
 */
export class NotSupportedError extends OpenSocketError {
  constructor(feature: string, provider: string) {
    super(
      `Feature "${feature}" is not supported by provider "${provider}"`,
      ErrorCode.NOT_SUPPORTED,
      { feature, provider }
    );
    this.name = 'NotSupportedError';
  }
}

/**
 * Error handler function type
 */
export type ErrorHandler = (error: OpenSocketError) => void | Promise<void>;
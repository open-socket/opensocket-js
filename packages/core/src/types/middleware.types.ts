/**
 * Middleware types and interfaces
 * @module @open-socket/core/types/middleware
 */

import type { Message } from './message.types';
import type { IChannel } from './channel.types';
import type { IProvider } from './provider.types';

/**
 * Middleware context passed to middleware functions
 */
export interface MiddlewareContext {
  /** Current provider instance */
  provider: IProvider;
  /** Current channel (if applicable) */
  channel?: IChannel;
  /** Message being processed */
  message?: Message;
  /** Operation type */
  operation: MiddlewareOperation;
  /** Custom context data */
  data?: Record<string, unknown>;
}

/**
 * Middleware operation types
 */
export enum MiddlewareOperation {
  /** Provider connection */
  CONNECT = 'connect',
  /** Provider disconnection */
  DISCONNECT = 'disconnect',
  /** Channel subscription */
  SUBSCRIBE = 'subscribe',
  /** Channel unsubscription */
  UNSUBSCRIBE = 'unsubscribe',
  /** Message publish */
  PUBLISH = 'publish',
  /** Message receive */
  RECEIVE = 'receive',
  /** Presence enter */
  PRESENCE_ENTER = 'presence_enter',
  /** Presence leave */
  PRESENCE_LEAVE = 'presence_leave',
  /** Presence update */
  PRESENCE_UPDATE = 'presence_update'
}

/**
 * Middleware interface for intercepting operations
 */
export interface Middleware {
  /** Middleware name for debugging */
  name?: string;

  /**
   * Pre-processing hook (before operation)
   * @param context - Middleware context
   */
  pre?(context: MiddlewareContext): Promise<void> | void;

  /**
   * Post-processing hook (after operation)
   * @param context - Middleware context
   */
  post?(context: MiddlewareContext): Promise<void> | void;

  /**
   * Error handling hook
   * @param error - Error that occurred
   * @param context - Middleware context
   */
  error?(error: Error, context: MiddlewareContext): Promise<void> | void;
}

/**
 * Middleware chain for processing
 */
export class MiddlewareChain {
  private middlewares: Middleware[] = [];

  /**
   * Add middleware to the chain
   * @param middleware - Middleware to add
   */
  use(middleware: Middleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Remove middleware from the chain
   * @param middleware - Middleware to remove
   */
  remove(middleware: Middleware): this {
    const index = this.middlewares.indexOf(middleware);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
    return this;
  }

  /**
   * Execute middleware chain
   * @param context - Middleware context
   * @param operation - Main operation to execute
   */
  async execute<T>(
    context: MiddlewareContext,
    operation: () => Promise<T>
  ): Promise<T> {
    // Execute pre-processing
    for (const middleware of this.middlewares) {
      if (middleware.pre) {
        try {
          await middleware.pre(context);
        } catch (error) {
          if (middleware.error) {
            await middleware.error(error as Error, context);
          }
          throw error;
        }
      }
    }

    let result: T;
    try {
      // Execute main operation
      result = await operation();
    } catch (error) {
      // Execute error handlers
      for (const middleware of this.middlewares) {
        if (middleware.error) {
          await middleware.error(error as Error, context);
        }
      }
      throw error;
    }

    // Execute post-processing
    for (const middleware of this.middlewares.reverse()) {
      if (middleware.post) {
        try {
          await middleware.post(context);
        } catch (error) {
          if (middleware.error) {
            await middleware.error(error as Error, context);
          }
          throw error;
        }
      }
    }

    return result;
  }
}
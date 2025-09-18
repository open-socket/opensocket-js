/**
 * Presence types and interfaces
 * @module @open-socket/core/types/presence
 */

/**
 * Presence member information
 */
export interface PresenceMember {
  /** Unique member ID */
  id: string;
  /** Member client ID */
  clientId?: string;
  /** Member user ID */
  userId?: string;
  /** Member connection ID */
  connectionId?: string;
  /** Member data */
  data?: Record<string, unknown>;
  /** Member online status */
  status?: 'online' | 'away' | 'offline';
  /** Last seen timestamp */
  lastSeen?: number;
}

/**
 * Presence event types
 */
export enum PresenceEvent {
  /** Member entered the channel */
  ENTER = 'enter',
  /** Member left the channel */
  LEAVE = 'leave',
  /** Member data updated */
  UPDATE = 'update',
  /** Presence state synchronized */
  SYNC = 'sync'
}

/**
 * Presence event handler
 */
export type PresenceHandler = (
  event: PresenceEvent,
  member: PresenceMember
) => void | Promise<void>;

/**
 * Presence interface for managing channel presence
 */
export interface IPresence {
  /**
   * Subscribe to presence events
   * @param handler - Presence event handler
   */
  subscribe(handler: PresenceHandler): void;

  /**
   * Subscribe to specific presence event
   * @param event - Presence event type
   * @param handler - Event handler
   */
  subscribe(event: PresenceEvent, handler: (member: PresenceMember) => void): void;

  /**
   * Unsubscribe from presence events
   * @param handler - Handler to remove
   */
  unsubscribe(handler?: PresenceHandler): void;

  /**
   * Get current presence members
   */
  get(): Promise<PresenceMember[]>;

  /**
   * Enter the presence set
   * @param data - Member data
   */
  enter(data?: Record<string, unknown>): Promise<void>;

  /**
   * Leave the presence set
   */
  leave(): Promise<void>;

  /**
   * Update member data
   * @param data - Updated member data
   */
  update(data: Record<string, unknown>): Promise<void>;

  /**
   * Get member count
   */
  count(): Promise<number>;
}
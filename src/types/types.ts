// --- 1. CORE ENTITIES ---

/**
 * Defines the structure of a user in the system.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string; // Optional
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date; // Optional
}

/**
 * Defines the structure of a message.
 */
export interface Message {
  id: string;
  chatId: string;
  sender: User;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string; // ID of the message this message replies to (Optional)
}

/**
 * Defines the structure of a conversation or chat.
 */
export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message; // Optional
  unreadCount: number;
  createdAt: Date;
}

// --- 2. CONTEXT STATES ---

/**
 * Defines the structure of the global state for Authentication.
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Defines the structure of the global state for Chat and Message management.
 */
export interface ChatState {
  chats: Chat[]; // List of user's chats
  activeChat: Chat | null; // The currently viewed chat
  messages: Message[]; // Messages of the active chat
  isLoading: boolean;
}

/**
 * Credentials required for login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}
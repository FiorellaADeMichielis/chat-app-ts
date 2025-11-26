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
  lastSeen?: string; // CHANGED: API returns ISO strings, not Date objects
}

// Defines the payload structure for updating user profile information.
// We use a separate type to be strict about what can be sent to the API.
export interface UserUpdatePayload {
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away';
}

/**
 * DTO (Data Transfer Object) for the message sender.
 * Optimization: Messages don't need the full user profile (email, status, etc).
 * We use Pick to create a lightweight subset of the User.
 */
export type MessageSender = Pick<User, 'id' | 'name' | 'avatar'>;

/**
 * Defines the structure of a message.
 */
export interface Message {
  id: string;
  chatId: string;
  sender: MessageSender; // FIXED: Now accepts the lightweight user object
  content: string;
  timestamp: string; // CHANGED: Safe typing for JSON responses
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string; 
}

/**
 * Defines the structure of a conversation or chat.
 */
export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: User[]; // In details, we might want full users, this is acceptable.
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string; // CHANGED: String for safety
}

// --- 2. CONTEXT STATES ---

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  chats: Chat[]; 
  activeChat: Chat | null; 
  messages: Message[]; 
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
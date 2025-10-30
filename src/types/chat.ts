export interface MessageSender {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  status: 'online' | 'offline' | 'away';
}

export interface Message {
  id: string;
  chatId: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType extends ChatState {
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  loadChats: () => Promise<void>;
  clearError: () => void;
}
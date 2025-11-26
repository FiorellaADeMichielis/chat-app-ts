import { apiClient } from '../lib/api';
import type { Chat, Message } from '../types/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// MOCK DATA: Fixed to match new types (ISO Strings & Lightweight Senders)
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Tech Team',
    type: 'group',
    participants: [], 
    unreadCount: 2,
    createdAt: new Date().toISOString(),
    lastMessage: {
      id: 'm1',
      chatId: '1',
      content: 'Short reply 49',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
      type: 'text',
      status: 'read',
      sender: { id: '2', name: 'Alice', avatar: '' }
    }
  },
  {
    id: '2',
    name: 'John Doe',
    type: 'direct',
    participants: [],
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    lastMessage: {
      id: 'm2',
      chatId: '2',
      content: 'See you tomorrow!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      type: 'text',
      status: 'delivered',
      sender: { id: '3', name: 'John Doe', avatar: '' }
    }
  }
];

const MOCK_MESSAGES: Message[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `msg-${i}`,
  chatId: '1', // All belong to Tech Team for demo
  content: i % 2 === 0 
    ? `This is message number ${i}. Just testing virtualization.` 
    : `Short reply ${i}.`,
  sender: i % 2 === 0 
    ? { id: '1', name: 'You', avatar: '' } // Current User
    : { id: '2', name: 'Alice', avatar: '' }, // Other
  timestamp: new Date(Date.now() - 1000 * 60 * (50 - i)).toISOString(), // Staggered times
  type: 'text',
  status: 'read'
}));

export const getChatsService = async (): Promise<Chat[]> => {
  if (USE_MOCK) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CHATS), 500));
  }
  const response = await apiClient.get<Chat[]>('/chats');
  return response.data;
};

export const getMessagesService = async (chatId: string): Promise<Message[]> => {
  if (USE_MOCK) {
    // Filter mocks by chat ID
    return new Promise(resolve => 
      setTimeout(() => resolve(MOCK_MESSAGES.filter(m => m.chatId === chatId)), 400)
    );
  }
  const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`);
  return response.data;
};

export const sendMessageService = async (chatId: string, content: string): Promise<Message> => {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: `new-${Date.now()}`,
          chatId,
          content,
          sender: { id: '1', name: 'You', avatar: '' }, // Mock current user
          timestamp: new Date().toISOString(),
          type: 'text',
          status: 'sent'
        });
      }, 300);
    });
  }
  const response = await apiClient.post<Message>(`/chats/${chatId}/messages`, { content });
  return response.data;
};
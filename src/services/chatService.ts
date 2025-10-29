import { apiClient } from '../lib/api';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: Date;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const response = await apiClient.get('/chats');
    return response.data;
  },

  async getMessages(chatId: string): Promise<Message[]> {
    const response = await apiClient.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  async sendMessage(chatId: string, content: string): Promise<Message> {
    const response = await apiClient.post(`/chats/${chatId}/messages`, {
      content,
    });
    return response.data;
  },

  async createChat(participantIds: string[], name?: string): Promise<Chat> {
    const response = await apiClient.post('/chats', {
      participantIds,
      name,
    });
    return response.data;
  },

  async markAsRead(chatId: string): Promise<void> {
    await apiClient.patch(`/chats/${chatId}/read`);
  },
};
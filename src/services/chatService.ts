import { apiClient } from '../lib/api';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: string | Date;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

const MOCK_MODE = true;

//mock data
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Juan Perez',
    type: 'direct',
    participants: ['1', '2'],
    unreadCount: 2,
    lastMessage: {
      id: '1',
      chatId: '1',
      content: 'Hola! Cómo estás?',
      sender: { id: '2', name: 'Juan Perez' },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  },
  {
    id: '2',
    name: 'Maria Lopez',
    type: 'direct',
    participants: ['1', '3'],
    unreadCount: 0,
    lastMessage: {
      id: '2',
      chatId: '2',
      content: 'Nos vemos mañana',
      sender: { id: '3', name: 'Maria Lopez' },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  },
  {
    id: '3',
    name: 'Equipo Proyecto',
    type: 'group',
    participants: ['1', '2', '3', '4'],
    unreadCount: 5,
    lastMessage: {
      id: '3',
      chatId: '3',
      content: 'Reunión a las 3pm',
      sender: { id: '4', name: 'Carlos' },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  },
];

const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      chatId: '1',
      content: 'Hola!',
      sender: { id: '2', name: 'Juan Perez' },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '2',
      chatId: '1',
      content: 'Hey! Todo bien, y tú?',
      sender: { id: '1', name: 'Demo User' },
      timestamp: new Date(Date.now() - 7000000).toISOString(),
    },
    {
      id: '3',
      chatId: '1',
      content: 'Genial! Trabajando en el proyecto',
      sender: { id: '2', name: 'Juan Perez' },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  '2': [
    {
      id: '4',
      chatId: '2',
      content: 'Hola Maria!',
      sender: { id: '1', name: 'Demo User' },
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: '5',
      chatId: '2',
      content: 'Nos vemos mañana',
      sender: { id: '3', name: 'Maria Lopez' },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  '3': [
    {
      id: '6',
      chatId: '3',
      content: 'Reunión a las 3pm',
      sender: { id: '4', name: 'Carlos' },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
};

export const chatService = {
  async getChats(): Promise<Chat[]> {
    if (MOCK_MODE) {
      console.log('🎭 Mock getChats');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockChats;
    }
    
    const response = await apiClient.get<Chat[]>('/chats');
    return response.data;
  },

  async getMessages(chatId: string): Promise<Message[]> {
    if (MOCK_MODE) {
      console.log('🎭 Mock getMessages:', chatId);
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockMessages[chatId] || [];
    }
    
    const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`);
    return response.data;
  },

  async sendMessage(chatId: string, content: string): Promise<Message> {
    if (MOCK_MODE) {
      console.log('🎭 Mock sendMessage:', { chatId, content });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        chatId,
        content,
        sender: { id: '1', name: 'Demo User' },
        timestamp: new Date().toISOString(),
      };

      if (!mockMessages[chatId]) {
        mockMessages[chatId] = [];
      }
      mockMessages[chatId].push(newMessage);
      
      //mock reply after 2 second
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          chatId,
          content: 'Mensaje recibido! 👍',
          sender: { 
            id: '2', 
            name: mockChats.find(c => c.id === chatId)?.name || 'Usuario' 
          },
          timestamp: new Date().toISOString(),
        };
        mockMessages[chatId].push(autoReply);
      }, 2000);
      
      return newMessage;
    }
    
    const response = await apiClient.post<Message>(`/chats/${chatId}/messages`, {
      content,
    });
    return response.data;
  },

  async createChat(participantIds: string[], name?: string): Promise<Chat> {
    if (MOCK_MODE) {
      console.log('🎭 Mock createChat:', { participantIds, name });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        id: Date.now().toString(),
        name: name || 'Nuevo Chat',
        type: participantIds.length > 2 ? 'group' : 'direct',
        participants: participantIds,
        unreadCount: 0,
      };
    }
    
    const response = await apiClient.post<Chat>('/chats', {
      participantIds,
      name,
    });
    return response.data;
  },

  async markAsRead(chatId: string): Promise<void> {
    if (MOCK_MODE) {
      console.log('🎭 Mock markAsRead:', chatId);
      await new Promise(resolve => setTimeout(resolve, 100));
    
      const chat = mockChats.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
      }
      return;
    }
    
    await apiClient.patch(`/chats/${chatId}/read`);
  },
};
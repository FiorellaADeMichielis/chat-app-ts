import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';


interface User {
  id: string;
  email: string;
  name: string;
  status: 'online' | 'offline' | 'away';
}

interface Message {
  id: string;
  chatId: string;
  sender: User;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
}

interface ChatContextType extends ChatState {
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);


const mockUsers: User[] = [
  {
    id: '2',
    name: 'Juan Perez',
    email: 'juan@example.com',
    status: 'online'
  },
  {
    id: '3', 
    name: 'Maria Lopez',
    email: 'maria@example.com',
    status: 'online'
  }
];

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Juan Perez',      
    type: 'direct',
    participants: [mockUsers[0]],
    unreadCount: 2,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Maria Lopez',     
    type: 'direct', 
    participants: [mockUsers[1]],
    unreadCount: 0,
    createdAt: new Date('2024-01-02')
  }
];

type ChatAction =
  | { type: 'SET_ACTIVE_CHAT'; payload: Chat | null }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'MARK_CHAT_AS_READ'; payload: string };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      const newMessages = [...state.messages, action.payload];
      const updatedChats = state.chats.map(chat => 
        chat.id === action.payload.chatId
          ? { ...chat, lastMessage: action.payload }
          : chat
      );
      return { 
        ...state, 
        messages: newMessages, 
        chats: updatedChats 
      };
    case 'MARK_CHAT_AS_READ':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      };
    default:
      return state;
  }
};

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: []
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    dispatch({ type: 'SET_CHATS', payload: mockChats });
    
    if (user) {
      const initialMessages: Message[] = [
        {
          id: '1',
          chatId: '1',
          sender: mockUsers[0],
          content: 'Hi!',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          status: 'read'
        },
        {
          id: '2', 
          chatId: '1',
          sender: user,
          content: 'Hey there! How is everything going?',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text',
          status: 'read'
        }
      ];
      dispatch({ type: 'SET_MESSAGES', payload: initialMessages });
    }
  }, [user]);

  const setActiveChat = (chat: Chat | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
    if (chat) {
      dispatch({ type: 'MARK_CHAT_AS_READ', payload: chat.id });
    }
  };

  const sendMessage = (content: string) => {
    if (!state.activeChat || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: state.activeChat.id,
      sender: user,
      content: content,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

    // Template of a reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: state.activeChat!.id,
        sender: mockUsers.find(u => u.name === state.activeChat!.name) || mockUsers[0],
        content: 'Hey! Give me a minute and I will read your message',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      };
      dispatch({ type: 'ADD_MESSAGE', payload: replyMessage });
    }, 2000);
  };

  const value: ChatContextType = {
    chats: state.chats,
    activeChat: state.activeChat,
    messages: state.messages,
    setActiveChat,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
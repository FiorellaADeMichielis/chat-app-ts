import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService, type Chat as ApiChat, type Message as ApiMessage } from '../services/chatService';
import type { Chat, Message, ChatState, ChatContextType } from '../types/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatAction =
  | { type: 'SET_ACTIVE_CHAT'; payload: Chat | null }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'MARK_CHAT_AS_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    case 'SET_CHATS':
      return { ...state, chats: action.payload, error: null };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, error: null };
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: [],
  isLoading: false,
  error: null,
};

const adaptMessage = (apiMessage: ApiMessage): Message => {
  return {
    id: apiMessage.id,
    chatId: apiMessage.chatId,
    content: apiMessage.content,
    timestamp: new Date(apiMessage.timestamp),
    type: 'text',
    status: 'read',
    sender: {
      id: apiMessage.sender.id,
      name: apiMessage.sender.name
    }
  };
};

const adaptChat = (apiChat: ApiChat): Chat => {
  return {
    id: apiChat.id,
    name: apiChat.name,
    type: apiChat.type,
    participants: apiChat.participants,
    lastMessage: apiChat.lastMessage ? adaptMessage(apiChat.lastMessage) : undefined,
    unreadCount: apiChat.unreadCount,
    createdAt: new Date(),
  };
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadChats();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (state.activeChat) {
      loadMessages(state.activeChat.id);
    }
  }, [state.activeChat?.id]);

  const loadChats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const apiChats = await chatService.getChats();
      const adaptedChats = apiChats.map(adaptChat);
      dispatch({ type: 'SET_CHATS', payload: adaptedChats });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los chats';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading chats:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const apiMessages = await chatService.getMessages(chatId);
      const adaptedMessages = apiMessages.map(adaptMessage);
      dispatch({ type: 'SET_MESSAGES', payload: adaptedMessages });
      
      await chatService.markAsRead(chatId);
      dispatch({ type: 'MARK_CHAT_AS_READ', payload: chatId });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los mensajes';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading messages:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setActiveChat = (chat: Chat | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!state.activeChat || !user) return;

    try {
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId: state.activeChat.id,
        sender: {
          id: user.id,
          name: user.name,
        },
        content: content,
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: optimisticMessage });

      const apiMessage = await chatService.sendMessage(state.activeChat.id, content);
      const realMessage = adaptMessage(apiMessage);
      
      dispatch({ type: 'SET_MESSAGES', payload: 
        state.messages.map(msg => 
          msg.id === optimisticMessage.id ? realMessage : msg
        )
      });

      dispatch({ 
        type: 'SET_CHATS', 
        payload: state.chats.map(chat =>
          chat.id === state.activeChat!.id
            ? { ...chat, lastMessage: realMessage }
            : chat
        )
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al enviar el mensaje';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: ChatContextType = {
    chats: state.chats,
    activeChat: state.activeChat,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    setActiveChat,
    sendMessage,
    loadChats,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
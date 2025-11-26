import React, { createContext, useState, useEffect,type  ReactNode, useCallback } from 'react';
import type { Chat, ChatState, Message } from '../types/types';
import { getChatsService, getMessagesService, sendMessageService } from '../services/chatService';
import toast from 'react-hot-toast';

interface ChatContextType extends ChatState {
  selectChat: (chat: Chat) => void;
  sendMessage: (content: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load Chats on Mount
  useEffect(() => {
    loadChats();
  }, []);

  // 2. Load Messages when Active Chat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
    } else {
      setMessages([]);
    }
  }, [activeChat?.id]); // Only re-run if ID changes

  const loadChats = async () => {
    try {
      const data = await getChatsService();
      setChats(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load chats');
    }
  };

  const loadMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const data = await getMessagesService(chatId);
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = useCallback((chat: Chat) => {
    if (activeChat?.id === chat.id) return;
    setActiveChat(chat);
    if (chat.unreadCount > 0) {
      setChats(prevChats => prevChats.map(c => 
        c.id === chat.id 
          ? { ...c, unreadCount: 0 } 
          : c
      ));
    }
  }, [activeChat]);

  const sendMessage = async (content: string) => {
    if (!activeChat) return;

    // Optional: Optimistic Update here (add to list before API response)
    // For now, we wait for the mock service to return the standardized message
    try {
      const newMessage = await sendMessageService(activeChat.id, content);
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update last message in chat list (optional polish)
      setChats(prev => prev.map(c => 
        c.id === activeChat.id ? { ...c, lastMessage: newMessage } : c
      ));

    } catch (error) {
      console.error(error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  return (
    <ChatContext.Provider value={{ 
      chats, 
      activeChat, 
      messages, 
      isLoading, 
      selectChat, 
      sendMessage,
      refreshChats: loadChats 
    }}>
      {children}
    </ChatContext.Provider>
  );
};
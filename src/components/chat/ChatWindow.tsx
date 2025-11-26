import React, { useState, useRef, useMemo } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import type { Message } from '../../types/types';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageBubble } from './MessageBubble';

export const ChatWindow: React.FC = () => {
  const { activeChat, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Ref for the virtual list to control scroll programmatically if needed
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // MEMOIZATION: Filter messages only when dependencies change, not on every render.
  const chatMessages = useMemo(() => {
    if (!activeChat) return [];
    
    return messages.filter(msg => msg.chatId === activeChat.id);
  }, [messages, activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(newMessage.trim());
      setNewMessage(''); 
      // Virtuoso handles auto-scroll, but we can force it if needed:
      // virtuosoRef.current?.scrollToIndex({ index: chatMessages.length, behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-secondary h-full">
      {/* --- HEADER --- */}
      <div className="bg-primary border-b border-default px-6 py-4 shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
            <span className="text-accent font-bold text-lg">
              {activeChat.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-primary">{activeChat.name}</h3>
            <p className="text-xs text-secondary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              {activeChat.type === 'direct' ? 'Online' : `${activeChat.participants.length} members`}
            </p>
          </div>
        </div>
      </div>

      {/* --- VIRTUALIZED CHAT AREA --- */}
      <div className="flex-1 p-0 overflow-hidden bg-secondary"> 
        {/* Note: Virtuoso takes 100% height of parent */}
        {chatMessages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-secondary opacity-50">
             <Smile size={48} className="mb-2" />
             <p>No messages yet. Say hello!</p>
           </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: '100%' }}
            data={chatMessages}
            // initialTopMostItemIndex is key for starting at the bottom
            initialTopMostItemIndex={chatMessages.length - 1}
            // followOutput: Auto-scrolls only if user is already at the bottom
            followOutput={'auto'}
            alignToBottom // Ensures content sits at bottom if list is short
            itemContent={(index, message) => (
              <MessageBubble 
                message={message} 
                isOwnMessage={message.sender.id === user?.id} 
              />
            )}
          />
        )}
      </div>

      {/* --- INPUT AREA --- */}
      <div className="bg-primary border-t border-default p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            disabled={isSending}
            className="text-secondary hover:text-primary"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-secondary border-transparent focus:border-accent text-primary rounded-full px-4"
              disabled={isSending}
              autoFocus
            />
          </div>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!newMessage.trim() || isSending}
            isLoading={isSending}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatTime } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ChatWindow: React.FC = () => {
  const { activeChat, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() && activeChat) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const chatMessages = messages.filter(msg => msg.chatId === activeChat?.id);

  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-secondary h-full">
      {/* Chat header */}
      <div className="bg-primary border-b border-default px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 text-blue-600 font-semibold">
              {activeChat.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-primary">{activeChat.name}</h3>
            <p className="text-sm text-secondary">
              {activeChat.type === 'direct' ? 'Online' : `${activeChat.participants.length} users`}
            </p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatMessages.map(message => {
          const isOwnMessage = message.sender.id === user?.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? 'bg-primary text-primary rounded-br-none'
                    : 'bg-primary text-primary rounded-bl-none border border-default'
                }`}
              >
                {!isOwnMessage && (
                  <p className="text-xs font-medium text-accent-dark mb-1">
                    {message.sender.name}
                  </p>
                )}
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 text-right ${
                    isOwnMessage ? 'text-tertiary' : 'text-secondary'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* message input */}
      <div className="bg-primary border-t border-default p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="w-5 h-5 text-secondary" />
          </Button>
          
          <div className="flex-1">
            <Input
              placeholder="Type something..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-tertiary border-0 text-secondary focus:ring-1 focus:ring-indigo-900"
            />
          </div>
          
          <Button type="button" variant="ghost" size="sm">
            <Smile className="w-5 h-5 text-secondary" />
          </Button>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5 text-secondary" />
          </Button>
        </form>
      </div>
    </div>
  );
};
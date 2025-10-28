import React, { useState } from 'react';
import { Search, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { useTheme } from '../../contexts/ThemeContext';
import { formatTime } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { chats, activeChat, setActiveChat } = useChat();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <div className="flex flex-col w-80 bg-sidebar border-r border-default h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-header border-b border-default">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-avatar rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-avatar-icon" />
          </div>
          <div>
            <p className="font-semibold text-primary">{user?.name}</p>
            <p className="text-sm text-secondary capitalize">{user?.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-secondary" />
            ) : (
              <Sun className="w-4 h-4 text-secondary" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 text-secondary" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-default bg-sidebar">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-search-input text-primary border-search-border"
          />
        </div>
      </div>

      {/* Chats*/}
      <div className="flex-1 overflow-y-auto bg-sidebar">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer border-b border-chat-item hover:bg-chat-hover transition-colors ${
              activeChat?.id === chat.id ? 'bg-chat-active border-l-4 border-chat-active-border' : ''
            }`}
            onClick={() => setActiveChat(chat)}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-chat-avatar rounded-full flex items-center justify-center mr-3">
              <div className="w-6 h-6 text-chat-avatar-text font-semibold">
                {chat.name.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-primary truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-secondary whitespace-nowrap">
                  {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary truncate">
                  {chat.lastMessage?.content || 'No messages'}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-badge text-badge-text text-xs rounded-full px-2 py-1 min-w-5 text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
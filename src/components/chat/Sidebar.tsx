import React, { useState } from 'react';
import { Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { formatTime } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { chats, activeChat, setActiveChat } = useChat();
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
    <div className="flex flex-col w-80 bg-white border-r border-gray-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.status}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chats*/}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              activeChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => setActiveChat(chat)}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <div className="w-6 h-6 text-blue-600 font-semibold">
                {chat.name.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage?.content || 'No messages'}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
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
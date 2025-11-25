import React, { useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import type { AppView } from '../../types/navigation';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

// Menu options configuration
const MENU_OPTIONS = [
  {
    id: 'profile' as AppView,
    label: 'Profile',
    icon: User,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'settings' as AppView,
    label: 'Settings',
    icon: Settings,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
  },
] as const;

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, anchorRef }) => {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking somewhere else
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  // Close the menu on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Navigation handler
  const handleNavigate = (view: AppView) => {
    navigateTo(view);
    onClose();
  };

  // logout handler
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className="absolute top-full left-0 mt-2 w-64 bg-primary border border-default rounded-lg shadow-lg z-50"
        role="menu"
        aria-label="User menu"
      >
        {/* User info header */}
        <div className="px-4 py-3 border-b border-default">
          <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
          <p className="text-xs text-secondary truncate">{user.email}</p>
          <div className="mt-2 flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                user.status === 'online'
                  ? 'bg-green-500'
                  : user.status === 'away'
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
              aria-label={`Status: ${user.status}`}
            />
            <span className="ml-2 text-xs text-secondary capitalize">{user.status}</span>
          </div>
        </div>

        {/* Menu options */}
        <div className="py-2">
          {MENU_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleNavigate(option.id)}
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-secondary transition-colors"
                role="menuitem"
              >
                <div className={`p-2 rounded-lg ${option.bgColor}`}>
                  <Icon size={18} className={option.color} />
                </div>
                <span className="text-sm text-primary">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="border-t border-default py-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            role="menuitem"
          >
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};
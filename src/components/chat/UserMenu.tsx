import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const MENU_OPTIONS = [
  {
    path: '/profile',
    label: 'Profile',
    icon: UserIcon,
    color: 'text-blue-600',
    bgColor: 'bg-secondary',
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-secondary',
  },
] as const;

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, anchorRef }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle Click Outside
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

  // Escape Key Handling
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      onClose();
      navigate('/login'); 
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={menuRef}
        className="absolute top-full left-0 mt-2 w-64 bg-primary border border-default rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        role="menu"
        aria-label="User menu"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-default">
          <p className="text-sm font-semibold text-primary truncate">
            {user.name}
          </p>
          <p className="text-xs text-secondary truncate">
            {user.email}
          </p>
          <div className="mt-2 flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                user.status === 'online'
                  ? 'bg-green-500'
                  : user.status === 'away'
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            />
            <span className="ml-2 text-xs text-secondary capitalize">
              {user.status}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="py-2">
          {MENU_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.path}
                onClick={() => handleNavigate(option.path)}
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-secondary transition-colors"
                role="menuitem"
              >
                <div className={`p-2 rounded-lg ${option.bgColor}`}>
                  <Icon size={18} className={option.color} />
                </div>
                <span className="text-sm text-primary">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="border-t border-default py-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors text-red-600"
            role="menuitem"
          >
            <div className="p-2 rounded-lg bg-red-50">
              <LogOut size={18} />
            </div>
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};
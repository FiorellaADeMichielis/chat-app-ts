import React from 'react';
import { ArrowLeft, Camera, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ProfileView: React.FC = () => {
  const { user } = useAuth();
  const { goBack } = useNavigation();

  if (!user) return null;

  return (
    <div className="flex-1 bg-secondary h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-primary border-b border-default px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={goBack}
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-avatar rounded-full flex items-center justify-center">
              <span className="text-5xl text-avatar-icon font-semibold">
                {user.name.charAt(0)}
              </span>
            </div>
            <button
              className="absolute bottom-0 right-0 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent-dark transition-colors"
              aria-label="Change profile picture"
            >
              <Camera size={20} />
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-primary">{user.name}</h2>
          <p className="text-secondary">{user.email}</p>
          <div className="mt-2 flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                user.status === 'online'
                  ? 'bg-green-500'
                  : user.status === 'away'
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            />
            <span className="ml-2 text-sm text-secondary capitalize">{user.status}</span>
          </div>
        </div>

        {/* Info form */}
        <div className="bg-primary rounded-lg border border-default p-6 space-y-4">
          <h3 className="text-lg font-semibold text-primary mb-4">Personal Information</h3>
          
          <Input
            label="Name"
            type="text"
            value={user.name}
            icon={<UserIcon size={18} />}
            readOnly
          />

          <Input
            label="Email"
            type="email"
            value={user.email}
            icon={<Mail size={18} />}
            readOnly
          />

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Status
            </label>
            <select
              className="w-full px-4 py-2 bg-tertiary border border-default rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={user.status}
              onChange={(e) => {
                // Implement status change logic here
                console.log('Change status to:', e.target.value);
              }}
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="pt-4">
            <Button className="w-full" disabled>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
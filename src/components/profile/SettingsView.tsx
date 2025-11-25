import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook de React Router
import { ArrowLeft, Bell, Lock, Globe, Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const SettingsView: React.FC = () => {
  const navigate = useNavigate(); // 2. Inicializamos el hook
  const { theme, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          label: 'Theme',
          description: 'Choose your preferred theme',
          control: (
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm"
            >
              {theme === 'light' ? 'Light' : 'Dark'}
            </button>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          label: 'Push Notifications',
          description: 'Receive notifications for new messages',
          control: (
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
          ),
        },
        {
          label: 'Sound',
          description: 'Play sound for notifications',
          control: (
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
            />
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      settings: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          control: (
            <button className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-tertiary transition-colors text-sm">
              Enable
            </button>
          ),
        },
      ],
    },
    {
      title: 'Language',
      icon: Globe,
      settings: [
        {
          label: 'App Language',
          description: 'Choose your preferred language',
          control: (
            <select className="px-4 py-2 bg-secondary border border-default rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option>English</option>
              <option>Spanish</option>
              <option>Portuguese</option>
            </select>
          ),
        },
      ],
    },
  ];

  return (
    <div className="flex-1 bg-secondary h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-primary border-b border-default px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)} // 3. Navegación hacia atrás correcta
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-primary">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-primary rounded-lg border border-default overflow-hidden">
              <div className="px-6 py-4 border-b border-default flex items-center space-x-3">
                <Icon size={20} className="text-accent" />
                <h2 className="text-lg font-semibold text-primary">{section.title}</h2>
              </div>
              <div className="divide-y divide-default">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-primary">{setting.label}</p>
                      <p className="text-sm text-secondary mt-1">{setting.description}</p>
                    </div>
                    <div className="flex-shrink-0">{setting.control}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
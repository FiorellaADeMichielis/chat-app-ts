import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts & Guards
import ProtectedRoute from './components/layout/protectedRoute';
import { MainLayout } from './components/layout/mainLayout';

// Pages / Views
import AuthScreen from './components/pages/AuthScreen';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/profile/SettingsView';
import { ChatWindow } from './components/chat/ChatWindow';
import { ChatPlaceholder } from './components/chat/chatPlaceholder';
import { useChat } from './hooks/useChat';

// A wrapper to decide whether to show Window or Placeholder
const ChatRoute: React.FC = () => {
  const { activeChat } = useChat();
  return activeChat ? <ChatWindow /> : <ChatPlaceholder />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/login" element={<AuthScreen />} />
            <Route path="/register" element={<AuthScreen />} />

            {/* --- Protected Routes --- */}
            {/*Check if user is logged in */}
            <Route element={<ProtectedRoute />}>
              
              {/* Provide Chat Data to children */}
              <Route element={
                <ChatProvider>
                  <MainLayout />
                </ChatProvider>
              }>
                {/*Define the views */}
                <Route path="/" element={<ChatRoute />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/settings" element={<SettingsView />} />
              </Route>
              
            </Route>

            {/* --- Fallback --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
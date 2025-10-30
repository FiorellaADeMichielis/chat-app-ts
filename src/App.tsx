import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ChatProvider } from './contexts/ChatContext';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/chat/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { ThemeProvider } from './contexts/ThemeContext';
import { useChat } from './hooks/useChat';

const ChatApp: React.FC = () => {
  const { activeChat } = useChat();

  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar />
      <div className="flex-1 flex">
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-primary">
            <div className="text-center">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 text-accent-dark font-semibold text-2xl">💬</div>
              </div>
              <h2 className="text-2xl font-semibold text-primary mb-2">
                Chat App
              </h2>
              <p className="text-secondary">
                Choose someone to start chatting!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('AppContent - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Showing authForm'); //Debug
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <AuthForm />
      </div>
    );
  }

  console.log('User authenticated'); //Debug
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

function App() {
  console.log('Rendering...'); // Debug
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
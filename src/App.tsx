import React from 'react';
import { AuthProvider} from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ChatProvider} from './contexts/ChatContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/chat/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { ThemeProvider } from './contexts/ThemeContext';
import { useChat } from './hooks/useChat';


const ChatApp: React.FC = () => {
  const { activeChat } = useChat();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex">
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 text-blue-600 font-semibold text-2xl">💬</div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Chat App
              </h2>
              <p className="text-gray-600">
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:bg-blue-100 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 to-purple-400 p-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
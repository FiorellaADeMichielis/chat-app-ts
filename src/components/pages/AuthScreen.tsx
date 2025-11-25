import React from 'react';
import { AuthForm } from '../auth/AuthForm';

const AuthScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 transition-colors">
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-accent tracking-tight">Chat-App</h1>
      </div>
      <AuthForm />
    </div>
  );
};

export default AuthScreen;
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? <LoginForm /> : <SignUpForm />}
      
      <div className="text-center mt-4">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-accent-dark hover:underline text-sm"
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};
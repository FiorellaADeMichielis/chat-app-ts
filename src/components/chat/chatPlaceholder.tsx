import React from 'react';

export const ChatPlaceholder: React.FC = () => {
  return (
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
  );
};
import React, { memo } from 'react';
import { formatTime } from '../../lib/utils'; // Asegúrate de tener esto
import type { Message } from '../../types/types'; // Ajusta la ruta a tus tipos

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

// MEMOIZATION: This prevents the message from re-rendering unless its props change.
export const MessageBubble = memo(({ message, isOwnMessage }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div
        className={`max-w-[85%] lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-accent text-white rounded-br-none'
            : 'bg-primary text-primary rounded-bl-none border border-default'
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-bold text-accent mb-1">
            {message.sender.name}
          </p>
        )}
        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-1 text-right ${
            isOwnMessage ? 'text-white/80' : 'text-secondary'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
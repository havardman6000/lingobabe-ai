// src/components/MessageUsageDisplay/index.tsx
import { MessageStats } from '@/types/messageStore';
import React from 'react';

interface MessageUsageDisplayProps {
  stats: MessageStats;
  onPurchase: () => void;
  className?: string;
}

const MessageUsageDisplay: React.FC<MessageUsageDisplayProps> = ({ stats, onPurchase, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 px-4 py-2 bg-gray-900 rounded-lg ${className}`}>
      <div className="text-sm text-green-400">
        Messages Remaining: {stats.messagesRemaining}/50
      </div>
      <button
        onClick={onPurchase}
        className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Buy More
      </button>
    </div>
  );
};

export default MessageUsageDisplay;

import React from 'react';

interface MessageUsageDisplayProps {
  messagesRemaining: number;
  totalMessages: number;
}

const MessageUsageDisplay: React.FC<MessageUsageDisplayProps> = ({ messagesRemaining, totalMessages }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 rounded-lg">
      <div className="text-sm text-green-400">
        Messages Remaining: {messagesRemaining}/50
      </div>
      <div className="h-4 w-px bg-gray-700" />
      <div className="text-sm text-green-400">
        Messages Used: {totalMessages}
      </div>
    </div>
  );
};

export default MessageUsageDisplay;
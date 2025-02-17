// src/components/DynamicBar.tsx
import React from 'react';

const DynamicBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <button className="p-2">
            <img src="/icons/photo.png" alt="Photo" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button className="p-2">
            <img src="/icons/chat.png" alt="Chat" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button className="p-2">
            <img src="/icons/heart.png" alt="Heart" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button className="p-2">
            <img src="/icons/bolt.png" alt="Bolt" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button className="p-2">
            <img src="/icons/user.png" alt="User" className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicBar;

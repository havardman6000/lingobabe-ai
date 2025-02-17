import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import type { ChatMessageProps } from '@/types/chat';

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  avatarSrc,
  onPlayAudio,
  audioPlaying
}) => {
  const getMainText = () => {
    const content = message.content;
    return content.chinese || content.japanese || content.korean || content.spanish || content.english;
  };

  const getPronunciation = () => {
    const content = message.content;
    return content.pinyin || content.romaji || content.romanized;
  };

  const mainText = getMainText();
  const pronunciation = getPronunciation();

  // Add audio button to both user and assistant messages
  return (
    <div className="flex items-start space-x-2 max-w-[80%]">
      {message.role === 'assistant' && (
        <Avatar className="w-8 h-8">
          {avatarSrc && <img src={avatarSrc} alt="Assistant" className="w-full h-full object-cover rounded-full" />}
        </Avatar>
      )}

      <div className={`rounded-lg p-3 ${
        message.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
      }`}>
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base">{mainText}</p>
              {pronunciation && (
                <p className="text-sm opacity-90 mt-1">{pronunciation}</p>
              )}
              {message.content.english !== mainText && (
                <p className="text-sm mt-1">{message.content.english}</p>
              )}
              {message.content.context && (
                <p className="text-sm italic mt-2 opacity-75">{message.content.context}</p>
              )}
            </div>
            
            {/* Audio button for all messages */}
            {mainText && (
              <Button
                size="sm"
                variant="secondary"
                className="ml-2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={() => onPlayAudio(mainText)}
                disabled={audioPlaying}
              >
                {audioPlaying ? '🔊' : '🔈'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
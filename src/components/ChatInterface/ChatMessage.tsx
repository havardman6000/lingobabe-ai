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
  const isUserMessage = message.role === 'user';

  return (
    <div 
      className={`flex items-start space-x-2 max-w-full sm:max-w-[80%] ${isUserMessage ? 'ml-auto' : ''}`}
      role="listitem"
    >
      {message.role === 'assistant' && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          {avatarSrc && <img src={avatarSrc} alt="Tutor" className="w-full h-full object-cover rounded-full" />}
        </Avatar>
      )}

      <div className={`rounded-lg p-3 ${
        isUserMessage ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
      }`}
        aria-label={`${isUserMessage ? 'You' : 'Tutor'}: ${mainText}`}
      >
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
            <div className="max-w-full overflow-hidden">
              <p className="text-base break-words">{mainText}</p>
              {pronunciation && (
                <p className="text-sm opacity-90 mt-1" aria-label={`Pronunciation: ${pronunciation}`}>{pronunciation}</p>
              )}
              {message.content.english !== mainText && (
                <p className="text-sm mt-1" aria-label={`Translation: ${message.content.english}`}>{message.content.english}</p>
              )}
              {message.content.context && (
                <p className="text-sm italic mt-2 opacity-75" aria-label={`Context: ${message.content.context}`}>{message.content.context}</p>
              )}
            </div>
            
            {/* Audio button for all messages */}
            {mainText && (
              <Button
                size="sm"
                variant="secondary"
                className="ml-2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors flex-shrink-0 min-h-[36px] min-w-[36px]"
                onClick={() => onPlayAudio(mainText)}
                disabled={audioPlaying}
                aria-label={`Play audio ${audioPlaying ? '(playing)' : ''}`}
              >
                <span aria-hidden="true">{audioPlaying ? '🔊' : '🔈'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
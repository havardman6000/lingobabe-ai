import { Button } from '../ui/button';
import { ChatOptionsProps, ChatOption } from '@/types/chat';

export function ChatOptions({
  options,
  onSelectOption,
  onPlayAudio,
  audioPlaying
}: ChatOptionsProps) {
  const getPrimaryText = (option: ChatOption) => {
    return option.chinese || option.japanese || option.korean || option.spanish || '';
  };

  const getPronunciationText = (option: ChatOption) => {
    return option.pinyin || option.romaji || option.romanized || '';
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const primaryText = getPrimaryText(option);
        const pronunciationText = getPronunciationText(option);

        return (
          <div
            key={index}
            className="w-full text-left p-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors cursor-pointer"
            onClick={() => onSelectOption(primaryText)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">{primaryText}</p>
                {pronunciationText && (
                  <p className="text-xs text-gray-300">{pronunciationText}</p>
                )}
                <p className="text-xs text-gray-400">{option.english}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="ml-2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio(primaryText);
                }}
                disabled={audioPlaying}
              >
                🔊
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
// src/components/ChatInterface/ChatOptions.tsx
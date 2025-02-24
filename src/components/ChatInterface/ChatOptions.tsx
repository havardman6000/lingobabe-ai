import { Button } from '@/components/ui/button';
import { ChatOption } from '@/types/chat';

interface ChatOptionsProps {
  options: ChatOption[];
  onSelectOption: (text: string) => void;
  onPlayAudio: (text: string) => void;
  audioPlaying: boolean;
}

export function ChatOptions({
  options,
  onSelectOption,
  onPlayAudio,
  audioPlaying
}: ChatOptionsProps) {
  if (!options || options.length === 0) {
    console.warn('No options provided to ChatOptions component');
    return null;
  }

  const getPrimaryText = (option: ChatOption) => {
    // Prioritize language-specific text
    return option.chinese || 
           option.japanese || 
           option.korean || 
           option.spanish || 
           option.english || 
           '';
  };

  const getPronunciationText = (option: ChatOption) => {
    return option.pinyin || 
           option.romaji || 
           option.romanized || 
           '';
  };

  return (
    <div 
      className="space-y-2 p-4" 
      role="listbox" 
      aria-label="Chat response options"
    >
      {options.map((option, index) => {
        const primaryText = getPrimaryText(option);
        const pronunciationText = getPronunciationText(option);
        
        return (
          <div
            key={index}
            className="w-full text-left p-3 rounded bg-gray-700 hover:bg-gray-600 
                     text-white transition-colors cursor-pointer"
            onClick={() => onSelectOption(primaryText)}
            role="option"
            aria-selected={false}
            tabIndex={0}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="text-base mb-1">{primaryText}</p>
                {pronunciationText && (
                  <p className="text-sm text-gray-300">{pronunciationText}</p>
                )}
                {option.english && primaryText !== option.english && (
                  <p className="text-sm text-gray-400">{option.english}</p>
                )}
              </div>
              
              <Button
                size="sm"
                variant="secondary"
                className="min-w-[36px] min-h-[36px] p-2 rounded-full bg-blue-500 
                         text-white hover:bg-blue-600 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio(primaryText);
                }}
                disabled={audioPlaying}
                aria-label={`Play audio for ${option.english || primaryText}`}
              >
                <span aria-hidden="true">🔊</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
//src/components/ChatInterface/ChatOptions.tsx
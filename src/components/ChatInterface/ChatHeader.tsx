import { useWeb3 } from '@/components/providers/web3-provider';

export function ChatHeader({
  characterName,
  happiness,
  characterId,
  onBack
}: {
  characterName: string,
  happiness: number,
  characterId: string,
  onBack: () => void
}) {
  const { address } = useWeb3();

  const handleSafeBack = () => {
    // Only update the local state and storage - NO blockchain calls
    if (characterId && address) {
      const accessKey = `character_access_${address.toLowerCase()}_${characterId}`;
      localStorage.removeItem(accessKey);

      // Manually dispatch events to update UI without calling blockchain
      window.dispatchEvent(new CustomEvent('chatCancelled', {
        detail: { characterId }
      }));
    }

    // Just navigate back
    onBack();
  };

  return (
    <div className="chat-header-container">
      <div className="header-main">
        <button
          onClick={handleSafeBack}
          className="back-button"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="character-info">
          <h1 className="character-name">
            {characterName}
          </h1>
          <div className="happiness-meter">
            <span className="status-indicator"></span>
            <span className="happiness-text">
              Happiness: {happiness}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-header-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          background-color: #1f2937;
        }

        .header-main {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          position: relative;
        }

        .back-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(59, 130, 246, 0.8);
          border-radius: 50%;
          color: white;
          flex-shrink: 0;
        }

        .back-icon {
          width: 20px;
          height: 20px;
        }

        .character-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-grow: 1;
          text-align: center;
        }

        .character-name {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .happiness-meter {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(55, 65, 81, 0.8);
          padding: 4px 12px;
          border-radius: 9999px;
          color: white;
          font-size: 13px;
          margin-top: 4px;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${happiness > 70 ? '#10b981' :
                              happiness > 40 ? '#f59e0b' :
                              '#ef4444'};
        }

        .happiness-text {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

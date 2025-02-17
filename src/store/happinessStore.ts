// src/store/happinessStore.ts

export const createHappinessStore = (set: (updater: (state: { happiness: Record<string, number> }) => any) => void) => ({
    happiness: {},
    actions: {
      updateHappiness: (characterId: string, points: number) =>
        set((state: { happiness: Record<string, number> }) => {
          const currentHappiness = state.happiness[characterId] || 50;
          const newHappiness = Math.min(100, Math.max(0, currentHappiness + points));
          
          // Save to localStorage for persistence
          if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
              .then((accounts) => {
                if (accounts?.length) {
                  localStorage.setItem(
                    `happiness_${characterId}_${accounts[0]}`,
                    newHappiness.toString()
                  );
                }
              });
          }
          
          return {
            happiness: {
              ...state.happiness,
              [characterId]: newHappiness
            }
          };
        })
    }
  });
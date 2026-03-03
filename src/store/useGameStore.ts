import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Player {
  id: number;
  name: string;
  balance: number;
  color: string;
  lastChange: number | null;
}

interface GameConfig {
  startingCash: number;
  mirrorLayout: boolean;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string; // Changed to string for better localStorage serialization
}

interface GameState {
  players: Player[];
  gameConfig: GameConfig;
  transactions: Transaction[];
  setBalance: (id: number, amount: number) => void;
  transferMoney: (fromId: number | 'bank', toId: number | 'bank', amount: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  updatePlayerColor: (id: number, color: string) => void;
  updateStartingCash: (amount: number) => void;
  toggleMirrorLayout: () => void;
  resetGame: () => void;
  clearTransactions: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      players: [
        { id: 1, name: 'Player 1', balance: 1500, color: 'blue', lastChange: null },
        { id: 2, name: 'Player 2', balance: 1500, color: 'red', lastChange: null },
      ],
      gameConfig: {
        startingCash: 1500,
        mirrorLayout: false,
      },
      transactions: [],
      setBalance: (id, amount) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, balance: amount, lastChange: amount - p.balance } : p)
      })),
      transferMoney: (fromId, toId, amount) => set((state) => {
        const fromName = fromId === 'bank' ? 'The Bank' : state.players.find(p => p.id === fromId)?.name || '';
        const toName = toId === 'bank' ? 'The Bank' : state.players.find(p => p.id === toId)?.name || '';

        const newPlayers = state.players.map(p => {
          let newBalance = p.balance;
          let lastChange = p.lastChange;
          if (fromId !== 'bank' && p.id === fromId) {
            newBalance -= amount;
            lastChange = -amount;
          }
          if (toId !== 'bank' && p.id === toId) {
            newBalance += amount;
            lastChange = amount;
          }
          return { ...p, balance: newBalance, lastChange };
        });

        return {
          players: newPlayers,
          transactions: [
            {
              id: Math.random().toString(36).substr(2, 9),
              from: fromName,
              to: toName,
              amount,
              timestamp: new Date().toISOString(),
            },
            ...state.transactions
          ]
        };
      }),
      updatePlayerName: (id, name) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, name } : p)
      })),
      updatePlayerColor: (id, color) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, color } : p)
      })),
      updateStartingCash: (amount) => set((state) => ({
        gameConfig: { ...state.gameConfig, startingCash: amount }
      })),
      toggleMirrorLayout: () => set((state) => ({
        gameConfig: { ...state.gameConfig, mirrorLayout: !state.gameConfig.mirrorLayout }
      })),
      resetGame: () => set((state) => ({
        players: state.players.map(p => ({ ...p, balance: state.gameConfig.startingCash, lastChange: null })),
        transactions: []
      })),
      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'monopoly-banker-storage',
    }
  )
);

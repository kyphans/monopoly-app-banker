import { create } from 'zustand'

interface Player {
  id: number;
  name: string;
  balance: number;
  color: string;
}

interface GameState {
  players: Player[];
  transactions: Array<{
    id: string;
    from: string;
    to: string;
    amount: number;
    timestamp: Date;
  }>;
  setBalance: (id: number, amount: number) => void;
  transferMoney: (fromId: number | 'bank', toId: number | 'bank', amount: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  clearTransactions: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [
    { id: 1, name: 'John Doe', balance: 1500, color: 'bg-blue-600 dark:bg-blue-700' },
    { id: 2, name: 'Sarah Smith', balance: 1240, color: 'bg-rose-600 dark:bg-rose-700' },
  ],
  transactions: [],
  setBalance: (id, amount) => set((state) => ({
    players: state.players.map(p => p.id === id ? { ...p, balance: amount } : p)
  })),
  transferMoney: (fromId, toId, amount) => set((state) => {
    const fromName = fromId === 'bank' ? 'The Bank' : state.players.find(p => p.id === fromId)?.name || '';
    const toName = toId === 'bank' ? 'The Bank' : state.players.find(p => p.id === toId)?.name || '';

    const newPlayers = state.players.map(p => {
      let newBalance = p.balance;
      if (fromId !== 'bank' && p.id === fromId) newBalance -= amount;
      if (toId !== 'bank' && p.id === toId) newBalance += amount;
      return { ...p, balance: newBalance };
    });

    return {
      players: newPlayers,
      transactions: [
        {
          id: Math.random().toString(36).substr(2, 9),
          from: fromName,
          to: toName,
          amount,
          timestamp: new Date(),
        },
        ...state.transactions
      ]
    };
  }),
  updatePlayerName: (id, name) => set((state) => ({
    players: state.players.map(p => p.id === id ? { ...p, name } : p)
  })),
  clearTransactions: () => set({ transactions: [] }),
}));

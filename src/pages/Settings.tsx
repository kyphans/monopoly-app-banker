import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Button } from '../components/ui/Button';
import { User, Landmark } from 'lucide-react';

export const Settings: React.FC = () => {
  const { players, updatePlayerName } = useGameStore();

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark p-6 overflow-y-auto">
      <div className="pt-12 mb-8">
        <h1 className="text-3xl font-black dark:text-white">Game Config</h1>
        <p className="text-slate-500 font-medium">Setup your players and rules</p>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Landmark size={20} className="text-primary" />
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-400">Starting Balance</h2>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-200">Standard Monopoly</span>
              <span className="text-2xl font-mono font-bold text-primary">$1,500</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <User size={20} className="text-primary" />
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-400">Players</h2>
          </div>
          <div className="space-y-4">
            {players.map((player) => (
              <div key={player.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Player {player.id}</span>
                  <div className={`w-3 h-3 rounded-full ${player.id === 1 ? 'bg-blue-500' : 'bg-rose-500'}`} />
                </div>
                <input 
                  type="text" 
                  value={player.name}
                  onChange={(e) => updatePlayerName(player.id, e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-xl focus:ring-2 focus:ring-primary w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <Button size="xl" className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

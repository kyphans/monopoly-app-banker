import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { User, X, RotateCcw, History as HistoryIcon } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface BankruptcyProps {
  playerId: number;
  onRestart: () => void;
  onViewHistory: () => void;
}

const THEME_COLORS: Record<string, string> = {
  blue: 'text-blue-500 bg-blue-500 shadow-blue-500/20 ring-blue-500/20',
  red: 'text-rose-500 bg-rose-500 shadow-rose-500/20 ring-rose-500/20',
  green: 'text-green-500 bg-green-500 shadow-green-500/20 ring-green-500/20',
  yellow: 'text-amber-500 bg-amber-500 shadow-amber-500/20 ring-amber-500/20',
  purple:
    'text-purple-500 bg-purple-500 shadow-purple-500/20 ring-purple-500/20',
  orange:
    'text-orange-500 bg-orange-500 shadow-orange-500/20 ring-orange-500/20'
};

const THEME_BG: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/20',
  red: 'bg-rose-500/10 border-rose-500/20',
  green: 'bg-green-500/10 border-green-500/20',
  yellow: 'bg-amber-500/10 border-amber-500/20',
  purple: 'bg-purple-500/10 border-purple-500/20',
  orange: 'bg-orange-500/10 border-orange-500/20'
};

export const Bankruptcy: React.FC<BankruptcyProps> = ({
  playerId,
  onRestart,
  onViewHistory
}) => {
  const { players, transactions } = useGameStore();
  const player = players.find((p) => p.id === playerId) || players[0];
  const playLosing = useSound('/losing.mp3');

  useEffect(() => {
    playLosing();
  }, []);
  const colorId = player.color;

  const themeClass = THEME_COLORS[colorId] || THEME_COLORS.red;
  const bgClass = THEME_BG[colorId] || THEME_BG.red;
  const textColor = themeClass.split(' ')[0];
  const bgColor = themeClass.split(' ')[1];

  // Stats
  const playerTransactions = transactions.filter(
    (t) => t.from === player.name || t.to === player.name
  );

  return (
    <div className='flex flex-col h-screen bg-black text-white font-sans selection:bg-white/20 overflow-y-auto'>
      <header className='flex items-center p-4 justify-between'>
        <div className='w-12 h-12'></div>
        <h2 className='text-lg font-bold leading-tight tracking-tight flex-1 text-center text-white/90'>
          Game Session
        </h2>
        <div className='w-12 h-12'></div>
      </header>

      <main className='flex-1 flex flex-col items-center justify-center p-6'>
        <div className='w-full max-w-sm flex flex-col items-center gap-10'>
          <div className='relative'>
            <div
              className={`absolute inset-0 ${bgColor} opacity-30 rounded-full blur-3xl scale-150`}></div>
            <div
              className={`relative flex items-center justify-center w-48 h-48 rounded-full border-4 ${bgClass} bg-white/5`}>
              <div
                className={`flex items-center justify-center w-40 h-40 rounded-full ${bgColor} text-white shadow-2xl`}>
                <User size={80} strokeWidth={2.5} />
              </div>
              <div className='absolute -bottom-1 -right-1 bg-black p-1 rounded-full'>
                <div
                  className={`${bgColor} text-white rounded-full p-2 flex items-center justify-center shadow-lg`}>
                  <X size={28} strokeWidth={4} />
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center gap-3'>
            <span
              className={`px-4 py-1.5 ${bgColor} text-white text-[11px] font-black tracking-[0.15em] uppercase rounded-full shadow-lg`}>
              Eliminated
            </span>
            <div className='mt-2 text-center'>
              <h1
                className={`${textColor} text-6xl font-black leading-none tracking-tighter italic`}>
                BANKRUPT!
              </h1>
              <p className='text-white/40 text-lg font-bold mt-3 uppercase tracking-widest'>
                {player.name} IS OUT OF CASH
              </p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 w-full mt-2'>
            <div className='flex flex-col items-center justify-center gap-1 rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm'>
              <p className='text-white/30 text-[10px] font-bold uppercase tracking-widest'>
                Final Balance
              </p>
              <p className='text-white tracking-tight text-3xl font-black leading-tight font-mono'>
                ${player.balance}
              </p>
            </div>
            <div className='flex flex-col items-center justify-center gap-1 rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm'>
              <p className='text-white/30 text-[10px] font-bold uppercase tracking-widest'>
                Gameday Activity
              </p>
              <p className='text-white tracking-tight text-3xl font-black leading-tight font-mono'>
                {playerTransactions.length}
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className='flex flex-col gap-4 w-full max-w-[480px] mx-auto px-8 pb-12'>
        <button
          onClick={onRestart}
          className={`flex items-center justify-center rounded-2xl h-16 px-5 ${bgColor} text-white text-xl font-black uppercase tracking-tight w-full shadow-2xl hover:scale-[0.98] transition-transform active:scale-95`}>
          <RotateCcw size={24} className='mr-2' strokeWidth={3} />
          Restart Game
        </button>
        <button
          onClick={onViewHistory}
          className='flex items-center justify-center rounded-2xl h-16 px-5 bg-white/10 text-white text-xl font-bold tracking-tight w-full hover:bg-white/15 transition-colors active:scale-95'>
          <HistoryIcon size={24} className='mr-2' />
          View Final History
        </button>
        <p className='text-white/20 text-[10px] text-center mt-4 font-black uppercase tracking-[0.3em] italic'>
          Monopoly Banker Engine v2.4.0
        </p>
      </div>
    </div>
  );
};

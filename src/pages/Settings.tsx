import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { User, RefreshCw, Landmark, FlipVertical2, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

const THEME_COLORS = [
  {
    id: 'blue',
    bg: 'bg-blue-500',
    ring: 'peer-checked:ring-blue-500',
    text: 'text-blue-500',
    lightBg: 'bg-blue-500/10'
  },
  {
    id: 'red',
    bg: 'bg-red-500',
    ring: 'peer-checked:ring-red-500',
    text: 'text-red-500',
    lightBg: 'bg-red-500/10'
  },
  {
    id: 'green',
    bg: 'bg-green-500',
    ring: 'peer-checked:ring-green-500',
    text: 'text-green-500',
    lightBg: 'bg-green-500/10'
  },
  {
    id: 'yellow',
    bg: 'bg-yellow-500',
    ring: 'peer-checked:ring-yellow-500',
    text: 'text-yellow-500',
    lightBg: 'bg-yellow-500/10'
  },
  {
    id: 'purple',
    bg: 'bg-purple-500',
    ring: 'peer-checked:ring-purple-500',
    text: 'text-purple-500',
    lightBg: 'bg-purple-500/10'
  },
  {
    id: 'orange',
    bg: 'bg-orange-500',
    ring: 'peer-checked:ring-orange-500',
    text: 'text-orange-500',
    lightBg: 'bg-orange-500/10'
  }
];

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const {
    players,
    gameConfig,
    updatePlayerName,
    updateStartingCash,
    toggleMirrorLayout,
    toggleAmountInputMode,
    resetGame
  } = useGameStore();

  // Local state for colors to match UI
  const [playerColors, setPlayerColors] = useState<Record<number, string>>({
    1: 'blue',
    2: 'red'
  });

  const handleColorChange = (playerId: number, colorId: string) => {
    setPlayerColors((prev) => ({ ...prev, [playerId]: colorId }));
    const { updatePlayerColor } = useGameStore.getState();
    if (updatePlayerColor) updatePlayerColor(playerId, colorId);
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset the game? This will reset all player balances and transaction history.'
      )
    ) {
      resetGame();
    }
  };

  return (
    <div className='relative flex h-full w-full flex-col overflow-y-auto bg-primary font-sans text-slate-900 pb-32 pt-16 px-4'>
      <PageHeader title='Game Config' onBack={onBack} />

      <main className='flex-1 space-y-6 px-4 py-6'>
        {/* Global Game Config */}
        <section className='rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)]'>
          <div className='mb-6 flex flex-col items-center'>
            <div className='mb-3 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Landmark size={40} className='font-bold' strokeWidth={3} />
            </div>
            <h2 className='text-xl font-bold text-slate-900'>Game Rules</h2>
          </div>

          <div className='space-y-5'>
            <div>
              <label className='mb-2 block px-1 text-xs font-bold uppercase tracking-wider text-slate-500'>
                Starting Cash (Shared)
              </label>
              <div className='relative'>
                <span className='absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400'>
                  $
                </span>
                <input
                  className='h-14 w-full rounded-2xl border-none bg-slate-50 pl-10 pr-5 font-bold text-slate-900 focus:ring-2 focus:ring-primary outline-none'
                  placeholder='0'
                  type='number'
                  value={gameConfig.startingCash}
                  onChange={(e) => updateStartingCash(Number(e.target.value))}
                />
              </div>
            </div>

            <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4'>
              <div className='flex items-center gap-3'>
                <FlipVertical2 size={20} className='text-slate-400' strokeWidth={2.5} />
                <div>
                  <p className='text-sm font-bold text-slate-800'>Mirror Layout</p>
                  <p className='text-xs text-slate-400'>
                    {gameConfig.mirrorLayout ? 'Cards face each player' : 'Both cards face same way'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleMirrorLayout}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  gameConfig.mirrorLayout ? 'bg-primary' : 'bg-slate-200'
                }`}>
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    gameConfig.mirrorLayout ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className='mb-2 block px-1 text-xs font-bold uppercase tracking-wider text-slate-500'>
                Amount Input Style
              </label>
              <div className='flex rounded-2xl bg-slate-50 p-1.5 gap-1.5'>
                <button
                  onClick={() => gameConfig.amountInputMode !== 'wheel' && toggleAmountInputMode()}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-wide transition-all ${
                    gameConfig.amountInputMode === 'wheel'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400'
                  }`}>
                  <SlidersHorizontal size={14} strokeWidth={2.5} />
                  Scroll Wheel
                </button>
                <button
                  onClick={() => gameConfig.amountInputMode !== 'grid' && toggleAmountInputMode()}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-wide transition-all ${
                    gameConfig.amountInputMode === 'grid'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400'
                  }`}>
                  <LayoutGrid size={14} strokeWidth={2.5} />
                  Grid
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Players Config */}
        {players.map((player) => {
          const selectedColorId = playerColors[player.id] || 'blue';
          const style =
            THEME_COLORS.find((c) => c.id === selectedColorId) ||
            THEME_COLORS[0];

          return (
            <section
              key={player.id}
              className='rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)]'>
              <div className='mb-6 flex flex-col items-center'>
                <div
                  className={`mb-3 flex size-20 items-center justify-center rounded-full ${style.lightBg} ${style.text}`}>
                  <User size={40} className='font-bold' strokeWidth={3} />
                </div>
                <h2 className='text-xl font-bold text-slate-900'>
                  Player {player.id}
                </h2>
              </div>

              <div className='space-y-5'>
                <div>
                  <label className='mb-2 block px-1 text-xs font-bold uppercase tracking-wider text-slate-500'>
                    Player Name
                  </label>
                  <input
                    className='h-14 w-full rounded-2xl border-none bg-slate-50 px-5 font-semibold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-primary outline-none'
                    placeholder='Enter name'
                    type='text'
                    value={player.name}
                    onChange={(e) =>
                      updatePlayerName(player.id, e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className='mb-3 block px-1 text-xs font-bold uppercase tracking-wider text-slate-500'>
                    Theme Color
                  </label>
                  <div className='flex items-center justify-between rounded-2xl bg-slate-50 p-3'>
                    {THEME_COLORS.map((c) => (
                      <label key={c.id} className='relative cursor-pointer'>
                        <input
                          type='radio'
                          name={`p${player.id}-color`}
                          className='peer hidden animate-none'
                          checked={selectedColorId === c.id}
                          onChange={() => handleColorChange(player.id, c.id)}
                        />
                        <div
                          className={`size-9 rounded-full ${c.bg} transition-all peer-checked:ring-4 peer-checked:ring-offset-2 ${c.ring}`}></div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <div className='fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/90 p-6 backdrop-blur-xl shrink-0'>
        <button
          onClick={handleReset}
          className='flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-extrabold text-black shadow-[0_8px_20px_-4px_rgba(19,236,91,0.4)] transition-all active:scale-95'>
          <RefreshCw size={24} strokeWidth={3} />
          Save & Reset Game
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { History, Sliders, Landmark, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onNavigate
}) => {
  const menuItems = [
    { id: 'game', label: 'Play Game', icon: Landmark },
    { id: 'history', label: 'History', icon: History },
    { id: 'config', label: 'Game Config', icon: Sliders }
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <nav
        className={`fixed inset-y-0 left-0 w-72 h-dvh bg-white dark:bg-[#0f151c] z-[120] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='p-8 pt-[calc(env(safe-area-inset-top)+2rem)] pb-[env(safe-area-inset-bottom)] h-full flex flex-col'>
          <div className='flex items-center space-x-4 mb-12'>
            <div className='w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black'>
              <span className='material-symbols-outlined text-3xl'>
                payments
              </span>
            </div>
            <div>
              <h1 className='font-black text-2xl dark:text-white leading-tight'>
                Banker
              </h1>
              <p className='text-xs text-slate-400 font-bold uppercase tracking-widest'>
                Monopoly Companion
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                  activeScreen === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}>
                <item.icon
                  size={24}
                  strokeWidth={activeScreen === item.id ? 2.5 : 2}
                />
                <span className='font-bold'>{item.label}</span>
              </button>
            ))}
          </div>

          <div className='mt-auto pt-8 border-t border-slate-100 dark:border-slate-800/50 space-y-4'>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to reset the game? All balances and history will be cleared.'
                  )
                ) {
                  useGameStore.getState().resetGame();
                  onClose();
                  onNavigate('game');
                }
              }}
              className='w-full flex items-center justify-center space-x-3 p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-bold active:scale-95 transition-transform border border-rose-500/20'>
              <RotateCcw size={20} />
              <span>Reset Game</span>
            </button>
            <button
              onClick={onClose}
              className='w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-400 active:scale-95 transition-transform'>
              Close Menu
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

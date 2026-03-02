import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainGame } from './pages/MainGame';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Bankruptcy } from './pages/Bankruptcy';
import { Menu } from 'lucide-react';
import { useGameStore } from './store/useGameStore';
import { useFullscreen } from './hooks/useFullscreen';

const App: React.FC = () => {
  useFullscreen();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('game');
  const [bankruptPlayerId, setBankruptPlayerId] = useState<number | null>(null);
  const { resetGame } = useGameStore();

  const handleRestart = () => {
    resetGame();
    setBankruptPlayerId(null);
    setActiveScreen('game');
  };

  const renderScreen = () => {
    if (bankruptPlayerId !== null) {
      return (
        <Bankruptcy
          playerId={bankruptPlayerId}
          onRestart={handleRestart}
          onViewHistory={() => {
            setBankruptPlayerId(null);
            setActiveScreen('history');
          }}
        />
      );
    }

    switch (activeScreen) {
      case 'game':
        return <MainGame onBankrupt={setBankruptPlayerId} />;
      case 'history':
        return <History onBack={() => setActiveScreen('game')} />;
      case 'config':
        return <Settings onBack={() => setActiveScreen('game')} />;
      default:
        return <MainGame onBankrupt={setBankruptPlayerId} />;
    }
  };

  return (
    <div className='h-dvh w-screen flex flex-col relative overflow-hidden font-sans bg-background-light dark:bg-background-dark'>
      {/* Top Navigation Overlay */}
      <div className='absolute top-[env(safe-area-inset-top)] w-full z-50 flex justify-between items-center py-2 px-4 pointer-events-none'>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='w-12 h-12 mt-2 flex items-center justify-center bg-white/10 ios-blur border border-white/20 rounded-full text-white active:scale-90 transition-transform pointer-events-auto shadow-xl'>
          <Menu size={24} />
        </button>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />

      <main className='flex-1 overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)]'>
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;

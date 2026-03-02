import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainGame } from './pages/MainGame';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('game');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'game': return <MainGame />;
      case 'history': return <History onBack={() => setActiveScreen('game')} />;
      case 'config': return <Settings />;
      default: return <MainGame />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden font-sans">
      {/* Top Navigation Overlay */}
      <div className="absolute top-0 w-full z-50 flex justify-between items-center py-2 px-4 pointer-events-none">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-12 h-12 flex items-center justify-center bg-white/10 ios-blur border border-white/20 rounded-full text-white active:scale-90 transition-transform pointer-events-auto shadow-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;

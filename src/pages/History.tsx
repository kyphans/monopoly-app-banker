import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { ChevronLeft, ArrowRight, Landmark, User, SortDesc } from 'lucide-react';

interface HistoryProps {
  onBack: () => void;
}

export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const { transactions, players, clearTransactions } = useGameStore();

  const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  const getPlayerDisplay = (name: string) => {
    if (name === 'The Bank') {
      return {
        initial: <Landmark size={20} />,
        bgColor: 'bg-amber-600',
        shadowColor: 'shadow-amber-600/20',
        fullName: 'The Bank'
      };
    }
    const player = players.find(p => p.name === name);
    const baseColor = player?.color.split(' ')[0] || 'bg-slate-500';
    return {
      initial: name.charAt(0).toUpperCase(),
      bgColor: baseColor,
      shadowColor: `${baseColor.replace('bg-', 'shadow-')}/20`,
      fullName: name
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#14a120] dark:bg-[#0f151c] p-4 pt-16 overflow-y-auto">
      {/* Header Navigation */}
      <div className="flex rounded-4xl items-center justify-between mb-8 bg-white dark:bg-[#0f151c]/80 backdrop-blur-md z-20 py-4 px-2">
        <button 
          onClick={onBack}
          className="flex items-center text-primary font-bold hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={24} />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-xl font-black dark:text-white">Transaction History</h1>
        <button 
          onClick={() => {
            if (window.confirm('Clear all transaction history?')) {
              clearTransactions();
            }
          }}
          className="text-primary font-bold hover:opacity-70 transition-opacity text-lg pr-1"
        >
          Clear
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-4xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Volume</p>
          <p className="text-3xl font-black text-primary font-mono">${totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-4xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Transactions</p>
          <p className="text-3xl font-black dark:text-white font-mono">{transactions.length}</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Recent Activity</h2>
        <button className="flex items-center space-x-1 text-[10px] font-bold text-white hover:text-primary transition-colors">
          <SortDesc size={14} />
          <span>Sort by Newest</span>
        </button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 bg-white/50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <User size={32} className="opacity-20" />
            </div>
            <p className="font-bold text-slate-400/60">No activity recorded yet</p>
            <p className="text-[10px] uppercase tracking-widest mt-2 opacity-40">Money flow will appear here</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const from = getPlayerDisplay(tx.from);
            const to = getPlayerDisplay(tx.to);

            return (
              <div key={tx.id} className="bg-white dark:bg-slate-800/80 p-4 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  {/* Sender */}
                  <div className="flex flex-col items-center justify-center space-y-2 w-1/3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black ${from.bgColor} shadow-lg ${from.shadowColor}`}>
                      {from.initial}
                    </div>
                    <div className="text-center overflow-hidden w-full">
                      <p className="text-[10px] font-black dark:text-white uppercase truncate tracking-tight">{from.fullName}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Sender</p>
                    </div>
                  </div>

                  {/* Flow Indicator */}
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="bg-primary/10 text-lg text-primary px-3 py-1 rounded-full flex items-center space-x-1">
                      <span className="text-md font-black font-mono">${tx.amount.toLocaleString()}</span>
                      <ArrowRight size={16} strokeWidth={3} />
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="flex flex-col items-center justify-center space-y-2 w-1/3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black ${to.bgColor} shadow-lg ${to.shadowColor}`}>
                      {to.initial}
                    </div>
                    <div className="text-center overflow-hidden w-full">
                      <p className="text-[10px] font-black dark:text-white uppercase truncate tracking-tight">{to.fullName}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Receiver</p>
                    </div>
                  </div>
                </div>

                {/* Footer metadata */}
                {/* <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                  <div className="flex space-x-2">
                    <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Standard
                    </span>
                    <span className="bg-slate-50 dark:bg-slate-700/50 px-3 py-1 rounded-full text-[9px] font-bold text-slate-400 dark:text-slate-500">
                      Transfer
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div> */}
              </div>
            );
          })
        )}
      </div>

      {/* Decorative Spacer */}
      <div className="h-12 shrink-0" />
    </div>
  );
};

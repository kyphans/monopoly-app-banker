import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Landmark, ArrowRight, Zap } from 'lucide-react';
import { WheelPicker } from './ui/WheelPicker';
import { Button } from './ui/Button';
import { useSound } from '../hooks/useSound';

interface Player {
  id: number;
  name: string;
  balance: number;
  color: string;
  lastChange: number | null;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferType: string;
  players: Player[];
  onConfirm: (amount: number) => void;
  onCollectBonus?: () => void;
}

const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    shadow: 'shadow-blue-500/20'
  },
  red: {
    bg: 'bg-rose-500',
    text: 'text-rose-500',
    shadow: 'shadow-rose-500/20'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    shadow: 'shadow-green-500/20'
  },
  yellow: {
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    shadow: 'shadow-amber-500/20'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-500',
    shadow: 'shadow-purple-500/20'
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    shadow: 'shadow-orange-500/20'
  }
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transferType,
  players,
  onConfirm,
  onCollectBonus
}) => {
  const [amount, setAmount] = useState('');
  const playBonus = useSound('/cash.mp3');
  const playCounting = useSound('/counting.mp3');

  const getParticipantStyle = (isP1: boolean, isP2: boolean) => {
    if (isP1) return colorMap[players[0].color] || colorMap.blue;
    if (isP2) return colorMap[players[1].color] || colorMap.red;
    return {
      bg: 'bg-slate-700',
      text: 'text-slate-400',
      shadow: 'shadow-slate-500/10'
    };
  };

  const fromStyle = getParticipantStyle(
    transferType.startsWith('p1'),
    transferType.startsWith('p2')
  );
  const toStyle = getParticipantStyle(
    transferType.endsWith('p1'),
    transferType.endsWith('p2')
  );

  const handleConfirm = () => {
    const value = parseInt(amount);
    if (!isNaN(value) && value > 0) {
      playCounting();
      onConfirm(value);
      setAmount('');
    }
  };

  const handleBonusClick = () => {
    playBonus();
    setAmount('200');
    if (onCollectBonus) onCollectBonus();
  };

  const isBankToPlayer =
    transferType === 'bank-to-p1' || transferType === 'bank-to-p2';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Confirm Transaction'>
      <div className='space-y-2'>
        <div>
          <div className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-inner'>
            {/* From Participant */}
            <div className='flex flex-col items-center justify-center flex-1'>
              <div className='flex flex-col items-center space-y-2'>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${fromStyle.bg} ${fromStyle.shadow}`}>
                  {transferType.startsWith('p1') ? (
                    players[0].name.charAt(0)
                  ) : transferType.startsWith('p2') ? (
                    players[1].name.charAt(0)
                  ) : (
                    <Landmark size={24} />
                  )}
                </div>
                <div className='text-center overflow-hidden w-full px-1'>
                  <p
                    className={`text-[10px] font-black uppercase truncate tracking-tight ${fromStyle.text}`}>
                    {transferType.startsWith('p1')
                      ? players[0].name
                      : transferType.startsWith('p2')
                        ? players[1].name
                        : 'The Bank'}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col items-center px-2'>
              <div className='w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-800'>
                <ArrowRight size={20} className='text-primary' />
              </div>
            </div>

            {/* To Participant */}
            <div className='flex flex-col items-center justify-center flex-1'>
              <div className='flex flex-col items-center space-y-2'>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${toStyle.bg} ${toStyle.shadow}`}>
                  {transferType.endsWith('p1') ? (
                    players[0].name.charAt(0)
                  ) : transferType.endsWith('p2') ? (
                    players[1].name.charAt(0)
                  ) : (
                    <Landmark size={24} />
                  )}
                </div>
                <div className='text-center overflow-hidden w-full px-1'>
                  <p
                    className={`text-[10px] font-black uppercase truncate tracking-tight ${toStyle.text}`}>
                    {transferType.endsWith('p1')
                      ? players[0].name
                      : transferType.endsWith('p2')
                        ? players[1].name
                        : 'The Bank'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBankToPlayer && (
          <div className='mb-2'>
            <button
              onClick={handleBonusClick}
              className='w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-[0_8px_20px_-4px_rgba(19,236,91,0.3)] active:scale-[0.98] transition-all group overflow-hidden relative'>
              <div className='absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out'></div>
              <Zap size={22} fill='currentColor' className='animate-pulse' />
              <div className='flex flex-col items-start leading-tight'>
                <span className='text-[9px] font-black uppercase tracking-widest opacity-60'>
                  Collect Bonus
                </span>
                <span className='text-sm font-black uppercase'>
                  GO! Pass Start +200
                </span>
              </div>
            </button>
          </div>
        )}

        <div>
          <div className='bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden'>
            <WheelPicker
              options={[
                10, 20, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500
              ]}
              value={parseInt(amount) || 0}
              onChange={(val: number) => setAmount(val.toString())}
            />
          </div>
        </div>

        <div className='relative pt-4'>
          <label className='absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] bg-white dark:bg-slate-900 px-4'>
            Amount
          </label>
          <div className='bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-slate-100 dark:border-slate-800 p-6'>
            <input
              autoFocus
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0'
              className='w-full text-5xl font-mono text-center bg-transparent border-none focus:ring-0 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 font-bold'
            />
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          size='xl'
          className='w-full shadow-2xl shadow-primary/20 mt-2'>
          Confirm Transfer
        </Button>
      </div>
    </Modal>
  );
};

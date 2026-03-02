import React, { useState, useEffect } from 'react';
import { PlayerArea } from '../components/PlayerArea';
import { BankCenter } from '../components/BankCenter';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { DragOverlay } from '../components/DragOverlay';
import { useGameStore } from '../store/useGameStore';
import { ArrowRight, Landmark } from 'lucide-react';
import type { PanInfo } from 'framer-motion';

interface MainGameProps {
  onBankrupt: (playerId: number) => void;
}

export const MainGame: React.FC<MainGameProps> = ({ onBankrupt }) => {
  const { players, transferMoney } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    players.forEach((player) => {
      if (player.balance < 0 && !isModalOpen) {
        const confirmBankrupt = window.confirm(
          `${player.name} has a negative balance ($${player.balance}). Do you want to declare BANKRUPTCY for this player?`
        );
        if (confirmBankrupt) {
          onBankrupt(player.id);
        }
      }
    });
  }, [players, isModalOpen, onBankrupt]);
  const [transferType, setTransferType] = useState<
    | 'bank-to-any'
    | 'any-to-bank'
    | 'p1-to-p2'
    | 'p2-to-p1'
    | 'p1-to-bank'
    | 'p2-to-bank'
    | 'bank-to-p1'
    | 'bank-to-p2'
  >('bank-to-p1');

  // Drag State
  const [dragInfo, setDragInfo] = useState<{
    startPoint: { x: number; y: number } | null;
    currentPoint: { x: number; y: number } | null;
    source: 'p1' | 'p2' | 'bank' | null;
    target: 'p1' | 'p2' | 'bank' | null;
  }>({
    startPoint: null,
    currentPoint: null,
    source: null,
    target: null
  });

  const getSourceLabel = (source: string | null) => {
    if (source === 'p1') return players[0].name;
    if (source === 'p2') return players[1].name;
    if (source === 'bank') return 'The Bank';
    return '';
  };

  const getTargetLabel = (target: string | null) => {
    if (target === 'p1') return players[0].name;
    if (target === 'p2') return players[1].name;
    if (target === 'bank') return 'The Bank';
    return null;
  };

  const handleDragStart = (
    source: 'p1' | 'p2' | 'bank',
    e: MouseEvent | TouchEvent | PointerEvent
  ) => {
    const isTouch = 'touches' in e;
    const clientX = isTouch ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = isTouch ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const point = { x: clientX, y: clientY };
    setDragInfo({
      startPoint: point,
      currentPoint: point,
      source,
      target: null
    });
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const currentPoint = { x: info.point.x, y: info.point.y };

    // Simple zone detection
    // Top 30% = P1, Bottom 30% = P2, Middle 40% = Bank
    const h = window.innerHeight;
    let target: 'p1' | 'p2' | 'bank' | null = null;

    if (currentPoint.y < h * 0.35) target = 'p1';
    else if (currentPoint.y > h * 0.65) target = 'p2';
    else target = 'bank';

    // Don't target yourself
    if (target === dragInfo.source) target = null;

    setDragInfo((prev) => ({
      ...prev,
      currentPoint,
      target
    }));
  };

  const handleDragEnd = () => {
    const { source, target } = dragInfo;

    if (source && target && source !== target) {
      // Determine transfer type
      let type:
        | 'bank-to-any'
        | 'any-to-bank'
        | 'p1-to-p2'
        | 'p2-to-p1'
        | 'p1-to-bank'
        | 'p2-to-bank'
        | 'bank-to-p1'
        | 'bank-to-p2' = 'bank-to-p1';
      if (source === 'p1' && target === 'p2') type = 'p1-to-p2';
      else if (source === 'p2' && target === 'p1') type = 'p2-to-p1';
      else if (source === 'p1' && target === 'bank') type = 'p1-to-bank';
      else if (source === 'p2' && target === 'bank') type = 'p2-to-bank';
      else if (source === 'bank' && target === 'p1') type = 'bank-to-p1';
      else if (source === 'bank' && target === 'p2') type = 'bank-to-p2';

      setTransferType(type);
      setIsModalOpen(true);
    }

    setDragInfo({
      startPoint: null,
      currentPoint: null,
      source: null,
      target: null
    });
  };

  const handleTransfer = () => {
    const value = parseInt(amount);
    if (!value || value <= 0) return;

    let sourcePlayerIdx = -1;
    if (transferType.startsWith('p1')) sourcePlayerIdx = 0;
    else if (transferType.startsWith('p2')) sourcePlayerIdx = 1;

    if (sourcePlayerIdx !== -1) {
      const sourcePlayer = players[sourcePlayerIdx];
      const newBalance = sourcePlayer.balance - value;
      if (newBalance < 0) {
        const confirmBankrupt = window.confirm(
          `${sourcePlayer.name} will have a negative balance ($${newBalance}). Do you want to declare BANKRUPTCY?`
        );
        if (confirmBankrupt) {
          transferMoney(
            transferType.startsWith('p1') ? 1 : 2,
            transferType.endsWith('p1')
              ? 1
              : transferType.endsWith('p2')
                ? 2
                : 'bank',
            value
          );
          onBankrupt(sourcePlayer.id);
          setIsModalOpen(false);
          setAmount('');
          return;
        }
      }
    }

    if (transferType === 'p1-to-p2') transferMoney(1, 2, value);
    else if (transferType === 'p2-to-p1') transferMoney(2, 1, value);
    else if (transferType === 'p1-to-bank') transferMoney(1, 'bank', value);
    else if (transferType === 'p2-to-bank') transferMoney(2, 'bank', value);
    else if (transferType === 'bank-to-p1') transferMoney('bank', 1, value);
    else if (transferType === 'bank-to-p2') transferMoney('bank', 2, value);

    setAmount('');
    setIsModalOpen(false);
  };

  const colorMap: Record<string, { bg: string; text: string; shadow: string }> =
    {
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

  const getParticipantStyle = (isP1: boolean, isP2: boolean) => {
    if (isP1) return colorMap[players[0].color] || colorMap.blue;
    if (isP2) return colorMap[players[1].color] || colorMap.red;
    return {
      bg: 'bg-amber-600',
      text: 'text-amber-600 dark:text-amber-500',
      shadow: 'shadow-amber-600/20'
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

  return (
    <div className='flex-1 flex flex-col h-full bg-background-dark relative select-none'>
      <PlayerArea
        player={players[0]}
        reverse={true}
        onDragStart={(e) => handleDragStart('p1', e)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      <BankCenter
        onClick={() => {}}
        onDragStart={(e) => handleDragStart('bank', e)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      <PlayerArea
        player={players[1]}
        onDragStart={(e) => handleDragStart('p2', e)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      <DragOverlay
        startPoint={dragInfo.startPoint}
        currentPoint={dragInfo.currentPoint}
        sourceLabel={getSourceLabel(dragInfo.source)}
        targetLabel={getTargetLabel(dragInfo.target)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Confirm Transaction'>
        <div className='space-y-6'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-inner'>
              {/* From Participant */}
              <div className='flex flex-col items-center justify-center flex-1'>
                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3'>
                  From
                </span>
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
                <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3'>
                  To
                </span>
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

          <div>
            <label className='block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 text-center'>
              Quick Select
            </label>
            <div className='grid grid-cols-5 gap-2'>
              {[10, 50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className='py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-primary hover:text-black transition-all active:scale-90 dark:text-slate-300'>
                  {val}
                </button>
              ))}
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
            onClick={handleTransfer}
            size='xl'
            className='w-full shadow-2xl shadow-primary/20 mt-2'>
            Confirm Transfer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

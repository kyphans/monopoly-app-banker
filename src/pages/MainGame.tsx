import React, { useState, useEffect } from 'react';
import { PlayerArea } from '../components/PlayerArea';
import { BankCenter } from '../components/BankCenter';
import { DragOverlay } from '../components/DragOverlay';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import Confetti from 'react-confetti';
import { TransactionModal } from '../components/TransactionModal';
import { TRANSFER_ANIMATION_DURATION } from '../constants/animations';

interface MainGameProps {
  onBankrupt: (playerId: number) => void;
}

export const MainGame: React.FC<MainGameProps> = ({ onBankrupt }) => {
  const { players, transferMoney } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [isAnimatingTransfer, setIsAnimatingTransfer] = useState(false);
  const [animationPath, setAnimationPath] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleConfirmTransfer = (value: number) => {
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

    const match = transferType.match(/^(.+)-to-(.+)$/);
    if (match) {
      setAnimationPath({ from: match[1], to: match[2] });
      setIsAnimatingTransfer(true);
      setTimeout(
        () => setIsAnimatingTransfer(false),
        TRANSFER_ANIMATION_DURATION + 500
      ); // Buffer for last money element
    }

    setIsModalOpen(false);
  };

  const getPosition = (participant: string) => {
    const w = windowSize.width;
    const h = windowSize.height;
    if (participant === 'p1') return { x: w / 2, y: h * 0.2 };
    if (participant === 'p2') return { x: w / 2, y: h * 0.8 };
    if (participant === 'bank') return { x: w / 2, y: h * 0.5 };
    return { x: 0, y: 0 };
  };

  const pathData = animationPath
    ? `M ${getPosition(animationPath.from).x} ${getPosition(animationPath.from).y} L ${getPosition(animationPath.to).x} ${getPosition(animationPath.to).y}`
    : '';

  return (
    <div className='flex-1 flex flex-col h-full bg-background-dark relative select-none'>
      <Confetti
        key={confettiKey}
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={showConfetti ? 200 : 0}
        recycle={false}
        onConfettiComplete={() => setShowConfetti(false)}
        style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0 }}
      />

      <AnimatePresence>
        {isAnimatingTransfer && animationPath && (
          <div className='fixed inset-0 z-[150] pointer-events-none'>
            {[0, 1, 2].map((i) => (
              <motion.img
                key={i}
                src='/money.png'
                alt='money'
                className='w-12 h-12 absolute object-contain drop-shadow-xl'
                initial={{ offsetDistance: '0%', opacity: 0, scale: 0.5 }}
                animate={{
                  offsetDistance: '100%',
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{
                  duration: TRANSFER_ANIMATION_DURATION / 1000,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
                style={{
                  offsetPath: `path("${pathData}")`,
                  offsetRotate: 'auto 0deg'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transferType={transferType}
        players={players}
        onConfirm={handleConfirmTransfer}
        onCollectBonus={() => {
          setConfettiKey((prev) => prev + 1);
          setShowConfetti(true);
        }}
      />
    </div>
  );
};

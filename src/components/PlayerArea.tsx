import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

import { TrendingUp, TrendingDown, User } from 'lucide-react';

interface PlayerAreaProps {
  player: {
    id: number;
    name: string;
    balance: number;
    color: string;
    lastChange: number | null;
  };
  reverse?: boolean;
  onDragStart?: (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onDrag?: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd?: (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
}

export const PlayerArea: React.FC<PlayerAreaProps> = ({
  player,
  reverse = false,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 dark:bg-blue-700',
    red: 'bg-rose-600 dark:bg-rose-700',
    green: 'bg-green-600 dark:bg-green-700',
    yellow: 'bg-amber-500 dark:bg-amber-600',
    purple: 'bg-purple-600 dark:bg-purple-700',
    orange: 'bg-orange-600 dark:bg-orange-700'
  };

  const bgColorClass = colorMap[player.color] || 'bg-slate-600';

  return (
    <div
      className={`flex-1 ${bgColorClass} flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500`}>
      <div className='absolute inset-0 opacity-20 pointer-events-none'>
        <svg height='100%' width='100%'>
          <defs>
            <pattern
              id={`grid-${player.id}`}
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'>
              <path
                d='M 40 0 L 0 0 0 40'
                fill='none'
                stroke='white'
                strokeWidth='1'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill={`url(#grid-${player.id})`} />
        </svg>
      </div>

      <div
        className={`relative z-10 flex flex-col items-center text-center ${reverse ? 'flex-col-reverse' : 'flex-col'}`}>
        <div
          className={`${reverse ? 'mt-3' : 'mb-3'} px-6 py-2 bg-black/20 ios-blur rounded-full border border-white/10 shadow-lg flex items-center space-x-3`}>
          <span className='text-white text-3xl font-mono font-bold leading-none'>
            ${player.balance.toLocaleString()}
          </span>
          {player.lastChange !== null && (
            <div
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${player.lastChange > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {player.lastChange > 0 ? (
                <TrendingUp size={12} strokeWidth={3} />
              ) : (
                <TrendingDown size={12} strokeWidth={3} />
              )}
              <span>
                {player.lastChange > 0 ? '+' : ''}
                {player.lastChange}
              </span>
            </div>
          )}
        </div>

        <div className='flex flex-col items-center'>
          <p className='text-white text-xl font-bold tracking-tight'>
            {player.name}
          </p>
        </div>

        <motion.div
          ref={avatarRef}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          className={`relative w-32 h-32 bg-white/20 rounded-full flex items-center justify-center ${reverse ? 'mb-4' : 'mt-4'} ios-blur border-2 border-white/30 shadow-2xl active:scale-95 transition-transform cursor-grab active:cursor-grabbing overflow-hidden z-20`}>
          <User
            size={80}
            strokeWidth={1.5}
            className='text-white select-none'
          />
        </motion.div>
      </div>
    </div>
  );
};

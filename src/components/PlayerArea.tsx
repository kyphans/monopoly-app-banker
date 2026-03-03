import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { NumberTicker } from './ui/number-ticker';
import { TRANSFER_ANIMATION_DURATION } from '../constants/animations';

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

const COLOR_CONFIG: Record<
  string,
  { from: string; to: string; accent: string; logoA: string; logoB: string }
> = {
  blue: {
    from: '#1e3a5f',
    to: '#162d4e',
    accent: '#60a5fa',
    logoA: '#2563eb',
    logoB: '#93c5fd'
  },
  red: {
    from: '#5f1e1e',
    to: '#4a1616',
    accent: '#f87171',
    logoA: '#dc2626',
    logoB: '#fca5a5'
  },
  green: {
    from: '#1a4a28',
    to: '#143d20',
    accent: '#4ade80',
    logoA: '#16a34a',
    logoB: '#86efac'
  },
  yellow: {
    from: '#4a3510',
    to: '#3d2c0c',
    accent: '#fbbf24',
    logoA: '#d97706',
    logoB: '#fde68a'
  },
  purple: {
    from: '#3a1a5f',
    to: '#2d144a',
    accent: '#c084fc',
    logoA: '#9333ea',
    logoB: '#e9d5ff'
  },
  orange: {
    from: '#5f2e10',
    to: '#4a240c',
    accent: '#fb923c',
    logoA: '#ea580c',
    logoB: '#fed7aa'
  }
};

const BG_COLOR: Record<string, string> = {
  blue: 'bg-blue-600 dark:bg-blue-700',
  red: 'bg-rose-600 dark:bg-rose-700',
  green: 'bg-green-600 dark:bg-green-700',
  yellow: 'bg-amber-500 dark:bg-amber-600',
  purple: 'bg-purple-600 dark:bg-purple-700',
  orange: 'bg-orange-600 dark:bg-orange-700'
};

const CardChip: React.FC = () => (
  <svg width='38' height='30' viewBox='0 0 38 30' fill='none'>
    <rect
      x='0.5'
      y='0.5'
      width='37'
      height='29'
      rx='4'
      fill='#c9a227'
      stroke='#a07a14'
      strokeWidth='0.8'
    />
    <line x1='12' y1='0' x2='12' y2='30' stroke='#a07a14' strokeWidth='0.7' />
    <line x1='26' y1='0' x2='26' y2='30' stroke='#a07a14' strokeWidth='0.7' />
    <line x1='0' y1='10' x2='38' y2='10' stroke='#a07a14' strokeWidth='0.7' />
    <line x1='0' y1='20' x2='38' y2='20' stroke='#a07a14' strokeWidth='0.7' />
    <rect x='12' y='10' width='14' height='10' rx='2' fill='#b8920d' />
  </svg>
);

const WaveLines: React.FC = () => (
  <svg
    className='absolute inset-0 w-full h-full'
    viewBox='0 0 360 200'
    preserveAspectRatio='xMidYMid slice'
    xmlns='http://www.w3.org/2000/svg'>
    {Array.from({ length: 16 }, (_, i) => {
      const y = -8 + i * 16;
      const a = 7;
      return (
        <path
          key={i}
          d={`M-20 ${y} C 60 ${y - a}, 120 ${y + a}, 190 ${y} S 300 ${y - a}, 380 ${y}`}
          fill='none'
          stroke='white'
          strokeWidth='0.9'
          opacity='0.065'
        />
      );
    })}
  </svg>
);

export const PlayerArea: React.FC<PlayerAreaProps> = ({
  player,
  reverse = false,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const config = COLOR_CONFIG[player.color] || COLOR_CONFIG.blue;
  const bgColorClass = BG_COLOR[player.color] || 'bg-slate-600';

  return (
    <div
      className={`flex-1 ${bgColorClass} flex items-center justify-center p-5 relative overflow-hidden transition-colors duration-500 ${reverse ? 'rotate-180' : ''}`}>
      {/* Grid pattern */}
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

      {/* Bank Card */}
      <motion.div
        ref={cardRef}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        className='relative w-full rounded-[22px] overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing active:scale-[0.97] transition-transform select-none'
        style={{
          maxWidth: 300,
          aspectRatio: '1.586 / 1',
          boxShadow: `0 20px 60px -10px ${config.accent}40, 0 8px 24px -4px #00000080`
        }}>
        {/* Card gradient */}
        <div
          className='absolute inset-0'
          style={{
            background: `linear-gradient(140deg, ${config.from} 0%, ${config.to} 60%, ${config.from} 100%)`
          }}
        />

        {/* Wave pattern */}
        <WaveLines />

        {/* Top specular edge */}
        <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent' />

        {/* Card content */}
        <div className='relative z-10 h-full flex flex-col justify-between p-[18px]'>
          {/* Row 1 — Logo + Chip */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {/* Two-circle Mastercard-style logo */}
              <div className='relative w-9 h-6 flex items-center'>
                <div
                  className='absolute left-0 w-6 h-6 rounded-full'
                  style={{ backgroundColor: config.logoA, opacity: 0.95 }}
                />
                <div
                  className='absolute left-[14px] w-6 h-6 rounded-full'
                  style={{ backgroundColor: config.logoB, opacity: 0.8 }}
                />
              </div>
              <span
                className='text-[9px] font-black uppercase tracking-[0.2em]'
                style={{ color: `${config.accent}80` }}>
                Monopoly
              </span>
            </div>
            <CardChip />
          </div>

          {/* Row 2 — Balance */}
          <div>
            <p
              className='text-[8px] font-black uppercase tracking-[0.25em] mb-1'
              style={{ color: `${config.accent}60` }}>
              Balance
            </p>
            <div className='flex items-center gap-2'>
              <span className='text-white font-black font-mono text-[30px] leading-none tracking-tight'>
                $
                <NumberTicker
                  value={player.balance}
                  className='text-white font-black font-mono text-[30px] leading-none tracking-tight'
                  duration={TRANSFER_ANIMATION_DURATION}
                />
              </span>
              {player.lastChange !== null && (
                <span
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[12px] font-black ${
                    player.lastChange > 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                  {player.lastChange > 0 ? (
                    <TrendingUp size={12} strokeWidth={3} />
                  ) : (
                    <TrendingDown size={12} strokeWidth={3} />
                  )}
                  {player.lastChange > 0 ? '+' : ''}
                  {Math.abs(player.lastChange)}
                </span>
              )}
            </div>
          </div>

          {/* Row 3 — Name + label */}
          <div className='flex items-end justify-between'>
            <p className='text-white font-black text-sm uppercase tracking-[0.1em]'>
              {player.name}
            </p>
            <p
              className='text-[8px] font-black uppercase tracking-widest'
              style={{ color: `${config.accent}40` }}>
              Banker
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

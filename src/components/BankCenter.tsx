import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

interface BankCenterProps {
  onClick: () => void;
  onDragStart?: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDrag?: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd?: (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

export const BankCenter: React.FC<BankCenterProps> = ({ 
  onClick,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const bankRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-0 z-40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          ref={bankRef}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onClick={onClick}
          className="bank-ring w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center border-4 border-gray-100 dark:border-slate-700 cursor-grab active:cursor-grabbing active:scale-95 transition-transform z-10 hover:brightness-105"
        >
          <span className="material-symbols-outlined text-4xl text-slate-800 dark:text-white select-none">account_balance</span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1 text-slate-500 dark:text-slate-400">The Bank</span>
        </motion.div>
      </div>
    </div>
  );
};

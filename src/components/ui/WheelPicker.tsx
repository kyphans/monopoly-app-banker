import React, { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

interface WheelPickerProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  options,
  value,
  onChange,
  itemHeight = 50
}) => {
  const scrollY = useMotionValue(0);

  const selectedIndex = options.indexOf(value);
  const initialOffset = selectedIndex !== -1 ? -selectedIndex * itemHeight : 0;

  useEffect(() => {
    scrollY.set(initialOffset);
  }, [value, initialOffset, scrollY]);

  return (
    <div className='relative w-full h-[150px] overflow-hidden flex flex-col items-center select-none'>
      {/* Selection Highlight */}
      <div className='absolute top-1/2 left-0 right-0 h-[50px] -translate-y-1/2 border-y border-slate-200 dark:border-slate-700 bg-primary/5 pointer-events-none z-10' />

      <div
        className='w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide no-scrollbar'
        style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
        onScroll={(e) => {
          const index = Math.round(e.currentTarget.scrollTop / itemHeight);
          if (options[index] !== undefined && options[index] !== value) {
            onChange(options[index]);
          }
        }}>
        <div style={{ height: (150 - itemHeight) / 2 }} />
        {options.map((opt, i) => (
          <div
            key={i}
            className={`h-[50px] flex items-center justify-center snap-center transition-all duration-300 ${
              value === opt
                ? 'text-2xl font-black text-black dark:text-white'
                : 'text-lg font-bold text-slate-400 opacity-40 scale-90'
            }`}
            style={{ height: itemHeight }}>
            {opt}
          </div>
        ))}
        <div style={{ height: (150 - itemHeight) / 2 }} />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

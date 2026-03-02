import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  rightElement
}) => {
  return (
    <div className='flex rounded-4xl items-center justify-between mb-8 bg-white dark:bg-[#0f151c]/80 backdrop-blur-md z-20 py-4 px-2'>
      {onBack ? (
        <button
          onClick={onBack}
          className='flex items-center text-primary font-bold hover:opacity-70 transition-opacity'>
          <ChevronLeft size={24} />
          <span className='text-lg'>Back</span>
        </button>
      ) : (
        <div className='w-12'></div>
      )}

      <h1 className='text-xl font-black dark:text-white'>{title}</h1>

      {rightElement || <div className='w-12'></div>}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const [mounted, setMounted] = useState(false);

  // If the modal is opened, we want to mount it immediately during the render phase
  // to avoid a "cascading render" (render -> effect -> render cycle).
  if (isOpen && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className='absolute inset-0 bg-black/60 ios-blur' />
      <div
        className={`relative bg-white dark:bg-slate-900 w-full h-[100dvh] md:h-auto md:max-w-sm rounded-none md:rounded-[2.5rem] shadow-2xl overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-y-0 md:scale-100' : 'translate-y-full md:translate-y-0 md:scale-90'}`}>
        <div className='flex justify-between items-center p-8 pb-4'>
          <h3 className='text-md lg:text-xl font-bold dark:text-white'>
            {title}
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'>
            <X size={24} />
          </button>
        </div>
        <div className='w-full h-full px-8 pb-8 flex justify-center items-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

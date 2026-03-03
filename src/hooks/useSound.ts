import { useRef, useCallback } from 'react';

export const useSound = (src: string, volume = 1) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.volume = Math.min(1, Math.max(0, volume));
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [src, volume]);

  return play;
};

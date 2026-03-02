/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

export const useFullscreen = () => {
  useEffect(() => {
    const enterFullscreen = () => {
      const element = document.documentElement as any;
      const doc = document as any;

      // Check if already in fullscreen (standard and vendor prefixed)
      const isFullscreen = doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      if (isFullscreen) return;

      // Compatibility for different browsers
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        /* Safari, Chrome and Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        /* IE/Edge */
        element.msRequestFullscreen();
      }
    };

    // Browsers require a user gesture to enter fullscreen.
    // We'll try to enter fullscreen on the first click/touch interaction.
    const handleFirstInteraction = () => {
      enterFullscreen();
      // Remove listeners after first interaction
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);
};

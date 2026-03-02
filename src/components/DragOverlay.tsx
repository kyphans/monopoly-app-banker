import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface DragOverlayProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  sourceLabel: string;
  targetLabel: string | null;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ 
  startPoint, 
  currentPoint, 
  sourceLabel, 
  targetLabel 
}) => {
  if (!startPoint || !currentPoint) return null;

  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return (
    <div className="fixed inset-0 pointer-events-none z-200">
      <svg className="w-full h-full">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#13ec5b" />
          </marker>
        </defs>
        
        <AnimatePresence>
          {distance > 20 && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              x1={startPoint.x}
              y1={startPoint.y}
              x2={currentPoint.x}
              y2={currentPoint.y}
              stroke="#13ec5b"
              strokeWidth="4"
              strokeDasharray="8 4"
              markerEnd="url(#arrowhead)"
              className="drop-shadow-[0_0_8px_rgba(19,236,91,0.5)]"
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Action Indicator */}
      <div 
        className="fixed bg-black/80 ios-blur px-4 py-2 rounded-full border border-white/20 text-primary font-bold text-xs uppercase tracking-widest shadow-2xl"
        style={{ 
          left: currentPoint.x + 20, 
          top: currentPoint.y - 40,
          transform: 'translate(0, 0)'
        }}
      >
        <div className="flex items-center space-x-2">
          <span>{sourceLabel}</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
          <span>{targetLabel || '...'}</span>
        </div>
      </div>
    </div>
  );
};

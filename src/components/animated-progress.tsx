'use client';

import { motion } from 'framer-motion';
import { Progress, ProgressProps } from '@/components/ui/progress';
import { ReactNode } from 'react';

interface AnimatedProgressProps extends ProgressProps {
  value: number;
  delay?: number;
  duration?: number;
  showLabel?: boolean;
  label?: string;
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  delay = 0,
  duration = 1,
  showLabel = true,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {showLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay }}
          className="flex justify-between text-sm text-muted-foreground mb-2"
        >
          <span>{label || 'Progress'}</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            {Math.round(value)}%
          </motion.span>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration, delay }}
        className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${value}%` }}
          transition={{ 
            duration: duration * 1.5, 
            delay: delay + 0.1,
            ease: "easeOut"
          }}
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
        />
      </motion.div>
    </div>
  );
};

export default AnimatedProgress;
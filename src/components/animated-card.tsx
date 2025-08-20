'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  hover?: boolean;
  initialY?: number;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  hover = true,
  initialY = 20,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: initialY,
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      whileHover={hover ? {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      className={className}
      onClick={onClick}
    >
      <Card className="h-full">
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
'use client';

import { motion } from 'framer-motion';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { ReactNode } from 'react';

interface AnimatedBadgeProps extends BadgeProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  pulse?: boolean;
}

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  pulse = false,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={pulse ? {
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : { opacity: 1, scale: 1 }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      <Badge {...props}>
        {children}
      </Badge>
    </motion.div>
  );
};

export default AnimatedBadge;
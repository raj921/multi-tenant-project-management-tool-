'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  hoverScale?: number;
  tapScale?: number;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  hoverScale = 1.05,
  tapScale = 0.95,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: hoverScale,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: tapScale,
        transition: { duration: 0.1 }
      }}
      className={className}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
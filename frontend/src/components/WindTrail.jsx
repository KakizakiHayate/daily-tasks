import React from 'react';
import { motion } from 'framer-motion';

export const WindTrail = () => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 0.8,
        times: [0, 0.2, 1],
        repeat: Infinity,
      }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 w-16 h-0.5 bg-blue-200"
          style={{
            top: `${30 + i * 20}%`,
            transform: 'translateX(-100%)',
          }}
          animate={{
            x: ['0%', '200%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}; 
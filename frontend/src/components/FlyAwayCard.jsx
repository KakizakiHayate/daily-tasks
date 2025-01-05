import React from 'react';
import { motion } from 'framer-motion';

const flyAwayVariants = {
  initial: {
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transformOrigin: 'center',
  },
  animate: {
    scale: [1, 1.1, 0.8],
    x: [0, -50, window.innerWidth],
    y: [0, -100, -200],
    rotate: [0, -15, -30],
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const FlyAwayCard = ({ task, children }) => {
  return (
    <motion.div
      variants={flyAwayVariants}
      initial="initial"
      animate="animate"
      className="relative flex items-center p-4 mb-3 bg-white rounded-lg shadow-lg"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex items-center space-x-3 w-full">
        <motion.p className="text-lg text-gray-800">{task.title}</motion.p>
      </div>
      {children}
    </motion.div>
  );
}; 
import React from 'react';
import { motion } from 'framer-motion';

const Sparkle = ({ delay }) => (
  <motion.div
    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
    style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 0.8,
      delay,
      ease: 'easeOut',
    }}
  />
);

export const SparkleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <Sparkle key={i} delay={i * 0.1} />
      ))}
    </div>
  );
}; 
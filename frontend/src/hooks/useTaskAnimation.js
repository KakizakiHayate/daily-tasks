import { useState } from 'react';

export const useTaskAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const startFlyAnimation = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAnimating(false);
        resolve();
      }, 1200); // アニメーション時間と同じにする
    });
  };

  return {
    isAnimating,
    startFlyAnimation,
  };
}; 
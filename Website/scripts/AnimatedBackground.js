// AnimatedBackground.js
import React, { useState, useEffect } from 'react';

export const AnimatedBackground = () => {
  const [squares, setSquares] = useState([]);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const rows = Math.ceil(windowDimensions.height / 50);
    const cols = Math.ceil(windowDimensions.width / 50);
    const newSquares = Array(rows * cols).fill(0);
    setSquares(newSquares);
  }, [windowDimensions]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#f5f5f5] overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4">
        {squares.map((_, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-blue-100 rounded-lg transition-all duration-700 ease-in-out hover:shadow-[0_0_20px_rgba(30,93,219,0.6)] hover:bg-blue-200"
          />
        ))}
      </div>
    </div>
  );
};
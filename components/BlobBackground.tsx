'use client'

import React, { useEffect, useState } from 'react';

const BlobBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with null to prevent hydration mismatch
  const [scale, setScale] = useState(1);
  const [scroll, setScroll] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 }); // Default fallback sizes

  useEffect(() => {
    setMounted(true);

    // Update dimensions with actual window size
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Handle scroll
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScroll(scrollPercent);
    };

    // Handle resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Breathing animation
    const breathe = () => {
      const breatheScale = 1 + 0.05 * Math.sin(Date.now() / 2000);
      setScale(breatheScale);
      requestAnimationFrame(breathe);
    };

    // Start animation only after mounting
    const animationFrame = requestAnimationFrame(breathe);

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Remove scroll dependency to prevent re-running effect

  // Calculate blob size based on screen dimensions
  const blobSize = Math.min(dimensions.width, dimensions.height) * 0.5;

  // Don't render the blob until after mounting to prevent hydration mismatch
  const renderBlob = mounted && (
    <div
      className="fixed rounded-full bg-linear-to-r from-purple-500 via-pink-500 to-red-500 opacity-50 blur-3xl"
      style={{
        width: `${blobSize}px`,
        height: `${blobSize}px`,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale * (1 + scroll / 100)})`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-slate-900">
      {/* Background blur effect */}
      <div className="fixed inset-0 bg-slate-900 backdrop-blur-3xl" />

      {/* Breathing blob */}
      {renderBlob}

      {/* Content container */}
      <div className="relative z-10 min-h-screen py-10">
        {children}
      </div>
    </div>
  );
};

export default BlobBackground;
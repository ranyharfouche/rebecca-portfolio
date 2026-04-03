'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    fetchHeroImage();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchHeroImage();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchHeroImage = async () => {
    try {
      const response = await fetch(`/api/hero-about?t=${Date.now()}`);
      const data = await response.json();
      if (data.heroImage) {
        setHeroImage(data.heroImage);
      }
    } catch (error) {
      console.error('Failed to fetch hero image:', error);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-800/80 to-black/90"></div>
        {heroImage && (
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${heroImage})` }}></div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-serif text-white mb-4 tracking-wide">
          Rebecca Abi Younes
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-sans">
          Computer Graphics Artist
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl">
          Explore My Work
        </button>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white/70" />
      </div>
    </div>
  );
}

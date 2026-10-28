// app/components/AdBanner.tsx
import React from 'react';

interface AdBannerProps {
  variant?: 'horizontal' | 'in-feed';
}

export default function AdBanner({ variant = 'horizontal' }: AdBannerProps) {
  if (variant === 'in-feed') {
    return (
      <div className="p-6 rounded-xl shadow-sm border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center min-h-[150px]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sponsored</span>
        <p className="text-gray-500 font-medium text-center">Your Business Ad Here</p>
        <p className="text-xs text-gray-400 mt-1 text-center">Reach thousands of entrepreneurs.</p>
        <button className="mt-3 text-sm font-bold text-green-600 hover:underline">
          Learn More
        </button>
      </div>
    );
  }

  // Default Horizontal Banner
  return (
    <div className="w-full bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center min-h-[100px] mb-8">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-2 left-4">Advertisement</span>
      <p className="text-gray-500 font-medium">Google AdSense Banner (728x90)</p>
    </div>
  );
}
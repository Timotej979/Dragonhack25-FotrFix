'use client';

import { useEffect, useState } from 'react';
import greetings from '@/components/wordphrases/greetings.json';

interface GreetingProps {
  minimized?: boolean;
}

export const Greeting = ({ minimized = false }: GreetingProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!minimized) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % greetings.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [minimized]);

  if (minimized) {
    return null; // Remove the greetings message when minimized is true
  }

  return (
    <div className="w-full flex flex-col items-center justify-center pb-4">
      <div
        key={index}
        className="mt-48 relative bg-white text-black text-lg px-4 py-2 rounded-xl shadow-md border border-zinc-300 max-w-[80%] text-center mb-[-50px]"
      >
        {greetings[index]}
        <div className="absolute left-[60%] -bottom-2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
      </div>

      <img
        src="/images/FotrFix-1.gif"
        alt="Greeting animation"
        className="mt-4 w-[50%] h-[60%] rounded-xl shadow-lg max-w-[70%] sm:max-w-[35%] md:max-w-[20%] lg:max-w-[15%]"
      />
    </div>
  );
};
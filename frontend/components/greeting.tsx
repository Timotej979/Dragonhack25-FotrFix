'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import greetings from '@/components/wordphrases/greetings.json';

interface GreetingProps {
  minimized?: boolean;
}

export const Greeting = ({ minimized = false }: GreetingProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const gifVariants = {
    normal: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
    minimized: {
      opacity: 1,
      y: -150,
      scale: 0.3,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pb-4">
      {!minimized && (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="mt-48 relative bg-white text-black text-lg px-4 py-2 rounded-xl shadow-md border border-zinc-300 max-w-[80%] text-center mb-[-50px]"
      >
        {greetings[index]}
        <div className="absolute left-[60%] -bottom-2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
      </motion.div>
      )}

      {/* Add larger margin-top to move the GIF further down */}
      <motion.img
      src="/images/FotrFix-1.gif"
      alt="Greeting animation"
      variants={gifVariants}
      initial="normal"
      animate={minimized ? 'minimized' : 'normal'}
      transition={{ delay: minimized ? 0 : 0.5 }}
      className={`mt-4 w-[50%] h-[60%] rounded-xl shadow-lg ${
        !minimized ? 'max-w-[70%] sm:max-w-[35%] md:max-w-[20%] lg:max-w-[15%]' : 'max-w-[50%]'
      }`}
      />
    </div>
  );
};
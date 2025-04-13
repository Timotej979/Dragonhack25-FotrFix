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

  // Define animation variants for the GIF image.
  // You can adjust the "y" and "scale" values to match the desired movement and shrinkage.
  const gifVariants = {
    normal: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
    minimized: {
      opacity: 1,
      y: -150, // Moves upward. Adjust this value as needed.
      scale: 0.3, // Shrinks the GIF size. Adjust to match your AI profile pic size.
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 pb-4">
      {/* Render greeting bubble only when NOT minimized */}
      {!minimized && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white text-black text-lg px-4 py-2 rounded-xl shadow-md border border-zinc-300 mb-4 max-w-[80%] text-center"
        >
          {greetings[index]}
          <div className="absolute left-[60%] -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </motion.div>
      )}

      {/* Animate the GIF image based on the minimized state */}
      <motion.img
        src="/images/FotrFix-1.gif"
        alt="Greeting animation"
        variants={gifVariants}
        initial="normal"
        animate={minimized ? 'minimized' : 'normal'}
        transition={{ delay: minimized ? 0 : 0.5 }}
        className={`w-auto h-auto rounded-xl shadow-lg ${
          !minimized ? 'max-w-[50%] sm:max-w-[45%] md:max-w-[40%] lg:max-w-[35%]' : 'max-w-[50px]'
        }`}
      />
    </div>
  );
};

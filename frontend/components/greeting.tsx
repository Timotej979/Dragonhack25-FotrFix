'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import greetings from '@/components/wordphrases/greetings.json';

export const Greeting = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      key="overview"
      className="w-full flex flex-col items-center justify-end gap-2 pb-4"
    >

      {/* Speech bubble */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white text-black text-lg px-4 py-2 rounded-xl shadow-md border border-zinc-300 mb-[-60px] max-w-[80%] text-center"
      >
        {greetings[index]}
        <div className="absolute left-[60%] -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
      </motion.div>


      {/* GIF */}
      <motion.img
        src="/images/FotrFix-1.gif"
        alt="Greeting animation"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="w-48 h-auto rounded-xl shadow-lg"

      />
    </div>
  );
};

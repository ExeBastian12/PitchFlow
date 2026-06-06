import { motion } from 'motion/react';
import React from 'react';

export function Hero({ onSignup }: { onSignup?: () => void }) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-pitch-lime opacity-10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-20 left-1/4 w-48 h-48 bg-blue-500 opacity-5 rounded-full blur-3xl -z-10"></div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 text-pitch-dark dark:text-white tracking-tight">
            The All-In-One OS for <br/><span className="text-pitch-lime drop-shadow-sm">Grassroots Football</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl font-medium">
             Bring everything together. Registration, payments, schedules, attendance, parent communication, and player development in one comprehensive platform built specifically for football clubs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={onSignup} className="bg-pitch-dark dark:bg-pitch-lime text-white dark:text-pitch-dark px-8 py-4 rounded-full text-base font-bold shadow-lg hover:bg-black dark:hover:bg-[#b0e600] transition-all hover:-translate-y-1 w-full sm:w-auto flex justify-center items-center">
              Get Started for Free
            </button>
            <button className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-pitch-dark dark:text-white px-8 py-4 rounded-full text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all w-full sm:w-auto shadow-sm">
              View Features
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

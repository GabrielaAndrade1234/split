import { motion } from 'framer-motion';

export function Scene0Intro() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col items-center gap-[1.5vw]">
        <motion.div 
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          className="w-[6vw] h-[6vw] bg-[#7c3aed] rounded-[1.5vw] flex items-center justify-center text-white shadow-2xl shadow-[#7c3aed]/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '3vw', height: '3vw' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </motion.div>
        
        <div className="text-center space-y-[0.5vw]">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[3vw] font-extrabold tracking-tight text-gray-900 leading-[1.1]"
          >
            A mágica por trás<br />do Split
          </motion.h2>
        </div>
      </div>
    </motion.div>
  );
}

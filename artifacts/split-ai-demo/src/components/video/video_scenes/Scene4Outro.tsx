import { motion } from 'framer-motion';

export function Scene4Outro() {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none flex items-center justify-center bg-white/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col items-center gap-[2vw]">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-[8vw] h-[8vw] bg-gray-900 rounded-[2vw] flex items-center justify-center text-white shadow-2xl"
        >
          {/* Faux Split Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" width="4vw" height="4vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>
        </motion.div>
        
        <div className="text-center space-y-[1vw]">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[4vw] font-extrabold tracking-tight text-gray-900"
          >
            Split
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[1.5vw] text-gray-500 font-medium"
          >
            O jeito inteligente de dividir despesas.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

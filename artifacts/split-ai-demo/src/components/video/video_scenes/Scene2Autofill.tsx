import { motion } from 'framer-motion';

export function Scene2Autofill() {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none flex items-center"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="ml-[8vw] max-w-[35vw] space-y-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          className="h-1.5 bg-[#7c3aed] rounded-full"
        />
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[3vw] font-extrabold tracking-tight text-gray-900 leading-[1.1]"
        >
          A IA entende tudo num instante.
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[1.5vw] text-gray-500 font-medium leading-snug"
        >
          Valor, categoria e pagadores são preenchidos automaticamente.
        </motion.p>
      </div>
    </motion.div>
  );
}

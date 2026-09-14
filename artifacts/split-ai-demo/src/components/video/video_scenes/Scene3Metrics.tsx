import { motion } from 'framer-motion';

export function Scene3Metrics() {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none flex items-center"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="ml-[8vw] max-w-[38vw] space-y-8">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          className="h-1.5 bg-[#10b981] rounded-full"
        />
        
        <div className="space-y-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[3vw] font-extrabold tracking-tight text-gray-900 leading-[1.1]"
          >
            Inteligência real. Custo invisível.
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[1.5vw] text-gray-500 font-medium leading-snug"
          >
            Com cache inteligente, pedidos repetidos não custam nada.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-6 mt-8"
        >
          <div className="bg-white p-[1.5vw] rounded-[1.5vw] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex-1">
            <span className="text-[#10b981] font-bold text-[0.8vw] uppercase tracking-wider mb-2 block">Custo por 1.000 chamadas</span>
            <div className="text-[2.5vw] font-mono font-bold text-gray-900">US$ 0.1292</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

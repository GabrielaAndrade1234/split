import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Send, Check, Loader, ChevronLeft, Utensils, Car, Home, XCircle, Cpu, Zap, Coins, DollarSign } from './icons';

export function SplitUI({ currentScene }: { currentScene: number }) {
  const [typedText, setTypedText] = useState("");
  const targetText = "Gabi pagou 150 reais no jantar para todos";
  
  useEffect(() => {
    if (currentScene === 1) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(targetText.slice(0, i));
        i++;
        if (i > targetText.length) clearInterval(interval);
      }, 50); // 40 characters * 50ms = 2 seconds
      return () => clearInterval(interval);
    } else if (currentScene > 1) {
      setTypedText(targetText);
    } else {
      setTypedText("");
    }
    return undefined;
  }, [currentScene]);

  // Derived state
  const isTyping = currentScene === 1;
  const isFilled = currentScene > 1;
  const isAnalyzing = currentScene === 2;
  const showMetrics = currentScene >= 3;

  return (
    <motion.div 
      className="absolute right-[10vw] top-[50%] origin-center flex flex-col bg-white overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] rounded-[40px]"
      style={{ width: '400px', height: '800px', y: '-50%' }}
      initial={{ x: '100vw', rotate: 5, scale: 0.8 }}
      animate={{
        x: currentScene === 0 ? '100vw' : '0vw',
        rotate: currentScene === 0 ? 5 : 0,
        scale: currentScene === 0 ? 0.8 : (currentScene === 4 ? 0.9 : 1),
        opacity: currentScene === 4 ? 0 : 1,
        filter: currentScene === 4 ? 'blur(10px)' : 'blur(0px)',
        y: showMetrics ? '-55%' : '-50%',
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {/* Top Bar */}
      <div className="flex items-center px-6 pt-12 pb-4 bg-white border-b border-gray-100 z-10 shrink-0">
        <ChevronLeft className="w-6 h-6 text-gray-800" />
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 mr-6 tracking-tight">Nova despesa</h1>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#fafafa] relative scrollbar-hide">
        <div className="p-6 space-y-6 pb-20">
          
          {/* AI Box */}
          <motion.div 
            layout
            className="bg-[#f5f3ff] border border-[#e2d9ff] rounded-[16px] p-5 space-y-4 relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 text-[#c4b5fd]/30 pointer-events-none">
              <Sparkles className="w-40 h-40" />
            </div>
            
            <h3 className="text-[13px] font-bold text-[#7c3aed] flex items-center gap-2 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              Preencher com IA
            </h3>
            
            <div className="flex gap-2 relative">
              <div className="flex-1 bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] text-gray-800 shadow-sm flex items-center">
                {typedText || <span className="text-gray-400">Ex: Paguei 120 no jantar...</span>}
                {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 h-5 bg-[#7c3aed] ml-0.5 inline-block" />}
              </div>
              <motion.div 
                className={`w-[48px] rounded-[12px] flex items-center justify-center text-white shadow-sm shrink-0 ${typedText.length > 5 ? 'bg-[#7c3aed]' : 'bg-[#c4b5fd]'}`}
                animate={{ scale: isAnalyzing ? 0.95 : 1 }}
              >
                {isAnalyzing ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </motion.div>
            </div>

            {/* Metrics expansion */}
            <AnimatePresence>
              {showMetrics && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="space-y-4 border-t border-[#7c3aed]/10 pt-4"
                >
                  <div className="flex items-start gap-2 bg-[#7c3aed] text-white p-3.5 rounded-[12px] text-[13px] font-medium leading-relaxed shadow-sm">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-white/80" />
                    <span>Entendi! O valor de R$150,00 pelo jantar foi pago por Gabi e será dividido entre todos.</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-3 mt-3">
                    <Metric icon={<Cpu />} label="gpt-5.6-luna" delay={0.1} />
                    <Metric icon={<Zap className="text-[#10b981]" />} label={<span className="text-[#10b981] font-bold">Cache rápido</span>} delay={0.2} />
                    <Metric icon={<Coins />} label="311 tokens" delay={0.3} />
                    <Metric icon={<DollarSign />} label="Custo: US$ 0.0001292" delay={0.4} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring' }}
                      className="w-full mt-1 flex items-center justify-between bg-[#10b981]/10 border border-[#10b981]/30 p-3 rounded-[10px]"
                    >
                      <span className="text-[12px] font-bold text-[#10b981] flex items-center gap-1.5 uppercase tracking-wide">
                        <Zap className="w-4 h-4" />
                        Economia gerada
                      </span>
                      <span className="font-mono font-bold text-[#10b981] text-[14px]">US$ 0.0001292</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* Regular Form Fields */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">O que é?</label>
              <div className="bg-white border border-gray-200 rounded-[12px] h-[56px] px-4 flex items-center shadow-sm">
                <span className={`text-[16px] ${isFilled && !isAnalyzing ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {isFilled && !isAnalyzing ? 'Jantar' : 'Ex: Jantar'}
                </span>
              </div>
            </div>
            <div className="w-[120px] space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Valor (R$)</label>
              <div className="bg-white border border-gray-200 rounded-[12px] h-[56px] px-4 flex items-center justify-end shadow-sm">
                <span className={`text-[16px] ${isFilled && !isAnalyzing ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {isFilled && !isAnalyzing ? '150,00' : '0,00'}
                </span>
              </div>
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              <CatButton icon={<Utensils />} label="Comida" active={isFilled && !isAnalyzing} delay={0.1} />
              <CatButton icon={<Car />} label="Viagem" active={false} delay={0} />
              <CatButton icon={<Home />} label="Hospedagem" active={false} delay={0} />
            </div>
          </div>

          {/* Quem pagou */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Quem pagou?</label>
            <div className="flex gap-4 items-center">
              <Avatar letter="A" name="Ana" active={false} />
              <Avatar letter="B" name="Bruno" active={false} />
              <Avatar letter="C" name="Clara" active={false} />
              <Avatar letter="G" name="Gabi" active={isFilled && !isAnalyzing} popDelay={0.2} />
              <Avatar letter="V" name="Você" active={false} />
            </div>
          </div>
          
          {/* Dividir entre */}
          <div className="bg-white border border-gray-200 p-5 rounded-[16px] shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dividir entre</label>
              <span className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-wider">Desmarcar todos</span>
            </div>
            <div className="space-y-3">
              {['Ana', 'Bruno', 'Clara', 'Gabi', 'Você'].map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <motion.div 
                    className={`w-6 h-6 rounded-[6px] flex items-center justify-center border-2 transition-colors duration-200
                      ${isFilled && !isAnalyzing ? 'bg-[#7c3aed] border-[#7c3aed]' : 'border-gray-300'}`}
                    animate={isFilled && !isAnalyzing ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ delay: 0.3 + (i * 0.05), duration: 0.3 }}
                  >
                    {isFilled && !isAnalyzing && <Check className="w-4 h-4 text-white" />}
                  </motion.div>
                  <span className="text-[15px] font-medium text-gray-800">{name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function Metric({ icon, label, delay }: { icon: React.ReactNode, label: React.ReactNode, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + delay }}
      className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium"
    >
      <div className="w-4 h-4 flex items-center justify-center opacity-70">{icon}</div>
      {label}
    </motion.div>
  );
}

function CatButton({ icon, label, active, delay }: { icon: React.ReactNode, label: string, active: boolean, delay: number }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.05, 1], backgroundColor: '#f5f3ff', borderColor: '#7c3aed', color: '#7c3aed' } : { backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#6b7280' }}
      transition={{ delay }}
      className="flex flex-col items-center justify-center p-3 rounded-[12px] border shadow-sm h-[80px]"
    >
      <div className="w-6 h-6 mb-2">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

function Avatar({ letter, name, active, popDelay = 0 }: { letter: string, name: string, active: boolean, popDelay?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
        className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-[18px] font-bold relative"
        animate={active ? { 
          backgroundColor: '#e2d9ff', 
          color: '#7c3aed',
          boxShadow: '0 0 0 2px #7c3aed',
          scale: [1, 1.1, 1]
        } : { 
          backgroundColor: '#f3f4f6', 
          color: '#9ca3af',
          boxShadow: '0 0 0 0px transparent',
          scale: 1
        }}
        transition={{ delay: popDelay }}
      >
        {letter}
        {active && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: popDelay + 0.1, type: 'spring' }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7c3aed] text-white rounded-full flex items-center justify-center border-2 border-white"
          >
            <Check className="w-3 h-3" />
          </motion.div>
        )}
      </motion.div>
      <span className={`text-[12px] font-medium ${active ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>{name}</span>
    </div>
  );
}

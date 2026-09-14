import { motion } from 'framer-motion';

export function VideoBackground({ currentScene }: { currentScene: number }) {
  // A subtle mesh gradient background with drifting orbs
  return (
    <div className="absolute inset-0 bg-[#f1f5f9] overflow-hidden -z-10 pointer-events-none">
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />
      
      {/* Drifting shapes */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] bg-purple-500/20"
        animate={{
          x: currentScene > 1 ? '10vw' : '0vw',
          y: currentScene > 2 ? '20vh' : '0vh',
          scale: currentScene === 4 ? 1.5 : 1,
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-indigo-500/10"
        animate={{
          x: currentScene > 1 ? '-20vw' : '0vw',
          y: currentScene === 3 ? '-10vh' : '0vh',
          scale: currentScene === 4 ? 1.2 : 1,
        }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full blur-[80px] bg-emerald-500/10"
        animate={{
          opacity: currentScene === 3 ? 0.8 : 0.1,
          scale: currentScene === 3 ? 1.5 : 1,
        }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
    </div>
  );
}

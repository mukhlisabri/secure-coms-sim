import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Terminal, HelpCircle, GripHorizontal, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const MISSION_DATA = {
  ciphertext: "DNHREEDTEOTFTF", // DEFEND THE FORT (3 rails)
  solution: "DEFENDTHEFORT",
  correctRails: 3
};

const RailFence = () => {
  const [step, setStep] = useState('BRIEFING'); // BRIEFING, DECRYPT, SUCCESS
  const [railCount, setRailCount] = useState(2);
  const [userDecryption, setUserDecryption] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [matrix, setMatrix] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update visualization matrix
  useEffect(() => {
    setIsLoading(true);
    // Wrap in small timeout to prevent UI blocking and allow 'loading' state if calculation was heavy (it's not, but good practice)
    const timer = setTimeout(() => {
      const vizMatrix = createDecryptionMatrix(MISSION_DATA.ciphertext, railCount);
      if (vizMatrix && vizMatrix.length > 0) {
        setMatrix(vizMatrix);
      }
      setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [railCount]);

  const handleVerify = () => {
    const cleanInput = userDecryption.toUpperCase().replace(/\s/g, '');
    const success = cleanInput === MISSION_DATA.solution;

    // Dispatch event for CyberTutor
    window.dispatchEvent(new CustomEvent('cyber-tutor-event', {
      detail: { type: 'submission', success }
    }));

    if (success) {
      setStep('SUCCESS');
    } else {
      setAttempts(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-cyan-400 w-8 h-8" />
          <span className="tracking-tight">MISSION 1: <span className="text-cyan-400">The Scramble</span></span>
        </h1>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full font-mono text-xs border backdrop-blur-sm transition-colors",
            step === 'SUCCESS'
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          )}>
            {step === 'SUCCESS' ? 'STATUS: SECURE' : 'STATUS: INTERCEPTED'}
          </span>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {step === 'BRIEFING' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/80 backdrop-blur-md p-8 rounded-xl border border-slate-700/50 space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <h2 className="text-xl text-cyan-100 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              INCOMING TRANSMISSION
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-2xl">
              Agent, verify the integrity of the secure line. We have intercepted a scrambled message from the Rogue Faction.
              Intelligence suggests a <span className="text-cyan-400 font-bold border-b border-cyan-500/30">Rail Fence Transposition</span> was used to obfuscate the data.
            </p>

            <div className="bg-slate-950/80 p-6 rounded-lg border border-slate-800 font-mono text-2xl tracking-[0.2em] text-center text-amber-400 shadow-inner">
              {MISSION_DATA.ciphertext}
            </div>

            <p className="text-slate-400 text-sm italic">
              Use the zig-zag pattern visualization tool to reconstruct the message. Vary the height of the fence (rails) until the plaintext is readable.
            </p>

            <button
              onClick={() => setStep('DECRYPT')}
              className="group px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-all shadow-[0_0_20px_-5px_rgba(8,145,178,0.5)] flex items-center gap-2"
            >
              INITIATE DECRYPTION_TOOL
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 'DECRYPT' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tool Interface */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-slate-700/50 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-8">

                {/* Controls */}
                <div className="lg:w-1/3 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-cyan-400 font-mono font-bold flex items-center gap-2">
                        <GripHorizontal className="w-4 h-4" /> RAIL CONFIGURATION
                      </label>
                      <span className="text-2xl font-bold text-white bg-slate-800 px-3 py-1 rounded border border-slate-700">
                        {railCount}
                      </span>
                    </div>

                    <div className="relative h-12 flex items-center px-2">
                      <div className="absolute w-full h-1 bg-slate-700/50 rounded-full"></div>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={railCount}
                        onChange={(e) => setRailCount(parseInt(e.target.value))}
                        className="w-full relative z-10 appearance-none bg-transparent [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.5)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 font-mono px-1">
                      <span>MIN (2)</span>
                      <span>MAX (6)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-slate-400 font-mono">DECODED MESSAGE INPUT</label>
                    <input
                      type="text"
                      value={userDecryption}
                      onChange={(e) => setUserDecryption(e.target.value)}
                      placeholder="ENTER PLAINTEXT..."
                      className="w-full bg-slate-950/50 border border-slate-700 rounded p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono tracking-wider"
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded font-bold transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] border border-cyan-500/20"
                  >
                    VERIFY SOLUTION
                  </button>

                </div>

                {/* Visualization Grid */}
                <div className="lg:w-2/3 bg-slate-950/80 rounded-lg border border-slate-700/50 p-6 overflow-hidden relative group min-h-[300px]">
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Activity className="w-3 h-3" /> LIVE PREVIEW
                  </div>

                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-cyan-500/50 animate-pulse font-mono">
                      CALCULATING TRANSPOSTION...
                    </div>
                  ) : (
                    !matrix || matrix.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-red-500/50 font-mono">
                        GRID INITIALIZATION ERROR
                      </div>
                    ) : (
                      <div
                        className="grid gap-x-1 gap-y-2 min-w-max p-4 items-center justify-start overflow-x-auto custom-scrollbar"
                        style={{
                          gridTemplateRows: `repeat(${railCount}, 1fr)`,
                          // Use raw length safely
                          gridTemplateColumns: `repeat(${MISSION_DATA.ciphertext.length}, minmax(32px, 1fr))`
                        }}
                      >
                        {matrix.map((row, rIndex) => (
                          row.map((char, cIndex) => (
                            <div key={`${rIndex}-${cIndex}`} className="w-8 h-8 flex items-center justify-center relative">
                              {char && (
                                <motion.div
                                  layoutId={`char-${char}-${cIndex}`}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                  className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-lg font-mono text-base font-bold shadow-lg border",
                                    "bg-slate-800 text-cyan-300 border-cyan-500/30 shadow-cyan-900/20"
                                  )}
                                >
                                  {char}
                                </motion.div>
                              )}
                              {/* Rail guide dot */}
                              {!char && (
                                <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                              )}
                            </div>
                          ))
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-950/30 backdrop-blur-md border border-emerald-500/30 p-10 rounded-xl text-center space-y-8"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/10"
            >
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-2">MESSAGE DECRYPTED</h2>
              <p className="text-emerald-400/80 font-mono text-sm tracking-wider">INTELLIGENCE SECURED</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg inline-block border border-emerald-500/20">
              <span className="text-slate-400 text-sm block mb-2 font-mono">RECOVERED PLAINTEXT:</span>
              <span className="text-white font-mono font-bold text-2xl tracking-widest">{MISSION_DATA.solution}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper for generic grid generation
function createDecryptionMatrix(text, rails) {
  if (!text || rails < 2) return [];

  // Initialize with nulls
  const matrix = Array.from({ length: rails }, () => Array(text.length).fill(null));

  let rail = 0;
  let direction = 1;

  // 1. Mark spots
  const spots = [];
  for (let i = 0; i < text.length; i++) {
    spots.push({ r: rail, c: i });
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction = -direction;
  }

  // 2. Sort spots by Row then Column to simulate reading order
  // Actually, for the "What if it was 3 rails?" visualization, we want to show
  // where the letters WOULD GO if we filled the grid Row-by-Row (which is how the cipher is constructed)
  // Wait, Rail Fence ENCRYPTION writes down-up zig-zag, reads Row-by-Row.
  // DECRYPTION is the inverse.
  // If we want to show "Here is the ciphertext 'DNH...' arranged in 3 rails", we effectively
  // need to fill the zig-zag spots with the ciphertext in reading order (Row-by-Row).

  const sortedSpots = [...spots].sort((a, b) => a.r - b.r || a.c - b.c);

  // 3. Fill the matrix
  for (let i = 0; i < text.length; i++) {
    const spot = sortedSpots[i];
    if (spot && matrix[spot.r]) {
      matrix[spot.r][spot.c] = text[i];
    }
  }

  return matrix;
}

export default RailFence;

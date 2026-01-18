import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, XCircle, HelpCircle, Terminal } from 'lucide-react';
import { generateRailFenceMatrix, decryptRailFence } from '../utils/railFence';
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
  const [showHint, setShowHint] = useState(false);
  const [matrix, setMatrix] = useState([]);

  // Mock AI Tutor tracking
  useEffect(() => {
    if (attempts >= 3) {
      setShowHint(true);
    }
  }, [attempts]);

  // Update matrix when rail count changes
  useEffect(() => {
    // To visualize DECRYPTION, we need to reconstruct the fence based on the ciphertext and rail count
    // The "generateRailFenceMatrix" does encryption path. For decryption viz, we want to show 
    // how the ciphertext fills the rails.
    
    // Actually, visually showing "what it looks like if you pick N rails" means:
    // We assume N rails. We fill the zigzag pattern with placeholders.
    // We read ROW by ROW and fill from ciphertext.
    // Then we display that grid.
    
    // Let's create a visual helper for this specific "Decryption View"
    const vizMatrix = createDecryptionMatrix(MISSION_DATA.ciphertext, railCount);
    setMatrix(vizMatrix);
  }, [railCount]);

  const handleVerify = () => {
    if (userDecryption.toUpperCase().replace(/\s/g, '') === MISSION_DATA.solution) {
      setStep('SUCCESS');
    } else {
      setAttempts(prev => prev + 1);
      // Shake animation? (Not implemented yet)
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-cyan-400" />
          Mission 1: The Scramble
        </h1>
        <div className="flex items-center gap-2">
            <span className={cn(
              "px-3 py-1 rounded font-mono text-xs border transition-colors",
              step === 'SUCCESS' ? "bg-emerald-900/30 text-emerald-400 border-emerald-500/30" : "bg-amber-900/30 text-amber-400 border-amber-500/30"
            )}>
              {step === 'SUCCESS' ? 'MISSION ACCOMPLISHED' : 'DECRYPTION REQUIRED'}
            </span>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {step === 'BRIEFING' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 space-y-6"
          >
            <h2 className="text-xl text-cyan-100 font-bold">INCOMING TRANSMISSION</h2>
            <p className="text-slate-300">
              Agent, verify the integrity of the secure line. We have intercepted a scrambled message. 
              Intelligence suggests a <span className="text-cyan-400 font-bold">Rail Fence Transposition</span> was used.
            </p>
            <div className="bg-slate-950 p-4 rounded border border-slate-700 font-mono text-lg tracking-widest text-center text-amber-400">
              {MISSION_DATA.ciphertext}
            </div>
            <p className="text-slate-400 text-sm">
              Use the zig-zag pattern to reconstruct the message. Vary the number of rails until the text makes sense.
            </p>
            <button 
              onClick={() => setStep('DECRYPT')}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors flex items-center gap-2"
            >
              INITIATE DECRYPTION_TOOL <ArrowRight className="w-4 h-4" />
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
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Controls */}
                <div className="md:w-1/3 space-y-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-mono">RAIL CONFIGURATION</label>
                    <input 
                      type="range" 
                      min="2" 
                      max="6" 
                      value={railCount}
                      onChange={(e) => setRailCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                      <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                    </div>
                    <div className="mt-2 text-center font-bold text-2xl text-cyan-400">{railCount} RAILS</div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-mono">DECODED MESSAGE INPUT</label>
                    <input 
                      type="text" 
                      value={userDecryption}
                      onChange={(e) => setUserDecryption(e.target.value)}
                      placeholder="ENTER TEXT..."
                      className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                  </div>

                  <button 
                    onClick={handleVerify}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    VERIFY DECRYPTION
                  </button>

                  {/* AI Hint */}
                  <AnimatePresence>
                    {showHint && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-amber-500/10 border border-amber-500/20 p-4 rounded text-sm text-amber-200 flex gap-3 items-start"
                      >
                         <div className="bg-amber-500/20 p-1 rounded mt-1">
                           <HelpCircle className="w-4 h-4 text-amber-400" />
                         </div>
                         <div>
                           <span className="font-bold block text-xs mb-1 text-amber-400">CYBER-TUTOR HINT</span>
                           Try following the zig-zag path visually. Start at the top-left and go down-right, then up-right.
                           The message seems to be military commands.
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Visualization Grid */}
                <div className="md:w-2/3 bg-slate-950 rounded-lg border border-slate-800 p-6 overflow-x-auto">
                    <div 
                      className="grid gap-2 min-w-max" 
                      style={{ 
                        gridTemplateRows: `repeat(${railCount}, 1fr)`,
                        gridTemplateColumns: `repeat(${MISSION_DATA.ciphertext.length}, 1fr)`
                      }}
                    >
                      {/* We need to render the grid cells */}
                      {matrix.map((row, rIndex) => (
                        row.map((char, cIndex) => (
                          <motion.div
                            key={`${rIndex}-${cIndex}`}
                            className={cn(
                              "w-8 h-8 flex items-center justify-center rounded text-sm font-mono border transition-all duration-300",
                              char ? "bg-cyan-900/30 border-cyan-500/50 text-cyan-300" : "border-slate-800/50"
                            )}
                            layout
                          >
                             {char || ''}
                          </motion.div>
                        ))
                      ))}
                    </div>
                    
                    {/* Reading Order Line SVG Overlay (Optional, simple version for now) */}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'SUCCESS' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">MESSAGE DECRYPTED</h2>
            <p className="text-slate-300">
              Excellent work. You have successfully recovered the message: <br/>
              <span className="text-emerald-400 font-mono font-bold text-xl mt-2 block">{MISSION_DATA.solution}</span>
            </p>
            <p className="text-sm text-slate-400">
              Logic Verified: 3 Rails. Zig-Zag Transposition reversed.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to fill the matrix specifically for Visualization of "What if we use N rails?"
// This mimics the logic of "Setting up the fence for decryption"
function createDecryptionMatrix(text, rails) {
  if (!text || rails < 2) return [];

  // 1. Create empty grid
  const matrix = Array(rails).fill().map(() => Array(text.length).fill(null));
  
  // 2. Mark the Zig-Zag path with '?'
  let rail = 0;
  let direction = 1;
  for (let i = 0; i < text.length; i++) {
    matrix[rail][i] = '?';
    rail += direction;
    if (rail === rails - 1 || rail === 0) {
      direction = -direction;
    }
  }

  // 3. Fill the '?' with the text characters purely by ROW order (how Rail Fence is written)
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < text.length; c++) {
      if (matrix[r][c] === '?' && index < text.length) {
        matrix[r][c] = text[index++];
      }
    }
  }

  return matrix;
}

export default RailFence;

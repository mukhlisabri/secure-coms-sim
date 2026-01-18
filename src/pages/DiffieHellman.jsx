import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowRightLeft, ShieldAlert, Key, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

// Simple RGB model
const PUBLIC_COLOR = { r: 255, g: 255, b: 0, name: 'Yellow (Public)' }; // Base G

const DiffieHellman = () => {
  const [step, setStep] = useState('BRIEFING'); // BRIEFING, CHOOSE_SECRET, MIX_PUBLIC, EXCHANGE, FINAL_MIX, SUCCESS
  const [secretColor, setSecretColor] = useState(null);
  const [partnerSecret] = useState({ r: 0, g: 0, b: 200, name: 'Blue (Partner)' });
  const [partnerMix, setPartnerMix] = useState(null); // Public + Partner
  const [userMix, setUserMix] = useState(null); // Public + User
  const [sharedSecret, setSharedSecret] = useState(null); 
  
  const [mistakes, setMistakes] = useState(0);

  // Computed values
  const mixColors = (c1, c2) => ({
    r: Math.min(255, c1.r + c2.r), // Additive mixing simulation
    g: Math.min(255, c1.g + c2.g),
    b: Math.min(255, c1.b + c2.b)
  });

  const generateColorString = (c) => `rgb(${c.r}, ${c.g}, ${c.b})`;

  useEffect(() => {
    // Determine Partner's mix immediately (it's pre-calculated logic)
    setPartnerMix(mixColors(PUBLIC_COLOR, partnerSecret));
  }, [partnerSecret]);

  const handleChooseSecret = (color) => {
    setSecretColor(color);
    setStep('MIX_PUBLIC');
  };

  const handleMixPublic = () => {
    const mixed = mixColors(PUBLIC_COLOR, secretColor);
    setUserMix(mixed);
    setStep('EXCHANGE');
  };

  const handleExchange = () => {
    // Check if user is sending the wrong thing? (Not strictly possible in this guided flow, 
    // but we can add a 'TRAP' button later for AI testing)
    setStep('FINAL_MIX');
  };

  const handleFinalMix = () => {
    const final = mixColors(partnerMix, secretColor);
    setSharedSecret(final);
    setStep('SUCCESS');
  };

  const availableSecrets = [
    { r: 200, g: 0, b: 0, name: 'Red' },
    { r: 0, g: 200, b: 0, name: 'Green' },
    { r: 200, g: 0, b: 200, name: 'Purple' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Key className="text-purple-400" />
          Mission 2: The Handshake
        </h1>
        
        {step === 'SUCCESS' && (
           <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 rounded font-mono text-xs">
              SECURE CHANNEL ESTABLISHED
           </span>
        )}
      </div>

      <AnimatePresence mode='wait'>
        {step === 'BRIEFING' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 space-y-6"
          >
            <h2 className="text-xl text-purple-200 font-bold">KEY EXCHANGE PROTOCOL</h2>
            <p className="text-slate-300">
              We need to agree on a secret key with HQ without the enemy intercepting it.
              We will use the <strong>Diffie-Hellman Color Exchange</strong> method.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center text-sm font-mono text-slate-400">
              <div className="p-4 bg-slate-950 rounded border border-slate-700">
                1. Pick Secret Color
              </div>
              <div className="p-4 bg-slate-950 rounded border border-slate-700">
                2. Mix with Public Color
              </div>
              <div className="p-4 bg-slate-950 rounded border border-slate-700">
                3. Exchange Mixtures
              </div>
            </div>
            <button 
              onClick={() => setStep('CHOOSE_SECRET')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-colors"
            >
              START PROTOCOL
            </button>
          </motion.div>
        )}

        {step === 'CHOOSE_SECRET' && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
           >
              <h3 className="text-xl text-white">Step 1: Choose your Private Secret Color</h3>
              <p className="text-slate-400">This must NEVER be shared with anyone. Not even HQ.</p>
              
              <div className="flex justify-center gap-6">
                {availableSecrets.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChooseSecret(color)}
                    className="group flex flex-col items-center gap-3"
                  >
                    <div 
                      className="w-24 h-24 rounded-full border-4 border-slate-700 group-hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: generateColorString(color) }}
                    />
                    <span className="font-mono text-slate-300 group-hover:text-white">{color.name}</span>
                  </button>
                ))}
              </div>
           </motion.div>
        )}

        {step === 'MIX_PUBLIC' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 flex flex-col items-center gap-8"
           >
              <h3 className="text-xl text-white">Step 2: Create Public Mixture</h3>
              <div className="flex items-center gap-8">
                 <ColorBeaker color={secretColor} label="YOUR SECRET" />
                 <span className="text-2xl text-slate-500">+</span>
                 <ColorBeaker color={PUBLIC_COLOR} label="PUBLIC BASE" />
                 <span className="text-2xl text-slate-500">=</span>
                 <div className="relative">
                    <div className="w-24 h-32 bg-slate-800 rounded-b-xl border-2 border-slate-600 flex items-end justify-center overflow-hidden">
                       <div className="w-full h-2/3 bg-slate-700 animate-pulse text-xs flex items-center justify-center text-slate-500">
                          ?
                       </div>
                    </div>
                    <span className="block text-center mt-2 font-mono text-xs text-slate-500">YOUR MIXTURE</span>
                 </div>
              </div>

              <button 
                onClick={handleMixPublic}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold shadow-lg shadow-purple-900/20"
              >
                MIX COLORS
              </button>
           </motion.div>
        )}

        {step === 'EXCHANGE' && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="space-y-8"
           >
              <h3 className="text-xl text-white text-center">Step 3: The Exchange</h3>
              <p className="text-center text-slate-400 max-w-lg mx-auto">
                 Send your mixture to HQ. They will send theirs. 
                 <br/><span className="text-amber-400 text-sm">Notice: Even if the enemy sees these mixtures, they cannot un-mix them to find your secret.</span>
              </p>

              <div className="flex justify-between items-center max-w-2xl mx-auto p-8 bg-slate-950/50 rounded-xl relative">
                  {/* Arrows */}
                  <ArrowRightLeft className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-slate-600" />
                  
                  <div className="text-center space-y-2">
                    <ColorBeaker color={userMix} label="YOUR MIXTURE" />
                    <p className="text-xs font-mono text-cyan-400">READY TO SEND</p>
                  </div>

                  <div className="text-center space-y-2">
                    <ColorBeaker color={partnerMix} label="HQ MIXTURE" />
                    <p className="text-xs font-mono text-purple-400">INCOMING</p>
                  </div>
              </div>

              <div className="text-center">
                 <button 
                    onClick={handleExchange}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold"
                 >
                    EXCHANGE PACKETS
                 </button>
              </div>
           </motion.div>
        )}

        {step === 'FINAL_MIX' && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 flex flex-col items-center gap-8"
           >
              <h3 className="text-xl text-white">Step 4: Generate Shared Secret</h3>
              <p className="text-slate-400">Add your <span className="text-white font-bold">PRIVATE SECRET</span> to the <span className="text-purple-400 font-bold">INCOMING MIXTURE</span>.</p>
              
              <div className="flex items-center gap-8">
                 <ColorBeaker color={partnerMix} label="FROM HQ" />
                 <span className="text-2xl text-slate-500">+</span>
                 <ColorBeaker color={secretColor} label="YOUR SECRET" />
                 <span className="text-2xl text-slate-500">=</span>
                 <div className="relative">
                    <div className="w-24 h-32 bg-slate-800 rounded-b-xl border-2 border-slate-600 flex items-end justify-center overflow-hidden">
                       <Lock className="mb-8 w-6 h-6 text-slate-600" />
                    </div>
                    <span className="block text-center mt-2 font-mono text-xs text-slate-500">FINAL KEY</span>
                 </div>
              </div>

              <button 
                onClick={handleFinalMix}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold shadow-lg shadow-emerald-900/20"
              >
                COMPUTE FINAL KEY
              </button>
           </motion.div>
        )}

        {step === 'SUCCESS' && sharedSecret && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900/80 border border-emerald-500/50 p-8 rounded-xl text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)] border-4 border-emerald-500"
                 style={{ backgroundColor: generateColorString(sharedSecret) }}
            ></div>
            
            <h2 className="text-2xl font-bold text-white">SHARED SECRET ESTABLISHED</h2>
            <div className="bg-emerald-900/20 p-4 rounded border border-emerald-500/20 max-w-md mx-auto">
               <p className="text-emerald-300 font-mono">
                  Your Calculation: ({PUBLIC_COLOR.name} + {partnerSecret.name}) + {secretColor.name}
               </p>
               <br/>
               <p className="text-emerald-300 font-mono">
                  HQ Calculation: ({PUBLIC_COLOR.name} + {secretColor.name}) + {partnerSecret.name}
               </p>
            </div>
            <p className="text-slate-400">The resulting color is identical, but neither private color was ever transmitted!</p>
            
            <button 
              onClick={() => window.location.reload()} // Quick reset for demo
              className="mt-4 text-sm text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCcw className="w-4 h-4" /> Reset Simulation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for beaker visual
const ColorBeaker = ({ color, label }) => {
   const colorStr = color ? `rgb(${color.r}, ${color.g}, ${color.b})` : 'transparent';
   return (
      <div className="relative group">
         <div className="w-20 h-28 bg-slate-800 rounded-b-xl border-2 border-slate-600 flex items-end justify-center overflow-hidden">
            <div 
               className="w-full transition-all duration-1000 ease-out"
               style={{ height: color ? '80%' : '0%', backgroundColor: colorStr }}
            ></div>
         </div>
         <span className="block text-center mt-2 font-mono text-[10px] uppercase text-slate-400">{label}</span>
      </div>
   );
};

export default DiffieHellman;

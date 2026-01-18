import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, RefreshCcw, FlaskConical, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

// Simple RGB model
const PUBLIC_COLOR = { r: 255, g: 255, b: 0, name: 'Yellow (Public)' };

const DiffieHellman = () => {
  const [step, setStep] = useState('BRIEFING');
  const [secretColor, setSecretColor] = useState(null);
  const [partnerSecret] = useState({ r: 0, g: 0, b: 200, name: 'Blue (Partner)' });
  const [partnerMix, setPartnerMix] = useState(null);
  const [userMix, setUserMix] = useState(null);
  const [sharedSecret, setSharedSecret] = useState(null);

  // Computed values
  const mixColors = (c1, c2) => ({
    r: Math.min(255, c1.r + c2.r),
    g: Math.min(255, c1.g + c2.g),
    b: Math.min(255, c1.b + c2.b)
  });

  const generateColorString = (c) => `rgb(${c.r}, ${c.g}, ${c.b})`;

  useEffect(() => {
    setPartnerMix(mixColors(PUBLIC_COLOR, partnerSecret));
  }, [partnerSecret]);

  useEffect(() => {
    if (step === 'SUCCESS') {
      window.dispatchEvent(new CustomEvent('cyber-tutor-event', {
        detail: { type: 'submission', success: true }
      }));
    }
  }, [step]);

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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FlaskConical className="text-purple-400 w-8 h-8" />
          <span className="tracking-tight">MISSION 2: <span className="text-purple-400">The Handshake</span></span>
        </h1>

        {step === 'SUCCESS' && (
          <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 rounded-full font-mono text-xs animate-pulse">
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
            className="bg-slate-900/80 backdrop-blur-md p-8 rounded-xl border border-slate-700/50 space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

            <h2 className="text-xl text-purple-200 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              PROTOCOL INITIATION
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-2xl">
              Agent, you must establish a shared secret key with HQ over an open channel.
              The enemy is watching. Usage of the <span className="text-purple-400 font-bold">Diffie-Hellman</span> algorithm is authorized.
            </p>

            <p className="text-slate-400 text-sm border-l-2 border-purple-500/50 pl-4 py-1 italic bg-purple-900/10 rounded-r">
              "We will mix our private colors with a public color. Then exchange mixtures. Finally, we add our private colors again."
            </p>

            <button
              onClick={() => setStep('CHOOSE_SECRET')}
              className="group px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-all shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] flex items-center gap-2"
            >
              ENTER LAB <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 'CHOOSE_SECRET' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl text-white font-bold">Select Private Compound</h3>
              <p className="text-slate-400">This secret element must never leave your secure facility.</p>
            </div>

            <div className="flex justify-center gap-8">
              {availableSecrets.map((color, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChooseSecret(color)}
                  className="group flex flex-col items-center gap-4 relative"
                >
                  <div
                    className="w-32 h-32 rounded-full border-4 border-slate-700 group-hover:border-white transition-colors shadow-2xl relative overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${generateColorString(color)}, ${generateColorString({ r: color.r / 2, g: color.g / 2, b: color.b / 2 })})`
                    }}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <span className="font-mono text-slate-300 group-hover:text-purple-300 font-bold tracking-wider">{color.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'MIX_PUBLIC' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-2xl border border-slate-700 flex flex-col items-center gap-10"
          >
            <h3 className="text-xl text-white font-bold flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-400" />
              PREPARING TRANSPORT MIXTURE
            </h3>

            <div className="flex items-center gap-2 md:gap-12 relative">
              <ColorOrb color={secretColor} label="PRIVATE" delay={0} />

              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ x: [0, 10, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-slate-600"
                >
                  <ArrowRight className="w-8 h-8" />
                </motion.div>
              </div>

              <ColorOrb color={PUBLIC_COLOR} label="PUBLIC BASE" delay={0.2} />

              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="w-8 h-8 text-slate-600" />
              </div>

              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-24 h-24 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center bg-slate-800"
                >
                  <span className="text-2xl text-slate-500 font-bold">?</span>
                </motion.div>
                <span className="block text-center mt-3 font-mono text-[10px] text-slate-500 uppercase tracking-widest">RESULT</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMixPublic}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/30 border border-purple-500/20"
            >
              INITIATE MIXING PROCESS
            </motion.button>
          </motion.div>
        )}

        {step === 'EXCHANGE' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-xl text-white font-bold mb-2">Secure Exchange Protocol</h3>
              <p className="text-slate-400 max-w-lg mx-auto text-sm">
                Transmitting mixed compound to HQ. Receiving HQ's compound.
                <span className="block mt-2 text-amber-400 bg-amber-900/20 py-1 px-3 rounded-full text-xs inline-block border border-amber-500/20">
                  OPEN CHANNEL - VISIBLE TO INTERCEPTORS
                </span>
              </p>
            </div>

            <div className="flex justify-between items-center max-w-3xl mx-auto p-12 bg-slate-950/50 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

              {/* Arrows Animation */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 flex flex-col gap-4">
                <motion.div
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full"
                />
                <motion.div
                  animate={{ x: [0, -100, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full"
                />
              </div>

              <div className="text-center space-y-4 relative z-10 p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                <p className="text-xs font-mono text-cyan-400 mb-2">OUTGOING PAYLOAD</p>
                <ColorOrb color={userMix} size="sm" />
              </div>

              <div className="text-center space-y-4 relative z-10 p-4 bg-slate-900/80 rounded-xl border border-slate-700">
                <p className="text-xs font-mono text-purple-400 mb-2">INCOMING PAYLOAD</p>
                <ColorOrb color={partnerMix} size="sm" />
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExchange}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow-[0_0_15px_rgba(8,145,178,0.4)]"
              >
                CONFIRM PACKET EXCHANGE
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'FINAL_MIX' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-2xl border border-slate-700 flex flex-col items-center gap-10"
          >
            <h3 className="text-xl text-white font-bold">Step 4: Decode Shared Secret</h3>
            <p className="text-slate-400 text-center max-w-md">
              Combine your <span className="text-white font-bold">PRIVATE SECRET</span> with the <span className="text-purple-400 font-bold">RECEIVED MIXTURE</span> to unlock the final key.
            </p>

            <div className="flex items-center gap-4 md:gap-8 bg-slate-950 p-8 rounded-xl border-dashed border-2 border-slate-700">
              <ColorOrb color={partnerMix} label="FROM HQ" />
              <span className="text-2xl text-slate-500">+</span>
              <ColorOrb color={secretColor} label="YOUR SECRET" />
              <span className="text-2xl text-slate-500">=</span>
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-inner">
                  <Lock className="w-6 h-6 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="block text-center mt-3 font-mono text-[10px] text-slate-500">FINAL KEY</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinalMix}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/30"
            >
              COMPUTE FINAL KEY
            </motion.button>
          </motion.div>
        )}

        {step === 'SUCCESS' && sharedSecret && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900/80 border border-emerald-500/50 p-12 rounded-2xl text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/5"></div>

            <motion.div
              initial={{ rotate: -180, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring" }}
              className="w-32 h-32 rounded-full mx-auto shadow-[0_0_50px_rgba(16,185,129,0.4)] border-4 border-emerald-400 relative z-10"
              style={{ backgroundColor: generateColorString(sharedSecret) }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-10 h-10 text-white/50" />
              </div>
            </motion.div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-bold text-white">KEY ESTABLISHED</h2>
              <div className="bg-emerald-950/50 p-6 rounded-lg border border-emerald-500/20 max-w-xl mx-auto backdrop-blur-sm">
                <p className="text-emerald-300 font-mono text-sm leading-relaxed">
                  Math Verified: (Public + Partner) + You = (Public + You) + Partner
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  The resulting color is identical, but neither private color was ever transmitted over the open channel.
                </p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="relative z-10 px-6 py-2 text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors border border-transparent hover:border-slate-700 rounded-lg"
            >
              <RefreshCcw className="w-4 h-4" /> Reset Simulation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for orb visual
const ColorOrb = ({ color, label, size = 'md', delay = 0 }) => {
  const colorStr = color ? `rgb(${color.r}, ${color.g}, ${color.b})` : 'transparent';
  const sizeClasses = size === 'md' ? 'w-24 h-24' : 'w-16 h-16';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
      className="relative group"
    >
      <div
        className={cn("rounded-full border-4 border-slate-700 shadow-xl transition-all duration-500 relative overflow-hidden", sizeClasses)}
        style={{ backgroundColor: colorStr }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20"></div>
      </div>
      <span className="block text-center mt-3 font-mono text-[10px] uppercase text-slate-400 tracking-wider font-bold group-hover:text-white transition-colors">{label}</span>
    </motion.div>
  );
};

export default DiffieHellman;

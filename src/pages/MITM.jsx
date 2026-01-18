import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Server, ShieldAlert, Lock, Eye, AlertTriangle, ToggleLeft, ToggleRight, Radio, Skull, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

const MITM = () => {
  const [hackerMode, setHackerMode] = useState(false);
  const [stage, setStage] = useState('IDLE'); // IDLE, SENDING, INTERCEPTING, COMPROMISED, SECURE

  const toggleHackerMode = () => {
    if (stage === 'IDLE') {
      setHackerMode(!hackerMode);
    }
  };

  const startSimulation = () => {
    setStage('SENDING');
  };

  // Robust state transition effect
  useEffect(() => {
    let timer;
    if (stage === 'SENDING') {
      timer = setTimeout(() => {
        if (hackerMode) {
          setStage('INTERCEPTING');
        } else {
          setStage('SECURE');
        }
      }, 1500);
    } else if (stage === 'INTERCEPTING') {
      timer = setTimeout(() => {
        setStage('COMPROMISED');
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [stage, hackerMode]);

  const reset = () => {
    setStage('IDLE');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-red-500 w-8 h-8" />
          <span className="tracking-tight">MISSION 3: <span className="text-red-500">The Interception</span></span>
        </h1>

        <div className="flex items-center gap-4 bg-slate-900/80 p-2 rounded-lg border border-slate-700">
          <span className="text-xs font-mono text-slate-400 pl-2">HACKER MODE</span>
          <button onClick={toggleHackerMode} disabled={stage !== 'IDLE'} className="transition-transform active:scale-95 disabled:opacity-50">
            {hackerMode
              ? <ToggleRight className="w-8 h-8 text-red-500" />
              : <ToggleLeft className="w-8 h-8 text-slate-600" />
            }
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl space-y-6">
            <div>
              <h3 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400" /> SIMULATION CONTROL
              </h3>
              <p className="text-xs text-slate-500">Configure the network environment and initiate key exchange.</p>
            </div>

            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg border transition-all duration-300",
                hackerMode ? "bg-red-950/20 border-red-500/30" : "bg-emerald-950/20 border-emerald-500/30"
              )}>
                <div className="flex items-center gap-3 mb-2">
                  {hackerMode ? <Skull className="w-5 h-5 text-red-500" /> : <ShieldAlert className="w-5 h-5 text-emerald-500" />}
                  <span className={cn("font-bold text-sm", hackerMode ? "text-red-400" : "text-emerald-400")}>
                    {hackerMode ? "ACTIVE THREAT DETECTED" : "NETWORK SECURE"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-wide">
                  {hackerMode
                    ? "Man-in-the-Middle agent positioned on the backbone. Interception Protocol ready."
                    : "Standard encrypted channel. Direct line between Alice and Bob verified."}
                </p>
              </div>

              <button
                onClick={startSimulation}
                disabled={stage !== 'IDLE'}
                className={cn(
                  "w-full py-4 rounded-lg font-bold text-sm shadow-lg transition-all border",
                  hackerMode
                    ? "bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-red-900/20"
                    : "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 shadow-cyan-900/20",
                  stage !== 'IDLE' && "opacity-50 cursor-not-allowed grayscale"
                )}
              >
                {stage === 'IDLE' ? (hackerMode ? 'INITIATE ATTACK' : 'START EXCHANGE') : 'PROCESSING...'}
              </button>

              {stage !== 'IDLE' && (
                <button onClick={reset} className="w-full py-2 text-xs text-slate-500 hover:text-white">
                  RESET SIMULATION
                </button>
              )}
            </div>
          </div>

          {/* CyberTutor Context */}
          <AnimatePresence>
            {stage === 'COMPROMISED' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg"
              >
                <h4 className="text-amber-400 font-bold text-xs flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3 h-3" /> SECURITY ALERT
                </h4>
                <p className="text-xs text-amber-200/80">
                  Key Exchange Compromised! Alice believed she was sending her key to Bob, but she sent it to Eve.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Visualization */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-8 relative overflow-hidden flex flex-col min-h-[500px]">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="flex-1 flex items-center justify-between px-12 relative z-10">
            {/* ALICE */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-cyan-900/20 border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <User className="w-10 h-10 text-cyan-400" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-max">
                <span className="text-sm font-bold text-cyan-100 font-mono block">ALICE</span>
                <span className="text-[10px] text-slate-500 font-mono">SENDER</span>
              </div>

              {/* Key Status */}
              {(stage === 'SECURE' || stage === 'COMPROMISED') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-slate-900 p-1.5 rounded-full border border-slate-700"
                >
                  <Lock className={cn("w-4 h-4", stage === 'SECURE' ? "text-emerald-500" : "text-red-500")} />
                </motion.div>
              )}
            </div>

            {/* EVE / MITM */}
            <div className="relative w-32 flex flex-col items-center justify-center h-full">
              <AnimatePresence>
                {hackerMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={cn(
                      "w-20 h-20 rounded-xl bg-red-950/50 border-2 border-red-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)] backdrop-blur-sm transition-all duration-300",
                      (stage === 'INTERCEPTING' || stage === 'COMPROMISED') && "border-red-500 bg-red-900/30 scale-110 shadow-[0_0_60px_rgba(239,68,68,0.4)]"
                    )}>
                      <Eye className={cn(
                        "w-10 h-10 text-red-500",
                        stage === 'INTERCEPTING' && "animate-pulse"
                      )} />
                    </div>
                    <span className="text-xs font-bold text-red-500 font-mono tracking-widest bg-red-950/80 px-2 py-1 rounded">INTERCEPTOR</span>
                  </motion.div>
                )}

                {!hackerMode && (
                  <div className="h-1 bg-slate-800 w-full rounded-full relative overflow-hidden">
                    {stage !== 'IDLE' && (
                      <motion.div
                        className="absolute inset-0 bg-cyan-500/50 blur-sm"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* BOB */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-purple-900/20 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Server className="w-10 h-10 text-purple-400" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-max">
                <span className="text-sm font-bold text-purple-100 font-mono block">BOB</span>
                <span className="text-[10px] text-slate-500 font-mono">RECEIVER</span>
              </div>

              {(stage === 'SECURE' || stage === 'COMPROMISED') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -left-2 bg-slate-900 p-1.5 rounded-full border border-slate-700"
                >
                  <Lock className={cn("w-4 h-4", stage === 'SECURE' ? "text-emerald-500" : "text-red-500")} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Packet Animation Layer */}
          {stage !== 'IDLE' && stage !== 'SECURE' && stage !== 'COMPROMISED' && (
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none z-20">
              {/* Alice to Bob/Eve */}
              <motion.div
                initial={{ left: '15%', opacity: 1 }}
                animate={{
                  left: hackerMode ? '50%' : '85%',
                  opacity: hackerMode ? 0 : 1
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]"
              />

              {/* Bob to Alice/Eve */}
              <motion.div
                initial={{ right: '15%', opacity: 1 }}
                animate={{
                  right: hackerMode ? '50%' : '85%',
                  opacity: hackerMode ? 0 : 1
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_15px_purple]"
              />
            </div>
          )}

          {/* Status Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/80 border-t border-slate-800 text-center">
            <p className="text-sm font-mono text-slate-400">
              NETWORK_STATUS: <span className="text-white">
                {stage === 'IDLE' && "STANDBY"}
                {stage === 'SENDING' && "EXCHANGING KEYS..."}
                {stage === 'INTERCEPTING' && "PACKETS DIVERTED..."}
                {stage === 'SECURE' && <span className="text-emerald-400">ENCRYPTED TUNNEL ESTABLISHED</span>}
                {stage === 'COMPROMISED' && <span className="text-red-500">CHANNEL COMPROMISED</span>}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Terminal Icon helper
const Terminal = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

export default MITM;

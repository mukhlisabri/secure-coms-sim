import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Server, ShieldAlert, Wifi, Lock, Eye, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

const MITM = () => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [stage, setStage] = useState('IDLE'); // IDLE, SENDING_KEYS, INTERCEPTED, ESTABLISHED

  const startSimulation = (attack) => {
    setIsAttacking(attack);
    setStage('SENDING_KEYS');
    
    // Sequence the animation
    setTimeout(() => {
      setStage(attack ? 'INTERCEPTED' : 'ESTABLISHED');
    }, 2000);
  };

  const reset = () => {
    setStage('IDLE');
    setIsAttacking(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-red-500" />
          Mission 3: The Interception
        </h1>
        <div className="flex items-center gap-2">
           <span className="text-sm font-mono text-slate-400">THREAT LEVEL:</span>
           <span className={cn("font-bold font-mono", isAttacking ? "text-red-500 animate-pulse" : "text-emerald-500")}>
             {isAttacking ? "CRITICAL (MITM ACTIVE)" : "NORMAL"}
           </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> SIMULATION CONTROLS
            </h3>
            <p className="text-sm text-slate-400">
              Observe how a Man-in-the-Middle attack compromises the key exchange.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => startSimulation(false)}
                disabled={stage !== 'IDLE'}
                className="w-full py-3 bg-emerald-900/30 hover:bg-emerald-800/30 border border-emerald-500/30 text-emerald-400 rounded transition-colors disabled:opacity-50"
              >
                RUN SECURE EXCHANGE
              </button>
              <button 
                onClick={() => startSimulation(true)}
                disabled={stage !== 'IDLE'}
                className="w-full py-3 bg-red-900/30 hover:bg-red-800/30 border border-red-500/30 text-red-400 rounded transition-colors disabled:opacity-50"
              >
                SIMULATE ATTACK
              </button>
              <button 
                 onClick={reset}
                 disabled={stage === 'IDLE'}
                 className="w-full py-2 text-slate-500 hover:text-white text-sm"
              >
                RESET NETWORK
              </button>
            </div>
          </div>

          <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/20">
             <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" /> CYBER-TUTOR ANALYSIS
             </h4>
             <p className="text-xs text-amber-200/80 leading-relaxed">
               {isAttacking && stage !== 'IDLE' 
                 ? "WARNING: The adversary is intercepting the public keys. Alice thinks she is talking to Bob, but she is exchanging keys with Eve. Bob is doing the same. Eve can now decrypt ALL messages."
                 : "In a secure exchange, Alice and Bob exchange public keys directly. Mathematically (Diffie-Hellman), they derive the same shared secret that no one else can calculate."
               }
             </p>
          </div>
        </div>

        {/* Network Viz */}
        <div className="md:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
           {/* Nodes */}
           <div className="flex justify-between items-center relative z-10">
              {/* Alice */}
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center border-2 border-cyan-500">
                    <User className="w-8 h-8 text-cyan-400" />
                 </div>
                 <span className="font-mono text-cyan-400 text-sm font-bold">ALICE</span>
                 {stage === 'ESTABLISHED' && !isAttacking && <Lock className="w-4 h-4 text-emerald-400" />}
                 {stage === 'INTERCEPTED' && isAttacking && <Lock className="w-4 h-4 text-red-400" />}
              </div>

              {/* Eve (The Middle Man) */}
              <div className={cn(
                "flex flex-col items-center gap-2 transition-opacity duration-500",
                isAttacking ? "opacity-100" : "opacity-20 grayscale"
              )}>
                 <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center border-2 border-red-500">
                    <Eye className="w-8 h-8 text-red-500" />
                 </div>
                 <span className="font-mono text-red-500 text-sm font-bold">EVE (MITM)</span>
              </div>

              {/* Bob */}
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center border-2 border-purple-500">
                    <Server className="w-8 h-8 text-purple-400" />
                 </div>
                 <span className="font-mono text-purple-400 text-sm font-bold">BOB</span>
                 {stage === 'ESTABLISHED' && !isAttacking && <Lock className="w-4 h-4 text-emerald-400" />}
                 {stage === 'INTERCEPTED' && isAttacking && <Lock className="w-4 h-4 text-red-400" />}
              </div>
           </div>

           {/* Connections / Packets */}
           <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-20">
              {/* Main Line */}
              <div className="h-1 bg-slate-800 w-full rounded relative">
                 
                 {/* Attack Break */}
                 {isAttacking && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-950 border-2 border-red-500 rounded-full z-20 flex items-center justify-center">
                       <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                 )}

                 {/* Packet Animation: Alice -> Bob (or Eve) */}
                 {stage === 'SENDING_KEYS' && (
                   <motion.div
                     initial={{ left: '0%' }}
                     animate={{ left: isAttacking ? '50%' : '100%' }}
                     transition={{ duration: 2, ease: "linear" }}
                     className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan] z-10"
                   />
                 )}

                 {/* Packet Animation: Bob -> Alice (or Eve) */}
                 {stage === 'SENDING_KEYS' && (
                   <motion.div
                     initial={{ right: '0%' }}
                     animate={{ right: isAttacking ? '50%' : '100%' }}
                     transition={{ duration: 2, ease: "linear" }}
                     className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_purple] z-10"
                   />
                 )}
              </div>
           </div>

           {/* Results Pane */}
           <div className="mt-8 bg-slate-900/50 p-4 rounded border border-slate-800 text-center min-h-[100px] flex items-center justify-center">
             {stage === 'IDLE' && <span className="text-slate-500 italic">Ready to simulate network traffic...</span>}
             {stage === 'SENDING_KEYS' && <span className="text-cyan-400 animate-pulse">Exchanging Public Keys...</span>}
             {stage === 'ESTABLISHED' && (
               <div className="space-y-1">
                 <p className="text-emerald-400 font-bold">SECURE CONNECTION ESTABLISHED</p>
                 <p className="text-xs text-slate-400">Alice and Bob share the same secret key. Eve knows nothing.</p>
               </div>
             )}
              {stage === 'INTERCEPTED' && (
               <div className="space-y-1">
                 <p className="text-red-500 font-bold">CONNECTION COMPROMISED</p>
                 <p className="text-xs text-slate-400">Alice connected to Eve. Bob connected to Eve. Eve decrypts everything.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MITM;

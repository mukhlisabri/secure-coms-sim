import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Radio, Key, Terminal, ArrowRight, Cpu, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const Typewriter = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="font-mono border-r-2 border-cyan-500 pr-1 animate-pulse">
      {displayedText}
    </span>
  );
};

const MissionCard = ({ to, title, description, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link
      to={to}
      className="block h-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)] group relative overflow-hidden"
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", color)}></div>

      <div className="relative z-10">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300", color.replace('bg-', 'bg-opacity-20 ' + color.replace('bg-', 'text-')))}>
          <Icon className={cn("w-6 h-6", color.replace('bg-', 'text-').replace('/10', ''))} />
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2 font-mono group-hover:text-cyan-300 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center text-xs font-mono text-cyan-500/70 group-hover:text-cyan-400">
          INITIALIZE_MISSION <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SYSTEM_INITIALIZED
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            <span className="text-slate-500 block text-2xl mb-2 font-mono font-normal">Welcome to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
              CipherAgent Academy
            </span>
          </h1>

          <div className="text-lg text-slate-400 max-w-2xl h-20">
            <Typewriter text="Initializing training modules... Decrypt intercept... Secure the network..." speed={40} />
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 transform rotate-12">
          <Cpu className="w-96 h-96 text-cyan-900" />
        </div>
      </section>

      {/* Mission Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MissionCard
          to="/mission/rail-fence"
          title="The Scramble"
          description="Intercepted communications are scrambled using transposition ciphers. Reconstruct the message."
          icon={Radio}
          color="bg-amber-500/10"
          delay={0.2}
        />
        <MissionCard
          to="/mission/diffie-hellman"
          title="The Handshake"
          description="Two parties need to share a secret key over an insecure channel. Simulate the exchange."
          icon={Key}
          color="bg-purple-500/10"
          delay={0.3}
        />
        <MissionCard
          to="/mission/mitm"
          title="The Interception"
          description="An adversary is listening. Simulate a Man-in-the-Middle attack on the key exchange."
          icon={Shield}
          color="bg-red-500/10"
          delay={0.4}
        />
      </section>

      {/* Stats / Info */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800"
      >
        {[
          { label: 'Modules Active', value: '3', icon: Activity },
          { label: 'Security Level', value: 'ALPHA', icon: Lock },
          { label: 'Encryption', value: 'AES-256', icon: Shield },
          { label: 'Latency', value: '12ms', icon: Terminal },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/20 p-4 rounded border border-slate-800 flex items-center gap-4">
            <div className="p-2 bg-slate-800 rounded text-slate-400">
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold">{stat.label}</div>
              <div className="text-lg font-mono text-cyan-400">{stat.value}</div>
            </div>
          </div>
        ))}
      </motion.section>
    </div>
  );
};

export default Home;

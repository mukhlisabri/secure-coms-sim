import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Terminal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-cyan-900/30 rounded-lg">
            <Terminal className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">MISSION CONTROL</h1>
            <p className="text-slate-400">Secure Communications Simulator v1.0</p>
          </div>
        </div>
        
        <p className="text-slate-300 max-w-2xl leading-relaxed mb-6">
          Welcome, Signal Officer. Your mission is to master the art of cryptography to ensure secure communications 
          for HQ. You will encounter three distinct challenges that test your understanding of encryption, 
          key exchange, and network security.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <StatusCard label="ENCRYPTION UPLINK" status="STANDBY" color="text-amber-400" />
          <StatusCard label="KEY EXCHANGE PROTOCOL" status="OFFLINE" color="text-red-400" />
          <StatusCard label="INTRUSION DETECTION" status="ACTIVE" color="text-emerald-400" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MissionCard 
          to="/mission/rail-fence"
          title="MISSION 1: THE SCRAMBLE"
          desc="Decode the intercepted message using the Rail Fence transposition cipher."
          difficulty="EASY"
        />
        <MissionCard 
          to="/mission/diffie-hellman"
          title="MISSION 2: THE HANDSHAKE"
          desc="Establish a shared secret color without revealing your private components."
          difficulty="MEDIUM"
        />
        <MissionCard 
          to="/mission/mitm"
          title="MISSION 3: THE INTERCEPTION"
          desc="Identify and simulate a Man-in-the-Middle attack on the network."
          difficulty="HARD"
        />
      </div>
    </div>
  );
};

const StatusCard = ({ label, status, color }) => (
  <div className="bg-slate-900/80 p-4 rounded border border-slate-800 flex flex-col">
    <span className="text-xs text-slate-500 font-mono mb-1">{label}</span>
    <span className={`font-mono font-bold ${color}`}>{status}</span>
  </div>
);

const MissionCard = ({ to, title, desc, difficulty }) => (
  <Link to={to} className="group block bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition-all hover:bg-slate-800/80">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <span className="text-xs font-mono px-2 py-1 bg-slate-900 rounded text-slate-400 border border-slate-800">{difficulty}</span>
    </div>
    <p className="text-sm text-slate-400 mb-6">{desc}</p>
    <div className="flex items-center text-cyan-500 text-sm font-bold group-hover:translate-x-1 transition-transform">
      INITIALIZE <ArrowRight className="w-4 h-4 ml-2" />
    </div>
  </Link>
);

export default Home;

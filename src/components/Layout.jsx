import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Radio, Key, Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import CyberTutor from './CyberTutor';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group relative overflow-hidden",
      active
        ? "text-cyan-400 bg-cyan-950/30 border-r-2 border-cyan-400"
        : "text-slate-400 hover:text-cyan-200 hover:bg-slate-800/50"
    )}
  >
    {active && (
      <motion.div
        layoutId="active-nav"
        className="absolute inset-0 bg-cyan-400/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    )}
    <Icon className={cn("w-5 h-5 relative z-10", active ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300")} />
    <span className="font-mono text-sm tracking-wide relative z-10">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'MISSION CONTROL', icon: list => <Terminal {...list} /> },
    { path: '/mission/rail-fence', label: 'THE SCRAMBLE', icon: props => <Radio {...props} /> },
    { path: '/mission/diffie-hellman', label: 'THE HANDSHAKE', icon: props => <Key {...props} /> },
    { path: '/mission/mitm', label: 'THE INTERCEPTION', icon: props => <Shield {...props} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col border-r border-cyan-900/20 bg-slate-950/80 backdrop-blur-xl h-screen fixed left-0 top-0 z-30">
        <div className="p-8 border-b border-cyan-900/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-950 rounded-lg border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-cyan-100 font-bold tracking-widest text-sm">SECURE COMMS</h1>
            <p className="text-[10px] text-emerald-500/80 font-mono tracking-wider">SYSTEM SECURE</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-cyan-900/20">
          <div className="bg-slate-900/50 rounded-lg p-4 text-xs text-slate-500 font-mono border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span>STATUS</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>UPLINK</span>
              <span className="text-cyan-400">ENCRYPTED</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 relative min-h-screen flex flex-col transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/80 backdrop-blur w-full sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-200">SECURE COMMS</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 z-40 shadow-2xl overflow-hidden"
            >
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-cyan-900/40 text-cyan-400"
                        : "text-slate-400 hover:text-cyan-200"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-mono text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full relative z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full relative"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Tutor needs to be outside the page transition wrapper to persist, or inside to animate with page? 
            User asked for "floating chat button (bottom-right)". If we put it here, it persists across page transitions which is better.
        */}
        <CyberTutor />
      </main>
    </div>
  );
};

export default Layout;

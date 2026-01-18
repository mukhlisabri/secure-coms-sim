import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Radio, Key, Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group",
      active 
        ? "bg-cyan-900/40 text-cyan-400 border-l-2 border-cyan-400" 
        : "text-slate-400 hover:text-cyan-200 hover:bg-slate-800"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300")} />
    <span className="font-mono text-sm tracking-wide">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'DASHBOARD', icon: list => <Terminal {...list} /> },
    { path: '/mission/rail-fence', label: 'THE SCRAMBLE', icon: props => <Radio {...props} /> },
    { path: '/mission/diffie-hellman', label: 'THE HANDSHAKE', icon: props => <Key {...props} /> },
    { path: '/mission/mitm', label: 'THE INTERCEPTION', icon: props => <Shield {...props} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans selection:bg-cyan-500/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl h-screen fixed left-0 top-0 z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-cyan-100 font-bold tracking-wider text-sm">SECURE COMMS</h1>
            <p className="text-xs text-slate-500 font-mono">SIMULATOR v1.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded p-3 text-xs text-slate-500 font-mono border border-slate-800">
            <p>STATUS: <span className="text-emerald-400">ONLINE</span></p>
            <p>UPLINK: <span className="text-emerald-400">SECURE</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur w-full sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-slate-200">SECURE COMMS</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 z-10 shadow-2xl"
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
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;

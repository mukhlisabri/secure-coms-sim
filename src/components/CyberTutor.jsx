import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageSquare, Send, Loader, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';

const CyberTutor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const location = useLocation();
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Contextual Greeting on Route Change
    useEffect(() => {
        const greeting = getContextualGreeting(location.pathname);
        setMessages(prev => {
            // Prevent duplicate greetings (React Strict Mode or fast re-renders)
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.content === greeting) return prev;

            return [
                ...prev,
                { role: 'system', content: greeting, id: Date.now() }
            ];
        });
        if (!isOpen) {
            // Optional: Auto-open or just show notification badge
        }
    }, [location.pathname]);

    // Listen for game events (like 3 wrong attempts)
    useEffect(() => {
        const handleGameEvent = (e) => {
            const { type, success } = e.detail;
            if (type === 'submission' && !success) {
                setMessages(prev => [...prev, { role: 'system', content: "Agent, I detect multiple failed decryption attempts. Do you require a hint about the Rail Fence pattern?", id: Date.now() }]);
                setIsOpen(true);
            }
        };
        window.addEventListener('cyber-tutor-event', handleGameEvent);
        return () => window.removeEventListener('cyber-tutor-event', handleGameEvent);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                // Fallback if no key provided
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'system', content: "SYSTEM ERROR: ENCRYPTED UPLINK NOT FOUND. (Missing VITE_GEMINI_API_KEY in .env)", id: Date.now() + 1 }]);
                    setIsTyping(false);
                }, 1000);
                return;
            }

            // Call Gemini API
            // Using gemini-2.0-flash as it is the available model for this key
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: `System: You are a Secret Agent Handler named 'CyberTutor'. Your goal is to teach Cryptography. Do NOT give the direct answer. If the user asks for the answer, give them a cryptic hint based on the current mission ${location.pathname}. Keep responses short, 'spy-themed', and educational.` },
                                { text: `User context: Current Mission: ${location.pathname}` },
                                { text: input }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0].content) {
                const reply = data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { role: 'system', content: reply, id: Date.now() + 1 }]);
            } else {
                throw new Error("Invalid response from HQ");
            }

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'system', content: "CONNECTION INTERRUPTED. HQ is offline. Please check your network.", id: Date.now() + 1 }]);
        } finally {
            setIsTyping(false);
        }
    };

    const currentMissionName = location.pathname.split('/').pop() || 'Home Base';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[350px] md:w-[400px] h-[500px] bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-slate-950/80 p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500 flex items-center justify-center relative">
                                    <Bot className="w-5 h-5 text-cyan-400" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">CyberTutor AI</h3>
                                    <p className="text-[10px] text-cyan-400 font-mono tracking-wider">SECURE LINK ESTABLISHED</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-3 text-sm max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    {msg.role === 'system' && (
                                        <div className="w-6 h-6 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                                            <Bot className="w-3 h-3 text-cyan-400" />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "p-3 rounded-xl leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-cyan-600 text-white rounded-br-none"
                                            : "bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3 max-w-[90%]">
                                    <div className="w-6 h-6 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-3 h-3 text-cyan-400" />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700/50 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-slate-950/50 border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2 relative"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`Ask for intel on ${currentMissionName}...`}
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 pr-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md disabled:opacity-50 disabled:bg-slate-700 transition-colors"
                                >
                                    {isTyping ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-600 text-center mt-2 flex items-center justify-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> AI System - Educational Simulation Only
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)] pointer-events-auto relative group active:scale-95 transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && messages.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900">
                        1
                    </span>
                )}
            </motion.button>
        </div>
    );
};

// Helper for initial messages
function getContextualGreeting(path) {
    if (path.includes('rail-fence')) return "Agent, the Rail Fence cipher is all about positioning. Visualizing the zig-zag pattern is key to unscrambling the payload.";
    if (path.includes('diffie-hellman')) return "Welcome to the Lab. Remember: The goal is to create a shared secret color without ever revealing your private starting color.";
    if (path.includes('mitm')) return "Be alert. In a Man-in-the-Middle attack, the adversary sits perfectly between you and the destination. Identities must be verified.";
    return "Greetings, Agent. I am your CyberTutor handler. Select a mission to begin, or ask me anything about cryptography basics.";
}

export default CyberTutor;

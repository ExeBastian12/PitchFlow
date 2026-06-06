import React, { useState } from 'react';
import { Send, X, Users, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SquadChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SquadChatPanel({ isOpen, onClose }: SquadChatPanelProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Coach (You)', role: 'coach', text: 'Training moved to pitch B today.', time: '10:05 AM', isSelf: true },
        { id: 2, sender: 'Alex (U15)', role: 'player', text: 'Go it coach, see you there.', time: '10:12 AM', isSelf: false },
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            sender: 'Coach (You)',
            role: 'coach',
            text: message,
            time: new Date().toLocaleTimeString([], {timeStyle: 'short'}),
            isSelf: true
        }]);
        setMessage('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-[100] cursor-pointer lg:hidden"
                    />
                    <motion.div 
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-[105] flex flex-col border-l border-gray-200 dark:border-gray-800"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-pitch-dark dark:text-white">Squad Board</h3>
                                    <p className="text-xs text-gray-500 font-medium">Broadcasts & Chat</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-750 text-gray-500 hover:text-pitch-dark dark:hover:text-white rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 px-1">
                                        {msg.sender}
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.isSelf ? 'bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark rounded-tr-sm' : 'bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-sm'}`}>
                                        {msg.text}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                            <input 
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pitch-dark dark:focus:ring-pitch-lime dark:text-white"
                            />
                            <button type="submit" disabled={!message.trim()} className="bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark p-2.5 rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

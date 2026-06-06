import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, Users, Hash, Settings, Bell, Search, Shield, Info, MoreVertical, X, Check, CheckCheck, Smile, BarChart2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'coach' | 'parent';
  text: string;
  timestamp: string;
  isRead?: boolean;
  type?: 'text' | 'poll';
  pollOptions?: PollOption[];
  reactions?: Record<string, number>;
}

interface SquadChannel {
  id: string;
  name: string;
  members: number;
}

const MOCK_CHANNELS: SquadChannel[] = [
  { id: 'u15-boys', name: 'Pangkalpinang FC U15 Boys', members: 18 },
  { id: 'u14-girls', name: 'Sungailiat FC U15 Girls', members: 16 },
  { id: 'general', name: 'General Announcements', members: 154 }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'u15-boys': [
    { id: '1', senderId: 'c1', senderName: 'Coach Sarah', senderRole: 'coach', text: 'Hi parents, training is moved to Field B today due to maintenance.', timestamp: '10:00 AM', isRead: true, type: 'text', reactions: { '👍': 4 } },
    { id: '2', senderId: 'p1', senderName: 'John Doe', senderRole: 'parent', text: 'Thanks for the heads up coach!', timestamp: '10:05 AM', isRead: true, type: 'text' },
    { id: '3', senderId: 'p2', senderName: 'Mike Smith', senderRole: 'parent', text: 'Will do. See you there.', timestamp: '10:12 AM', isRead: true, type: 'text' }
  ],
  'u14-girls': [
    { id: '1', senderId: 'c2', senderName: 'Coach Mark', senderRole: 'coach', text: 'Don\'t forget water bottles!', timestamp: '9:00 AM', isRead: true, type: 'text' }
  ],
  'general': []
};

// Simple hook to auto-scroll
function useAutoScroll(dependency: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dependency]);
  return scrollRef;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '👏', '⚽', '🏆', '👀'];

export default function ChatPlatform({ role }: { role: 'admin' | 'coach' | 'parent' }) {
  const [activeChannel, setActiveChannel] = useState<string>('u15-boys');
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // New State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPollMode, setIsPollMode] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Yes', 'No']);

  const activeMessages = messages[activeChannel] || [];
  const displayedMessages = activeMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
  const scrollRef = useAutoScroll(displayedMessages);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPollMode && !newMessage.trim()) return;
    if (isPollMode && (!pollQuestion.trim() || pollOptions.every(o => !o.trim()))) return;

    const baseMsg = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: role === 'coach' ? 'c' + Math.random() : 'p' + Math.random(),
      senderName: role === 'coach' ? 'Coach (You)' : 'Parent (You)',
      senderRole: role === 'coach' ? 'coach' : 'parent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    let msg: Message;
    
    if (isPollMode) {
      msg = {
        ...baseMsg,
        text: pollQuestion,
        type: 'poll',
        pollOptions: pollOptions.filter(o => o.trim()).map(o => ({ id: Math.random().toString(36).substr(2, 9), text: o, votes: [] }))
      } as Message;
      setPollQuestion('');
      setPollOptions(['Yes', 'No']);
      setIsPollMode(false);
    } else {
      msg = {
        ...baseMsg,
        text: newMessage,
        type: 'text'
      } as Message;
      setNewMessage('');
    }

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), msg]
    }));
    setShowEmojiPicker(false);
  };

  const handleVote = (messageId: string, optionId: string) => {
    setMessages(prev => {
        const chanMsgs = prev[activeChannel] || [];
        const newMsgs = chanMsgs.map(m => {
            if (m.id === messageId && m.pollOptions) {
                const currentUserId = role === 'coach' ? 'c_you' : 'p_you';
                // Remove existing vote by this user
                const newOpts = m.pollOptions.map(o => ({
                    ...o,
                    votes: o.votes.filter(v => v !== currentUserId)
                }));
                // Add vote to new option
                const optToUpdate = newOpts.find(o => o.id === optionId);
                if (optToUpdate) {
                    optToUpdate.votes.push(currentUserId);
                }
                return { ...m, pollOptions: newOpts };
            }
            return m;
        });
        return { ...prev, [activeChannel]: newMsgs };
    });
  };

  const addReaction = (messageId: string, emoji: string) => {
      setMessages(prev => {
        const chanMsgs = prev[activeChannel] || [];
        const newMsgs = chanMsgs.map(m => {
            if (m.id === messageId) {
                const currentReacts = { ...(m.reactions || {}) };
                currentReacts[emoji] = (currentReacts[emoji] || 0) + 1;
                return { ...m, reactions: currentReacts };
            }
            return m;
        });
        return { ...prev, [activeChannel]: newMsgs };
      });
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800">
        {/* Sidebar Channels */}
        <div className={`flex flex-col border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h2 className="font-bold text-gray-800 dark:text-gray-200">Squads</h2>
                {(role === 'admin' || role === 'coach') && (
                    <button className="text-gray-400 hover:text-pitch-lime" title="Manage Squads">
                        <Settings size={18} />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-2">My Channels</div>
                    {MOCK_CHANNELS.map(ch => (
                        <button
                            key={ch.id}
                            onClick={() => setActiveChannel(ch.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeChannel === ch.id ? 'bg-pitch-lime/10 text-pitch-dark dark:text-pitch-lime font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Hash size={16} className={activeChannel === ch.id ? 'text-pitch-lime' : 'text-gray-400'} />
                                <span className="truncate">{ch.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 px-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10 w-full relative">
                <div className="flex items-center gap-3">
                     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-500">
                         <Hash size={20} />
                     </button>
                     <div className="flex items-center gap-2">
                         <Hash size={24} className="text-gray-400" />
                         <h2 className="font-bold text-lg dark:text-white">{MOCK_CHANNELS.find(c => c.id === activeChannel)?.name}</h2>
                     </div>
                     <span className="hidden sm:inline-block bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium ml-2 border border-gray-200 dark:border-gray-700">Protected Channel</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                     {isSearching ? (
                         <div className="flex items-center" style={{ width: '200px' }}>
                             <input 
                                 autoFocus
                                 type="text" 
                                 placeholder="Search..."
                                 value={searchQuery}
                                 onChange={e => setSearchQuery(e.target.value)}
                                 className="w-full text-sm bg-gray-100 dark:bg-gray-800 border-none rounded-l-md px-3 py-1.5 outline-none dark:text-white"
                             />
                             <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded-r-md hover:text-pitch-dark dark:hover:text-white">
                                 <X size={16} />
                             </button>
                         </div>
                     ) : (
                         <button onClick={() => setIsSearching(true)} title="Search in channel"><Search size={20} className="hover:text-pitch-dark dark:hover:text-white transition-colors" /></button>
                     )}
                     <button title="Channel Details"><Info size={20} className="hover:text-pitch-dark dark:hover:text-white transition-colors" /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative" ref={scrollRef}>
                <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
                    <div className="w-16 h-16 bg-pitch-lime/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Hash size={32} className="text-pitch-dark dark:text-pitch-lime" />
                    </div>
                    <h3 className="font-bold text-xl dark:text-white mb-2">Welcome to {MOCK_CHANNELS.find(c => c.id === activeChannel)?.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">This is the secure, real-time communication channel for this squad. Official club communications.</p>
                </div>

                {displayedMessages.length === 0 ? (
                    <div className="text-center text-gray-400 dark:text-gray-500 mt-20 italic">{searchQuery ? 'No messages found.' : 'No messages yet. Start the conversation.'}</div>
                ) : (
                    displayedMessages.map((msg, i) => {
                        const isYou = msg.senderName.includes('(You)');
                        return (
                            <div key={msg.id} className={`flex gap-4 ${isYou ? 'flex-row-reverse' : 'flex-row'} group`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${msg.senderRole === 'coach' ? 'bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                    {msg.senderName.charAt(0)}
                                </div>
                                <div className={`flex flex-col gap-1 max-w-[75%] ${isYou ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm dark:text-gray-200">{msg.senderName}</span>
                                        {msg.senderRole === 'coach' && <span className="bg-pitch-lime/20 text-pitch-dark dark:text-pitch-lime text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><Shield size={10} /> Coach</span>}
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            {msg.timestamp}
                                            {isYou && (
                                                <span className={msg.isRead ? 'text-blue-500' : 'text-gray-400'}>
                                                    {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Message Body */}
                                    <div className="flex items-center gap-2 relative">
                                        {/* Reaction button (shows on hover) */}
                                        {isYou && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-10 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow rounded-full flex items-center mt-1 p-1 z-10 border border-gray-100 dark:border-gray-700 cursor-pointer">
                                                <div className="flex gap-1" title="Add reaction">
                                                    {COMMON_EMOJIS.slice(0,3).map(e => (
                                                         <span key={e} onClick={() => addReaction(msg.id, e)} className="hover:scale-125 transition-transform">{e}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`p-3 rounded-2xl ${isYou ? 'bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark rounded-tr-sm' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                                            {msg.type === 'poll' ? (
                                                <div className="w-64">
                                                    <div className="font-bold mb-3 flex gap-2 items-start"><BarChart2 size={18} className="mt-0.5" /> {msg.text}</div>
                                                    <div className="space-y-2">
                                                        {msg.pollOptions?.map(opt => {
                                                            const totalVotes = msg.pollOptions?.reduce((acc, o) => acc + o.votes.length, 0) || 0;
                                                            const percent = totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);
                                                            const myVoteId = role === 'coach' ? 'c_you' : 'p_you';
                                                            const hasMyVote = opt.votes.includes(myVoteId);
                                                            
                                                            return (
                                                                <button 
                                                                    key={opt.id}
                                                                    onClick={() => handleVote(msg.id, opt.id)}
                                                                    className={`w-full text-left p-2 rounded relative overflow-hidden transition-colors border ${hasMyVote ? 'border-pitch-lime bg-white/10 dark:bg-black/20' : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                                                >
                                                                    <div className={`absolute left-0 top-0 bottom-0 opacity-20 ${hasMyVote ? 'bg-pitch-lime' : 'bg-gray-400'}`} style={{ width: `${percent}%` }}></div>
                                                                    <div className="relative flex justify-between z-10 text-sm">
                                                                          <span>{opt.text} <span className="text-xs opacity-70 ml-1">({opt.votes.length})</span></span>
                                                                          <span className="font-bold">{percent}%</span>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                            )}
                                        </div>

                                        {!isYou && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-10 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow rounded-full flex items-center mt-1 p-1 z-10 border border-gray-100 dark:border-gray-700 cursor-pointer">
                                                <div className="flex gap-1" title="Add reaction">
                                                    {COMMON_EMOJIS.slice(0,3).map(e => (
                                                         <span key={e} onClick={() => addReaction(msg.id, e)} className="hover:scale-125 transition-transform">{e}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reactions list */}
                                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                        <div className={`flex gap-1 mt-1 flex-wrap ${isYou ? 'justify-end' : 'justify-start'}`}>
                                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                                                <div key={emoji} onClick={() => addReaction(msg.id, emoji)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                    <span>{emoji}</span>
                                                    <span className="font-bold dark:text-gray-300">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 relative">
                <form onSubmit={sendMessage} className="flex gap-2 items-end">
                    {/* Poll Mode Toggle for Coach */}
                    {role === 'coach' && (
                        <button 
                            type="button" 
                            onClick={() => setIsPollMode(!isPollMode)}
                            className={`p-3 transition-colors rounded-xl border ${isPollMode ? 'bg-pitch-dark text-white border-pitch-dark dark:bg-pitch-lime dark:text-pitch-dark dark:border-pitch-lime' : 'text-gray-400 hover:text-pitch-lime bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
                            title="Create Poll"
                        >
                            <BarChart2 size={20} />
                        </button>
                    )}

                    {/* Emoji Picker container */}
                    <div className="relative">
                        <button 
                            type="button" 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-3 text-gray-400 hover:text-pitch-lime transition-colors bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                            title="Insert Emoji"
                        >
                            <Smile size={20} />
                        </button>

                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute bottom-14 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 z-50 w-64"
                                >
                                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Quick Reactions</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {COMMON_EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => {
                                                    setNewMessage(prev => prev + emoji);
                                                    setShowEmojiPicker(false);
                                                }}
                                                className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-transform hover:scale-110 active:scale-95"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {isPollMode ? (
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                            <input
                                type="text"
                                value={pollQuestion}
                                onChange={(e) => setPollQuestion(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full bg-transparent font-bold outline-none focus:border-pitch-lime dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700"
                            />
                            <div className="space-y-2">
                                {pollOptions.map((opt, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...pollOptions];
                                                newOpts[idx] = e.target.value;
                                                setPollOptions(newOpts);
                                            }}
                                            placeholder={`Option ${idx + 1}`}
                                            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-sm outline-none focus:border-pitch-lime dark:text-white"
                                        />
                                        {pollOptions.length > 2 && (
                                            <button type="button" onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-600 p-2">
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => setPollOptions([...pollOptions, ''])} className="text-sm text-pitch-dark dark:text-pitch-lime font-bold flex items-center gap-1 self-start hover:underline">
                                <Plus size={16} /> Add Option
                            </button>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${MOCK_CHANNELS.find(c => c.id === activeChannel)?.name}`}
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-pitch-lime dark:text-white transition-colors"
                        />
                    )}

                    <button 
                        type="submit" 
                        disabled={isPollMode ? (!pollQuestion.trim() || pollOptions.every(o => !o.trim())) : !newMessage.trim()}
                        className="bg-pitch-dark dark:bg-pitch-lime text-white dark:text-pitch-dark p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black dark:hover:bg-[#b0e600] transition-colors self-end"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <div className="text-center mt-2 text-[10px] text-gray-400 font-medium">Replaces fragmented WhatsApp groups with encrypted, context-aware squad messaging.</div>
            </div>
        </div>
    </div>
  );
}

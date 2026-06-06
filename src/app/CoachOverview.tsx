import React, { useState, useEffect } from 'react';
import { Calendar, Users, Target, Activity, AlertCircle, ArrowRight, ClipboardCheck, Stethoscope, Plus, ChevronRight, Play, ShieldAlert, HeartPulse, MapPin, CloudRain, Sun, Wind, CheckCircle2, MessageSquare, Star, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { QuickActions } from '../components/QuickActions';
import { ActivityFeed } from '../components/ActivityFeed';

const PERFORMANCE_DATA = [
    { week: 'W1', intensity: 75, focus: 80, fatigue: 30 },
    { week: 'W2', intensity: 82, focus: 75, fatigue: 45 },
    { week: 'W3', intensity: 88, focus: 85, fatigue: 60 },
    { week: 'W4', intensity: 85, focus: 90, fatigue: 55 },
    { week: 'W5', intensity: 92, focus: 88, fatigue: 70 },
    { week: 'W6', intensity: 85, focus: 95, fatigue: 65 },
];

interface InjuryReport {
    id: string;
    playerName: string;
    injuryType: string;
    recoveryProgress: number;
    status: 'Out' | 'Light Training' | 'Available';
}

const MOCK_INJURIES: InjuryReport[] = [
    { id: '1', playerName: 'Alex Johnson', injuryType: 'Ankle Sprain', recoveryProgress: 60, status: 'Out' },
    { id: '2', playerName: 'David Smith', injuryType: 'Hamstring Strain', recoveryProgress: 90, status: 'Light Training' }
];

export default function CoachOverview({ onNavigate }: { onNavigate?: (tab: string) => void }) {
    const [injuries, setInjuries] = useState<InjuryReport[]>(MOCK_INJURIES);
    const [showInjuryForm, setShowInjuryForm] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newInjuryType, setNewInjuryType] = useState('');
    const [newStatus, setNewStatus] = useState<'Out' | 'Light Training' | 'Available'>('Out');
    
    // Quick Feedback State
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackNotes, setFeedbackNotes] = useState('');

    // Weather State
    const [weather, setWeather] = useState<{ temp: number, condition: string, advice: string } | null>(null);

    useEffect(() => {
        // Mock fetch weather based on location
        setTimeout(() => {
            setWeather({ temp: 18, condition: 'Rain', advice: 'Wet surface conditions. Wear appropriate boots and focus on short passes.' });
        }, 1000);
    }, []);

    const handleSessionToggle = () => {
        if (isSessionActive) {
            setIsSessionActive(false);
            setShowFeedbackModal(true);
        } else {
            setIsSessionActive(true);
        }
    };

    const submitFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Session Feedback Submitted:\nRating: ${feedbackRating}/5\nNotes: ${feedbackNotes}`);
        setShowFeedbackModal(false);
        setFeedbackRating(0);
        setFeedbackNotes('');
    };

    const handleAddInjury = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlayerName.trim() || !newInjuryType.trim()) return;

        setInjuries([
            ...injuries,
            {
                id: Math.random().toString(),
                playerName: newPlayerName,
                injuryType: newInjuryType,
                recoveryProgress: newStatus === 'Available' ? 100 : newStatus === 'Light Training' ? 80 : 20,
                status: newStatus
            }
        ]);
        setNewPlayerName('');
        setNewInjuryType('');
        setShowInjuryForm(false);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-pitch-dark dark:text-white mb-2 uppercase tracking-tight">Active Duty: London HQ</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Head Coach Terminal • U15 Boys Elite Division</p>
                </div>
                <div className="flex gap-4">
                     <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <Activity size={18} className="text-blue-500" />
                        Log Readiness
                    </button>
                    <button onClick={handleSessionToggle} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-sm shadow-xl transition-colors uppercase tracking-widest ${isSessionActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-pitch-dark text-pitch-lime hover:bg-black'}`}>
                        {isSessionActive ? <Target size={18} /> : <ClipboardCheck size={18} />}
                        {isSessionActive ? 'End Session' : 'Session Start'}
                    </button>
                </div>
            </div>

            {showFeedbackModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-4 cursor-pointer text-gray-400 hover:text-white" onClick={() => setShowFeedbackModal(false)}>✕</div>
                        <h3 className="text-2xl font-black text-pitch-dark dark:text-white mb-2 uppercase">Session Completed</h3>
                        <p className="text-gray-500 mb-6 font-medium">Log a quick sentiment rating and notes for post-match analysis.</p>
                        
                        <form onSubmit={submitFeedback} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Session Rating (1-5)</label>
                                <div className="flex gap-2 justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button" 
                                            onClick={() => setFeedbackRating(star)}
                                            className="p-2 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star size={32} className={star <= feedbackRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Coach Notes</label>
                                <textarea 
                                    value={feedbackNotes}
                                    onChange={(e) => setFeedbackNotes(e.target.value)}
                                    placeholder="Optional tactical or player notes..."
                                    rows={4}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-pitch-lime text-pitch-dark dark:text-white resize-none"
                                ></textarea>
                            </div>
                            <button type="submit" disabled={feedbackRating === 0} className="w-full bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark rounded-xl py-4 font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                                Save Feedback
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <QuickActions 
                onCreatePlan={() => onNavigate?.('attendance')}
                onScheduleMatch={() => onNavigate?.('matches')}
                onRecordAttendance={() => onNavigate?.('attendance')} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-pitch-dark text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pitch-lime opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                    <div className="relative z-10 flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 text-pitch-lime rounded-xl backdrop-blur-sm">
                                <Calendar size={24} />
                            </div>
                            <h3 className="font-bold text-lg">Next Mission</h3>
                        </div>
                        <span className="text-xs font-black bg-pitch-lime text-pitch-dark px-3 py-1 rounded-full uppercase tracking-wider">T-Minus 2H</span>
                    </div>
                    <h4 className="text-2xl font-black mb-2">High-Press Transition</h4>
                    <p className="text-sm text-gray-400 font-medium flex items-center gap-2"><MapPin size={14}/> Turf 1 (Main Stadium) • 18 Expected</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                                {weather ? (weather.condition.includes('Rain') ? <CloudRain size={24} /> : <Sun size={24} />) : <Loader2 size={24} className="animate-spin" />}
                            </div>
                            <h3 className="font-bold text-lg text-pitch-dark dark:text-white">Matchday Weather</h3>
                        </div>
                        {weather && <span className="text-2xl font-black text-pitch-dark dark:text-white">{weather.temp}°C</span>}
                    </div>
                    {weather ? (
                        <div>
                            <p className="text-blue-500 font-black tracking-widest uppercase text-sm mb-2">{weather.condition}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                {weather.advice}
                            </p>
                        </div>
                    ) : (
                         <div className="animate-pulse flex flex-col gap-2 w-full mt-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
                                <ShieldAlert size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-pitch-dark dark:text-white">Squad Status</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                            <h4 className="text-2xl font-black text-red-500">2</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Out</p>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                            <h4 className="text-2xl font-black text-yellow-500">1</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Light</p>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                            <h4 className="text-2xl font-black text-green-500">21</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-pitch-dark dark:text-white flex items-center gap-2"><Target className="text-blue-500"/> Tactical Objective</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium leading-relaxed">
                        Execute immediate 3-second counter-press upon losing possession in the attacking third. Forcing play wide.
                    </p>
                    <button className="text-sm font-bold text-blue-500 flex items-center justify-between w-full p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                        <span>Review Tactical VR</span>
                        <Play size={16} fill="currentColor" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2"><Activity className="text-pitch-lime"/> Micro-Cycle Telemetry</h3>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-1 text-xs font-bold text-pitch-dark dark:text-white"><div className="w-2 h-2 rounded-full bg-pitch-lime"></div> Intensity</div>
                             <div className="flex items-center gap-1 text-xs font-bold text-pitch-dark dark:text-white"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Focus</div>
                             <div className="flex items-center gap-1 text-xs font-bold text-pitch-dark dark:text-white"><div className="w-2 h-2 rounded-full bg-red-500"></div> Fatigue</div>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#C6FF00" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorFoc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} domain={[20, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0A1A12', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{color: '#fff'}} />
                                <Area type="monotone" dataKey="intensity" stroke="#b0e600" fillOpacity={1} fill="url(#colorInt)" strokeWidth={3} />
                                <Area type="monotone" dataKey="focus" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFoc)" strokeWidth={3} />
                                <Area type="monotone" dataKey="fatigue" stroke="#ef4444" fillOpacity={1} fill="url(#colorFat)" strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2">
                            <HeartPulse className="text-red-500" /> Physio & Recovery
                        </h3>
                        <button 
                            onClick={() => setShowInjuryForm(!showInjuryForm)}
                            className="bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-2 rounded-xl transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {showInjuryForm && (
                        <form onSubmit={handleAddInjury} className="mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                            <input 
                                type="text" placeholder="Athlete ID / Name" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} required
                                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-red-500 transition-colors"
                            />
                            <input 
                                type="text" placeholder="Diagnosis (e.g. MCL Sprain)" value={newInjuryType} onChange={e => setNewInjuryType(e.target.value)} required
                                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-red-500 transition-colors"
                            />
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value as any)} className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-red-500">
                                <option value="Out">Code Red: Inactive</option>
                                <option value="Light Training">Code Yellow: Light Training</option>
                                <option value="Available">Code Green: Cleared</option>
                            </select>
                            <button type="submit" className="w-full bg-red-500 text-white rounded-xl py-3 text-sm font-black uppercase tracking-widest shadow-md hover:bg-red-600 transition-colors border-0">Log Medical Event</button>
                        </form>
                    )}

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {injuries.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <HeartPulse size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
                                <p className="font-bold">No Active Medical Alerts</p>
                            </div>
                        ) : (
                            injuries.map(inj => (
                                <div key={inj.id} className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col gap-3 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-pitch-dark dark:text-white">{inj.playerName}</h4>
                                            <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">{inj.injuryType}</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${inj.status === 'Available' ? 'bg-green-100 text-green-700' : inj.status === 'Light Training' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {inj.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full ${inj.status === 'Available' ? 'bg-green-500' : inj.status === 'Light Training' ? 'bg-yellow-400' : 'bg-red-500'} transition-all`} style={{ width: `${inj.recoveryProgress}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-black w-8 text-right">{inj.recoveryProgress}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" value={inj.recoveryProgress}
                                        onChange={(e) => setInjuries(injuries.map(i => i.id === inj.id ? { ...i, recoveryProgress: parseInt(e.target.value) } : i))}
                                        className="w-full mt-2 accent-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-pitch-dark dark:text-white">Active Interventions</h3>
                        <button className="text-sm font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { init: 'MR', name: 'Marcus Rashford', stat: 'Finishing Deficit', note: 'Assign 20 mins post-session isolated finishing reps.', status: 'Incomplete', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                            { init: 'JB', name: 'Jude Bellingham', stat: 'High Load Warning', note: 'Reduce sprint volumes tonight by 20%.', status: 'Actioned', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                            { init: 'PF', name: 'Phil Foden', stat: 'Tactical Realignment', note: 'Review positioning from last match video session.', status: 'Pending', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
                        ].map((p, i) => (
                             <div key={i} className="group p-4 border border-gray-100 dark:border-gray-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between transition-colors hover:bg-pitch-dark dark:hover:bg-gray-750 hover:text-white cursor-pointer hover:border-transparent">
                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${p.bg} ${p.color} transition-colors group-hover:bg-white/10 group-hover:text-white`}>{p.init}</div>
                                    <div>
                                        <h4 className="font-bold text-pitch-dark dark:text-white group-hover:text-white text-lg transition-colors">{p.name}</h4>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors"><span className={`font-semibold mr-2 ${p.color} group-hover:text-pitch-lime transition-colors`}>{p.stat}</span></p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right">
                                     <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300 group-hover:text-gray-200 transition-colors">{p.note}</p>
                                     <span className="text-[10px] uppercase tracking-widest font-black border border-current px-2 py-1 rounded transition-colors">{p.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2"><Users className="text-blue-500"/> Training Attendance (Last 30 Days)</h3>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { day: '1', percent: 90 }, { day: '5', percent: 85 }, { day: '10', percent: 95 }, 
                                    { day: '15', percent: 100 }, { day: '20', percent: 80 }, { day: '25', percent: 92 }, { day: '30', percent: 88 }
                                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} domain={[0, 100]} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0A1A12', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{color: '#fff'}} />
                                    <Bar dataKey="percent" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                        {
                                            [90, 85, 95, 100, 80, 92, 88].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry > 90 ? '#3b82f6' : entry > 80 ? '#60a5fa' : '#93c5fd'} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <ActivityFeed />
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-pitch-dark dark:text-white">Curriculum Vault</h3>
                            <ChevronRight className="text-gray-400" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                             {['Rondo 4v2 (Intensity+)', 'Shooting Circuit (Isolated)', 'Defensive Shape (Block)', 'Sprint Intervals'].map((drill, i) => (
                                <div key={i} className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-28 bg-gray-100 dark:bg-gray-800 cursor-pointer flex items-center justify-center">
                                    <div className="absolute inset-0 bg-neutral-900 group-hover:scale-105 transition-transform duration-500 ease-out">
                                        <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4">
                                        <p className="text-white font-bold">{drill}</p>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pitch-lime/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 text-pitch-dark">
                                        <Play fill="currentColor" size={20} />
                                    </div>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

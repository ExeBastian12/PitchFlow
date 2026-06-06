import { useState } from 'react';
import { Calendar, CreditCard, Award, Activity, Heart, ShoppingBag, Video, ArrowRight, MessageSquare, MapPin, PlayCircle, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ATTENDANCE_DATA = [
    { month: 'Jul', rate: 100 },
    { month: 'Aug', rate: 92 },
    { month: 'Sep', rate: 88 },
    { month: 'Oct', rate: 95 },
];

const STATS_DATA = [
    { subject: 'Pace', A: 85, fullMark: 100 },
    { subject: 'Shooting', A: 78, fullMark: 100 },
    { subject: 'Passing', A: 86, fullMark: 100 },
    { subject: 'Dribbling', A: 82, fullMark: 100 },
    { subject: 'Defending', A: 65, fullMark: 100 },
    { subject: 'Physical', A: 72, fullMark: 100 },
];

export default function ParentDashboard() {
    const [matchAvailable, setMatchAvailable] = useState<boolean | null>(null);

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pitch-lime to-blue-500 p-1">
                            <div className="w-full h-full bg-pitch-dark rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden">
                                <span className="text-3xl font-black text-white tracking-tighter">MR</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg">
                            <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-pitch-dark dark:text-white mb-2 tracking-tight uppercase">Marcus Rashford Jr.</h2>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1 text-pitch-dark dark:text-pitch-lime"><ShieldCheck size={16}/> London Elite U15</span>
                            <span>•</span>
                            <span>Striker (#9)</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-pitch-dark dark:text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all uppercase tracking-widest">
                        <MessageSquare size={16} className="text-pitch-lime" /> Coach Chat
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-pitch-dark text-pitch-lime rounded-xl text-sm font-bold shadow-xl hover:-translate-y-0.5 transition-all uppercase tracking-widest">
                        <CreditCard size={18} /> Pay Dues
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={16}/> Upcoming Match Availability</h3>
                    <p className="text-lg font-black text-pitch-dark dark:text-white">vs. Westside Eagles <span className="text-sm font-medium text-gray-500 ml-2">(Sat, 10:00 AM)</span></p>
                </div>
                <div className="flex max-w-full sm:max-w-[400px] gap-2 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button 
                         onClick={() => setMatchAvailable(true)}
                         className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${matchAvailable === true ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                    >
                         <CheckCircle2 size={16} /> Available
                    </button>
                    <button 
                         onClick={() => setMatchAvailable(false)}
                         className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${matchAvailable === false ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                    >
                         <XCircle size={16} /> Not Available
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Attendance', value: '94%', icon: Activity, tone: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', sub: 'Excellent standing' },
                    { label: 'Next Match', value: 'Sat, 10 AM', icon: Calendar, tone: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', sub: 'vs. Westside Eagles' },
                    { label: 'Tuition Payments', value: 'Up to Date', icon: CreditCard, tone: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', sub: 'Next due: Nov 1' },
                    { label: 'Team Store', value: 'New Kit', icon: ShoppingBag, tone: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', sub: 'Pre-order active' },
                ].map((card, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:scale-150 transition-transform -translate-y-1/2 translate-x-1/2 ${card.bg}`}></div>
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.tone} border border-white/50 dark:border-gray-700/50`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest relative z-10">{card.label}</h3>
                        <p className="text-2xl font-black text-pitch-dark dark:text-white mt-1 relative z-10">{card.value}</p>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-2 relative z-10">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-pitch-dark rounded-2xl shadow-xl p-6 lg:col-span-1 relative overflow-hidden flex flex-col">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                    <div className="relative z-10 flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Award className="text-pitch-lime" /> Attributes Snapshot</h3>
                    </div>
                    <div className="flex-1 w-full relative z-10 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={STATS_DATA}>
                                <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 'bold' }} />
                                <Radar name="Marcus" dataKey="A" stroke="#C6FF00" strokeWidth={3} fill="#C6FF00" fillOpacity={0.15} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-4 relative z-10">Updated: Post-Match (Oct 24)</p>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2">Official Coach Feedback</h3>
                            <button className="text-sm font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Complete Report</button>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="p-5 border border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-pitch-lime"></div>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pitch-dark text-white text-xs flex justify-center items-center font-bold">CS</div>
                                        <div>
                                            <span className="text-sm font-bold text-pitch-dark dark:text-white block">Coach Smith</span>
                                            <span className="text-xs text-gray-400 font-medium">Head Coach</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 tracking-wider">Oct 24, 2026</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    "Marcus showed exceptional energy in the pressing drills this week. He's really improving his tactical awareness off the ball and finding pockets of space. I'd like to see him continue practicing those weak-foot finishing drills at home."
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-xs font-bold uppercase tracking-widest bg-pitch-lime/20 text-pitch-dark dark:text-pitch-lime px-3 py-1 rounded-md">Tactics: A</span>
                                    <span className="text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-md">Effort: A+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2"><Video size={20} className="text-red-500" /> Match Highlights Vault</h3>
                    <button className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                        Open Gallery <ArrowRight size={14} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Goal vs Tigers', date: 'Oct 15', duration: '0:45' },
                        { title: 'Assist vs City', date: 'Oct 02', duration: '0:12' },
                        { title: 'Skills Compilation', date: 'September', duration: '2:30' },
                        { title: 'Training Focus', date: 'Last Week', duration: '1:15' }
                    ].map((vid, i) => (
                        <div key={i} className="group aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl relative overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700">
                             <div className="w-full h-full opacity-60 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee71ab52d2f?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4">
                                <div className="self-end bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">{vid.duration}</div>
                                <div>
                                    <p className="text-white font-bold text-sm leading-tight flex items-center gap-2 group-hover:text-pitch-lime transition-colors"><PlayCircle size={16} /> {vid.title}</p>
                                    <p className="text-gray-400 text-xs mt-1">{vid.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

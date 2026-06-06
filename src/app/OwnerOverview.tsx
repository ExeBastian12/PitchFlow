import { DollarSign, Users, Award, TrendingUp, Building2, MapPin, Activity, Zap, ShieldCheck, Target, TrendingDown, Globe, PieChart, LayoutTemplate } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, AreaChart, Area, Legend, PieChart as RechartsPie, Pie, Cell } from 'recharts';

const FINANCIAL_DATA = [
    { month: 'Jul', revenue: 45000, expenses: 28000, margin: 17000 },
    { month: 'Aug', revenue: 52000, expenses: 29000, margin: 23000 },
    { month: 'Sep', revenue: 48000, expenses: 30000, margin: 18000 },
    { month: 'Oct', revenue: 61000, expenses: 31000, margin: 30000 },
    { month: 'Nov', revenue: 64000, expenses: 32000, margin: 32000 },
    { month: 'Dec', revenue: 78000, expenses: 35000, margin: 43000 }
];

const AGE_DISTRIBUTION = [
    { name: 'U8-U10', value: 400 },
    { name: 'U11-U14', value: 300 },
    { name: 'U15-U18', value: 300 },
    { name: 'Senior', value: 200 },
];
const COLORS = ['#1A3D29', '#C6FF00', '#4ade80', '#0A1A12'];

export default function OwnerOverview() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Header section with impressive typography and global stats */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-pitch-dark dark:text-white mb-2 uppercase">Global Synergy Network</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Enterprise Management Dashboard • 7 Regions • 12 Active Academies</p>
                </div>
                <div className="hidden md:flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-pitch-dark rounded-xl flex items-center justify-center text-white"><Globe size={24} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Reach</p>
                            <p className="text-xl font-black dark:text-white">12,492</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 bg-pitch-lime rounded-xl flex items-center justify-center text-pitch-dark"><Target size={24} /></div>
                        <div>
                            <p className="text-xs font-bold text-pitch-dark dark:text-pitch-lime uppercase tracking-wider">Active Programs</p>
                            <p className="text-xl font-black dark:text-white">84</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Q4 Revenue (Proj)', value: '$180,000', icon: DollarSign, trend: '+12%', color: 'text-green-500', trendColor: 'text-green-600' },
                    { label: 'Total Global Staff', value: '427', icon: Users, trend: '+34', color: 'text-blue-500', trendColor: 'text-blue-600' },
                    { label: 'Average Retention', value: '94%', icon: ShieldCheck, trend: '+2.5%', color: 'text-purple-500', trendColor: 'text-purple-600' },
                    { label: 'Operating Cost', value: '$42,000', icon: TrendingDown, trend: '-4%', color: 'text-red-500', trendColor: 'text-green-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center opacity-50 z-0"></div>
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className={`text-sm font-bold bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-full ${stat.trendColor}`}>{stat.trend}</span>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider relative z-10">{stat.label}</h3>
                        <p className="text-3xl font-black text-pitch-dark dark:text-white relative z-10">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Financial Overview - Spans 2 cols on XL */}
                <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2"><Activity className="text-pitch-lime" /> Financial Trajectory (YTD)</h3>
                        <div className="flex gap-2">
                             <button className="text-xs font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">Monthly</button>
                             <button className="text-xs font-semibold px-3 py-1 bg-pitch-dark text-pitch-lime rounded-lg hidden sm:block">Quarterly</button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={FINANCIAL_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1A3D29" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#1A3D29" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#C6FF00" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0A1A12', color: '#fff', borderRadius: '12px', border: 'none' }} itemStyle={{ color: '#fff' }} />
                                <Legend iconType="circle" />
                                <Area type="monotone" dataKey="revenue" stroke="#1A3D29" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                                <Area type="monotone" dataKey="expenses" stroke="#b0e600" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Player Distribution Pie */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 className="text-xl font-bold text-pitch-dark dark:text-white mb-6 flex items-center gap-2"><PieChart size={20} className="text-blue-500" /> Demographics</h3>
                    <div className="flex-1 min-h-[250px] relative flex flex-col justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie
                                    data={AGE_DISTRIBUTION}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {AGE_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                            </RechartsPie>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
                            <span className="text-xs text-gray-500 font-bold uppercase">Total</span>
                            <span className="text-2xl font-black dark:text-white leading-none">1.2K</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real-time Branch Performance */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-pitch-dark dark:text-white flex items-center gap-2"><Building2 size={24} className="text-purple-500" /> Regional Academies Live</h3>
                        <button className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"><LayoutTemplate size={18} /></button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'London Central HQ', players: 450, capacity: '92%', revenue: '$182k', icon: MapPin, status: 'Optimal', prog: 92 },
                            { name: 'Manchester Branch', players: 280, capacity: '78%', revenue: '$104k', icon: MapPin, status: 'Growing', prog: 78 },
                            { name: 'Dubai Sports Center', players: 120, capacity: '45%', revenue: '$85k', icon: MapPin, status: 'New', prog: 45 },
                            { name: 'Singapore Hub', players: 310, capacity: '88%', revenue: '$145k', icon: MapPin, status: 'Optimal', prog: 88 },
                        ].map((branch, i) => (
                            <div key={i} className="group flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-pitch-dark dark:hover:bg-gray-750 hover:text-white transition-all cursor-pointer">
                                <div className="flex gap-4 items-center mb-3 sm:mb-0">
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 group-hover:bg-white/10 rounded-xl text-gray-600 dark:text-gray-300 group-hover:text-pitch-lime transition-colors">
                                        <branch.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-pitch-dark dark:text-white group-hover:text-white text-lg">{branch.name}</h4>
                                        <div className="flex items-center gap-3 text-sm mt-1">
                                            <span className={`font-semibold ${branch.status === 'Optimal' ? 'text-green-500 group-hover:text-green-400' : branch.status === 'Growing' ? 'text-blue-500 group-hover:text-blue-400' : 'text-purple-500 group-hover:text-purple-400'}`}>{branch.status}</span>
                                            <span className="text-gray-400 group-hover:text-gray-300">• {branch.players} Players</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:text-right w-full sm:w-auto">
                                    <div className="flex sm:block justify-between items-center mb-2 sm:mb-0">
                                         <p className="text-gray-500 dark:text-gray-400 group-hover:text-gray-300 text-xs font-bold uppercase tracking-wider mb-1">YTD Rev</p>
                                         <p className="font-black text-xl text-pitch-dark dark:text-white group-hover:text-white">{branch.revenue}</p>
                                    </div>
                                    <div className="w-full sm:w-32 h-2 bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-pitch-lime rounded-full" style={{ width: `${branch.prog}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscriptions & Sponsors */}
                <div className="bg-pitch-dark rounded-2xl shadow-xl p-8 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pitch-lime opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                             <h3 className="text-xl font-bold text-white flex items-center gap-2"><Award className="text-pitch-lime" /> Ecosystem & Partners</h3>
                             <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold">12 Active Modules</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
                                <Zap size={28} className="text-pitch-lime mb-3" />
                                <h4 className="font-bold text-lg text-white mb-1">Enterprise Core</h4>
                                <p className="text-sm text-gray-400">All locations unlocked. White-label app deployed. SLA 99.9%.</p>
                            </div>
                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
                                <Activity size={28} className="text-blue-400 mb-3" />
                                <h4 className="font-bold text-lg text-white mb-1">Performance AI</h4>
                                <p className="text-sm text-gray-400">Computer vision tracking enabled across 5 high-performance hubs.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <button className="w-full py-4 bg-pitch-lime text-pitch-dark font-black tracking-widest uppercase rounded-xl hover:bg-white transition-colors">
                            Manage Subscriptions & Billing Hub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

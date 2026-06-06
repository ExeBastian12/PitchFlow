import { Users, DollarSign, Activity, AlertCircle, ArrowUpRight, Calendar, Settings, Shield, ChevronDown, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 12000, collections: 11500 },
  { name: 'Feb', revenue: 21000, collections: 20000 },
  { name: 'Mar', revenue: 18000, collections: 17500 },
  { name: 'Apr', revenue: 24000, collections: 22000 },
  { name: 'May', revenue: 28000, collections: 27000 },
  { name: 'Jun', revenue: 32000, collections: 30000 },
];

const AGE_GROUP_DATA = [
    { group: 'U8', count: 45 },
    { group: 'U10', count: 52 },
    { group: 'U12', count: 68 },
    { group: 'U15', count: 58 },
    { group: 'U18', count: 25 },
];

export default function AdminOverview() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-pitch-dark dark:text-white mb-2 uppercase tracking-tight">London Central HQ</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Club Operations, Financial Collections, and Squad Readiness</p>
                </div>
                <div className="flex flex-wrap gap-3">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input type="text" placeholder="Search player/staff..." className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-pitch-lime outline-none dark:text-white" />
                     </div>
                     <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                        <Calendar size={16} /> Filter Date
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-pitch-dark text-pitch-lime rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-md">
                        <Settings size={16} /> Club Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Roster', value: '348', sub: '+12% from last season', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Monthly Collections', value: '$32,450', sub: '92% collection rate', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { label: 'Coaching Staff', value: '18', sub: '2 certs pending renewal', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: 'Overdue Payments', value: '$2,150', sub: '14 accounts flagged', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-black text-pitch-dark dark:text-white mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-pitch-dark dark:text-white">Revenue vs Collections</h3>
                        <button className="text-sm font-semibold text-pitch-dark dark:text-white flex items-center gap-1">Last 6 Months <ChevronDown size={14}/></button>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#e5e7eb" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Billed Revenue" />
                                <Area type="monotone" dataKey="collections" stroke="#b0e600" fill="#C6FF00" fillOpacity={0.1} strokeWidth={4} name="Actual Collections" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-pitch-dark dark:text-white mb-6">Squad Density by Age</h3>
                    <div className="h-72 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AGE_GROUP_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:opacity-10" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} />
                                <YAxis dataKey="group" type="category" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                  {
                                    AGE_GROUP_DATA.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1A3D29' : '#b0e600'} />
                                    ))
                                  }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-pitch-dark dark:text-white">Coach Readiness & Certifications</h3>
                        <button className="text-sm font-semibold text-pitch-dark dark:text-white underline">Manage Staff</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'John Smith', role: 'Head Coach U15 Boys', status: 'Cleared', initials: 'JS', icon: CheckCircle2, color: 'text-green-500' },
                            { name: 'Mike Johnson', role: 'Coach U12 Boys', status: 'CPR Expiring Soon', initials: 'MJ', icon: Clock, color: 'text-yellow-500' },
                            { name: 'Sarah Davis', role: 'Asst. Coach U8', status: 'Background Check Pending', initials: 'SD', icon: AlertCircle, color: 'text-red-500' }
                        ].map((coach, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm bg-gray-100 dark:bg-gray-700 text-pitch-dark dark:text-white`}>{coach.initials}</div>
                                    <div>
                                        <p className="font-bold text-sm dark:text-white group-hover:text-pitch-lime transition">{coach.name}</p>
                                        <p className="text-xs text-gray-500">{coach.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold ${coach.color}`}>{coach.status}</span>
                                    <coach.icon className={coach.color} size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-pitch-dark rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 top-0 w-64 h-full bg-pitch-lime/5 skew-x-12"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                             <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><MapPin className="text-pitch-lime"/> Facility Operations</h3>
                             <p className="text-gray-400 text-sm mb-6">Turf bookings, maintenance schedules, and lighting.</p>
                             
                             <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-pitch-lime"></div>
                                      <span className="font-semibold text-sm">Turf 1 (Main Stadium)</span>
                                   </div>
                                   <span className="text-xs font-bold text-pitch-dark bg-pitch-lime px-2 py-1 rounded">Booked (U15 Match)</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-pitch-lime"></div>
                                      <span className="font-semibold text-sm">Turf 2 (Training Ground)</span>
                                   </div>
                                   <span className="text-xs font-bold text-white border border-white/20 px-2 py-1 rounded">Available</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 opacity-75">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                      <span className="font-semibold text-sm">Indoor Pitch</span>
                                   </div>
                                   <span className="text-xs font-bold text-red-400">Maintenance</span>
                                </div>
                             </div>
                        </div>
                        <button className="mt-6 w-full py-3 bg-white text-pitch-dark rounded-xl font-bold hover:bg-gray-100 transition shadow-sm">Manage Facilities</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

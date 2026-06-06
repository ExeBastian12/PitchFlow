import React from 'react';
import { Users, BookOpen, Trophy, Activity, Calendar, Award, ChevronRight, Play, LayoutGrid, Building2, TrendingUp, MonitorPlay } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, Cell } from 'recharts';

const METRICS_DATA = [
  { month: 'Aug', engagement: 65, attendance: 80 },
  { month: 'Sep', engagement: 72, attendance: 85 },
  { month: 'Oct', engagement: 88, attendance: 92 },
  { month: 'Nov', engagement: 82, attendance: 90 },
  { month: 'Dec', engagement: 95, attendance: 94 },
];

export default function SchoolDashboard() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight text-pitch-dark dark:text-white mb-2 uppercase">Scholastic Athletic Command</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">District 12 • 4 Campuses • Extracurricular Management</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-pitch-dark dark:text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all uppercase tracking-widest">
            <LayoutGrid size={16} className="text-blue-500" /> Program Matrix
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark rounded-xl text-sm font-black shadow-xl hover:-translate-y-0.5 transition-all uppercase tracking-widest">
            + Deploy New Program
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Student Athletes', value: '1,248', icon: Users, tone: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', sub: 'Across 14 disciplines', trend: '+12%' },
          { label: 'Competitive Varsity Teams', value: '24', icon: Trophy, tone: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', sub: 'Regional phase', trend: 'Stable' },
          { label: 'Facility Utilization', value: '88%', icon: Building2, tone: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', sub: 'Peak hours (15:00-19:00)', trend: '+4%' },
          { label: 'Average GPA Status', value: '3.6', icon: BookOpen, tone: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', sub: 'Academic eligibility: 98%', trend: '+0.2' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
            <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full blur-3xl opacity-30 ${stat.bg} group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10 flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.tone}`}>
                 <stat.icon size={24} />
               </div>
               <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'}`}>{stat.trend}</span>
            </div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</h3>
            <p className="text-3xl font-black text-pitch-dark dark:text-white relative z-10 block mb-2">{stat.value}</p>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 relative z-10">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><TrendingUp className="text-blue-500"/> Engagement & Attendance Matrix</h3>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-pitch-dark dark:text-white"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Engagement</span>
                    <span className="flex items-center gap-1 text-pitch-dark dark:text-white"><div className="w-2 h-2 bg-pitch-lime rounded-full"></div> Attendance</span>
                </div>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={METRICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAttd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#C6FF00" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} domain={[40, 100]} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0A1A12', color: '#fff' }} />
                        <Area type="monotone" dataKey="engagement" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEngage)" strokeWidth={3} />
                        <Area type="monotone" dataKey="attendance" stroke="#b0e600" fillOpacity={1} fill="url(#colorAttd)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                 <h3 className="text-lg font-bold dark:text-white">Active Rosters & Performance</h3>
                 <button className="text-sm font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">Launch Roster Sync</button>
             </div>
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">
                      <th className="font-bold py-4 px-6 border-b border-gray-100 dark:border-gray-700">Program / Team</th>
                      <th className="font-bold py-4 px-6 border-b border-gray-100 dark:border-gray-700">Lead Coach</th>
                      <th className="font-bold py-4 px-6 border-b border-gray-100 dark:border-gray-700">Win Rate</th>
                      <th className="font-bold py-4 px-6 border-b border-gray-100 dark:border-gray-700 text-right">Status</th>
                   </tr>
                </thead>
                <tbody>
                   {[
                      { team: 'Varsity Soccer (Boys)', sub: 'Division 1', coach: 'Michael R.', win: '88%', status: 'In Season', tc: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                      { team: 'Varsity Basketball (Girls)', sub: 'State Playoffs', coach: 'Sarah J.', win: '92%', status: 'Playoffs', tc: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                      { team: 'JV Tennis', sub: 'Developmental', coach: 'David K.', win: '65%', status: 'Pre-Season', tc: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                   ].map((t, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer group">
                         <td className="py-4 px-6">
                             <span className="font-bold block dark:text-white group-hover:text-pitch-lime transition-colors">{t.team}</span>
                             <span className="text-xs text-gray-400 font-medium">{t.sub}</span>
                         </td>
                         <td className="py-4 px-6 text-gray-500 dark:text-gray-300 font-medium">{t.coach}</td>
                         <td className="py-4 px-6 font-black dark:text-white text-lg">{t.win}</td>
                         <td className="py-4 px-6 text-right">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${t.bg} ${t.tc}`}>{t.status}</span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-pitch-dark rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group hover:shadow-pitch-lime/10 transition-shadow">
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pitch-lime bg-opacity-20 rounded-full blur-3xl group-hover:bg-opacity-40 transition-opacity"></div>
             <MonitorPlay className="text-pitch-lime mb-6 w-12 h-12" />
             <h3 className="text-2xl font-black mb-3">Athletic Automation Engine</h3>
             <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">Sync GPAs with athletic eligibility, trigger automated coach evaluations, and dispatch term report cards to parents.</p>
             <button className="w-full bg-white text-pitch-dark py-4 rounded-xl font-black uppercase tracking-widest hover:bg-pitch-lime transition-colors shadow-lg">
               Initialize Workflows
             </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[calc(100%-250px)]">
             <h3 className="text-lg font-bold dark:text-white mb-6 uppercase tracking-widest text-gray-500 text-xs">Priority Comm Center / Fixtures</h3>
             <div className="space-y-3 flex-1 overflow-y-auto">
                {[
                  { op: 'Oakridge High', team: 'Varsity Soccer', date: 'Oct 24', time: '15:00', type: 'League' },
                  { op: 'St. Mary Academy', team: 'Varsity Basketball', date: 'Oct 26', time: '18:00', type: 'Playoff' },
                  { op: 'Westside Prep', team: 'JV Tennis', date: 'Oct 28', time: '09:00', type: 'Friendly' },
                  { op: 'Lincoln High', team: 'JV Soccer', date: 'Nov 02', time: '14:00', type: 'League' }
                ].map((fix, i) => (
                  <div key={i} className="flex gap-4 items-stretch p-3 rounded-xl border border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                    <div className="w-16 rounded-lg bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-pitch-dark dark:text-white shrink-0 shadow-inner group-hover:bg-pitch-lime group-hover:text-pitch-dark transition-colors">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{fix.date.split(' ')[0]}</span>
                       <span className="text-xl font-black leading-none mt-1">{fix.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="font-bold dark:text-white text-sm group-hover:text-blue-500 transition-colors">{fix.op}</div>
                      <div className="text-xs text-gray-500 font-medium">{fix.team} • {fix.time}</div>
                    </div>
                    <div className="flex items-center">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${fix.type === 'Playoff' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>{fix.type}</span>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">View Master Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

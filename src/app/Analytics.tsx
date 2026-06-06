import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Target, TrendingUp, Trophy, Calendar, User, Download, Loader2 } from 'lucide-react';

const TEAM_DATA = [
  {
    subject: 'Tactical Awareness',
    currentTeam: 85,
    historicalBenchmark: 70,
    fullMark: 100,
  },
  {
    subject: 'Pass Completion',
    currentTeam: 90,
    historicalBenchmark: 82,
    fullMark: 100,
  },
  {
    subject: 'High Press Success',
    currentTeam: 78,
    historicalBenchmark: 65,
    fullMark: 100,
  },
  {
    subject: 'Transitions',
    currentTeam: 88,
    historicalBenchmark: 75,
    fullMark: 100,
  },
  {
    subject: 'Set Pieces',
    currentTeam: 60,
    historicalBenchmark: 68,
    fullMark: 100,
  },
  {
    subject: 'Physical Conditioning',
    currentTeam: 95,
    historicalBenchmark: 80,
    fullMark: 100,
  },
];

const ATTENDANCE_DATA = [
  { session: 'Oct 10', rate: 92 },
  { session: 'Oct 14', rate: 88 },
  { session: 'Oct 17', rate: 100 },
  { session: 'Oct 21', rate: 95 },
];

const PLAYER_GROWTH_DATA = [
  { month: 'May', passCompletion: 78, tacticalAwareness: 65, physicalConditioning: 80 },
  { month: 'Jun', passCompletion: 80, tacticalAwareness: 68, physicalConditioning: 82 },
  { month: 'Jul', passCompletion: 82, tacticalAwareness: 72, physicalConditioning: 85 },
  { month: 'Aug', passCompletion: 85, tacticalAwareness: 76, physicalConditioning: 88 },
  { month: 'Sep', passCompletion: 88, tacticalAwareness: 80, physicalConditioning: 90 },
  { month: 'Oct', passCompletion: 92, tacticalAwareness: 85, physicalConditioning: 95 },
];

export default function Analytics({ role }: { role?: 'admin' | 'owner' | 'coach' | 'parent' | 'school' }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetch
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const handleExportCSV = () => {
        const headers = ["Month", "Pass Completion", "Tactical Awareness", "Physical Conditioning"];
        const rows = PLAYER_GROWTH_DATA.map(d => `${d.month},${d.passCompletion},${d.tacticalAwareness},${d.physicalConditioning}`);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "player_growth_stats.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full p-12">
                 <Loader2 className="animate-spin text-pitch-lime" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-pitch-dark dark:text-white mb-2">Performance Analytics</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {role === 'owner' ? 'Global Elite Academy Network vs Historical Seasonal Benchmarks (2020-2025)' : 'Pangkalpinang FC U15 Boys vs Historical Seasonal Benchmarks (2020-2025)'}
                    </p>
                </div>
                {(role === 'coach' || role === 'school' || role === 'admin') && (
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-transform">
                        <Download size={16} /> Export to CSV
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-pitch-dark dark:text-white">Team DNA Radar</h3>
                        <div className="flex gap-4 text-sm font-medium">
                            <div className="flex items-center gap-2 dark:text-gray-300">
                                <span className="w-3 h-3 rounded-full bg-pitch-lime border border-gray-300 dark:border-gray-600"></span>
                                Current Team
                            </div>
                            <div className="flex items-center gap-2 dark:text-gray-300">
                                <span className="w-3 h-3 rounded-full bg-pitch-dark dark:bg-gray-400"></span>
                                Hist. Benchmark
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[500px] mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={TEAM_DATA}>
                                <PolarGrid stroke="#e5e7eb" className="dark:opacity-50" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 13, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Radar 
                                    name="Historical Benchmark" 
                                    dataKey="historicalBenchmark" 
                                    stroke="#0D2D1B" 
                                    fill="#0D2D1B" 
                                    fillOpacity={0.1} 
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                />
                                <Radar 
                                    name="Current Team (26/27)" 
                                    dataKey="currentTeam" 
                                    stroke="#85b200" 
                                    fill="#C6FF00" 
                                    fillOpacity={0.6} 
                                    strokeWidth={3}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 600 }}
                                />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-pitch-dark dark:text-white">Recent Attendance Rate</h3>
                        </div>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ATTENDANCE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                                    <XAxis dataKey="session" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip 
                                        cursor={{ fill: '#f3f4f6', className: 'dark:opacity-10' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="rate" fill="#0D2D1B" radius={[4, 4, 0, 0]} name="Attendance Rate" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4 text-pitch-dark dark:text-gray-300">
                            <Target className="text-pitch-lime" />
                            <h4 className="font-semibold">Key Improvement Area</h4>
                        </div>
                        <div className="text-4xl font-bold text-pitch-dark dark:text-white mb-2">Set Pieces</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current team is performing 8 points below the academy benchmark. Recommend scheduling dedicated set-piece routines this week.</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4 text-pitch-dark dark:text-gray-300">
                            <Trophy className="text-pitch-lime" />
                            <h4 className="font-semibold">Strongest Attribute</h4>
                        </div>
                        <div className="text-4xl font-bold text-pitch-dark dark:text-white mb-2">Conditioning</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Exceptional physical metrics. Team is operating at +15% capacity compared to historical U15 squads.</p>
                    </div>

                    <div className="bg-pitch-dark p-6 rounded-xl shadow-sm border border-pitch-dark text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-pitch-lime" />
                            <h4 className="font-semibold">AI Insight</h4>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            "The radar pattern indicates a highly energetic, pressing-oriented squad with slight vulnerabilities in dead-ball situations. The high physical conditioning correlates directly with the elevated High Press and Transition scores."
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <User className="text-pitch-dark dark:text-gray-300" />
                        <h3 className="font-semibold text-lg text-pitch-dark dark:text-white">Individual Player Growth</h3>
                    </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tracking key skill development over the last 6 months for selected player: <strong>Marcus Rashford Jr.</strong></p>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PLAYER_GROWTH_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                            <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[50, 100]} tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Line type="monotone" name="Pass Completion" dataKey="passCompletion" stroke="#85b200" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" name="Tactical Awareness" dataKey="tacticalAwareness" stroke="#0D2D1B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" name="Physical Conditioning" dataKey="physicalConditioning" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

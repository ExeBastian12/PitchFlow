import { useState, useEffect } from 'react';
import { Users, UserPlus, FileText, Phone, Trash2, Edit2, Download, Loader2, Sparkles, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface PlayerProfile {
    id: string;
    name: string;
    shirtNumber: string;
    position: string;
    parentName: string;
    emergencyContact: string;
    medicalNotes: string;
    status: 'Available' | 'Injured' | 'Suspended';
    returnDate?: string;
    skills?: { subject: string; A: number; fullMark: number }[];
}

const MOCK_ROSTER: PlayerProfile[] = [
    { id: '1', name: 'Marcus Rashford Jr.', shirtNumber: '10', position: 'Forward', parentName: 'Sarah Rashford', emergencyContact: '555-0101', medicalNotes: 'None', status: 'Available', skills: [
        { subject: 'Pace', A: 85, fullMark: 100 },
        { subject: 'Shooting', A: 90, fullMark: 100 },
        { subject: 'Passing', A: 75, fullMark: 100 },
        { subject: 'Dribbling', A: 88, fullMark: 100 },
        { subject: 'Defending', A: 40, fullMark: 100 },
        { subject: 'Physical', A: 70, fullMark: 100 },
    ] },
    { id: '2', name: 'Leo Messi Jr.', shirtNumber: '9', position: 'Forward', parentName: 'Antonella Messi', emergencyContact: '555-0102', medicalNotes: 'Slight hamstring pull last month', status: 'Injured', returnDate: '2023-11-15', skills: [
        { subject: 'Pace', A: 80, fullMark: 100 },
        { subject: 'Shooting', A: 95, fullMark: 100 },
        { subject: 'Passing', A: 95, fullMark: 100 },
        { subject: 'Dribbling', A: 98, fullMark: 100 },
        { subject: 'Defending', A: 35, fullMark: 100 },
        { subject: 'Physical', A: 60, fullMark: 100 },
    ] },
];

export default function TeamRoster() {
    const [roster, setRoster] = useState<PlayerProfile[]>(MOCK_ROSTER);
    const [isAdding, setIsAdding] = useState(false);
    const [newPlayer, setNewPlayer] = useState<Partial<PlayerProfile>>({ status: 'Available' });
    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<{ lineup?: string[], explanation?: string } | null>(null);
    const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerateRecommendations = async () => {
        setIsGeneratingRecs(true);
        try {
            const response = await fetch('/api/suggest-lineup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roster: roster })
            });
            const data = await response.json();
            setRecommendations(data);
        } catch(e) {
            console.error(e);
            alert("Failed to get recommendations.");
        }
        setIsGeneratingRecs(false);
    };

    const handleAdd = () => {
        if (newPlayer.name && newPlayer.emergencyContact) {
            const defaultSkills = [
                { subject: 'Pace', A: Math.round(50 + Math.random() * 30), fullMark: 100 },
                { subject: 'Shooting', A: Math.round(50 + Math.random() * 30), fullMark: 100 },
                { subject: 'Passing', A: Math.round(50 + Math.random() * 30), fullMark: 100 },
                { subject: 'Dribbling', A: Math.round(50 + Math.random() * 30), fullMark: 100 },
                { subject: 'Defending', A: Math.round(50 + Math.random() * 30), fullMark: 100 },
                { subject: 'Physical', A: Math.round(50 + Math.random() * 30), fullMark: 100 },
            ];
            setRoster([...roster, { ...newPlayer, id: Math.random().toString(), skills: defaultSkills } as PlayerProfile]);
            setIsAdding(false);
            setNewPlayer({});
        }
    };

    const handleDelete = (id: string) => {
        setRoster(roster.filter(p => p.id !== id));
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Position", "Parent Name", "Emergency Contact", "Medical Notes"];
        const rows = roster.map(p => `${p.id},${p.name},${p.position},${p.parentName},${p.emergencyContact},${p.medicalNotes}`);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "team_roster.csv");
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
        <div className="p-8 max-w-[1200px] mx-auto space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-pitch-dark dark:text-white mb-2">Team Roster</h2>
                    <p className="text-gray-500">Manage squad profiles and emergency contacts.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleGenerateRecommendations} disabled={isGeneratingRecs} className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform disabled:opacity-50">
                        {isGeneratingRecs ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        AI Recommendations
                    </button>
                    <button onClick={handleExportCSV} className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-pitch-dark dark:text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-transform">
                        <UserPlus size={16} /> Add Player
                    </button>
                </div>
            </div>

            {recommendations && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-6 rounded-2xl mb-8 flex gap-4">
                    <div className="p-3 bg-indigo-500 text-white rounded-xl shrink-0 h-fit">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg mb-2">AI Starting Lineup Suggestion</h3>
                        <p className="text-indigo-800 dark:text-indigo-200 text-sm mb-4 leading-relaxed">{recommendations.explanation}</p>
                        <div className="flex flex-wrap gap-2">
                            {recommendations.lineup?.map(name => (
                                <span key={name} className="px-3 py-1 bg-white dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full border border-indigo-100 dark:border-indigo-700 shadow-sm">{name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-pitch-lime mb-8">
                    <h3 className="font-bold text-lg mb-4 text-pitch-dark dark:text-white">Add New Player Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Player Name" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} value={newPlayer.name || ''} />
                        <div className="flex gap-2">
                            <input type="text" placeholder="No." className="p-3 w-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewPlayer({...newPlayer, shirtNumber: e.target.value})} value={newPlayer.shirtNumber || ''} />
                            <input type="text" placeholder="Position" className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewPlayer({...newPlayer, position: e.target.value})} value={newPlayer.position || ''} />
                        </div>
                        <input type="text" placeholder="Parent Name" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewPlayer({...newPlayer, parentName: e.target.value})} value={newPlayer.parentName || ''} />
                        <input type="text" placeholder="Emergency Contact" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewPlayer({...newPlayer, emergencyContact: e.target.value})} value={newPlayer.emergencyContact || ''} />
                        <input type="text" placeholder="Medical Notes" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white md:col-span-2" onChange={e => setNewPlayer({...newPlayer, medicalNotes: e.target.value})} value={newPlayer.medicalNotes || ''} />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancel</button>
                        <button onClick={handleAdd} className="px-6 py-2 bg-pitch-dark text-white rounded-lg text-sm font-bold">Save Profile</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roster.map(player => (
                    <div key={player.id} className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-colors hover:border-pitch-lime/50">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-pitch-dark dark:text-white tracking-tight uppercase flex items-center gap-2">
                                        {player.name}
                                        {player.status === 'Injured' && <span className="px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] rounded-full uppercase tracking-wider">Injured</span>}
                                        {player.status === 'Suspended' && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] rounded-full uppercase tracking-wider">Suspended</span>}
                                        {player.status === 'Available' && <span className="px-2 py-0.5 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px] rounded-full uppercase tracking-wider">Available</span>}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-bold text-gray-500 mr-1">#{player.shirtNumber || '00'}</span>
                                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-1 rounded inline-block">{player.position}</span>
                                        {player.returnDate && <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Activity size={12}/> Return: {player.returnDate}</span>}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(player.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <p className="flex items-center gap-2"><Users size={16} className="text-pitch-lime" /> Parent: <strong className="dark:text-white">{player.parentName}</strong></p>
                                <p className="flex items-center gap-2"><Phone size={16} className="text-blue-500" /> Emergency: <strong className="dark:text-white">{player.emergencyContact}</strong></p>
                                <p className="flex items-center gap-2"><FileText size={16} className="text-red-500" /> Medical: <span className="italic">{player.medicalNotes}</span></p>
                            </div>
                        </div>
                        {player.skills && (
                            <div className="mt-6 h-48 w-full border-t border-gray-100 dark:border-gray-800 pt-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Skill Development</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={player.skills}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Skills" dataKey="A" stroke="#84cc16" fill="#84cc16" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

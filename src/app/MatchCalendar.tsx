import { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle2, Clock, Loader2, RefreshCw } from 'lucide-react';
import { initAuth, googleSignIn, getAccessToken } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface Match {
    id: string;
    opponent: string;
    date: string;
    time: string;
    location: string;
    status: 'upcoming' | 'completed';
    result?: string;
}

const MOCK_MATCHES: Match[] = [
    { id: '1', opponent: 'Westside Eagles', date: 'Oct 24, 2026', time: '10:00 AM', location: 'Home Ground', status: 'upcoming' },
    { id: '2', opponent: 'City Strikers', date: 'Oct 17, 2026', time: '14:00 PM', location: 'City Stadium', status: 'completed', result: 'Won 3-1' },
];

export default function MatchCalendar() {
    const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
    const [isAdding, setIsAdding] = useState(false);
    const [newMatch, setNewMatch] = useState<Partial<Match>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [needsAuth, setNeedsAuth] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        
        const unsubscribe = initAuth(
            () => setNeedsAuth(false),
            () => setNeedsAuth(true)
        );
        
        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    const handleLoginAndSync = async () => {
        try {
            await googleSignIn();
            setNeedsAuth(false);
            handleSync();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncSuccess(false);
        
        const token = await getAccessToken();
        if (!token) {
            setNeedsAuth(true);
            setIsSyncing(false);
            return;
        }

        try {
            const upcomingMatches = matches.filter(m => m.status === 'upcoming');
            
            for (const match of upcomingMatches) {
                // Parse date "Oct 24, 2026" and time "10:00 AM" into ISO format
                // Mock implementation for simplicity, assuming upcoming matches are in future
                const startTime = new Date(`${match.date} ${match.time}`);
                if(isNaN(startTime.getTime())) continue; // fallback
                const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours
                
                const event = {
                    summary: `Match vs ${match.opponent}`,
                    location: match.location,
                    description: 'Team match scheduled in PitchFlow.',
                    start: {
                        dateTime: startTime.toISOString(),
                    },
                    end: {
                        dateTime: endTime.toISOString(),
                    }
                };

                await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event)
                });
            }
            
            setSyncSuccess(true);
            setTimeout(() => setSyncSuccess(false), 3000);
        } catch(e) {
            console.error("Failed to sync matches", e);
            alert("Failed to sync matches to Google Calendar.");
        }
        setIsSyncing(false);
    };

    const handleAdd = () => {
        if (newMatch.opponent && newMatch.date) {
            setMatches([{ ...newMatch, id: Math.random().toString(), status: 'upcoming' } as Match, ...matches]);
            setIsAdding(false);
            setNewMatch({});
        }
    };

    const registerResult = (id: string, resultString: string) => {
        setMatches(matches.map(m => m.id === id ? { ...m, status: 'completed', result: resultString } : m));
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
                    <h2 className="text-3xl font-bold text-pitch-dark dark:text-white mb-2">Match Calendar</h2>
                    <p className="text-gray-500">View upcoming fixtures and register match results.</p>
                </div>
                <div className="flex gap-3">
                    {needsAuth ? (
                        <button onClick={handleLoginAndSync} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
                            <Calendar size={16} /> Sign in to Sync
                        </button>
                    ) : (
                        <button onClick={handleSync} disabled={isSyncing} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors ${syncSuccess ? 'bg-green-500 text-white' : 'border border-gray-200 dark:border-gray-700 text-pitch-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : (syncSuccess ? <CheckCircle2 size={16} /> : <RefreshCw size={16} />)}
                            {syncSuccess ? 'Synced!' : 'Sync to Calendar'}
                        </button>
                    )}
                    <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-transform">
                        <Calendar size={16} /> Schedule
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-pitch-lime mb-8">
                    <h3 className="font-bold text-lg mb-4 text-pitch-dark dark:text-white">Schedule New Match</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Opponent Team" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewMatch({...newMatch, opponent: e.target.value})} />
                        <input type="text" placeholder="Location" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewMatch({...newMatch, location: e.target.value})} />
                        <input type="date" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
                        <input type="time" className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white text-sm" onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancel</button>
                        <button onClick={handleAdd} className="px-6 py-2 bg-pitch-dark text-white rounded-lg text-sm font-bold">Save Fixture</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {matches.map(match => (
                    <div key={match.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white ${match.status === 'completed' ? 'bg-gray-400' : 'bg-pitch-dark dark:bg-pitch-lime dark:text-pitch-dark'}`}>
                                <span className="text-xs font-bold uppercase tracking-widest">{match.date.split(' ')[0]}</span>
                                <span className="text-xl font-black">{match.date.split(' ')[1].replace(',', '')}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-pitch-dark dark:text-white uppercase tracking-tight">vs {match.opponent}</h3>
                                <div className="flex items-center gap-4 text-sm font-bold text-gray-500 mt-2">
                                    <span className="flex items-center gap-1"><Clock size={16} /> {match.time}</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {match.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {match.status === 'upcoming' ? (
                                <button onClick={() => {
                                    const res = prompt("Enter match result (e.g., 'Won 2-1'):");
                                    if(res) registerResult(match.id, res);
                                }} className="px-4 py-2 border border-pitch-lime text-pitch-dark dark:text-pitch-lime font-bold text-sm rounded-lg hover:bg-pitch-lime hover:text-pitch-dark transition-colors flex items-center gap-2">
                                    <CheckCircle2 size={16}/> Register Result
                                </button>
                            ) : (
                                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-pitch-dark dark:text-white rounded-lg text-sm font-black uppercase tracking-widest">
                                    {match.result}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

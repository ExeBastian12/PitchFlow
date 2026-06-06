import { useState, useEffect, useRef } from 'react';
import { Calendar, Check, X, ShieldAlert, Clock, Smartphone, Printer, Trash2, Download, Undo, ArrowUp, ArrowDown, Filter, Save, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Drill, MOCK_DRILLS } from './DrillLibrary';

interface Player {
    id: string;
    name: string;
    parentName: string;
    status: 'present' | 'absent' | 'late' | 'unmarked';
    notes?: string;
    position?: string;
}

export default function Attendance() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
    const [planNotes, setPlanNotes] = useState(() => localStorage.getItem('pitchflow_notes') || '');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const isFirstRun = useRef(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late' | 'unmarked'>('all');
    
    const [pastStates, setPastStates] = useState<Player[][]>([]);
    
    const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('All');
    
    // Notes Popover
    const [notePopoverPlayerId, setNotePopoverPlayerId] = useState<string | null>(null);
    const [popoverNoteValue, setPopoverNoteValue] = useState('');
    
    const handleOpenPopover = (player: Player) => {
        setNotePopoverPlayerId(player.id);
        setPopoverNoteValue(player.notes || '');
    };
    
    const handleSavePopoverNote = () => {
        if (notePopoverPlayerId) {
            setPlayers(prev => prev.map(p => p.id === notePopoverPlayerId ? { ...p, notes: popoverNoteValue } : p));
        }
        setNotePopoverPlayerId(null);
    };

    const recommendedDrills = MOCK_DRILLS.filter(drill => {
        // Filter by position
        if (selectedPositionFilter !== 'All' && !drill.tags.includes(selectedPositionFilter)) {
            return false;
        }
        return true;
    }).map(drill => {
        // Check objective match (naive keyword match from planNotes)
        const isObjectiveMatch = (planNotes.toLowerCase().includes('press') && drill.tags.includes('Pressing')) || (planNotes.toLowerCase().includes('finishing') && drill.tags.includes('Shooting'));
        return { ...drill, isObjectiveMatch };
    }).sort((a, b) => b.isObjectiveMatch ? 1 : -1);

    const positions = ['All', 'Goalkeeper', 'Defending', 'Midfielder', 'Forward'];

    const movePlayer = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === players.length - 1) return;
        
        setPastStates(prev => [...prev, players]);
        const newPlayers = [...players];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newPlayers[index], newPlayers[swapIndex]] = [newPlayers[swapIndex], newPlayers[index]];
        setPlayers(newPlayers);
    };

    const handleUndo = () => {
        if (pastStates.length === 0) return;
        const previousState = pastStates[pastStates.length - 1];
        setPastStates(prev => prev.slice(0, -1));
        setPlayers(previousState);
    };
    
    const [players, setPlayers] = useState<Player[]>(() => {
        const saved = localStorage.getItem('pitchflow_attendance');
        if (saved) return JSON.parse(saved);
        return [
            { id: '1', name: 'Marcus Rashford Jr.', parentName: 'Sarah Rashford', status: 'unmarked', position: 'Forward' },
            { id: '2', name: 'Leo Messi Jr.', parentName: 'Antonella Messi', status: 'unmarked', position: 'Forward' },
            { id: '3', name: 'Phil Foden II', parentName: 'Rebecca Foden', status: 'unmarked', position: 'Midfielder' },
            { id: '4', name: 'Jude Bellingham Jr.', parentName: 'Denise Bellingham', status: 'unmarked', position: 'Midfielder' },
            { id: '5', name: 'Ederson Jr.', parentName: 'Ederson', status: 'unmarked', position: 'Goalkeeper' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('pitchflow_attendance', JSON.stringify(players));
    }, [players]);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        setSaveStatus('saving');
        const timeout = setTimeout(() => {
            localStorage.setItem('pitchflow_notes', planNotes);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [planNotes]);

    const presentCount = players.filter(p => p.status === 'present' || p.status === 'late').length;
    const totalCount = players.length;
    const attendanceRate = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);

    const [notificationLog, setNotificationLog] = useState<{message: string, time: Date}[]>([]);
    
    // Check if offline
    const [isOfflineNative, setIsOfflineNative] = useState(!navigator.onLine);
    const [forceOffline, setForceOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOfflineNative(false);
            setSaveStatus('saving');
            const savedPlayers = localStorage.getItem('pitchflow_attendance');
            fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: savedPlayers || '[]'
            }).then(() => {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }).catch(err => {
                console.error("Sync failed:", err);
                setSaveStatus('idle');
            });
        };
        const handleOffline = () => setIsOfflineNative(true);
        const handleForceOffline = (e: Event) => {
            const customEvent = e as CustomEvent;
            setForceOffline(customEvent.detail);
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('force-offline-change', handleForceOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('force-offline-change', handleForceOffline);
        }
    }, []);

    const isOffline = isOfflineNative || forceOffline;

    const markAttendance = (id: string, newStatus: 'present' | 'absent' | 'late') => {
        setPlayers(prev => prev.map(p => {
            if (p.id === id) {
                // Determine if we need to send a notification (state changed purely for demo)
                if (p.status !== newStatus) {
                    triggerPushNotification(p.name, p.parentName, newStatus);
                }
                return { ...p, status: newStatus };
            }
            return p;
        }));
    };

    const markAllPresent = () => {
        setPastStates(prev => [...prev, players]);
        setPlayers(prev => prev.map(p => p.status === 'unmarked' ? { ...p, status: 'present' } : p));
    };

    const counts = {
        present: players.filter(p => p.status === 'present').length,
        absent: players.filter(p => p.status === 'absent').length,
        late: players.filter(p => p.status === 'late').length,
        unmarked: players.filter(p => p.status === 'unmarked').length,
    };

    const triggerPushNotification = (playerName: string, parentName: string, status: string) => {
        let statusString = status === 'present' ? 'arrived safely' : status === 'absent' ? 'been marked absent' : 'arrived late';
        const msg = `Push Notification sent to ${parentName}: "${playerName} has ${statusString} for training."`;
        setNotificationLog(prev => [{message: msg, time: new Date()}, ...prev]);
        
        // Simulating actual system notification API (this just uses regular browser alerts if allowed, or our mock UI)
        if (!isOffline && "Notification" in window && Notification.permission === "granted") {
            new Notification("PitchFlow Attendance", {
                body: `${playerName} has ${statusString} for training.`
            });
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [includePlayerNotes, setIncludePlayerNotes] = useState(true);

    const handleEmailAbsent = () => {
        const absentPlayers = players.filter(p => p.status === 'absent');
        if (absentPlayers.length === 0) {
            alert('No players are marked as absent.');
            return;
        }
        const names = absentPlayers.map(p => p.name).join(', ');
        const subject = encodeURIComponent('Training Absence Notification');
        const body = encodeURIComponent(`Hello,\n\nThe following players have been marked as absent for today's training session:\n\n${names}\n\nPlease follow up regarding their attendance.\n\nBest,\nCoach`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(20, 20, 20); // Dark text
        doc.text("PitchFlow Session Summary", 14, 22);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date: Oct 24, 2026 | Squad: Pangkalpinang FC U15 Boys | Duration: 90 mins`, 14, 30);
        
        let finalY = 40;
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Drill List:", 14, finalY);
        doc.setFontSize(11);
        doc.text("1. Dynamic Warmup & Activation (15 mins)\n2. High-Press Rondo (20 mins)\n3. Phase of Play: Build-up vs High Press (30 mins)\n4. 11v11 Scrimmage (25 mins)", 14, finalY + 8);
        finalY += 40;

        // Notes
        if (planNotes) {
            doc.setFontSize(14);
            doc.setTextColor(50, 50, 50);
            doc.text("Training Profile & Notes:", 14, finalY);
            doc.setFontSize(11);
            const splitNotes = doc.splitTextToSize(planNotes, 180);
            doc.text(splitNotes, 14, finalY + 8);
            finalY = finalY + 8 + (splitNotes.length * 6) + 10;
        }

        // Table
        const tableColumn = ["Player Name", "Parent Contact", "Final Status"];
        if (includePlayerNotes) tableColumn.push("Notes");
        const tableRows: string[][] = [];

        players.forEach(player => {
            const rowData = [
                player.name,
                player.parentName,
                player.status.charAt(0).toUpperCase() + player.status.slice(1)
            ];
            if (includePlayerNotes) {
                // @ts-ignore
                rowData.push(player.notes || "");
            }
            tableRows.push(rowData);
        });

        // @ts-ignore
        doc.autoTable({
            startY: finalY,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [198, 255, 0], textColor: [20, 20, 20] } // Pitch lime header
        });

        doc.save("PitchFlow_Session_Summary.pdf");
    };

    const handleCopyLastSession = () => {
        const lastSessionText = "Previous Session:\nDrill: High Press Transition\nDuration: 14:00\nDescription: Pangkalpinang FC U15 Boys - Tactical adjustments for pressing triggers.";
        setPlanNotes(prev => prev + (prev ? '\n\n' : '') + lastSessionText);
    };

    const handleSummarizeObjectives = () => {
        const drillMatches = [...planNotes.matchAll(/Drill:\s*(.*)/g)];
        const titles = drillMatches.map(m => m[1].trim());
        if (titles.length > 0) {
            const summary = `Session Objectives: Focus on ${titles.join(', ')}.`;
            setPlanNotes(prev => `${summary}\n\n${prev}`);
        } else {
            alert('No drills found in the plan notes to summarize.');
        }
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
            <div className="flex justify-between items-center mb-8">
                <div>
                     <h2 className="text-3xl font-bold text-pitch-dark dark:text-white mb-2">Session Attendance</h2>
                     <p className="text-gray-500">Pangkalpinang FC U15 Boys â Tuesday Training</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleCopyLastSession} className="print:hidden flex items-center gap-2 border border-pitch-lime text-pitch-lime hover:bg-pitch-lime hover:text-pitch-dark px-4 py-2 rounded-md transition-colors text-sm font-semibold">
                        <Calendar size={18} />
                        <span className="hidden lg:inline">Copy Session From Last Week</span>
                    </button>
                    {isOffline ? (
                        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 text-sm font-medium print:hidden">
                            <ShieldAlert size={16} />
                            <span className="hidden sm:inline">Offline Mode Active</span>
                        </div>
                    ) : (
                         <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 text-sm font-medium print:hidden">
                            <Check size={16} />
                            <span>Online</span>
                        </div>
                    )}
                    {pastStates.length > 0 && (
                        <button onClick={handleUndo} className="print:hidden flex items-center gap-2 bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-pitch-dark dark:text-white transition-colors">
                            <Undo size={18} />
                            <span className="hidden md:inline">Undo Action</span>
                        </button>
                    )}
                    <label className="print:hidden flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        <input type="checkbox" checked={includePlayerNotes} onChange={e => setIncludePlayerNotes(e.target.checked)} className="rounded text-pitch-lime focus:ring-pitch-lime" />
                        Include Notes
                    </label>
                    <button onClick={handleExportPDF} className="print:hidden flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-pitch-dark dark:text-white">
                        <Download size={18} />
                        <span className="hidden md:inline">Export Plan PDF</span>
                    </button>
                    <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-pitch-dark dark:text-white">
                        <Printer size={18} />
                        <span className="hidden md:inline">Print Plan</span>
                    </button>
                    <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Calendar size={18} />
                        <span>Oct 24, 2026</span>
                    </button>
                    <button onClick={() => Notification.requestPermission()} className="print:hidden flex items-center gap-2 border border-pitch-dark dark:border-white text-pitch-dark dark:text-white px-4 py-2 rounded-md hover:bg-pitch-dark dark:hover:bg-white hover:text-white dark:hover:text-pitch-dark transition-colors">
                        <Smartphone size={18} />
                        <span className="hidden sm:inline">Enable Real Push</span>
                    </button>
                </div>
            </div>

            <div className="mb-8 relative">
                <div className="flex justify-between items-end mb-3">
                    <h3 className="text-xl font-semibold text-pitch-dark dark:text-white">Training Plan Notes</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSummarizeObjectives} className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md transition-colors">Summarize Objectives</button>
                        <div className="text-xs font-medium flex items-center gap-1 min-w-[80px] justify-end">
                            {saveStatus === 'saving' && <span className="text-gray-500 animate-pulse">Saving...</span>}
                            {saveStatus === 'saved' && <span className="text-green-600 flex items-center gap-1"><Save size={12}/> Saved</span>}
                        </div>
                    </div>
                </div>
                <textarea 
                    value={planNotes}
                    onChange={e => setPlanNotes(e.target.value)}
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const data = e.dataTransfer.getData('text/plain');
                        if (data) {
                            setPlanNotes(prev => prev + (prev ? '\n\n' : '') + data);
                        }
                    }}
                    className="w-full h-32 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-sans text-sm outline-none focus:border-pitch-lime resize-none print:border-none print:p-0 print:h-auto print:bg-transparent"
                    placeholder="Enter drills to focus on, session objectives, or general coach notes..."
                ></textarea>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-2">
                     <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                         <div className="flex items-center gap-2 text-sm font-medium flex-wrap">
                             <Filter size={16} className="text-gray-500"/>
                             <span className="text-gray-600 dark:text-gray-300 mr-2">Filter by Status:</span>
                             {(['all', 'present', 'absent', 'late', 'unmarked'] as const).map(status => (
                                 <button 
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 rounded-full capitalize transition-colors ${statusFilter === status ? 'bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                                 >
                                     {status}
                                 </button>
                             ))}
                             <div className="hidden lg:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                             <div className="flex items-center gap-3 text-xs">
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Present</span>
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Absent</span>
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Late</span>
                                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Unmarked</span>
                             </div>
                         </div>
                         <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                             <input 
                                 type="text"
                                 placeholder="Search players..."
                                 value={searchQuery}
                                 onChange={e => setSearchQuery(e.target.value)}
                                 className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md text-sm outline-none focus:border-pitch-lime bg-white dark:bg-gray-800 dark:text-white min-w-[200px]"
                             />
                             <button onClick={handleEmailAbsent} className="px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                                 Email Absent
                             </button>
                         </div>
                     </div>
                     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="p-4">Player</th>
                                        <th className="p-4">Parent Contact</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-right print:hidden">
                                            <button onClick={markAllPresent} className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-md text-xs font-bold transition-colors">
                                                Mark All Present
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {players.filter(p => (statusFilter === 'all' || p.status === statusFilter) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((player, index) => (
                                        <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="p-4 relative">
                                                <div className="font-semibold text-pitch-dark dark:text-white">{player.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">ID: PF-{player.id.padStart(4, '0')} {player.position && `• ${player.position}`}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                                {player.parentName}
                                            </td>
                                            <td className="p-4 text-center relative">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={player.status}
                                                        onClick={() => handleOpenPopover(player)}
                                                        className="cursor-pointer inline-block"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                                    >
                                                        {player.status === 'present' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"><Check size={12}/> Present</span>}
                                                        {player.status === 'absent' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"><X size={12}/> Absent</span>}
                                                        {player.status === 'late' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"><Clock size={12}/> Late</span>}
                                                        {player.status === 'unmarked' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Unmarked</span>}
                                                    </motion.div>
                                                </AnimatePresence>
                                                {notePopoverPlayerId === player.id && (
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg p-3 z-10 animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Session Notes</span>
                                                            <button onClick={() => setNotePopoverPlayerId(null)} className="text-gray-400 hover:text-gray-600"><X size={14}/></button>
                                                        </div>
                                                        <textarea 
                                                            autoFocus
                                                            value={popoverNoteValue}
                                                            onChange={e => setPopoverNoteValue(e.target.value)}
                                                            placeholder="Add notes..."
                                                            className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded resize-none h-16 outline-none focus:border-pitch-lime dark:bg-gray-900 dark:text-white"
                                                        />
                                                        <div className="flex justify-between mt-2 gap-2">
                                                            <button 
                                                               onClick={() => setPopoverNoteValue(prev => prev + (prev ? ' ' : '') + `[${new Date().toLocaleDateString()}]`)} 
                                                               className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-1"
                                                            >
                                                               Add Date
                                                            </button>
                                                            <button onClick={handleSavePopoverNote} className="flex-1 bg-pitch-dark text-white text-xs font-semibold py-1.5 rounded hover:bg-pitch-lime hover:text-pitch-dark transition-colors">Save</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-right print:hidden">
                                                <div className="flex items-center justify-end gap-2">
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => markAttendance(player.id, 'present')}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${player.status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400'}`}
                                                    >
                                                        <Check size={16} />
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => markAttendance(player.id, 'late')}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${player.status === 'late' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:text-yellow-600 dark:hover:text-yellow-400'}`}
                                                    >
                                                        <Clock size={16} />
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => markAttendance(player.id, 'absent')}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${player.status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400'}`}
                                                    >
                                                        <X size={16} />
                                                    </motion.button>
                                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                                    <button 
                                                        disabled={players.indexOf(player) === 0}
                                                        onClick={() => movePlayer(players.indexOf(player), 'up')}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 disabled:opacity-30"
                                                    >
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button 
                                                        disabled={players.indexOf(player) === players.length - 1}
                                                        onClick={() => movePlayer(players.indexOf(player), 'down')}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 disabled:opacity-30"
                                                    >
                                                        <ArrowDown size={16} />
                                                    </button>
                                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                                    <button 
                                                        onClick={() => setPlayerToDelete(player)}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 print:hidden text-sm">
                                    <tr>
                                        <td colSpan={2} className="p-4 font-semibold text-pitch-dark dark:text-white text-right">Session Totals:</td>
                                        <td colSpan={2} className="p-4">
                                            <div className="flex items-center justify-end md:justify-center gap-4 text-gray-600 dark:text-gray-300 flex-wrap">
                                                <span>Present: <span className="font-bold text-green-600">{counts.present}</span></span>
                                                <span>Absent: <span className="font-bold text-red-600">{counts.absent}</span></span>
                                                <span>Late: <span className="font-bold text-yellow-600">{counts.late}</span></span>
                                                <span>Unmarked: <span className="font-bold text-gray-500">{counts.unmarked}</span></span>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                     </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-lg text-pitch-dark dark:text-white mb-2">Session Summary</h3>
                        <div className="flex items-end justify-between">
                            <div className="text-4xl font-bold text-pitch-dark dark:text-white">{attendanceRate}%</div>
                            <div className="text-gray-500 text-sm mb-1">{presentCount} of {totalCount} players</div>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-pitch-lime h-full rounded-full transition-all duration-500" style={{ width: `${attendanceRate}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-pitch-dark rounded-xl p-6 shadow-sm text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone size={20} className="text-pitch-lime" />
                            <h3 className="font-semibold text-lg">Push Notification Log</h3>
                        </div>
                        <p className="text-sm text-gray-300 mb-6">When attendance is marked, parents receive real-time automated alerts.</p>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {notificationLog.length === 0 ? (
                                <div className="text-center text-sm text-gray-400 py-8 border border-dashed border-gray-600 rounded-lg">
                                    No notifications sent yet today.
                                </div>
                            ) : (
                                notificationLog.map((log, index) => (
                                    <div key={index} className="bg-white/10 p-3 rounded-lg border border-white/5 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="text-xs text-pitch-lime mb-1 font-mono">{log.time.toLocaleTimeString()}</div>
                                        <div className="text-sm shadow-sm">{log.message}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[500px]">
                        <div className="flex items-center gap-2 mb-4 shrink-0">
                            <FileText size={20} className="text-pitch-dark dark:text-white" />
                            <h3 className="font-semibold text-lg text-pitch-dark dark:text-white">Recommended Drills</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 shrink-0">Drag & drop drills into your training plan based on player positions or session objectives.</p>
                        
                        <div className="mb-4 shrink-0">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Filter by Position</label>
                            <select 
                                value={selectedPositionFilter} 
                                onChange={e => setSelectedPositionFilter(e.target.value)}
                                className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded p-2 outline-none focus:border-pitch-lime dark:text-white"
                            >
                                {positions.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {recommendedDrills.length === 0 ? (
                                <div className="text-center text-sm text-gray-400 py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                    No drills match your criteria.
                                </div>
                            ) : (
                                recommendedDrills.map(drill => (
                                    <div 
                                        key={drill.id} 
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', `Drill: ${drill.title}\nDuration: ${drill.duration}\nDescription: ${drill.description}\n`);
                                        }}
                                        className={`p-3 rounded-lg border bg-white dark:bg-gray-800 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${drill.isObjectiveMatch ? 'border-pitch-lime ring-1 ring-pitch-lime/20' : 'border-gray-100 dark:border-gray-700'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-sm text-pitch-dark dark:text-white">{drill.title}</h4>
                                            {drill.isObjectiveMatch && (
                                                <span className="text-[10px] font-bold bg-pitch-lime/20 text-pitch-dark dark:text-pitch-lime px-2 py-0.5 rounded-full">Objective Match</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{drill.description}</div>
                                        <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                                            <span>{drill.duration}</span>
                                            {drill.lastUsed && <span className="flex items-center gap-1"><Calendar size={10}/> {drill.lastUsed}</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {playerToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-3 dark:text-white">Remove Player?</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">Are you sure you want to remove <span className="font-semibold">{playerToDelete.name}</span> from the session? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setPlayerToDelete(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                            <button onClick={() => {
                                setPastStates(prev => [...prev, players]);
                                setPlayers(prev => prev.filter(p => p.id !== playerToDelete.id));
                                setPlayerToDelete(null);
                            }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

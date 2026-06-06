import React, { useState } from 'react';
import { Calendar, Users, Activity, Play, ActivityIcon, FileBox, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_EVENTS = [
    { id: 1, type: 'match', title: 'U15 vs Westside Eagles', date: '2023-11-20T10:00:00Z', time: 'Today, 10:00 AM', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', metrics: { goals: 2, possession: '55%', totalDistance: '112km' } },
    { id: 2, type: 'training', title: 'High-Press Transition', date: '2023-11-21T16:00:00Z', time: 'Tomorrow, 4:00 PM', icon: Activity, color: 'text-pitch-lime', bg: 'bg-pitch-dark dark:bg-gray-800', metrics: { intensity: 'High', duration: '90m', drillsCompleted: 4 } },
    { id: 3, type: 'update', title: 'New Drill Added: Rondo 4v2', date: '2023-11-19T09:00:00Z', time: 'Yesterday', icon: Play, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', metrics: { views: 12, rating: '4.8/5' } },
    { id: 4, type: 'attendance', title: 'Alex Johnson marked Out', date: '2023-11-20T08:00:00Z', time: '2 mins ago', icon: Users, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', metrics: { status: 'Injured', expectedReturn: '14 days' } }
];

export function ActivityFeed() {
    const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null);

    const exportToICS = (event: typeof MOCK_EVENTS[0]) => {
        const startDate = new Date(event.date);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration mock

        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatDate(startDate)}`,
            `DTEND:${formatDate(endDate)}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:PitchFlow Activity Export`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.hidden = true;
        a.href = url;
        a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-pitch-dark dark:text-white mb-6">Recent Activity</h3>
            {MOCK_EVENTS.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <FileBox size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">No recent activity detected.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {MOCK_EVENTS.map(event => (
                        <div key={event.id} onClick={() => setSelectedEvent(event)} className="flex gap-4 items-start group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 p-2 -mx-2 rounded-xl transition-colors">
                            <div className={`p-3 rounded-xl ${event.bg} ${event.color} shrink-0 mt-1 transition-transform group-hover:scale-110 shadow-sm`}>
                                <event.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-pitch-dark dark:text-white text-sm group-hover:text-pitch-lime transition-colors">{event.title}</h4>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{event.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedEvent && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${selectedEvent.bg} ${selectedEvent.color}`}>
                                        <selectedEvent.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight text-pitch-dark dark:text-white">{selectedEvent.title}</h3>
                                </div>
                                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20}/></button>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-800 mb-4">
                                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700 pb-2">Metrics Snapshot</p>
                                {Object.entries(selectedEvent.metrics).map(([key, val]) => (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                        <span className="capitalize text-gray-600 dark:text-gray-400 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="font-bold text-pitch-dark dark:text-white">{val}</span>
                                    </div>
                                ))}
                            </div>

                            <button onClick={(e) => { e.stopPropagation(); exportToICS(selectedEvent); }} className="w-full flex items-center justify-center gap-2 bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                                <Download size={18} /> Add to Calendar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

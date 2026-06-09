import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Play, Save, RefreshCw, FileText, CornerDownRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DraggablePlayer {
    id: string;
    number: string;
    x: number;
    y: number;
    group: 'teamA' | 'teamB' | 'ball';
}

const INITIAL_PLAYERS: DraggablePlayer[] = [
    { id: 'a1', number: '1', x: 10, y: 50, group: 'teamA' },
    { id: 'a2', number: '4', x: 30, y: 20, group: 'teamA' },
    { id: 'a3', number: '5', x: 30, y: 80, group: 'teamA' },
    { id: 'a4', number: '6', x: 60, y: 50, group: 'teamA' },
    { id: 'a5', number: '10', x: 80, y: 20, group: 'teamA' },
    { id: 'a6', number: '9', x: 80, y: 80, group: 'teamA' },
    { id: 'b1', number: '1', x: 90, y: 50, group: 'teamB' },
    { id: 'b2', number: '4', x: 70, y: 50, group: 'teamB' },
    { id: 'ball', number: '⚽', x: 50, y: 50, group: 'ball' }
];

export default function TacticalBoard() {
    const [players, setPlayers] = useState<DraggablePlayer[]>(INITIAL_PLAYERS);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (id: string, info: any) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        let newX = ((info.point.x - rect.left) / rect.width) * 100;
        let newY = ((info.point.y - rect.top) / rect.height) * 100;

        // restrict to bounds
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        setPlayers(prev => prev.map(p => p.id === id ? { ...p, x: newX, y: newY } : p));
    };

    const handleExportPDF = async () => {
        if (!containerRef.current) return;
        try {
            const canvas = await html2canvas(containerRef.current, { backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.setFontSize(20);
            pdf.text('Tactical Plan', 10, 20);
            pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 20);
            pdf.save('tactic_board.pdf');
        } catch(e) {
            console.error("Failed to generate PDF", e);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-pitch-dark dark:text-white uppercase tracking-tight">Tactical Board</h2>
                    <p className="text-gray-500 font-medium">Plan formations, set-pieces, and strategies.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setPlayers(INITIAL_PLAYERS)} className="p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                        <RefreshCw size={20} />
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                        <FileText size={18} /> Export PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                        <Save size={18} /> Save Tactic
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div 
                    ref={containerRef}
                    className="relative w-full aspect-[1.5/1] max-h-[70vh] bg-green-600 dark:bg-emerald-900 rounded-lg overflow-hidden border-4 border-white dark:border-gray-900 shadow-inner"
                    style={{
                        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 20%)`
                    }}
                >
                    {/* Pitch markings */}
                    <div className="absolute inset-4 border-2 border-white/60 dark:border-white/40"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/60 dark:bg-white/40 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/60 dark:border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-32 h-64 border-2 border-white/60 dark:border-white/40 -translate-y-1/2 border-l-0"></div>
                    <div className="absolute top-1/2 right-0 w-32 h-64 border-2 border-white/60 dark:border-white/40 -translate-y-1/2 border-r-0"></div>

                    {/* Players */}
                    {players.map(player => (
                        <motion.div
                            key={player.id}
                            drag
                            dragMomentum={false}
                            dragElastic={0}
                            whileHover={{ scale: 1.1 }}
                            whileDrag={{ scale: 1.2, zIndex: 100 }}
                            onDragEnd={(e, info) => handleDragEnd(player.id, info)}
                            className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center font-bold text-sm select-none cursor-grab active:cursor-grabbing shadow-lg
                                ${player.group === 'teamA' ? 'bg-white text-pitch-dark border-2 border-pitch-dark dark:border-white/20' : 
                                  player.group === 'teamB' ? 'bg-pitch-dark dark:bg-gray-900 text-white border-2 border-white dark:border-gray-600' : 
                                  'bg-pitch-lime text-black border-2 border-black/10'}`
                            }
                            style={{ 
                                left: `${player.x}%`, 
                                top: `${player.y}%`,
                                zIndex: player.group === 'ball' ? 50 : 10
                            }}
                        >
                            {player.number}
                        </motion.div>
                    ))}
                </div>
                
                <p className="text-center text-sm font-medium text-gray-500 mt-6 flex items-center justify-center gap-2">
                    <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><CornerDownRight size={16} /></motion.span>
                    Drag numbers to reposition players on the board.
                </p>
            </div>
        </div>
    );
}

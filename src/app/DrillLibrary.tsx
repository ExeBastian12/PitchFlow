import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Edit2, Play, Square, Save, Upload, Type, Circle, ArrowRight, Download, Link as LinkIcon, Star, Filter, Copy, Calendar, TrendingUp, Share2, Plus, PenTool, Printer, FileText, LayoutGrid, List, Trash2, Archive, CalendarDays, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { ConfirmDialog } from '../components/ConfirmDialog';

export interface Drill {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration: string;
  coach: string;
  timeAgo: string;
  imageIndex: number;
  difficulty?: string;
  rating?: number;
  externalUrl?: string;
  lastUsed?: string;
  isTrending?: boolean;
  usageHistory?: number[];
  status?: 'Draft' | 'Approved' | 'Archived';
}

export const MOCK_DRILLS: Drill[] = [
  { id: '1', title: 'High Press Transition', description: 'Pangkalpinang FC U15 Boys - Tactical adjustments for pressing triggers.', tags: ['Tactical', 'Pressing', 'Defending'], duration: '14:00', coach: 'Coach Barnes', timeAgo: '2 hours ago', imageIndex: 1, difficulty: 'Intermediate', rating: 4.8, lastUsed: '5 days ago', isTrending: true, usageHistory: [12, 19, 8, 24, 15, 30], status: 'Draft' },
  { id: '2', title: 'Playing Out from the Back', description: 'Sungailiat FC U15 Girls - Building attacks under pressure.', tags: ['Tactical', 'Possession', 'Goalkeeper'], duration: '35:00', coach: 'Coach Smith', timeAgo: '1 day ago', imageIndex: 2, difficulty: 'Advanced', rating: 4.9, lastUsed: '1 week ago', usageHistory: [5, 10, 15, 12, 20, 25], status: 'Approved' },
  { id: '3', title: 'Finishing Drills', description: 'Attackers - 1v1 and 2v1 situations.', tags: ['Technical', 'Shooting', 'Forward'], duration: '20:00', coach: 'Coach Davis', timeAgo: '2 days ago', imageIndex: 3, difficulty: 'Beginner', rating: 4.2, usageHistory: [20, 15, 22, 18, 30, 28], status: 'Draft' },
  { id: '4', title: 'Shuttle Runs & Sprints', description: 'Conditioning the team.', tags: ['Fitness', 'Conditioning'], duration: '15:00', coach: 'Coach Lee', timeAgo: '3 days ago', imageIndex: 4, difficulty: 'Intermediate', rating: 4.5, isTrending: false, usageHistory: [20, 10, 30, 10, 10, 15], status: 'Approved' }
];

export default function DrillLibrary() {
  const [drills, setDrills] = useState<Drill[]>(MOCK_DRILLS);
  const [newDrillTitle, setNewDrillTitle] = useState('');
  const [newDrillDescription, setNewDrillDescription] = useState('');
  const [newDrillTags, setNewDrillTags] = useState<string[]>([]);
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [newDrillDuration, setNewDrillDuration] = useState('');
  const [newDrillDifficulty, setNewDrillDifficulty] = useState('Beginner');
  const [mode, setMode] = useState<'view' | 'record' | 'annotate'>('view');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState<'all' | 'under15' | '15to30' | 'over30'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [linkMode, setLinkMode] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const [recommendForPosition, setRecommendForPosition] = useState(false);
  const [presentPositions, setPresentPositions] = useState<string[]>([]);
  const [printDrill, setPrintDrill] = useState<Drill | null>(null);

  // New states for Planner & Confirmation Dialog
  const [plannerMode, setPlannerMode] = useState(false);
  const [schedule, setSchedule] = useState<Record<string, Drill[]>>({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
  const [drillToDelete, setDrillToDelete] = useState<Drill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const q = query.toLowerCase();
    const idx = lowerText.indexOf(q);
    if (idx >= 0) {
        return (
            <>
                {text.substring(0, idx)}
                <span className="bg-pitch-lime/40 text-pitch-dark px-0.5 rounded">{text.substring(idx, idx + query.length)}</span>
                {text.substring(idx + query.length)}
            </>
        );
    }
    return text;
  };

  const handleExportPDF = (d: Drill, e: React.MouseEvent) => {
      e.stopPropagation();
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text(d.title, 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Coach: ${d.coach} | Duration: ${d.duration} | Difficulty: ${d.difficulty || 'N/A'}`, 20, 30);
      doc.setTextColor(0);
      doc.text(`Tags: ${d.tags.join(', ')}`, 20, 40);
      doc.text('Description:', 20, 50);
      const splitDesc = doc.splitTextToSize(d.description, 170);
      doc.text(splitDesc, 20, 60);
      doc.save(`${d.title.replace(/\s+/g, '_')}_Drill.pdf`);
  };

  useEffect(() => {
    const saved = localStorage.getItem('pitchflow_attendance');
    if (saved) {
        try {
            const players = JSON.parse(saved);
            const presentPlayers = players.filter((p: any) => p.status === 'present' && p.position);
            const positions = Array.from(new Set(presentPlayers.map((p: any) => p.position))) as string[];
            setPresentPositions(positions);
        } catch (e) {}
    }
  }, []);
  
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#C6FF00'); // Pitch Lime
  const [drawMode, setDrawMode] = useState<'free' | 'arrow' | 'circle'>('free');
  
  const handleStartCaptureClick = () => {
    setRecordedChunks([]);
    setIsRecording(true);
    if (webcamRef.current && webcamRef.current.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      });
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.start();
    }
  };

  const handleDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStopCaptureClick = () => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isRecording && recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setMode('annotate');
    }
  }, [isRecording, recordedChunks]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (drawMode === 'free') {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setVideoUrl(url);
          setMode('annotate');
      }
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Tags', 'Duration', 'Difficulty', 'Rating', 'Coach', 'Time Ago'];
    const rows = drills.map(d => [d.id, `"${d.title}"`, `"${d.description}"`, `"${d.tags.join(', ')}"`, d.duration, d.difficulty || 'N/A', d.rating || 'N/A', d.coach, d.timeAgo]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "drill_library.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseDurationToMins = (durationStr: string) => {
      if (!durationStr) return 0;
      if (durationStr.includes(':')) {
          const parts = durationStr.split(':');
          return parseInt(parts[0]) + parseInt(parts[1] || '0') / 60;
      }
      const match = durationStr.match(/(\d+)/);
      if (match) return parseInt(match[1]);
      return 0;
  };

  const allTags = Array.from(new Set(drills.flatMap(d => d.tags))) as string[];

  const toggleTag = (tag: string) => {
      if (activeTags.includes(tag)) {
          setActiveTags(activeTags.filter(t => t !== tag));
      } else {
          setActiveTags([...activeTags, tag]);
      }
  };

  const filteredDrills = drills
    .filter(d => activeTags.length > 0 ? activeTags.every(tag => d.tags.includes(tag)) : true)
    .filter(d => {
        if (!recommendForPosition) return true;
        if (presentPositions.length === 0) return true;
        return presentPositions.some(pos => d.tags.includes(pos));
    })
    .filter(d => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!q) return true;
        
        const isFuzzyMatch = (text: string, query: string) => {
            let tIdx = 0;
            let qIdx = 0;
            const t = text.toLowerCase().replace(/[^a-z0-9]/g, '');
            while (tIdx < t.length && qIdx < query.length) {
                if (t[tIdx] === query[qIdx]) qIdx++;
                tIdx++;
            }
            return qIdx === query.length;
        };
        
        return isFuzzyMatch(d.title, q) || isFuzzyMatch(d.description, q) || d.tags.some(t => isFuzzyMatch(t, q));
    })
    .filter(d => {
        if (durationFilter === 'all') return true;
        const mins = parseDurationToMins(d.duration);
        if (durationFilter === 'under15') return mins < 15;
        if (durationFilter === '15to30') return mins >= 15 && mins <= 30;
        if (durationFilter === 'over30') return mins > 30;
        return true;
    })
    .filter(d => {
        if (difficultyFilter === 'all') return true;
        return d.difficulty === difficultyFilter;
    })
    .sort((a, b) => {
        if (sortBy === 'rating') {
            return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
    });

  const resetFilters = () => {
      setSearchQuery('');
      setActiveTags([]);
      setDurationFilter('all');
      setDifficultyFilter('all');
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-pitch-dark dark:text-white">Drill Library</h2>
        {mode === 'view' && (
          <div className="flex gap-4">
              <button 
                  onClick={() => setPlannerMode(!plannerMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${plannerMode ? 'bg-pitch-lime text-pitch-dark' : 'bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                  <CalendarDays size={20} />
                  <span className="hidden sm:inline">Schedule Planner</span>
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex"
                title="Export Drill Data"
              >
                  <Download size={20} />
                  <span>Export CSV</span>
              </button>
              {linkMode ? (
                  <div className="flex items-center gap-2">
                       <input autoFocus type="text" value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="YouTube/Vimeo URL" className="border border-gray-200 px-3 py-2 outline-none focus:border-pitch-lime rounded-md text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                       <button onClick={() => { if(linkInput) { setVideoUrl(linkInput); setMode('annotate'); setLinkMode(false); setLinkInput(''); } }} className="bg-pitch-dark text-white px-3 py-2 rounded-md shadow hover:bg-pitch-darker dark:border dark:border-gray-600 transition-colors text-sm font-semibold">Add</button>
                       <button onClick={() => setLinkMode(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-2 text-sm font-semibold">Cancel</button>
                  </div>
              ) : (
                  <button onClick={() => setLinkMode(true)} className="flex items-center gap-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <LinkIcon size={20} />
                      <span className="hidden sm:inline">Add Link</span>
                  </button>
              )}
              <label className="flex items-center gap-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 px-4 py-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Upload size={20} />
                  <span className="hidden sm:inline">Upload Video</span>
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
              </label>
            <button 
              onClick={() => setMode('record')}
              className="flex items-center gap-2 bg-pitch-dark text-white px-4 py-2 rounded-md hover:bg-pitch-darker transition-colors"
            >
              <Camera size={20} />
              <span className="hidden sm:inline">Record Drill</span>
            </button>
          </div>
        )}
      </div>

      {mode === 'view' && (
        <div className="flex flex-col lg:flex-row gap-8">
            {!plannerMode && (
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-pitch-dark dark:text-gray-200">Search</label>
                    <input 
                        type="text" 
                        placeholder="Search title, desc..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md outline-none focus:border-pitch-lime text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold mb-2 text-pitch-dark dark:text-gray-200">Recommendations</label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={recommendForPosition} 
                            onChange={(e) => setRecommendForPosition(e.target.checked)} 
                            className="rounded text-pitch-dark focus:ring-pitch-lime"
                        />
                        <span>For Present Positions</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-pitch-dark dark:text-gray-200">Duration</label>
                   <div className="flex flex-col gap-2">
                       <button onClick={() => setDurationFilter('all')} className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${durationFilter === 'all' ? 'bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>All Durations</button>
                       <button onClick={() => setDurationFilter('under15')} className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${durationFilter === 'under15' ? 'bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Under 15 Mins</button>
                       <button onClick={() => setDurationFilter('15to30')} className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${durationFilter === '15to30' ? 'bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>15-30 Mins</button>
                       <button onClick={() => setDurationFilter('over30')} className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${durationFilter === 'over30' ? 'bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>30+ Mins</button>
                   </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-pitch-dark dark:text-gray-200">Category</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['Fitness', 'Technical', 'Tactical'].map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => toggleTag(tag)} 
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border shadow-sm ${activeTags.includes(tag) ? 'bg-pitch-lime text-pitch-dark border-pitch-lime' : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <label className="block text-sm font-semibold mb-2 text-pitch-dark dark:text-gray-200">Other Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {allTags.filter(t => !['Fitness', 'Technical', 'Tactical'].includes(t)).map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => toggleTag(tag)} 
                                className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold transition-colors ${activeTags.includes(tag) ? 'bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            )}
            {plannerMode && (
                <div className="w-full lg:w-1/3 flex-shrink-0 flex flex-col gap-4 order-last lg:order-first h-[calc(100vh-200px)] sticky top-6">
                    <h3 className="font-bold text-xl text-pitch-dark dark:text-white flex items-center gap-2 mb-2">
                        <CalendarDays size={24} className="text-pitch-lime" /> Weekly Training Plan
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div 
                                key={day} 
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[120px]"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    try {
                                        const drillData = JSON.parse(e.dataTransfer.getData('application/json'));
                                        setSchedule(prev => ({
                                            ...prev,
                                            [day]: [...prev[day], drillData as Drill]
                                        }));
                                    } catch (err) {}
                                }}
                            >
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">{day}</h4>
                                {schedule[day].length === 0 ? (
                                    <div className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-4">Drag drills here</div>
                                ) : (
                                    <div className="space-y-2">
                                        {schedule[day].map((d, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded relative group">
                                                <div className="truncate text-sm font-medium dark:text-white pr-6">{d.title}</div>
                                                <button 
                                                    onClick={() => setSchedule(prev => ({ ...prev, [day]: prev[day].filter((_, i) => i !== idx) }))}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className={`flex-1 ${plannerMode ? 'lg:w-2/3 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                         <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
                             Total Drills: <span className="text-pitch-dark dark:text-white font-bold ml-1">{filteredDrills.length}</span>
                         </div>
                         <div className="flex flex-wrap items-center gap-2">
                             {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                                 <button 
                                     key={diff}
                                     onClick={() => setDifficultyFilter(diff)}
                                     className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${difficultyFilter === diff ? 'bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                 >
                                     {diff === 'all' ? 'All Levels' : diff}
                                 </button>
                             ))}
                         </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                        <button onClick={resetFilters} className="text-gray-500 dark:text-gray-400 hover:text-pitch-dark dark:hover:text-white underline font-medium">Reset Filters</button>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700 ml-2">
                             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-pitch-dark dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} title="Comfortable Grid View">
                                 <LayoutGrid size={16} />
                             </button>
                             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-pitch-dark dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} title="Compact List View">
                                 <List size={16} />
                             </button>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                            <span className="text-gray-500 dark:text-gray-400"><Filter size={16}/></span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md outline-none focus:border-pitch-lime cursor-pointer">
                                <option value="recent">Sort by: Recent</option>
                                <option value="rating">Sort by: Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                    <div className={`bg-white dark:bg-gray-800 border text-center border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex justify-center items-center py-6 border-dashed border-2 text-gray-400 dark:text-gray-500 hover:border-pitch-dark dark:hover:border-gray-500 hover:text-pitch-dark dark:hover:text-gray-300 gap-6 ${viewMode === 'grid' ? 'flex-col h-full min-h-[300px]' : 'flex-row min-h-[140px]'}`}>
                         <button onClick={() => setMode('record')} className={`flex items-center justify-center gap-2 hover:text-pitch-lime transition-colors ${viewMode === 'grid' ? 'flex-col' : 'flex-row'}`}>
                             <Camera size={24} />
                             <span className="font-medium">Record New Drill</span>
                         </button>
                         <div className={viewMode === 'grid' ? "w-16 h-px bg-gray-200 dark:bg-gray-700" : "h-8 w-px bg-gray-200 dark:bg-gray-700"}></div>
                         <button onClick={() => { setVideoUrl(''); setMode('annotate') }} className={`flex items-center justify-center gap-2 hover:text-pitch-lime transition-colors ${viewMode === 'grid' ? 'flex-col' : 'flex-row'}`}>
                             <Plus size={24} />
                             <span className="font-medium">Create New Drill</span>
                         </button>
                    </div>
                  {filteredDrills.map(drill => (
                    <motion.div 
                       key={drill.id} 
                       draggable
                       onDragStart={(e) => {
                           e.dataTransfer.setData('text/plain', `Drill: ${drill.title}\nDuration: ${drill.duration}\nDescription: ${drill.description}\n`);
                           e.dataTransfer.setData('application/json', JSON.stringify(drill));
                       }}
                       whileHover={{ y: -2 }}
                       transition={{ duration: 0.2 }}
                       className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:scale-[1.02] hover:shadow-md transition-all duration-200 group cursor-grab active:cursor-grabbing relative ${viewMode === 'grid' ? 'flex flex-col' : 'flex flex-row'}`}>
                      {drill.status && (
                          <div className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm z-20 ${drill.status === 'Approved' ? 'bg-green-500 text-white' : drill.status === 'Archived' ? 'bg-gray-600 text-white' : 'bg-orange-500 text-white'}`}>
                              {drill.status}
                          </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex justify-center items-center pointer-events-none">
                          <div className="flex items-center justify-center gap-3 pointer-events-auto mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
                             <button onClick={(e) => { e.stopPropagation(); setDrills(drills.map(d => d.id === drill.id ? {...d, status: 'Archived'} : d)); }} className="bg-white text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-full shadow font-semibold text-xs flex items-center gap-1.5 transition-colors">
                                 <Archive size={14} /> Archive
                             </button>
                             <button onClick={(e) => { e.stopPropagation(); setDrillToDelete(drill); }} className="bg-white text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow font-semibold text-xs flex items-center gap-1.5 transition-colors">
                                 <Trash2 size={14} /> Delete
                             </button>
                          </div>
                      </div>
                      <div className={`${viewMode === 'grid' ? 'aspect-video w-full' : 'w-48 xl:w-64 h-full shrink-0'} bg-gray-200 relative cursor-pointer`} onClick={() => { setVideoUrl(`blob:mock`); setMode('annotate') }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <Play className="text-white opacity-80 group-hover:opacity-100" size={48} />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setVideoUrl(`blob:mock`); setMode('annotate'); }} className="absolute top-2 left-2 z-10 bg-black/60 hover:bg-black text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-semibold backdrop-blur-sm mt-8 border border-white/20 shadow">
                      <PenTool size={14} /> Add Annotation
                  </button>
                  <img src={`https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400&h=225&${drill.imageIndex}`} alt="Drill thumbnail" className="w-full h-full min-h-[160px] object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{drill.duration}</div>
                  {drill.difficulty && (
                      <div className={`absolute top-2 left-2 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-white/10 ${drill.difficulty === 'Beginner' ? 'bg-green-600/80 uppercase' : drill.difficulty === 'Intermediate' ? 'bg-yellow-500/80 uppercase' : 'bg-red-600/80 uppercase'}`}>
                          {drill.difficulty}
                      </div>
                  )}
                  {drill.isTrending && (
                      <div className="absolute top-10 right-2 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <TrendingUp size={10} /> Trending
                      </div>
                  )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-1 relative min-w-0">
                <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-semibold text-pitch-dark dark:text-white leading-tight flex-1 truncate">{highlightText(drill.title, searchQuery)}</h3>
                        <div className="flex items-center gap-2">
                            {drill.rating ? (
                                 <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-1.5 py-0.5 rounded text-xs font-bold border border-yellow-200 dark:border-yellow-800/50">
                                     <Star size={10} className="fill-current" />
                                     <span>{drill.rating.toFixed(1)}</span>
                                 </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                        {drill.tags.map(tag => (
                            <span 
                                key={tag} 
                                onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} 
                                className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer transition-colors ${activeTags.includes(tag) ? 'bg-pitch-lime text-pitch-dark' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                {highlightText(tag, searchQuery)}
                            </span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{highlightText(drill.description, searchQuery)}</p>
                    {drill.lastUsed && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-semibold mb-4">
                            <Calendar size={12} />
                            <span>Last Used: {drill.lastUsed}</span>
                        </div>
                    )}
                    {drill.usageHistory && drill.usageHistory.length > 0 && typeof drill.usageHistory[0] === 'number' && (
                        <div className="mb-4 bg-gray-50 dark:bg-gray-800/50 rounded p-2">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Usage (Last 6 Mos)</p>
                            <div className="h-10 w-full flex items-end gap-1">
                                {drill.usageHistory.map((val, idx) => (
                                    <div key={idx} className="flex-1 bg-pitch-lime/80 rounded-t" style={{ height: `${Math.max(10, (val / Math.max(...drill.usageHistory!)) * 100)}%` }}></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 items-center mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50">
                     <span className="w-8 h-8 rounded-full bg-pitch-dark dark:bg-gray-700 text-white flex items-center justify-center text-xs font-bold">
                         {drill.coach.split(' ').map(n=>n[0]).join('').substring(0,2)}
                     </span>
                     <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col justify-center">
                         <span className="font-semibold dark:text-gray-300">{drill.coach}</span>
                         <span>{drill.timeAgo}</span>
                     </div>
                 </div>
                 <div className="flex gap-2 items-center mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                     <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             if (navigator.share) {
                                 navigator.share({
                                     title: drill.title,
                                     text: drill.description,
                                     url: window.location.href
                                 }).catch(console.error);
                             } else {
                                 alert('Share API not supported');
                             }
                         }}
                         className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded text-xs font-semibold transition-colors"
                     >
                         <Share2 size={14} />
                         Share
                     </button>
                     <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             const existingNotes = localStorage.getItem('pitchflow_notes') || '';
                             const newDrillText = `Drill: ${drill.title}\nDuration: ${drill.duration}\nDescription: ${drill.description}`;
                             localStorage.setItem('pitchflow_notes', existingNotes + (existingNotes ? '\n\n' : '') + newDrillText);
                             alert(`Added "${drill.title}" to Training Plan`);
                         }}
                         className="flex-1 flex items-center justify-center gap-1 bg-pitch-dark text-white hover:bg-pitch-lime hover:text-pitch-dark px-3 py-2 rounded text-xs font-semibold transition-colors"
                     >
                         <Plus size={14} />
                         Quick Add
                     </button>
                     <button 
                         onClick={(e) => handleExportPDF(drill, e)}
                         className="flex-none flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded text-xs font-semibold transition-colors"
                         title="Export PDF"
                     >
                         <FileText size={14} />
                     </button>
                     <button 
                         onClick={(e) => { e.stopPropagation(); setPrintDrill(drill); }}
                         className="flex-none flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded text-xs font-semibold transition-colors"
                         title="Print"
                     >
                         <Printer size={14} />
                     </button>
                     <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             const clonedDrill = {
                                 ...drill,
                                 id: Math.random().toString(36).substr(2, 9),
                                 title: drill.title + ' - Copy',
                                 timeAgo: 'Just now'
                             };
                             setDrills([clonedDrill, ...drills]);
                         }}
                         className="flex-none flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded text-xs font-semibold transition-colors"
                         title="Clone"
                     >
                         <Copy size={14} />
                     </button>
                 </div>
              </div>
            </motion.div>
          ))}
                </div>
            </div>
        </div>
      )}
      
      <ConfirmDialog 
          isOpen={!!drillToDelete}
          title="Delete Drill"
          message={
              <span>
                  Are you sure you want to delete the drill <strong>{drillToDelete?.title}</strong>? This action cannot be undone.
              </span>
          }
          confirmLabel="Delete"
          onConfirm={() => {
              if (drillToDelete) {
                  setDrills(drills.filter(d => d.id !== drillToDelete.id));
              }
          }}
          onCancel={() => setDrillToDelete(null)}
      />

      {mode === 'record' && (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center mt-6">
            {/* @ts-ignore */}
            <Webcam audio={false} ref={webcamRef} className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-0 w-full flex justify-center gap-4">
                {isRecording ? (
                    <button onClick={handleStopCaptureClick} className="bg-red-500 text-white p-4 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600">
                        <Square size={24} />
                    </button>
                ) : (
                    <button onClick={handleStartCaptureClick} className="bg-pitch-dark text-white p-4 rounded-full flex items-center justify-center shadow-lg hover:bg-pitch-darker border-4 border-pitch-lime">
                        <Camera size={24} />
                    </button>
                )}
            </div>
            {isRecording && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">REC</div>}
        </div>
      )}

      {mode === 'annotate' && (
        <div className="space-y-6 mt-6">
            <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm font-semibold text-gray-500 mr-2">DRAWING TOOLS</div>
                <button onClick={() => setDrawMode('free')} className={`p-2 rounded ${drawMode === 'free' ? 'bg-pitch-light border-pitch-lime border' : 'hover:bg-gray-100'}`}>
                    <Edit2 size={20} className={drawMode === 'free' ? 'text-pitch-dark' : 'text-gray-500'} />
                </button>
                <button onClick={() => setDrawMode('arrow')} className={`p-2 rounded ${drawMode === 'arrow' ? 'bg-pitch-light border-pitch-lime border' : 'hover:bg-gray-100'}`}>
                    <ArrowRight size={20} className={drawMode === 'arrow' ? 'text-pitch-dark' : 'text-gray-500'} />
                </button>
                 <button onClick={() => setDrawMode('circle')} className={`p-2 rounded ${drawMode === 'circle' ? 'bg-pitch-light border-pitch-lime border' : 'hover:bg-gray-100'}`}>
                    <Circle size={20} className={drawMode === 'circle' ? 'text-pitch-dark' : 'text-gray-500'} />
                </button>
                
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                
                <div className="flex gap-2">
                    {['#C6FF00', '#FF3B30', '#007AFF', '#FFFFFF'].map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-gray-800' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                </div>

                <div className="flex-1"></div>
                
                <div className="flex flex-col gap-2">
                    <input 
                        type="text" 
                        placeholder="Drill Title" 
                        value={newDrillTitle} 
                        onChange={e => setNewDrillTitle(e.target.value)} 
                        className="border border-gray-200 px-3 py-1.5 outline-none focus:border-pitch-lime rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Est Duration (e.g. 15m)" 
                            value={newDrillDuration} 
                            onChange={e => setNewDrillDuration(e.target.value)} 
                            className="border border-gray-200 px-3 py-1.5 outline-none focus:border-pitch-lime rounded text-sm w-36 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        />
                        <select value={newDrillDifficulty} onChange={(e) => setNewDrillDifficulty(e.target.value)} className="border border-gray-200 px-3 py-1.5 outline-none focus:border-pitch-lime rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 flex-1 max-w-sm">
                    <input 
                        type="text" 
                        placeholder="Drill Description (will auto-suggest tags)" 
                        value={newDrillDescription} 
                        onChange={e => setNewDrillDescription(e.target.value)}
                        onBlur={async () => {
                            if (!newDrillDescription || isAutoTagging || newDrillTags.length > 0) return;
                            setIsAutoTagging(true);
                            try {
                                const allTagsSet = Array.from(new Set(drills.flatMap(d => d.tags))) as string[];
                                const res = await fetch('/api/auto-tag', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ description: newDrillDescription, existingTags: allTagsSet })
                                });
                                if (res.ok) {
                                    const suggestedTags = await res.json();
                                    setNewDrillTags(suggestedTags);
                                }
                            } catch (e) {
                                console.error(e);
                            }
                            setIsAutoTagging(false);
                        }}
                        className="border border-gray-200 px-3 py-1.5 outline-none focus:border-pitch-lime rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center flex-wrap">
                            {isAutoTagging ? (
                                <span className="text-xs text-gray-500 animate-pulse">AI is suggesting tags...</span>
                            ) : newDrillTags.map(t => (
                                <span key={t} className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 flex items-center gap-1 rounded font-semibold dark:text-white">
                                    {t}
                                    <button type="button" onClick={() => setNewDrillTags(tags => tags.filter(tag => tag !== t))} className="hover:text-red-500 transition-colors ml-1">&times;</button>
                                </span>
                            ))}
                        </div>
                        <input 
                            type="text" 
                            placeholder="Type a tag and press Enter" 
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.currentTarget.value.trim();
                                    if (val && !newDrillTags.includes(val)) setNewDrillTags([...newDrillTags, val]);
                                    e.currentTarget.value = '';
                                }
                            }}
                            className="border border-gray-200 px-3 py-1.5 outline-none focus:border-pitch-lime rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 w-full"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setMode('view')} className="text-sm text-gray-500 hover:text-pitch-dark dark:hover:text-white">Cancel</button>
                    <button onClick={() => {
                        const newDrill: Drill = {
                            id: Math.random().toString(36).substr(2, 9),
                            title: newDrillTitle || 'New Custom Drill',
                            description: newDrillDescription || 'Custom uploaded/recorded drill analysis.',
                            tags: newDrillTags.length > 0 ? newDrillTags : ['Custom'],
                            duration: newDrillDuration || '00:00',
                            coach: 'Current Coach',
                            timeAgo: 'Just now',
                            imageIndex: Math.floor(Math.random() * 5) + 1,
                            difficulty: newDrillDifficulty,
                            rating: 0,
                            externalUrl: videoUrl || undefined,
                        };
                        setDrills([newDrill, ...drills]);
                        setMode('view');
                        setNewDrillTitle('');
                        setNewDrillDescription('');
                        setNewDrillTags([]);
                        setNewDrillDuration('');
                        setVideoUrl(null);
                    }} className="flex items-center gap-2 bg-pitch-dark text-white px-4 py-2 rounded-md hover:bg-pitch-darker transition-colors whitespace-nowrap">
                        <Save size={16} />
                        <span>Save Analysis</span>
                    </button>
                </div>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-black max-w-4xl border border-gray-200 shadow-sm relative group">
                {videoUrl && (
                    videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                        <iframe className="w-full aspect-video z-0 pointer-events-none" src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    ) : videoUrl.includes('vimeo.com') ? (
                        <iframe className="w-full aspect-video z-0 pointer-events-none" src={videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                    ) : (
                        <video ref={videoRef} src={videoUrl} controls loop className="w-full h-auto block z-0" crossOrigin="anonymous" />
                    )
                )}
                <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    width={800} // Set dynamically ideally, but let's assume standard width for mockup
                    height={450} 
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair z-10"
                    style={{ pointerEvents: 'auto' }}
                />
                 <div className="absolute bottom-4 left-4 z-20 text-xs text-white bg-black/50 px-2 py-1 rounded">Hint: Draw tactical lines directly over the footage.</div>
            </div>
        </div>
      )}

      {printDrill && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col pt-12 pb-8 overflow-y-auto px-8 print:p-0 print:absolute print:inset-0 text-pitch-dark">
            <div className="max-w-4xl mx-auto w-full flex-1">
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <h2 className="text-2xl font-bold">Print Preview</h2>
                    <div className="flex gap-4">
                        <button onClick={() => window.print()} className="bg-pitch-dark text-white px-4 py-2 rounded font-semibold hover:bg-pitch-darker transition-colors flex items-center gap-2">
                            <Printer size={18} />
                            Print Note
                        </button>
                        <button onClick={() => setPrintDrill(null)} className="text-gray-500 hover:text-gray-700 font-semibold px-4 py-2">Close</button>
                    </div>
                </div>
                
                {/* Print Layout */}
                <div className="border border-gray-200 print:border-none p-12 print:p-0 flex flex-col gap-6 bg-white shrink-0 min-h-[1000px] mb-24">
                    <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                        <div>
                            <h1 className="text-5xl font-extrabold mb-2 text-pitch-dark">{printDrill.title}</h1>
                            <div className="flex gap-2 mb-4">
                                {printDrill.tags.map(t => <span key={t} className="text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded">{t}</span>)}
                            </div>
                        </div>
                        <div className="text-right text-gray-500 font-medium">
                            <div>Coach: {printDrill.coach}</div>
                            <div>Date: {new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                             <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><FileText size={18} /> Drill Specs</h3>
                             <ul className="space-y-2 text-gray-700">
                                 <li><strong>Duration:</strong> {printDrill.duration}</li>
                                 <li><strong>Difficulty:</strong> {printDrill.difficulty || 'N/A'}</li>
                             </ul>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                             <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Edit2 size={18} /> Coach Notes</h3>
                             <p className="text-gray-700">{printDrill.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 h-[500px]">
                        <div className="text-center text-gray-400 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
                            <PenTool size={48} className="opacity-20" />
                            <span>Tactical Board Diagram Placeholder</span>
                            <span className="text-sm font-normal normal-case">(Draw plays here by hand after printing)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

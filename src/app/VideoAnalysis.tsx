import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Trash2, Play, Pause, Download } from 'lucide-react';

export default function VideoAnalysis() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [color, setColor] = useState('#pitch-lime');
    const colors = ['#84cc16', '#3b82f6', '#ef4444', '#f59e0b', '#ffffff'];

    useEffect(() => {
        const resizeCanvas = () => {
            if (videoRef.current && canvasRef.current) {
                canvasRef.current.width = videoRef.current.clientWidth;
                canvasRef.current.height = videoRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', resizeCanvas);
        // initial timeout to ensure video is loaded/rendered
        setTimeout(resizeCanvas, 500);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (isPlaying) return; // Don't draw while playing
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.beginPath();
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || isPlaying || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = tool === 'eraser' ? 20 : 3;
        ctx.lineCap = 'round';
        
        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color === '#pitch-lime' ? '#84cc16' : color;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-pitch-dark dark:text-white uppercase tracking-tight">Video Analysis</h2>
                    <p className="text-gray-500 font-medium">Review training clips and mark tactical overlays.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex justify-center items-center">
                    <video 
                        ref={videoRef}
                        src="https://www.w3schools.com/html/mov_bbb.mp4" 
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onLoadedMetadata={() => {
                            if (videoRef.current && canvasRef.current) {
                                canvasRef.current.width = videoRef.current.clientWidth;
                                canvasRef.current.height = videoRef.current.clientHeight;
                            }
                        }}
                    />
                    
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 ${isPlaying ? 'pointer-events-none' : 'cursor-crosshair'}`}
                    />

                    {!isPlaying && (
                        <div className="absolute top-4 left-4 z-20 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 backdrop-blur-sm pointer-events-none">
                            <Pen size={14} /> Drawing Mode Active
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={togglePlay}
                        className="flex items-center gap-2 px-5 py-2.5 bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark rounded-xl font-bold transition-opacity hover:opacity-90"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        {isPlaying ? 'Pause to Draw' : 'Play Video'}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>
                        
                        {colors.map(c => (
                            <button 
                                key={c}
                                onClick={() => { setTool('pen'); setColor(c); }}
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c && tool === 'pen' ? 'scale-125 border-pitch-dark dark:border-white' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: c === '#pitch-lime' ? '#84cc16' : c }}
                            />
                        ))}

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                        <button 
                            onClick={() => setTool('eraser')}
                            className={`p-2 rounded-xl transition-colors ${tool === 'eraser' ? 'bg-pitch-lime text-pitch-dark' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                        >
                            <Eraser size={20} />
                        </button>

                        <button 
                            onClick={clearCanvas}
                            className="p-2 rounded-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ml-2"
                            title="Clear Drawings"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

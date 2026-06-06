import React from 'react';
import { Calendar, Users, Camera, Plus } from 'lucide-react';

interface QuickActionsProps {
    onScheduleMatch?: () => void;
    onCreatePlan?: () => void;
    onRecordAttendance?: () => void;
    isEmpty?: boolean;
}

export function QuickActions({ onScheduleMatch, onCreatePlan, onRecordAttendance, isEmpty = false }: QuickActionsProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-pitch-dark dark:text-white mb-6">Quick Actions</h3>
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 cursor-pointer hover:bg-gray-200" onClick={onCreatePlan}>
                        <Plus size={32} />
                    </div>
                    <h4 className="font-bold text-pitch-dark dark:text-white">Let's get started</h4>
                    <p className="text-gray-500 font-medium mt-1">Ready to plan your first session?</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button 
                    onClick={onCreatePlan}
                    className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-pitch-dark hover:text-pitch-lime dark:hover:bg-gray-750 transition-colors group border border-transparent hover:border-pitch-lime/20"
                >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-3 shadow-sm text-pitch-dark dark:text-white group-hover:bg-pitch-lime group-hover:text-pitch-dark transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold text-sm">New Training Plan</span>
                </button>
                <button 
                    onClick={onScheduleMatch}
                    className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-pitch-dark hover:text-pitch-lime dark:hover:bg-gray-750 transition-colors group border border-transparent hover:border-pitch-lime/20"
                >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-3 shadow-sm text-blue-500 group-hover:bg-pitch-lime group-hover:text-pitch-dark transition-colors">
                        <Calendar size={24} />
                    </div>
                    <span className="font-bold text-sm">Schedule Match</span>
                </button>
                <button 
                    onClick={onRecordAttendance}
                    className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-pitch-dark hover:text-pitch-lime dark:hover:bg-gray-750 transition-colors group border border-transparent hover:border-pitch-lime/20"
                >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-3 shadow-sm text-green-500 group-hover:bg-pitch-lime group-hover:text-pitch-dark transition-colors">
                        <Users size={24} />
                    </div>
                    <span className="font-bold text-sm">Record Attendance</span>
                </button>
            </div>
            )}
        </div>
    );
}

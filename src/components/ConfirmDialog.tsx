import { ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string | ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    destructive = true
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-full ${destructive ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-pitch-dark dark:text-white mb-2">{title}</h3>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                        {message}
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                        <button 
                            onClick={onCancel}
                            className="px-4 py-2 font-bold text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {cancelLabel}
                        </button>
                        <button 
                            onClick={() => {
                                onConfirm();
                                onCancel();
                            }}
                            className={`px-4 py-2 font-bold text-sm text-white rounded-lg transition-colors ${destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-pitch-dark hover:bg-black'}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

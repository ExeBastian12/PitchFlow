import { useState, useEffect } from 'react';
import { Camera, Users, Target, Activity, LayoutDashboard, LogOut, ShieldAlert, Moon, Sun, Wand2, X, Home, Network, User as UserIcon, Menu, Loader2, Video } from 'lucide-react';
import DrillLibrary from './DrillLibrary';
import Attendance from './Attendance';
import Analytics from './Analytics';
import AdminOverview from './AdminOverview';
import OwnerOverview from './OwnerOverview';
import ParentDashboard from './ParentDashboard';
import CoachOverview from './CoachOverview';
import ChatPlatform from '../components/ChatPlatform';
import SchoolDashboard from './SchoolDashboard';
import BillingManager from './BillingManager';
import ProfileManager from './ProfileManager';
import TeamRoster from './TeamRoster';
import MatchCalendar from './MatchCalendar';
import AnnouncementModal from './AnnouncementModal';
import { useTheme } from '../context/ThemeContext';
import { MessageSquare, CreditCard, GraduationCap, Bell, Plus, Calendar as CalendarIcon, FileText, Download } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SquadChatPanel } from '../components/SquadChatPanel';
import TacticalBoard from './TacticalBoard';
import VideoAnalysis from './VideoAnalysis';

export default function Dashboard({ role, onLogout }: { role: 'owner' | 'admin' | 'coach' | 'parent' | 'school', onLogout: () => void }) {
    // Default tabs based on role
    const getInitialTab = () => {
        if (role === 'owner') return 'owner_overview';
        if (role === 'admin') return 'admin_overview';
        if (role === 'coach') return 'coach_overview';
        if (role === 'school') return 'school_overview';
        return 'parent_overview';
    };

    const handleNavigation = (tab: string) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    const [activeTab, setActiveTab] = useState<string>(getInitialTab());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(false);
    const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Fetch subscription status
    useEffect(() => {
        if (!auth.currentUser) {
            setIsLoadingUser(false);
            return;
        }
        const unsub = onSnapshot(doc(db, 'subscriptions', auth.currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
                setSubscriptionTier(docSnap.data().tier);
            } else {
                setSubscriptionTier('Free Tier');
            }
            setIsLoadingUser(false);
        });
        return () => unsub();
    }, []);
    
    // Premium feature gate
    const premiumTabs = ['analytics', 'roster', 'matches', 'drill'];
    const isPremiumBlocked = subscriptionTier === 'Free Tier' && premiumTabs.includes(activeTab);

    // Component-level check for RBAC redirection
    useEffect(() => {
        if (role === 'owner' && !['owner_overview', 'analytics', 'billing', 'profile'].includes(activeTab)) {
            setActiveTab('owner_overview');
        } else if (role === 'admin' && !['admin_overview', 'analytics', 'drill', 'profile'].includes(activeTab)) {
            setActiveTab('admin_overview');
        } else if (role === 'coach' && !['coach_overview', 'drill', 'attendance', 'chat', 'billing', 'profile', 'roster', 'matches'].includes(activeTab)) {
            setActiveTab('coach_overview');
        } else if (role === 'school' && !['school_overview', 'analytics', 'billing', 'profile'].includes(activeTab)) {
            setActiveTab('school_overview');
        } else if (role === 'parent' && !['parent_overview', 'chat', 'billing', 'profile'].includes(activeTab)) {
            setActiveTab('parent_overview');
        }
    }, [role, activeTab]);

    // Check if offline
    const [isOfflineNative, setIsOfflineNative] = useState(!navigator.onLine);
    const [forceOffline, setForceOffline] = useState(false);
    
    useEffect(() => {
        const handleOnline = () => setIsOfflineNative(false);
        const handleOffline = () => setIsOfflineNative(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('force-offline-change', { detail: forceOffline }));
    }, [forceOffline]);

    const isOffline = isOfflineNative || forceOffline;
    
    // AI Plan Modal
    const [showAIModal, setShowAIModal] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [aiObjective, setAiObjective] = useState('');
    const [aiDuration, setAiDuration] = useState('60');
    const [aiFocusArea, setAiFocusArea] = useState('Possession');
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    const generateAIPlan = async () => {
        setIsGeneratingPlan(true);
        try {
            const response = await fetch('/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objective: aiObjective || 'General Training', duration: parseInt(aiDuration), focusArea: aiFocusArea })
            });
            const data = await response.json();
            console.log(data);
            alert("AI Plan generated successfully! Check console for data. In full version, this would populate the planner.");
            setShowAIModal(false);
            setActiveTab('attendance');
        } catch (e) {
            console.error(e);
            alert("Failed to generate plan.");
        }
        setIsGeneratingPlan(false);
    };

    if (isLoadingUser) {
        return (
            <div className={`flex h-screen items-center justify-center bg-pitch-light dark:bg-gray-900`}>
                 <div className="flex flex-col items-center gap-4">
                     <Loader2 className="animate-spin text-pitch-lime" size={48} />
                     <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">Loading Workspace...</p>
                 </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen font-sans bg-pitch-light dark:bg-gray-900 overflow-hidden`}>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex lg:relative w-64 bg-pitch-dark text-white flex-col shadow-xl z-50 print:hidden h-full overflow-y-auto custom-scrollbar`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <a href="#" className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
                            PITCH<span className="text-pitch-lime">FLOW</span>
                        </a>
                    </div>
                    
                    {/* User Profile Block in Sidebar */}
                    <div 
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-pitch-lime flex items-center justify-center text-pitch-dark font-black overflow-hidden shrink-0">
                            {auth.currentUser?.photoURL ? (
                                <img src={auth.currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                auth.currentUser?.displayName ? auth.currentUser.displayName[0].toUpperCase() : (auth.currentUser?.email ? auth.currentUser.email[0].toUpperCase() : 'U')
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">
                                {auth.currentUser?.displayName || auth.currentUser?.email || 'Guest User'}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-pitch-lime">{role}</div>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 mt-2 space-y-2">
                    {role === 'owner' && (
                        <>
                            <button 
                                onClick={() => setActiveTab('owner_overview')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'owner_overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Network size={20} />
                                Multi-Club Overview
                            </button>
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Activity size={20} />
                                Global Analytics
                            </button>
                            <button 
                                onClick={() => setActiveTab('billing')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <CreditCard size={20} />
                                Subscription & Billing
                            </button>
                        </>
                    )}
                    
                    {role === 'school' && (
                        <>
                            <button 
                                onClick={() => setActiveTab('school_overview')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'school_overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <GraduationCap size={20} />
                                School Dashboard
                            </button>
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Activity size={20} />
                                Extracurricular Stats
                            </button>
                            <button 
                                onClick={() => setActiveTab('billing')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <CreditCard size={20} />
                                Subscription & Billing
                            </button>
                        </>
                    )}
                    
                    {role === 'admin' && (
                        <>
                            <button 
                                onClick={() => setActiveTab('admin_overview')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'admin_overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Home size={20} />
                                Club Overview
                            </button>
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Activity size={20} />
                                Analytics
                            </button>
                            <button 
                                onClick={() => setActiveTab('tactics')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tactics' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <LayoutDashboard size={20} />
                                Tactical Board
                            </button>
                            <button 
                                onClick={() => setActiveTab('video')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Video size={20} />
                                Video Analysis
                            </button>
                            <button 
                                onClick={() => setActiveTab('drill')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'drill' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Camera size={20} />
                                Drill Library
                            </button>
                        </>
                    )}

                    {role === 'coach' && (
                        <>
                            <button 
                                onClick={() => setActiveTab('coach_overview')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'coach_overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Home size={20} />
                                Coach Dashboard
                            </button>
                            <button 
                                onClick={() => setActiveTab('tactics')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tactics' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <LayoutDashboard size={20} />
                                Tactical Board
                            </button>
                            <button 
                                onClick={() => setActiveTab('video')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Video size={20} />
                                Video Analysis
                            </button>
                            <button 
                                onClick={() => setActiveTab('drill')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'drill' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Camera size={20} />
                                Drill Library
                            </button>
                            <button 
                                onClick={() => setActiveTab('attendance')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'attendance' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Users size={20} />
                                Plan & Attend
                            </button>
                            <button 
                                onClick={() => setActiveTab('roster')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'roster' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <FileText size={20} />
                                Team Roster
                            </button>
                            <button 
                                onClick={() => setActiveTab('matches')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'matches' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <CalendarIcon size={20} />
                                Calendar
                            </button>
                            <button 
                                onClick={() => setActiveTab('chat')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <MessageSquare size={20} />
                                Squad Chat
                            </button>
                            <button 
                                onClick={() => setActiveTab('billing')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <CreditCard size={20} />
                                Subscription
                            </button>
                        </>
                    )}

                    {role === 'parent' && (
                        <>
                            <button 
                                onClick={() => setActiveTab('parent_overview')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'parent_overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Target size={20} />
                                My Child Activity
                            </button>
                            <button 
                                onClick={() => setActiveTab('chat')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <MessageSquare size={20} />
                                Squad Chat
                            </button>
                            <button 
                                onClick={() => setActiveTab('billing')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <CreditCard size={20} />
                                Manage Subscription
                            </button>
                        </>
                    )}
                    
                    <div className="pt-4 mt-4 border-t border-white/10">
                         <button 
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <UserIcon size={20} />
                            My Profile
                        </button>
                    </div>
                </nav>

                {(role === 'admin' || role === 'coach') && (
                    <div className="px-4 mb-4">
                        <button onClick={() => setShowAIModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pitch-lime text-pitch-dark rounded-lg text-sm font-black uppercase tracking-widest hover:bg-[#b0e600] transition-colors shadow-lg">
                            <Wand2 size={16} />
                            AI Studio
                        </button>
                    </div>
                )}

                <div className="p-4 border-t border-white/10 space-y-2 mt-auto">
                    <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-coral-500 hover:bg-coral-500/10 transition-colors">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto relative bg-pitch-light dark:bg-gray-900 flex flex-col mb-16 lg:mb-0">
                {/* Navbar / Header */}
                <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center print:hidden">
                    <div className="flex items-center gap-2">
                        <a href="#" className="text-xl font-black italic tracking-tighter flex items-center lg:hidden gap-2 dark:text-white">
                            PITCH<span className="text-pitch-lime">FLOW</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => {
                            const headers = "Date,Activity,Participants,Duration,Notes\n";
                            const data = "2023-10-24,Team Training,21,90 mins,High Intensity\n2023-10-22,Match vs Eagles,18,120 mins,Won 2-1\n";
                            const blob = new Blob([headers + data], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.setAttribute('hidden', '');
                            a.setAttribute('href', url);
                            a.setAttribute('download', 'team_summary_report.csv');
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }} className="hidden md:flex items-center gap-2 text-sm font-bold bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark px-4 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity">
                            <Download size={16} /> Download Report
                        </button>
                        {/* Notifications Bell */}
                        <div className="relative group">
                            <button className="relative p-2 text-gray-500 hover:text-pitch-dark dark:text-gray-400 dark:hover:text-white transition-colors">
                                <Bell size={24} />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pb-2 origin-top-right transform scale-95 group-hover:scale-100 z-50">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-bold dark:text-white text-sm">Notifications</div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                    {role === 'parent' || role === 'coach' ? (
                                        <div className="p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                            <div className="text-xs font-bold text-blue-500 mb-1">New Match Scheduled</div>
                                            <div className="text-sm dark:text-white">U15 vs Westside Eagles this Saturday at 10 AM.</div>
                                            <div className="text-xs text-gray-400 mt-2">10 mins ago</div>
                                        </div>
                                    ) : null}
                                    {role === 'owner' || role === 'admin' ? (
                                        <div className="p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                            <div className="text-xs font-bold text-green-500 mb-1">Payment Received</div>
                                            <div className="text-sm dark:text-white">New subscription payment for Enterprise Pro Tier.</div>
                                            <div className="text-xs text-gray-400 mt-2">1 hour ago</div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowChatPanel(true)} className="relative p-2 text-gray-500 hover:text-pitch-dark dark:text-gray-400 dark:hover:text-white transition-colors">
                            <MessageSquare size={24} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pitch-lime rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto relative p-4 lg:p-8">
                    {isPremiumBlocked ? (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto p-8">
                             <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                 <ShieldAlert size={40} className="text-pitch-dark dark:text-gray-400" />
                             </div>
                             <h2 className="text-3xl font-black italic tracking-tighter text-pitch-dark dark:text-white mb-4 uppercase">Premium Feature</h2>
                             <p className="text-gray-500 mb-8 font-medium">This module ({activeTab}) is only available on our advanced plans. Upgrade your subscription to unlock powerful new tools.</p>
                             <button onClick={() => setActiveTab('billing')} className="px-8 py-4 bg-pitch-dark text-white font-black uppercase tracking-widest rounded-xl text-sm shadow-xl hover:-translate-y-1 transition-transform w-full">
                                 View Pricing & Upgrade
                             </button>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'owner_overview' && role === 'owner' && <OwnerOverview />}
                            {activeTab === 'admin_overview' && role === 'admin' && <AdminOverview />}
                            {activeTab === 'coach_overview' && role === 'coach' && <CoachOverview onNavigate={setActiveTab} />}
                            {activeTab === 'parent_overview' && role === 'parent' && <ParentDashboard />}
                            {activeTab === 'school_overview' && role === 'school' && <SchoolDashboard />}
                            {activeTab === 'tactics' && (role === 'admin' || role === 'coach') && <TacticalBoard />}
                            {activeTab === 'video' && (role === 'admin' || role === 'coach') && <VideoAnalysis />}
                            {activeTab === 'drill' && (role === 'admin' || role === 'coach') && <DrillLibrary />}
                            {activeTab === 'attendance' && <Attendance />}
                            {activeTab === 'roster' && <TeamRoster />}
                            {activeTab === 'matches' && <MatchCalendar />}
                            {activeTab === 'analytics' && (role === 'admin' || role === 'owner' || role === 'school') && <Analytics role={role} />}
                            {activeTab === 'chat' && (role === 'coach' || role === 'parent') && <ChatPlatform role={role} />}
                            {activeTab === 'billing' && <BillingManager role={role} />}
                            {activeTab === 'profile' && <ProfileManager role={role} />}
                        </>
                    )}
                </div>
            </div>

            {/* Quick Actions FAB */}
            <div className="fixed bottom-8 right-8 z-50 print:hidden group">
                <button className="w-14 h-14 bg-pitch-dark text-pitch-lime dark:bg-pitch-lime dark:text-pitch-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform focus:outline-none">
                    <Plus size={28} className="group-hover:rotate-45 transition-transform duration-300" />
                </button>
                <div className="absolute bottom-16 right-0 mb-4 flex flex-col items-end gap-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-bottom translate-y-4 group-hover:translate-y-0">
                    {role === 'coach' && (
                        <>
                            <button onClick={() => setActiveTab('attendance')} className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 text-pitch-dark dark:text-white rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap font-bold text-sm">
                                Record Attendance <Users size={16} className="text-pitch-lime"/>
                            </button>
                            <button onClick={() => setActiveTab('matches')} className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 text-pitch-dark dark:text-white rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap font-bold text-sm">
                                Schedule Match <CalendarIcon size={16} className="text-blue-500"/>
                            </button>
                        </>
                    )}
                    {(role === 'owner' || role === 'admin') && (
                        <>
                            <button onClick={() => setActiveTab('billing')} className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 text-pitch-dark dark:text-white rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap font-bold text-sm">
                                Process Refund <CreditCard size={16} className="text-red-500"/>
                            </button>
                            <button onClick={() => setShowAnnouncementModal(true)} className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 text-pitch-dark dark:text-white rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap font-bold text-sm">
                                Send Announcement <MessageSquare size={16} className="text-blue-500"/>
                            </button>
                        </>
                    )}
                    {(role === 'parent' || role === 'school') && (
                        <button onClick={() => setActiveTab('chat')} className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 text-pitch-dark dark:text-white rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap font-bold text-sm">
                            Message Coach <MessageSquare size={16} className="text-pitch-lime"/>
                        </button>
                    )}
                </div>
            </div>

            {/* AI Plan Modal */}
            {showAIModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                             <div className="flex items-center gap-3">
                                 <div className="bg-pitch-lime/20 p-2 rounded-lg"><Wand2 className="text-pitch-dark dark:text-pitch-lime" size={24} /></div>
                                 <h2 className="text-2xl font-bold dark:text-white">AI Plan Generator</h2>
                             </div>
                             <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Objective</label>
                                <input value={aiObjective} onChange={e=>setAiObjective(e.target.value)} type="text" placeholder="e.g. Breaking low blocks" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg outline-none focus:border-pitch-lime dark:text-white" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Duration (mins)</label>
                                    <input value={aiDuration} onChange={e=>setAiDuration(e.target.value)} type="number" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg outline-none focus:border-pitch-lime dark:text-white" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Primary Focus Area</label>
                                    <select value={aiFocusArea} onChange={e=>setAiFocusArea(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg outline-none focus:border-pitch-lime cursor-pointer dark:text-white">
                                        <option value="Possession">Possession</option>
                                        <option value="Attacking">Attacking</option>
                                        <option value="Defending">Defending</option>
                                        <option value="Transition">Transition</option>
                                        <option value="Conditioning">Conditioning</option>
                                    </select>
                                </div>
                            </div>
                            <button disabled={isGeneratingPlan} onClick={generateAIPlan} className="w-full mt-4 bg-pitch-dark text-white py-4 rounded-xl font-black uppercase shadow-lg shadow-pitch-dark/20 hover:bg-black disabled:opacity-50 transition-all transform hover:-translate-y-0.5">
                                {isGeneratingPlan ? 'Generating...' : 'Generate Plan (API Key Required)'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <AnnouncementModal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} />
            <SquadChatPanel isOpen={showChatPanel} onClose={() => setShowChatPanel(false)} />

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-around items-center p-3 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button onClick={() => setActiveTab(getInitialTab())} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab.includes('overview') ? 'text-pitch-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                    <Home size={22} />
                    <span className="text-[10px] font-bold mt-1">Home</span>
                </button>
                {role === 'coach' && (
                    <>
                        <button onClick={() => setActiveTab('attendance')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'attendance' ? 'text-pitch-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                            <Users size={22} />
                            <span className="text-[10px] font-bold mt-1">Squad</span>
                        </button>
                        <button onClick={() => setActiveTab('drill')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'drill' ? 'text-pitch-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                            <Camera size={22} />
                            <span className="text-[10px] font-bold mt-1">Drills</span>
                        </button>
                    </>
                )}
                {(role === 'parent' || role === 'owner' || role === 'school' || role === 'admin') && (
                    <button onClick={() => setActiveTab('billing')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'billing' ? 'text-pitch-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                        <CreditCard size={22} />
                        <span className="text-[10px] font-bold mt-1">Billing</span>
                    </button>
                )}
                <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'chat' ? 'text-pitch-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                    <MessageSquare size={22} />
                    <span className="text-[10px] font-bold mt-1">Chat</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'profile' ? 'text-pitch-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>
                    <UserIcon size={22} />
                    <span className="text-[10px] font-bold mt-1">Profile</span>
                </button>
            </div>
        </div>
    );
}

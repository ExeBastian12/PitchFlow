import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, Save, Key, AlertCircle, Building2, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function ProfileManager({ role }: { role: string }) {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [dbRole, setDbRole] = useState(role);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [autoRenew, setAutoRenew] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { showToast } = useToast();

    const [subscriptionTier, setSubscriptionTier] = useState('Free Tier');
    const [memberSince, setMemberSince] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
             if (auth.currentUser) {
                setDisplayName(auth.currentUser.displayName || '');
                setEmail(auth.currentUser.email || '');

                try {
                    const userRef = doc(db, 'users', auth.currentUser.uid);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setAffiliation(data.affiliation || '');
                        if(data.role) setDbRole(data.role);
                        if(data.autoRenew !== undefined) setAutoRenew(data.autoRenew);
                        if(data.createdAt) {
                            const date = new Date(data.createdAt);
                            setMemberSince(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
                        }
                    }

                    const subRef = doc(db, 'subscriptions', auth.currentUser.uid);
                    const subSnap = await getDoc(subRef);
                    if (subSnap.exists()) {
                        setSubscriptionTier(subSnap.data().tier || 'Free Tier');
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setIsPageLoading(false);
                }
            } else {
                setIsPageLoading(false);
            }
        };
        fetchUserData();
    }, [auth.currentUser]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (!auth.currentUser) throw new Error("No user logged in.");
            
            await updateProfile(auth.currentUser, {
                displayName: displayName
            });

            // Note: email updates usually require recent authentication.
            // Keeping it simple here:
            if (email !== auth.currentUser.email) {
                 await updateEmail(auth.currentUser, email);
            }

            // Update firestore doc
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                name: displayName,
                email: email,
                affiliation: affiliation
            });

            setMessage({ type: 'success', text: 'Profile updated successfully! Role and affiliation saved.' });
            showToast('Profile updated successfully', 'success');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
            showToast(error.message || 'Failed to update profile.', 'error');
        }
        setLoading(false);
    };

    if (isPageLoading) {
        return (
            <div className="flex justify-center items-center h-full p-12">
                 <Loader2 className="animate-spin text-pitch-lime" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 h-full overflow-y-auto">
            <div>
                <h1 className="text-4xl font-black text-pitch-dark dark:text-white uppercase tracking-tight mb-2">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your personal information and account settings.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group cursor-pointer mt-2">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pitch-lime to-blue-500 p-1 shadow-2xl">
                                <div className="w-full h-full bg-pitch-dark rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
                                    {auth.currentUser?.photoURL ? (
                                        <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-white">{displayName ? displayName[0].toUpperCase() : (email ? email[0].toUpperCase() : 'U')}</span>
                                    )}
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity m-1">
                                <Camera className="text-white" size={28} />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="px-4 py-1.5 bg-pitch-dark text-pitch-lime dark:bg-pitch-lime dark:text-pitch-dark rounded-full text-xs font-black uppercase tracking-widest shadow-md">
                                {subscriptionTier}
                            </span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">{role} Access</span>
                            {memberSince && <span className="text-xs text-gray-500 font-medium">Joined {memberSince}</span>}
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    <User size={16} /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-pitch-dark dark:text-white focus:outline-none focus:border-pitch-lime transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    <Mail size={16} /> Email Address
                                </label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-pitch-dark dark:text-white focus:outline-none focus:border-pitch-lime transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                    <Building2 size={16} /> Club / School Affiliation
                                </label>
                                <input 
                                    type="text" 
                                    value={affiliation}
                                    onChange={(e) => setAffiliation(e.target.value)}
                                    placeholder="Enter your club, school, or team name"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-pitch-dark dark:text-white focus:outline-none focus:border-pitch-lime transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                                <button type="button" className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-6 py-3 bg-pitch-dark text-pitch-lime dark:bg-pitch-lime dark:text-pitch-dark rounded-xl text-sm font-black shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2 mb-6 uppercase tracking-tight">
                    <Shield className="text-blue-500" /> Account Security
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                        <h4 className="font-bold dark:text-white text-lg">Password</h4>
                        <p className="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <button className="whitespace-nowrap px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-pitch-dark dark:text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all uppercase tracking-widest flex items-center gap-2">
                        <Key size={16} className="text-pitch-lime"/> Change Password
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2 mb-6 uppercase tracking-tight">
                    <Shield className="text-pitch-lime" /> Billing Preferences
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                        <h4 className="font-bold dark:text-white text-lg">Auto-Renew Subscription</h4>
                        <p className="text-sm text-gray-500 mt-1">Automatically renew your current billing plan at the end of the term.</p>
                    </div>
                    <button 
                        onClick={async () => {
                            const newValue = !autoRenew;
                            setAutoRenew(newValue);
                            if (auth.currentUser) {
                                try {
                                    const userRef = doc(db, 'users', auth.currentUser.uid);
                                    await updateDoc(userRef, { autoRenew: newValue });
                                } catch (e) { console.error(e); }
                            }
                        }}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pitch-lime focus:ring-offset-2 ${autoRenew ? 'bg-pitch-lime' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${autoRenew ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

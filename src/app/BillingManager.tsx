import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Shield, Zap, Receipt, ArrowRight, Download, BarChart4, Globe2, Building2, TrendingUp, Users, X, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const PRICING_BREAKDOWN = [
  { name: 'Club Development & Gear', value: 45, color: '#C6FF00' },
  { name: 'Coach Compensation', value: 30, color: '#3b82f6' },
  { name: 'Platform & Admin', value: 15, color: '#8b5cf6' },
  { name: 'Community Scholarships', value: 10, color: '#ec4899' }
];

export default function BillingManager({ role }: { role: string }) {
  const [activeGateway, setActiveGateway] = useState<'midtrans'>('midtrans');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTier, setCurrentTier] = useState('Free Tier');
  const [activePlan, setActivePlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
        if (!auth.currentUser) return;
        try {
            const subRef = doc(db, 'subscriptions', auth.currentUser.uid);
            const subSnap = await getDoc(subRef);
            if (subSnap.exists()) {
                const data = subSnap.data();
                setCurrentTier(data.tier || 'Free Tier');
                setActivePlan(data);
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
      setIsProcessing(true);
      if (!auth.currentUser) {
          setIsProcessing(false);
          return;
      }
      
      try {
          // Real Execution - Call backend Express route for Midtrans Snap Token
          const response = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  orderId: `PITCHFLOW-ENTERPRISE-${Date.now()}`,
                  grossAmount: 2400000,
                  customerDetails: {
                      firstName: auth.currentUser.displayName || 'User',
                      email: auth.currentUser.email || 'guest@example.com'
                  }
              })
          });

          // If keys are not set, it might return 500
          if (!response.ok) {
              throw new Error('Midtrans API Keys are not configured in environment settings. Please add MIDTRANS_SERVER_KEY.');
          }

          const data = await response.json();

          // Redirect to actual Midtrans Snap URL if available
          if (data.redirect_url) {
              window.open(data.redirect_url, '_blank');
          }

          // Persist the upgraded status to Firestore
          const subRef = doc(db, 'subscriptions', auth.currentUser.uid);
          await setDoc(subRef, {
              tier: 'Enterprise Pro Tier',
              status: 'active',
              updatedAt: Date.now(),
              gateway: activeGateway
          }, { merge: true });
          
          setCurrentTier('Enterprise Pro Tier');
          setIsCheckoutOpen(false);
          alert('Redirecting to Midtrans Checkout! Subscription updated.');
      } catch(err: any) {
          console.error("Payment failed", err);
          alert(err.message || 'Payment processing failed. Check console for details.');
      } finally {
          setIsProcessing(false);
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
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight text-pitch-dark dark:text-white mb-2 uppercase">Financial Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage subscriptions, view fair-pricing transparency, and handle gateways.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-pitch-dark dark:text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all uppercase tracking-widest">
                <Receipt size={16} className="text-blue-500" /> View All Invoices
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pitch-lime opacity-5 rounded-full blur-3xl group-hover:bg-pitch-lime/20 transition-all duration-700 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Current Active License</h3>
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black dark:text-white">{currentTier}</h2>
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${activePlan?.status === 'active' ? 'bg-pitch-lime text-pitch-dark' : 'bg-gray-200 text-gray-700'}`}>{activePlan?.status || 'N/A'}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2 font-medium">Billed annually.</p>
              </div>
              <div className="text-left md:text-right">
                  <span className="text-4xl font-black dark:text-white tracking-tighter">{currentTier === 'Enterprise Pro Tier' ? 'Rp2.4M' : 'Free'}</span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium ml-1">/ year</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl">
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2"><Globe2 size={14}/> License Coverage</div>
                 <div className="font-black text-lg dark:text-white">Global Access</div>
               </div>
               <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl">
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2"><Users size={14}/> Headcount Limit</div>
                 <div className="font-black text-lg dark:text-white">{currentTier === 'Enterprise Pro Tier' ? 'Unlimited' : 'Limited'}</div>
               </div>
               <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl">
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2"><Building2 size={14}/> Facility Access</div>
                 <div className="font-black text-lg dark:text-white">All Branches</div>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 relative z-10">
               <button onClick={() => setIsCheckoutOpen(true)} className="px-6 py-3 bg-pitch-dark text-white dark:bg-white dark:text-pitch-dark font-black uppercase tracking-widest rounded-xl text-sm shadow-xl hover:-translate-y-0.5 transition-all">
                 Upgrade / Change Plan
               </button>
               <button className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                 Cancel Subscription
               </button>
            </div>
          </div>

          {currentTier !== 'Free Tier' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h3 className="text-xl font-bold dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2"><CreditCard className="text-purple-500"/> Integrated Payment Gateways</h3>
              
              <div className="flex flex-wrap gap-3 mb-6">
                  <button onClick={() => setActiveGateway('midtrans')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors border ${activeGateway === 'midtrans' ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300' : 'bg-transparent border-gray-200 text-gray-500 dark:border-gray-700'}`}>Midtrans Integration (ID)</button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-14 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md flex items-center justify-center">
                    <CreditCard className="text-gray-400" size={24} />
                  </div>
                  <div>
                    <div className="font-black dark:text-white text-lg tracking-widest">•••• •••• •••• 4242</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Primary • Expires 12/28</div>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors">Update Method</button>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 font-bold text-sm hover:border-pitch-lime hover:text-pitch-dark dark:hover:text-white transition-colors bg-gray-50 dark:bg-gray-900/50 uppercase tracking-widest">
                + Launch {activeGateway} Checkout UI
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-pitch-dark text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
             
             <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><BarChart4 className="text-pitch-lime"/> Fair Pricing Model</h3>
             </div>
             <p className="text-sm text-gray-400 font-medium mb-6 relative z-10 leading-relaxed">
                 We believe in total transparency. Here is exactly where your subscription fees are allocated to support the ecosystem.
             </p>
             
             <div className="h-48 relative z-10 mb-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={PRICING_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                            {PRICING_BREAKDOWN.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', color: '#000', border: 'none', fontWeight: 'bold' }} itemStyle={{ color: '#000' }} />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-xl font-black">100%</span>
                 </div>
             </div>

             <div className="space-y-3 relative z-10">
                 {PRICING_BREAKDOWN.map((item, i) => (
                     <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                             <span className="text-xs font-bold text-gray-300">{item.name}</span>
                         </div>
                         <span className="text-sm font-black">{item.value}%</span>
                     </div>
                 ))}
             </div>
           </div>

           {currentTier !== 'Free Tier' && (
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold dark:text-white mb-6 uppercase tracking-tight">Recent Invoices</h3>
                <div className="space-y-4">
                   {[
                     { date: 'Oct 1, 2026', id: 'INV-2026-001', amount: 'Rp2.4M', status: 'Paid', statusColor: 'bg-green-100 text-green-700' },
                     { date: 'Oct 1, 2025', id: 'INV-2025-001', amount: 'Rp2.4M', status: 'Paid', statusColor: 'bg-green-100 text-green-700' },
                     { date: 'Oct 1, 2024', id: 'INV-2024-001', amount: 'Rp2.4M', status: 'Paid', statusColor: 'bg-green-100 text-green-700' },
                   ].map((inv) => (
                     <div key={inv.id} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group cursor-pointer">
                       <div>
                         <div className="font-black dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{inv.amount}</div>
                         <div className="text-[10px] uppercase font-bold text-gray-400">{inv.date} &bull; {inv.id}</div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${inv.statusColor}`}>{inv.status}</span>
                          <Download size={16} className="text-gray-400 group-hover:text-pitch-dark dark:group-hover:text-white transition-colors"/>
                       </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 relative">
             <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                 <X size={24} />
             </button>
             
             <h2 className="text-2xl font-black italic tracking-tighter text-pitch-dark dark:text-white mb-2 uppercase">Upgrade to Enterprise Pro</h2>
             <p className="text-gray-500 font-medium mb-6">You will be billed <strong className="text-pitch-dark dark:text-white">Rp2.4M</strong> annually via {activeGateway}.</p>

             <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl mb-6">
                 <div className="flex justify-between items-center mb-4">
                     <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Plan</span>
                     <span className="font-black dark:text-white">Enterprise Pro Tier</span>
                 </div>
                 <div className="flex justify-between items-center mb-4">
                     <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Subtotal</span>
                     <span className="font-black dark:text-white">Rp2,400,000</span>
                 </div>
                 <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                     <span className="font-black uppercase tracking-widest text-sm">Total Due</span>
                     <span className="font-black text-xl text-pitch-lime bg-pitch-dark px-3 py-1 rounded-md">Rp2.4M</span>
                 </div>
             </div>

             <div className="space-y-4">
                <button 
                  onClick={handleUpgrade} 
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-pitch-dark text-white dark:bg-pitch-lime dark:text-pitch-dark font-black uppercase tracking-widest rounded-xl text-sm shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : 'Confirm Payment'}
                </button>
                <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest"><Shield size={10} className="inline mr-1" /> Secure Encrypted Transaction</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

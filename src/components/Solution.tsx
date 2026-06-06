import { motion } from 'motion/react';
import { Settings, Smartphone, UserCircle2, CalendarDays, LineChart, Wallet } from 'lucide-react';

export function Solution() {
  return (
    <section className="py-24 bg-pitch-darker text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] border-2 border-white rounded-[100px]"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[150px] h-[300px] border-y-2 border-r-2 border-white rounded-r-3xl"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[150px] h-[300px] border-y-2 border-l-2 border-white rounded-l-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pitch-dark text-pitch-lime text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
            The PitchFlow OS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
            One Central Hub
          </h2>
          <p className="text-lg text-gray-300">
            Connect your coaches, parents, players, and admins in one unified platform built specifically for grassroots workflows.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {[
              {
                icon: Settings,
                title: "Admin Dashboard",
                desc: "Command center for payments, registrations, and overviews.",
                color: "bg-white/10 text-white"
              },
              {
                icon: Smartphone,
                title: "Coach's Mobile App",
                desc: "Pitch-side tool for attendance, injury reports, and quick player evaluations.",
                color: "bg-white/10 text-white"
              },
              {
                icon: UserCircle2,
                title: "Parent Portal",
                desc: "Transparent view of schedules, invoices, and child development.",
                color: "bg-white/10 text-white"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-pitch-dark rounded-3xl p-6 border border-white/10 flex gap-6"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] border border-white/10 bg-pitch-dark flex items-center justify-center relative shadow-2xl overflow-hidden">
              <div className="absolute inset-8 rounded-full border border-white/5"></div>
              <div className="absolute inset-16 rounded-full border border-white/5"></div>
              
              <div className="w-32 h-32 bg-pitch-lime rounded-full shadow-[0_0_40px_rgba(198,255,0,0.2)] flex items-center justify-center z-10 text-pitch-dark font-extrabold text-lg text-center leading-tight">
                Player<br/>Profile
              </div>

              <div className="absolute top-12 left-10 p-3 bg-white rounded-2xl shadow-xl flex items-center gap-3 w-40">
                <CalendarDays className="text-blue-500 w-5 h-5 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Next Match</div>
                  <div className="text-xs font-bold text-pitch-text">Sat 10AM</div>
                </div>
              </div>

              <div className="absolute bottom-12 left-8 p-3 bg-white rounded-2xl shadow-xl flex items-center gap-3 w-40 z-20">
                <LineChart className="text-green-500 w-5 h-5 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Skill Rating</div>
                  <div className="text-xs font-bold text-pitch-text">Passing: A-</div>
                </div>
              </div>

              <div className="absolute top-32 right-6 p-3 bg-white rounded-2xl shadow-xl flex items-center gap-3 w-44 z-20">
                <Wallet className="text-orange-500 w-5 h-5 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Subscription</div>
                  <div className="text-xs font-bold text-green-600">Paid (Oct)</div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

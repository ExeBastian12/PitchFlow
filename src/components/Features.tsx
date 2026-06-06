import { motion } from 'motion/react';
import { Database, RefreshCw, CalendarCheck, UserCheck, MessageCircle, TrendingUp, Presentation, Video, Search, Target } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: "Player Database",
    desc: "Digital sign-up forms, medical records, and squad assignments.",
    tag: "Admin"
  },
  {
    icon: RefreshCw,
    title: "Recurring Payments",
    desc: "Automated direct debits and card payments for stable cash flow.",
    tag: "Finance"
  },
  {
    icon: CalendarCheck,
    title: "Intelligent Calendar",
    desc: "Manage multiple pitches and match days. Auto-syncs to parents.",
    tag: "Operations"
  },
  {
    icon: UserCheck,
    title: "Attendance & RSVP",
    desc: "Parents confirm availability. Coaches take attendance in seconds.",
    tag: "Coaching"
  },
  {
    icon: MessageCircle,
    title: "Communication",
    desc: "Broadcast announcements to specific squads or the club.",
    tag: "Community",
    highlight: true
  },
  {
    icon: TrendingUp,
    title: "Progress Cards",
    desc: "FIFA-style attribute cards for players. Track development.",
    tag: "Development"
  },
  {
    icon: Presentation,
    title: "Coach Dashboard",
    desc: "Centralized training plans and match day tactical notes.",
    tag: "Coaching"
  },
  {
    icon: Video,
    title: "Video Feedback",
    desc: "Upload simple phone clips, draw annotations, and share.",
    tag: "Premium",
    highlight: true
  },
  {
    icon: Search,
    title: "Trial & Scouting",
    desc: "Track trialists, manage waitlists, and evaluate talent.",
    tag: "Growth"
  },
  {
    icon: Target,
    title: "Tournament Module",
    desc: "Organize internal leagues or cups. Standings and fixtures.",
    tag: "Operations"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-pitch-text mb-6 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-500">
            Features designed specifically for grassroots operations—not adapted from corporate software.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (idx % 5) * 0.1 }}
              className={`bg-pitch-light rounded-3xl p-6 border ${feature.highlight ? 'border-pitch-lime shadow-sm' : 'border-gray-100'} hover:border-gray-300 transition-colors relative`}
            >
              {feature.highlight && (
                <div className="absolute top-0 right-4 -mt-2 bg-pitch-lime text-pitch-dark text-[8px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                  Popular
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pitch-dark shadow-sm border border-gray-100">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-pitch-text mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

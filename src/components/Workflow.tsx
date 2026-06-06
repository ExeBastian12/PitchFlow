import { motion } from 'motion/react';
import { UserPlus, Users, CalendarDays, CheckSquare, LineChart, MessageCircle } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    num: "01",
    title: "Register",
    desc: "Parents enter details and set up payments in 2 minutes."
  },
  {
    icon: Users,
    num: "02",
    title: "Assign",
    desc: "Group players by age into specific teams."
  },
  {
    icon: CalendarDays,
    num: "03",
    title: "Schedule",
    desc: "Create recurring training and one-off match days."
  },
  {
    icon: CheckSquare,
    num: "04",
    title: "Track",
    desc: "Parents RSVP. Coaches mark attendance with one tap."
  },
  {
    icon: LineChart,
    num: "05",
    title: "Progress",
    desc: "Coaches log ratings directly to the player's profile."
  },
  {
    icon: MessageCircle,
    num: "06",
    title: "Engage",
    desc: "Parents get notified with progress and events."
  }
];

export function Workflow() {
  return (
    <section id="workflow" className="py-24 bg-pitch-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-pitch-text mb-4 tracking-tight">
            How The Pitch Flows
          </h2>
          <p className="text-lg text-gray-500">
            A logical, step-by-step system that replaces your chaotic spreadsheets and group chats.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-pitch-light border border-gray-100 flex items-center justify-center text-pitch-dark">
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-gray-200">{step.num}</span>
              </div>
              <h3 className="text-xl font-bold text-pitch-text mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

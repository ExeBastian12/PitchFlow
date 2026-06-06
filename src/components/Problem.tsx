import { motion } from 'motion/react';
import { MessageSquare, FileSpreadsheet, Wallet, ClipboardList, HelpCircle } from 'lucide-react';

const problems = [
  {
    icon: MessageSquare,
    title: "Endless WhatsApp Chaos",
    description: "Groups for U8s, U10s, Coaches, Parents... Important updates get lost in a sea of thumbs-up emojis and unrelated chat.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: FileSpreadsheet,
    title: "Spreadsheet Nightmares",
    description: "Manually tracking who attended, who paid, and who is injured across 5 different Google Sheets that are never up to date.",
    color: "bg-red-100 text-red-700",
  },
  {
    icon: Wallet,
    title: "Chasing Late Payments",
    description: "Awkward conversations with parents about overdue fees. Manual bank transfer cross-checking takes hours every month.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: ClipboardList,
    title: "Scattered Player Notes",
    description: "Coaches scribble tactical notes and player progress on paper that gets lost. No history of a player's development over the years.",
    color: "bg-[#e0e7ff] text-[#4338ca]",
  },
  {
    icon: HelpCircle,
    title: "Anxious Parents",
    description: "Parents constantly asking 'Is training on?', 'Did my kid play well?', 'When is the next payment due?' because they lack visibility.",
    color: "bg-[#f3e8ff] text-[#7e22ce]",
  }
];

export function Problem() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-pitch-text mb-4 tracking-tight">
            Stop Running Your Club on Duct Tape and WhatsApp
          </h2>
          <p className="text-lg text-gray-500">
            You started a football club because you love the game and developing players. 
            But you spend 80% of your time managing messy administration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-3xl border border-gray-100 bg-pitch-light hover:bg-white hover:border-gray-200 transition-all hover:shadow-sm ${idx === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${problem.color}`}>
                <problem.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-pitch-text mb-3">{problem.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

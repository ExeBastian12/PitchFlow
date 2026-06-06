import { motion } from 'motion/react';

const testimonials = [
  {
    quote: "PitchFlow saved me 12 hours a week on admin. Now I focus on coaching the kids, not chasing payments.",
    name: "Marcus Thorne",
    role: "Academy Director",
    initials: "MT",
    color: "bg-pitch-lime text-pitch-dark"
  },
  {
    quote: "The progress cards are brilliant. I give a quick rating after a session, and parents feel they're getting immense value.",
    name: "David Castillo",
    role: "Head Coach, Sungailiat FC U12 Boys",
    initials: "DC",
    color: "bg-pitch-light text-pitch-dark"
  },
  {
    quote: "As a parent, I love it. I know exactly when training is, and I get a notification if an away match is cancelled.",
    name: "Sarah Jenkins",
    role: "Parent",
    initials: "SJ",
    color: "bg-blue-100 text-blue-700"
  },
  {
    quote: "We manage 300+ students. The attendance tracking ensures every child is safe and accounted for.",
    name: "Michael Chen",
    role: "School Coordinator",
    initials: "MC",
    color: "bg-purple-100 text-purple-700"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-pitch-darker text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Loved by the <span className="text-pitch-lime">Community</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Don't just take our word for it. Here is what club operations look like after making the switch.
            </p>
            <div className="flex gap-4">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-pitch-darker bg-gray-600"></div>
                <div className="w-10 h-10 rounded-full border-2 border-pitch-darker bg-gray-500"></div>
                <div className="w-10 h-10 rounded-full border-2 border-pitch-darker bg-gray-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-pitch-darker bg-pitch-lime flex items-center justify-center text-pitch-dark font-bold text-xs">+500</div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-pitch-dark border border-white/10 p-6 rounded-3xl flex flex-col"
              >
                <p className="text-sm text-gray-300 leading-relaxed mb-6 italic flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

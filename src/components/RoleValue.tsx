import { motion } from 'motion/react';

const roles = [
  {
    role: "Club Owners",
    value: "Predict cash flow with recurring payments, see real-time attendance, and look like a premium academy.",
    color: "bg-pitch-dark text-white"
  },
  {
    role: "Admins",
    value: "Save 10+ hours a week. Say goodbye to manual payment cross-checking and lost medical forms.",
    color: "bg-pitch-darker text-white"
  },
  {
    role: "Coaches",
    value: "Get a clean list of players who are coming and track development easily without carrying a binder.",
    color: "bg-pitch-lime text-pitch-dark"
  },
  {
    role: "Parents",
    value: "Know exactly when to drop off kids, see what they are learning, and receive progress reports.",
    color: "bg-white text-pitch-text border border-gray-100"
  },
  {
    role: "Schools",
    value: "Manage after-school football programs safely. Ensure every child is accounted for instantly.",
    color: "bg-gray-100 text-pitch-text"
  }
];

export function RoleValue() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-pitch-text mb-6 tracking-tight">
            Built for the Whole Team
          </h2>
          <p className="text-lg text-gray-500">
            A club isn't just players. It's an ecosystem. PitchFlow is designed to give every stakeholder exactly what they need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`${item.color} rounded-3xl p-8 shadow-sm ${idx === 3 ? 'md:col-span-1 lg:col-start-2' : ''} ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <h3 className="text-2xl font-bold mb-3">{item.role}</h3>
              <p className="opacity-90 leading-relaxed text-sm">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

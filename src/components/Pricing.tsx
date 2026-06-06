import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: "Starter",
    target: "Small SSB, Schools, Futsal",
    price: "29",
    features: [
      "Schedule & Calendar",
      "Attendance Tracking",
      "Parent RSVP",
      "In-App Communication",
      "Player List (Up to 50)"
    ],
    highlight: false
  },
  {
    name: "Core",
    target: "SSB & Academies (100-250)",
    price: "59",
    features: [
      "Everything in Starter",
      "Online Registration Forms",
      "Recurring Subscriptions",
      "Player Progress Cards",
      "Automated Parent Updates"
    ],
    highlight: true
  },
  {
    name: "Growth",
    target: "Academies (250-500)",
    price: "99",
    features: [
      "Everything in Core",
      "Multi-Team Management",
      "Dedicated Coach Dashboard",
      "Basic Video Feedback",
      "Financial Reporting"
    ],
    highlight: false
  },
  {
    name: "Pro",
    target: "Large Academies",
    price: "199",
    features: [
      "Everything in Growth",
      "White Label App Icon",
      "Advanced Video Analysis",
      "Custom Workflows",
      "Priority VIP Support"
    ],
    highlight: false
  }
];

export function Pricing({ onSignup }: { onSignup?: () => void }) {
  return (
    <section id="pricing" className="py-24 bg-pitch-light border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-pitch-text mb-6 tracking-tight flex items-center justify-center gap-3">
             Fair Pricing
          </h2>
          <p className="text-lg text-gray-500">
            No sneaky per-player fees that punish you for growing. <br className="hidden md:block" /> Flat monthly rates based on your operational needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl p-6 border flex flex-col bg-white ${
                tier.highlight 
                  ? 'border-pitch-dark shadow-xl xl:scale-105 z-10 p-8' 
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-6 -mt-3 bg-pitch-lime text-pitch-dark px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-pitch-dark">
                  Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-1 text-pitch-text`}>
                  {tier.name}
                </h3>
                <div className="text-xs text-gray-500">{tier.target}</div>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-black text-pitch-text">${tier.price}</span>
                <span className="text-gray-500 font-medium text-sm">/mo</span>
              </div>

              <div className="flex-1 space-y-3 mb-8">
                {tier.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlight ? 'text-pitch-dark' : 'text-gray-400'}`} />
                    <span className="text-gray-600 text-xs leading-relaxed font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <button onClick={onSignup} className={`w-full py-3 rounded-full font-bold transition-all text-sm ${
                tier.highlight
                  ? 'bg-pitch-dark hover:bg-pitch-darker text-white'
                  : 'bg-pitch-light hover:bg-gray-200 text-pitch-text border border-gray-200'
              }`}>
                Start Free Trial
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: "Is PitchFlow only for football?", a: "While PitchFlow is built with a deep understanding of football workflows (squads, pitches, specific tactics), the core scheduling, payment, and communication features work perfectly for futsal, rugby, or field hockey clubs as well." },
  { q: "Can parents use it?", a: "Yes! Parents have their own portal (accessible via web or mobile app) where they can see schedules, RSVP to matches, view invoices, and read their child's progress cards." },
  { q: "Can coaches track player progress?", a: "Absolutely. Coaches can fill out simple digital attribute cards (rating passing, shooting, attitude, etc.) and write quick notes. This creates a historical record of a player's development." },
  { q: "Does it replace WhatsApp?", a: "Yes. PitchFlow includes one-way announcements and dedicated squad messaging, keeping club information organized and separating critical updates from general chatter." },
  { q: "Can clubs collect payments?", a: "Yes. You can set up one-off registration fees or recurring monthly subscriptions via our secure Stripe integration." },
  { q: "Can we migrate from spreadsheets?", a: "Yes, we offer a simple CSV import tool. You can upload your existing Excel or Google Sheets roster." },
  { q: "Does PitchFlow support multiple teams?", a: "Yes, even our Starter plan allows multiple squads. Our Growth and Pro plans include advanced filtering and multi-team dashboard views." },
  { q: "Is video feedback included?", a: "Basic video uploads are available on the Growth plan. Advanced annotation and deep video analysis integrations are available on the Pro tier." }
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-pitch-text mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-500">
            Clear answers about how PitchFlow works for your club.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-pitch-light border rounded-2xl overflow-hidden transition-colors ${openIdx === idx ? 'border-pitch-lime shadow-sm' : 'border-gray-100'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <span className={`font-bold text-sm md:text-base ${openIdx === idx ? 'text-pitch-dark' : 'text-pitch-text'}`}>
                  {faq.q}
                </span>
                <div className={`shrink-0 ml-4 rounded-full p-1 transition-colors ${openIdx === idx ? 'bg-pitch-lime text-pitch-dark' : 'text-gray-400'}`}>
                  {openIdx === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="w-full h-px bg-gray-200 mb-4"></div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

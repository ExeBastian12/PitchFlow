import { ArrowRight } from 'lucide-react';

export function FooterCTA({ onSignup }: { onSignup?: () => void }) {
  return (
    <section className="py-24 bg-pitch-darker relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pitch-lime opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Ready To Run Your Club Like A <br className="hidden md:block"/> Modern Academy?
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
          Join hundreds of top grassroots clubs using PitchFlow to automate payments, organize schedules, and develop better players.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pitch-lime hover:bg-[#b0e600] text-pitch-dark px-8 py-4 rounded-full text-sm font-bold transition-all hover:shadow-lg active:scale-95">
            Book a Demo
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onSignup} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 px-8 py-4 rounded-full text-sm font-bold transition-all active:scale-95">
            Start Free Trial
          </button>
        </div>
        
        <p className="mt-8 text-xs text-gray-500 font-bold uppercase tracking-widest">
          No credit card required. Setup takes less than 10 minutes.
        </p>
      </div>
    </section>
  );
}

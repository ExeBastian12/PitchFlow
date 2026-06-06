import { Activity, Trophy, MoveUpRight } from 'lucide-react';

export function MarketTrust() {
  return (
    <section className="py-16 bg-pitch-light border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pitch-dark rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
          
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
              Grassroots Football is Maturing
            </h2>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Expectations from parents and bodies are higher than ever. Top clubs are moving away from manual methods to secure, compliant OS platforms.
            </p>
            <div className="flex items-center gap-2 text-pitch-lime font-bold cursor-pointer group text-sm">
              Read our Industry Report 
              <MoveUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-pitch-lime mb-2"><Activity className="w-6 h-6" /></div>
              <div className="text-3xl font-extrabold mb-1">42%</div>
              <div className="text-xs text-gray-400">of parent complaints stem from schedule miscommunication</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-pitch-lime mb-2"><Trophy className="w-6 h-6" /></div>
              <div className="text-3xl font-extrabold mb-1">60hrs</div>
              <div className="text-xs text-gray-400">saved per month on admin by clubs switching to PitchFlow</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

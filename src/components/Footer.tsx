import { Activity, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#05110A] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-8 h-8 rounded-lg bg-pitch-lime flex items-center justify-center p-0">
                <div className="w-4 h-4 border-2 border-pitch-dark rounded-full"></div>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Pitch<span className="text-pitch-lime">Flow</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6 text-sm leading-relaxed">
              The all-in-one operating system for modern grassroots football clubs, academies, and schools. Built for the pitch, designed for growth.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-pitch-dark hover:bg-pitch-lime transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-pitch-dark hover:bg-pitch-lime transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-pitch-dark hover:bg-pitch-lime transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 tracking-wide text-sm">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Mobile App</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Parent Portal</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 tracking-wide text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Club Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Webinars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Drill Database</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 tracking-wide text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pitch-lime text-xs transition-colors">Partners</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
            <a href="#" className="hover:text-white transition-colors">Data Privacy</a>
            <a href="#" className="hover:text-white transition-colors">API Access</a>
          </div>
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PITCHFLOW TECHNOLOGIES LTD. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}

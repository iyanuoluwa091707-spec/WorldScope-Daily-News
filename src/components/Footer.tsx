import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* WorldScope Daily Logo in Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <Logo variant="footer" theme="light" />
          <div className="text-xs text-gray-500 font-medium">
            Authoritative, independent global journalism and editorial publishing wire.
          </div>
        </div>

        {/* Categories Directory */}
        <div className="py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-sm border-b border-gray-100">
          <div>
            <h4 className="font-bold text-black uppercase text-xs tracking-wider mb-3">News Desks</h4>
            <ul className="space-y-2 text-gray-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-black hover:underline">UK News</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-black hover:underline">Politics</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-black hover:underline">England</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-black hover:underline">Scotland</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-black hover:underline">Wales</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black uppercase text-xs tracking-wider mb-3">Sport</h4>
            <ul className="space-y-2 text-gray-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-black hover:underline">Football</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-black hover:underline">Premier League</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-black hover:underline">Formula 1</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-black hover:underline">Rugby Union</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-black hover:underline">Cricket</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black uppercase text-xs tracking-wider mb-3">Health & Science</h4>
            <ul className="space-y-2 text-gray-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-black hover:underline">NHS Updates</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-black hover:underline">Medical Science</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-black hover:underline">Public Wellbeing</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-black hover:underline">Clinical Trials</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black uppercase text-xs tracking-wider mb-3">Technology</h4>
            <ul className="space-y-2 text-gray-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-black hover:underline">Artificial Intelligence</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-black hover:underline">Silicon Tech</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-black hover:underline">Cybersecurity</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-black hover:underline">Quantum Devices</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black uppercase text-xs tracking-wider mb-3">Business</h4>
            <ul className="space-y-2 text-gray-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-black hover:underline">UK Economy</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-black hover:underline">Markets</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-black hover:underline">City of London</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-black hover:underline">Worklife</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black uppercase text-xs tracking-wider mb-3">Culture & Arts</h4>
            <ul className="space-y-2 text-gray-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-black hover:underline">Film & Television</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-black hover:underline">Design & Architecture</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-black hover:underline">Literature</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-black hover:underline">Art Exhibitions</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Policy Bar */}
      <div className="bg-gray-100 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-[11px] font-bold text-gray-500 uppercase border-t border-gray-200 gap-3">
        <span>Copyright © 2026 WorldScope Daily. All rights reserved. WorldScope Daily is not responsible for the content of external sites.</span>
        <div className="flex flex-wrap gap-4">
          <span className="hover:text-black cursor-pointer">About WorldScope</span>
          <span className="hover:text-black cursor-pointer">Privacy Policy</span>
          <span className="hover:text-black cursor-pointer">Cookies</span>
          <span className="hover:text-black cursor-pointer">Contact Us</span>
        </div>
      </div>
    </footer>
  );
};

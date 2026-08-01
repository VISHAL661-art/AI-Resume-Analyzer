import React from 'react';
import { FileText, Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080b12] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-300">AI Resume Analyzer</span>
            <span className="text-xs text-slate-500">• Production Spring Boot & React</span>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" /> Java 21, Spring Security, JWT, PDFBox & React Tailwind
          </p>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

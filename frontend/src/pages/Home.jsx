import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FileText, Cpu, CheckCircle2, ShieldCheck, Zap, ArrowRight, Sparkles, BarChart3, FileSearch, Lock } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-pulse-subtle">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Rule-Based ATS Resume Intelligence Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Optimize Your Resume for <br className="hidden sm:inline" />
            <span className="gradient-text">Applicant Tracking Systems</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Upload your PDF resume, paste a target job description, and get instant 
            ATS score, keyword match rates, missing tech skills, and actionable improvements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group"
            >
              Analyze Your Resume Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800/80 rounded-xl border border-slate-700/80 transition-all text-center"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 glass-card p-6 rounded-2xl border border-slate-800">
            <div>
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400 font-medium">Deterministic Rule-Based</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-400">PDFBox</p>
              <p className="text-xs text-slate-400 font-medium">Native PDF Text Parsing</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-purple-400">0–100</p>
              <p className="text-xs text-slate-400 font-medium">ATS Match Score</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-400">JWT</p>
              <p className="text-xs text-slate-400 font-medium">BCrypt Secured API</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Everything You Need to Pass Initial Screening
          </h2>
          <p className="text-slate-400 text-sm">
            Architected with Spring Boot, Spring Security, Hibernate, MySQL and React.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Apache PDFBox Extraction</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Extract raw text directly from PDF resumes server-side without external cloud dependencies.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/40 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Keyword & Skill Gap Analysis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatically identify matched skills vs. missing high-impact technical keywords required by job postings.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">JWT Auth & Protected REST APIs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enterprise-grade stateless authentication using Spring Security filters, BCrypt password hashing, and user token verification.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

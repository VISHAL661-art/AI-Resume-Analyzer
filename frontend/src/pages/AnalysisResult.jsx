import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';
import { analysisService } from '../services/analysisService';
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Sparkles, Target, Zap, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const AnalysisResult = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJd, setShowJd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await analysisService.getAnalysisById(id);
        setAnalysis(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load analysis report');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Generating ATS Analysis Breakdown...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-slate-800 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Analysis Not Found</h2>
            <p className="text-sm text-slate-400 mb-6">{error || 'The requested analysis report could not be located.'}</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { fileName, atsScore, matchedSkills = [], missingSkills = [], strengths = [], improvements = [], jobDescription, createdAt } = analysis;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl font-bold text-white tracking-tight">ATS Analysis Report</h1>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400 inline" />
                {fileName} • Evaluated on {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/upload?resumeId=${analysis.resumeId}`}
                className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm font-semibold border border-indigo-500/30 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Re-Analyze
              </Link>
            </div>
          </div>

          {/* Top Score Gauge & Breakdown Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Score Gauge Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                Overall ATS Compatibility
              </span>
              <ScoreGauge score={atsScore} size={200} strokeWidth={16} />
              <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-xs">
                Score based on skill match rate, section hierarchy, and formatting density.
              </p>
            </div>

            {/* Matched vs Missing Skills Summary */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Matched Skills Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Matching Skills ({matchedSkills.length})
                  </h3>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Found in Resume
                  </span>
                </div>

                {matchedSkills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No direct skill matches detected in resume text.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill, i) => (
                      <SkillBadge key={i} skill={skill} type="matched" />
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Skills Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    Missing Skills ({missingSkills.length})
                  </h3>
                  <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    Required by JD
                  </span>
                </div>

                {missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Awesome! No missing required skills detected.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, i) => (
                      <SkillBadge key={i} skill={skill} type="missing" />
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Strengths & Improvements Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Resume Strengths */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Resume Strengths
              </h3>
              <ul className="space-y-3">
                {strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {improvements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Collapsible Job Description Reference */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <button
              onClick={() => setShowJd(!showJd)}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
            >
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                View Target Job Description
              </span>
              {showJd ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showJd && (
              <div className="p-6 border-t border-slate-800 bg-slate-950/60">
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {jobDescription}
                </pre>
              </div>
            )}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

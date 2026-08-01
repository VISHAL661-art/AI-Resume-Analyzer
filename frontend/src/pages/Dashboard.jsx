import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { StatCard } from '../components/StatCard';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { FileText, UploadCloud, Trash2, ExternalLink, BarChart2, Award, Clock, ArrowRight, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getUserResumes();
      setResumes(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeService.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete resume');
    }
  };

  const handleAnalyzeClick = (resumeId) => {
    navigate(`/upload?resumeId=${resumeId}`);
  };

  const handleViewAnalysis = async (resumeId, e) => {
    e.stopPropagation();
    try {
      const res = await analysisService.getLatestAnalysisByResume(resumeId);
      if (res.data) {
        navigate(`/analysis/${res.data.id}`);
      }
    } catch (err) {
      // If no analysis exists yet, redirect to upload/analyze
      navigate(`/upload?resumeId=${resumeId}`);
    }
  };

  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / totalResumes)
    : 0;
  const topScore = totalResumes > 0
    ? Math.max(...resumes.map((r) => r.atsScore || 0))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Resume Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">
                Overview of your uploaded resumes, parsing status, and ATS optimization benchmarks
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New PDF
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-3 gap-5">
            <StatCard
              title="Uploaded Resumes"
              value={totalResumes}
              subtitle="Saved in database"
              icon={FileText}
              color="indigo"
            />
            <StatCard
              title="Average ATS Score"
              value={`${avgScore}%`}
              subtitle="Target: 75%+"
              icon={BarChart2}
              color="purple"
            />
            <StatCard
              title="Top Score Reached"
              value={`${topScore}%`}
              subtitle="Best match evaluation"
              icon={Award}
              color="emerald"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Resumes List Table / Grid */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Your PDF Resumes</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click any resume to run ATS Job Description analysis</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {resumes.length} Files
              </span>
            </div>

            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400">Loading uploaded resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Resumes Uploaded Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Upload a PDF resume to parse contents with Apache PDFBox and analyze ATS match score.
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/30"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload First Resume
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {resumes.map((r) => {
                  const score = r.atsScore || 0;
                  let scoreBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  if (score < 50) scoreBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                  else if (score < 75) scoreBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                  return (
                    <div
                      key={r.id}
                      onClick={() => handleAnalyzeClick(r.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                              {r.fileName}
                            </h4>
                            {score > 0 && (
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${scoreBadge}`}>
                                {score}% ATS
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            Uploaded {new Date(r.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          {r.parsedTextSnippet && (
                            <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 italic max-w-md">
                              "{r.parsedTextSnippet}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={(e) => handleViewAnalysis(r.id, e)}
                          className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all flex items-center gap-1.5"
                          title="View analysis report"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          Analyze / Results
                        </button>
                        <button
                          onClick={(e) => handleDelete(r.id, e)}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all"
                          title="Delete resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

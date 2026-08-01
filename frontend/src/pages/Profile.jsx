import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { resumeService } from '../services/resumeService';
import { User, Mail, Calendar, ShieldCheck, FileText, Award, BarChart2, Trash2 } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await resumeService.getUserResumes();
        setResumes(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / totalResumes)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h1 className="text-2xl font-bold text-white tracking-tight">User Account Profile</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your credentials, view stored data, and track resume score progress
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Profile Summary Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-600/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              </div>

              <div className="w-full pt-4 border-t border-slate-800/80 space-y-3 text-left">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <User className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>ID: #{user?.id}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>
                    Member since{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                      : '2026'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>JWT Encrypted Session Active</span>
                </div>
              </div>
            </div>

            {/* Account Activity Stats */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Resumes Uploaded</span>
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{totalResumes}</p>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Average ATS Score</span>
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{avgScore}%</p>
                </div>
              </div>

              {/* Uploaded Files History */}
              <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Saved PDF Documents
                </h3>

                {loading ? (
                  <p className="text-xs text-slate-400">Loading saved resumes...</p>
                ) : resumes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No saved PDF resumes found.</p>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-200">{r.fileName}</p>
                          <p className="text-[11px] text-slate-500">
                            Uploaded {new Date(r.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                          {r.atsScore || 0}% ATS
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

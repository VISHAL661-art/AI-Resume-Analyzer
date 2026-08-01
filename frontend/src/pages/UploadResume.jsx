import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { UploadCloud, FileText, Sparkles, CheckCircle, AlertCircle, FileSearch, ArrowRight, RefreshCw } from 'lucide-react';

export const UploadResume = () => {
  const [searchParams] = useSearchParams();
  const preselectedResumeId = searchParams.get('resumeId');

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(preselectedResumeId || '');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await resumeService.getUserResumes();
        const list = res.data || [];
        setResumes(list);
        if (preselectedResumeId) {
          setSelectedResumeId(preselectedResumeId);
        } else if (list.length > 0) {
          setSelectedResumeId(list[0].id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, [preselectedResumeId]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (selectedFile) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setError('');

    // Trigger upload
    setUploading(true);
    setUploadProgress(20);

    try {
      const res = await resumeService.uploadResume(selectedFile, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      setSuccessMsg(`Uploaded ${selectedFile.name} successfully! Text parsed with PDFBox.`);
      const uploaded = res.data;
      setResumes((prev) => [uploaded, ...prev]);
      setSelectedResumeId(uploaded.id.toString());
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFillSampleJd = () => {
    setJobDescription(
      `Senior Full Stack Developer (Java & React)
Requirements:
- 3+ years of experience with Java 17/21, Spring Boot, Spring Security, JWT authentication, and Hibernate/JPA.
- Hands-on expertise with MySQL, Docker, RESTful APIs, and Microservices architecture.
- Frontend proficiency in React, JavaScript/TypeScript, HTML5, CSS3, Tailwind CSS, and Axios.
- Familiarity with Git, CI/CD pipelines, Maven, Unit Testing (JUnit), and Agile/Scrum methodologies.
- Strong problem-solving skills, leadership, and effective communication.`
    );
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedResumeId) {
      setError('Please upload or select a resume PDF first.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please paste a Job Description to analyze.');
      return;
    }

    setAnalyzing(true);

    try {
      const res = await analysisService.analyzeResume(parseInt(selectedResumeId, 10), jobDescription);
      if (res.data) {
        navigate(`/analysis/${res.data.id}`);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h1 className="text-2xl font-bold text-white tracking-tight">Upload & Analyze Resume</h1>
            <p className="text-sm text-slate-400 mt-1">
              Select a PDF resume, paste target job requirements, and generate instant ATS match scores.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Step 1: Upload / Select Resume */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 text-[11px] flex items-center justify-center font-extrabold">1</span>
                    PDF Resume Upload
                  </span>
                  {resumes.length > 0 && (
                    <span className="text-xs text-slate-400">{resumes.length} saved resume(s)</span>
                  )}
                </div>

                {/* Resume Selector dropdown if existing resumes exist */}
                {resumes.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select Existing Uploaded Resume
                    </label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.fileName} (Score: {r.atsScore || 0}%)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Drag and Drop Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {resumes.length > 0 ? 'Or Upload a New PDF' : 'Upload PDF Document'}
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          <span className="text-indigo-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PDF format up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>Parsing with PDFBox...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Job Description Input */}
            <div className="space-y-6">
              <form onSubmit={handleRunAnalysis} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 text-[11px] flex items-center justify-center font-extrabold">2</span>
                    Target Job Description
                  </span>
                  <button
                    type="button"
                    onClick={handleFillSampleJd}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Load Sample JD
                  </button>
                </div>

                <div>
                  <textarea
                    rows={10}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description requirements here (e.g. Senior Java Developer, Spring Boot, React, SQL, Microservices...)"
                    className="w-full p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={analyzing || !selectedResumeId || !jobDescription.trim()}
                  className="w-full py-4 px-6 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Evaluating ATS Compatibility...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-5 h-5" />
                      Run ATS Match Analysis
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

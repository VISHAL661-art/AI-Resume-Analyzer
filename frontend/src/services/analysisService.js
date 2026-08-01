import api from './api';

export const analysisService = {
  async analyzeResume(resumeId, jobDescription) {
    return await api.post('/analysis/analyze', {
      resumeId,
      jobDescription,
    });
  },

  async getAnalysisById(id) {
    return await api.get(`/analysis/${id}`);
  },

  async getLatestAnalysisByResume(resumeId) {
    return await api.get(`/analysis/resume/${resumeId}`);
  },
};

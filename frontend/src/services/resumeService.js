import api from './api';

export const resumeService = {
  async uploadResume(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  async getUserResumes() {
    return await api.get('/resume');
  },

  async getResumeById(id) {
    return await api.get(`/resume/${id}`);
  },

  async deleteResume(id) {
    return await api.delete(`/resume/${id}`);
  },
};

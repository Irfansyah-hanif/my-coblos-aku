import axios from 'axios';

const apiBase = axios.create({ baseURL: 'http://localhost:3000/api' });

export const api = {
  login: (d) => apiBase.post('/login', d).then(r => r.data),
  getCandidates: () => apiBase.get('/candidates').then(r => r.data),
  getCandidateDetail: (id) => apiBase.get(`/candidates/${id}`).then(r => r.data),
  updateProfile: (id, d) => apiBase.put(`/candidate/${id}`, d).then(r => r.data),
  
  // BERITA
  getNews: () => apiBase.get('/news').then(r => r.data),
  getNewsDetail: (id) => apiBase.get(`/news/${id}`).then(r => r.data),
  
  // Post Berita (Multipart form data untuk upload)
  postNews: (formData) => apiBase.post('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),

  // Update Berita (BARU)
  updateNews: (id, formData) => apiBase.put(`/news/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),

  deleteNews: (id) => apiBase.delete(`/news/${id}`).then(r => r.data),
  
  submitVote: (d) => apiBase.post('/vote', d).then(r => r.data),
  getResults: () => apiBase.get('/results').then(r => r.data),
};
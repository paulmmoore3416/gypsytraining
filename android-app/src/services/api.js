import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL (your computer's local IP)
const API_BASE_URL = 'http://192.168.1.128:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  verify: () => api.get('/auth/verify'),
};

export const trainingAPI = {
  getSessions: () => api.get('/training/sessions'),
  getProgress: () => api.get('/training/progress'),
  createSession: (session) => api.post('/training/sessions', session),
  updateProgress: (progress) => api.post('/training/progress', progress),
  sync: (data) => api.post('/training/sync', data),
};

export const journalAPI = {
  getEntries: () => api.get('/journal'),
  createEntry: (entry) => api.post('/journal', entry),
};

export const photoAPI = {
  getAlbums: () => api.get('/photos/albums'),
  getPhotos: (albumId) => api.get(`/photos/album/${albumId}`),
  createAlbum: (album) => api.post('/photos/album', album),
  uploadPhoto: (photo) => api.post('/photos/photo', photo),
};

export const nutritionAPI = {
  getLogs: () => api.get('/nutrition'),
  createLog: (log) => api.post('/nutrition', log),
};

export const syncAPI = {
  fullSync: () => api.get('/sync/full'),
  incrementalSync: (since) => api.get('/sync/incremental', { params: { since } }),
  recordMetadata: (deviceId, syncType) =>
    api.post('/sync/metadata', { device_id: deviceId, sync_type: syncType }),
};

export default api;

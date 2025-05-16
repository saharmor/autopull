import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Necessary for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
export const authApi = {
  completeGitHubAuth: async (userId) => {
    const response = await apiClient.post('/auth/github-token', { code: userId });
    return response.data;
  },
  
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return null;
      }
      throw error;
    }
  },
  
  getUserRepositories: async () => {
    const response = await apiClient.get('/auth/repositories');
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Repository API
export const repositoryApi = {
  scanRepository: async (repositoryUrl) => {
    const response = await apiClient.post('/repositories/scan', { repository_url: repositoryUrl });
    return response.data;
  },
  
  getScanStatus: async (scanId) => {
    const response = await apiClient.get(`/repositories/scan/${scanId}`);
    return response.data;
  },
  
  implementIssue: async (scanId, issueId) => {
    const response = await apiClient.post('/repositories/implement', { scan_id: scanId, issue_id: issueId });
    return response.data;
  },
  
  getImplementationStatus: async (implementationId) => {
    const response = await apiClient.get(`/repositories/implement/${implementationId}`);
    return response.data;
  },
};

export default apiClient; 
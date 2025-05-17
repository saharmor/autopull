import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create an axios instance with default configs
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true // Always include credentials for all requests
});

export const api = {
  // Auth endpoints
  getGithubAuthUrl: () => `${API_URL}/auth/github`,
  
  verifyUser: (userId) => 
    axiosInstance.post(`/auth/github-token`, { code: userId }),
  
  getRepositories: () => 
    axiosInstance.get(`/auth/repositories`),
  
  logout: () => 
    axiosInstance.post(`/auth/logout`, {}),
  
  // Repository endpoints
  scanRepository: (repositoryUrl) => 
    axiosInstance.post(`/repositories/scan`, { repository_url: repositoryUrl }),
  
  getScanStatus: (scanId) => 
    axiosInstance.get(`/repositories/scan/${scanId}`),
  
  implementIssue: (scanId, issueId) => 
    axiosInstance.post(`/repositories/implement`, { scan_id: scanId, issue_id: issueId }),
  
  getImplementationStatus: (implementationId) => 
    axiosInstance.get(`/repositories/implement/${implementationId}`)
};

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create an axios instance with default config
const axiosInstance = axios.create({
  withCredentials: true, // Always include credentials for all requests
});

export const api = {
  // Auth endpoints
  getGithubAuthUrl: () => `${API_URL}/auth/github`,
  
  verifyUser: (userId) => 
    axiosInstance.post(`${API_URL}/auth/github-token`, { code: userId }),
  
  getRepositories: () => 
    axiosInstance.get(`${API_URL}/auth/repositories`),
  
  logout: () => 
    axiosInstance.post(`${API_URL}/auth/logout`, {}),
  
  // Repository endpoints
  scanRepository: (repositoryUrl) => 
    axiosInstance.post(`${API_URL}/repositories/scan`, { repository_url: repositoryUrl }),
  
  getScanStatus: (scanId) => 
    axiosInstance.get(`${API_URL}/repositories/scan/${scanId}`),
  
  implementIssue: (scanId, issueId) => 
    axiosInstance.post(`${API_URL}/repositories/implement`, { scan_id: scanId, issue_id: issueId }),
  
  getImplementationStatus: (implementationId) => 
    axiosInstance.get(`${API_URL}/repositories/implement/${implementationId}`)
};

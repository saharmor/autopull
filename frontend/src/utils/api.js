import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = {
  // Auth endpoints
  getGithubAuthUrl: () => `${API_URL}/auth/github`,
  
  verifyUser: (userId) => 
    axios.post(`${API_URL}/auth/github-token`, { code: userId }),
  
  getRepositories: () => 
    axios.get(`${API_URL}/auth/repositories`, { withCredentials: true }),
  
  logout: () => 
    axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }),
  
  // Repository endpoints
  scanRepository: (repositoryUrl) => 
    axios.post(`${API_URL}/repositories/scan`, { repository_url: repositoryUrl }),
  
  getScanStatus: (scanId) => 
    axios.get(`${API_URL}/repositories/scan/${scanId}`),
  
  implementIssue: (scanId, issueId) => 
    axios.post(`${API_URL}/repositories/implement`, { scan_id: scanId, issue_id: issueId }),
  
  getImplementationStatus: (implementationId) => 
    axios.get(`${API_URL}/repositories/implement/${implementationId}`)
};

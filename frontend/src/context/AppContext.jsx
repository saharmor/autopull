import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [scanStatus, setScanStatus] = useState(null);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [implementationId, setImplementationId] = useState(null);
  const [implementationStatus, setImplementationStatus] = useState(null);
  const [pullRequest, setPullRequest] = useState(null);
  
  // Initialize user from URL params if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id');
    
    if (userId) {
      verifyUser(userId);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  // Verify user with backend
  const verifyUser = async (userId) => {
    try {
      setLoading(true);
      const response = await api.verifyUser(userId);
      setUser(response.data);
      fetchRepositories();
    } catch (err) {
      setError('Failed to authenticate with GitHub');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user repositories
  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await api.getRepositories();
      setRepositories(response.data.repositories);
    } catch (err) {
      setError('Failed to fetch repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Start repository scan
  const scanRepository = async (repoUrl) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.scanRepository(repoUrl);
      setScanId(response.data.scan_id);
      setScanStatus(response.data.status);
      return response.data.scan_id;
    } catch (err) {
      setError('Failed to start repository scan');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Check scan status
  const checkScanStatus = async (id) => {
    try {
      const scanId = id || scanId;
      if (!scanId) return;
      
      const response = await api.getScanStatus(scanId);
      setScanStatus(response.data.status);
      
      if (response.data.status === 'completed' && response.data.issues) {
        setIssues(response.data.issues);
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to check scan status');
      console.error(err);
      return null;
    }
  };
  
  // Start issue implementation
  const implementIssue = async (issue) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedIssue(issue);
      
      const response = await api.implementIssue(scanId, issue.id);
      setImplementationId(response.data.implementation_id);
      setImplementationStatus(response.data.status);
      
      return response.data.implementation_id;
    } catch (err) {
      setError('Failed to start issue implementation');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Check implementation status
  const checkImplementationStatus = async (id) => {
    try {
      const implId = id || implementationId;
      if (!implId) return;
      
      const response = await api.getImplementationStatus(implId);
      setImplementationStatus(response.data.status);
      
      if (response.data.status === 'completed' && response.data.pull_request) {
        setPullRequest(response.data.pull_request);
      }
      
      return response.data;
    } catch (err) {
      setError('Failed to check implementation status');
      console.error(err);
      return null;
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setRepositories([]);
      setSelectedRepo(null);
      setScanId(null);
      setScanStatus(null);
      setIssues([]);
      setSelectedIssue(null);
      setImplementationId(null);
      setImplementationStatus(null);
      setPullRequest(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    repositories,
    selectedRepo,
    scanId,
    scanStatus,
    issues,
    selectedIssue,
    implementationId,
    implementationStatus,
    pullRequest,
    setSelectedRepo,
    scanRepository,
    checkScanStatus,
    implementIssue,
    checkImplementationStatus,
    logout
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

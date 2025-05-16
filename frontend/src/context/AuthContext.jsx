import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        
        if (userData) {
          fetchRepositories();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchRepositories = async () => {
    setLoadingRepos(true);
    try {
      const repoData = await authApi.getUserRepositories();
      setRepositories(repoData.repositories);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoadingRepos(false);
    }
  };

  const initiateGitHubLogin = () => {
    window.location.href = '/api/auth/github';
  };

  const completeGitHubAuth = async (userId) => {
    try {
      const userData = await authApi.completeGitHubAuth(userId);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error completing GitHub auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setRepositories([]);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      repositories,
      loadingRepos,
      initiateGitHubLogin,
      completeGitHubAuth,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
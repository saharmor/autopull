import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { user, login, getGitHubLoginUrl } = useAuth();
  const navigate = useNavigate();
  const [loginUrl, setLoginUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    } else {
      const fetchLoginUrl = async () => {
        try {
          const url = await getGitHubLoginUrl();
          setLoginUrl(url);
        } catch (error) {
          console.error('Error fetching GitHub login URL:', error);
          setError('Error fetching GitHub login URL. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchLoginUrl();
    }
  }, [user, navigate, getGitHubLoginUrl]);

  // For demo purposes, mock the GitHub OAuth flow
  const handleMockLogin = async () => {
    setLoading(true);
    try {
      // Send a mock code to simulate the OAuth callback
      await login('mock_code');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login to Viral Devin</h1>
        
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-6 text-gray-700">
              Connect with your GitHub account to get started.
            </p>
            <button
              onClick={handleMockLogin}
              className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              Connect with GitHub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 
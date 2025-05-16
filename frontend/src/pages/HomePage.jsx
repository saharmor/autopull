import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { repositoryApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await repositoryApi.scanRepository(repoUrl);
      navigate(`/scan/${response.scan_id}`);
    } catch (error) {
      console.error('Error scanning repository:', error);
      setError('Error scanning repository. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Viral Devin</h1>
          <p className="text-xl text-gray-700 mb-8">
            Use AI to find and implement "low-hanging fruit" issues in GitHub repositories.
          </p>
          <div className="flex justify-center">
            <a
              href="/login"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Login with GitHub to get started
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Find Issues to Implement</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
            >
              {loading ? 'Scanning Repository...' : 'Scan Repository'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            We'll scan the repository and find good issues that can be implemented using AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
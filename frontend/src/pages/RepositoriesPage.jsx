import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { repositoryApi } from '../api/apiClient';

const RepositoriesPage = () => {
  const { user, repositories, loadingRepos } = useAuth();
  const navigate = useNavigate();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRepos, setFilteredRepos] = useState([]);

  useEffect(() => {
    if (repositories && repositories.length > 0) {
      setFilteredRepos(repositories);
    }
  }, [repositories]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRepos(repositories);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = repositories.filter(
        repo => repo.full_name.toLowerCase().includes(term) || 
                (repo.description && repo.description.toLowerCase().includes(term))
      );
      setFilteredRepos(filtered);
    }
  }, [searchTerm, repositories]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScanRepository = async () => {
    if (!selectedRepo) {
      setError('Please select a repository to scan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await repositoryApi.scanRepository(selectedRepo.url);
      navigate(`/scan/${response.scan_id}`);
    } catch (err) {
      console.error('Error scanning repository:', err);
      setError('Error scanning repository. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-700 mb-6">Please log in to view your repositories.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Login with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 my-8">
        <h1 className="text-3xl font-bold text-center mb-8">Select a Repository to Scan</h1>
        
        {loadingRepos ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your repositories...</p>
          </div>
        ) : repositories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-700 mb-6">
              No repositories found in your GitHub account.
            </p>
            <p className="text-gray-600 mb-6">
              Make sure you have access to at least one repository or create a new one on GitHub.
            </p>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Create a New Repository
            </a>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-700 text-center">
              <p>We found {repositories.length} repositories in your GitHub account.</p>
              <p className="mt-2">Select one to scan for issues that can be implemented by AI.</p>
            </div>
            
            {/* Search input */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Repository count indicator */}
            <p className="text-sm text-gray-500 mb-2">
              Showing {filteredRepos.length} of {repositories.length} repositories
            </p>
            
            {/* Repository list */}
            <div className="space-y-2 max-h-96 overflow-y-auto mb-8 border rounded-lg p-2">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.full_name}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedRepo?.full_name === repo.full_name
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{repo.full_name}</h3>
                    {repo.description && (
                      <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                    )}
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                        </svg>
                        {repo.owner}/{repo.name}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No repositories match your search</p>
              )}
            </div>
            
            {error && (
              <p className="text-center text-red-600 mb-4">{error}</p>
            )}
            
            <div className="flex justify-center">
              <button
                onClick={handleScanRepository}
                disabled={!selectedRepo || loading}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              >
                {loading ? 'Starting Scan...' : 'Scan Selected Repository'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RepositoriesPage; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function RepositorySelection() {
  const { 
    repositories, 
    loading, 
    error, 
    setSelectedRepo, 
    scanRepository 
  } = useAppContext();
  
  const [selectedRepoUrl, setSelectedRepoUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleRepositorySelect = (repo) => {
    setSelectedRepoUrl(repo.url);
  };

  const handleScanStart = async () => {
    if (!selectedRepoUrl) return;
    
    const selectedRepo = repositories.find(repo => repo.url === selectedRepoUrl);
    setSelectedRepo(selectedRepo);
    
    const scanId = await scanRepository(selectedRepoUrl);
    if (scanId) {
      navigate(`/scanning/${scanId}`);
    }
  };
  
  const filteredRepositories = repositories.filter(repo => 
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-2xl font-bold text-white mb-1.5">
            Select a Repository to Scan
          </h2>
          <p className="text-indigo-100 max-w-2xl text-sm">
            Choose a repository from your GitHub account to scan for low-hanging fruit issues that can be automatically fixed by our AI coding agents.
          </p>
        </div>
        
        <ErrorMessage message={error} />
        
        <div className="mb-5">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-white shadow-md overflow-hidden rounded-lg border border-gray-100">
          {loading ? (
            <div className="p-6"><Loading message="Loading repositories..." /></div>
          ) : repositories.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 mb-3">
                <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No repositories found</h3>
              <p className="text-sm text-gray-500">We couldn't find any repositories in your GitHub account.</p>
            </div>
          ) : filteredRepositories.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 mb-3">
                <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No matching repositories</h3>
              <p className="text-sm text-gray-500">Try adjusting your search term to find repositories.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredRepositories.map((repo) => (
                <li 
                  key={repo.full_name} 
                  className={`px-4 py-4 cursor-pointer transition-all duration-150 ${selectedRepoUrl === repo.url ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleRepositorySelect(repo)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                            {repo.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{repo.full_name}</h3>
                          {repo.description && (
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{repo.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedRepoUrl === repo.url ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <svg className="-ml-0.5 mr-1 h-3.5 w-3.5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </span>
                      ) : (
                        <button className="inline-flex items-center px-2.5 py-0.5 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500">
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleScanStart}
            disabled={!selectedRepoUrl || loading}
            className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-150 ${!selectedRepoUrl || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md'}`}
          >
            <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Scan for Low-Hanging Fruits
          </button>
        </div>
      </div>
    </Layout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import {
  PageContainer,
  PageHeader,
  Card,
  CardContent,
  Button,
  Input
} from '../components/common';
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
    <PageContainer>
      <PageHeader 
        title="Select Repository"
        description="Choose a repository from your GitHub account to scan for issues AI can help fix."
      />
        
      <ErrorMessage message={error} />
      
      <div className="mb-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4" style={{ color: 'var(--neutral-400)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <Input
            type="text"
            className="pl-9"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
        
      <Card className="overflow-hidden">
          {loading ? (
            <div className="p-6"><Loading message="Loading repositories..." /></div>
          ) : repositories.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 mb-3">
                <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-medium mb-1" style={{ color: 'var(--neutral-900)' }}>No repositories found</h3>
              <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>We couldn't find any repositories in your GitHub account.</p>
            </div>
          ) : filteredRepositories.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 mb-3">
                <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-medium mb-1" style={{ color: 'var(--neutral-900)' }}>No matching repositories</h3>
              <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>Try adjusting your search term to find repositories.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredRepositories.map((repo) => (
                <li 
                  key={repo.full_name} 
                  className={`px-4 py-4 cursor-pointer transition-all duration-150`}
                  style={{
                    backgroundColor: selectedRepoUrl === repo.url ? 'var(--facebook-blue-50)' : 'transparent',
                    ':hover': { backgroundColor: 'var(--neutral-50)' }
                  }}
                  onClick={() => handleRepositorySelect(repo)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded flex items-center justify-center text-white font-medium text-sm" style={{ backgroundColor: 'var(--facebook-blue-600)' }}>
                            {repo.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-medium" style={{ color: 'var(--neutral-900)' }}>{repo.full_name}</h3>
                          {repo.description && (
                            <p className="mt-0.5 text-xs line-clamp-2" style={{ color: 'var(--neutral-500)' }}>{repo.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedRepoUrl === repo.url ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--facebook-blue-100)', color: 'var(--facebook-blue-800)' }}>
                          <svg className="-ml-0.5 mr-1 h-3.5 w-3.5" style={{ color: 'var(--facebook-blue-600)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </span>
                      ) : (
                        <button className="inline-flex items-center px-2.5 py-0.5 border shadow-sm text-xs leading-4 font-medium rounded-full bg-white" style={{ borderColor: 'var(--neutral-300)', color: 'var(--neutral-700)' }}>
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </Card>
        
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleScanStart}
          disabled={!selectedRepoUrl || loading}
          variant={!selectedRepoUrl || loading ? 'disabled' : 'primary'}
          className="flex items-center"
        >
            <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Scan for Low-Hanging Fruits
        </Button>
      </div>
    </PageContainer>
  );
}

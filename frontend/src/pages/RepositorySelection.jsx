import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import {
  PageContainer,
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  Badge,
  Button,
  Input
} from '../components/common';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

// SVG icons as components for better readability
const WarningIcon = () => (
  <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="-ml-0.5 mr-1 h-3.5 w-3.5 text-facebook-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ScanIcon = () => (
  <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
);

// Repository item component to reduce main component complexity
const RepositoryItem = ({ repo, isSelected, onSelect }) => {
  const handleSelect = (e) => {
    // Prevent propagation if clicking on the badge
    if (e.target.closest('.badge') || e.target.closest('button')) return;
    onSelect(repo);
  };

  return (
    <Card 
      className={`mb-0 border-0 rounded-none shadow-none cursor-pointer transition-all duration-200 ${isSelected ? 'bg-facebook-50' : 'hover:bg-gray-50'}`}
      onClick={handleSelect}
    >
      <CardContent className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 flex items-center">
                <span className="truncate">{repo.full_name}</span>
                {repo.private && (
                  <Badge className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Private
                  </Badge>
                )}
              </h3>
              {repo.description && (
                <p className="mt-1 text-sm line-clamp-2 text-gray-500">{repo.description}</p>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {isSelected ? (
              <Badge className="badge inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-facebook-100 text-facebook-800 shadow-sm">
                <CheckIcon />
                Selected
              </Badge>
            ) : (
              <Button 
                variant="outline" 
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-full bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(repo);
                }}
              >
                Select
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty state component for better organization
const EmptyState = ({ icon, title, description }) => (
  <Card className="border-0 shadow-none">
    <CardContent className="p-6 text-center">
      <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 mb-3">
        {icon}
      </div>
      <h3 className="text-base font-medium mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

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
  
  // Use useMemo to avoid unnecessary recalculations
  const filteredRepositories = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return repositories.filter(repo => 
      repo.full_name.toLowerCase().includes(searchTermLower) ||
      (repo.description && repo.description.toLowerCase().includes(searchTermLower))
    );
  }, [repositories, searchTerm]);
  
  // Determine visible repositories (first 10) and count of hidden ones
  const visibleRepositories = filteredRepositories.slice(0, 10);
  const hiddenRepositoriesCount = filteredRepositories.length - visibleRepositories.length;

  // Render repository content based on state
  const renderRepositoryContent = () => {
    if (loading) {
      return (
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <Loading message="Loading repositories..." />
          </CardContent>
        </Card>
      );
    }
    
    if (repositories.length === 0) {
      return (
        <EmptyState 
          icon={<WarningIcon />}
          title="No repositories found"
          description="We couldn't find any repositories in your GitHub account."
        />
      );
    }
    
    if (filteredRepositories.length === 0) {
      return (
        <EmptyState 
          icon={<SearchIcon />}
          title="No matching repositories"
          description="Try adjusting your search term to find repositories."
        />
      );
    }
    
    return (
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          {visibleRepositories.map((repo, index) => (
            <div key={repo.full_name}>
              <RepositoryItem 
                repo={repo}
                isSelected={selectedRepoUrl === repo.url}
                onSelect={handleRepositorySelect}
              />
              {index < visibleRepositories.length - 1 && (
                <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-80" />
              )}
            </div>
          ))}
          {hiddenRepositoriesCount > 0 && (
            <CardFooter className="px-4 py-3 text-center border-t border-gray-100">
              <p className="text-sm font-medium text-gray-600">
                {hiddenRepositoriesCount} more {hiddenRepositoriesCount === 1 ? 'repository' : 'repositories'}
              </p>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Select Repository"
        description="Choose a repository from your GitHub account to scan for issues AI can help fix."
      />
        
      <ErrorMessage message={error} />
      
      {/* Search input with icon */}
      <div className="mb-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <Input
            type="text"
            className="pl-10 w-full"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
        
      {/* Repository list */}
      {renderRepositoryContent()}
        
      {/* Action button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleScanStart}
          disabled={!selectedRepoUrl || loading}
          variant={!selectedRepoUrl || loading ? 'disabled' : 'primary'}
          className="flex items-center shadow-sm hover:shadow transition-all duration-200"
        >
          <ScanIcon />
          Scan for Low-Hanging Fruits
        </Button>
      </div>
    </PageContainer>
  );
}

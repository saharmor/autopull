import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { repositoryApi } from '../api/apiClient';

const ScanPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [implementing, setImplementing] = useState(false);

  useEffect(() => {
    const fetchScanStatus = async () => {
      try {
        const data = await repositoryApi.getScanStatus(scanId);
        setScanData(data);
        
        if (data.status === 'in_progress') {
          // Poll every 2 seconds if scan is still in progress
          const timer = setTimeout(fetchScanStatus, 2000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error fetching scan status:', error);
        setError('Error fetching scan results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchScanStatus();
  }, [scanId]);

  const handleImplementIssue = async () => {
    if (!selectedIssue) return;
    
    setImplementing(true);
    try {
      const response = await repositoryApi.implementIssue(scanId, selectedIssue.id);
      navigate(`/implement/${response.implementation_id}`);
    } catch (error) {
      console.error('Error implementing issue:', error);
      setError('Error starting implementation. Please try again.');
      setImplementing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            {scanData?.status === 'in_progress' 
              ? 'Scanning repository for issues...' 
              : 'Loading scan results...'}
          </h2>
          <p className="mt-2 text-gray-600">
            This may take a few moments as we analyze the codebase.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!scanData || scanData.status === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Scan Not Found</h2>
          <p className="text-gray-700 mb-6">The requested scan could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (scanData.status === 'in_progress') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Scanning repository for issues...</h2>
          <p className="mt-2 text-gray-600">
            This may take a few moments as we analyze the codebase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 my-8">
        <h1 className="text-3xl font-bold text-center mb-8">Scan Results</h1>
        
        {scanData.issues && scanData.issues.length > 0 ? (
          <>
            <p className="mb-6 text-gray-700 text-center">
              We found {scanData.issues.length} issues that can be implemented with AI.
              Select one to proceed.
            </p>
            
            <div className="space-y-4 mb-8">
              {scanData.issues.map((issue) => (
                <div 
                  key={issue.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedIssue?.id === issue.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
                  <p className="text-gray-600 mt-1">{issue.description}</p>
                  <div className="flex items-center mt-3 text-sm">
                    <span className="mr-4">
                      <span className="font-medium text-gray-700">Complexity:</span>{' '}
                      <span className={`${
                        issue.complexity === 'Easy' ? 'text-green-600' :
                        issue.complexity === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {issue.complexity}
                      </span>
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Estimated time:</span>{' '}
                      <span className="text-gray-600">{issue.estimated_time}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleImplementIssue}
                disabled={!selectedIssue || implementing}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              >
                {implementing ? 'Starting Implementation...' : 'Implement Selected Issue'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-700 mb-6">
              No suitable issues were found in this repository.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Try Another Repository
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage; 
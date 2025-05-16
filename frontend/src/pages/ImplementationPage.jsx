import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { repositoryApi } from '../api/apiClient';

const ImplementationPage = () => {
  const { implementationId } = useParams();
  const navigate = useNavigate();
  const [implementationData, setImplementationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImplementationStatus = async () => {
      try {
        const data = await repositoryApi.getImplementationStatus(implementationId);
        setImplementationData(data);
        
        if (data.status === 'in_progress') {
          // Poll every 2 seconds if implementation is still in progress
          const timer = setTimeout(fetchImplementationStatus, 2000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error fetching implementation status:', error);
        setError('Error fetching implementation status. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImplementationStatus();
  }, [implementationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            {implementationData?.status === 'in_progress' 
              ? 'Implementing the selected issue...' 
              : 'Loading implementation status...'}
          </h2>
          <p className="mt-2 text-gray-600">
            This may take a few minutes as the AI analyzes the code and implements a solution.
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

  if (!implementationData || implementationData.status === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Implementation Not Found</h2>
          <p className="text-gray-700 mb-6">The requested implementation could not be found.</p>
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

  if (implementationData.status === 'in_progress') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Implementing Solution</h2>
          <p className="text-gray-700 mb-6">
            The AI is working hard to implement a solution for the selected issue.
            This process typically takes a few minutes.
          </p>
          <div className="space-y-2 text-left border rounded-lg p-4 bg-gray-50 mb-6">
            <p className="font-medium text-gray-700">Current steps:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Analyzing the codebase structure</li>
              <li>Understanding the issue requirements</li>
              <li>Designing an appropriate solution</li>
              <li className="text-indigo-600 font-medium">Implementing the changes</li>
              <li className="text-gray-400">Creating a pull request</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            Please don't close this window. We'll redirect you once the implementation is complete.
          </p>
        </div>
      </div>
    );
  }

  if (implementationData.status === 'completed' && implementationData.pull_request) {
    return (
      <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 my-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-600 p-4 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Implementation Complete!</h1>
          <p className="text-gray-700 mb-8">
            The AI has successfully implemented a solution for the selected issue and created a pull request.
          </p>
          
          <div className="border rounded-lg p-6 bg-gray-50 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pull Request Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Title:</span>{' '}
                <span className="text-gray-900">{implementationData.pull_request.title}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>{' '}
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {implementationData.pull_request.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href={implementationData.pull_request.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              View Pull Request
            </a>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
            >
              Start New Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Unexpected Status</h2>
        <p className="text-gray-700 mb-6">
          The implementation is in an unexpected state: {implementationData.status}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ImplementationPage; 
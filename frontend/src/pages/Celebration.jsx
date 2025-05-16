import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';

export default function Celebration() {
  const { implementationId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedIssue,
    checkImplementationStatus,
    pullRequest,
    error 
  } = useAppContext();
  
  useEffect(() => {
    if (!implementationId) {
      navigate('/');
      return;
    }
    
    // Check implementation status once when component mounts
    checkImplementationStatus(implementationId);
  }, [implementationId, checkImplementationStatus, navigate]);
  
  const handleStartOver = () => {
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md p-5 mb-6 text-center">
          <div className="mb-3">
            <div className="mx-auto bg-white rounded-full h-16 w-16 flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1.5">
              Success! Implementation Complete
            </h2>
            <p className="text-indigo-100 max-w-2xl mx-auto text-sm">
              Our AI coding agent has successfully implemented a fix for the selected issue and created a pull request in your repository.
            </p>
          </div>
          
          {pullRequest && (
            <a 
              href={pullRequest.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
            >
              <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              View Pull Request on GitHub
            </a>
          )}
        </div>
        
        <ErrorMessage message={error} />
        
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Implementation Details
          </h3>
          
          {pullRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-1.5">Pull Request</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                        PR
                      </div>
                    </div>
                    <div>
                      <h5 className="text-base font-medium text-gray-900 mb-0.5">
                        {pullRequest.title}
                      </h5>
                      <p className="text-xs text-gray-500 mb-1.5">
                        #{pullRequest.number} opened by {pullRequest.user.login}
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="-ml-0.5 mr-1 h-3.5 w-3.5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Ready to Merge
                        </span>
                        <a 
                          href={pullRequest.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View on GitHub →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-1.5">Changes Made</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <ul className="space-y-2">
                    {pullRequest.changed_files && pullRequest.changed_files.map((file, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-4 w-4 text-green-500 mr-1.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-gray-900">{file.filename}</p>
                          <p className="text-xs text-gray-500">
                            {file.additions} additions, {file.deletions} deletions
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-1.5">Implementation Summary</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-600 whitespace-pre-line">
                    {pullRequest.body || 'No summary provided.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            What's Next?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 mr-2.5">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-0.5">Review the Pull Request</h4>
                  <p className="text-xs text-gray-600">
                    Check the changes made by our AI coding agent and merge the pull request if you're satisfied with the implementation.
                  </p>
                </div>
              </div>
              
              {pullRequest && (
                <a 
                  href={pullRequest.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 w-full justify-center"
                >
                  <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Review Pull Request
                </a>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 mr-2.5">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-0.5">Find More Issues</h4>
                  <p className="text-xs text-gray-600">
                    Scan your repository again to find more low-hanging fruit issues that can be automatically fixed by our AI coding agents.
                  </p>
                </div>
              </div>
              
              <Link 
                to="/repository-selection"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 w-full justify-center"
              >
                <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Scan Another Repository
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

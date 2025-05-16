import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function IssueSelection() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedRepo,
    checkScanStatus, 
    scanStatus, 
    issues, 
    implementIssue,
    error 
  } = useAppContext();
  
  useEffect(() => {
    if (!scanId) {
      navigate('/');
      return;
    }
    
    // Check scan status once when component mounts
    checkScanStatus(scanId);
  }, [scanId, checkScanStatus, navigate]);
  
  const handleIssueSelect = async (issue) => {
    const implementationId = await implementIssue(issue);
    if (implementationId) {
      navigate(`/implementing/${implementationId}`);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Select an Issue to Implement
          </h2>
          
          {selectedRepo && (
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 text-white">
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="font-medium">{selectedRepo.full_name}</span>
            </div>
          )}
        </div>
        
        <ErrorMessage message={error} />
        
        {scanStatus === 'in_progress' ? (
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <Loading message="Scan in progress. Please wait..." />
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 text-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 h-20 w-20 flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Issues Found</h3>
              <p className="text-gray-500 max-w-md">
                We couldn't find any low-hanging fruit issues in this repository. Try scanning a different repository or check back later.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  <span className="text-indigo-600">{issues.length}</span> Issues Found
                </h3>
                <div className="text-sm text-gray-500">
                  Click on an issue to implement it
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {issues.map((issue) => (
                <div 
                  key={issue.id} 
                  className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-indigo-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex-1">
                          {issue.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {issue.complexity}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {issue.estimated_time}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 text-sm">
                        {issue.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="h-5 w-5 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>AI-recommended fix</span>
                        </div>
                        <button
                          onClick={() => handleIssueSelect(issue)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                        >
                          <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Implement This Issue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import ErrorMessage from '../components/ErrorMessage';

export default function Implementing() {
  const { implementationId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedIssue,
    checkImplementationStatus, 
    implementationStatus, 
    pullRequest,
    error 
  } = useAppContext();
  
  const [progress, setProgress] = useState(0);
  const [implementationSteps, setImplementationSteps] = useState([
    { id: 1, name: 'Analyzing repository structure', completed: false },
    { id: 2, name: 'Understanding the issue', completed: false },
    { id: 3, name: 'Implementing solution', completed: false },
    { id: 4, name: 'Testing changes', completed: false },
    { id: 5, name: 'Creating pull request', completed: false },
  ]);
  
  useEffect(() => {
    if (!implementationId) {
      navigate('/');
      return;
    }
    
    const interval = setInterval(async () => {
      const result = await checkImplementationStatus(implementationId);
      
      // Update progress for UI animation
      setProgress(prev => {
        const newProgress = Math.min(prev + 5, 90);
        
        // Update implementation steps based on progress
        if (newProgress >= 20 && !implementationSteps[0].completed) {
          setImplementationSteps(prev => prev.map((step, i) => i === 0 ? { ...step, completed: true } : step));
        }
        if (newProgress >= 40 && !implementationSteps[1].completed) {
          setImplementationSteps(prev => prev.map((step, i) => i === 1 ? { ...step, completed: true } : step));
        }
        if (newProgress >= 60 && !implementationSteps[2].completed) {
          setImplementationSteps(prev => prev.map((step, i) => i === 2 ? { ...step, completed: true } : step));
        }
        if (newProgress >= 80 && !implementationSteps[3].completed) {
          setImplementationSteps(prev => prev.map((step, i) => i === 3 ? { ...step, completed: true } : step));
        }
        
        return newProgress;
      });
      
      if (result && result.status === 'completed') {
        setProgress(100);
        setImplementationSteps(prev => prev.map(step => ({ ...step, completed: true })));
        clearInterval(interval);
        
        // Navigate to celebration page after a short delay
        setTimeout(() => {
          navigate(`/celebration/${implementationId}`);
        }, 1500);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [implementationId, checkImplementationStatus, navigate, implementationSteps]);
  
  // Animation for the code typing effect
  const [codeText, setCodeText] = useState('');
  const fullCodeText = `function fixIssue() {
  // Analyzing repository structure
  const repo = getRepositoryStructure();
  
  // Finding the problematic code
  const issueLocation = findIssueInCode(repo);
  
  // Implementing the fix
  const solution = generateSolution(issueLocation);
  
  // Testing the changes
  const testResult = runTests(solution);
  
  // Creating pull request
  if (testResult.success) {
    return createPullRequest(solution);
  }
}`;

  useEffect(() => {
    if (progress > 0 && codeText.length < fullCodeText.length) {
      const timer = setTimeout(() => {
        setCodeText(fullCodeText.substring(0, codeText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [codeText, progress]);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Implementing Solution
          </h2>
          
          {selectedIssue && (
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 text-white">
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{selectedIssue.title}</span>
            </div>
          )}
        </div>
        
        <ErrorMessage message={error} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 h-full">
              {selectedIssue && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-md font-bold text-gray-800">Issue Details</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedIssue.description}
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      <svg className="-ml-1 mr-1.5 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {implementationStatus === 'completed' ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        )}
                      </svg>
                      {implementationStatus === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-indigo-600">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {implementationSteps.map(step => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {step.completed ? (
                        <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{step.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 h-12 w-12 flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    AI Coding Agent
                  </h3>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4 flex-grow">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-2 text-xs text-gray-400">fix-issue.js</div>
                  </div>
                  <pre className="text-xs text-green-400 font-mono overflow-auto h-48">
                    <code>{codeText || 'Initializing...'}</code>
                  </pre>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">What's happening:</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Our AI coding agent is analyzing the repository, understanding the issue, and implementing a solution. This process uses advanced AI techniques to generate high-quality code changes.
                  </p>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-600 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium text-indigo-600">
                      {implementationStatus === 'completed' ? 'Pull request created!' : 'Creating pull request...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

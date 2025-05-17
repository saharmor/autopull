import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import ErrorMessage from '../components/ErrorMessage';

export default function Scanning() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedRepo, 
    checkScanStatus, 
    scanStatus, 
    issues, 
    error 
  } = useAppContext();
  
  const [progress, setProgress] = useState(0);
  const [scanSteps, setScanSteps] = useState([
    { id: 1, name: 'Initializing scan', completed: true },
    { id: 2, name: 'Analyzing repository structure', completed: false },
    { id: 3, name: 'Identifying potential issues', completed: false },
    { id: 4, name: 'Evaluating complexity', completed: false },
    { id: 5, name: 'Generating recommendations', completed: false },
  ]);
  
  useEffect(() => {
    if (!scanId) {
      navigate('/');
      return;
    }
    
    const interval = setInterval(async () => {
      const result = await checkScanStatus(scanId);
      
      // Update progress for UI animation
      setProgress(prev => {
        const newProgress = Math.min(prev + 5, 90);
        
        // Update scan steps based on progress
        if (newProgress >= 20 && !scanSteps[1].completed) {
          setScanSteps(prev => prev.map((step, i) => i === 1 ? { ...step, completed: true } : step));
        }
        if (newProgress >= 40 && !scanSteps[2].completed) {
          setScanSteps(prev => prev.map((step, i) => i === 2 ? { ...step, completed: true } : step));
        }
        if (newProgress >= 60 && !scanSteps[3].completed) {
          setScanSteps(prev => prev.map((step, i) => i === 3 ? { ...step, completed: true } : step));
        }
        if (newProgress >= 80 && !scanSteps[4].completed) {
          setScanSteps(prev => prev.map((step, i) => i === 4 ? { ...step, completed: true } : step));
        }
        
        return newProgress;
      });
      
      if (result && result.status === 'completed') {
        setProgress(100);
        setScanSteps(prev => prev.map(step => ({ ...step, completed: true })));
        clearInterval(interval);
        
        // Navigate to issue selection after a short delay
        setTimeout(() => {
          navigate(`/issues/${scanId}`);
        }, 1500);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [scanId, checkScanStatus, navigate, scanSteps]);
  
  return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary-700 rounded-lg shadow-md p-5 mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1.5">
            Scanning Repository
          </h2>
          
          {selectedRepo && (
            <div className="inline-flex items-center bg-white/10 rounded-full px-3 py-1 text-white text-sm">
              <span className="font-medium">{selectedRepo.full_name}</span>
            </div>
          )}
        </div>
        
        <ErrorMessage message={error} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100 h-full">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {scanStatus === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-primary-600">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${progress}%` }}
                    className="h-full bg-primary-600 transition-all duration-500"
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {scanSteps.map(step => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {step.completed ? (
                        <CheckIcon />
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-xs ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{step.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100 h-full">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary-100 h-16 w-16 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-primary-600 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m0 16v1m-9-9h1m16 0h1m-2.947-7.053l-.708.708M5.657 18.343l-.708.708m14.095-12.728l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  AI Coding Agent at Work
                </h3>
                <p className="text-xs text-gray-600 text-center mb-4">
                  Our AI coding agent is analyzing the repository structure and identifying issues that can be automatically fixed. This process uses advanced code understanding to find the most impactful low-hanging fruit.
                </p>
                
                <div className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1.5">What we're looking for:</h4>
                  <ul className="space-y-1.5">
                    <li className="text-xs text-gray-600 flex items-start">
                      <CheckIcon />
                      <span>Simple bug fixes and code improvements</span>
                    </li>
                    <li className="text-xs text-gray-600 flex items-start">
                      <CheckIcon />
                      <span>Documentation updates and enhancements</span>
                    </li>
                    <li className="text-xs text-gray-600 flex items-start">
                      <CheckIcon />
                      <span>Performance optimizations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );

}

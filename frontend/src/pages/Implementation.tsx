import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { repositoryApi } from '../services/api';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

export default function Implementation() {
  const { scanId, issueId } = useParams<{ scanId: string; issueId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [implementationId, setImplementationId] = useState<string | null>(
    location.state?.implementationId || null
  );
  const [status, setStatus] = useState<string>('in_progress');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [codingAgent] = useState<string>(() => {
    const agents = ['Claude Code', 'Cursor', 'GitHub Copilot'];
    return agents[Math.floor(Math.random() * agents.length)];
  });

  useEffect(() => {
    if (!implementationId) {
      setError('No implementation ID found. Please go back and select an issue.');
      return;
    }

    const pollImplementationStatus = async () => {
      try {
        const response = await repositoryApi.getImplementationStatus(implementationId);
        setStatus(response.data.status);

        if (response.data.status === 'completed' && response.data.pull_request) {
          // Navigate to celebration page when implementation is complete
          navigate(`/celebration/${implementationId}`);
          return;
        }

        // Simulate progress for better UX
        setProgress(prev => Math.min(prev + Math.random() * 10, 95));
      } catch (err) {
        console.error('Error checking implementation status:', err);
        setError('Failed to check implementation status. Please try again.');
      }
    };

    const interval = setInterval(pollImplementationStatus, 2000);
    
    return () => clearInterval(interval);
  }, [implementationId, navigate]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate(`/issues/${scanId}`)}
            className="mt-6 btn btn-primary"
          >
            Go back to issues
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { name: 'Understanding the issue', description: 'Analyzing what needs to be implemented' },
    { name: 'Planning solution', description: 'Designing a approach that follows best practices' },
    { name: 'Writing code', description: 'Implementing the solution with high-quality code' },
    { name: 'Testing changes', description: 'Verifying the implementation works correctly' },
    { name: 'Creating pull request', description: 'Submitting the changes back to GitHub' },
  ];

  // Calculate the current step based on progress
  const currentStep = Math.min(Math.floor(progress / 20), 4);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Implementing Your Issue</h1>
        <p className="text-gray-600">
          {codingAgent} is working on implementing the selected issue
        </p>
      </motion.div>

      <div className="card p-8">
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary-600"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: index <= currentStep ? 1 : 0.8,
                    opacity: index <= currentStep ? 1 : 0.4
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    index < currentStep
                      ? 'bg-primary-600 text-white'
                      : index === currentStep
                      ? 'bg-primary-100 border-2 border-primary-600 text-primary-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
              </div>
              <div className="mt-0.5">
                <h3 className={`text-md font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </h3>
                <p className={`text-sm ${
                  index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">This may take a few minutes. Feel free to leave this page and come back later.</p>
          <div className="mt-2 text-sm text-gray-500 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {codingAgent} is busy coding
          </div>
        </div>
      </div>
    </div>
  );
} 
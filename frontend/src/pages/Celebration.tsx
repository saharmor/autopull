import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { repositoryApi, PullRequest } from '../services/api';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

export default function Celebration() {
  const { implementationId } = useParams<{ implementationId: string }>();
  const navigate = useNavigate();
  const [pullRequest, setPullRequest] = useState<PullRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codingAgent] = useState<string>(() => {
    const agents = ['Claude Code', 'Cursor', 'GitHub Copilot'];
    return agents[Math.floor(Math.random() * agents.length)];
  });

  useEffect(() => {
    const fetchImplementationResult = async () => {
      if (!implementationId) {
        setError('No implementation ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await repositoryApi.getImplementationStatus(implementationId);
        
        if (response.data.status !== 'completed' || !response.data.pull_request) {
          setError('Implementation is not complete yet');
          setLoading(false);
          return;
        }

        setPullRequest(response.data.pull_request);
      } catch (err) {
        console.error('Error fetching implementation result:', err);
        setError('Failed to load implementation result');
      } finally {
        setLoading(false);
      }
    };

    fetchImplementationResult();
  }, [implementationId]);

  if (loading) {
    return <Loading text="Loading your pull request..." />;
  }

  if (error || !pullRequest) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card p-8">
          <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error || 'Could not find pull request details'}</p>
          <button
            onClick={() => navigate('/repositories')}
            className="mt-6 btn btn-primary"
          >
            Go back to repositories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block"
        >
          <svg className="h-24 w-24 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mt-6">Success!</h1>
        <p className="text-xl text-gray-600 mt-4">
          {codingAgent} has implemented your issue and created a pull request!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pull Request Details</h2>
        
        <div className="bg-gray-50 p-6 rounded-lg text-left">
          <h3 className="text-lg font-medium text-gray-900">{pullRequest.title}</h3>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              pullRequest.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {pullRequest.status}
            </span>
          </div>
          <div className="mt-6">
            <a
              href={pullRequest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            You can review, edit, and merge this pull request on GitHub.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          onClick={() => navigate('/repositories')}
          className="btn btn-outline mr-4"
        >
          Select Another Repository
        </button>
        <a
          href={pullRequest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Review Pull Request
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-sm text-gray-500"
      >
        <p>Done in less than 5 minutes by {codingAgent}</p>
      </motion.div>
    </div>
  );
} 
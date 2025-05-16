import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { repositoryApi, Issue } from '../services/api';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

export default function IssueSelection() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

  useEffect(() => {
    const fetchScanResults = async () => {
      if (!scanId) {
        setError('No scan ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await repositoryApi.getScanStatus(scanId);
        
        if (response.data.status !== 'completed') {
          // Redirect back to scan page if scan is not complete
          navigate(`/scan/repository`, { state: { scanId } });
          return;
        }

        if (response.data.issues && response.data.issues.length > 0) {
          setIssues(response.data.issues);
        } else {
          setError('No issues found in this repository');
        }
      } catch (err) {
        console.error('Error fetching scan results:', err);
        setError('Failed to load scan results');
      } finally {
        setLoading(false);
      }
    };

    fetchScanResults();
  }, [scanId, navigate]);

  const handleImplement = async () => {
    if (!selectedIssue) return;
    
    try {
      setLoading(true);
      const response = await repositoryApi.implementIssue(scanId!, selectedIssue);
      navigate(`/implement/${scanId}/${selectedIssue}`, { 
        state: { implementationId: response.data.implementation_id } 
      });
    } catch (err) {
      console.error('Error starting implementation:', err);
      setError('Failed to start implementation. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading issues..." />;
  }

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
            onClick={() => navigate('/repositories')}
            className="mt-6 btn btn-primary"
          >
            Go back to repositories
          </button>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose an Issue to Implement</h1>
        <p className="text-gray-600">
          These low-hanging fruit issues were found in your repository. <br />
          Select one for our AI coding agent to implement automatically.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {issues.map((issue) => (
          <motion.div
            key={issue.id}
            variants={item}
            transition={{ duration: 0.3 }}
            className={`card p-6 hover:shadow-md transition-shadow cursor-pointer border-2 ${
              selectedIssue === issue.id ? 'border-primary-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedIssue(issue.id)}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                <p className="mt-1 text-gray-600">{issue.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {issue.complexity}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {issue.estimated_time}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 mt-1">
                <div className={`h-5 w-5 rounded-full border-2 ${
                  selectedIssue === issue.id 
                    ? 'border-primary-600 bg-primary-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedIssue === issue.id && (
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href={issue.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleImplement}
          disabled={!selectedIssue}
          className={`btn btn-lg btn-primary px-8 py-3 ${!selectedIssue ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Implement Selected Issue
        </button>
      </div>
    </div>
  );
} 
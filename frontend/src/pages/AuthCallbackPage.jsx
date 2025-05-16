import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { completeGitHubAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const userId = searchParams.get('user_id');
      const errorParam = searchParams.get('error');
      
      if (errorParam) {
        setError(`Authentication error: ${errorParam}`);
        return;
      }
      
      if (!userId) {
        setError('No user ID provided in callback');
        return;
      }
      
      try {
        await completeGitHubAuth(userId);
        navigate('/repositories');
      } catch (error) {
        console.error('Error completing authentication:', error);
        setError('Failed to complete authentication. Please try again.');
      }
    };
    
    handleCallback();
  }, [searchParams, completeGitHubAuth, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Completing GitHub Authentication</h1>
        
        {error ? (
          <>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Completing authentication with GitHub...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage; 
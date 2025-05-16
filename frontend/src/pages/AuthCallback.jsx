import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading, error } = useAppContext();
  
  useEffect(() => {
    // If user is loaded, redirect to repository selection
    if (user && !loading) {
      navigate('/');
    }
    
    // If there's an error, redirect to login
    if (error && !loading) {
      navigate('/login');
    }
  }, [user, loading, error, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Authenticating...
        </h2>
        <div className="flex justify-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-600">
          Connecting to your GitHub account...
        </p>
      </div>
    </div>
  );
}

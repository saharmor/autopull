import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageContainer, Card, CardContent } from '../components/common';

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
    <PageContainer>
      <div className="w-full max-w-md mx-auto">
        <Card className="text-center">
          <CardContent>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--facebook-blue-700)' }}>
              Authenticating...
            </h2>
            <div className="flex justify-center my-6">
              <svg className="animate-spin h-10 w-10" style={{ color: 'var(--facebook-blue-600)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p style={{ color: 'var(--neutral-600)' }}>
              Connecting to your GitHub account...
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

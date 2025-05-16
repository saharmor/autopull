import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="mr-2">🦠</span>
          <span>Viral Devin</span>
        </Link>
        
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">
                Welcome, {user.github_username}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded bg-white text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded bg-white text-indigo-600 hover:bg-indigo-100 transition-colors">
              Login with GitHub
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 
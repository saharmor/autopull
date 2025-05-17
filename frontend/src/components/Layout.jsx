import { useAppContext } from '../context/AppContext';
import { Logo } from '../assets/logo';

export default function Layout({ children }) {
  const { user, logout } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-slate-100"> {/* Added flex, flex-col for sticky footer */}
      <header className="bg-primary-700 shadow-md sticky top-0 z-10"> {/* Changed header background and shadow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <Logo className="h-6 w-6 text-white" /> {/* Ensured logo SVG can inherit text color if needed */}
            <h1 className="text-xl font-bold text-white"> {/* Changed title text color */}
              Viral Devin
            </h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.avatar_url && (
                  <img 
                    src={user.avatar_url} 
                    alt="User avatar" 
                    className="h-7 w-7 rounded-full border-2 border-primary-300" /* Adjusted border */
                  />
                )}
                <span className="text-sm font-medium text-primary-100"> {/* Changed username text color */}
                  {user.github_username}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-medium text-primary-100 hover:text-white px-3 py-1 rounded-md hover:bg-primary-600 transition-colors" /* Adjusted button styles */
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full"> {/* Added flex-grow and w-full for sticky footer */}
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Logo className="h-5 w-5" />
              <span className="text-xs font-medium">Viral Devin</span>
            </div>
            <div className="mt-2 md:mt-0 text-xs text-gray-400">
              © {new Date().getFullYear()} Viral Devin. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

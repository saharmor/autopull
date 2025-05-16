import { useAppContext } from '../context/AppContext';
import { Logo } from '../assets/logo';

export default function Layout({ children }) {
  const { user, logout } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <Logo className="h-7 w-7" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="h-7 w-7 rounded-full border border-indigo-100"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.github_username}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-4rem)]">
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

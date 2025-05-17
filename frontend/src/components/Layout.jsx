import { useAppContext } from '../context/AppContext';
import { Logo } from '../assets/logo';
import UserActions from './common/UserActions';

export default function Layout({ children }) {
  const { user, logout } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-slate-100"> {/* Added flex, flex-col for sticky footer */}
      <header className="bg-primary-700 shadow-md sticky top-0 z-10"> {/* Changed header background and shadow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <Logo className="h-6 w-6 text-white" /> {/* Ensured logo SVG can inherit text color if needed */}
            <h1 className="text-xl font-bold text-white"> {/* Changed title text color */}
              AutoPull
            </h1>
          </div>
          <UserActions user={user} logout={logout} />
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full"> {/* Added flex-grow and w-full for sticky footer */}
        {children}
      </main>
      <footer className="bg-slate-800 text-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Logo className="h-5 w-5" />
              <span className="text-xs font-medium">AutoPull</span>
            </div>
            <div className="mt-4 md:mt-0 text-xs text-slate-400 text-center md:text-right">
              © {new Date().getFullYear()} AutoPull. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

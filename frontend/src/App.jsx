import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import RepositoriesPage from './pages/RepositoriesPage';
import ScanPage from './pages/ScanPage';
import ImplementationPage from './pages/ImplementationPage';

// Import components
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            <Route path="/repositories" element={<RepositoriesPage />} />
            <Route path="/scan/:scanId" element={<ScanPage />} />
            <Route path="/implement/:implementationId" element={<ImplementationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Viral Devin - AI-Powered Open Source Contributions</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App; 
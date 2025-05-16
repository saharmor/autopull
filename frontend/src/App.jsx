import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import './App.css';

// Import pages
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import RepositorySelection from './pages/RepositorySelection';
import Scanning from './pages/Scanning';
import IssueSelection from './pages/IssueSelection';
import Implementing from './pages/Implementing';
import Celebration from './pages/Celebration';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <RepositorySelection />
        </ProtectedRoute>
      } />
      
      <Route path="/scanning/:scanId" element={
        <ProtectedRoute>
          <Scanning />
        </ProtectedRoute>
      } />
      
      <Route path="/issues/:scanId" element={
        <ProtectedRoute>
          <IssueSelection />
        </ProtectedRoute>
      } />
      
      <Route path="/implementing/:implementationId" element={
        <ProtectedRoute>
          <Implementing />
        </ProtectedRoute>
      } />
      
      <Route path="/celebration/:implementationId" element={
        <ProtectedRoute>
          <Celebration />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;

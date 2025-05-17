import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Added Outlet
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

// New component to apply Layout to protected routes
const MainAppLayout = () => {
  return (
    <Layout>
      <Outlet /> {/* Child protected routes will render here */}
    </Layout>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Routes without the main Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      
      {/* Protected routes with the main Layout */}
      <Route element={<ProtectedRoute><MainAppLayout /></ProtectedRoute>}>
        <Route path="/" element={<RepositorySelection />} />
        <Route path="/scanning/:scanId" element={<Scanning />} />
        <Route path="/issues/:scanId" element={<IssueSelection />} />
        <Route path="/implementing/:implementationId" element={<Implementing />} />
        <Route path="/celebration/:implementationId" element={<Celebration />} />
      </Route>
      
      {/* Catch-all for unauthenticated users or non-existent paths - might redirect to login if / is protected effectively */}
      <Route path="*" element={<Navigate to="/login" replace />} /> 
    </Routes>
  );
}

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AppProvider>
        {/* Layout is now applied conditionally within AppRoutes */}
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;

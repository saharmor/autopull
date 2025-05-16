import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import RepositorySelection from './pages/RepositorySelection';
import RepositoryScan from './pages/RepositoryScan';
import IssueSelection from './pages/IssueSelection';
import Implementation from './pages/Implementation';
import Celebration from './pages/Celebration';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/repositories" element={<RepositorySelection />} />
              <Route path="/scan/:repoFullName" element={<RepositoryScan />} />
              <Route path="/issues/:scanId" element={<IssueSelection />} />
              <Route path="/implement/:scanId/:issueId" element={<Implementation />} />
              <Route path="/celebration/:implementationId" element={<Celebration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;

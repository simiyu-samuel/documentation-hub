import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DocsPage } from './pages/DocsPage';
import { DocumentPage } from './pages/DocumentPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DocumentsList } from './pages/admin/DocumentsList';
import { DocumentEditor } from './pages/admin/DocumentEditor';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/docs/:slug" element={<DocumentPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/documents"
                  element={
                    <ProtectedRoute requireAdmin>
                      <DocumentsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/documents/:id/edit"
                  element={
                    <ProtectedRoute requireAdmin>
                      <DocumentEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/documents/new"
                  element={
                    <ProtectedRoute requireAdmin>
                      <DocumentEditor />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <ToastProvider />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
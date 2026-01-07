import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import Layout from './components/Layout';
import AIChat from './components/AIChat';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import ReportGenerator from './components/ReportGenerator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green color for orchard theme
    },
    secondary: {
      main: '#ff6f00', // Orange color for accent
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/analytics" element={<AdvancedAnalytics />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/reports" element={<ReportGenerator />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh' }}>
            <AppContent />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

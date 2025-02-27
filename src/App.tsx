import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import OnboardingQuiz from './pages/OnboardingQuiz';
import FitnessDashboard from './pages/FitnessDashboard';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Authenticator>
      <Router>
        <NavigationBar />
        <ProtectedRoutes />
      </Router>
    </Authenticator>
  );
};

// ✅ This function ensures users are signed in before accessing pages
const ProtectedRoutes: React.FC = () => {
  const { user, signOut } = useAuthenticator();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h3>Welcome, {user?.signInDetails?.loginId}!</h3>
        <button onClick={signOut}>Sign Out</button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding-quiz" element={<OnboardingQuiz />} />
        <Route path="/fitness-dashboard" element={<FitnessDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;

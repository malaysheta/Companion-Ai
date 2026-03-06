import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage/ChatPage';
import TeamPage from './pages/TeamPage';
import GradualBlur from './components/GradualBlur';
import LoaderAnimation from './components/LoaderAnimation';

const App = () => {
  const [loading, setLoading] = useState(() => window.location.pathname === '/');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthError = () => {
      navigate('/login');
    };
    window.addEventListener('auth:unauthorized', handleAuthError);
    return () => window.removeEventListener('auth:unauthorized', handleAuthError);
  }, [navigate]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoaderAnimation key="global-loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      <div className={`min-h-screen bg-brand-black text-white font-sans selection:bg-brand-green selection:text-brand-black ${loading ? 'h-screen overflow-hidden' : ''}`}>
        <GradualBlur
          target="page"
          position="bottom"
          height="128px"
          strength={1}
          divCount={1}
          curve="bezier"
          zIndex={50}
          exponential
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

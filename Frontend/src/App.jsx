import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage/ChatPage';
import GradualBlur from './components/GradualBlur';

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-green selection:text-brand-black">
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
        </Routes>
      </div>
    </>
  );
};

export default App;

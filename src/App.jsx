import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import SettingsButton from './components/SettingsButton';
import Home from './pages/Home';
import DailyLog from './pages/DailyLog';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  
  const handleAuthClick = (mode) => {
    setCurrentPage(mode);
  };
  
  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };
  
  const handleSignInToSignUp = () => {
    setCurrentPage('signup');
  };
  
  const handleSignUpToSignIn = () => {
    setCurrentPage('signin');
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'signin':
        return <SignIn key="signin" onBack={handleSignInToSignUp} onSuccess={handleAuthSuccess} />;
      case 'signup':
        return <SignUp key="signup" onBack={handleSignUpToSignIn} onSuccess={handleAuthSuccess} />;
      case 'home':
        return <Home key="home" />;
      case 'log':
        return <DailyLog key="log" />;
      case 'chat':
        return <Chat key="chat" />;
      case 'analytics':
        return <Analytics key="analytics" />;
      default:
        return <Home key="home" />;
    }
  };
  
  const isAuthPage = currentPage === 'signin' || currentPage === 'signup';
  
  return (
    <div className={`relative w-full h-screen bg-night-blue ${isAuthPage ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      {/* Header - Hide on auth pages */}
      {!isAuthPage && (
        <Header 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          onAuthClick={handleAuthClick}
        />
      )}
      
      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="w-full h-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      
      {/* Settings Button - Hide on auth pages */}
      {!isAuthPage && <SettingsButton />}
    </div>
  );
}

export default App;

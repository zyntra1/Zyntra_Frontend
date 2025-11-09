import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import AdminHome from './pages/admin/Home';
import UserHome from './pages/user/Home';
import UserAIInsights from './pages/user/AIInsights';
import BrandingDashboard from './pages/BrandingDashboard';
import WorkplaceDashboard from './pages/WorkplaceDashboard';
import DailyLog from './pages/DailyLog';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GaitRecognition from './pages/GaitRecognition';
import EmployeesList from './pages/admin/EmployeesList';
import PostureDetection from './pages/admin/PostureDetection';
import WellnessDashboard from './pages/admin/WellnessDashboard';

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
  const [currentPage, setCurrentPage] = useState('branding');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'
  
  // Check for existing authentication on mount
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
    
    if (authToken) {
      setIsLoggedIn(true);
      if (userType === 'admin') {
        setUserRole('admin');
        setCurrentPage('wellness');
      } else {
        setUserRole('user');
        setCurrentPage('home');
      }
    }
  }, []);
  
  const handleAuthClick = (mode) => {
    setCurrentPage(mode);
  };
  
  const handleAuthSuccess = (role = 'user') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage('gait');
  };
  
  const handleSignInToSignUp = () => {
    setCurrentPage('signup');
  };
  
  const handleSignUpToSignIn = () => {
    setCurrentPage('signin');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('branding');
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'signin':
        return <SignIn key="signin" onBack={handleSignInToSignUp} onNavigateHome={() => setCurrentPage('branding')} onSuccess={handleAuthSuccess} />;
      case 'signup':
        return <SignUp key="signup" onBack={handleSignUpToSignIn} onNavigateHome={() => setCurrentPage('branding')} onSuccess={handleAuthSuccess} />;
      case 'branding':
        return <BrandingDashboard key="branding" onNavigate={setCurrentPage} />;
      case 'gait':
        return <GaitRecognition key="gait" userRole={userRole} />;
      case 'employees':
        return <EmployeesList key="employees" />;
      case 'posture':
        return <PostureDetection key="posture" />;
      case 'wellness':
        return <WellnessDashboard key="wellness" />;
      case 'ai-insights':
        return <UserAIInsights key="ai-insights" />;
      case 'home':
        return userRole === 'admin' ? <AdminHome key="home" /> : <UserHome key="home" />;
      case 'workplace':
        return <WorkplaceDashboard key="workplace" />;
      case 'log':
        return <DailyLog key="log" />;
      case 'chat':
        return <Chat key="chat" />;
      case 'analytics':
        return <Analytics key="analytics" />;
      default:
        return <BrandingDashboard key="branding" />;
    }
  };
  
  const isAuthPage = currentPage === 'signin' || currentPage === 'signup';
  const isBrandingPage = currentPage === 'branding';
  const isScrollablePage = currentPage === 'workplace' || currentPage === 'analytics' || currentPage === 'home' || currentPage === 'log' || currentPage === 'chat' || currentPage === 'gait' || currentPage === 'employees' || currentPage === 'posture' || currentPage === 'wellness' || currentPage === 'ai-insights';
  
  return (
    <div className={`relative w-full h-screen ${isBrandingPage ? 'bg-black' : 'bg-night-blue'} ${isScrollablePage || isBrandingPage ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      {/* Header - Only show when logged in (not on branding or auth pages) */}
      {isLoggedIn && !isAuthPage && (
        <Header 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          onAuthClick={handleAuthClick}
          onLogout={handleLogout}
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
    </div>
  );
}

export default App;

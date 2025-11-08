import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CheckCircle2 } from 'lucide-react';
import Logo from '../images/Logo.png';

const SignIn = ({ onBack, onNavigateHome, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleBackClick = () => {
    // Navigate to home/branding page
    if (onNavigateHome) {
      onNavigateHome();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(import.meta.env.VITE_API_AUTH_LOGIN, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store authentication data
        if (data.access_token) {
          localStorage.setItem('auth_token', data.access_token);
          localStorage.setItem('token_type', data.token_type);
          localStorage.setItem('user_type', data.user_type);
          localStorage.setItem('user_data', JSON.stringify(data.user_data));
        }
        
        // Clear storage if remember me is not checked
        if (!rememberMe) {
          sessionStorage.setItem('auth_token', data.access_token);
          sessionStorage.setItem('user_data', JSON.stringify(data.user_data));
        }
        
        // Determine user role (admin if user_type is 'admin' or email contains 'admin')
        const userRole = data.user_type === 'admin' || data.user_data.email?.toLowerCase().includes('admin') ? 'admin' : 'user';
        
        // Show success message
        setSuccessMessage(`Welcome back, ${data.user_data.full_name || data.user_data.email}!`);
        
        // Navigate after a short delay
        setTimeout(() => {
          onSuccess(userRole);
        }, 1500);
      } else {
        setError(data.detail || 'Sign in failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-night-blue via-night-deep to-forest-dark overflow-hidden flex items-center justify-center">
      <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 flex justify-center items-center">
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="absolute top-4 left-4 md:top-6 md:left-6 text-forest-light hover:text-sunlight-yellow transition-colors p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Card */}
          <div className="glass-card p-6 sm:p-7 md:p-8 rounded-2xl mb-8">
            {/* Header */}
            <div className="text-center mb-4 md:mb-5">
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2 md:mb-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img src={Logo} alt="Zyntra Logo" className="w-full h-full object-contain" />
              </motion.div>
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-light text-white mb-1">Welcome Back</h1>
              <p className="text-forest-light text-xs md:text-sm">Sign in to continue your journey</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-3 text-red-200 text-xs md:text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-green-500 bg-opacity-20 border-2 border-green-400 border-opacity-50 rounded-xl p-4 text-green-300 text-sm md:text-base flex items-center gap-3 shadow-lg"
                  >
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                    <span className="font-semibold">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="text-white text-xs md:text-sm font-light mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-forest-light" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-forest-green focus:bg-opacity-15 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white text-xs md:text-sm font-light mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-forest-light" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-forest-green focus:bg-opacity-15 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white border-opacity-20 bg-white bg-opacity-10 text-forest-green focus:ring-forest-green focus:ring-offset-0"
                  />
                  <span className="text-white text-xs md:text-sm font-light">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sunlight-yellow hover:text-sunlight-glow transition-colors text-xs md:text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 md:py-3 bg-forest-green text-white rounded-xl font-medium hover:bg-forest-dark transition-all shadow-lg mt-3 md:mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 120, 0.5)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </form>
            
            {/* Divider */}
            <div className="my-4 md:my-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-white bg-opacity-20"></div>
              <span className="text-forest-light text-sm">or</span>
              <div className="flex-1 h-px bg-white bg-opacity-20"></div>
            </div>
            
            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-forest-light text-sm md:text-base">
                Don't have an account?{' '}
                <button
                  onClick={onBack}
                  className="text-sunlight-yellow hover:text-sunlight-glow transition-colors font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;

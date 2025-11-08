import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import Logo from '../images/Logo.png';

const SignUp = ({ onBack, onSuccess }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://zyntra-backend.azurewebsites.net/api/auth/user/register', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          full_name: name,
          password: password,
          admin_id: 2
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Account created successfully! Please sign in.');
        onBack(); // Navigate to sign in page
      } else {
        setError(data.detail || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-night-blue via-night-deep to-forest-dark">
      <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16 flex justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Card */}
          <div className="glass-card p-6 sm:p-6 md:p-7 rounded-2xl mb-8">
            {/* Header */}
            <div className="text-center mb-3 md:mb-4">
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img src={Logo} alt="Zyntra Logo" className="w-full h-full object-contain" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl md:text-2xl font-light text-white mb-1">Join Zyntra</h1>
              <p className="text-forest-light text-xs">Start growing your digital forest today</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
              {error && (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-3 text-red-200 text-xs md:text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="text-white text-xs font-light mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-forest-light" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 md:pl-11 pr-3 py-2 md:py-2.5 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-forest-green focus:bg-opacity-15 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white text-xs font-light mb-1 block">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-forest-light" size={16} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-9 md:pl-11 pr-3 py-2 md:py-2.5 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-forest-green focus:bg-opacity-15 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white text-xs font-light mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-forest-light" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-9 md:pl-11 pr-3 py-2 md:py-2.5 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-forest-green focus:bg-opacity-15 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white text-xs font-light mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-forest-light" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 md:pl-11 pr-3 py-2 md:py-2.5 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-forest-green focus:bg-opacity-15 transition-all"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-forest-light text-xs mt-0.5 ml-1">Minimum 8 characters</p>
              </div>
              
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white border-opacity-20 bg-white bg-opacity-10 text-forest-green focus:ring-forest-green focus:ring-offset-0 flex-shrink-0"
                  required
                />
                <label className="text-white text-xs font-light leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-sunlight-yellow hover:text-sunlight-glow underline">
                    Terms & Conditions
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-sunlight-yellow hover:text-sunlight-glow underline">
                    Privacy Policy
                  </button>
                </label>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-forest-green text-white rounded-xl font-medium hover:bg-forest-dark transition-all shadow-lg mt-2 md:mt-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 120, 0.5)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>
            
            {/* Divider */}
            <div className="my-3 md:my-4 flex items-center gap-4">
              <div className="flex-1 h-px bg-white bg-opacity-20"></div>
              <span className="text-forest-light text-sm">or</span>
              <div className="flex-1 h-px bg-white bg-opacity-20"></div>
            </div>
            
            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-forest-light text-sm md:text-base">
                Already have an account?{' '}
                <button
                  onClick={onBack}
                  className="text-sunlight-yellow hover:text-sunlight-glow transition-colors font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;

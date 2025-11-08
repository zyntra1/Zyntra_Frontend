import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle2, Zap, Users, TrendingUp, Shield, Brain, Heart, Sparkles } from 'lucide-react';

const BrandingDashboard = ({ onNavigate }) => {
  const handleGetStarted = () => {
    if (onNavigate) onNavigate('signup');
  };

  const handleSignIn = () => {
    if (onNavigate) onNavigate('signin');
  };

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 80,
      },
    },
  };

  return (
    <div className="h-full overflow-y-auto relative scroll-smooth bg-black" style={{ 
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
      overflowY: 'scroll',
      scrollbarWidth: 'thin'
    }}>
      {/* Spline 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black" style={{ 
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: 1000
      }}>
        <style>{`
          iframe[title="3D Background"] {
            pointer-events: none !important;
          }
          /* Hide Spline watermark */
          iframe[title="3D Background"]::after,
          .spline-watermark,
          [class*="spline"],
          [id*="spline"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          /* Smooth scrolling optimization */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(168, 213, 186, 0.3);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(168, 213, 186, 0.5);
          }
        `}</style>
        <iframe 
          src='https://my.spline.design/squarechipsfallinginplace-HSDJLOalUv6eq8lXrFkaW1gc/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
          title="3D Background"
          loading="lazy"
          style={{ pointerEvents: 'none' }}
        />
        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/50 via-forest-900/40 to-forest-900/60" />
        {/* Cover bottom right corner to hide watermark */}
        <div className="absolute bottom-2 right-2 w-36 h-12 bg-forest-900 z-10" style={{ 
          background: 'linear-gradient(135deg, transparent 0%, rgba(31, 41, 36, 0.95) 1%, rgba(31, 41, 36, 1) 100%)'
        }} />
      </div>

      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-forest-light/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{
              y: 0,
              x: 0,
              opacity: 0.2,
            }}
            animate={{
              y: -30,
              x: Math.random() * 20 - 10,
              opacity: 0.5,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 z-20">
        {/* Animated Background Gradient */}
        <motion.div
          initial={{
            background: 'radial-gradient(circle at 20% 50%, rgba(168, 213, 186, 0.1) 0%, transparent 50%)'
          }}
          animate={{
            background: 'radial-gradient(circle at 40% 40%, rgba(168, 213, 186, 0.1) 0%, transparent 50%)'
          }}
          transition={{ duration: 15 }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-5xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, delay: 0.1 }}
            className="mb-8"
          >
            <motion.div 
              className="inline-block px-6 py-3 rounded-full bg-forest-light/15 border border-forest-light/30 backdrop-blur-md relative overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, borderColor: 'rgba(168, 213, 186, 0.5)', boxShadow: '0 10px 30px rgba(168, 213, 186, 0.3)' }}
            >
              <span className="text-forest-light font-semibold text-sm relative z-10">
                Welcome to ZYNTRA
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, type: "spring" }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-forest-light mb-4 sm:mb-6 tracking-tight leading-tight px-2 drop-shadow-2xl"
            style={{ textShadow: '0 0 40px rgba(168, 213, 186, 0.4)' }}
          >
            <span>
              Workplace Wellness
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-forest-light via-green-300 to-forest-light bg-clip-text text-transparent"
              initial={{
                backgroundPosition: "0% center"
              }}
              animate={{
                backgroundPosition: "100% center"
              }}
              transition={{ duration: 2 }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              Reimagined
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-forest-light/70 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Real-time wellness monitoring powered by AI. Make workplace wellness visible, measurable, and empathetic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ 
                scale: 1.08, 
                boxShadow: '0 25px 50px rgba(168, 213, 186, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl bg-forest-light text-forest-900 font-bold text-base sm:text-lg hover:bg-forest-light/90 transition-all shadow-lg relative overflow-hidden group w-full sm:w-auto"
            >
              <span className="relative z-10">Get Started</span>
            </motion.button>
            <motion.button
              onClick={handleSignIn}
              whileHover={{ 
                scale: 1.08,
                backgroundColor: 'rgba(168, 213, 186, 0.1)',
                borderColor: 'rgba(168, 213, 186, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl border-2 border-forest-light/30 text-forest-light font-bold text-base sm:text-lg transition-all w-full sm:w-auto"
            >
              Sign In
            </motion.button>
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 15 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="flex justify-center"
          >
            <motion.div
              className="w-8 h-12 rounded-full border-2 border-forest-light/30 flex items-start justify-center p-2"
              whileHover={{ borderColor: 'rgba(168, 213, 186, 0.6)', scale: 1.1 }}
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: 6 }}
                transition={{ duration: 1, delay: 0.45 }}
                className="w-1 h-2 bg-forest-light/60 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest-900 pointer-events-none"></div>
      </div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-4 sm:px-6 lg:px-8 z-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-forest-light mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-forest-light/60 max-w-2xl mx-auto">
              Everything you need to transform workplace wellness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                desc: "Intelligent algorithms detect wellness patterns and provide personalized recommendations before issues escalate.",
                features: ["Real-time Analysis", "Pattern Detection", "Predictive Alerts"]
              },
              {
                icon: Heart,
                title: "Holistic Monitoring",
                desc: "Track posture, focus, fatigue, engagement, and attendance in one unified dashboard.",
                features: ["6 Key Metrics", "Live Updates", "Historical Trends"]
              },
              {
                icon: Zap,
                title: "Quick Actions",
                desc: "Empower employees with one-click wellness interventions designed for immediate relief.",
                features: ["Take Break", "Hydrate", "Stretch", "Focus Mode"]
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ y: -20, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-light/10 to-forest-light/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative glass-card p-6 sm:p-8 rounded-2xl h-full border border-forest-light/20 hover:border-forest-light/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-forest-light/20">
                  <div className="mb-4 sm:mb-6">
                    <feature.icon className="w-12 h-12 sm:w-16 sm:h-16 text-forest-light drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-forest-light mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-forest-light/70 mb-4 sm:mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="space-y-2">
                    {feature.features.map((f, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-2 text-sm text-forest-light/60"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-forest-light/50" />
                        {f}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-forest-light/5 to-transparent z-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { value: "100%", label: "Employee Focus", icon: Users },
              { value: "24/7", label: "Monitoring", icon: TrendingUp },
              { value: "Real-time", label: "AI Processing", icon: Brain },
              { value: "∞", label: "Wellness Scale", icon: Shield }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl text-center border border-forest-light/20 hover:border-forest-light/50 transition-all group shadow-xl hover:shadow-2xl hover:shadow-forest-light/20"
              >
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-forest-light/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-forest-light mx-auto relative z-10" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-forest-light mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-forest-light/60 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-4 sm:px-6 lg:px-8 z-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-forest-light mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-forest-light/60 max-w-2xl mx-auto">
              Three simple steps to wellness transformation
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-12 max-w-5xl mx-auto">
            {[
              { num: 1, title: "Collect", desc: "Monitor posture, focus, and engagement in real-time" },
              { num: 2, title: "Analyze", desc: "AI processes patterns and detects wellness issues" },
              { num: 3, title: "Act", desc: "Receive insights and take immediate wellness actions" }
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.08 }}
                  className="flex-1 text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-forest-light/30 to-forest-light/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 border-2 border-forest-light/20 group-hover:border-forest-light/50 transition-all relative overflow-hidden"
                  >
                    <span className="text-3xl sm:text-4xl font-black text-forest-light relative z-10">
                      {step.num}
                    </span>
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-forest-light mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-forest-light/70 leading-relaxed px-2">{step.desc}</p>
                </motion.div>
                {idx < 2 && (
                  <div className="hidden md:block">
                    <div className="text-4xl text-forest-light/30 font-bold">
                      →
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stakeholder Benefits */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-transparent to-forest-light/5 z-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-forest-light mb-4">
              Who Benefits?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-forest-light/60 max-w-2xl mx-auto">
              Creating value for every stakeholder
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Employees",
                benefits: ["Feel supported and valued", "Improve wellness habits", "Prevent burnout", "Work healthier"]
              },
              {
                title: "HR Teams",
                benefits: ["Detect issues early", "Support teams proactively", "Track key metrics", "Make data decisions"]
              },
              {
                title: "Companies",
                benefits: ["Boost productivity", "Reduce absenteeism", "Improve retention", "Build culture"]
              }
            ].map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-forest-light/20 hover:border-forest-light/50 transition-all group relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-forest-light/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl sm:text-2xl font-bold text-forest-light mb-4 sm:mb-6 relative z-10">
                  {group.title}
                </h3>
                <ul className="space-y-3 sm:space-y-4 relative z-10">
                  {group.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 + i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="flex items-center gap-3 text-forest-light/80"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-forest-light flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-forest-light/10 via-transparent to-forest-light/10 overflow-hidden z-20"
      >
        {/* Floating elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute w-32 h-32 rounded-full bg-forest-light/10 blur-2xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.random() * 40}%`
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-forest-light mb-6 sm:mb-8 px-4">
              Ready to Transform Wellness?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-forest-light/70 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Join forward-thinking companies making employee wellness visible, measurable, and empathetic
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(168, 213, 186, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl bg-forest-light text-forest-900 font-bold text-base sm:text-lg hover:bg-forest-light/90 transition-all shadow-lg relative overflow-hidden group w-full sm:w-auto"
              >
                <span className="relative z-10">Start Free Trial</span>
              </motion.button>
              <motion.button
                onClick={handleSignIn}
                whileHover={{ scale: 1.08, borderColor: 'rgba(168, 213, 186, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl border-2 border-forest-light/30 text-forest-light font-bold text-base sm:text-lg hover:bg-forest-light/10 transition-all relative overflow-hidden group w-full sm:w-auto"
              >
                <span className="relative z-10">Sign In</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <div className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 z-20">
        <div className="max-w-7xl mx-auto text-center text-forest-light/50">
          <p className="text-sm sm:text-base md:text-lg">
            © 2024 ZYNTRA. Making workplace wellness empathetic. 🌱
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandingDashboard;

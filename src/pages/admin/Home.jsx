import React, { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Leaf, Zap, Heart, Droplets, Wind } from 'lucide-react';
import ForestScene from '../../components/ForestScene';
import ForestFeedback from '../../components/ForestFeedback';
import useStore from '../../store/useStore';

const EcoScoreOrb = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  
  const getColor = () => {
    if (percentage > 80) return { bg: '#00A878', accent: '#00D4AA', glow: 'rgba(0, 212, 170, 0.8)' };
    if (percentage > 60) return { bg: '#FFD60A', accent: '#FFE156', glow: 'rgba(255, 225, 86, 0.8)' };
    if (percentage > 40) return { bg: '#FFA726', accent: '#FFB74D', glow: 'rgba(255, 167, 38, 0.8)' };
    return { bg: '#FF6B6B', accent: '#FF8787', glow: 'rgba(255, 107, 107, 0.8)' };
  };
  
  const colors = getColor();
  
  const containerVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const orbVariants = {
    animate: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="absolute top-8 md:top-12 left-1/2 transform -translate-x-1/2 z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="glass-card px-8 py-6 text-center rounded-3xl border border-white border-opacity-10 backdrop-blur-xl"
        variants={floatingVariants}
        animate="animate"
      >
        <div className="relative">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="absolute rounded-full border-2 border-white border-opacity-20"
              style={{ width: '160px', height: '160px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute rounded-full border-2 border-white border-opacity-10"
              style={{ width: '200px', height: '200px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Glowing Orb */}
          <motion.div
            className="w-28 h-28 mx-auto mb-6 rounded-full relative"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${colors.bg})`,
              boxShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
            }}
            variants={orbVariants}
            animate="animate"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-4xl font-bold text-white drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {score}
              </motion.span>
            </div>
          </motion.div>
          
          {/* Label with animation */}
          <motion.h3 
            className="text-white text-xl font-light mb-3"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Eco Score
          </motion.h3>
          
          {/* Enhanced Progress Bar */}
          <div className="w-80 h-3 bg-white bg-opacity-10 rounded-full overflow-hidden border border-white border-opacity-20 backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${colors.bg}, ${colors.accent})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Percentage Text */}
          <motion.p 
            className="text-white text-sm font-medium mt-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {Math.round(percentage)}%
          </motion.p>

          {/* Status Text */}
          <motion.p 
            className="text-forest-light text-sm mt-3 font-light"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
          >
            {percentage > 80 ? '✨ Your forest is thriving!' :
             percentage > 60 ? '🌿 Keep nurturing your forest' :
             percentage > 40 ? '🌤️ Your forest needs attention' :
             '🌧️ Time to restore balance'}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-night-blue">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 mx-auto mb-4 border-4 border-forest-green border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-forest-light text-lg font-light">Growing your forest...</p>
    </motion.div>
  </div>
);

const Home = () => {
  const { ecoScore, maxEcoScore, forestHealth, activities } = useStore();
  const [showStats, setShowStats] = useState(true);
  
  // Calculate eco actions from recent activities
  const ecoActions = useMemo(() => {
    const recentActivities = activities.slice(-10); // Last 10 activities
    
    return {
      lightsOff: recentActivities.some(a => a.type === 'eco-action' && a.notes?.toLowerCase().includes('light')),
      exercise: recentActivities.some(a => a.type === 'exercise' || a.type === 'meditation'),
      ecoTravel: recentActivities.some(a => a.type === 'walk' || (a.type === 'eco-action' && a.notes?.toLowerCase().includes('travel'))),
      longWork: recentActivities.some(a => a.type === 'work' && a.duration > 4),
    };
  }, [activities]);
  
  // Calculate screen time from recent activities
  const screenTime = useMemo(() => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(a => new Date(a.date).toDateString() === today);
    const phoneTime = todayActivities
      .filter(a => a.type === 'phone')
      .reduce((sum, a) => sum + a.duration, 0);
    const workTime = todayActivities
      .filter(a => a.type === 'work' || a.type === 'sedentary')
      .reduce((sum, a) => sum + a.duration, 0);
    return phoneTime + workTime * 0.5; // Work counts as 50% screen time
  }, [activities]);

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: "spring"
      }
    })
  };

  const stats = [
    { icon: Leaf, label: 'Trees', value: Math.floor(forestHealth * 30), color: 'from-green-400 to-emerald-600' },
    { icon: Heart, label: 'Health', value: Math.floor(forestHealth * 100), color: 'from-red-400 to-rose-600' },
    { icon: Zap, label: 'Energy', value: Math.floor((1 - screenTime / 100) * 100), color: 'from-yellow-400 to-amber-600' },
    { icon: Droplets, label: 'Water', value: Math.floor(ecoScore * 3), color: 'from-blue-400 to-cyan-600' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-night-blue via-forest-dark to-night-deep">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-1/4 w-96 h-96 bg-forest-green rounded-full mix-blend-screen opacity-5"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-sunlight-yellow rounded-full mix-blend-screen opacity-3"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Forest Feedback Notifications */}
      <ForestFeedback 
        ecoActions={ecoActions}
        screenTime={screenTime}
        forestHealth={forestHealth}
      />
      
      {/* 3D Forest Canvas */}
      <Canvas shadows className="w-full h-full">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
          <OrbitControls 
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
            minDistance={8}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            autoRotate={false}
          />
          <ForestScene 
            health={forestHealth} 
            timeOfDay="day"
            ecoActions={ecoActions}
            screenTime={screenTime}
          />
        </Suspense>
      </Canvas>

      {/* Stats Grid - Bottom Left */}
      <motion.div
        className="absolute bottom-8 left-8 grid grid-cols-2 gap-4 z-10"
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={statVariants}
              custom={i}
              className="glass-card px-4 py-3 rounded-2xl backdrop-blur-xl border border-white border-opacity-10 hover:border-opacity-30 transition-all group hover:scale-110"
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </motion.div>
                <div className="text-left">
                  <p className="text-forest-light text-xs font-light">{stat.label}</p>
                  <motion.p 
                    className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Panel - Bottom Right */}
      <motion.div
        className="absolute bottom-8 right-8 glass-card px-6 py-4 rounded-2xl backdrop-blur-xl border border-white border-opacity-10 z-10"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        onMouseEnter={() => setShowStats(true)}
      >
        <div className="flex items-center gap-3 mb-2">
          <Wind className="w-5 h-5 text-sunlight-yellow" />
          <p className="text-white text-sm font-light">
            Forest Mode: <span className="text-forest-light font-medium">Active</span>
          </p>
        </div>
        <p className="text-forest-light text-xs opacity-70">
          ☀️ Daytime • Drag to explore • Scroll to zoom
        </p>
      </motion.div>

      {/* Hint - Center Bottom */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="glass-card px-4 py-2 rounded-full text-forest-light text-xs font-light">
          🌱 Interact with your digital forest
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

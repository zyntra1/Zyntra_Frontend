import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Zap, Heart, Droplets, Wind, Sun, Moon, Trees, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('day'); // User controllable day/night
  const [isInfoPanelExpanded, setIsInfoPanelExpanded] = useState(true); // Info panel toggle

  // Fetch wellness forest data
  useEffect(() => {
    const fetchWellnessData = async () => {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (!token) {
          console.log('No token found, using default values');
          setLoading(false);
          return;
        }

        const response = await fetch('https://aaa95094eca4.ngrok-free.app/wellness/forest', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setWellnessData(data);
          console.log('Wellness data loaded:', data);
        }
      } catch (err) {
        console.error('Error fetching wellness data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWellnessData();
  }, []);
  
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

  // Use wellness data if available, otherwise use store values
  const stats = wellnessData ? [
    { icon: Leaf, label: 'Trees', value: wellnessData.total_trees || 0, color: 'from-green-400 to-emerald-600' },
    { icon: Heart, label: 'Health', value: Math.floor(wellnessData.forest_health_score || 0), color: 'from-red-400 to-rose-600' },
    { icon: Zap, label: 'Sunlight', value: wellnessData.sunlight_level || 0, color: 'from-yellow-400 to-amber-600' },
    { icon: Droplets, label: 'Water', value: wellnessData.water_level || 0, color: 'from-blue-400 to-cyan-600' },
  ] : [
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
            timeOfDay={timeOfDay}
            ecoActions={ecoActions}
            screenTime={screenTime}
            wellnessData={wellnessData}
          />
        </Suspense>
      </Canvas>

      {/* Day/Night Toggle - Bottom Left */}
      <motion.div
        className="absolute bottom-8 left-8 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="glass-card px-4 py-3 rounded-2xl backdrop-blur-xl border border-white border-opacity-10 flex flex-col gap-2">
          <p className="text-forest-light text-xs font-semibold text-center">Time of Day</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-3 rounded-xl transition-all ${
                timeOfDay === 'day' 
                  ? 'bg-yellow-400 text-night-blue shadow-lg scale-105' 
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              <Sun className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-3 rounded-xl transition-all ${
                timeOfDay === 'night' 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
              }`}
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Forest Information Panel - Top Right */}
      {wellnessData && (
        <motion.div
          className="absolute top-24 right-8 z-10 glass-card rounded-2xl backdrop-blur-xl border border-white border-opacity-10 max-w-sm overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Header with minimize button */}
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors"
            onClick={() => setIsInfoPanelExpanded(!isInfoPanelExpanded)}
          >
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Trees className="w-5 h-5 text-forest-light" />
              Forest Details
            </h3>
            <button className="text-forest-light hover:text-white transition-colors">
              {isInfoPanelExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          <AnimatePresence>
            {isInfoPanelExpanded && (
              <motion.div 
                className="px-6 pb-4 space-y-2 text-sm"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
            {/* Tree Distribution */}
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <p className="text-forest-light font-semibold mb-1">Tree Distribution</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-green-400">🌳</span>
                  <span className="text-white">{wellnessData.healthy_trees} Healthy</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">🌱</span>
                  <span className="text-white">{wellnessData.growing_trees} Growing</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-400">🍂</span>
                  <span className="text-white">{wellnessData.wilting_trees} Wilting</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">🪵</span>
                  <span className="text-white">{wellnessData.dead_trees} Dead</span>
                </div>
              </div>
            </div>

            {/* Environmental Factors */}
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <p className="text-forest-light font-semibold mb-1">Environment</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">☀️ Sunlight:</span>
                  <span className="text-white font-medium">{wellnessData.sunlight_level}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">💧 Water:</span>
                  <span className="text-white font-medium">{wellnessData.water_level}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">🌱 Soil Quality:</span>
                  <span className="text-white font-medium">{wellnessData.soil_quality}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">💨 Air Quality:</span>
                  <span className="text-white font-medium">{wellnessData.air_quality}%</span>
                </div>
              </div>
            </div>

            {/* Special Features */}
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <p className="text-forest-light font-semibold mb-1">Special Features</p>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className={`text-center p-1 rounded ${wellnessData.has_flowers ? 'bg-pink-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'}`}>
                  🌸 Flowers
                </div>
                <div className={`text-center p-1 rounded ${wellnessData.has_birds ? 'bg-blue-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'}`}>
                  🐦 Birds
                </div>
                <div className={`text-center p-1 rounded ${wellnessData.has_butterflies ? 'bg-purple-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'}`}>
                  🦋 Butterflies
                </div>
                <div className={`text-center p-1 rounded ${wellnessData.has_stream ? 'bg-cyan-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'}`}>
                  🌊 Stream
                </div>
                <div className={`text-center p-1 rounded ${wellnessData.has_bench ? 'bg-amber-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'}`}>
                  🪑 Bench
                </div>
                <div className={`text-center p-1 rounded ${wellnessData.has_rocks ? 'bg-gray-500 bg-opacity-20' : 'bg-gray-500 bg-opacity-20'}`}>
                  🪨 Rocks
                </div>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="bg-white bg-opacity-5 rounded-lg p-2">
              <div className="flex justify-between items-center">
                <span className="text-forest-light font-semibold text-xs">Growth Rate:</span>
                <span className={`font-bold ${wellnessData.growth_rate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {wellnessData.growth_rate > 0 ? '↑' : '↓'} {Math.abs(wellnessData.growth_rate).toFixed(1)}%
                </span>
              </div>
            </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

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
        {wellnessData ? (
          <p className="text-forest-light text-xs opacity-70">
            {wellnessData.season === 'spring' ? '🌸' : wellnessData.season === 'summer' ? '☀️' : wellnessData.season === 'autumn' ? '🍂' : '❄️'} 
            {' '}{wellnessData.season?.charAt(0).toUpperCase() + wellnessData.season?.slice(1)} • 
            {timeOfDay === 'day' ? '☀️ Day' : '🌙 Night'} • 
            {wellnessData.weather?.charAt(0).toUpperCase() + wellnessData.weather?.slice(1)}
          </p>
        ) : (
          <p className="text-forest-light text-xs opacity-70">
            {timeOfDay === 'day' ? '☀️ Daytime' : '🌙 Nighttime'} • Drag to explore • Scroll to zoom
          </p>
        )}
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

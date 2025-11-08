import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Award, Heart, Zap, Target } from 'lucide-react';
import useStore from '../store/useStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500 bg-opacity-20`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-light text-white mb-1">{value}</h3>
      <p className="text-forest-light text-sm">{label}</p>
    </motion.div>
  );
};

const BadgeCard = ({ badge }) => {
  return (
    <motion.div
      className="glass-card p-4 text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="text-4xl mb-2">{badge.name.split(' ')[1]}</div>
      <h4 className="text-white text-sm font-medium mb-1">
        {badge.name.split(' ')[0]}
      </h4>
      <p className="text-forest-light text-xs">{badge.description}</p>
      <p className="text-sunlight-yellow text-xs mt-2">
        {new Date(badge.earned).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

const Analytics = () => {
  const { ecoScore, activities, scoreHistory, badges } = useStore();
  
  // Calculate statistics
  const stats = useMemo(() => {
    const positiveActivities = activities.filter(a => a.ecoImpact > 0);
    const totalPositiveImpact = positiveActivities.reduce((sum, a) => sum + a.ecoImpact, 0);
    
    const workActivities = activities.filter(a => a.type === 'work');
    const wellnessActivities = activities.filter(a => 
      a.type === 'exercise' || a.type === 'meditation' || a.type === 'walk'
    );
    
    const currentWeekActivities = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate > weekAgo;
    });
    
    const prevWeekActivities = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate > twoWeeksAgo && activityDate <= weekAgo;
    });
    
    const activityTrend = prevWeekActivities.length > 0
      ? Math.round(((currentWeekActivities.length - prevWeekActivities.length) / prevWeekActivities.length) * 100)
      : 0;
    
    return {
      energySaved: totalPositiveImpact,
      focusStreak: workActivities.length,
      wellnessBalance: wellnessActivities.length,
      weeklyActivities: currentWeekActivities.length,
      activityTrend
    };
  }, [activities]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      
      const dayData = scoreHistory.filter(h => h.date === dateStr);
      const avgScore = dayData.length > 0
        ? dayData.reduce((sum, h) => sum + h.score, 0) / dayData.length
        : 0;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round(avgScore)
      });
    }
    
    return {
      labels: last7Days.map(d => d.date),
      datasets: [
        {
          label: 'Eco Score',
          data: last7Days.map(d => d.score),
          borderColor: '#00A878',
          backgroundColor: 'rgba(0, 168, 120, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#FFE156',
          pointBorderColor: '#00A878',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [scoreHistory]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(11, 19, 43, 0.9)',
        titleColor: '#A7E8BD',
        bodyColor: '#ffffff',
        borderColor: '#00A878',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#A7E8BD',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#A7E8BD',
        },
      },
    },
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-night-blue to-night-deep">
      <div className="h-full overflow-y-auto pt-32 md:pt-36 pb-8 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-light text-white mb-2">Analytics</h1>
            <p className="text-forest-light">Track your progress and celebrate achievements</p>
          </motion.div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Zap}
              label="Energy Saved"
              value={stats.energySaved}
              color="sunlight"
            />
            <StatCard
              icon={Target}
              label="Focus Sessions"
              value={stats.focusStreak}
              color="forest"
            />
            <StatCard
              icon={Heart}
              label="Wellness Activities"
              value={stats.wellnessBalance}
              color="red"
            />
            <StatCard
              icon={TrendingUp}
              label="This Week"
              value={stats.weeklyActivities}
              color="blue"
              trend={stats.activityTrend}
            />
          </div>
          
          {/* Chart */}
          <motion.div
            className="glass-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-1">Eco Score History</h2>
                <p className="text-forest-light text-sm">Last 7 days</p>
              </div>
              <div className="glass-card px-4 py-2">
                <span className="text-white text-sm">Current: </span>
                <span className="text-sunlight-yellow text-xl font-medium">{ecoScore}</span>
              </div>
            </div>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>
          
          {/* Badges Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-sunlight-yellow" size={28} />
              <div>
                <h2 className="text-2xl font-light text-white">Achievements</h2>
                <p className="text-forest-light text-sm">
                  {badges.length} badge{badges.length !== 1 ? 's' : ''} earned
                </p>
              </div>
            </div>
            
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-white text-lg font-light mb-2">No badges yet</p>
                <p className="text-forest-light">
                  Keep logging activities to earn your first achievement!
                </p>
              </div>
            )}
          </motion.div>
          
          {/* Motivational Section */}
          <motion.div
            className="mt-8 glass-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-light text-white mb-3">
              {ecoScore >= 80 ? '🌟 Outstanding!' :
               ecoScore >= 60 ? '🌿 Great Progress!' :
               ecoScore >= 40 ? '🌱 Keep Going!' :
               '💪 You Can Do It!'}
            </h3>
            <p className="text-forest-light max-w-2xl mx-auto">
              {ecoScore >= 80 ? 'Your forest is thriving! Your consistent positive actions are creating a beautiful ecosystem.' :
               ecoScore >= 60 ? 'You\'re building great habits. A few more wellness activities could push you to the next level!' :
               ecoScore >= 40 ? 'Every positive action counts. Focus on small, consistent improvements.' :
               'Your forest needs care. Start with simple actions like a short walk or meditation.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import useStore from '../store/useStore';

const activityTypes = [
  { id: 'work', emoji: '💼', label: 'Work/Study', impact: 5 },
  { id: 'exercise', emoji: '🏃', label: 'Exercise', impact: 10 },
  { id: 'meditation', emoji: '🧘', label: 'Meditation', impact: 8 },
  { id: 'walk', emoji: '🚶', label: 'Walk', impact: 7 },
  { id: 'reading', emoji: '📚', label: 'Reading', impact: 6 },
  { id: 'social', emoji: '👥', label: 'Social Time', impact: 5 },
  { id: 'phone', emoji: '📱', label: 'Phone Use', impact: -5 },
  { id: 'sedentary', emoji: '🛋️', label: 'Sedentary', impact: -3 },
  { id: 'junk-food', emoji: '🍔', label: 'Junk Food', impact: -4 },
  { id: 'eco-action', emoji: '♻️', label: 'Eco Action', impact: 12 },
];

const ActivityModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const addActivity = useStore((state) => state.addActivity);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedType) return;
    
    const activity = activityTypes.find(a => a.id === selectedType);
    const durationMultiplier = duration / 30; // Base is 30 minutes
    const totalImpact = Math.round(activity.impact * durationMultiplier);
    
    addActivity({
      type: selectedType,
      emoji: activity.emoji,
      label: activity.label,
      duration,
      notes,
      ecoImpact: totalImpact
    });
    
    // Reset form
    setSelectedType(null);
    setDuration(30);
    setNotes('');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-white">Log Activity</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-forest-light transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Activity Type Selection */}
                <div className="mb-6">
                  <label className="text-white text-sm font-light mb-3 block">
                    What did you do?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activityTypes.map((activity) => (
                      <motion.button
                        key={activity.id}
                        type="button"
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedType === activity.id
                            ? 'border-forest-green bg-forest-green bg-opacity-20 scale-105'
                            : 'border-white border-opacity-20 hover:border-forest-light'
                        }`}
                        onClick={() => setSelectedType(activity.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-4xl mb-2">{activity.emoji}</div>
                        <div className="text-white text-xs font-light">{activity.label}</div>
                        <div className={`text-xs mt-1 ${
                          activity.impact > 0 ? 'text-forest-light' : 'text-red-400'
                        }`}>
                          {activity.impact > 0 ? '+' : ''}{activity.impact}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Duration */}
                <div className="mb-6">
                  <label className="text-white text-sm font-light mb-3 block">
                    Duration: {duration} minutes
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="240"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer accent-forest-green"
                  />
                  <div className="flex justify-between text-xs text-forest-light mt-1">
                    <span>5 min</span>
                    <span>4 hours</span>
                  </div>
                </div>
                
                {/* Notes */}
                <div className="mb-6">
                  <label className="text-white text-sm font-light mb-3 block">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did it make you feel?"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-forest-green transition-colors resize-none"
                    rows="3"
                  />
                </div>
                
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!selectedType}
                  className={`w-full py-4 rounded-xl font-medium transition-all ${
                    selectedType
                      ? 'bg-forest-green text-white hover:bg-forest-dark'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={selectedType ? { scale: 1.02 } : {}}
                  whileTap={selectedType ? { scale: 0.98 } : {}}
                >
                  Log Activity
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ActivityCard = ({ activity }) => {
  return (
    <motion.div
      className="glass-card p-4 mb-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{activity.emoji}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-white font-medium">{activity.label}</h3>
            <span className={`text-sm font-medium ${
              activity.ecoImpact > 0 ? 'text-forest-light' : 'text-red-400'
            }`}>
              {activity.ecoImpact > 0 ? '+' : ''}{activity.ecoImpact}
            </span>
          </div>
          <p className="text-forest-light text-sm">
            {activity.duration} minutes • {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {activity.notes && (
            <p className="text-white text-opacity-70 text-sm mt-2 italic">
              "{activity.notes}"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DailyLog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activities = useStore((state) => state.activities);
  
  // Group activities by date
  const activitiesByDate = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-night-blue to-night-deep">
      <div className="h-full overflow-y-auto pt-32 md:pt-36 pb-8 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-light text-white mb-2">Daily Log</h1>
            <p className="text-forest-light">Track your activities and watch your forest grow</p>
          </motion.div>
          
          {/* Add Activity Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="w-full glass-card p-6 mb-8 flex items-center justify-center gap-3 hover:bg-forest-green hover:bg-opacity-20 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="text-forest-green group-hover:rotate-90 transition-transform" size={24} />
            <span className="text-white font-light text-lg">Log New Activity</span>
          </motion.button>
          
          {/* Activities List */}
          {Object.keys(activitiesByDate).length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-white text-lg font-light mb-2">No activities yet</p>
              <p className="text-forest-light">Start logging to grow your forest!</p>
            </motion.div>
          ) : (
            Object.keys(activitiesByDate).sort().reverse().map((date) => (
              <div key={date} className="mb-8">
                <h2 className="text-white text-lg font-light mb-4 flex items-center gap-2">
                  <span>📅</span>
                  <span>{date}</span>
                  <span className="text-forest-light text-sm">
                    ({activitiesByDate[date].length} activities)
                  </span>
                </h2>
                {activitiesByDate[date].map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Modal */}
      <ActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DailyLog;

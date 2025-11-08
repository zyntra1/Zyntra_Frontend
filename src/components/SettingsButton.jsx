import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Volume2, VolumeX, Sun, Moon, Sunset } from 'lucide-react';
import useStore from '../store/useStore';

const SettingsModal = ({ isOpen, onClose }) => {
  const { soundEnabled, toggleSound, timeOfDay, setTimeOfDay } = useStore();
  
  const timeOptions = [
    { id: 'day', icon: Sun, label: 'Day', color: 'sunlight-yellow' },
    { id: 'evening', icon: Sunset, label: 'Evening', color: 'orange-500' },
    { id: 'night', icon: Moon, label: 'Night', color: 'blue-400' },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass-card p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-white flex items-center gap-2">
                  <Settings size={24} />
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-forest-light transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Sound Toggle */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-light mb-4">Ambient Sounds</h3>
                <motion.button
                  onClick={toggleSound}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                    soundEnabled
                      ? 'border-forest-green bg-forest-green bg-opacity-20'
                      : 'border-white border-opacity-20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {soundEnabled ? <Volume2 className="text-forest-green" /> : <VolumeX className="text-gray-400" />}
                    <span className="text-white">Forest Ambience</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-all ${
                    soundEnabled ? 'bg-forest-green' : 'bg-gray-600'
                  }`}>
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                      animate={{ x: soundEnabled ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>
              
              {/* Time of Day */}
              <div className="mb-6">
                <h3 className="text-white text-lg font-light mb-4">Time of Day</h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => setTimeOfDay(option.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          timeOfDay === option.id
                            ? 'border-forest-green bg-forest-green bg-opacity-20'
                            : 'border-white border-opacity-20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className={`mx-auto mb-2 text-${option.color}`} size={32} />
                        <div className="text-white text-sm">{option.label}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* Info */}
              <div className="glass-card p-4 bg-white bg-opacity-5">
                <p className="text-forest-light text-sm leading-relaxed">
                  💡 Tip: Ambient sounds can enhance your focus and help you feel more connected to your digital forest.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 z-30 glass-card p-3 text-white hover:text-forest-light transition-colors"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings size={24} />
      </motion.button>
      
      <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SettingsButton;

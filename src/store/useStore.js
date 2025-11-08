import { create } from 'zustand';

const useStore = create((set, get) => ({
      // Eco Score
      ecoScore: 50,
      maxEcoScore: 100,
      
      // Activities Log
      activities: [],
      
      // Analytics Data
      scoreHistory: [],
      badges: [],
      
      // Forest State
      forestHealth: 0.5, // 0 to 1
      timeOfDay: 'day', // 'day', 'evening', 'night'
      
      // Settings
      soundEnabled: false,
      
      // Actions
      updateEcoScore: (change) => {
        const currentScore = get().ecoScore;
        const newScore = Math.max(0, Math.min(100, currentScore + change));
        set({ 
          ecoScore: newScore,
          forestHealth: newScore / 100
        });
        
        // Add to history
        const history = get().scoreHistory;
        const today = new Date().toLocaleDateString();
        set({
          scoreHistory: [
            ...history,
            { date: today, score: newScore, timestamp: Date.now() }
          ].slice(-30) // Keep last 30 entries
        });
      },
      
      addActivity: (activity) => {
        const activities = get().activities;
        const newActivity = {
          id: Date.now(),
          ...activity,
          timestamp: Date.now(),
          date: new Date().toLocaleDateString()
        };
        set({ activities: [newActivity, ...activities] });
        get().updateEcoScore(activity.ecoImpact);
        
        // Check for new badges
        get().checkBadges();
      },
      
      checkBadges: () => {
        const { ecoScore, activities, badges } = get();
        const newBadges = [];
        
        // Eco Saver badge
        if (ecoScore >= 80 && !badges.find(b => b.id === 'eco-saver')) {
          newBadges.push({
            id: 'eco-saver',
            name: 'Eco Saver 🌿',
            description: 'Reached 80+ eco-score',
            earned: Date.now()
          });
        }
        
        // Focus Guardian badge
        const focusActivities = activities.filter(a => 
          a.type === 'work' || a.type === 'study'
        );
        if (focusActivities.length >= 10 && !badges.find(b => b.id === 'focus-guardian')) {
          newBadges.push({
            id: 'focus-guardian',
            name: 'Focus Guardian 🕊',
            description: 'Logged 10+ focus sessions',
            earned: Date.now()
          });
        }
        
        // Wellness Warrior badge
        const wellnessActivities = activities.filter(a => 
          a.type === 'exercise' || a.type === 'meditation'
        );
        if (wellnessActivities.length >= 7 && !badges.find(b => b.id === 'wellness-warrior')) {
          newBadges.push({
            id: 'wellness-warrior',
            name: 'Wellness Warrior 💚',
            description: 'Completed 7+ wellness activities',
            earned: Date.now()
          });
        }
        
        if (newBadges.length > 0) {
          set({ badges: [...badges, ...newBadges] });
        }
      },
      
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      
      setTimeOfDay: (time) => set({ timeOfDay: time }),
}));

export default useStore;

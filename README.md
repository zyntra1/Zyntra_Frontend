# 🌿 Zyntra - Your Living Digital Forest

<div align="center">

![Zyntra Banner](https://img.shields.io/badge/Zyntra-Digital%20Forest-00A878?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**An interactive web app that visualizes your daily habits as a living, breathing 3D forest**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 Concept

Zyntra transforms your daily lifestyle choices into a dynamic 3D forest ecosystem. Every action you take—from focused work sessions to wellness activities—directly impacts your forest's health, appearance, and vitality. Watch as your positive habits cause trees to grow, fog to clear, and magical particles to dance through your thriving forest.

## ✨ Features

### 🏞️ **Interactive 3D Forest Simulation**
- **Real-time Forest Visualization**: Full-screen 3D forest rendered with Three.js
- **Dynamic Environment**: Trees, fog, lighting, and particles that respond to your eco-score
- **Day/Night Cycle**: Switch between day, evening, and night modes
- **Natural Animations**: Wind-swaying trees, floating particles, and ambient movements
- **Interactive Controls**: Drag to explore, scroll to zoom

### 📊 **Eco-Score System**
- **Glowing Orb Display**: Beautiful animated orb showing your current eco-score (0-100)
- **Progress Tracking**: Visual progress bar with color-coded health indicators
- **Real-time Updates**: Forest changes instantly as you log activities
- **Dynamic Feedback**: Status messages that reflect your current progress

### 📝 **Daily Activity Logging**
- **10 Activity Types**: Work, Exercise, Meditation, Walking, Reading, Social, Phone Use, Sedentary, Junk Food, Eco Actions
- **Emoji-Based UI**: Clean, card-based interface with intuitive emoji icons
- **Smart Impact System**: Each activity has positive/negative eco-impact
- **Duration Tracking**: Slider to set activity duration (5 min - 4 hours)
- **Personal Notes**: Add reflections about how activities made you feel
- **Activity History**: View all logged activities organized by date

### 💬 **Nature Spirit AI Chat**
- **Conversational Interface**: Chat with your personal Nature Spirit guide
- **Context-Aware Responses**: AI analyzes your eco-score and recent activities
- **Motivational Messages**: Encouraging feedback based on your forest's health
- **Quick Actions**: Pre-defined questions for instant wisdom
- **Beautiful Avatar**: Glowing, animated spirit avatar with particle effects

### 📈 **Analytics Dashboard**
- **Interactive Charts**: Line chart showing 7-day eco-score history (Chart.js)
- **Key Metrics Cards**:
  - 🔋 Energy Saved (total positive impact)
  - 🎯 Focus Sessions count
  - ❤️ Wellness Activities count
  - 📊 Weekly activity trends
- **Achievement Badges**: Unlock rewards for milestones
  - 🌿 Eco Saver (80+ eco-score)
  - 🕊️ Focus Guardian (10+ focus sessions)
  - 💚 Wellness Warrior (7+ wellness activities)
- **Motivational Insights**: Personalized feedback based on your performance

### 🎨 **Beautiful UI/UX**
- **Nature-Inspired Design**: Serene, emotional, immersive aesthetics
- **Custom Color Palette**:
  - Forest Green (#00A878)
  - Sky Blue (#A7E8BD)
  - Sunlight Yellow (#FFE156)
  - Deep Night Blue (#0B132B)
- **Glass Morphism**: Frosted glass cards with subtle transparency
- **Smooth Animations**: Framer Motion for buttery transitions
- **Responsive Design**: Works beautifully on desktop and mobile
- **Custom Animations**:
  - Breathing effects on buttons
  - Glowing effects for important elements
  - Floating animations for ambient feel

### 🎵 **Ambient Features**
- **Sound Toggle**: Enable/disable forest ambience (birds, wind)
- **Settings Panel**: Floating gear icon for quick access
- **Time of Day Control**: Manually switch between day/evening/night

### 🧭 **Seamless Navigation**
- **Bottom/Side Navigation Bar**: 4 main sections
  - 🏞️ Forest - Main 3D visualization
  - 📊 Stats - Analytics dashboard
  - 💬 Chat - AI Nature Spirit
  - ➕ Log - Activity logging
- **Smooth Transitions**: Page transitions with Framer Motion
- **Active Tab Indicator**: Animated highlight following current page

---

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn installed
- Modern web browser with WebGL support

### Setup Steps

1. **Clone or Navigate to the Project**
```bash
cd "c:\Users\Mohammed Munazir\munazir\Zyntra"
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open in Browser**
The app will automatically open at `http://localhost:3000`

---

## 🎮 Usage

### Getting Started

1. **Explore Your Forest**
   - The app opens with your 3D forest in view
   - Drag to rotate the camera, scroll to zoom
   - Your eco-score appears at the top as a glowing orb

2. **Log Your First Activity**
   - Click the "➕ Log" button in the navigation
   - Choose an activity (e.g., "Exercise 🏃")
   - Set duration with the slider
   - Optionally add notes
   - Click "Log Activity"

3. **Watch Your Forest Change**
   - Navigate back to "🏞️ Forest"
   - Your eco-score and forest health update in real-time
   - Trees grow taller, fog clears, particles appear

4. **Chat with Nature Spirit**
   - Click "💬 Chat" in navigation
   - Ask questions or use quick actions
   - Receive personalized guidance and encouragement

5. **Track Your Progress**
   - Visit "📊 Stats" for analytics
   - View charts, earn badges, see trends
   - Get motivational insights

### Activity Impact Guide

**Positive Activities** (Increase Eco-Score):
- 🏃 Exercise: +10 per 30 min
- 🧘 Meditation: +8 per 30 min
- 🚶 Walk: +7 per 30 min
- 📚 Reading: +6 per 30 min
- 💼 Work/Study: +5 per 30 min
- 👥 Social Time: +5 per 30 min
- ♻️ Eco Action: +12 per 30 min

**Negative Activities** (Decrease Eco-Score):
- 📱 Phone Use: -5 per 30 min
- 🛋️ Sedentary: -3 per 30 min
- 🍔 Junk Food: -4 per 30 min

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18.2** | UI framework |
| **Vite** | Build tool and dev server |
| **Three.js** | 3D graphics engine |
| **@react-three/fiber** | React renderer for Three.js |
| **@react-three/drei** | Three.js helpers |
| **Framer Motion** | Animation library |
| **TailwindCSS** | Utility-first CSS |
| **Chart.js** | Data visualization |
| **react-chartjs-2** | React wrapper for Chart.js |
| **Zustand** | State management |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
Zyntra/
├── public/
├── src/
│   ├── components/
│   │   ├── ForestScene.jsx      # Three.js 3D forest
│   │   ├── Navigation.jsx        # Bottom/side nav bar
│   │   └── SettingsButton.jsx    # Settings modal
│   ├── pages/
│   │   ├── Home.jsx             # Forest visualization page
│   │   ├── DailyLog.jsx         # Activity logging page
│   │   ├── Chat.jsx             # AI chat interface
│   │   └── Analytics.jsx        # Dashboard with charts
│   ├── store/
│   │   └── useStore.js          # Zustand state management
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🎨 Design Philosophy

Zyntra follows a **nature-inspired, minimalist, and emotionally resonant** design:

- **Soft Colors**: Calming greens, blues, and yellows
- **Gentle Animations**: Nothing jarring, everything flows
- **Glass Morphism**: Elegant transparency and blur effects
- **Breathing Effects**: UI elements that feel alive
- **Serene Typography**: Light-weight Poppins font
- **Immersive 3D**: Forest that feels real and responds to you

---

## 🌱 Future Enhancements

Potential features for future versions:

- [ ] Social features (share forest with friends)
- [ ] Weekly/monthly challenges
- [ ] More badge types and achievements
- [ ] Actual ambient sound files
- [ ] Weather effects in forest (rain, snow)
- [ ] Seasonal changes
- [ ] Mobile app (React Native)
- [ ] Export progress reports
- [ ] Integration with fitness trackers
- [ ] Customizable forest themes

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Three.js Community** - For amazing 3D capabilities
- **Framer Motion** - For smooth animations
- **TailwindCSS** - For rapid styling
- **You** - For using Zyntra to improve your life! 🌿

---

<div align="center">

**Made with 💚 for a healthier, more balanced life**

*"Your forest is a mirror of your lifestyle. Nurture it, and it will nurture you."*

</div>

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

const generateAIResponse = (ecoScore, recentActivities, forestHealth) => {
  const responses = {
    high: [
      "Your forest feels calm today 🌞. The trees are swaying gently in harmony.",
      "✨ What a beautiful energy! Your actions are creating ripples of positivity.",
      "The forest spirits are grateful 🕊️. Keep nurturing this balance!",
      "🌿 I sense strong life force in your forest. You're in perfect harmony.",
    ],
    medium: [
      "Your forest is stable, but it could use a little more care 🌤️",
      "The trees whisper that they need more attention. Perhaps a walk in nature?",
      "🍃 Balance is near, but not quite there yet. What will you do today?",
      "Your forest shows promise. A few positive actions could make it thrive!",
    ],
    low: [
      "Digital fog is rising — maybe take a short break? 🌧️",
      "⚠️ The forest feels heavy. It's calling for restoration.",
      "I sense imbalance in your energy. Time for self-care?",
      "🌑 Your forest needs urgent attention. What's weighing you down?",
    ]
  };
  
  const insights = [
    "I noticed you've been quite active lately. Remember to rest too! 🌙",
    "Your focus sessions are improving the forest's clarity ✨",
    "The trees grow stronger with each mindful choice you make 🌲",
    "Have you considered adding more eco-friendly actions today? ♻️",
    "Your wellness activities are creating beautiful energy patterns 💚",
  ];
  
  let category = 'medium';
  if (ecoScore >= 70) category = 'high';
  else if (ecoScore <= 40) category = 'low';
  
  const mainResponse = responses[category][Math.floor(Math.random() * responses[category].length)];
  const insight = insights[Math.floor(Math.random() * insights.length)];
  
  return Math.random() > 0.5 ? mainResponse : insight;
};

const SpiritAvatar = () => {
  return (
    <motion.div
      className="w-12 h-12 rounded-full bg-gradient-to-br from-sunlight-yellow to-forest-green flex items-center justify-center"
      animate={{
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 20px rgba(255, 225, 86, 0.5)',
          '0 0 30px rgba(255, 225, 86, 0.8)',
          '0 0 20px rgba(255, 225, 86, 0.5)',
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Sparkles className="text-white" size={24} />
    </motion.div>
  );
};

const Message = ({ message, isUser }) => {
  return (
    <motion.div
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && <SpiritAvatar />}
      
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-5 py-3 rounded-2xl ${
            isUser
              ? 'bg-forest-green text-white rounded-tr-sm'
              : 'glass-card text-white rounded-tl-sm'
          }`}
        >
          <p className="text-sm font-light leading-relaxed">{message.text}</p>
        </div>
        <span className="text-xs text-forest-light mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isUser && (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-blue to-forest-light flex items-center justify-center text-2xl">
          👤
        </div>
      )}
    </motion.div>
  );
};

const QuickActions = ({ onSelect }) => {
  const actions = [
    { id: 1, text: "How's my forest?", emoji: "🌲" },
    { id: 2, text: "Give me advice", emoji: "💡" },
    { id: 3, text: "What should I focus on?", emoji: "🎯" },
    { id: 4, text: "Tell me something inspiring", emoji: "✨" },
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          onClick={() => onSelect(action.text)}
          className="glass-card px-4 py-2 text-white text-sm font-light hover:bg-forest-green hover:bg-opacity-30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">{action.emoji}</span>
          {action.text}
        </motion.button>
      ))}
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am the Nature Spirit of Zyntra 🌿. I'm here to guide you on your journey to balance and harmony. How are you feeling today?",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { ecoScore, activities, forestHealth } = useStore();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(
        ecoScore,
        activities.slice(0, 5),
        forestHealth
      );
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleQuickAction = (text) => {
    handleSendMessage(text);
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-night-blue to-night-deep">
      <div className="h-full flex flex-col max-w-4xl mx-auto pt-28 md:pt-32 pb-4">
        {/* Header */}
        <motion.div
          className="p-6 border-b border-white border-opacity-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <SpiritAvatar />
            <div>
              <h1 className="text-2xl font-light text-white">Nature Spirit</h1>
              <p className="text-forest-light text-sm">Always here to guide you</p>
            </div>
          </div>
        </motion.div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence>
            {messages.map((message) => (
              <Message key={message.id} message={message} isUser={message.isUser} />
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="flex gap-3 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SpiritAvatar />
              <div className="glass-card px-5 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-forest-light rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-forest-light rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-forest-light rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-6 border-t border-white border-opacity-10">
          <QuickActions onSelect={handleQuickAction} />
          
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share your thoughts..."
              className="flex-1 px-5 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-forest-green transition-colors"
            />
            <motion.button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className={`px-6 py-3 rounded-full transition-all ${
                inputValue.trim()
                  ? 'bg-forest-green text-white hover:bg-forest-dark'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
              whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

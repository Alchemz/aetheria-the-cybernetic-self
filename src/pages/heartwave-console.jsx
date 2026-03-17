
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Check, Info, Target, Flame, Zap, X, ArrowLeft, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { auth } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SubscriptionGuard from '../components/SubscriptionGuard';

import { bioModsData } from '@/data/heartwaveData';
import { NotificationService } from '@/api/notificationService';

export default function HeartWaveConsole() {
  const waveCanvasRef = useRef(null);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [activeBioMods, setActiveBioMods] = useState([]);

  // Set background immediately on mount to prevent flash
  useEffect(() => {
    document.body.style.background = '#2C2C2C';
    return () => {
      document.body.style.background = '#000000';
    };
  }, []);

  useEffect(() => {
    loadUserData();
    initWaveAnimation();
  }, []);

  // Refresh data when navigating to this page
  useEffect(() => {
    loadUserData();
  }, [location]);

  const loadUserData = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);

      const userBioMods = currentUser.active_bio_mods || [];
      setActiveBioMods(userBioMods);

      const allHabits = generateHabitsFromBioMods(userBioMods);
      setHabits(allHabits);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };


  const generateHabitsFromBioMods = (bioModIds) => {
    const allHabits = [];
    let habitId = 1;

    bioModIds.forEach(bioModId => {
      if (bioModsData[bioModId]) {
        const bioMod = bioModsData[bioModId];
        bioMod.habits.forEach(habit => {
          allHabits.push({
            id: habitId++,
            ...habit,
            bioMod: bioMod.name,
            completed: false
          });
        });
      }
    });

    return allHabits;
  };

  const initWaveAnimation = () => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = '#00A86B';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00A86B';

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 +
          Math.sin((x + phase) * 0.02) * 20 +
          Math.sin((x + phase) * 0.03) * 10 +
          Math.sin((x + phase) * 0.01) * 25;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00FFFF';

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 +
          Math.sin((x + phase + 50) * 0.025) * 15;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      phase += 2;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 100;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const toggleHabit = async (habitId) => {
    const updatedHabits = habits.map(h =>
      h.id === habitId ? { ...h, completed: !h.completed } : h
    );
    setHabits(updatedHabits);
  };

  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.bioMod || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {});

  const handleNotification = async (e, habit) => {
    e.stopPropagation();
    const granted = await NotificationService.requestPermission();
    if (granted) {
      // Schedule for 5 seconds later as a demo/test
      NotificationService.scheduleNotification(
        `Time for ${habit.name}`,
        `Remember: ${habit.howTo || habit.why || "Time to build that habit!"}`,
        5000
      );
      // Visual feedback via simple alert for now
      alert(`Reminder set! Watch for a notification in 5 seconds.`);
    } else {
      alert('Please enable notifications to receive reminders.');
    }
  };

  return (
    <SubscriptionGuard requiredProduct="heartwave">
      <div className="heartwave-console-page" style={{ background: '#2C2C2C' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

          .heartwave-console-page {
            min-height: 100dvh;
            min-height: 100vh;
            background: #2C2C2C !important;
            color: white;
            font-family: 'Rajdhani', sans-serif;
            padding: 1rem 1rem 100px;
          }

          .console-header {
            margin-bottom: 2rem;
          }

          .console-header-top {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .console-back {
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.3s;
            text-decoration: none;
          }

          .console-back:hover {
            color: #00A86B;
          }

          .console-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            font-weight: 900;
            color: #00A86B;
            flex: 1;
            text-align: center;
            letter-spacing: 0.15em;
            text-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
          }

          .console-greeting { 
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1.5rem;
            margin-bottom: 2rem;
          }

          .greeting-text { 
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
          }

          .greeting-name { 
            color: #00A86B;
            font-weight: 600;
          }

          .stats-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .stat-card { 
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1.5rem;
            text-align: center;
          }

          .stat-value { 
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            color: #00A86B;
            font-weight: 900;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 15px rgba(0, 168, 107, 0.5);
          }

          .stat-label { 
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          .today-habits { 
            margin-bottom: 2rem;
          }

          .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: #00A86B;
            margin-bottom: 1.5rem;
            letter-spacing: 0.1em;
            text-shadow: 0 0 15px rgba(0, 168, 107, 0.4);
          }

          .habits-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .habit-card {
            background: rgba(0, 168, 107, 0.05);
            border: 2px solid rgba(0, 168, 107, 0.2);
            padding: 1.5rem;
            transition: all 0.3s ease;
            display: flex; /* Added for correct layout per new outline implicitly */
            align-items: start; /* Added for correct layout per new outline implicitly */
            gap: 1rem; /* Added for correct layout per new outline implicitly */
            margin-bottom: 1rem; /* Added for correct layout per new outline implicitly */
            cursor: pointer; /* Added for correct layout per new outline implicitly */
          }

          .habit-card:hover {
            border-color: #00A86B;
            box-shadow: 0 0 20px rgba(0, 168, 107, 0.3);
          }

          .habit-card.completed {
            background: rgba(0, 168, 107, 0.1);
            border-color: #00A86B;
          }

          .habit-notify-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: all 0.3s;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .habit-notify-btn:hover {
            color: #00A86B;
            transform: scale(1.1);
            background: rgba(0, 168, 107, 0.1);
            border-radius: 50%;
          }

          .habit-header { 
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
          }

          .habit-info {
            flex: 1;
          }

          .habit-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: #00A86B;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }

          .habit-meta {
            display: flex;
            gap: 1rem;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
          }

          .habit-why { 
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }

          .habit-checkbox-wrapper { 
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .habit-checkbox {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(0, 168, 107, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0; /* Added for correct layout per new outline implicitly */
          }

          .habit-card.completed .habit-checkbox {
            background: #00A86B;
            border-color: #00A86B;
            box-shadow: 0 0 15px rgba(0, 168, 107, 0.6);
          }

          .heartwave-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(to top, #0A0A0F, rgba(10, 10, 15, 0.95));
            backdrop-filter: blur(10px);
            padding: 1rem;
            display: flex;
            justify-content: space-around;
            border-top: 1px solid rgba(0, 168, 107, 0.3);
            z-index: 100;
          }

          .heartwave-nav-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.75rem;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
          }

          .heartwave-nav-btn.active {
            color: #00A86B;
            text-shadow: 0 0 10px rgba(0, 168, 107, 0.5);
          }

          .heartwave-nav-btn:hover {
            color: #00A86B;
          }

          /* Original custom styles not in new outline, kept to preserve look for unmapped elements */
          .hw-subtitle {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          .hw-wave-viz {
            width: 100%;
            height: 80px;
            margin-top: 0.5rem;
          }
          .hw-compact-guide {
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1rem;
            margin: 1rem 0; /* Updated from 1rem 1rem 0 to 1rem 0 */
            position: relative;
          }
          .hw-compact-guide-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .hw-compact-guide-icon {
            color: #00A86B;
          }
          .hw-compact-guide-title {
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            color: #00A86B;
            letter-spacing: 0.05em;
          }
          .hw-compact-guide-subtitle {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
            margin-left: 1.8rem;
          }
          .hw-compact-guide-content {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-left: 2px solid #00A86B;
            display: none;
          }
          .hw-compact-guide-content.visible {
            display: block;
          }
          .hw-guide-habit-name {
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            color: #00A86B;
            margin-bottom: 1rem;
            letter-spacing: 0.05em;
          }
          .hw-guide-section {
            margin-bottom: 1rem;
          }
          .hw-guide-label {
            font-size: 0.85rem;
            color: #3CB371;
            font-weight: 600;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .hw-guide-text {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            font-size: 0.9rem;
          }
          .hw-category-section {
            margin-bottom: 2.5rem;
          }
          .hw-category-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: #00A86B;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(0, 168, 107, 0.3);
            letter-spacing: 0.1em;
          }
          .hw-habit-howto {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.5;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.3);
            border-left: 2px solid rgba(0, 168, 107, 0.5);
            margin-top: 0.5rem;
          }
          .hw-empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: rgba(255, 255, 255, 0.5);
          }
          .hw-empty-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: #00A86B;
            margin-bottom: 1rem;
          }

          @media (max-width: 768px) {
            .console-title {
              font-size: 1.5rem;
            }

            /* .stats-grid { Not used in current JSX structure, but included for completeness from outline }
              grid-template-columns: 1fr;
            } */
            
            .hw-wave-viz {
              height: 60px;
            }
            .hw-compact-guide {
              margin: 1rem 0; /* Updated from 1rem 1rem 0 */
            }
            .habits-list { /* previously .hw-habits-panel */
              max-height: none;
              padding: 0; /* Updated as it was removed in outline */
            }
            .hw-category-section {
              margin-bottom: 2rem;
            }
            .habit-card { /* previously .hw-habit-item */
              padding: 1rem;
            }
          }
        `}</style>

        {/* HEADER */}
        <div className="console-header">
          <div className="console-header-top">
            <Link to="/portal" className="console-back" style={{ textDecoration: 'none' }}>
              <ArrowLeft size={24} />
            </Link>
            <h1 className="console-title">DAILY ROUTINE</h1>
            <div style={{ width: 24 }} />
          </div>
          <p className="hw-subtitle">
            Your personalized daily protocol
          </p>
          <canvas ref={waveCanvasRef} className="hw-wave-viz" />
        </div>

        {/* COMPACT AI GUIDE AT TOP */}
        <div className="hw-compact-guide">
          <div className="hw-compact-guide-header">
            <Info className="hw-compact-guide-icon" size={20} />
            <span className="hw-compact-guide-title">AI HABIT GUIDE</span>
          </div>
          <p className="hw-compact-guide-subtitle">
            (click any habit and this box will explain it better)
          </p>

          <div className={`hw-compact-guide-content ${selectedHabit ? 'visible' : ''}`}>
            {selectedHabit && (
              <>
                <div className="hw-guide-habit-name">{selectedHabit.name}</div>

                <div className="hw-guide-section">
                  <div className="hw-guide-label">Why This Works:</div>
                  <p className="hw-guide-text">{selectedHabit.why}</p>
                </div>

                <div className="hw-guide-section">
                  <div className="hw-guide-label">How To Do It:</div>
                  <p className="hw-guide-text">{selectedHabit.howTo}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="hw-empty-state">
            <h2 className="hw-empty-title">NO ACTIVE PROTOCOLS</h2>
            <p>Contact support to activate your personalized habit protocols.</p>
          </div>
        ) : (
          <div className="habits-list">
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
              <div key={category} className="hw-category-section">
                <h2 className="hw-category-title">{category}</h2>
                {categoryHabits.map(habit => (
                  <div
                    key={habit.id}
                    className={`habit-card ${habit.completed ? 'completed' : ''}`}
                    onClick={() => {
                      toggleHabit(habit.id);
                      setSelectedHabit(habit);
                    }}
                  >
                    <div className="habit-checkbox">
                      {habit.completed && <Check size={16} color="#000" />}
                    </div>
                    <div className="habit-info">
                      <div className="habit-name">{habit.name}</div>
                      <div className="habit-meta">
                        <span>{habit.duration} min</span>
                        <span>•</span>
                        <span>{habit.difficulty}</span>
                      </div>
                      {habit.howTo && (
                        <div className="hw-habit-howto">
                          <strong>How:</strong> {habit.howTo}
                        </div>
                      )}
                    </div>

                    <button
                      className="habit-notify-btn"
                      onClick={(e) => handleNotification(e, habit)}
                      title="Set Reminder (5s Demo)"
                    >
                      <Bell size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="heartwave-bottom-nav">
          <div className="heartwave-nav-btn active">
            <Target size={24} />
            <span>Routine</span>
          </div>
          <Link to="/heartwave-protocols" className="heartwave-nav-btn">
            <Flame size={24} />
            <span>Bio-Mods</span>
          </Link>
          <Link to="/heartwave-athena" className="heartwave-nav-btn">
            <Zap size={24} />
            <span>ATHENA</span>
          </Link>
        </div>
      </div>
    </SubscriptionGuard>
  );
}

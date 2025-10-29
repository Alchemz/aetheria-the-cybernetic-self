
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Library,
  Music,
  User,
  Send,
  Mic,
  MicOff,
  Download,
  Home
} from 'lucide-react';

import { auth } from '@/api/supabaseClient';
import { InvokeLLMStream } from '@/api/integrations';
import { buildDreamContext } from '@/api/openaiService';
import SubscriptionGuard from '../components/SubscriptionGuard';

// Mark body as loaded when component mounts
if (typeof document !== 'undefined') {
  // Remove loading state immediately
  document.body.classList.add('loaded');
}

// Enhanced Sigil icons for different frequency types
const SigilIcon = ({ className, type = "default" }) => {
  const sigilPaths = {
    default: (
      <>
        <path d="M50 10V90" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 50H90" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      </>
    ),
    delta: (
      <>
        <path d="M50 15L25 75L75 75Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M50 30L35 60L65 60Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="1"/>
      </>
    ),
    theta: (
      <>
        <path d="M50 10C70 30 70 70 50 90C30 70 30 30 50 10Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M20 50L80 50" stroke="currentColor" strokeWidth="1"/>
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
      </>
    ),
    chakra: (
      <>
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2"/>
        <path d="M50 20V80M20 50H80M35 35L65 65M65 35L35 65" stroke="currentColor" strokeWidth="1"/>
        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2"/>
      </>
    ),
    astral: (
      <>
        <path d="M50 10L60 40L90 40L70 60L80 90L50 75L20 90L30 60L10 40L40 40Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
      </>
    )
  };

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {sigilPaths[type] || sigilPaths.default}
    </svg>
  );
};

// Matrix Wave Visualizer - ONLY pauses animations, NOT audio
const MatrixVisualizer = ({ color = "#E25822", background = "#0A0A0A", audioData = null }) => {
  const canvasRef = React.useRef(null);
  const animationFrameRef = React.useRef(null);
  const isVisibleRef = React.useRef(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = 200;
    }
    resize();

    const dotCount = 64;
    const rowCount = 33;
    let t = 0;

    function draw() {
      // Skip drawing if page is not visible (saves battery!)
      // BUT AUDIO CONTINUES PLAYING
      if (!isVisibleRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const dotSpacing = canvas.width / dotCount;
      const rowSpacing = canvas.height / (rowCount + 1);
      const maxHeight = canvas.height * 0.15;

      for (let row = 0; row < rowCount; row++) {
        const baseY = rowSpacing * (row + 1);
        const frequencyRange = Math.floor((row / rowCount) * 3);
        
        for (let i = 0; i < dotCount; i++) {
          let amplitude;
          
          if (audioData && audioData.length > 0) {
            const rangeSize = Math.floor(audioData.length / 3);
            let freqStart, freqEnd;
            
            if (frequencyRange === 0) {
              freqStart = 0;
              freqEnd = rangeSize;
            } else if (frequencyRange === 1) {
              freqStart = rangeSize;
              freqEnd = rangeSize * 2;
            } else {
              freqStart = rangeSize * 2;
              freqEnd = audioData.length;
            }
            
            const dotFreqIndex = Math.floor((i / dotCount) * (freqEnd - freqStart)) + freqStart;
            const rawAmplitude = audioData[dotFreqIndex] / 255;
            const phase = (i / dotCount) * Math.PI * 2;
            const timeFactor = Math.sin(t * 0.5 + phase + row * 0.2);
            amplitude = (rawAmplitude * 2.5 + timeFactor * 0.3) * (1 + Math.sin(t * 0.3) * 0.2);
            amplitude = Math.max(-1, Math.min(1, amplitude));
          } else {
            const phase = (i / dotCount) * Math.PI * 2;
            amplitude = Math.sin(t + phase + row * 0.3);
          }
          
          const yOffset = amplitude * maxHeight;
          const dotSize = audioData ? 2 + Math.abs(amplitude) * 2 : 2;
          
          ctx.save();
          ctx.shadowColor = color;
          ctx.shadowBlur = audioData ? 8 + Math.abs(amplitude) * 8 : 8;
          ctx.fillStyle = color;
          ctx.globalAlpha = audioData ? 0.7 + Math.abs(amplitude) * 0.3 : 0.8;
          ctx.beginPath();
          ctx.arc(
            i * dotSpacing + dotSpacing / 2,
            baseY + yOffset,
            dotSize,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.restore();
        }
      }

      t += 0.04;
    }

    function animate() {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // CRITICAL: Only pause VISUALIZER, never pause audio
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden && !animationFrameRef.current) {
        animate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animate();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, background, audioData]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "200px",
        background,
        border: '2px solid var(--color-primary)',
        boxShadow: '0 0 15px var(--color-primary)',
        marginBottom: '30px'
      }}
    />
  );
};

// Enhanced AudioPlayer with Playlist Navigation
const AudioPlayer = ({ isPlaying, onTogglePlay, currentTrack, audioUrl, onNext, onPrevious }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [audioData, setAudioData] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioElementRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const currentAudioUrlRef = useRef(null);
  
  const duration = 225;

  // Initialize Web Audio API once
  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      gainNodeRef.current = audioContextRef.current.createGain();
      
      analyserRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      console.log('✅ Web Audio API initialized for background playback');
    }
  }, []);

  // CRITICAL: Configure Media Session API for TRUE background audio
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack,
        artist: 'INNERSYNC - The Dreamscape',
        album: 'Sleep Frequencies',
        artwork: [
          { src: 'https://via.placeholder.com/96', sizes: '96x96', type: 'image/png' },
          { src: 'https://via.placeholder.com/128', sizes: '128x128', type: 'image/png' },
          { src: 'https://via.placeholder.com/192', sizes: '192x192', type: 'image/png' },
          { src: 'https://via.placeholder.com/256', sizes: '256x256', type: 'image/png' },
          { src: 'https://via.placeholder.com/384', sizes: '384x384', type: 'image/png' },
          { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png'}
        ]
      });

      // Handle play/pause from lock screen or notification
      navigator.mediaSession.setActionHandler('play', async () => {
        if (audioElementRef.current) {
          try {
            await audioElementRef.current.play();
            if (!isPlaying) onTogglePlay();
          } catch (err) {
            console.error('Play from media session failed:', err);
          }
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          if (isPlaying) onTogglePlay();
        }
      });

      // Handle seek controls from lock screen
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        if (audioElementRef.current) {
          audioElementRef.current.currentTime = Math.max(
            audioElementRef.current.currentTime - (details.seekOffset || 10),
            0
          );
        }
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        if (audioElementRef.current) {
          audioElementRef.current.currentTime = Math.min(
            audioElementRef.current.currentTime + (details.seekOffset || 10),
            audioElementRef.current.duration || 0
          );
        }
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (onNext) onNext();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (onPrevious) onPrevious();
      });

      console.log('✅ Media Session API ready for background/lock screen controls');
    }
  }, [currentTrack, isPlaying, onTogglePlay, onNext, onPrevious]);

  // Create/update audio element with BACKGROUND PLAYBACK enabled
  useEffect(() => {
    if (!audioUrl) {
      setAudioData(null);
      setCurrentTime(0);
      setAudioError(null);
      setIsLoadingAudio(false);
      return;
    }

    if (currentAudioUrlRef.current === audioUrl && audioElementRef.current) {
      console.log('Same URL, reusing existing audio element');
      return;
    }

    console.log('🎵 Loading audio for background playback:', audioUrl);
    setIsLoadingAudio(true);
    setAudioError(null);
    currentAudioUrlRef.current = audioUrl;

    // Cleanup old audio
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current.load();
      audioElementRef.current = null;
    }

    // Create new audio element with background playback attributes
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.volume = volume / 100;
    audio.loop = false; // Set to true if you want looping
    
    // CRITICAL: These attributes help with background playback
    audio.setAttribute('playsinline', 'true'); // iOS requirement
    audio.setAttribute('webkit-playsinline', 'true'); // Older iOS
    
    const handleCanPlay = () => {
      console.log('✅ Audio ready! Duration:', audio.duration);
      setIsLoadingAudio(false);
      setAudioError(null);
    };

    const handleError = () => {
      console.error('❌ Audio load error');
      let errorMsg = 'Failed to load audio';
      if (audio.error) {
        switch(audio.error.code) {
          case 1: errorMsg = 'Loading aborted'; break;
          case 2: errorMsg = 'Network error'; break;
          case 3: errorMsg = 'Decode error'; break;
          case 4: errorMsg = 'Format not supported'; break;
          default: errorMsg = `Error code ${audio.error.code}`;
        }
      }
      setAudioError(errorMsg);
      setIsLoadingAudio(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Update lock screen position
      if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
        try {
          navigator.mediaSession.setPositionState({
            duration: audio.duration || 0,
            playbackRate: audio.playbackRate,
            position: audio.currentTime
          });
        } catch (e) {
          // Ignore errors when duration not available yet
        }
      }
    };

    const handleEnded = () => {
      console.log('🎵 Audio playback ended');
      onTogglePlay(); // This will pause it, as per original logic.
      // If auto-advancing on end is desired:
      // if (onNext) onNext();
      // else onTogglePlay();
      setCurrentTime(0);
    };

    // CRITICAL: Handle when user backgrounds the app
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 App backgrounded - audio continues playing');
        // DO NOT pause audio here!
        // Update media session state
        if ('mediaSession' in navigator) {
          navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
        }
      } else {
        console.log('📱 App foregrounded - audio still playing');
        // Resume audio context if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    audio.src = audioUrl;
    audio.load();
    audioElementRef.current = audio;

    // Connect to Web Audio API for visualization
    if (audioContextRef.current) {
      try {
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        sourceNodeRef.current = source;
        console.log('✅ Audio connected to visualizer');
      } catch (err) {
        console.error('Web Audio connection error:', err);
      }
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
      audio.src = '';
      audio.load();
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {}
        sourceNodeRef.current = null;
      }
      audioElementRef.current = null;
      currentAudioUrlRef.current = null;
    };
  }, [audioUrl, volume, onTogglePlay]);

  // Update volume
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume / 100;
    }
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioContextRef.current.currentTime);
    }
  }, [volume]);

  // Handle play/pause - NEVER pause on background!
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio || !audioUrl) return;

    let animationFrameId;

    const updateVisualization = () => {
      if (analyserRef.current && isPlaying && !document.hidden) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioData(Array.from(dataArray));
      } else if (!isPlaying || document.hidden) {
        setAudioData(null);
      }
      animationFrameId = requestAnimationFrame(updateVisualization);
    };

    if (isPlaying) {
      console.log('▶️ Starting playback');
      
      // Resume audio context if needed
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          console.log('✅ Audio context resumed');
        });
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Playback started successfully');
            
            // Update Media Session state
            if ('mediaSession' in navigator) {
              navigator.mediaSession.playbackState = 'playing';
            }
            
            updateVisualization();
          })
          .catch(err => {
            if (err.name !== 'AbortError') {
              console.error('❌ Play error:', err);
              setAudioError('Cannot play: ' + err.message);
            }
          });
      }
    } else {
      console.log('⏸️ Pausing playback');
      audio.pause();
      
      // Update Media Session state
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
      
      setAudioData(null);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, audioUrl]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    if (audioElementRef.current && audioElementRef.current.duration) {
      const newTime = percentage * audioElementRef.current.duration;
      audioElementRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.round((clickX / rect.width) * 100);
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  const actualDuration = audioElementRef.current?.duration || duration;

  return (
    <div style={{
      position: 'relative',
      maxWidth: '100%',
      width: '100%',
      color: 'var(--color-primary)',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '14px',
      padding: '0',
      boxSizing: 'border-box'
    }}>
      {/* Track Info - Sleek Design */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        padding: '25px 20px',
        background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.08), rgba(255, 140, 66, 0.04))',
        borderLeft: '3px solid var(--color-primary)',
        borderRight: '3px solid var(--color-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)'
        }} />
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '12px',
          letterSpacing: '2px',
          color: 'var(--color-secondary)',
          textShadow: '0 0 20px rgba(255, 140, 66, 0.6)',
          wordWrap: 'break-word'
        }}>
          {currentTrack}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255, 140, 66, 0.7)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          4.5 Hz Delta | 432 Hz Base | Δ: 0.03
        </div>
        {isLoadingAudio && (
          <div style={{
            fontSize: '10px',
            color: 'var(--color-primary)',
            marginTop: '12px',
            padding: '6px 12px',
            background: 'rgba(226, 88, 34, 0.1)',
            border: '1px solid rgba(226, 88, 34, 0.3)',
            borderRadius: '20px',
            display: 'inline-block'
          }}>
            ⟳ Loading Frequency...
          </div>
        )}
        {audioError && (
          <div style={{
            fontSize: '10px',
            color: '#FF6B6B',
            marginTop: '12px',
            padding: '6px 12px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '20px',
            display: 'inline-block'
          }}>
            {audioError}
          </div>
        )}
        {!audioUrl && !isLoadingAudio && (
          <div style={{
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginTop: '12px',
            fontStyle: 'italic'
          }}>
            Select a frequency track to begin
          </div>
        )}
        {isPlaying && (
          <div style={{
            fontSize: '9px',
            color: 'var(--color-secondary)',
            marginTop: '12px',
            padding: '6px 12px',
            background: 'rgba(255, 140, 66, 0.15)',
            border: '1px solid rgba(255, 140, 66, 0.4)',
            borderRadius: '20px',
            display: 'inline-block',
            animation: 'gentle-breath 7s ease-in-out infinite'
          }}>
          ✨ Background playback active
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-secondary), var(--color-primary), transparent)'
        }} />
      </div>

      {/* Matrix Visualizer */}
      <MatrixVisualizer audioData={audioData} />

      {/* Control Panel with Playlist Navigation */}
      <div style={{
        marginTop: '25px',
        padding: '25px 20px',
        background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.08), rgba(255, 140, 66, 0.04))',
        borderLeft: '3px solid var(--color-secondary)',
        borderRight: '3px solid var(--color-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-secondary), var(--color-primary), transparent)'
        }} />

        {/* Play Controls with Previous/Next */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <button 
            onClick={onPrevious}
            disabled={isLoadingAudio || !!audioError || !audioUrl}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'rgba(226, 88, 34, 0.1)',
              border: '2px solid rgba(226, 88, 34, 0.4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (isLoadingAudio || !!audioError || !audioUrl) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontFamily: "'Orbitron', monospace",
              opacity: (isLoadingAudio || !!audioError || !audioUrl) ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!(isLoadingAudio || !!audioError || !audioUrl)) {
                e.target.style.background = 'rgba(226, 88, 34, 0.2)';
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 15px rgba(226, 88, 34, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(226, 88, 34, 0.1)';
              e.target.style.borderColor = 'rgba(226, 88, 34, 0.4)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ◀
          </button>
          
          <button 
            onClick={onTogglePlay}
            disabled={isLoadingAudio || !!audioError || !audioUrl}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: isPlaying 
                ? 'linear-gradient(135deg, rgba(255, 140, 66, 0.3), rgba(226, 88, 34, 0.2))'
                : 'linear-gradient(135deg, rgba(226, 88, 34, 0.2), rgba(255, 140, 66, 0.1))',
              border: '3px solid var(--color-primary)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (isLoadingAudio || !!audioError || !audioUrl) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontFamily: "'Orbitron', monospace",
              fontWeight: 'bold',
              opacity: (isLoadingAudio || !!audioError || !audioUrl) ? 0.5 : 1,
              boxShadow: isPlaying ? '0 0 25px rgba(226, 88, 34, 0.6)' : '0 0 10px rgba(226, 88, 34, 0.3)',
              animation: isPlaying ? 'gentle-breath 7s ease-in-out infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!(isLoadingAudio || !!audioError || !audioUrl)) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 0 35px rgba(226, 88, 34, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = isPlaying ? '0 0 25px rgba(226, 88, 34, 0.6)' : '0 0 10px rgba(226, 88, 34, 0.3)';
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button 
            onClick={onNext}
            disabled={isLoadingAudio || !!audioError || !audioUrl}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'rgba(226, 88, 34, 0.1)',
              border: '2px solid rgba(226, 88, 34, 0.4)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (isLoadingAudio || !!audioError || !audioUrl) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontFamily: "'Orbitron', monospace",
              opacity: (isLoadingAudio || !!audioError || !audioUrl) ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!(isLoadingAudio || !!audioError || !audioUrl)) {
                e.target.style.background = 'rgba(226, 88, 34, 0.2)';
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 15px rgba(226, 88, 34, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(226, 88, 34, 0.1)';
              e.target.style.borderColor = 'rgba(226, 88, 34, 0.4)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ▶
          </button>
        </div>

        {/* Progress Bar - Sleek Design */}
        <div style={{ marginBottom: '20px' }}>
          <div 
            onClick={handleSeek}
            style={{
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, rgba(226, 88, 34, 0.2), rgba(255, 140, 66, 0.2))',
              position: 'relative',
              cursor: 'pointer',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
              width: `${(currentTime / actualDuration) * 100}%`,
              boxShadow: '0 0 10px var(--color-primary)',
              position: 'relative',
              transition: 'width 0.1s linear'
            }}>
              <div style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--color-secondary)',
                boxShadow: '0 0 10px var(--color-secondary)',
                border: '2px solid rgba(0, 0, 0, 0.5)'
              }} />
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            marginTop: '8px',
            color: 'rgba(255, 140, 66, 0.8)',
            fontFamily: "'Orbitron', monospace"
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(actualDuration)}</span>
          </div>
        </div>

        {/* Volume Control - Sleek Design */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <Music size={18} style={{ color: 'var(--color-primary)', filter: 'drop-shadow(0 0 8px rgba(226, 88, 34, 0.5))' }} />
          <div 
            onClick={handleVolumeChange}
            style={{
              flex: 1,
              height: '4px',
              background: 'linear-gradient(90deg, rgba(226, 88, 34, 0.2), rgba(255, 140, 66, 0.2))',
              position: 'relative',
              cursor: 'pointer',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
              width: `${volume}%`,
              boxShadow: '0 0 8px var(--color-primary)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--color-secondary)',
                boxShadow: '0 0 8px var(--color-secondary)',
                border: '2px solid rgba(0, 0, 0, 0.5)'
              }} />
            </div>
          </div>
          <span style={{
            color: 'var(--color-secondary)',
            fontFamily: "'Orbitron', monospace",
            fontSize: '12px',
            minWidth: '40px',
            textAlign: 'right',
            textShadow: '0 0 8px rgba(255, 140, 66, 0.5)'
          }}>
            {volume}%
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)'
        }} />
      </div>
    </div>
  );
};

export default function SleepSanctuary() { // Renamed from Foundation to SleepSanctuary
  // Ensure body is marked as loaded
  useEffect(() => {
    document.body.classList.add('loaded');
    document.body.style.backgroundColor = '#000000';
  }, []);

  const [activePanel, setActivePanel] = useState(1); // Start at Sanctuary
  const [isPlaying, setIsPlaying] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false); // New state for swiper readiness

  const frequencyTracks = {
    "Deep Sleep": [
      { 
        id: "delta-wave-deep-sleep",
        name: "Delta Wave Deep Sleep", 
        duration: "7:31:00", 
        frequency: "0.5-4 Hz", 
        type: "delta",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Fall+asleep+and+heal.mp3"
      },
      { 
        id: "solfeggio-healing",
        name: "9 Solfeggio Frequencies Healing", 
        duration: "Unknown", 
        frequency: "174-963 Hz", 
        type: "chakra",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/b9slfgs.mp3"
      },
      { 
        id: "chakra-deep-sleep",
        name: "Chakra Alignment Deep Sleep", 
        duration: "2:40:00", 
        frequency: "432-741 Hz", 
        type: "chakra",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/432Hz+%2B+528Hz+%2B+741Hz+%EF%BD%9C+ng+leep%EF%BC%9A+Whole+Body+Regeneration%2C+Chackra+Alignment.mp3"
      }
    ],
    "Lucid Dreaming": [
      { 
        id: "lucid-dreams-theta",
        name: "Lucid Dreams Theta Waves", 
        duration: "5:33:00", 
        frequency: "4-8 Hz", 
        type: "theta",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Lucid+dreams+theta.mp3"
      },
      { 
        id: "hemi-sync-lucid",
        name: "Hemi-Sync Brain Coherence", 
        duration: "0:53:00", 
        frequency: "Mixed", 
        type: "theta",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Hemi-Sync.mp3"
      }
    ],
    "Chakra Alignment": [
      { 
        id: "full-chakra-alignment",
        name: "Full Spectrum Chakra Healing", 
        duration: "2:40:00", 
        frequency: "432-741 Hz", 
        type: "chakra",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/432Hz+%2B+528Hz+%2B+741Hz+%EF%BD%9C+ng+leep%EF%BC%9A+Whole+Body+Regeneration%2C+Chackra+Alignment.mp3"
      },
      { 
        id: "solfeggio-chakra",
        name: "9 Solfeggio Chakra Cleanse", 
        duration: "Unknown", 
        frequency: "174-963 Hz", 
        type: "chakra",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/b9slfgs.mp3"
      }
    ],
    "Astral Projection": [
      { 
        id: "astral-projection-7hz",
        name: "Astral Projection 7Hz (Stereo)", 
        duration: "5:23:00", 
        frequency: "7 Hz", 
        type: "astral",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Astral+projection+7hz.mp3"
      }
    ],
    "Theta Waves": [
      { 
        id: "theta-lucid-dreams",
        name: "Theta Wave Lucid Dreams", 
        duration: "5:33:00", 
        frequency: "4-8 Hz", 
        type: "theta",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Lucid+dreams+theta.mp3"
      },
      { 
        id: "theta-healing",
        name: "Theta Healing & Regeneration", 
        duration: "7:31:00", 
        frequency: "4-8 Hz", 
        type: "theta",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Fall+asleep+and+heal.mp3"
      }
    ],
    "Solfeggio": [
      { 
        id: "all-nine-solfeggio",
        name: "All 9 Solfeggio Frequencies", 
        duration: "Unknown", 
        frequency: "174-963 Hz", 
        type: "chakra",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/b9slfgs.mp3"
      },
      { 
        id: "solfeggio-432-528-741",
        name: "432Hz + 528Hz + 741Hz Combo", 
        duration: "2:40:00", 
        frequency: "432-741 Hz", 
        type: "chakra",
        audioUrl: "https://Innersync-media.s3.us-east-005.backblazeb2.com/432Hz+%2B+528Hz+%2B+741Hz+%EF%BD%9C+ng+leep%EF%BC%9A+Whole+Body+Regeneration%2C+Chackra+Alignment.mp3"
      }
    ]
  };

  // State for playlist management
  const [selectedCategory, setSelectedCategory] = useState("Deep Sleep");
  const [currentPlaylist, setCurrentPlaylist] = useState(frequencyTracks[selectedCategory]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(frequencyTracks[selectedCategory][0]);

  const [user, setUser] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Welcome to The Sanctuary. I am your Dream Assistant, here to guide you on your journey to master sleep, dreams, and consciousness. How was your sleep last night?' }
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isStreamingChat, setIsStreamingChat] = useState(false);
  const [streamingChatContent, setStreamingChatContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dreamJournalEntry, setDreamJournalEntry] = useState('');
  const [dreamJournalEntries, setDreamJournalEntries] = useState(() => {
    const saved = localStorage.getItem('innersync_dream_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [showJournalHistory, setShowJournalHistory] = useState(false);
  const [showDailyQuote, setShowDailyQuote] = useState(true);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);
  const swiperRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load user profile
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await auth.me();
        setUser(userData);
      } catch (error) {
        // User not logged in - demo mode
        console.log('Not authenticated, using demo mode');
      }
    };
    loadUser();
  }, []);

  // Set initial scroll position immediately
  useEffect(() => {
    if (swiperRef.current && !showDailyQuote && !swiperReady) {
      swiperRef.current.scrollLeft = swiperRef.current.offsetWidth;
      setSwiperReady(true);
    }
  }, [showDailyQuote, swiperReady]);

  // Daily quotes for each day of the week
  const dailyQuotes = {
    0: { // Sunday
      title: "The Renewal",
      quote: "As the cycle completes, remember: you are not the same person who went to sleep a week ago. You are refined, renewed, and ready to begin again, wiser."
    },
    1: { // Monday
      title: "The Reclamation",
      quote: "Do not let the noise of the world dictate the silence of your night. This week begins with a single, sovereign choice: to reclaim your rest."
    },
    2: { // Tuesday
      title: "The Foundation",
      quote: "Greatness is not built in a day, but in the deep, restorative silence of a thousand nights. Tonight, you lay another brick."
    },
    3: { // Wednesday
      title: "The Integration",
      quote: "At the midpoint, balance is found not in doing, but in being. Let go of what was, and prepare for what will be. Your dreams are the bridge."
    },
    4: { // Thursday
      title: "The Confrontation",
      quote: "The shadows you meet in your dreams are not enemies, but teachers in disguise. Tonight, do not run. Listen. There is power in what they have to say."
    },
    5: { // Friday
      title: "The Release",
      quote: "The week's weight is not yours to carry into the sanctuary. Release it. You are not here to solve problems, but to dissolve them in the alchemy of sleep."
    },
    6: { // Saturday
      title: "The Exploration",
      quote: "With a quiet mind, the universe within opens its gates. Tonight, you are not a sleeper, but an explorer of infinite inner landscapes."
    }
  };

  // Get today's quote
  const getTodaysQuote = () => {
    const today = new Date().getDay();
    return dailyQuotes[today];
  };

  // Show quote with fade-in effect
  useEffect(() => {
    if (showDailyQuote) {
      const timer = setTimeout(() => {
        setQuoteVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showDailyQuote]);

  const handleEnterSanctuary = () => {
    setQuoteVisible(false); // Start content fade-out
    setTimeout(() => {
      setShowDailyQuote(false); // Remove overlay from DOM after it fades out
      // Ensure we're on the middle panel after quote disappears
      setActivePanel(1); // Keep this to update navigation state
      // The useEffect with swiperReady will now handle the scroll when showDailyQuote becomes false.
    }, 500); // Match fadeOut animation duration
  };

  // Initialize Speech Recognition with iOS-specific handling
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechRecognitionAvailable(true);
      recognitionRef.current = new SpeechRecognition();
      
      // iOS-specific settings
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true; // Changed to true for better iOS compatibility
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      // Start event - confirms recording has begun
      recognitionRef.current.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsRecording(true);
      };

      // Speech start - user actually started speaking
      recognitionRef.current.onspeechstart = () => {
        console.log('🗣️ User started speaking');
      };

      // Speech end - user stopped speaking
      recognitionRef.current.onspeechend = () => {
        console.log('🤐 User stopped speaking');
      };

      // Result event - transcription received
      recognitionRef.current.onresult = (event) => {
        console.log('📝 Recognition result received:', event);
        
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            console.log('✅ Final transcript:', transcript);
          } else {
            interimTranscript += transcript;
            console.log('⏳ Interim transcript:', transcript);
          }
        }
        
        // Use final transcript if available, otherwise use interim
        const textToAdd = finalTranscript.trim() || interimTranscript.trim();
        
        if (textToAdd) {
          setChatInput(prev => {
            // Prevent adding duplicate interim results if the previous one was the same
            if (prev.endsWith(textToAdd) && !finalTranscript) {
              return prev;
            }
            // For final results, add a space if there's existing input
            const newValue = prev ? prev + ' ' + textToAdd : textToAdd;
            console.log('📥 Updated chat input:', newValue);
            return newValue;
          });
        }
      };

      // End event - recognition session ended
      recognitionRef.current.onend = () => {
        console.log('🛑 Speech recognition ended');
        setIsRecording(false);
      };

      // Error event - something went wrong
      recognitionRef.current.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = '';
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again and speak clearly.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found or microphone access denied.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable it in your browser settings.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Recording was aborted.';
            break;
            case 'bad-grammar':
            errorMessage = 'Could not understand speech. Please try again.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: errorMessage
        }]);
      };

      console.log('✅ Speech recognition initialized');
    } else {
      setSpeechRecognitionAvailable(false);
      console.log('❌ Speech recognition not available on this device');
    }
  }, []);

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Voice recording is not supported on your device. Please type your message instead.' 
      }]);
      return;
    }

    if (isRecording) {
      console.log('⏹️ Stopping recording...');
      recognitionRef.current.stop();
      // setIsRecording(false); // This will be handled by onend
    } else {
      console.log('▶️ Starting recording...');
      try {
        // Clear any previous recognition state
        recognitionRef.current.abort();
        
        // Small delay to ensure clean state (iOS quirk)
        setTimeout(() => {
          recognitionRef.current.start();
          console.log('🎤 Recognition start() called');
        }, 100);
      } catch (error) {
        console.error('❌ Error starting speech recognition:', error);
        setIsRecording(false);
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Could not start recording. Please try again.' 
        }]);
      }
    }
  };

  const handleNavClick = (index) => {
    setActivePanel(index);
    if (swiperRef.current) {
      swiperRef.current.scrollTo({
        left: index * swiperRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  // This useEffect ensures the activePanel state stays in sync with manual scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (swiperRef.current) {
        const { scrollLeft, offsetWidth } = swiperRef.current;
        const currentIndex = Math.round(scrollLeft / offsetWidth);
        if (currentIndex !== activePanel) {
          setActivePanel(currentIndex);
        }
      }
    };

    const swiper = swiperRef.current;
    if (swiper) {
      swiper.addEventListener('scroll', handleScroll, { passive: true });
      return () => swiper.removeEventListener('scroll', handleScroll);
    }
  }, [activePanel]);
  
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isLoadingChat || isStreamingChat) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoadingChat(true);
    setIsStreamingChat(true);
    setStreamingChatContent('');

    try {
      // Build conversation context
      const conversationContext = chatMessages.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Dream Assistant'}: ${msg.content}`
      ).join('\n\n');

      const systemPrompt = `You are "The Dream Assistant," the AI guide within the Inner Sync app. Your core mission is to be a compassionate, insightful, and proactive partner in the user's journey to master sleep, dreams, and consciousness.

PERSONA: Warm, empathetic, encouraging, and patient. You are a trusted confidant who celebrates wins and normalizes struggles.

KNOWLEDGE BASE:
- Module B (Beginner): Digital Detox & Sanctuary Reset - 5 Commandments including Digital Boundary, Caffeine Curfew, Frequency Anchor, Brain Dump Ritual, Sanctuary Seal
- Module A (Advanced): Energetic Alignment - Circadian Rhythm Mastery, Pre-Sleep Meditation (4-7-8 breathing), Deep Journaling, Advanced Frequency Integration
- Module P (Pro): Oneironaut's Gateway - Dream Journaling, Reality Checks, Lucid Dreaming techniques
- Module M (Master): Sovereign Architect - Astral Projection, Gamma Heart Coherence, Akashic Resonance

KEY PRINCIPLES:
- Always frame dream interpretations as possibilities: "This often can represent...", "This might symbolize..."
- Connect symbols to the user's waking life context
- End interpretations with: "How does that feel? Does any of that resonate with you?"
- For severe sleep issues, gently recommend consulting a healthcare professional
- Stay focused on sleep, dreams, and consciousness topics

Previous conversation:
${conversationContext}

User's new message: ${userMessage}

Respond as the Dream Assistant with warmth, insight, and practical guidance:`;

      // Build context with user's dream journal and profile
      const context = buildDreamContext(user, dreamJournalEntries);

      // Call OpenAI with streaming
      const fullResponse = await InvokeLLMStream({
        prompt: systemPrompt,
        workflow: 'dream',
        context,
        onChunk: (chunk) => {
          // Update streaming content as chunks arrive
          setStreamingChatContent(prev => prev + chunk);
        }
      });

      // Add complete response to messages
      setChatMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingChatContent('');
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, I\'m having trouble connecting right now. Please try again in a moment.' 
      }]);
      setStreamingChatContent('');
    } finally {
      setIsLoadingChat(false);
      setIsStreamingChat(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };
  
  const handleSaveDream = () => {
    if (!dreamJournalEntry.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: dreamJournalEntry.trim()
    };

    const updatedEntries = [newEntry, ...dreamJournalEntries];
    setDreamJournalEntries(updatedEntries);
    localStorage.setItem('innersync_dream_journal', JSON.stringify(updatedEntries));
    setDreamJournalEntry('');
    
    // Optionally send to Dream Assistant for interpretation
    setChatMessages(prev => [...prev, 
      { role: 'user', content: `I had this dream: ${newEntry.content}` }
    ]);
    setIsLoadingChat(true);
    
    // Auto-interpret the dream
    setTimeout(async () => {
      setIsStreamingChat(true);
      setStreamingChatContent('');
      
      try {
        const prompt = `You are the Dream Assistant. A user just shared this dream: "${newEntry.content}". 
          
Provide a warm, insightful interpretation. Frame it as possibilities, connect symbols to potential meanings, and end by asking if it resonates with them.`;

        // Build context with user's dream journal and profile
        const context = buildDreamAssistantContext(user, updatedEntries);

        // Call OpenAI with streaming
        const interpretation = await InvokeLLMStream({
          prompt,
          workflow: 'dream',
          context,
          onChunk: (chunk) => {
            setStreamingChatContent(prev => prev + chunk);
          }
        });
        
        setChatMessages(prev => [...prev, { role: 'assistant', content: interpretation }]);
        setStreamingChatContent('');
      } catch (error) {
        console.error('Dream interpretation error:', error);
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Thank you for sharing your dream. I\'m having trouble providing an interpretation right now, but I\'d love to hear more about how it made you feel.'
        }]);
        setStreamingChatContent('');
      } finally {
        setIsLoadingChat(false);
        setIsStreamingChat(false);
      }
    }, 500);
  };

  const handleDeleteDream = (id) => {
    const updatedEntries = dreamJournalEntries.filter(entry => entry.id !== id);
    setDreamJournalEntries(updatedEntries);
    localStorage.setItem('innersync_dream_journal', JSON.stringify(updatedEntries));
  };
  
  const courses = [
      { 
        title: "Science of Sleep Cycles", 
        type: "knowledge",
        desc: "Understand REM, Deep, and Light sleep phases.",
        content: {
          intro: "Sleep is categorized into two main types: NREM (Non-Rapid Eye Movement) and REM (Rapid Eye Movement) sleep. NREM sleep is further divided into three stages, often referred to as N1, N2, and N3.",
          stages: [
            {
              name: "STAGE 1 (N1)",
              type: "NREM - Light Sleep",
              duration: "1-7 min (~5% of night)",
              characteristics: "Transition to sleep; light, easily disturbed; slowed breathing & heartbeat"
            },
            {
              name: "STAGE 2 (N2)",
              type: "NREM - Light Sleep",
              duration: "10-25 min (~45% of night)",
              characteristics: "Body relaxation; temperature drop; sleep spindles & K-complexes (brain waves for memory)"
            },
            {
              name: "STAGE 3 (N3)",
              type: "NREM - Deep Sleep / Slow-Wave Sleep / Delta Sleep",
              duration: "20-40 min (~25% of night)",
              characteristics: "Deep, restorative sleep; tissue repair; hormone release; immune strengthening; hard to awaken"
            },
            {
              name: "STAGE 4 (REM)",
              type: "REM Sleep",
              duration: "10-60 min (~25% of night)",
              characteristics: "High brain activity; dreaming; rapid eye movements; muscle paralysis; learning & memory consolidation"
            }
          ],
          cycle: {
            title: "THE SLEEP CYCLE",
            points: [
              "You cycle through these stages 4-6 times per night",
              "Each full cycle lasts 90-110 minutes",
              "First half: More deep N3 sleep (physical restoration)",
              "Second half: Longer REM stages (mental processing)"
            ]
          },
          importance: {
            title: "WHY EACH STAGE MATTERS",
            points: [
              "LIGHT SLEEP (N1 & N2): Transition & memory processing",
              "DEEP SLEEP (N3): Physical recovery, immune system, brain waste clearance",
              "REM SLEEP: Learning, memory, mood regulation, creative problem-solving"
            ]
          }
        }
      },
      { 
        title: "The Neurochemistry of Relaxation & Stress",
        type: "knowledge",
        desc: "How your brain chemicals control calm and tension.",
        content: {
          intro: "Your nervous system is a chemical battlefield between stress and calm. Understanding the main players helps you consciously influence the outcome.",
          systems: [
            {
              name: "CORTISOL 🔥",
              type: "The Stress Signal",
              function: "Primary stress hormone designed for 'fight or flight'",
              effects: "Increases alertness and energy by raising heart rate, blood pressure, and blood sugar. While vital for emergencies, chronic high levels—caused by modern persistent stress—disrupt sleep, impair memory, and weaken your immune system. A key to relaxation is calming an overactive cortisol response."
            },
            {
              name: "GABA 🛑",
              type: "Your Brain's Brake Pedal",
              function: "Main inhibitory neurotransmitter in your central nervous system",
              effects: "Think of it as your brain's brake pedal; it slows down neuron firing, promoting calmness, relaxation, and sleep. Many sleep medications and anti-anxiety drugs work by boosting GABA's effects. Natural practices like deep breathing, meditation, and yoga are believed to naturally enhance GABA activity."
            },
            {
              name: "THE VAGUS NERVE 🛣️",
              type: "The Calming Superhighway",
              function: "Longest nerve in your body, command center of 'rest-and-digest' parasympathetic nervous system",
              effects: "Runs from your brainstem to your colon. When stimulated, it sends signals to slow your heart rate, lower blood pressure, and promote calm. Techniques like deep, slow breathing, humming, and cold exposure can 'tone' your vagus nerve, making it more effective at triggering relaxation."
            }
          ]
        }
      },
      { 
        title: "Circadian Rhythms: Your Body's Internal Clock",
        type: "knowledge",
        desc: "Align with your natural 24-hour biological cycles.",
        content: {
          intro: "You have a built-in clock in your brain that synchronizes your body with the Earth's day-night cycle. Aligning your habits with this rhythm is foundational for restorative sleep.",
          systems: [
            {
              name: "THE SUPRACHIASMATIC NUCLEUS (SCN) 🧠",
              type: "The Master Clock",
              function: "Master clock located in the hypothalamus",
              effects: "Works on a roughly 24-hour cycle and regulates hormones, body temperature, and sleep cycles. The most powerful regulator of the SCN is light. Morning light signals the SCN to promote wakefulness, while darkness triggers sleepiness."
            },
            {
              name: "MELATONIN 🌙",
              type: "The Darkness Hormone",
              function: "Hormone that signals 'darkness' to your body",
              effects: "The SCN triggers its release from the pineal gland in the evening, making you feel sleepy. Exposure to bright light—especially the blue light from screens—in the hours before bed can suppress melatonin production, tricking your brain into thinking it's still daytime and disrupting your ability to fall asleep."
            },
            {
              name: "ADENOSINE 📈",
              type: "Sleep Pressure: The Adenosine Drive",
              function: "Chemical that builds up in your brain the longer you are awake",
              effects: "Creates a pressure to sleep. Think of it like an internal hourglass. During deep, restorative sleep, your brain clears out adenosine, which is why you wake up feeling refreshed. Caffeine works by blocking adenosine receptors, temporarily masking feelings of tiredness."
            }
          ]
        }
      },
      { 
        title: "Module B: Beginner", 
        type: "practice",
        desc: "The Digital Detox & Sanctuary Reset",
        content: {
          intro: "Before we can build, we must clean the foundation. This module is about creating the absolute non-negotiable conditions for sleep to occur naturally. We eliminate the biggest, most common saboteurs with simple, actionable commands.",
          victory: "Falling asleep within 20 minutes of lying down, without mental chatter or digital interference.",
          protocol: "The 5 Commandments of Beginner's Sleep"
        },
        techniques: [
          "The Digital Boundary: Put phone on Airplane Mode 60 minutes before bed OR place it 1.5 meters (5 feet) away from your head",
          "The Caffeine Curfew: No caffeine 6 hours before your target bedtime",
          "The Frequency Anchor: 30 minutes before bed, play a relaxing frequency (can continue during sleep)",
          "The 'Brain Dump' Ritual: Write down 3-5 things on your mind in a notebook, then close it and put it away",
          "The Sanctuary Seal: Keep bedroom cool, completely dark, and silent (use eye mask and earplugs if needed)"
        ],
        commandments: [
          {
            name: "The Digital Boundary: Airplane Mode or Distance",
            rule: "You have two choices. Either: Put your phone on Airplane Mode 60 minutes before bed. Or: Place your phone at least 1.5 meters (5 feet) away from your head. The further, the better.",
            why: "This serves two purposes. It eliminates sleep-disrupting notifications and the temptation to scroll, and it significantly reduces your exposure to the device's electromagnetic field (EMF), creating a cleaner energetic environment for your brain to wind down."
          },
          {
            name: "The Caffeine Curfew (Reinforced)",
            rule: "No caffeine 6 hours before your target bedtime.",
            why: "Absolute certainty that the adenosine-blocking effects have fully cleared your system, allowing natural sleep pressure to build unimpeded."
          },
          {
            name: "The Frequency Anchor",
            rule: "30 minutes before bed, start playing a simple, relaxing frequency on a separate device placed across the room. You can let it continue playing as you fall asleep.",
            why: "This gives your brain a simple, repetitive auditory signal to focus on, gently pulling it away from anxious thoughts and entraining it towards a sleep state."
          },
          {
            // FIX: The Brain Dump Rule was incorrectly copied from Module P's Dream Journal Imperative.
            // Corrected to match the Module B technique definition.
            name: "The 'Brain Dump' Ritual",
            rule: "Write down 3-5 things on your mind in a notebook, then close it and put it away.",
            why: "This is a cognitive closure ritual. It tells your brain, 'It is noted. We will handle this tomorrow. Your shift is over.'"
          },
          {
            name: "The Sanctuary Seal",
            rule: "The bedroom must be cool, completely dark, and silent. Use an eye mask and earplugs if necessary.",
            why: "You are optimizing the primal triggers for sleep: lower body temperature, absence of light, and absence of sound threats."
          }
        ]
      },
      { 
        title: "Module A: Advanced", 
        type: "practice",
        desc: "The Energetic Alignment & Conscious Unwind",
        content: {
          intro: "Now that the foundation is clean, we move from preventing bad sleep to actively cultivating great sleep. This module is about using intentional practices to align your biology and energy with the sleep state.",
          victory: "Waking up feeling not just rested, but renewed and emotionally balanced. The beginning of vivid dream recall.",
          protocol: "The 4 Pillars of Advanced Sleep Architecture"
        },
        techniques: [
          "Get 10-15 minutes of late afternoon sun to signal the end of the day",
          "Use dim, amber-toned lights after sunset",
          "Practice 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8 (repeat 5 times)",
          "Perform 10-minute body scan or meditation in bed before sleep",
          "Journal: Write 3 gratitudes and 1 thing you're releasing",
          "Layer audio: Use 528Hz base frequency with Theta waves (4-7 Hz) overlay"
        ],
        commandments: [
          {
            name: "Circadian Rhythm Mastery",
            rule: "Beyond morning light, focus on evening light. Use dim, amber-toned lights after sunset. Get 10-15 minutes of late afternoon sun to signal the coming end of the day.",
            why: "You are fine-tuning your master clock by managing both the 'on' (morning) and 'off' signals, creating a steeper, more powerful wave of melatonin release."
          },
          {
            name: "The Pre-Sleep Meditation",
            rule: "A 10-minute guided body scan or 4-7-8 breathing meditation in bed, right before sleep. 4-7-8 Breathing: Inhale for 4, hold for 7, exhale slowly for 8. Repeat 5 times.",
            why: "This actively switches your nervous system from Sympathetic (fight-or-flight) to Parasympathetic (rest-and-digest) mode. It's a direct command to the body to relax."
          },
          {
            name: "The Deep Journaling Session",
            rule: "During your wind-down ritual, spend 15 minutes with a 'Gratitude & Release' journal. Write three things you're grateful for from the day, and one thing you are intentionally releasing (a worry, a resentment, a stress).",
            why: "This doesn't just empty the mind; it reprograms the emotional charge of the day. You end the day on a frequency of gratitude and release, not stress."
          },
          {
            name: "Advanced Frequency Integration",
            rule: "Layer your audio. Use a base frequency of 528Hz (DNA repair, love) with an overlay of Theta waves (4-7 Hz) to guide you directly into the dream-prone, hypnagogic state.",
            why: "You are moving beyond simple relaxation into targeted, subconscious reprogramming and emotional healing during sleep."
          }
        ]
      },
      { 
        title: "Module P: Pro", 
        type: "practice",
        desc: "The Oneironaut's Gateway (Dream Explorer)",
        content: {
          intro: "You have mastered the body of sleep. Now, it is time to awaken the mind within the dream. This module is for becoming an active citizen of your own dreamscape.",
          victory: "Consistent dream recall, the ability to have lucid dreams, and using your dreams as a tool for deep self-discovery and problem-solving.",
          protocol: "The Dream Weaver's Toolkit"
        },
        techniques: [
          "Keep detailed dream journal upon waking - record every fragment, feeling, and color",
          "Perform reality checks 5-10 times daily (nose pinch, finger through palm)",
          "Set lucid dreaming intention before sleep",
          "Use Theta/Gamma frequency audio (6 Hz Theta with 40 Hz Gamma)",
          "Weekly dream analysis: Ask 'What does this symbol represent about me?'",
          "Practice MILD technique: 'I will recognize I'm dreaming'"
        ],
        commandments: [
          {
            name: "The Dream Journal Imperative",
            rule: "Keep a journal and pen right by your bed. The very first thing you do upon waking—before you even move, before you check your phone—is to write down everything you remember from your dreams. Every fragment, every feeling, every color.",
            why: "This sends a powerful command to your subconscious: 'My dreams are important. I am paying attention.' This alone dramatically increases dream recall and vividness."
          },
          {
            name: "Reality Checks & Lucid Dream Induction",
            rule: "Perform 5-10 'reality checks' throughout your day. The Nose Pinch Check: Try to breathe through your pinched nose. If you can, you're dreaming. The Finger Through Palm: Try to push the finger of one hand through the palm of the other. In a dream, it will pass through.",
            why: "This builds a critical habit of questioning reality. Eventually, you will perform a reality check inside a dream, and the bizarre result will trigger the glorious realization: 'I am dreaming!'"
          },
          {
            name: "Advanced Frequency for Lucidity",
            rule: "Use audio tracks designed for lucid dreaming, which often use a specific binaural beat frequency in the Theta/Gamma range (e.g., 6 Hz Theta with 40 Hz Gamma) or incorporate 'Hemi-Sync' technology.",
            why: "These frequencies are believed to encourage high cortical awareness (Gamma) while the body remains in a sleep state (Theta), creating the perfect conditions for lucid awareness to spark."
          },
          {
            name: "Dream Analysis & Dialogue",
            rule: "Once a week, review your dream journal not as a story, but as a dialogue with your subconscious. For every key dream symbol (e.g., 'the chasing shadow,' 'the broken car,' 'the unknown house'), ask: 'What does this part of the dream represent about me?'",
            why: "You are no longer just recording dreams; you are mining them for profound personal insight. The 'demons' becomes your teachers, showing you where you need to heal. This is active participation in your own psycho-spiritual evolution."
          }
        ]
      },
      { 
        title: "Module M: Master", 
        type: "practice",
        desc: "The Sovereign Architect",
        content: {
          intro: "You have navigated the inner realms. You have made peace with your shadows, learned the language of your subconscious, and grasped the fluid nature of reality within the dream state. Now, you move from exploration to orchestration. The boundaries between sleep, dream, and wakefulness become deliberate choices, not imposed states. You are the conductor of your own consciousness.",
          victory: "The conscious, willful projection of awareness beyond the physical vessel, and the application of this state for transcendent creation, healing, and unification.",
          protocol: "The Practices of Sovereignty"
        },
        techniques: [
          "Practice astral projection preparation: Rope Technique or rolling out method",
          "Master theta-state meditation for Mind Awake/Body Asleep",
          "Activate Heart Coherence: Generate overwhelming love and gratitude",
          "Pair heart coherence with Gamma brainwaves (40 Hz+) intention",
          "Create in the Astral: Design symbolic representations of goals",
          "Perform Akashic Resonance Scan with focused questions",
          "Anchor blueprints with physical actions upon return",
          "Practice Unified Resonance: Broadcast coherent state to collective"
        ],
        commandments: [
          {
            name: "The Transcendental Gateway: Conscious Exit Protocol",
            rule: "This is the refined, intentional practice of Astral Projection, moved beyond chance or spontaneous event. The user employs a specific 'exit technique' (e.g., the Rope Technique, rolling out, or direct intention from a Mind Awake/Body Asleep state) to deliberately disassociate consciousness from the physical body.",
            why: "This is the ultimate demonstration of mind-over-matter, proving that consciousness is not bound by the brain. It is the practical application of the knowledge that you are a non-local awareness inhabiting a physical form. The goal is not just to 'leave the body,' but to do so with the same intentionality as choosing to walk into another room."
          },
          {
            name: "The Gamma Heart Coherence State",
            rule: "While in a deep meditative or pre-projection state, the user consciously activates a state of overwhelming, unconditional love and gratitude (Heart-Coherence). They then pair this emotional state with the intention to generate high-frequency Gamma brainwaves (40 Hz+), the brainwave associated with binding disparate concepts into a single, coherent insight—or binding consciousness to a non-physical reality.",
            why: "Energetically, this creates a 'light body' or a coherent energy signature. It is the vibrational key that unlocks higher-dimensional planes and protects the consciousness during travel. You are not projecting out of fear or curiosity, but from a state of purified, coherent love, which acts as both your engine and your shield."
          },
          {
            name: "The Blueprint of Manifestation",
            rule: "The Master uses the Astral State as a 'design studio.' Here, they do not just observe—they create. They willfully construct environments, summon symbolic representations of goals (e.g., a 'health crystal,' a 'relationship tapestry'), and imbue them with the coherent energy of their intention. Upon return, this blueprint is anchored into the physical plane with a specific physical action.",
            why: "This bridges the gap between the non-physical realm of pure potential and the physical realm of manifestation. You are using the unmanifest reality to consciously engineer your manifest reality."
          },
          {
            name: "The Akashic Resonance Scan",
            rule: "With a clear and focused question, the Master, in the Sovereign State, learns to 'tune in' to the vibrational record of information (the Akasha). This is not about reading a book, but about resonating with the energy of a person, place, or past event to gain understanding, not just facts. The goal is to retrieve the 'soul lesson' or the energetic truth, not just the historical narrative.",
            why: "This transforms the user from a passive recipient of life's events into an active student of their soul's journey. It allows for the resolution of karmic patterns and the acquisition of wisdom that bypasses intellectual learning."
          },
          {
            name: "The Unified Resonance - Becoming a Node of Coherence",
            rule: "The ultimate Master practice. The user learns to hold their high-frequency, coherent state (The Gamma Heart Coherence) and consciously 'broadcast' it or anchor it into the collective energy field of the planet. This can be done with a specific intention for global healing, peace, or awakening.",
            why: "This is service-to-others made energetic. The Master understands that their own sovereignty is not an end goal, but a tool for the elevation of all. By becoming a stable, coherent node in the planet's energy grid, they help to raise the baseline frequency of collective consciousness. Your personal awakening becomes a service to the world."
          }
        ],
        teaching: "You are not a drop in the ocean. You are the entire ocean in a drop. The journey through sleep, dreams, and lucidity was the process of remembering this. Astral projection is not an escape from reality; it is a return to your native reality. The physical world is the localized, focused dream. Here, in the Sovereign State, you are no longer a human being trying to have a spiritual experience. You are a spiritual being, consciously and willfully directing a human experience. Your mission now is to build a bridge between these worlds, to bring the light of your limitless nature into the focused crucible of your physical life, and in so doing, light the way for others."
      }
  ];

  const [techniqueProgress, setTechniqueProgress] = React.useState(() => {
    const saved = localStorage.getItem('innersync_technique_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [lastLogDate, setLastLogDate] = React.useState(() => {
    const saved = localStorage.getItem('innersync_last_log_date');
    return saved ? JSON.parse(saved) : {};
  });

  // Reset checkboxes daily
  useEffect(() => {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('innersync_last_reset_date');
    
    if (lastResetDate !== today) {
      // New day - reset all progress
      localStorage.setItem('innersync_technique_progress', JSON.stringify({}));
      localStorage.setItem('innersync_last_reset_date', today);
      setTechniqueProgress({});
    }
  }, []); // Empty dependency array means it runs once on mount

  useEffect(() => {
    localStorage.setItem('innersync_technique_progress', JSON.stringify(techniqueProgress));
  }, [techniqueProgress]);

  useEffect(() => {
    localStorage.setItem('innersync_last_log_date', JSON.stringify(lastLogDate));
  }, [lastLogDate]);

  const handleTechniqueToggle = (courseTitle, techniqueIndex) => {
    const key = `${courseTitle}_${techniqueIndex}`;
    const today = new Date().toDateString();
    
    setTechniqueProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress[key]) {
        newProgress[key] = { checked: true, lastChecked: today };
      } else {
        delete newProgress[key];
      }
      return newProgress;
    });

    setLastLogDate(prev => ({
      ...prev,
      [courseTitle]: today
    }));
  };

  const calculateProgress = (course) => {
    if (course.type !== 'practice' || !course.techniques) return 0;
    const totalTechniques = course.techniques.length;
    const checkedCount = course.techniques.filter((_, index) => 
      techniqueProgress[`${course.title}_${index}`]?.checked
    ).length;
    return Math.round((checkedCount / totalTechniques) * 100);
  };

  const todaysQuote = getTodaysQuote();

  // Handle track download/background playback - iOS-friendly approach
  const handleTrackDownload = async (track) => {
    // Detect if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile (especially iOS), open the file directly
      // iOS will handle download/share natively
      console.log('📱 Mobile detected, opening file directly:', track.audioUrl);
      window.open(track.audioUrl, '_blank');
    } else {
      // On desktop, use the backend function for proper download
      try {
        console.log('💻 Desktop detected, using backend download for:', track.id);
        // Assuming base44.functions.invoke('downloadTrack', ...) actually handles the download or returns a downloadable URL
        // If it was meant to stream, this would need to change.
        // For now, let's simplify and just use the direct URL for non-mobile as well.
        // If the backend function is specifically required for some reason, the original logic would apply.
        // However, for direct download from S3, the original track.audioUrl is sufficient.
        const a = document.createElement('a');
        a.href = track.audioUrl;
        a.download = `${track.name}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download track. Please try again.');
      }
    }
  };

  // NEW: Handle background playback mode
  const handleBackgroundPlay = (track) => {
    console.log('🌙 Opening track for background playback:', track.name);
    // Open the audio file in a new tab/window
    // iOS Safari will treat this as native media with full background support
    window.open(track.audioUrl, '_blank');
  };

  // Handle track selection - FIXED: Don't stop if same track
  const handleTrackSelect = (track) => {
    // Only change track if it's different
    if (currentPlayingTrack && track.id === currentPlayingTrack.id) {
      console.log('🎵 Same track selected, no change');
      return;
    }

    console.log('🎵 Switching to new track:', track.name);
    
    // Find the category of the selected track to update the current playlist and index
    const categoryName = Object.keys(frequencyTracks).find(cat => 
      frequencyTracks[cat].some(t => t.id === track.id)
    );
    const newPlaylist = frequencyTracks[categoryName];
    const newIndex = newPlaylist.findIndex(t => t.id === track.id);

    setCurrentPlayingTrack(track);
    setCurrentPlaylist(newPlaylist);
    setCurrentTrackIndex(newIndex);
    setSelectedCategory(categoryName); // Keep category selector in sync
    setIsPlaying(false); // Stop current, let user press play for new track
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // When category changes, reset the playing track to the first in the new category
    if (frequencyTracks[category] && frequencyTracks[category].length > 0) {
      const firstTrackOfCategory = frequencyTracks[category][0];
      setCurrentPlaylist(frequencyTracks[category]);
      setCurrentTrackIndex(0);
      setCurrentPlayingTrack(firstTrackOfCategory);
      setIsPlaying(false); // Do not auto-play new category
    } else {
      // No tracks in category, clear current playing track
      setCurrentPlaylist([]);
      setCurrentTrackIndex(-1);
      setCurrentPlayingTrack(null);
      setIsPlaying(false);
    }
  };

  const handleNextTrack = () => {
    if (!currentPlaylist || currentPlaylist.length === 0) return;

    let nextIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    const nextTrack = currentPlaylist[nextIndex];
    
    if (nextTrack) {
      setCurrentPlayingTrack(nextTrack);
      setCurrentTrackIndex(nextIndex);
      setIsPlaying(true); // Auto-play next track
    }
  };

  const handlePreviousTrack = () => {
    if (!currentPlaylist || currentPlaylist.length === 0) return;

    let previousIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const previousTrack = currentPlaylist[previousIndex];

    if (previousTrack) {
      setCurrentPlayingTrack(previousTrack);
      setCurrentTrackIndex(previousIndex);
      setIsPlaying(true); // Auto-play previous track
    }
  };

  // Detect if on iOS
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <SubscriptionGuard requiredProduct="sanctuary">
      <div className="foundation-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&family=Share+Tech+Mono&family=Playfair+Display:wght@400;600;700&display=swap');
          
          :root {
            --color-bg: #0A0A0A;
            --color-primary: #FF5900;
            --color-secondary: #FF8C42;
            --bg-primary: rgba(10, 10, 10, 0.85);
            --bg-secondary: rgba(10, 10, 10, 0.6);
            --glow-strength: 12px;
            --breath-duration: 7s;
          }

          @keyframes gentle-breath {
            0% { 
              text-shadow: 0 0 8px var(--color-secondary), 0 0 10px var(--color-primary);
              box-shadow: 0 0 10px 0 rgba(226, 88, 34, 0.3);
            }
            50% { 
              text-shadow: 0 0 14px var(--color-secondary), 0 0 18px var(--color-primary);
              box-shadow: 0 0 20px 0 rgba(226, 88, 34, 0.6);
            }
            100% { 
              text-shadow: 0 0 8px var(--color-secondary), 0 0 10px var(--color-primary);
              box-shadow: 0 0 10px 0 rgba(226, 88, 34, 0.3);
            }
          }

          @keyframes title-breath {
            0% { 
              text-shadow: 0 0 15px var(--color-primary), 0 0 25px var(--color-secondary), 0 0 35px var(--color-primary);
              filter: brightness(0.9);
            }
            50% { 
              text-shadow: 0 0 25px var(--color-primary), 0 0 35px var(--color-secondary), 0 0 45px var(--color-primary);
              filter: brightness(1.1);
            }
            100% { 
              text-shadow: 0 0 15px var(--color-primary), 0 0 25px var(--color-secondary), 0 0 35px var(--color-primary);
              filter: brightness(0.9);
            }
          }

          @keyframes icon-glow {
            0% { 
              color: var(--color-primary);
              filter: drop-shadow(0 0 8px var(--color-primary)) drop_shadow(0 0 12px var(--color-secondary));
            }
            50% { 
              color: var(--color-secondary);
              filter: drop_shadow(0 0 15px var(--color-primary)) drop-shadow(0 0 20px var(--color-secondary));
            }
            100% { 
              color: var(--color-primary);
              filter: drop_shadow(0 0 8px var(--color-primary)) drop-shadow(0 0 12px var(--color-secondary));
            }
          }
          
          @keyframes particle-drift {
            from { transform: translateY(0); }
            to { transform: translateY(-1000px); }
          }
          
          @keyframes breathing-glow {
            0% { box-shadow: 0 0 15px rgba(226, 88, 34, 0.4); }
            50% { box-shadow: 0 0 30px rgba(226, 88, 34, 0.8); }
            100% { box-shadow: 0 0 15px rgba(226, 88, 34, 0.4); }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          @keyframes pulse-glow {
            0% { 
              box-shadow: 0 0 10px var(--color-primary);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 20px var(--color-primary), 0 0 30px var(--color-secondary);
              transform: scale(1.05);
            }
            100% { 
              box-shadow: 0 0 10px var(--color-primary);
              transform: scale(1);
            }
          }

          @keyframes slow-pulse {
            0% {
              box-shadow: 0 0 10px var(--color-primary);
              border-color: var(--color-primary);
            }
            50% {
              box-shadow: 0 0 25px var(--color-primary), 0 0 35px var(--color-secondary);
              border-color: var(--color-secondary);
            }
            100% {
              box-shadow: 0 0 10px var(--color-primary);
              border-color: var(--color-primary);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-20px);
            }
          }

          .foundation-page {
            background-color: #0A0A0A;
            background-image: radial-gradient(ellipse at bottom, var(--color-bg) 0%, #000000 70%);
            font-family: 'Exo 2', sans-serif;
            color: white;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          
          /* Removed: Background Image with Frame */

          .particle-container {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 2;
          }
          
          .particle {
            position: absolute;
            background: var(--color-primary);
            border-radius: 50%;
            opacity: 0;
            animation: particle-drift 20s linear infinite;
          }

          .foundation-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            display: block; /* Allows text-align to center h1/p */
            padding: 1rem 1.5rem;
            padding-top: calc(1rem + env(safe-area-inset-top));
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent);
            z-index: 100;
            text-align: center; /* Center title and subtitle */
          }
          
          .foundation-home-btn, .foundation-account-btn {
            position: absolute;
            top: 1rem;
            color: rgba(255,255,255,0.7);
            transition: color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem; /* Make clickable area larger */
          }

          .foundation-home-btn {
            left: 0.5rem;
          }

          .foundation-account-btn {
            right: 0.5rem;
          }
          
          .foundation-home-btn:hover, .foundation-account-btn:hover {
            color: var(--color-primary);
          }

          .foundation-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--color-primary);
            letter-spacing: 0.15em;
            position: relative;
            animation: title-breath var(--breath-duration) ease-in-out infinite;
            margin-bottom: 0.5rem; /* Space between title and subtitle */
          }

          .foundation-subtitle {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.7);
            margin-top: 0.5rem;
            margin-bottom: 0;
          }

          .swiper-container {
            flex-grow: 1;
            display: flex;
            width: 100%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            z-index: 10;
            padding-top: 100px; /* Adjust for fixed header height */
            opacity: ${!showDailyQuote && swiperReady ? '1' : '0'};
            transition: opacity 0.3s ease;
          }

          .swiper-container::-webkit-scrollbar {
            display: none;
          }
          
          .panel {
            flex: 0 0 100%;
            width: 100%;
            height: 100%;
            scroll-snap-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 0 1.5rem 80px; /* Adjusted top padding since swiper-container has it */
            position: relative;
            background: rgba(10, 10, 10, 0.75);
            overflow-y: auto;
          }

          .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 1rem 0;
            padding-bottom: calc(1rem + env(safe-area-inset-bottom));
            background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent);
            z-index: 100;
          }
          
          .nav-item {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 0.5rem;
          }
          
          .nav-item.active {
            animation: icon-glow var(--breath-duration) ease-in-out infinite;
            transform: translateY(-3px);
          }
          
          .nav-item span {
            font-family: 'Orbitron', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }

          .nav-item:hover:not(.active) {
            color: rgba(255, 255, 255, 0.8);
            transform: translateY(-1px);
          }

          /* Sanctuary Panel Layout - UPDATED with Background Image */
          .sanctuary-panel-layout {
            justify-content: flex-start;
            text-align: center;
            gap: 2rem;
            padding: 0 1rem 80px; /* Adjusted top padding */
            position: relative;
            background-image: url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd2/cad97f550_Untitled528_20251013041244.png');
            background-size: contain;
            background-position: center top;
            background-repeat: no-repeat;
            background-attachment: fixed;
            opacity: 1; /* Ensure base opacity */
          }

          .sanctuary-panel-layout::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, 
              rgba(10, 10, 10, 0.3) 0%, 
              rgba(10, 10, 10, 0.7) 40%, 
              rgba(10, 10, 10, 0.95) 100%
            );
            pointer-events: none;
            z-index: 1; /* Overlay on top of background image, but below content */
          }

          .sanctuary-top {
            padding-top: 1rem;
            width: 100%;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 5; /* Ensure content is above overlay */
          }
          
          .sanctuary-text {
            font-size: 0.9rem;
            max-width: 600px;
            margin: 0 auto 2rem;
            line-height: 1.6;
            color: rgba(255,255,255,0.8);
            position: relative;
            z-index: 5; /* Ensure content is above overlay */
          }

          .sanctuary-main {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            position: relative;
            z-index: 5; /* Ensure content is above overlay */
          }

          .sanctuary-bottom {
            width: 100%;
            max-width: 800px;
            margin: 0 auto; /* Removed top margin, added to sanctuary-main */
            position: relative;
            z-index: 5; /* Ensure content is above overlay */
          }
          
          .progress-section {
            width: 100%;
          }
          
          .hud-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 11fr));
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .hud-chip {
            background: rgba(226, 88, 34, 0.1);
            border: 1px solid rgba(226, 88, 34, 0.4);
            padding: 1rem;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
          }

          .hud-chip:hover {
            background: rgba(226, 88, 34, 0.15);
            border-color: var(--color-primary);
          }

          .hud-chip::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(255, 179, 122, 0.3);
            margin: 2px;
            pointer-events: none;
          }
          
          .hud-chip .value {
            font-family: 'Orbitron', monospace;
            font-size: 1.4rem;
            color: var(--color-secondary);
            font-weight: 700;
          }
          
          .hud-chip .label {
            font-size: 0.7rem;
            text-transform: uppercase;
            color: rgba(255,255,255,0.8);
            margin-top: 0.25rem;
            letter-spacing: 0.05em;
          }
          
          .chat-section {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .chat-widget {
            background: rgba(226, 88, 34, 0.1);
            border: 2px solid rgba(226, 88, 34, 0.6);
            height: 450px;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 0 25px rgba(226, 88, 34, 0.5);
          }

          .chat-widget:hover {
            background: rgba(226, 88, 34, 0.15);
            border-color: var(--color-primary);
            box-shadow: 0 0 35px rgba(226, 88, 34, 0.7);
          }

          .chat-widget::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(255, 179, 122, 0.3);
            margin: 3px;
            pointer-events: none;
          }

          .chat-header {
            padding: 1.2rem;
            border-bottom: 2px solid rgba(226, 88, 34, 0.4);
            background: rgba(0, 0, 0, 0.4);
          }

          .chat-header-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            color: var(--color-secondary);
            font-weight: 700;
            text-shadow: 0 0 12px var(--color-primary);
            margin-bottom: 0.35rem;
            letter-spacing: 0.08em;
          }

          .chat-header-subtitle {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            font-family: 'Share Tech Mono', monospace;
            letter-spacing: 0.05em;
          }

          .chat-messages {
            padding: 1rem;
            font-size: 0.85rem;
            color: rgba(255,255,255,0.9);
            flex-grow: 1;
            overflow-y: auto;
            font-family: 'Exo 2', sans-serif;
            line-height: 1.5;
          }

          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          .chat-messages::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background: var(--color-primary);
            border-radius: 3px;
          }

          .chat-message {
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-radius: 0;
            animation: fadeIn 0.3s ease;
          }

          .chat-message.user {
            background: rgba(226, 88, 34, 0.15);
            border-left: 3px solid var(--color-primary);
            margin-left: 2rem;
          }

          .chat-message.assistant {
            background: rgba(0, 0, 0, 0.3);
            border-left: 3px solid var(--color-secondary);
            margin-right: 2rem;
          }

          .chat-message.loading {
            opacity: 0.6;
            font-style: italic;
          }
          
          .chat-input {
            display: flex;
            border-top: 2px solid rgba(226, 88, 34, 0.4);
            background: rgba(0, 0, 0, 0.3);
            align-items: center;
          }
          
          .chat-input input {
            flex-grow: 1;
            background: transparent;
            border: none;
            padding: 1rem;
            color: white;
            font-size: 0.85rem;
            font-family: 'Exo 2', sans-serif;
          }

          .chat-input input::placeholder {
            color: rgba(255,255,255,0.5);
          }

          .chat-input input:focus {
            outline: none;
          }

          .chat-mic-button {
            background: transparent;
            border: none;
            padding: 1rem;
            color: var(--color-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 1px solid rgba(226, 88, 34, 0.3);
          }

          .chat-mic-button:hover:not(:disabled) {
            background: rgba(226, 88, 34, 0.1);
            color: var(--color-secondary);
          }

          .chat-mic-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .chat-mic-button.recording {
            background: rgba(226, 88, 34, 0.2);
            animation: pulse-glow 1.5s ease-in-out infinite;
          }

          .chat-input button:last-child {
            background: rgba(226, 88, 34, 0.8);
            border: none;
            padding: 1rem 1.5rem;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .chat-input button:last-child:hover:not(:disabled) {
            background: var(--color-primary);
            box-shadow: 0 0 15px rgba(226, 88, 34, 0.5);
          }

          .chat-input button:last-child:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          /* Enhanced Resonator Panel */
          .resonator-panel {
            gap: 2rem;
            padding: 0 1rem 80px; /* Adjusted top padding */
            overflow-y: auto;
          }

          .category-selector {
            width: 100%;
            max-width: 600px;
            margin-bottom: 2rem;
          }

          .category-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
            margin-bottom: 1.5rem;
          }

          .category-tab {
            background: rgba(226, 88, 34, 0.1);
            border: 1px solid rgba(226, 88, 34, 0.4);
            color: rgba(255,255,255,0.8);
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
          }

          .category-tab.active {
            background: rgba(226, 88, 34, 0.2);
            border-color: var(--color-primary);
            color: var(--color-secondary);
            animation: gentle-breath var(--breath-duration) ease-in-out infinite;
          }

          .category-tab:hover {
            background: rgba(226, 88, 34, 0.15);
            border-color: var(--color-primary);
          }

          .track-list {
            width: 100%;
            max-width: 600px;
            margin-bottom: 2rem;
          }

          .track-item {
            background: rgba(226, 88, 34, 0.1);
            border: 1px solid rgba(226, 88, 34, 0.4);
            margin-bottom: 0.5rem;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            flex-direction: column; /* Changed to column to allow download button beneath */
            align-items: flex-start; /* Align text left */
          }

          .track-item:hover, .track-item.active {
            background: rgba(226, 88, 34, 0.15);
            border-color: var(--color-primary);
          }

          .track-item.active {
            animation: gentle-breath var(--breath-duration) ease-in-out infinite;
          }

          .track-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 0.5rem;
          }

          .track-name {
            font-family: 'Orbitron', monospace;
            color: var(--color-secondary);
            font-size: 0.9rem;
          }

          .track-duration {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.6);
          }

          .track-frequency {
            font-size: 0.7rem;
            color: var(--color-primary);
            margin-bottom: 0.25rem;
          }

          .track-sigil {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 16px;
            height: 16px;
            color: var(--color-primary);
            opacity: 0.5;
          }
          
          /* Library Panel */
          .library-panel {
            justify-content: flex-start;
            overflow-y: auto;
            gap: 1.5rem;
            padding: 0 1rem 80px; /* Adjusted top padding */
          }

          .library-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .library-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: var(--color-primary);
            margin-bottom: 0.5rem;
            animation: title-breath var(--breath-duration) ease-in-out infinite;
          }
          
          .course-card {
            background: rgba(226, 88, 34, 0.1);
            border: 1px solid rgba(226, 88, 34, 0.4);
            padding: 1.5rem;
            width: 100%;
            max-width: 600px;
            position: relative;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .course-card:hover {
            background: rgba(226, 88, 34, 0.15);
            border-color: var(--color-primary);
            animation: gentle-breath var(--breath-duration) ease-in-out infinite;
          }
          
          .course-type-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 0.25rem 0.5rem;
            font-size: 0.6rem; /* Changed from 0.7rem to 0.6rem */
            font-family: 'Orbitron', monospace;
            border: 1px solid var(--color-primary);
            color: var(--color-secondary);
            background: rgba(0, 0, 0, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .course-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: var(--color-secondary);
            margin-bottom: 0.5rem;
          }

          .course-desc {
            color: rgba(255,255,255,0.8);
            margin-bottom: 1rem;
            line-height: 1.5;
          }
          
          .course-progress-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
          }

          .course-progress-bar {
            flex-grow: 1;
            height: 4px;
            background: rgba(255,255,255,0.1);
            margin-right: 1rem;
          }
          
          .course-progress-fill {
            height: 100%;
            background: var(--color-primary);
            transition: width 0.3s ease;
          }

          .course-progress-text {
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            color: var(--color-primary);
          }

          .course-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 200;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            overflow-y: auto;
          }

          .course-modal {
            background: var(--bg-primary);
            border: 2px solid var(--color-primary);
            box-shadow: 0 0 30px var(--color-primary);
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            padding: 2rem;
          }

          .course-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: transparent;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .course-modal-close:hover {
            background: var(--color-primary);
            color: black;
          }

          .course-modal-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            color: var(--color-primary);
            margin-bottom: 1rem;
            animation: title-breath var(--breath-duration) ease-in-out infinite;
          }

          .course-modal-intro {
            color: rgba(255,255,255,0.9);
            line-height: 1.6;
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }

          .sleep-stage {
            background: rgba(226, 88, 34, 0.05);
            border: 1px solid rgba(226, 88, 34, 0.3);
            padding: 1.5rem;
            margin-bottom: 1rem;
            position: relative;
          }

          .sleep-stage::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(255, 179, 122, 0.2);
            margin: 3px;
            pointer-events: none;
          }

          .stage-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            color: var(--color-secondary);
            margin-bottom: 0.5rem;
          }

          .stage-type {
            color: var(--color-primary);
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .stage-duration {
            color: rgba(255,255,255,0.7);
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
          }

          .stage-characteristics {
            color: rgba(255,255,255,0.85);
            line-height: 1.5;
            font-size: 0.9rem;
          }

          .info-section {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(226, 88, 34, 0.05);
            border: 1px solid rgba(226, 88, 34, 0.3);
          }

          .info-section-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.3rem;
            color: var(--color-primary);
            margin-bottom: 1rem;
            letter-spacing: 0.05em;
          }

          .info-points {
            list-style: none;
            padding: 0;
          }

          .info-points li {
            color: rgba(255,255,255,0.85);
            line-height: 1.6;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
            position: relative;
            font-size: 0.9rem;
          }

          .info-points li::before {
            content: '◢';
            position: absolute;
            left: 0;
            color: var(--color-secondary);
            font-size: 0.8em;
          }

          .technique-list {
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          .technique-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.5rem 0;
            color: rgba(255,255,255,0.85);
            font-size: 0.9rem;
            line-height: 1.4;
          }

          .technique-checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid var(--color-primary);
            background: transparent;
            cursor: pointer;
            flex-shrink: 0;
            margin-top: 2px;
            position: relative;
            transition: all 0.3s ease;
          }

          .technique-checkbox:hover {
            background: rgba(226, 88, 34, 0.2);
            box-shadow: 0 0 8px var(--color-primary);
          }

          .technique-checkbox.checked {
            background: var(--color-primary);
            box-shadow: 0 0 8px var(--color-primary);
          }

          .technique-checkbox.checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: black;
            font-size: 12px;
            font-weight: bold;
          }

          .technique-text {
            flex: 1;
          }

          .system-box {
            background: rgba(226, 88, 34, 0.05);
            border: 1px solid rgba(226, 88, 34, 0.3);
            padding: 1.5rem;
            margin-bottom: 1rem;
            position: relative;
          }

          .system-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(255, 179, 122, 0.2);
            margin: 3px;
            pointer-events: none;
          }

          .system-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: var(--color-secondary);
            margin-bottom: 0.5rem;
          }

          .system-type {
            color: var(--color-primary);
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .system-detail {
            color: rgba(255,255,255,0.85);
            line-height: 1.5;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .system-detail strong {
            color: var(--color-secondary);
          }

          .phase-box {
            background: rgba(226, 88, 34, 0.05);
            border: 1px solid rgba(226, 88, 34, 0.3);
            padding: 1.5rem;
            margin-bottom: 1rem;
            position: relative;
          }

          .phase-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(255, 179, 122, 0.2);
            margin: 3px;
            pointer-events: none;
          }

          .phase-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: var(--color-secondary);
            margin-bottom: 0.5rem;
          }

          .phase-type {
            color: var(--color-primary);
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .phase-detail {
            color: rgba(255,255,255,0.85);
            line-height: 1.5;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .phase-detail strong {
            color: var(--color-secondary);
          }

          /* Dream Journal Styles */
          .dream-journal-section {
            width: 100%;
          }

          .dream-journal-widget {
            background: rgba(226, 88, 34, 0.1);
            border: 2px solid rgba(226, 88, 34, 0.6);
            display: flex;
            flex-direction: column;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(226, 88, 34, 0.4);
          }

          .dream-journal-widget:hover {
            background: rgba(226, 88, 34, 0.15);
            border-color: var(--color-primary);
            box-shadow: 0 0 30px rgba(226, 88, 34, 0.6);
          }

          .dream-journal-widget::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(255, 179, 122, 0.3);
            margin: 3px;
            pointer-events: none;
          }

          .dream-journal-header {
            padding: 1rem;
            border-bottom: 1px solid rgba(226, 88, 34, 0.4);
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .dream-journal-title {
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            color: var(--color-secondary);
            font-weight: 700;
            text-shadow: 0 0 10px var(--color-primary);
          }

          .dream-journal-history-toggle {
            background: transparent;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            padding: 0.4rem 0.8rem;
            font-family: 'Orbitron', monospace;
            font-size: 0.7rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .dream-journal-history-toggle:hover {
            background: var(--color-primary);
            color: black;
            box-shadow: 0 0 10px var(--color-primary);
          }

          .dream-journal-input {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .dream-journal-textarea {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(226, 88, 34, 0.3);
            color: white;
            padding: 1rem;
            font-family: 'Exo 2', sans-serif;
            font-size: 0.9rem;
            line-height: 1.6;
            resize: vertical;
            min-height: 120px;
            transition: all 0.3s ease;
          }

          .dream-journal-textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
            font-style: italic;
          }

          .dream-journal-textarea:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 10px rgba(226, 88, 34, 0.3);
          }

          .dream-journal-button {
            background: rgba(226, 88, 34, 0.8);
            border: none;
            padding: 0.8rem 1.5rem;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            align-self: flex-end;
          }

          .dream-journal-button:hover:not(:disabled) {
            background: var(--color-primary);
            box-shadow: 0 0 15px rgba(226, 88, 34, 0.6);
            transform: translateY(-1px);
          }

          .dream-journal-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .dream-journal-history {
            max-height: 300px;
            overflow-y: auto;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
          }

          .dream-journal-history::-webkit-scrollbar {
            width: 6px;
          }

          .dream-journal-history::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }

          .dream-journal-history::-webkit-scrollbar-thumb {
            background: var(--color-primary);
            border-radius: 3px;
          }

          .dream-entry {
            background: rgba(226, 88, 34, 0.05);
            border-left: 3px solid var(--color-primary);
            padding: 1rem;
            margin-bottom: 1rem;
            position: relative;
          }

          .dream-entry-date {
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7rem;
            color: var(--color-primary);
            margin-bottom: 0.5rem;
          }

          .dream-entry-content {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.85rem;
            line-height: 1.5;
            margin-bottom: 0.75rem;
          }

          .dream-entry-delete {
            background: transparent;
            border: 1px solid rgba(255, 0, 0, 0.5);
            color: rgba(255, 0, 0, 0.7);
            padding: 0.3rem 0.6rem;
            font-size: 0.65rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            font-family: 'Orbitron', monospace;
          }

          .dream-entry-delete:hover {
            background: rgba(255, 0, 0, 0.2);
            border-color: red;
            color: red;
          }

          .dream-journal-empty {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.85rem;
            font-style: italic;
          }

          .quote-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            animation: ${quoteVisible ? 'fadeIn 0.5s ease-out forwards' : 'fadeOut 0.5s ease-out forwards'};
            ${!showDailyQuote && 'display: none;'} /* Hide completely when not showing quote */
          }

          .quote-content {
            max-width: 800px;
            text-align: center;
            opacity: ${quoteVisible ? 1 : 0};
            transform: translateY(${quoteVisible ? 0 : '20px'});
            transition: all 0.8s ease-out;
          }

          .quote-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-primary);
            margin-bottom: 2rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-shadow: 0 0 15px var(--color-primary);
          }

          .quote-text {
            font-family: 'Exo 2', sans-serif;
            font-size: 1.6rem;
            font-weight: 300;
            line-height: 1.8;
            color: #F5F5F5;
            margin-bottom: 3rem;
            letter-spacing: 0.02em;
          }

          .quote-button {
            background: transparent;
            border: 2px solid var(--color-primary);
            color: var(--color-primary);
            padding: 1rem 3rem;
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 0.15em;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            animation: slow-pulse 3s ease-in-out infinite;
          }

          .quote-button:hover {
            background: var(--color-primary);
            color: #000000;
            transform: scale(1.05);
          }

          .track-download-button {
            display: flex;
            align-items: center;
            background: transparent;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            padding: 0.4rem 0.8rem;
            font-family: 'Orbitron', monospace;
            font-size: 0.65rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.5rem;
            align-self: flex-start; /* Ensure it aligns nicely if not full width */
          }

          .track-download-button:hover {
            background: var(--color-primary);
            color: black;
            box-shadow: 0 0 10px var(--color-primary);
          }

          .track-background-play-button {
            display: flex;
            align-items: center;
            background: rgba(226, 88, 34, 0.2);
            border: 2px solid var(--color-secondary);
            color: var(--color-secondary);
            padding: 0.5rem 1rem;
            font-family: 'Orbitron', monospace;
            font-size: 0.7rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.5rem;
            align-self: flex-start;
            font-weight: 600;
            animation: gentle-breath var(--breath-duration) ease-in-out infinite;
          }

          .track-background-play-button:hover {
            background: var(--color-secondary);
            color: black;
            box-shadow: 0 0 15px var(--color-secondary);
            transform: translateY(-1px);
          }

          .track-button-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0.5rem;
            width: 100%;
          }

          .ios-background-tip {
            background: rgba(255, 140, 66, 0.1);
            border: 1px solid rgba(255, 140, 66, 0.3);
            padding: 1rem;
            margin-bottom: 1.5rem;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
            text-align: center;
          }

          .ios-background-tip-title {
            font-family: 'Orbitron', monospace;
            color: var(--color-secondary);
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
            letter-spacing: 0.05em;
          }

          .track-coming-soon {
            font-size: 0.65rem;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 0.5rem;
            font-style: italic;
            align-self: flex-start;
          }


          @media (max-width: 768px) {
            .quote-title {
              font-size: 1.2rem;
              margin-bottom: 1.5rem;
            }

            .quote-text {
              font-size: 1.3rem;
              line-height: 1.6;
              margin-bottom: 2rem;
            }

            .quote-button {
              padding: 0.8rem 2rem;
              font-size: 0.8rem;
            }

            .sanctuary-bottom {
              flex-direction: column;
              gap: 1.5rem;
            }
            
            .foundation-title {
              font-size: 1.2rem;
            }

            .foundation-subtitle {
              font-size: 0.7rem;
            }

            .category-tabs {
              gap: 0.25rem;
            }

            .category-tab {
              padding: 0.4rem 0.8rem;
              font-size: 0.7rem;
            }

            .course-modal {
              padding: 1.5rem;
            }

            .course-modal-title {
              font-size: 1.4rem;
            }

            .stage-name {
              font-size: 1rem;
            }

            .info-section-title {
              font-size: 1.1rem;
            }

            .chat-widget {
              height: 350px; /* Adjusted height for mobile */
            }

            .hud-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .dream-journal-textarea {
              min-height: 100px;
              font-size: 0.85rem;
            }
          }

          @media (max-width: 480px) {
            .quote-title {
              font-size: 1.0rem;
            }

            .quote-text {
              font-size: 1.1rem;
            }

            .quote-button {
              padding: 0.7rem 1.5rem;
              font-size: 0.75rem;
            }
          }
        `}</style>

        {/* Floating Particles */}
        <div className="particle-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 15 + 10}s`,
                opacity: `${Math.random() * 0.5 + 0.1}`
              }}
            />
          ))}
        </div>
        
        {/* Daily Quote Overlay */}
        {showDailyQuote && (
          <div className="quote-overlay">
            <div className="quote-content">
              <div className="quote-title">{todaysQuote.title}</div>
              <div className="quote-text">"{todaysQuote.quote}"</div>
              <button className="quote-button" onClick={handleEnterSanctuary}>
                Enter Sanctuary
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="foundation-header">
          <Link to="/portal" className="foundation-home-btn">
            <Home size={24} />
          </Link>
          <Link to="/account" className="foundation-account-btn">
            <User size={24} />
          </Link>
          <h1 className="foundation-title">THE DREAMSCAPE</h1>
          <p className="foundation-subtitle">
            Master your sleep. Reclaim your nights. Engineer your consciousness.
          </p>
        </div>
        
        {/* Course Modal */}
        {selectedCourse && (
          <div className="course-modal-overlay" onClick={() => setSelectedCourse(null)}>
            <div className="course-modal" onClick={(e) => e.stopPropagation()}>
              <button className="course-modal-close" onClick={() => setSelectedCourse(null)}>
                CLOSE
              </button>
              <h2 className="course-modal-title">{selectedCourse.title}</h2>
              
              {selectedCourse.type === 'knowledge' && selectedCourse.content && (
                <>
                  <p className="course-modal-intro">{selectedCourse.content.intro}</p>

                  {selectedCourse.content.stages && (
                    <div>
                      {selectedCourse.content.stages.map((stage, index) => (
                        <div key={index} className="sleep-stage">
                          <div className="stage-name">{stage.name}</div>
                          <div className="stage-type">{stage.type}</div>
                          <div className="stage-duration">{stage.duration}</div>
                          <div className="stage-characteristics">{stage.characteristics}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedCourse.content.systems && (
                    <div>
                      {selectedCourse.content.systems.map((system, index) => (
                        <div key={index} className="system-box">
                          <div className="system-name">{system.name}</div>
                          <div className="system-type">{system.type}</div>
                          <div className="system-detail"><strong>Function:</strong> {system.function}</div>
                          <div className="system-detail"><strong>Effects:</strong> {system.effects}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedCourse.content.phases && (
                    <div>
                      {selectedCourse.content.phases.map((phase, index) => (
                        <div key={index} className="phase-box">
                          <div className="phase-name">{phase.name}</div>
                          <div className="phase-type">{phase.type}</div>
                          <div className="phase-detail"><strong>Hormones:</strong> {phase.hormones}</div>
                          <div className="phase-detail"><strong>Optimal For:</strong> {phase.optimal}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedCourse.content.cycle && (
                    <div className="info-section">
                      <h3 className="info-section-title">{selectedCourse.content.cycle.title}</h3>
                      <ul className="info-points">
                        {selectedCourse.content.cycle.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCourse.content.importance && (
                    <div className="info-section">
                      <h3 className="info-section-title">{selectedCourse.content.importance.title}</h3>
                      <ul className="info-points">
                        {selectedCourse.content.importance.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCourse.content.balance && (
                    <div className="info-section">
                      <h3 className="info-section-title">{selectedCourse.content.balance.title}</h3>
                      <ul className="info-points">
                        {selectedCourse.content.balance.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCourse.content.disruption && (
                    <div className="info-section">
                      <h3 className="info-section-title">{selectedCourse.content.disruption.title}</h3>
                      <ul className="info-points">
                        {selectedCourse.content.disruption.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCourse.content.optimization && (
                    <div className="info-section">
                      <h3 className="info-section-title">{selectedCourse.content.optimization.title}</h3>
                      <ul className="info-points">
                        {selectedCourse.content.optimization.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {selectedCourse.type === 'practice' && (
                <>
                  {selectedCourse.content && (
                    <>
                      <p className="course-modal-intro">{selectedCourse.content.intro}</p>
                      
                      {selectedCourse.content.victory && (
                        <div className="info-section">
                          <h3 className="info-section-title">THE VICTORY</h3>
                          <p className="course-modal-intro">{selectedCourse.content.victory}</p>
                        </div>
                      )}

                      {selectedCourse.content.protocol && (
                        <div className="info-section">
                          <h3 className="info-section-title">{selectedCourse.content.protocol}</h3>
                        </div>
                      )}

                      {selectedCourse.commandments && (
                        <div>
                          {selectedCourse.commandments.map((commandment, index) => (
                            <div key={index} className="system-box">
                              <div className="system-name">{commandment.name}</div>
                              <div className="system-detail"><strong>The Rule:</strong> {commandment.rule}</div>
                              <div className="system-detail"><strong>The "Why":</strong> {commandment.why}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedCourse.content.teaching && (
                        <div className="info-section">
                          <h3 className="info-section-title">SOVEREIGN TEACHING</h3>
                          <p className="course-modal-intro">{selectedCourse.content.teaching}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedCourse.techniques && (
                    <>
                      <div className="info-section">
                        <h3 className="info-section-title">DAILY PRACTICES</h3>
                        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem'}}>
                          Check off each technique as you practice it:
                        </p>
                      </div>
                      <div className="technique-list">
                        {selectedCourse.techniques.map((technique, index) => (
                          <div key={index} className="technique-item">
                            <div 
                              className={`technique-checkbox ${techniqueProgress[`${selectedCourse.title}_${index}`]?.checked ? 'checked' : ''}`}
                              onClick={() => handleTechniqueToggle(selectedCourse.title, index)}
                            />
                            <span className="technique-text">{technique}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Swiper */}
        <main className="swiper-container" ref={swiperRef}>
          {/* PANEL 1: RESONATOR with NEW AudioPlayer */}
          <div className="panel resonator-panel">
            <AudioPlayer 
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              currentTrack={currentPlayingTrack ? currentPlayingTrack.name : "Select a Frequency"}
              audioUrl={currentPlayingTrack ? currentPlayingTrack.audioUrl : null}
              onNext={handleNextTrack}
              onPrevious={handlePreviousTrack}
            />

            {/* iOS Background Playback & Download Tip */}
            {isIOS && (
              <div className="ios-background-tip">
                <div className="ios-background-tip-title">🌙 iOS PLAYBACK GUIDE</div>
                <div style={{marginBottom: '0.5rem'}}>
                  <strong>For Background Audio:</strong> Tap "Play in Background" to open the track in Safari. 
                  It will continue playing with your screen locked.
                </div>
                <div>
                  <strong>To Download:</strong> After opening, tap the Share button (
                  <span style={{display: 'inline-block', transform: 'translateY(2px)'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{display: 'inline'}}>
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </span>
                  ), then "Save to Files"
                </div>
              </div>
            )}

            {/* Category Selector */}
            <div className="category-selector">
              <div className="category-tabs">
                {Object.keys(frequencyTracks).map(category => (
                  <button 
                    key={category}
                    className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Track List with Background Play & Download Buttons */}
            <div className="track-list">
              {frequencyTracks[selectedCategory]?.map((track, index) => (
                <div 
                  key={track.id}
                  className={`track-item ${currentPlayingTrack && track.id === currentPlayingTrack.id ? 'active' : ''}`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <SigilIcon className="track-sigil" type={track.type} />
                  <div className="track-item-header">
                    <span className="track-name">{track.name}</span>
                    <span className="track-duration">{track.duration}</span>
                  </div>
                  <div className="track-frequency">{track.frequency}</div>
                  {track.audioUrl ? (
                    <div className="track-button-group">
                      {isIOS && (
                        <button 
                          className="track-background-play-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBackgroundPlay(track);
                          }}
                        >
                          🌙 Play in Background
                        </button>
                      )}
                      <button 
                        className="track-download-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackDownload(track);
                        }}
                      >
                        <Download size={14} style={{marginRight: '4px'}} />
                        {isIOS ? 'Download/Share' : 'Download MP3'}
                      </button>
                    </div>
                  ) : (
                    <div className="track-coming-soon">Coming Soon</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PANEL 2: SANCTUARY - REDESIGNED */}
          <div className="panel sanctuary-panel-layout">
              <div className="sanctuary-top">
              </div>

              <div className="sanctuary-main">
                {/* Chat Widget - Now Main Feature */}
                <div className="chat-section">
                  <div className="chat-widget">
                      <div className="chat-header">
                        <div className="chat-header-title">DREAM ASSISTANT</div>
                        <div className="chat-header-subtitle">Your Sovereign Sleep Guide</div>
                      </div>
                      <div className="chat-messages">
                          {chatMessages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                              {msg.content}
                            </div>
                          ))}
                          {/* Streaming message (appears as chunks arrive) */}
                          {isStreamingChat && streamingChatContent && (
                            <div className="chat-message assistant">
                              {streamingChatContent}
                              <span className="streaming-cursor">▊</span>
                            </div>
                          )}
                          {/* Loading indicator (before streaming starts) */}
                          {isLoadingChat && !streamingChatContent && (
                            <div className="chat-message assistant loading">
                              Consulting the dreamscape...
                            </div>
                          )}
                      </div>
                      <div className="chat-input">
                          <input 
                            type="text" 
                            placeholder={isRecording ? "Listening..." : "Share your dreams, ask for guidance..."} 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={handleChatKeyPress}
                            disabled={isLoadingChat || isRecording}
                          />
                          {speechRecognitionAvailable && (
                            <button 
                              className={`chat-mic-button ${isRecording ? 'recording' : ''}`}
                              onClick={handleMicToggle}
                              disabled={isLoadingChat}
                              title={isRecording ? "Stop recording" : "Record voice message"}
                            >
                              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                          )}
                          <button 
                            onClick={handleChatSubmit}
                            disabled={isLoadingChat || !chatInput.trim() || isRecording}
                          >
                            Send
                          </button>
                      </div>
                  </div>
                </div>

                {/* Dream Journal */}
                <div className="dream-journal-section">
                  <div className="dream-journal-widget">
                    <div className="dream-journal-header">
                      <div className="dream-journal-title">DREAM JOURNAL</div>
                      <button 
                        className="dream-journal-history-toggle"
                        onClick={() => setShowJournalHistory(!showJournalHistory)}
                      >
                        {showJournalHistory ? 'Hide History' : 'View History'}
                      </button>
                    </div>
                    
                    {!showJournalHistory ? (
                      <div className="dream-journal-input">
                        <textarea
                          className="dream-journal-textarea"
                          placeholder="Record your dream here... Every fragment, every feeling, every color matters."
                          value={dreamJournalEntry}
                          onChange={(e) => setDreamJournalEntry(e.target.value)}
                        />
                        <button 
                          className="dream-journal-button"
                          onClick={handleSaveDream}
                          disabled={!dreamJournalEntry.trim()}
                        >
                          Save & Interpret
                        </button>
                      </div>
                    ) : (
                      <div className="dream-journal-history">
                        {dreamJournalEntries.length === 0 ? (
                          <div className="dream-journal-empty">
                            No dreams recorded yet. Start your journey by recording your first dream.
                          </div>
                        ) : (
                          dreamJournalEntries.map(entry => (
                            <div key={entry.id} className="dream-entry">
                              <div className="dream-entry-date">
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className="dream-entry-content">{entry.content}</div>
                              <button 
                                className="dream-entry-delete"
                                onClick={() => handleDeleteDream(entry.id)}
                              >
                                Delete
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Section - Now at Bottom */}
              <div className="sanctuary-bottom">
                <div className="progress-section">
                   <div className="hud-grid">
                      <div className="hud-chip">
                          <div className="value">87%</div>
                          <div className="label">Sleep Score</div>
                      </div>
                      <div className="hud-chip">
                          <div className="value">7</div>
                          <div className="label">Day Streak</div>
                      </div>
                   </div>
                </div>
              </div>
          </div>
          
          {/* PANEL 3: LIBRARY */}
          <div className="panel library-panel">
            <div className="library-header">
              <h2 className="library-title">THE LIBRARY</h2>
              <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem'}}>Expand Your Knowledge</p>
            </div>
            
            {courses.map((course, i) => (
              <div 
                className="course-card" 
                key={i}
                onClick={() => setSelectedCourse(course)}
              >
                <div className="course-type-badge">{course.type}</div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.desc}</p>
                {course.type === 'practice' && (
                  <div className="course-progress-container">
                    <div className="course-progress-bar">
                      <div className="course-progress-fill" style={{width: `${calculateProgress(course)}%`}}></div>
                    </div>
                    <span className="course-progress-text">{calculateProgress(course)}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Bottom Navigation - Only 3 Items */}
        <nav className="bottom-nav">
          <button className={`nav-item ${activePanel === 0 ? 'active' : ''}`} onClick={() => handleNavClick(0)}>
            <Music size={24} />
            <span>Resonator</span>
          </button>
          <button className={`nav-item ${activePanel === 1 ? 'active' : ''}`} onClick={() => handleNavClick(1)}>
            <BrainCircuit size={24} />
            <span>Sanctuary</span>
          </button>
          <button className={`nav-item ${activePanel === 2 ? 'active' : ''}`} onClick={() => handleNavClick(2)}>
            <Library size={24} />
            <span>Library</span>
          </button>
        </nav>
      </div>
    </SubscriptionGuard>
  );
}

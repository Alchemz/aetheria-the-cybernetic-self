import React, { useState, useEffect, useRef } from 'react';
import { Music } from 'lucide-react';

// Dedicated Audio Player Component with ALL background playback features
export default function AudioPlayer({ isPlaying, onTogglePlay, currentTrack, audioUrl }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [audioError, setAudioError] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const currentUrlRef = useRef(null);

  // 1. INITIALIZE AUDIO ELEMENT (only once)
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      
      // CRITICAL: iOS requirements
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      // These attributes are ESSENTIAL for mobile background playback
      audio.setAttribute('playsinline', '');
      audio.setAttribute('webkit-playsinline', '');
      
      audioRef.current = audio;
      console.log('🎵 Audio element created');
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // 2. SETUP MEDIA SESSION API (CRITICAL for background playback)
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack,
        artist: 'INNERSYNC',
        album: 'The Dreamscape',
        artwork: [
          { src: 'https://via.placeholder.com/96', sizes: '96x96', type: 'image/png' },
          { src: 'https://via.placeholder.com/128', sizes: '128x128', type: 'image/png' },
          { src: 'https://via.placeholder.com/192', sizes: '192x192', type: 'image/png' },
          { src: 'https://via.placeholder.com/256', sizes: '256x256', type: 'image/png' },
          { src: 'https://via.placeholder.com/384', sizes: '384x384', type: 'image/png' },
          { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' }
        ]
      });

      // Lock screen controls
      navigator.mediaSession.setActionHandler('play', async () => {
        console.log('📱 Play from lock screen');
        if (audioRef.current) {
          try {
            await audioRef.current.play();
            if (!isPlaying) onTogglePlay();
          } catch (err) {
            console.error('Lock screen play failed:', err);
          }
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        console.log('📱 Pause from lock screen');
        if (audioRef.current) {
          audioRef.current.pause();
          if (isPlaying) onTogglePlay();
        }
      });

      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - (details.seekOffset || 10));
        }
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        if (audioRef.current && audioRef.current.duration) {
          audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + (details.seekOffset || 10));
        }
      });

      console.log('✅ Media Session API configured');
    }
  }, [currentTrack, isPlaying, onTogglePlay]);

  // 3. LOAD AUDIO FILE
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    // Don't reload if same URL
    if (currentUrlRef.current === audioUrl) {
      console.log('✓ Same URL, skipping reload');
      return;
    }

    console.log('🎵 Loading new audio:', audioUrl);
    setIsLoadingAudio(true);
    setAudioError(null);
    setIsAudioReady(false);
    currentUrlRef.current = audioUrl;

    const audio = audioRef.current;

    // Event handlers
    const handleLoadedMetadata = () => {
      console.log('✅ Audio metadata loaded, duration:', audio.duration);
      setDuration(audio.duration || 0);
    };

    const handleCanPlay = () => {
      console.log('✅ Audio can play');
      setIsLoadingAudio(false);
      setIsAudioReady(true);
      setAudioError(null);
    };

    const handleError = (e) => {
      console.error('❌ Audio error:', e);
      let errorMsg = 'Failed to load audio';
      if (audio.error) {
        switch(audio.error.code) {
          case 1: errorMsg = 'Loading aborted'; break;
          case 2: errorMsg = 'Network error'; break;
          case 3: errorMsg = 'Decode error'; break;
          case 4: errorMsg = 'Format not supported'; break;
        }
      }
      setAudioError(errorMsg);
      setIsLoadingAudio(false);
      setIsAudioReady(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Update Media Session position
      if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
        try {
          navigator.mediaSession.setPositionState({
            duration: audio.duration || 0,
            playbackRate: audio.playbackRate,
            position: audio.currentTime
          });
        } catch (e) {
          // Ignore if not ready yet
        }
      }
    };

    const handleEnded = () => {
      console.log('🎵 Audio ended');
      onTogglePlay();
      setCurrentTime(0);
    };

    // Add listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Set source and load
    audio.volume = volume / 100;
    audio.src = audioUrl;
    audio.load();

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, volume, onTogglePlay]);

  // 4. INITIALIZE WEB AUDIO API (for visualization)
  useEffect(() => {
    if (!audioRef.current || !audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext && audioRef.current && !sourceNodeRef.current) {
        try {
          audioContextRef.current = new AudioContext();
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceNodeRef.current.connect(audioContextRef.current.destination);
          console.log('✅ Web Audio API connected');
        } catch (err) {
          console.warn('Web Audio API not available:', err);
        }
      }
    }
  }, [audioUrl]);

  // 5. HANDLE PLAY/PAUSE WITH AUDIO CONTEXT RESUME
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady) return;

    if (isPlaying) {
      console.log('▶️ Playing audio');
      
      // CRITICAL: Resume Audio Context on iOS
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          console.log('✅ Audio context resumed');
        });
      }

      // Play audio
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            console.log('✅ Playback started');
            if ('mediaSession' in navigator) {
              navigator.mediaSession.playbackState = 'playing';
            }
          })
          .catch(err => {
            console.error('❌ Play failed:', err);
            setAudioError('Playback failed: ' + err.message);
          });
      }
    } else {
      console.log('⏸️ Pausing audio');
      audio.pause();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    }
  }, [isPlaying, isAudioReady]);

  // 6. HANDLE VISIBILITY CHANGE (background/foreground)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📱 App backgrounded - audio should continue');
        // DO NOT PAUSE - this is key!
        if ('mediaSession' in navigator && audioRef.current) {
          navigator.mediaSession.playbackState = audioRef.current.paused ? 'paused' : 'playing';
        }
      } else {
        console.log('📱 App foregrounded');
        // Resume audio context if needed
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 7. UPDATE VOLUME
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // UI FUNCTIONS
  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.round((clickX / rect.width) * 100);
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Track Info */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 0 15px var(--color-primary)',
        background: 'var(--bg-primary)'
      }}>
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: '16px',
          fontWeight: 700,
          marginBottom: '10px',
          color: 'var(--color-secondary)'
        }}>
          {currentTrack}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-primary)' }}>
          4.5 Hz | 432 BASE | Δ: 0.03
        </div>

        {isLoadingAudio && (
          <div style={{
            fontSize: '11px',
            color: 'var(--color-primary)',
            marginTop: '10px',
            padding: '8px',
            background: 'rgba(226, 88, 34, 0.1)',
            border: '1px solid rgba(226, 88, 34, 0.3)'
          }}>
            Loading audio...
          </div>
        )}

        {audioError && (
          <div style={{
            fontSize: '11px',
            color: '#FF4444',
            marginTop: '10px',
            padding: '8px',
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid rgba(255, 68, 68, 0.3)'
          }}>
            {audioError}
          </div>
        )}

        {isPlaying && isAudioReady && (
          <div style={{
            fontSize: '10px',
            color: 'var(--color-secondary)',
            marginTop: '10px',
            padding: '6px',
            background: 'rgba(255, 140, 66, 0.1)',
            border: '1px solid rgba(255, 140, 66, 0.3)'
          }}>
            ✨ Background playback active - safe to lock screen or switch apps
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '20px',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 0 15px var(--color-primary)',
        background: 'var(--bg-primary)'
      }}>
        {/* Play/Pause Button */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={onTogglePlay}
            disabled={isLoadingAudio || !!audioError || !audioUrl || !isAudioReady}
            style={{
              padding: '15px 40px',
              background: 'var(--bg-primary)',
              color: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              fontFamily: "'Orbitron', monospace",
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (isLoadingAudio || !!audioError || !audioUrl || !isAudioReady) ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 10px var(--color-primary)',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              opacity: (isLoadingAudio || !!audioError || !audioUrl || !isAudioReady) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoadingAudio && !audioError && audioUrl && isAudioReady) {
                e.target.style.background = 'rgba(226, 88, 34, 0.2)';
              }
            }}
            onMouseLeave={(e) => e.target.style.background = 'var(--bg-primary)'}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '15px' }}>
          <div 
            onClick={handleSeek}
            style={{
              width: '100%',
              height: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--color-primary)',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 0 5px var(--color-primary)'
            }}
          >
            <div style={{
              height: '100%',
              background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              boxShadow: '0 0 5px var(--color-primary)'
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginTop: '5px',
            color: 'var(--color-primary)'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Music size={16} color="var(--color-primary)" />
          <div 
            onClick={handleVolumeChange}
            style={{
              flex: 1,
              height: '6px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--color-primary)',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 0 5px var(--color-primary)'
            }}
          >
            <div style={{
              height: '100%',
              background: 'var(--color-primary)',
              width: `${volume}%`,
              boxShadow: '0 0 5px var(--color-primary)'
            }} />
          </div>
          <span style={{ color: 'var(--color-primary)', minWidth: '40px' }}>{volume}%</span>
        </div>
      </div>
    </div>
  );
}
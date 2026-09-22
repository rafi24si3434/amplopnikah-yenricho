import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

export default function MusicPlayer({ shouldAutoPlay }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy might block without user interaction
        });
    }
  }, [shouldAutoPlay]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop id="bg-music">
        <source src="assets/music/wedding-song.mp3" type="audio/mpeg" />
      </audio>

      <button 
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        id="music-toggle" 
        onClick={toggleMusic}
        title={isPlaying ? 'Pause Musik' : 'Putar Musik'}
      >
        <div className="music-toggle-inner">
          {isPlaying ? <Music size={20} className="music-icon-playing" /> : <VolumeX size={20} />}
          {isPlaying && (
            <div className="equalizer-bars-mini" title="Musik Berputar">
              <span className="eq-bar bar-1"></span>
              <span className="eq-bar bar-2"></span>
              <span className="eq-bar bar-3"></span>
            </div>
          )}
        </div>
      </button>
    </>
  );
}

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
        {isPlaying ? <Music size={22} /> : <VolumeX size={22} />}
      </button>
    </>
  );
}

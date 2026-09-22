import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { MonogramCrest, BotanicalDivider } from './Ornaments';

export default function HeroSection({ data }) {
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.classList.add('hero-particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 4) + 's';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      container.appendChild(p);
    }
  }, []);

  const groomInit = (data.groomName || 'Y').charAt(0).toUpperCase();
  const brideInit = (data.brideName || 'V').charAt(0).toUpperCase();

  const scrollToNext = () => {
    const coupleEl = document.getElementById('couple');
    if (coupleEl) {
      coupleEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="section section-dark hero-luxury-section section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/12.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>
      <div className="hero-particles" ref={particlesRef}></div>
      <div className="section-content hero-content reveal">
        
        {/* Monogram Crest with Soft Gold Halo */}
        <div className="hero-crest-container">
          <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={90} />
        </div>

        <BotanicalDivider />

        <p className="script-text">Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa</p>
        
        <h2 className="section-title hero-title">
          <span className="groom-full">{data.groomFullName || 'Yenricho Noprian T Silaban'}</span>
          <span className="hero-amp">&</span>
          <span className="bride-full">{data.brideFullName || 'Veni Gracia Br Sitanggang, S.Pd'}</span>
        </h2>

        <div className="bible-verse reveal">
          <p className="verse-text">
            "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia."
          </p>
          <p className="verse-ref">— Matius 19:6 —</p>
        </div>

        <BotanicalDivider />

        {/* Luxury Scroll Down Indicator */}
        <div className="hero-scroll-indicator" onClick={scrollToNext} role="button" tabIndex={0}>
          <span className="scroll-text">Gulir ke Bawah</span>
          <div className="scroll-arrow-circle">
            <ChevronDown size={18} className="scroll-chevron" />
          </div>
        </div>

      </div>
    </section>
  );
}

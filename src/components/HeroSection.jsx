import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { MonogramCrest, UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';
import { initDaylightFloatingParticles, attach3DParallaxTilt } from '../utils/batakInteractions';

export default function HeroSection({ data }) {
  const particlesRef = useRef(null);
  const crestRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    const cleanupParticles = initDaylightFloatingParticles(container, 25);
    return cleanupParticles;
  }, []);

  useEffect(() => {
    if (!crestRef.current) return;
    const cleanupTilt = attach3DParallaxTilt(crestRef.current, 10);
    return cleanupTilt;
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
        
        {/* Batak Royal Linen / Parchment Material Card Plate */}
        <div className="hero-material-card">
          <CornerGorgaFiligree position="top-left" />
          <CornerGorgaFiligree position="top-right" />
          <CornerGorgaFiligree position="bottom-left" />
          <CornerGorgaFiligree position="bottom-right" />

          {/* Monogram Crest with 3D Parallax Tilt */}
          <div className="hero-crest-container" ref={crestRef}>
            <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={84} />
          </div>

          <GorgaBatakOrnament size={42} />

          <p className="hero-salutation-script">Dengan memohon rahmat dan berkat Tuhan Yang Maha Esa</p>
          
          <h2 className="section-title hero-title">
            <span className="groom-full">{data.groomFullName || 'Yenricho Noprian T Silaban'}</span>
            <span className="hero-amp">&</span>
            <span className="bride-full">{data.brideFullName || 'Veni Gracia Br Sitanggang, S.Pd'}</span>
          </h2>

          <div className="hero-bible-verse-card">
            <p className="verse-text">
              "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia."
            </p>
            <p className="verse-ref">— Matius 19:6 —</p>
          </div>

          {/* Traditional Batak Ulos Weave Divider */}
          <UlosRibbonDivider />
        </div>

        {/* Luxury Material Floating Scroll Down Indicator */}
        <div className="hero-scroll-wrapper">
          <div className="hero-scroll-indicator" onClick={scrollToNext} role="button" tabIndex={0}>
            <span className="scroll-text">Gulir ke Bawah</span>
            <div className="scroll-arrow-circle">
              <ChevronDown size={16} className="scroll-chevron" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

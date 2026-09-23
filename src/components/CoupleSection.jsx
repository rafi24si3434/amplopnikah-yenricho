import React, { useEffect, useRef } from 'react';
import { WeddingRings, CornerGorgaFiligree, UlosRibbonDivider, GorgaBatakOrnament } from './Ornaments';
import { attach3DParallaxTilt } from '../utils/batakInteractions';

export default function CoupleSection({ data }) {
  const groomCardRef = useRef(null);
  const brideCardRef = useRef(null);

  useEffect(() => {
    const cleanGroom = groomCardRef.current ? attach3DParallaxTilt(groomCardRef.current, 6) : null;
    const cleanBride = brideCardRef.current ? attach3DParallaxTilt(brideCardRef.current, 6) : null;

    return () => {
      if (cleanGroom) cleanGroom();
      if (cleanBride) cleanBride();
    };
  }, []);

  return (
    <section 
      id="couple" 
      className="section section-dark couple-luxury-section section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/3.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        {/* Section Header */}
        <div className="section-header reveal">
          <p className="section-label">THE COUPLE</p>
          <h2 className="section-title">Mempelai Yang Berbahagia</h2>
          <GorgaBatakOrnament size={46} />
          <UlosRibbonDivider />
        </div>

        {/* Romantic Quote from Reference */}
        <div className="quote-highlight-card reveal">
          <p className="quote-highlight-text">
            "Love is that condition in which the happiness of another person is essential to your own."
          </p>
          <p className="quote-highlight-ref">— Robert A. Heinlein —</p>
        </div>

        <div className="couple-container">
          
          {/* Mempelai Pria */}
          <div ref={groomCardRef} className="couple-card reveal reveal-left">
            <CornerGorgaFiligree position="top-left" />
            <CornerGorgaFiligree position="bottom-right" />

            {/* Arched Cathedral Frame */}
            <div className="arched-photo-frame">
              <img 
                src="/assets/images/foto laki laki sendiri.jpeg" 
                alt={data.groomFullName} 
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="couple-photo-placeholder" style={{ display: 'none' }}>
                <span>Foto Mempelai Pria</span>
              </div>
            </div>
            
            <div className="couple-info">
              <span className="couple-tag-badge">MEMPELAI PRIA</span>
              <h3 className="couple-name script-text">{data.groomFullName || 'Yenricho Noprian T Silaban'}</h3>
              <div className="parent-info-batak">
                <p>{data.groomChildOrder || 'Putra pertama dari:'}</p>
                <p><strong>{(!data.groomParents || data.groomParents.includes('...')) ? 'Bapak B. Silaban & Ibu R. Panjaitan' : data.groomParents}</strong></p>
              </div>
            </div>
          </div>

          {/* Interlocking Gold Wedding Rings in the Center */}
          <div className="couple-divider reveal">
            <div className="wedding-rings-wrapper">
              <WeddingRings size={56} />
              <span className="rings-heart-glow">❤</span>
            </div>
          </div>

          {/* Mempelai Wanita */}
          <div ref={brideCardRef} className="couple-card reveal reveal-right">
            <CornerGorgaFiligree position="top-right" />
            <CornerGorgaFiligree position="bottom-left" />

            {/* Arched Cathedral Frame */}
            <div className="arched-photo-frame">
              <img 
                src="/assets/images/foto perempuan sendiri.jpeg" 
                alt={data.brideFullName} 
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="couple-photo-placeholder" style={{ display: 'none' }}>
                <span>Foto Mempelai Wanita</span>
              </div>
            </div>
            
            <div className="couple-info">
              <span className="couple-tag-badge">MEMPELAI WANITA</span>
              <h3 className="couple-name script-text">{data.brideFullName || 'Veni Gracia Br Sitanggang, S.Pd'}</h3>
              <div className="parent-info-batak">
                <p>{data.brideChildOrder || 'Putri terakhir dari:'}</p>
                <p><strong>{(!data.brideParents || data.brideParents.includes('...')) ? 'Bapak A. Sitanggang & Ibu R. Manurung' : data.brideParents}</strong></p>
              </div>
            </div>
          </div>

        </div>

        {/* Section Bottom Ulos Divider */}
        <UlosRibbonDivider className="mt-8" />
      </div>
    </section>
  );
}

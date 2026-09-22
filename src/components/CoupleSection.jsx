import React from 'react';
import { WeddingRings, CornerFiligree, BotanicalDivider } from './Ornaments';

export default function CoupleSection({ data }) {
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
          <BotanicalDivider />
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
          <div className="couple-card reveal reveal-left">
            <CornerFiligree position="top-left" />
            <CornerFiligree position="bottom-right" />

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
                <p>Putra tercinta dari:</p>
                <p><strong>{data.groomParents || 'Bapak Silaban & Ibu Br. Sitompul'}</strong></p>
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
          <div className="couple-card reveal reveal-right">
            <CornerFiligree position="top-right" />
            <CornerFiligree position="bottom-left" />

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
                <p>Putri tercinta dari:</p>
                <p><strong>{data.brideParents || 'Bapak Sitanggang & Ibu Br. Sinambela'}</strong></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

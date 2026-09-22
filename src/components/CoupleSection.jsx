import React from 'react';
import { WeddingRings, CornerFiligree, BotanicalDivider } from './Ornaments';

export default function CoupleSection({ data }) {
  return (
    <section id="couple" className="section section-light couple-luxury-section">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Mempelai Yang Berbahagia</p>
          <h2 className="section-title">Calon Pengantin</h2>
          <BotanicalDivider />
        </div>

        <div className="couple-container">
          
          {/* Mempelai Pria */}
          <div className="couple-card reveal reveal-left">
            <CornerFiligree position="top-left" />
            <CornerFiligree position="bottom-right" />

            <div className="couple-photo-frame double-gold-ring">
              <div className="ring-glow-effect"></div>
              <img 
                src="assets/images/foto laki laki sendiri.jpeg" 
                alt={data.groomFullName} 
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
              <h3 className="couple-name script-text">{data.groomFullName}</h3>
              <p className="couple-title">Putra Tercinta</p>
              <div className="couple-detail">
                <p>Putra dari:</p>
                <p className="parent-name">{data.groomParents || 'Bapak ... & Ibu ...'}</p>
              </div>
            </div>
          </div>

          {/* Interlocking Gold Wedding Rings in the Center */}
          <div className="couple-divider reveal">
            <div className="wedding-rings-wrapper">
              <WeddingRings size={52} />
              <span className="rings-heart-glow">❤</span>
            </div>
          </div>

          {/* Mempelai Wanita */}
          <div className="couple-card reveal reveal-right">
            <CornerFiligree position="top-right" />
            <CornerFiligree position="bottom-left" />

            <div className="couple-photo-frame double-gold-ring">
              <div className="ring-glow-effect"></div>
              <img 
                src="assets/images/foto perempuan sendiri.jpeg" 
                alt={data.brideFullName} 
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
              <h3 className="couple-name script-text">{data.brideFullName}</h3>
              <p className="couple-title">Putri Tercinta</p>
              <div className="couple-detail">
                <p>Putri dari:</p>
                <p className="parent-name">{data.brideParents || 'Bapak ... & Ibu ...'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

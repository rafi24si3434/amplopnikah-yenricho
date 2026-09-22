import React from 'react';
import { Church, PartyPopper, Navigation } from 'lucide-react';

export default function LocationSection() {
  return (
    <section id="location" className="section section-dark">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Petunjuk Arah</p>
          <h2 className="section-title">Lokasi Acara</h2>
          <div className="ornament-line"></div>
        </div>

        <div className="location-container">
          
          {/* Pemberkatan */}
          <div className="location-card glass-card reveal reveal-left">
            <h3 className="location-title">
              <Church size={22} />
              Pemberkatan Nikah
            </h3>
            <p className="location-name">Gereja HKBP Dame Ressort Dame Duri</p>
            <p className="location-address">Jl. Perdamaian No. 37, Duri</p>
            <div className="map-wrapper">
              <iframe
                title="Pemberkatan Nikah Map"
                src="https://maps.google.com/maps?q=Gereja+HKBP+Dame+Ressort+Dame+Duri+Jl+Perdamaian+No+37&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a 
              href="https://maps.google.com/?q=Gereja+HKBP+Dame+Ressort+Dame+Duri+Jl+Perdamaian+No+37"
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-direction"
            >
              <Navigation size={16} />
              Petunjuk Arah
            </a>
          </div>

          {/* Resepsi */}
          <div className="location-card glass-card reveal reveal-right">
            <h3 className="location-title">
              <PartyPopper size={22} />
              Resepsi Pernikahan
            </h3>
            <p className="location-name">Sopo Margurosi</p>
            <p className="location-address">Jalan Sejahtera, Duri</p>
            <div className="map-wrapper">
              <iframe
                title="Resepsi Map"
                src="https://maps.google.com/maps?q=Sopo+Margurosi+Jalan+Sejahtera+Duri&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a 
              href="https://maps.google.com/?q=Sopo+Margurosi+Jalan+Sejahtera+Duri" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-direction"
            >
              <Navigation size={16} />
              Petunjuk Arah
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

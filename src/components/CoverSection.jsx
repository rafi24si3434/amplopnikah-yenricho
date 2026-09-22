import React, { useEffect, useRef } from 'react';
import { MailOpen } from 'lucide-react';
import { MonogramCrest, WaxSeal, CornerFiligree } from './Ornaments';

export default function CoverSection({ data, onOpenInvitation, isOpen }) {
  const petalsRef = useRef(null);

  useEffect(() => {
    const container = petalsRef.current;
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#C9A96E', '#E8D5B7', '#B76E79', '#D4AF37', '#87A878'];
    for (let i = 0; i < 24; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (6 + Math.random() * 8) + 's';
      petal.style.animationDelay = (Math.random() * 10) + 's';
      const size = (8 + Math.random() * 10) + 'px';
      petal.style.width = size;
      petal.style.height = size;
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
      petal.style.opacity = '0';
      container.appendChild(petal);
    }
  }, []);

  if (isOpen) return null;

  const groomInit = (data.groomName || 'Y').charAt(0).toUpperCase();
  const brideInit = (data.brideName || 'V').charAt(0).toUpperCase();

  return (
    <section id="cover" className="cover-section">
      <div className="cover-overlay"></div>
      <div className="floating-petals" ref={petalsRef}></div>
      <div className="cover-content">
        
        {/* Royal Monogram Crest at the Top */}
        <div className="cover-monogram-top">
          <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={74} />
        </div>

        <p className="cover-subtitle">THE WEDDING OF</p>

        {/* Dynamic Couple Names */}
        <h1 className="cover-names">
          <span className="groom-name-cover">{data.groomName || 'Yenricho'}</span>
          <span className="ampersand">&</span>
          <span className="bride-name-cover">{data.brideName || 'Veni'}</span>
        </h1>

        <p className="cover-date">{data.weddingDateText || 'Sabtu, 03 Oktober 2026'}</p>

        {/* Dynamic Envelope Guest & Sender Box with Corner Filigree */}
        <div className="cover-envelope-card" id="guest-section">
          {/* 4 Corner Ornaments */}
          <CornerFiligree position="top-left" />
          <CornerFiligree position="top-right" />
          <CornerFiligree position="bottom-left" />
          <CornerFiligree position="bottom-right" />

          <div className="envelope-badge">
            <span className="envelope-tag">✦ AMPLOP UNDANGAN RESMI ✦</span>
          </div>

          <div className="cover-guest-row">
            <p className="guest-label">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h2 className="guest-name" id="guest-name">
              {data.recipientName || 'Bapak/Ibu/Saudara/i'}
            </h2>
            <p className="guest-place">Di Tempat</p>
          </div>

          {data.senderName && (
            <div className="cover-sender-row">
              <span className="sender-divider-dot">✦</span>
              <p className="sender-label">Dari / Pengirim:</p>
              <p className="sender-name">{data.senderName}</p>
            </div>
          )}
        </div>

        {/* Realistic 3D Royal Wax Seal & Open Button */}
        <div className="cover-open-action">
          <div className="wax-seal-container" onClick={onOpenInvitation} title="Klik Segel untuk Buka Undangan">
            <WaxSeal groomInit={groomInit} brideInit={brideInit} size={64} />
          </div>

          <button 
            className="btn-open" 
            id="btn-open-invitation"
            onClick={onOpenInvitation}
          >
            <MailOpen className="btn-icon" size={18} />
            <span>Buka Undangan</span>
          </button>
        </div>

        <p className="cover-hint-text">Sentuh segel atau tombol untuk membuka undangan</p>

      </div>
    </section>
  );
}

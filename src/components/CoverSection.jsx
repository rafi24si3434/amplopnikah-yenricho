import React, { useEffect, useRef } from 'react';
import { MailOpen } from 'lucide-react';
import { MonogramCrest, WaxSeal, CornerGorgaFiligree, UlosRibbonDivider } from './Ornaments';
import { triggerWaxSealStampRelease, initDaylightFloatingParticles } from '../utils/batakInteractions';

export default function CoverSection({ data, onOpenInvitation, isOpen }) {
  const petalsRef = useRef(null);
  const sealRef = useRef(null);

  useEffect(() => {
    const container = petalsRef.current;
    if (!container) return;
    const cleanup = initDaylightFloatingParticles(container, 30);
    return cleanup;
  }, []);

  if (isOpen) return null;

  const groomInit = (data.groomName || 'Y').charAt(0).toUpperCase();
  const brideInit = (data.brideName || 'V').charAt(0).toUpperCase();

  const handleSealClick = () => {
    triggerWaxSealStampRelease(sealRef.current, onOpenInvitation);
  };

  // Extract recipient name directly from URL (?to=... or ?kepada=... or ?nama=... or hash) with highest priority
  const getRecipientDisplayName = () => {
    if (typeof window !== 'undefined') {
      try {
        let params = new URLSearchParams(window.location.search);
        let guest = params.get('to') || params.get('kepada') || params.get('nama') || params.get('guest') || params.get('name');
        if (!guest && window.location.hash) {
          const qIdx = window.location.hash.indexOf('?');
          if (qIdx !== -1) {
            params = new URLSearchParams(window.location.hash.slice(qIdx));
            guest = params.get('to') || params.get('kepada') || params.get('nama') || params.get('guest') || params.get('name');
          }
        }
        if (guest && guest.trim()) {
          return decodeURIComponent(guest.trim().replace(/\+/g, ' '));
        }
      } catch (e) {}
    }
    return data.recipientName || 'Bapak/Ibu/Saudara/i';
  };

  const recipientDisplayName = getRecipientDisplayName();

  return (
    <section id="cover" className="cover-section">
      <div className="cover-overlay"></div>
      <div className="floating-petals" ref={petalsRef}></div>
      <div className="cover-content">
        
        {/* Royal Batak Monogram Crest at the Top */}
        <div className="cover-monogram-top">
          <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={78} />
        </div>

        <p className="cover-subtitle">THE WEDDING OF</p>

        {/* Dynamic Couple Names */}
        <h1 className="cover-names">
          <span className="groom-name-cover">{data.groomName || 'Yenricho'}</span>
          <span className="ampersand">&</span>
          <span className="bride-name-cover">{data.brideName || 'Veni'}</span>
        </h1>

        <p className="cover-date">{data.weddingDateText || 'Sabtu, 03 Oktober 2026'}</p>

        {/* Traditional Batak Ulos Weave Divider */}
        <UlosRibbonDivider />

        {/* Dynamic Envelope Guest & Sender Box with Corner Gorga Filigrees */}
        <div className="cover-envelope-card" id="guest-section">
          {/* 4 Authentic Batak Gorga Corner Ornaments */}
          <CornerGorgaFiligree position="top-left" />
          <CornerGorgaFiligree position="top-right" />
          <CornerGorgaFiligree position="bottom-left" />
          <CornerGorgaFiligree position="bottom-right" />

          <div className="cover-guest-row">
            <p className="guest-label">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h2 className="guest-name" id="guest-name">
              {recipientDisplayName}
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

        {/* Realistic 3D Royal Wax Seal & Open Action with Shockwave Release */}
        <div className="cover-open-action">
          <div 
            ref={sealRef} 
            className="wax-seal-container" 
            onClick={handleSealClick} 
            title="Tekan Segel Lilin untuk Membuka Undangan"
          >
            <WaxSeal groomInit={groomInit} brideInit={brideInit} size={68} />
          </div>

          <button 
            className="btn-open" 
            id="btn-open-invitation"
            onClick={handleSealClick}
          >
            <MailOpen className="btn-icon" size={18} />
            <span>Buka Undangan</span>
          </button>
        </div>

        <p className="cover-hint-text">Sentuh segel lilin atau tombol untuk membuka undangan</p>

      </div>
    </section>
  );
}

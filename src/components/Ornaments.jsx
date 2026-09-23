import React from 'react';

/**
 * Authentic Batak Ulos Tapestry Ribbon Divider
 * Faithfully inspired by traditional Batak Ulos Ragi Hotang / Sadum weaving:
 * - Gold metallic thread stitch bars (sirat / jugia)
 * - Crimson red (rara) and white cross-stitches (X) and inverted triangles (mata ni ari)
 * - Deep midnight ground with fringe tassels at the ends
 */
export function UlosRibbonDivider({ className = '' }) {
  return (
    <div className={`ulos-ribbon-divider-container ${className}`}>
      <div className="ulos-ribbon-wrapper">
        <svg viewBox="0 0 600 32" className="ulos-ribbon-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ulosGoldThread" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.4" />
              <stop offset="15%" stopColor="#ECC880" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFF3D4" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#ECC880" />
              <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="ulosRedThread" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B91C1C" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>

            <pattern id="ulosCheckered" width="16" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="4" fill="#B91C1C" />
              <rect x="8" width="8" height="4" fill="#C9A96E" />
              <rect y="4" width="8" height="4" fill="#FFFFFF" opacity="0.85" />
              <rect x="8" y="4" width="8" height="4" fill="#1C1917" />
            </pattern>
          </defs>

          {/* Deep Navy/Black Base Ground */}
          <rect x="40" y="4" width="520" height="24" rx="3" fill="#1A1816" stroke="url(#ulosGoldThread)" strokeWidth="1" />

          {/* Top Gold Stitch Line */}
          <line x1="50" y1="8" x2="550" y2="8" stroke="url(#ulosGoldThread)" strokeWidth="1.2" strokeDasharray="4 2" />

          {/* Red and Gold Center Weave with Cross-Stitch 'X' and Triangles */}
          <rect x="50" y="11" width="500" height="10" fill="url(#ulosCheckered)" opacity="0.35" />

          {/* Center Batak Motifs (Repeating across the ribbon) */}
          <g fill="none" strokeWidth="1.5">
            {/* Repeating traditional Batak motifs */}
            {[80, 140, 200, 260, 320, 380, 440, 500].map((cx, idx) => (
              <g key={idx} transform={`translate(${cx}, 16)`}>
                {idx % 2 === 0 ? (
                  /* Red Cross Stitch 'X' */
                  <g stroke="#EF4444">
                    <line x1="-5" y1="-4" x2="5" y2="4" strokeLinecap="round" />
                    <line x1="5" y1="-4" x2="-5" y2="4" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="1.5" fill="#FFF3D4" stroke="none" />
                  </g>
                ) : (
                  /* White / Gold Diamond Motif (Mata ni Ari) */
                  <g stroke="url(#ulosGoldThread)">
                    <polygon points="0,-4 4,0 0,4 -4,0" fill="#B91C1C" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" stroke="none" />
                  </g>
                )}
              </g>
            ))}
          </g>

          {/* Bottom Gold Stitch Line */}
          <line x1="50" y1="24" x2="550" y2="24" stroke="url(#ulosGoldThread)" strokeWidth="1.2" strokeDasharray="4 2" />

          {/* Left Fringe Tassels (Rambu Ulos) */}
          <g stroke="url(#ulosGoldThread)" strokeWidth="1.2" opacity="0.85">
            <line x1="40" y1="6" x2="15" y2="3" />
            <line x1="40" y1="10" x2="10" y2="9" />
            <line x1="40" y1="16" x2="6" y2="16" />
            <line x1="40" y1="22" x2="10" y2="23" />
            <line x1="40" y1="26" x2="15" y2="29" />
          </g>

          {/* Right Fringe Tassels (Rambu Ulos) */}
          <g stroke="url(#ulosGoldThread)" strokeWidth="1.2" opacity="0.85">
            <line x1="560" y1="6" x2="585" y2="3" />
            <line x1="560" y1="10" x2="590" y2="9" />
            <line x1="560" y1="16" x2="594" y2="16" />
            <line x1="560" y1="22" x2="590" y2="23" />
            <line x1="560" y1="26" x2="585" y2="29" />
          </g>
        </svg>

        {/* Dynamic JS Shimmer Beam Element */}
        <div className="ulos-shimmer-beam"></div>
      </div>
    </div>
  );
}

/**
 * Authentic Batak Gorga Curved Flourish (Gorga Simeol-meol)
 * Used as header embellishments and card emblems.
 */
export function GorgaBatakOrnament({ size = 54, className = '' }) {
  return (
    <div className={`gorga-batak-flourish ${className}`} style={{ width: size * 2.4, height: size }}>
      <svg viewBox="0 0 130 54" className="gorga-svg">
        <defs>
          <linearGradient id="gorgaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D4" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8A6324" />
          </linearGradient>
        </defs>

        {/* Center Gorga Lotus Core */}
        <polygon points="65,10 71,24 65,38 59,24" fill="#B91C1C" stroke="url(#gorgaGold)" strokeWidth="1.2" />
        <circle cx="65" cy="24" r="3" fill="#FFF3D4" />

        {/* Left Gorga Spiral (Simeol-meol) */}
        <path 
          d="M60,24 C50,14 36,12 24,18 C14,24 10,36 18,44 C24,50 36,48 40,40 C44,32 38,24 30,26 C26,28 26,34 30,34" 
          fill="none" 
          stroke="url(#gorgaGold)" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
        <path d="M42,20 Q48,16 54,20" stroke="#B91C1C" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="24" r="2" fill="#D4AF37" />

        {/* Right Gorga Spiral (Simeol-meol - Mirrored) */}
        <path 
          d="M70,24 C80,14 94,12 106,18 C116,24 120,36 112,44 C106,50 94,48 90,40 C86,32 92,24 100,26 C104,28 104,34 100,34" 
          fill="none" 
          stroke="url(#gorgaGold)" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
        <path d="M88,20 Q82,16 76,20" stroke="#B91C1C" strokeWidth="1.5" fill="none" />
        <circle cx="112" cy="24" r="2" fill="#D4AF37" />

        {/* Top & Bottom Petal Tips */}
        <polygon points="65,2 68,8 62,8" fill="url(#gorgaGold)" />
        <polygon points="65,46 68,40 62,40" fill="url(#gorgaGold)" />
      </svg>
    </div>
  );
}

/**
 * Batak Gorga Corner Filigree for Cards, Photos, and Envelopes
 */
export function CornerGorgaFiligree({ position = 'top-left' }) {
  return (
    <div className={`corner-filigree corner-gorga ${position}`}>
      <svg viewBox="0 0 64 64" className="corner-gorga-svg">
        <defs>
          <linearGradient id="cornerGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D4" />
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8A6324" />
          </linearGradient>
        </defs>

        {/* Outer L-Frame with Gorga Curve */}
        <path d="M4,4 L42,4 C30,8 24,16 24,28 C24,40 16,46 4,48 Z" fill="rgba(185, 28, 28, 0.08)" stroke="url(#cornerGold)" strokeWidth="1.5" />
        <path d="M4,4 L4,42 C8,30 16,24 28,24 C40,24 46,16 48,4 Z" fill="none" stroke="url(#cornerGold)" strokeWidth="1.5" />
        
        {/* Batak Red Diamond Accent */}
        <polygon points="12,12 16,8 20,12 16,16" fill="#B91C1C" stroke="url(#cornerGold)" strokeWidth="0.8" />
        <circle cx="16" cy="12" r="1.5" fill="#FFF3D4" />
        
        {/* Subtle Gorga Spiral */}
        <path d="M12,24 C16,20 22,20 24,24 C26,28 22,32 18,30" fill="none" stroke="url(#cornerGold)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Batak Royal Monogram Crest (Combining Batak Laurel, Crown & Intertwined Initials)
 */
export function MonogramCrest({ groomInit = 'Y', brideInit = 'V', size = 84, className = '' }) {
  return (
    <div className={`monogram-crest-wrapper batak-royal-crest ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="monogram-svg">
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D4" />
            <stop offset="35%" stopColor="#ECC880" />
            <stop offset="70%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8A6324" />
          </linearGradient>
          <filter id="crestGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#C9A96E" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Circular Laurel with Batak Dash Pattern */}
        <circle cx="50" cy="50" r="45" stroke="url(#crestGold)" strokeWidth="1.2" fill="none" opacity="0.5" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="41" stroke="#B91C1C" strokeWidth="0.8" fill="none" opacity="0.6" />
        
        {/* Laurel / Gorga Leaves (Left) */}
        <path d="M50,9 C42,12 36,18 31,25 C26,32 23,41 23,50 C23,59 26,68 31,75 C36,82 42,88 50,91" stroke="url(#crestGold)" strokeWidth="1.5" fill="none" />
        <path d="M44,14 Q40,11 38,15 Q41,19 44,14 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M37,23 Q32,21 31,26 Q35,29 37,23 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M31,34 Q26,33 26,38 Q30,40 31,34 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M28,47 Q23,48 24,53 Q28,54 28,47 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M29,61 Q25,63 27,68 Q31,67 29,61 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M34,73 Q31,77 34,81 Q38,79 34,73 Z" fill="url(#crestGold)" opacity="0.9" />

        {/* Laurel / Gorga Leaves (Right) */}
        <path d="M50,9 C58,12 64,18 69,25 C74,32 77,41 77,50 C77,59 74,68 69,75 C64,82 58,88 50,91" stroke="url(#crestGold)" strokeWidth="1.5" fill="none" />
        <path d="M56,14 Q60,11 62,15 Q59,19 56,14 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M63,23 Q68,21 69,26 Q65,29 63,23 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M69,34 Q74,33 74,38 Q70,40 69,34 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M72,47 Q77,48 76,53 Q72,54 72,47 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M71,61 Q75,63 73,68 Q69,67 71,61 Z" fill="url(#crestGold)" opacity="0.9" />
        <path d="M66,73 Q69,77 66,81 Q62,79 66,73 Z" fill="url(#crestGold)" opacity="0.9" />

        {/* Crown at Top with Batak Red Gem */}
        <polygon points="50,4 53,8 57,9 54,12 55,16 50,14 45,16 46,12 43,9 47,8" fill="url(#crestGold)" />
        <circle cx="50" cy="11" r="1.5" fill="#B91C1C" />

        {/* Intertwined Initials */}
        <text x="44" y="55" fontFamily="'Great Vibes', cursive" fontSize="29" fill="url(#crestGold)" textAnchor="middle" filter="url(#crestGlow)">
          {groomInit}
        </text>
        <text x="50" y="55" fontFamily="'Playfair Display', serif" fontSize="12" fill="#B91C1C" textAnchor="middle" fontStyle="italic" fontWeight="bold">
          &
        </text>
        <text x="58" y="62" fontFamily="'Great Vibes', cursive" fontSize="29" fill="url(#crestGold)" textAnchor="middle" filter="url(#crestGlow)">
          {brideInit}
        </text>
      </svg>
    </div>
  );
}

/**
 * Royal Gold Wax Seal with Embossed Gorga Batak Rim
 */
export function WaxSeal({ groomInit = 'Y', brideInit = 'V', size = 68, onClick }) {
  return (
    <div className="royal-wax-seal" style={{ width: size, height: size }} onClick={onClick}>
      <div className="wax-seal-inner">
        <svg viewBox="0 0 100 100" className="wax-seal-svg">
          <defs>
            <radialGradient id="waxGoldGrad" cx="38%" cy="36%" r="62%">
              <stop offset="0%" stopColor="#FFF3D4" />
              <stop offset="30%" stopColor="#E2BD75" />
              <stop offset="65%" stopColor="#A88B4A" />
              <stop offset="100%" stopColor="#5C4215" />
            </radialGradient>
            <linearGradient id="innerSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A96E" />
              <stop offset="50%" stopColor="#F9E8B2" />
              <stop offset="100%" stopColor="#8A6A2C" />
            </linearGradient>
          </defs>

          {/* Irregular Wax Edge */}
          <path d="M50,3 C65,2 78,8 88,18 C98,28 100,42 97,56 C94,70 87,83 75,91 C63,99 48,100 35,97 C22,94 11,85 5,73 C-1,61 -1,46 4,33 C9,20 20,9 33,5 C38,3 44,4 50,3 Z" fill="url(#waxGoldGrad)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.35))" />

          {/* Pressed Inner Rim with Batak Stitch Ring */}
          <circle cx="50" cy="50" r="34" fill="url(#innerSealGrad)" stroke="#FFF3D4" strokeWidth="1.2" opacity="0.95" />
          <circle cx="50" cy="50" r="31" fill="none" stroke="#5A4112" strokeWidth="0.9" opacity="0.7" strokeDasharray="2.5 1.5" />

          {/* Monogram inside Seal */}
          <text x="44" y="54" fontFamily="'Great Vibes', cursive" fontSize="24" fill="#3D2B0F" textAnchor="middle">
            {groomInit}
          </text>
          <text x="50" y="53" fontFamily="'Playfair Display', serif" fontSize="9" fill="#B91C1C" textAnchor="middle" fontWeight="bold">
            &
          </text>
          <text x="56" y="60" fontFamily="'Great Vibes', cursive" fontSize="24" fill="#3D2B0F" textAnchor="middle">
            {brideInit}
          </text>
        </svg>
      </div>
      <div className="wax-seal-shine"></div>
    </div>
  );
}

/**
 * Botanical Divider (Alias to UlosRibbonDivider for backward compatibility)
 */
export function BotanicalDivider({ className = '' }) {
  return <UlosRibbonDivider className={className} />;
}

/**
 * CornerFiligree (Alias to CornerGorgaFiligree for backward compatibility)
 */
export function CornerFiligree({ position = 'top-left' }) {
  return <CornerGorgaFiligree position={position} />;
}

/**
 * Delicate Wedding Ring Interlocking Icon
 */
export function WeddingRings({ size = 44 }) {
  return (
    <div className="wedding-rings-icon" style={{ width: size, height: size * 0.7 }}>
      <svg viewBox="0 0 64 44" className="wedding-rings-svg">
        <defs>
          <linearGradient id="ringGold1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D4" />
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8A6324" />
          </linearGradient>
          <linearGradient id="ringGold2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D4" />
            <stop offset="50%" stopColor="#E2BD75" />
            <stop offset="100%" stopColor="#7A5A1E" />
          </linearGradient>
        </defs>
        {/* Ring 1 */}
        <ellipse cx="23" cy="22" rx="16" ry="16" stroke="url(#ringGold1)" strokeWidth="3" fill="none" />
        {/* Ring 2 (Interlocking) */}
        <ellipse cx="41" cy="22" rx="16" ry="16" stroke="url(#ringGold2)" strokeWidth="3" fill="none" />
        {/* Diamond on Ring 1 */}
        <polygon points="23,4 27,8 25,12 21,12 19,8" fill="#FFFFFF" stroke="#C9A96E" strokeWidth="0.8" />
        <circle cx="23" cy="8" r="1.5" fill="#FFF3D4" />
      </svg>
    </div>
  );
}

/**
 * Ulos Card Header Strip Accent
 */
export function UlosCardAccent() {
  return (
    <div className="ulos-card-accent-strip">
      <div className="ulos-stripe-gold"></div>
      <div className="ulos-stripe-red"></div>
      <div className="ulos-stripe-gold"></div>
    </div>
  );
}

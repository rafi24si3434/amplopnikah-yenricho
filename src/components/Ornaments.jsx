import React from 'react';

/**
 * Royal Golden Laurel Monogram Crest with Intertwined Initials
 */
export function MonogramCrest({ groomInit = 'Y', brideInit = 'V', size = 80 }) {
  return (
    <div className="monogram-crest-wrapper" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="monogram-svg">
        {/* Outer Circular Laurel Wreath */}
        <circle cx="50" cy="50" r="44" stroke="#C9A96E" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="41" stroke="#E8D5B7" strokeWidth="0.8" fill="none" opacity="0.6" />
        
        {/* Laurel Leaves (Left) */}
        <path d="M50,9 C42,12 36,18 31,25 C26,32 23,41 23,50 C23,59 26,68 31,75 C36,82 42,88 50,91" stroke="#C9A96E" strokeWidth="1.2" fill="none" />
        <path d="M44,14 Q40,11 38,15 Q41,19 44,14 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M37,23 Q32,21 31,26 Q35,29 37,23 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M31,34 Q26,33 26,38 Q30,40 31,34 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M28,47 Q23,48 24,53 Q28,54 28,47 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M29,61 Q25,63 27,68 Q31,67 29,61 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M34,73 Q31,77 34,81 Q38,79 34,73 Z" fill="#C9A96E" opacity="0.8" />

        {/* Laurel Leaves (Right) */}
        <path d="M50,9 C58,12 64,18 69,25 C74,32 77,41 77,50 C77,59 74,68 69,75 C64,82 58,88 50,91" stroke="#C9A96E" strokeWidth="1.2" fill="none" />
        <path d="M56,14 Q60,11 62,15 Q59,19 56,14 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M63,23 Q68,21 69,26 Q65,29 63,23 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M69,34 Q74,33 74,38 Q70,40 69,34 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M72,47 Q77,48 76,53 Q72,54 72,47 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M71,61 Q75,63 73,68 Q69,67 71,61 Z" fill="#C9A96E" opacity="0.8" />
        <path d="M66,73 Q69,77 66,81 Q62,79 66,73 Z" fill="#C9A96E" opacity="0.8" />

        {/* Crown / Sparkle at Top */}
        <polygon points="50,4 52,8 56,9 53,12 54,16 50,14 46,16 47,12 44,9 48,8" fill="#D4AF37" />

        {/* Intertwined Initials */}
        <text x="44" y="55" fontFamily="'Great Vibes', cursive" fontSize="28" fill="#E8D5B7" textAnchor="middle">
          {groomInit}
        </text>
        <text x="50" y="55" fontFamily="'Playfair Display', serif" fontSize="12" fill="#C9A96E" textAnchor="middle" fontStyle="italic">
          &
        </text>
        <text x="58" y="62" fontFamily="'Great Vibes', cursive" fontSize="28" fill="#D4AF37" textAnchor="middle">
          {brideInit}
        </text>
      </svg>
    </div>
  );
}

/**
 * Royal Gold Wax Seal with Embossed Monogram
 */
export function WaxSeal({ groomInit = 'Y', brideInit = 'V', size = 68, onClick }) {
  return (
    <div className="royal-wax-seal" style={{ width: size, height: size }} onClick={onClick}>
      <div className="wax-seal-inner">
        <svg viewBox="0 0 100 100" className="wax-seal-svg">
          {/* Irregular Wax Edge */}
          <path d="M50,3 C65,2 78,8 88,18 C98,28 100,42 97,56 C94,70 87,83 75,91 C63,99 48,100 35,97 C22,94 11,85 5,73 C-1,61 -1,46 4,33 C9,20 20,9 33,5 C38,3 44,4 50,3 Z" fill="url(#waxGoldGrad)" />
          
          <defs>
            <radialGradient id="waxGoldGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#F9E8B2" />
              <stop offset="35%" stopColor="#C9A96E" />
              <stop offset="75%" stopColor="#8A6A2C" />
              <stop offset="100%" stopColor="#4A3814" />
            </radialGradient>
            <linearGradient id="innerSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A88B4A" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#73561A" />
            </linearGradient>
          </defs>

          {/* Pressed Inner Rim */}
          <circle cx="50" cy="50" r="34" fill="url(#innerSealGrad)" stroke="#E8D5B7" strokeWidth="1.2" opacity="0.9" />
          <circle cx="50" cy="50" r="31" fill="none" stroke="#5A4112" strokeWidth="0.8" opacity="0.6" strokeDasharray="2 1.5" />

          {/* Monogram inside Seal */}
          <text x="44" y="54" fontFamily="'Great Vibes', cursive" fontSize="24" fill="#FFF2CE" textAnchor="middle" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.6))">
            {groomInit}
          </text>
          <text x="50" y="53" fontFamily="'Playfair Display', serif" fontSize="9" fill="#F4E3B7" textAnchor="middle">
            &
          </text>
          <text x="56" y="60" fontFamily="'Great Vibes', cursive" fontSize="24" fill="#FFF2CE" textAnchor="middle" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.6))">
            {brideInit}
          </text>
        </svg>
      </div>
      <div className="wax-seal-shine"></div>
    </div>
  );
}

/**
 * Botanical Corner Flourish
 */
export function CornerFiligree({ position = 'top-left' }) {
  return (
    <div className={`corner-filigree ${position}`}>
      <svg viewBox="0 0 60 60" className="corner-filigree-svg">
        <path d="M4,4 L30,4 C22,7 18,12 18,20 C18,28 12,32 4,34 Z" fill="none" stroke="#C9A96E" strokeWidth="1.2" />
        <path d="M4,4 L4,30 C7,22 12,18 20,18 C28,18 32,12 34,4 Z" fill="none" stroke="#C9A96E" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill="#D4AF37" />
        <path d="M12,12 Q18,8 24,12 Q18,18 12,12 Z" fill="#C9A96E" opacity="0.6" />
      </svg>
    </div>
  );
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
            <stop offset="0%" stopColor="#F9E8B2" />
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8A6A2C" />
          </linearGradient>
          <linearGradient id="ringGold2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9E8B2" />
            <stop offset="50%" stopColor="#E0BD74" />
            <stop offset="100%" stopColor="#7A5A1E" />
          </linearGradient>
        </defs>
        {/* Ring 1 */}
        <ellipse cx="23" cy="22" rx="16" ry="16" stroke="url(#ringGold1)" strokeWidth="3" fill="none" />
        {/* Ring 2 (Interlocking) */}
        <ellipse cx="41" cy="22" rx="16" ry="16" stroke="url(#ringGold2)" strokeWidth="3" fill="none" />
        {/* Diamond on Ring 1 */}
        <polygon points="23,4 27,8 25,12 21,12 19,8" fill="#E8F4F8" stroke="#90CAF9" strokeWidth="0.8" />
        <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * Botanical Divider Filigree with Diamonds
 */
export function BotanicalDivider() {
  return (
    <div className="botanical-divider">
      <svg viewBox="0 0 300 24" className="botanical-svg">
        <line x1="0" y1="12" x2="100" y2="12" stroke="url(#lineGradLeft)" strokeWidth="1" />
        <defs>
          <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="lineGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Leaves & Diamond Center */}
        <path d="M110,12 Q120,6 128,12 Q120,18 110,12 Z" fill="#C9A96E" opacity="0.85" />
        <circle cx="138" cy="12" r="2.5" fill="#E8D5B7" />
        <polygon points="150,5 156,12 150,19 144,12" fill="#D4AF37" />
        <circle cx="162" cy="12" r="2.5" fill="#E8D5B7" />
        <path d="M190,12 Q180,6 172,12 Q180,18 190,12 Z" fill="#C9A96E" opacity="0.85" />
        
        <line x1="200" y1="12" x2="300" y2="12" stroke="url(#lineGradRight)" strokeWidth="1" />
      </svg>
    </div>
  );
}

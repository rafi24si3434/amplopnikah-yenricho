import React from 'react';
import { BotanicalDivider } from './Ornaments';

export default function PhotoQuoteBanner({ bgImage, quote, subtext, reference, ornament = true }) {
  return (
    <div 
      className="photo-quote-banner section-photo-bg"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="section-photo-overlay banner-overlay"></div>
      
      <div className="banner-content reveal">
        {ornament && <div className="banner-ornament-top">✦ ✦ ✦</div>}
        
        <p className="banner-quote-text">
          "{quote}"
        </p>
        
        {subtext && (
          <p className="banner-subtext">
            {subtext}
          </p>
        )}
        
        {reference && (
          <p className="banner-reference">
            — {reference} —
          </p>
        )}

        {ornament && <BotanicalDivider />}
      </div>
    </div>
  );
}

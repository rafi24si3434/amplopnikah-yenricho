import React from 'react';
import { UlosRibbonDivider, GorgaBatakOrnament } from './Ornaments';

export default function PhotoQuoteBanner({ bgImage, quote, subtext, reference, ornament = true }) {
  return (
    <div 
      className="photo-quote-banner section-photo-bg"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="section-photo-overlay banner-overlay"></div>
      
      <div className="banner-content reveal">
        {ornament && <GorgaBatakOrnament size={36} />}
        
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

        {ornament && <UlosRibbonDivider />}
      </div>
    </div>
  );
}

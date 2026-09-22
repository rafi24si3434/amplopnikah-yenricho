import React from 'react';
import { MonogramCrest, BotanicalDivider } from './Ornaments';
import { Lock } from 'lucide-react';

export default function FooterSection({ data, onEnterAdmin }) {
  const groomInit = (data.groomName || 'Y').charAt(0).toUpperCase();
  const brideInit = (data.brideName || 'V').charAt(0).toUpperCase();

  return (
    <footer id="footer" className="section-footer">
      <div className="footer-content reveal">
        
        <div className="footer-monogram-top">
          <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={70} />
        </div>

        <BotanicalDivider />

        <p className="footer-thanks">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
        </p>

        <h2 className="footer-names script-text">
          {data.groomName || 'Yenricho'} & {data.brideName || 'Veni'}
        </h2>

        <p className="footer-hashtag">#{data.groomName || 'Yenricho'}{data.brideName || 'Veni'}Wedding</p>

        <BotanicalDivider />

        <p className="footer-copyright">
          © 2026 {data.groomName || 'Yenricho'} & {data.brideName || 'Veni'} Wedding. All Rights Reserved.
        </p>

        {onEnterAdmin && (
          <div className="footer-admin-trigger">
            <button 
              type="button"
              className="btn-footer-admin" 
              onClick={onEnterAdmin}
              title="Akses Halaman Pengelola Undangan & Amplop"
            >
              <Lock size={11} />
              <span>Kelola Undangan</span>
            </button>
          </div>
        )}

      </div>
    </footer>
  );
}

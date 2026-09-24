import React from 'react';
import { MonogramCrest, UlosRibbonDivider, GorgaBatakOrnament } from './Ornaments';
import { Lock } from 'lucide-react';

export default function FooterSection({ data, onEnterAdmin }) {
  const groomInit = (data.groomName || 'Y').charAt(0).toUpperCase();
  const brideInit = (data.brideName || 'V').charAt(0).toUpperCase();

  return (
    <footer id="footer" className="section-footer">
      <div className="footer-editorial-container reveal">
        
        {/* Double-Bezel Editorial Portrait Frame: 100% Crystal Clear, Zero Text Obstruction */}
        <div className="footer-portrait-shell">
          <div className="footer-portrait-core">
            <img
              src="/assets/images/2.jpeg"
              alt={`${data.groomName || 'Yenricho'} & ${data.brideName || 'Veni'} - Horas & Mauliate`}
              className="footer-portrait-img"
              loading="lazy"
            />
            <div className="footer-portrait-badge">
              <span>HORAS &amp; MAULIATE</span>
            </div>
          </div>
        </div>

        {/* Double-Bezel Luxury Closing Card */}
        <div className="footer-closing-shell">
          <div className="footer-closing-core">
            <div className="footer-monogram-top">
              <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={70} />
            </div>

            <GorgaBatakOrnament size={36} />
            <UlosRibbonDivider />

            <p className="footer-thanks">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
            </p>

            <h2 className="footer-names script-text">
              {data.groomName || 'Yenricho'} &amp; {data.brideName || 'Veni'}
            </h2>

            <p className="footer-hashtag">
              #{data.groomName || 'Yenricho'}{data.brideName || 'Veni'}Wedding
            </p>

            <UlosRibbonDivider />

            <p className="footer-copyright">
              © 2026 {data.groomName || 'Yenricho'} &amp; {data.brideName || 'Veni'} Wedding. All Rights Reserved.
            </p>

            <p className="footer-creator-credit">
              Web ini buatan <span className="creator-name">DAYENN</span>
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
        </div>

      </div>
    </footer>
  );
}


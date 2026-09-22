import React, { useState } from 'react';
import { Gift, CreditCard, Copy, Check, MapPin, Phone, MessageSquare, HeartHandshake, Wifi, Sparkles } from 'lucide-react';

export default function DigitalEnvelopeSection({ bankAccounts, giftAddress }) {
  const [copiedAccount, setCopiedAccount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' or 'gift'

  const handleCopyAccount = (number, key) => {
    const rawNum = number.replace(/\s+/g, '');
    navigator.clipboard.writeText(rawNum);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(''), 2500);
  };

  const handleCopyAddress = () => {
    const fullText = `${giftAddress.recipient} (${giftAddress.phone})\n${giftAddress.street}\n${giftAddress.subdistrict}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // SVGs for Official Bank Logos
  const renderBankLogo = (code) => {
    if (code === 'BRI') {
      return (
        <div className="bank-official-logo bri">
          <svg viewBox="0 0 160 48" className="bank-svg-logo">
            {/* BRI Emblem */}
            <rect x="2" y="4" width="40" height="40" rx="10" fill="#00529C" />
            <path d="M12,14 L22,14 C26,14 28,16 28,19 C28,21 27,22 25,23 C28,24 29,26 29,29 C29,32 26,34 22,34 L12,34 Z M17,18 L17,22 L22,22 C23.5,22 24.5,21.5 24.5,20 C24.5,18.5 23.5,18 22,18 Z M17,26 L17,30 L22.5,30 C24,30 25,29.5 25,28 C25,26.5 24,26 22.5,26 Z" fill="#FFFFFF" />
            <path d="M30,36 C35,32 38,26 38,18" stroke="#F37021" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Text BANK BRI */}
            <text x="50" y="31" fill="#FFFFFF" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="22" letterSpacing="1">
              BRI
            </text>
          </svg>
        </div>
      );
    }

    if (code === 'MANDIRI') {
      return (
        <div className="bank-official-logo mandiri">
          <svg viewBox="0 0 170 48" className="bank-svg-logo">
            {/* Mandiri Yellow Ribbon */}
            <path d="M130,12 C145,8 158,15 162,26 C155,20 142,16 130,22 Z" fill="#F8A51D" />
            <path d="M136,20 C148,15 160,22 165,34 C157,28 145,24 136,28 Z" fill="#003D79" />
            {/* Text mandiri */}
            <text x="6" y="32" fill="#FFFFFF" fontFamily="'Montserrat', sans-serif" fontWeight="800" fontSize="23" letterSpacing="-0.5">
              mandiri
            </text>
          </svg>
        </div>
      );
    }

    if (code === 'BRK') {
      return (
        <div className="bank-official-logo brk">
          <svg viewBox="0 0 180 48" className="bank-svg-logo">
            {/* Islamic 8-pointed star / crescent emblem */}
            <circle cx="22" cy="24" r="16" fill="#0D5C3A" />
            <polygon points="22,12 25,18 31,16 28,22 34,24 28,26 31,32 25,30 22,36 19,30 13,32 16,26 10,24 16,22 13,16 19,18" fill="#C9A96E" />
            <circle cx="22" cy="24" r="5" fill="#0D5C3A" />
            {/* Text BRK Syariah */}
            <text x="46" y="24" fill="#FFFFFF" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="16" letterSpacing="0.5">
              BRK
            </text>
            <text x="46" y="37" fill="#C9A96E" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="11" letterSpacing="1.5">
              SYARIAH
            </text>
          </svg>
        </div>
      );
    }

    return <span className="bank-name-fallback">{code}</span>;
  };

  return (
    <section id="envelope-section" className="section section-dark">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Tanda Kasih & Doa Restu</p>
          <h2 className="section-title">Amplop Digital</h2>
          <div className="ornament-line"></div>
          <p className="envelope-intro-text">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, Anda dapat mengirimkannya melalui:
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="envelope-mode-tabs reveal">
          <button 
            className={`envelope-mode-btn ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <CreditCard size={18} />
            <span>Transfer Bank / Rekening ({bankAccounts.length})</span>
          </button>
          <button 
            className={`envelope-mode-btn ${activeTab === 'gift' ? 'active' : ''}`}
            onClick={() => setActiveTab('gift')}
          >
            <Gift size={18} />
            <span>Kirim Kado Fisik</span>
          </button>
        </div>

        {/* TAB 1: LUXURY BANK ATM/DEBIT CARDS */}
        {activeTab === 'bank' && (
          <div className="bank-cards-grid reveal">
            {bankAccounts.map((acc, index) => {
              const isCopied = copiedAccount === `acc-${index}`;
              const bankTheme = acc.code.toLowerCase(); // 'brk', 'bri', 'mandiri'

              return (
                <div key={index} className={`luxury-atm-card card-theme-${bankTheme}`}>
                  {/* Holographic background sheen */}
                  <div className="atm-card-sheen"></div>
                  
                  {/* Top Bar: Bank Logo & Contactless */}
                  <div className="atm-card-top">
                    {renderBankLogo(acc.code)}
                    <div className="atm-contactless">
                      <Wifi size={20} className="wifi-icon" />
                    </div>
                  </div>

                  {/* EMV Smart Chip */}
                  <div className="atm-chip-row">
                    <div className="atm-chip">
                      <div className="chip-line horizontal"></div>
                      <div className="chip-line vertical"></div>
                    </div>
                    <span className="atm-debit-label">DEBIT CARD</span>
                  </div>

                  {/* Embossed Card Number */}
                  <div className="atm-number-box">
                    <span className="atm-card-number">{acc.number}</span>
                  </div>

                  {/* Bottom: Cardholder Name & Instant Copy Action */}
                  <div className="atm-card-bottom">
                    <div className="atm-holder-info">
                      <span className="atm-holder-label">ATAS NAMA / CARDHOLDER</span>
                      <h4 className="atm-holder-name">{acc.holder}</h4>
                    </div>

                    <button 
                      className={`btn-atm-copy ${isCopied ? 'copied' : ''}`}
                      onClick={() => handleCopyAccount(acc.number, `acc-${index}`)}
                      title="Salin Nomor Rekening"
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} className="copy-check-icon" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PHYSICAL GIFT ADDRESS */}
        {activeTab === 'gift' && (
          <div className="gift-address-container reveal">
            <div className="gift-address-card glass-card">
              <div className="gift-card-icon">
                <Gift size={44} />
              </div>
              <h3 className="gift-title">Alamat Pengiriman Kado</h3>
              
              <div className="gift-info-list">
                <div className="gift-info-item">
                  <MapPin size={20} className="gift-pin-icon" />
                  <div>
                    <strong>Alamat Lengkap:</strong>
                    <p>{giftAddress.street}</p>
                    <p>{giftAddress.subdistrict}</p>
                  </div>
                </div>

                <div className="gift-info-item">
                  <Phone size={20} className="gift-pin-icon" />
                  <div>
                    <strong>Penerima:</strong>
                    <p>{giftAddress.recipient} ({giftAddress.phone})</p>
                  </div>
                </div>
              </div>

              <div className="gift-buttons-row">
                <button 
                  className={`btn-copy-address ${copiedAddress ? 'copied' : ''}`}
                  onClick={handleCopyAddress}
                >
                  {copiedAddress ? (
                    <>
                      <Check size={16} />
                      <span>Alamat Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Salin Alamat Lengkap</span>
                    </>
                  )}
                </button>

                <a 
                  href={`https://wa.me/62${giftAddress.phone.replace(/^0/, '')}?text=Halo%20Yenricho%20%26%20Veni,%20saya%20ingin%20mengirimkan%20kado%20pernikahan...`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-wa-confirm"
                >
                  <MessageSquare size={16} />
                  <span>Konfirmasi via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Thank You Footer Note */}
        <div className="envelope-thanks-note reveal">
          <HeartHandshake className="thanks-icon" size={32} />
          <p>Terima kasih atas segala doa, kasih, dan ketulusan hati yang telah Anda berikan kepada kami berdua.</p>
        </div>

      </div>
    </section>
  );
}

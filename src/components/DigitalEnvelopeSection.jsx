import React, { useState, useEffect } from 'react';
import { 
  Gift, CreditCard, Copy, Check, MapPin, Phone, MessageSquare, 
  HeartHandshake, Wifi, Truck, Package, Send, CheckCircle2, 
  ExternalLink, ChevronDown, Sparkles, Navigation
} from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';
import { fetchGiftConfirmationsFromSupabase, insertGiftConfirmationToSupabase } from '../utils/supabaseClient';

export default function DigitalEnvelopeSection({ bankAccounts, giftAddress, defaultGuestName }) {
  const [copiedAccount, setCopiedAccount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' or 'gift'

  // Gift Confirmation Form State
  const [senderName, setSenderName] = useState(defaultGuestName || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [courier, setCourier] = useState('J&T Express');
  const [customCourier, setCustomCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [giftItem, setGiftItem] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  // Past confirmations history
  const [savedConfirmations, setSavedConfirmations] = useState([]);

  useEffect(() => {
    if (defaultGuestName && !senderName) {
      setSenderName(defaultGuestName);
    }
  }, [defaultGuestName]);

  useEffect(() => {
    // 1. Initial load from local storage
    try {
      const saved = JSON.parse(localStorage.getItem('wedding_gift_confirmations') || '[]');
      setSavedConfirmations(saved);
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from Supabase Cloud
    let isMounted = true;
    async function loadCloudGifts() {
      const remote = await fetchGiftConfirmationsFromSupabase();
      if (isMounted && remote && remote.length > 0) {
        setSavedConfirmations(remote);
        try {
          localStorage.setItem('wedding_gift_confirmations', JSON.stringify(remote));
        } catch (e) {}
      }
    }
    loadCloudGifts();

    return () => {
      isMounted = false;
    };
  }, [isSubmitted]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkHashOrQuery = () => {
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (hash.includes('kado') || hash.includes('gift') || search.includes('kado') || search.includes('gift')) {
          setActiveTab('gift');
        }
      };
      checkHashOrQuery();
      window.addEventListener('hashchange', checkHashOrQuery);
      return () => window.removeEventListener('hashchange', checkHashOrQuery);
    }
  }, []);

  const recipient = giftAddress?.recipient || 'Yenricho & Veni';
  const phone = giftAddress?.phone || '085363578319';
  const street = giftAddress?.street || 'Jl. Diponegoro gang sentul ujung, (rumah pagar steinless putih)';
  const subdistrict = giftAddress?.subdistrict || 'Kelurahan Rimba Sekampung, Kecamatan Dumai Kota, Kota Dumai, Riau';
  const postalCode = giftAddress?.postalCode || '28811';
  const landmark = giftAddress?.landmark || 'Rumah pagar steinless putih';

  const handleCopyAccount = (number, key) => {
    const rawNum = number.replace(/\s+/g, '');
    navigator.clipboard.writeText(rawNum);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(''), 2500);
  };

  const handleCopyAddress = () => {
    const formattedAddress = `Penerima: ${recipient} (${phone})
Alamat: ${street}
Kelurahan / Kecamatan: ${subdistrict}
Kode Pos / ID: ${postalCode}
Patokan: ${landmark}`;

    navigator.clipboard.writeText(formattedAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const saveToLocalStorage = async (newEntry) => {
    try {
      const existing = JSON.parse(localStorage.getItem('wedding_gift_confirmations') || '[]');
      const updated = [newEntry, ...existing];
      localStorage.setItem('wedding_gift_confirmations', JSON.stringify(updated));
      setSavedConfirmations(updated);
      window.dispatchEvent(new CustomEvent('gift-confirmation-updated', { detail: updated }));
    } catch (e) {
      console.error(e);
    }

    // Save to Supabase Cloud asynchronously (no login needed)
    try {
      const savedCloud = await insertGiftConfirmationToSupabase(newEntry);
      if (savedCloud && savedCloud.id) {
        // Update local entry with real Supabase UUID for synced deletion
        const existing = JSON.parse(localStorage.getItem('wedding_gift_confirmations') || '[]');
        const updatedWithUuid = existing.map(item => item.id === newEntry.id ? { ...item, id: savedCloud.id } : item);
        localStorage.setItem('wedding_gift_confirmations', JSON.stringify(updatedWithUuid));
        setSavedConfirmations(updatedWithUuid);
        window.dispatchEvent(new CustomEvent('gift-confirmation-updated', { detail: updatedWithUuid }));
      }
    } catch (err) {
      console.error('[Gift] Error saving to Supabase:', err);
    }
  };

  const handleConfirmViaWa = (e) => {
    if (e) e.preventDefault();
    if (!senderName.trim()) {
      alert('Mohon masukkan nama Anda sebagai pengirim kado.');
      return;
    }

    const selectedCourier = courier === 'Lainnya' ? (customCourier.trim() || 'Lainnya') : courier;
    const cleanPhone = phone.replace(/^0/, '62').replace(/\D/g, '');

    const waText = `Halo ${recipient},

Saya ingin mengonfirmasi pengiriman tanda kasih / kado pernikahan:

📦 *Nama Pengirim:* ${senderName.trim()}
📱 *No. HP Pengirim:* ${senderPhone.trim() || '-'}
🎁 *Detail/Nama Kado:* ${giftItem.trim() || 'Tanda Kasih Pernikahan'}
🚚 *Ekspedisi/Kurir:* ${selectedCourier}
🔢 *Nomor Resi:* ${trackingNumber.trim() || 'Belum ada / Antar langsung'}

💌 *Pesan & Doa:*
"${giftMessage.trim() || 'Selamat menempuh hidup baru berdua, kiranya selalu rukun dan penuh berkat!'}"

📍 *Alamat Tujuan Pengiriman:*
${street}, ${subdistrict} (ID: ${postalCode})

Semoga kado diterima dengan selamat dan bermanfaat bagi kedua mempelai. Horas & Sukacita selalu! 🙏💒`;

    const entry = {
      id: Date.now(),
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      courier: selectedCourier,
      trackingNumber: trackingNumber.trim(),
      giftItem: giftItem.trim() || 'Tanda Kasih Pernikahan',
      giftMessage: giftMessage.trim(),
      timestamp: new Date().toISOString(),
      channel: 'WhatsApp'
    };

    saveToLocalStorage(entry);
    setLastSubmittedData(entry);
    setIsSubmitted(true);

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const handleConfirmViaWeb = (e) => {
    if (e) e.preventDefault();
    if (!senderName.trim()) {
      alert('Mohon masukkan nama Anda sebagai pengirim kado.');
      return;
    }

    const selectedCourier = courier === 'Lainnya' ? (customCourier.trim() || 'Lainnya') : courier;
    const entry = {
      id: Date.now(),
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      courier: selectedCourier,
      trackingNumber: trackingNumber.trim(),
      giftItem: giftItem.trim() || 'Tanda Kasih Pernikahan',
      giftMessage: giftMessage.trim(),
      timestamp: new Date().toISOString(),
      channel: 'Web'
    };

    saveToLocalStorage(entry);
    setLastSubmittedData(entry);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setGiftItem('');
    setTrackingNumber('');
    setGiftMessage('');
  };

  // SVGs for Official Bank Logos
  const renderBankLogo = (code) => {
    if (code === 'BRI') {
      return (
        <div className="bank-official-logo bri">
          <svg viewBox="0 0 160 48" className="bank-svg-logo">
            <rect x="2" y="4" width="40" height="40" rx="10" fill="#00529C" />
            <path d="M12,14 L22,14 C26,14 28,16 28,19 C28,21 27,22 25,23 C28,24 29,26 29,29 C29,32 26,34 22,34 L12,34 Z M17,18 L17,22 L22,22 C23.5,22 24.5,21.5 24.5,20 C24.5,18.5 23.5,18 22,18 Z M17,26 L17,30 L22.5,30 C24,30 25,29.5 25,28 C25,26.5 24,26 22.5,26 Z" fill="#FFFFFF" />
            <path d="M30,36 C35,32 38,26 38,18" stroke="#F37021" strokeWidth="3.5" strokeLinecap="round" fill="none" />
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
            <path d="M130,12 C145,8 158,15 162,26 C155,20 142,16 130,22 Z" fill="#F8A51D" />
            <path d="M136,20 C148,15 160,22 165,34 C157,28 145,24 136,28 Z" fill="#003D79" />
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
            <circle cx="22" cy="24" r="16" fill="#0D5C3A" />
            <polygon points="22,12 25,18 31,16 28,22 34,24 28,26 31,32 25,30 22,36 19,30 13,32 16,26 10,24 16,22 13,16 19,18" fill="#C9A96E" />
            <circle cx="22" cy="24" r="5" fill="#0D5C3A" />
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

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Jl. Diponegoro gang sentul Rimba Sekampung Dumai Kota Riau')}`;

  return (
    <section 
      id="envelope-section" 
      className="section section-dark section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/5.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">WEDDING GIFT</p>
          <h2 className="section-title">Tanda Kasih & Amplop Digital</h2>
          <GorgaBatakOrnament size={44} />
          <UlosRibbonDivider />
          <p className="envelope-intro-text">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih pernikahan, Anda dapat mengirimkannya melalui transfer rekening maupun pengiriman kado fisik:
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
            <span>Kirim Kado & Konfirmasi</span>
          </button>
        </div>

        {/* TAB 1: LUXURY BANK ATM/DEBIT CARDS */}
        <div className={`envelope-tab-pane ${activeTab === 'bank' ? 'active' : 'hidden'}`}>
          <div className="bank-cards-grid">
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

          {/* Callout to open Gift Address & Confirmation */}
          <div className="gift-cta-banner" onClick={() => setActiveTab('gift')}>
            <div className="gift-cta-icon-wrap">
              <Gift size={24} />
            </div>
            <div className="gift-cta-text">
              <h4 className="gift-cta-title">Bermaksud Mengirimkan Kado Fisik?</h4>
              <p className="gift-cta-sub">
                Klik di sini untuk melihat alamat lengkap Dumai & mengisi formulir konfirmasi kado pernikahan.
              </p>
            </div>
            <button 
              type="button" 
              className="btn-royal-gift btn-copy gift-cta-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('gift');
              }}
            >
              <span>Buka Alamat & Konfirmasi Kado →</span>
            </button>
          </div>
        </div>

        {/* TAB 2: PHYSICAL GIFT ADDRESS & CONFIRMATION LOGIC */}
        <div className={`envelope-tab-pane ${activeTab === 'gift' ? 'active' : 'hidden'}`}>
          <div className="gift-feature-container">
            
            {/* 1. Alamat Pengiriman Kado Card */}
            <div className="gift-address-card glass-card">
              <CornerGorgaFiligree position="top-left" />
              <CornerGorgaFiligree position="top-right" />

              <div className="gift-badge-royal">
                <Gift size={16} />
                <span>ALAMAT RESMI PENGIRIMAN KADO</span>
              </div>

              <h3 className="gift-card-main-title">Penerima: {recipient}</h3>
              <p className="gift-card-subtitle">
                Silakan gunakan alamat berikut untuk pengiriman paket kado pernikahan melalui kurir, ekspedisi, e-commerce, maupun antar langsung:
              </p>
              
              <div className="gift-details-box">
                <div className="gift-detail-row">
                  <div className="gift-detail-icon-wrap">
                    <MapPin size={20} className="gift-detail-icon" />
                  </div>
                  <div className="gift-detail-content">
                    <span className="gift-detail-label">Alamat Lengkap</span>
                    <strong className="gift-detail-value main-address">{street}</strong>
                    <p className="gift-detail-sub">{subdistrict}</p>
                    <div className="gift-tag-badges">
                      <span className="gift-tag-badge postal">Kode Pos / ID: <strong>{postalCode}</strong></span>
                      <span className="gift-tag-badge landmark">Patokan: <strong>{landmark}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="gift-detail-row">
                  <div className="gift-detail-icon-wrap">
                    <Phone size={20} className="gift-detail-icon" />
                  </div>
                  <div className="gift-detail-content">
                    <span className="gift-detail-label">No. Telepon / WhatsApp Penerima</span>
                    <strong className="gift-detail-value phone-number">{phone}</strong>
                    <span className="gift-detail-sub">(Aktif untuk koordinasi kurir pengiriman)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Address */}
              <div className="gift-address-actions">
                <button 
                  className={`btn-royal-gift btn-copy ${copiedAddress ? 'copied' : ''}`}
                  onClick={handleCopyAddress}
                  title="Salin rincian alamat lengkap ke clipboard"
                >
                  {copiedAddress ? (
                    <>
                      <Check size={17} />
                      <span>Alamat Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={17} />
                      <span>Salin Alamat Lengkap</span>
                    </>
                  )}
                </button>

                <a 
                  href={googleMapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-royal-gift btn-map"
                  title="Buka titik wilayah di Google Maps"
                >
                  <Navigation size={17} />
                  <span>Buka Google Maps</span>
                </a>
              </div>
            </div>

            {/* 2. Formulir & Logika Konfirmasi Pengiriman Kado */}
            <div className="gift-confirmation-card glass-card" id="form-konfirmasi-kado">
              <CornerGorgaFiligree position="bottom-left" />
              <CornerGorgaFiligree position="bottom-right" />

              <div className="gift-confirm-header">
                <div className="gift-confirm-icon-wrap">
                  <Package size={26} />
                </div>
                <div>
                  <h3 className="gift-confirm-title">Konfirmasi Pengiriman Kado</h3>
                  <p className="gift-confirm-desc">
                    Sudah atau berencana mengirimkan kado? Beri tahu kedua mempelai agar paket Anda dapat disambut dengan penuh sukacita dan dipantau kedatangannya.
                  </p>
                </div>
              </div>

              {isSubmitted ? (
                /* Sukses Konfirmasi */
                <div className="gift-success-view">
                  <div className="gift-success-icon-bubble">
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 className="gift-success-title">Konfirmasi Kado Berhasil Dicatat!</h4>
                  <p className="gift-success-desc">
                    Terima kasih banyak <strong>{lastSubmittedData?.senderName}</strong> atas perhatian dan tanda kasih terindah untuk <strong>{recipient}</strong>.
                  </p>

                  <div className="gift-success-summary-box">
                    <div className="summary-row">
                      <span>Detail Kado:</span>
                      <strong>{lastSubmittedData?.giftItem || 'Tanda Kasih'}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Ekspedisi / Kurir:</span>
                      <strong>{lastSubmittedData?.courier}</strong>
                    </div>
                    {lastSubmittedData?.trackingNumber && (
                      <div className="summary-row">
                        <span>Nomor Resi:</span>
                        <code>{lastSubmittedData?.trackingNumber}</code>
                      </div>
                    )}
                    {lastSubmittedData?.giftMessage && (
                      <div className="summary-quote">
                        "{lastSubmittedData?.giftMessage}"
                      </div>
                    )}
                  </div>

                  <div className="gift-success-actions">
                    <button 
                      className="btn-royal-gift btn-secondary-outline"
                      onClick={handleResetForm}
                    >
                      <Gift size={16} />
                      <span>Kirim Konfirmasi Lainnya</span>
                    </button>
                    
                    <a 
                      href={`https://wa.me/62${phone.replace(/^0/, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-royal-gift btn-wa"
                    >
                      <MessageSquare size={16} />
                      <span>Chat Mempelai di WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Formulir Input Konfirmasi */
                <form className="gift-confirm-form" onSubmit={handleConfirmViaWa}>
                  
                  <div className="form-grid-2">
                    <div className="form-group-gift">
                      <label htmlFor="gift-sender-name">Nama Pengirim / Keluarga <span className="req">*</span></label>
                      <input 
                        id="gift-sender-name"
                        type="text" 
                        required
                        placeholder="Contoh: Veni & Partner / Keluarga Sitanggang"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="gift-input"
                      />
                    </div>

                    <div className="form-group-gift">
                      <label htmlFor="gift-sender-phone">No. WhatsApp Pengirim (Opsional)</label>
                      <input 
                        id="gift-sender-phone"
                        type="tel" 
                        placeholder="Contoh: 081234567890"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="gift-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group-gift">
                      <label htmlFor="gift-courier">Ekspedisi / Kurir Pengiriman</label>
                      <div className="select-wrapper">
                        <select 
                          id="gift-courier"
                          value={courier} 
                          onChange={(e) => setCourier(e.target.value)}
                          className="gift-input gift-select"
                        >
                          <option value="J&T Express">J&T Express</option>
                          <option value="JNE Express">JNE Express</option>
                          <option value="SiCepat Express">SiCepat Express</option>
                          <option value="Shopee Express (SPX)">Shopee Express (SPX)</option>
                          <option value="Anteraja">Anteraja</option>
                          <option value="Ninja Xpress">Ninja Xpress</option>
                          <option value="GoSend / GrabExpress">GoSend / GrabExpress</option>
                          <option value="Antar Langsung Sendiri">Antar Langsung / Pribadi</option>
                          <option value="Lainnya">Kurir / Ekspedisi Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-gift">
                      <label htmlFor="gift-tracking">Nomor Resi / Pelacakan (Opsional)</label>
                      <input 
                        id="gift-tracking"
                        type="text" 
                        placeholder="Contoh: JT1234567890 / SPXID0987654"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="gift-input"
                      />
                    </div>
                  </div>

                  {courier === 'Lainnya' && (
                    <div className="form-group-gift">
                      <label htmlFor="custom-courier">Sebutkan Nama Ekspedisi / Metode Lainnya</label>
                      <input 
                        id="custom-courier"
                        type="text" 
                        placeholder="Contoh: Wahana / Pos Indonesia / Titip Saudara"
                        value={customCourier}
                        onChange={(e) => setCustomCourier(e.target.value)}
                        className="gift-input"
                      />
                    </div>
                  )}

                  <div className="form-group-gift">
                    <label htmlFor="gift-item-desc">Nama / Jenis Kado (Opsional)</label>
                    <input 
                      id="gift-item-desc"
                      type="text" 
                      placeholder="Contoh: Set Peralatan Dapur / Sprei Mewah / Kenang-kenangan"
                      value={giftItem}
                      onChange={(e) => setGiftItem(e.target.value)}
                      className="gift-input"
                    />
                  </div>

                  <div className="form-group-gift">
                    <label htmlFor="gift-msg">Pesan & Doa untuk Mempelai (Opsional)</label>
                    <textarea 
                      id="gift-msg"
                      rows={3}
                      placeholder="Tuliskan ucapan atau pesan khusus yang menyertai kado Anda..."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="gift-input gift-textarea"
                    ></textarea>
                  </div>

                  {/* Dual Action Confirmation Buttons */}
                  <div className="gift-form-actions">
                    <button 
                      type="button"
                      onClick={handleConfirmViaWa}
                      className="btn-royal-gift btn-wa-submit"
                      title="Kirim konfirmasi langsung ke WhatsApp kedua mempelai"
                    >
                      <MessageSquare size={18} />
                      <span>Konfirmasi via WhatsApp</span>
                    </button>

                    <button 
                      type="button"
                      onClick={handleConfirmViaWeb}
                      className="btn-royal-gift btn-web-submit"
                      title="Simpan konfirmasi kado langsung di dalam sistem website"
                    >
                      <Send size={18} />
                      <span>Simpan di Website</span>
                    </button>
                  </div>
                  
                  <p className="gift-privacy-hint">
                    🔒 Data konfirmasi hanya digunakan untuk mempermudah pengecekan dan penyambutan paket oleh kedua mempelai.
                  </p>
                </form>
              )}

              {/* Riwayat Konfirmasi Sebelumnya di Perangkat Ini */}
              {savedConfirmations.length > 0 && (
                <div className="gift-history-drawer">
                  <div className="gift-history-header">
                    <Truck size={16} />
                    <span>Daftar Kado yang Pernah Anda Konfirmasikan ({savedConfirmations.length})</span>
                  </div>
                  <div className="gift-history-list">
                    {savedConfirmations.slice(0, 3).map((item) => (
                      <div key={item.id} className="gift-history-item">
                        <div className="gift-history-main">
                          <strong>{item.giftItem || 'Tanda Kasih'}</strong>
                          <span className="gift-history-meta">
                            Oleh: {item.senderName} • {item.courier} {item.trackingNumber ? `(Resi: ${item.trackingNumber})` : ''}
                          </span>
                        </div>
                        <span className="gift-history-badge">Tercatat</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Thank You Footer Note */}
        <div className="envelope-thanks-note reveal">
          <HeartHandshake className="thanks-icon" size={32} />
          <p>Terima kasih atas segala doa, kasih, dan ketulusan hati yang telah Anda berikan kepada kami berdua.</p>
        </div>

      </div>
    </section>
  );
}

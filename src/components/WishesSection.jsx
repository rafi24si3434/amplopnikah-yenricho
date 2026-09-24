import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Send, Sparkles, Heart, CheckCircle2, Clock } from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';
import { supabase, fetchWishesFromSupabase, insertWishToSupabase } from '../utils/supabaseClient';

export default function WishesSection({ defaultName }) {
  const [name, setName] = useState(defaultName || '');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    if (defaultName && (!name || name === 'Bapak/Ibu/Saudara/i')) {
      setName(defaultName);
    }
  }, [defaultName]);

  const quickWishes = [
    {
      label: "Doa Adat Batak (Horas & Gabe)",
      text: "Sai gabe ma jala horas, pir tondi madingin, tondi matogu! Selamat berbahagia Yenricho & Veni! 🌾💒"
    },
    {
      label: "Berkat Rumah Tangga Baru",
      text: "Tuhan memberkati rumah tangga baru kalian dengan limpahan kasih, sukacita, dan damai sejahtera. 🙏✨"
    },
    {
      label: "Langgeng & Bahagia Selalu",
      text: "Selamat menempuh hidup baru Yenricho & Veni! Semoga langgeng, rukun, dan bahagia sampai kakek nenek. 💍❤️"
    },
    {
      label: "Horas & Mauliate",
      text: "Horas & Mauliate! Selamat berbahagia untuk kedua mempelai dan seluruh keluarga besar. 🥂✨"
    }
  ];

  useEffect(() => {
    // 1. Initial load from localStorage (instant UI)
    try {
      const saved = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
      if (saved.length > 0) {
        setWishes(saved);
      } else {
        const defaults = [
          {
            id: 'default-1',
            name: 'Maria Simanjuntak',
            message: 'Selamat menempuh hidup baru Yenricho & Veni! Tuhan memberkati pernikahan dan keluarga kalian senantiasa. Horas! 🙏❤️',
            time: new Date(Date.now() - 3600000 * 3).toISOString()
          },
          {
            id: 'default-2',
            name: 'Parulian Situmorang',
            message: 'Bahagia selalu Yenricho & Veni! Semoga menjadi keluarga yang rukun, penuh sukacita, dan diberkati Tuhan berlimpah-limpah. 💒✨',
            time: new Date(Date.now() - 3600000 * 8).toISOString()
          }
        ];
        localStorage.setItem('wedding_wishes', JSON.stringify(defaults));
        setWishes(defaults);
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from Supabase Cloud
    let isMounted = true;
    async function loadCloudWishes() {
      const remote = await fetchWishesFromSupabase();
      if (isMounted && remote && remote.length > 0) {
        setWishes(remote);
        try {
          localStorage.setItem('wedding_wishes', JSON.stringify(remote));
        } catch (e) {}
      }
    }
    loadCloudWishes();

    // 3. Realtime Listener from Supabase
    const channel = supabase
      .channel('public:wishes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
        if (!payload.new) return;
        const newEntry = {
          id: payload.new.id,
          name: payload.new.sender_name,
          message: payload.new.message,
          time: payload.new.created_at
        };
        setWishes((prev) => {
          if (prev.some((w) => w.id === newEntry.id)) return prev;
          const updated = [newEntry, ...prev];
          try {
            localStorage.setItem('wedding_wishes', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    const localEntry = {
      id: Date.now().toString(),
      name: trimmedName,
      message: trimmedMessage,
      time: new Date().toISOString()
    };

    const updated = [localEntry, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('wedding_wishes', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setMessage('');
    setJustSent(true);
    setTimeout(() => setJustSent(false), 4500);

    // Save to Supabase Cloud asynchronously (no login needed)
    insertWishToSupabase(trimmedName, trimmedMessage);
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section 
      id="wishes" 
      className="section section-wishes-luxury section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/24.jpeg')" }}
    >
      <div className="wishes-backdrop-overlay"></div>

      <div className="section-content">
        
        {/* High-Contrast Double-Bezel Editorial Header Plate */}
        <div className="wishes-header-shell reveal">
          <div className="wishes-header-plate">
            <div className="wishes-eyebrow-pill">
              <Sparkles size={13} />
              <span>DOA &amp; RESTU</span>
              <Sparkles size={13} />
            </div>
            <h2 className="wishes-main-title">Ucapan &amp; Doa Restu Tamu</h2>
            <p className="wishes-main-subtitle">
              Untaian doa dan restu tulus dari Bapak/Ibu/Saudara/i merupakan kado terindah
              bagi perjalanan awal rumah tangga kami.
            </p>
            <div className="wishes-header-ornament">
              <GorgaBatakOrnament size={38} />
              <UlosRibbonDivider />
            </div>
          </div>
        </div>

        <div className="wishes-container">
          
          {/* Left Column: High-Contrast Form Card */}
          <div className="wishes-form-wrapper reveal">
            <div className="wishes-card-shell">
              <div className="wishes-form-card">
                <CornerGorgaFiligree position="top-left" />
                <CornerGorgaFiligree position="bottom-right" />

                <div className="wishes-card-head">
                  <div className="wishes-card-icon">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="wishes-card-title">Tulis Ucapan &amp; Doa</h3>
                    <p className="wishes-card-desc">Pesan Anda akan tampil langsung di dinding doa</p>
                  </div>
                </div>

                {justSent && (
                  <div className="wish-sent-toast">
                    <CheckCircle2 size={18} />
                    <span>Terima kasih! Ucapan &amp; doa restu Anda telah terkirim.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} id="wishes-form">
                  
                  <div className="wishes-field-group">
                    <label htmlFor="wish-name" className="wishes-field-label">
                      Nama Lengkap / Keluarga
                    </label>
                    <div className="wishes-input-box">
                      <User size={18} className="wishes-input-icon" />
                      <input 
                        type="text" 
                        id="wish-name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Kel. Bpk. H. Simanjuntak" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Quick Wishes Templates */}
                  <div className="quick-wishes-section">
                    <span className="quick-wishes-label">
                      <Sparkles size={13} /> Pilihan Cepat Doa &amp; Ucapan (Klik untuk memilih):
                    </span>
                    <div className="quick-wishes-grid">
                      {quickWishes.map((preset, idx) => {
                        const isSelected = message === preset.text;
                        return (
                          <button 
                            key={idx} 
                            type="button" 
                            className={`wish-preset-chip ${isSelected ? 'active' : ''}`}
                            onClick={() => setMessage(preset.text)}
                          >
                            <span className="preset-chip-title">{preset.label}</span>
                            <span className="preset-chip-preview">“{preset.text.slice(0, 58)}...”</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="wishes-field-group">
                    <label htmlFor="wish-message" className="wishes-field-label">
                      Pesan &amp; Doa Restu Anda
                    </label>
                    <div className="wishes-input-box textarea-box">
                      <textarea 
                        id="wish-message" 
                        rows="4" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tuliskan harapan dan doa terbaik untuk Yenricho & Veni..." 
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="btn-wishes-submit" id="btn-submit-wish">
                    <Send size={17} />
                    <span>Kirim Doa &amp; Ucapan</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: High-Contrast Guest Wishes Feed */}
          <div className="wishes-list-wrapper reveal">
            <div className="wishes-feed-shell">
              <div className="wishes-feed-card">
                <div className="wishes-feed-header">
                  <div className="wishes-feed-header-left">
                    <span className="wishes-count-badge">{wishes.length}</span>
                    <div>
                      <h3 className="wishes-feed-title">Doa &amp; Ucapan Hangat</h3>
                      <p className="wishes-feed-subtitle">Terhubung secara langsung (Realtime)</p>
                    </div>
                  </div>
                  <span className="wishes-live-pill">
                    <span className="live-dot-pulse"></span>
                    LIVE
                  </span>
                </div>

                <div className="wishes-list" id="wishes-list">
                  {wishes.map((wish, index) => (
                    <div key={wish.id || index} className="wish-item-luxury">
                      <div className="wish-avatar-luxury">
                        {(wish.name || 'T').charAt(0).toUpperCase()}
                      </div>
                      <div className="wish-body-luxury">
                        <div className="wish-meta-row">
                          <div className="wish-author-group">
                            <h4 className="wish-author-name">{wish.name}</h4>
                            <span className="wish-verified-tag">
                              <Heart size={10} fill="currentColor" /> Tamu Undangan
                            </span>
                          </div>
                          <span className="wish-time-pill">
                            <Clock size={11} />
                            {getTimeAgo(wish.time)}
                          </span>
                        </div>
                        <p className="wish-message-text">“{wish.message}”</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}


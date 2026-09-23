import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Send, Sparkles } from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';
import { supabase, fetchWishesFromSupabase, insertWishToSupabase } from '../utils/supabaseClient';

export default function WishesSection({ defaultName }) {
  const [name, setName] = useState(defaultName || '');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);

  const quickWishes = [
    "Sai gabe ma jala horas, pir tondi madingin, tondi matogu! Selamat berbahagia Yenricho & Veni! 🌾💒",
    "Selamat berbahagia Yenricho & Veni! Langgeng sampai kakek nenek. 💍❤️",
    "Tuhan memberkati rumah tangga baru kalian dengan limpahan kasih dan damai sejahtera. 🙏✨",
    "Horas & Mauliate! Selamat menempuh hidup baru berdua. Pesta adat yang penuh sukacita!",
    "Doa terbaik untuk hari bahagia kalian berdua, rukun dan sejahtera selalu. 💒🕊️"
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

    // Save to Supabase Cloud asynchronously (no login needed)
    insertWishToSupabase(trimmedName, trimmedMessage);
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} hari yang lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section 
      id="wishes" 
      className="section section-dark section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/24.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">DOA & RESTU</p>
          <h2 className="section-title">Ucapan & Doa Restu Tamu</h2>
          <GorgaBatakOrnament size={44} />
          <UlosRibbonDivider />
        </div>

        <div className="wishes-container">
          
          {/* Form */}
          <div className="wishes-form-wrapper reveal">
            <div className="wishes-form glass-card">
              <CornerGorgaFiligree position="top-left" />
              <CornerGorgaFiligree position="bottom-right" />
              <form onSubmit={handleSubmit} id="wishes-form">
                
                <div className="form-group">
                  <label htmlFor="wish-name">Nama Anda</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input 
                      type="text" 
                      id="wish-name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda / Keluarga" 
                      required 
                    />
                  </div>
                </div>

                {/* Quick Wishes Bubbles */}
                <div className="quick-wishes-section">
                  <span className="quick-wishes-label">✨ Pilihan Balon Ucapan Cepat:</span>
                  <div className="quick-wishes-row">
                    {quickWishes.map((preset, idx) => (
                      <button 
                        key={idx} 
                        type="button" 
                        className="wish-bubble-btn"
                        onClick={() => setMessage(preset)}
                      >
                        {preset.slice(0, 36)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="wish-message">Pesan & Doa Restu</label>
                  <div className="input-wrapper textarea-wrapper">
                    <MessageCircle size={18} className="textarea-icon" />
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

                <button type="submit" className="btn-submit" id="btn-submit-wish">
                  <Send size={18} />
                  <span>Kirim Ucapan</span>
                </button>
              </form>
            </div>
          </div>

          {/* List of Wishes */}
          <div className="wishes-list-wrapper reveal">
            <div className="wishes-list-header">
              <h3>{wishes.length} Doa & Ucapan Hangat</h3>
            </div>
            <div className="wishes-list" id="wishes-list">
              {wishes.map((wish, index) => (
                <div key={index} className="wish-item glass-card">
                  <div className="wish-avatar">
                    {(wish.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="wish-content">
                    <div className="wish-author-row">
                      <h4 className="wish-author">{wish.name}</h4>
                      <span className="wish-time">{getTimeAgo(wish.time)}</span>
                    </div>
                    <p className="wish-text">{wish.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

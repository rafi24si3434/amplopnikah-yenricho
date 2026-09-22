import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Send } from 'lucide-react';

export default function WishesSection({ defaultName }) {
  const [name, setName] = useState(defaultName || '');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
      if (saved.length > 0) {
        setWishes(saved);
      } else {
        const defaults = [
          {
            name: 'Maria Simanjuntak',
            message: 'Selamat menempuh hidup baru Yenricho & Veni! Tuhan memberkati pernikahan dan keluarga kalian senantiasa. Horas! 🙏❤️',
            time: new Date(Date.now() - 3600000 * 3).toISOString()
          },
          {
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish = {
      name: name.trim(),
      message: message.trim(),
      time: new Date().toISOString()
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('wedding_wishes', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setMessage('');
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
    <section id="wishes" className="section section-dark">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Ucapan & Doa</p>
          <h2 className="section-title">Kirim Ucapan</h2>
          <div className="ornament-line"></div>
        </div>

        <div className="wishes-container">
          
          {/* Form */}
          <div className="wishes-form-wrapper reveal">
            <div className="wishes-form glass-card">
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
                      placeholder="Nama Anda" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="wish-message">Ucapan & Doa</label>
                  <div className="input-wrapper textarea-wrapper">
                    <MessageCircle size={18} />
                    <textarea 
                      id="wish-message" 
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tulis ucapan dan doa terbaik untuk kedua mempelai..."
                      required
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="btn-submit">
                  <Send size={18} />
                  <span>Kirim Ucapan</span>
                </button>

              </form>
            </div>
          </div>

          {/* List */}
          <div className="wishes-list-wrapper reveal">
            <div className="wishes-list" id="wishes-list">
              {wishes.map((wish, index) => {
                const initial = wish.name.charAt(0).toUpperCase();
                return (
                  <div key={index} className="wish-card">
                    <div className="wish-card-header">
                      <div className="wish-avatar">{initial}</div>
                      <div>
                        <div className="wish-author">{wish.name}</div>
                        <div className="wish-time">{getTimeAgo(wish.time)}</div>
                      </div>
                    </div>
                    <div className="wish-text">{wish.message}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

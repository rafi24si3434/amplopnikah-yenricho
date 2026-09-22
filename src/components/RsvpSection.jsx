import React, { useState } from 'react';
import { User, CheckCircle, XCircle, HelpCircle, Users, Send, HeartHandshake } from 'lucide-react';

export default function RsvpSection({ defaultName }) {
  const [name, setName] = useState(defaultName || '');
  const [attendance, setAttendance] = useState('hadir');
  const [guests, setGuests] = useState('2');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
      existing.push({
        name: name.trim(),
        attendance,
        guests,
        time: new Date().toISOString()
      });
      localStorage.setItem('wedding_rsvp', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="section section-light">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Konfirmasi</p>
          <h2 className="section-title">Konfirmasi Kehadiran</h2>
          <div className="ornament-line"></div>
        </div>

        <div className="rsvp-container reveal">
          <div className="rsvp-card glass-card-light">
            {!submitted ? (
              <form onSubmit={handleSubmit} id="rsvp-form">
                
                <div className="form-group">
                  <label htmlFor="rsvp-name">Nama Lengkap</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input 
                      type="text" 
                      id="rsvp-name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Konfirmasi Kehadiran</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="attendance" 
                        value="hadir" 
                        checked={attendance === 'hadir'}
                        onChange={(e) => setAttendance(e.target.value)}
                      />
                      <span className="radio-custom">
                        <CheckCircle size={16} />
                        Hadir
                      </span>
                    </label>

                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="attendance" 
                        value="tidak" 
                        checked={attendance === 'tidak'}
                        onChange={(e) => setAttendance(e.target.value)}
                      />
                      <span className="radio-custom">
                        <XCircle size={16} />
                        Tidak Hadir
                      </span>
                    </label>

                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="attendance" 
                        value="ragu" 
                        checked={attendance === 'ragu'}
                        onChange={(e) => setAttendance(e.target.value)}
                      />
                      <span className="radio-custom">
                        <HelpCircle size={16} />
                        Masih Ragu
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="rsvp-guests">Jumlah Tamu</label>
                  <div className="input-wrapper">
                    <Users size={18} />
                    <select 
                      id="rsvp-guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                      <option value="5">5 Orang</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-submit" id="btn-rsvp">
                  <Send size={18} />
                  <span>Kirim Konfirmasi</span>
                </button>

              </form>
            ) : (
              <div className="rsvp-success" id="rsvp-success">
                <div className="success-icon">
                  <HeartHandshake size={60} />
                </div>
                <h3>Terima Kasih!</h3>
                <p>Konfirmasi kehadiran Anda telah berhasil kami terima.</p>
                <button 
                  className="btn-calendar" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setSubmitted(false)}
                >
                  Ubah Konfirmasi
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

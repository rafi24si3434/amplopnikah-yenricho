import React, { useState } from 'react';
import { User, CheckCircle, XCircle, HelpCircle, Users, Send, HeartHandshake, Church, PartyPopper } from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';

export default function RsvpSection({ defaultName }) {
  const [name, setName] = useState(defaultName || '');
  const [attendance, setAttendance] = useState('hadir');
  const [eventChoice, setEventChoice] = useState('keduanya'); // 'pemberkatan', 'resepsi', 'keduanya'
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
        eventChoice,
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
    <section 
      id="rsvp" 
      className="section section-dark section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/21.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">RSVP & KEHADIRAN</p>
          <h2 className="section-title">Konfirmasi Kehadiran</h2>
          <GorgaBatakOrnament size={44} />
          <UlosRibbonDivider />
        </div>

        <div className="rsvp-container reveal">
          <div className="rsvp-card glass-card">
            <CornerGorgaFiligree position="top-left" />
            <CornerGorgaFiligree position="bottom-right" />
            {!submitted ? (
              <form onSubmit={handleSubmit} id="rsvp-form">
                
                <div className="form-group">
                  <label htmlFor="rsvp-name">Nama Lengkap Anda</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input 
                      type="text" 
                      id="rsvp-name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda / Keluarga" 
                      required 
                    />
                  </div>
                </div>

                {/* Status Kehadiran */}
                <div className="form-group">
                  <label>Status Konfirmasi Kehadiran</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        name="attendance" 
                        value="hadir" 
                        checked={attendance === 'hadir'}
                        onChange={(e) => setAttendance(e.target.value)}
                      />
                      <span className="radio-custom hadir">
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
                      <span className="radio-custom tidak">
                        <XCircle size={16} />
                        Berhalangan
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
                      <span className="radio-custom ragu">
                        <HelpCircle size={16} />
                        Masih Ragu
                      </span>
                    </label>
                  </div>
                </div>

                {attendance === 'hadir' && (
                  <>
                    {/* Pilih Acara yang Dihadiri */}
                    <div className="form-group">
                      <label>Acara yang Dihadiri</label>
                      <div className="radio-group">
                        <label className="radio-option">
                          <input 
                            type="radio" 
                            name="eventChoice" 
                            value="pemberkatan" 
                            checked={eventChoice === 'pemberkatan'}
                            onChange={(e) => setEventChoice(e.target.value)}
                          />
                          <span className="radio-custom">
                            <Church size={15} />
                            Pemberkatan
                          </span>
                        </label>

                        <label className="radio-option">
                          <input 
                            type="radio" 
                            name="eventChoice" 
                            value="resepsi" 
                            checked={eventChoice === 'resepsi'}
                            onChange={(e) => setEventChoice(e.target.value)}
                          />
                          <span className="radio-custom">
                            <PartyPopper size={15} />
                            Resepsi Adat
                          </span>
                        </label>

                        <label className="radio-option">
                          <input 
                            type="radio" 
                            name="eventChoice" 
                            value="keduanya" 
                            checked={eventChoice === 'keduanya'}
                            onChange={(e) => setEventChoice(e.target.value)}
                          />
                          <span className="radio-custom">
                            <CheckCircle size={15} />
                            Keduanya
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Jumlah Tamu (Pax) */}
                    <div className="form-group">
                      <label htmlFor="rsvp-guests">Jumlah Tamu yang Hadir (Pax)</label>
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
                          <option value="5">5 Orang (Keluarga)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="btn-submit" id="btn-submit-rsvp">
                  <Send size={18} />
                  <span>Kirim Konfirmasi Kehadiran</span>
                </button>
              </form>
            ) : (
              <div className="rsvp-success" id="rsvp-success">
                <div className="success-icon">
                  <HeartHandshake size={48} />
                </div>
                <h3>Terima Kasih, {name}!</h3>
                <p>Konfirmasi kehadiran Anda telah berhasil kami terima. Sukacita yang besar bagi kami atas kehadiran dan doa restu Anda.</p>
                <button 
                  className="btn-rsvp-again"
                  onClick={() => setSubmitted(false)}
                >
                  Kirim Konfirmasi Lain
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

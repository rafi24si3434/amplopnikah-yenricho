import React, { useState, useEffect } from 'react';
import { Church, PartyPopper, CalendarDays, Clock, MapPin, Navigation, Map, CalendarPlus } from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';

export default function EventSection({ data }) {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const weddingDate = new Date(data.weddingDate || '2026-10-03T10:00:00+07:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = weddingDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data.weddingDate]);

  const makeGoogleCalendarUrl = (title, details, location, startDateIso, endDateIso) => {
    const dates = `${startDateIso}/${endDateIso}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${dates}`;
  };

  return (
    <section 
      id="event" 
      className="section section-dark section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/9.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">WEDDING EVENT</p>
          <h2 className="section-title">Waktu & Tempat Acara</h2>
          <GorgaBatakOrnament size={46} />
          <UlosRibbonDivider />
        </div>

        <div className="events-container">
          
          {/* Pemberkatan */}
          <div className="event-card glass-card reveal reveal-left">
            <CornerGorgaFiligree position="top-left" />
            <CornerGorgaFiligree position="bottom-right" />
            <div className="event-icon">
              <Church size={44} />
            </div>
            <h3 className="event-title">{data.pemberkatan.title}</h3>
            
            <div className="event-details">
              <div className="event-detail-item">
                <CalendarDays size={18} />
                <span>{data.pemberkatan.date}</span>
              </div>
              <div className="event-detail-item">
                <Clock size={18} />
                <span>{data.pemberkatan.time}</span>
              </div>
              <div className="event-detail-item">
                <MapPin size={18} />
                <span>{data.pemberkatan.venue}</span>
              </div>
              <div className="event-detail-item address">
                <Navigation size={18} />
                <span>{data.pemberkatan.address}</span>
              </div>
            </div>

            {/* REAL GOOGLE MAPS EMBED */}
            <div className="card-map-wrapper">
              <iframe
                title="Peta Lokasi Pemberkatan Nikah"
                src="https://maps.google.com/maps?q=Gereja+HKBP+Dame+Ressort+Dame+Duri+Jl+Perdamaian+No+37&t=&z=16&ie=UTF8&iwloc=&output=embed"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="event-map-iframe"
              ></iframe>
            </div>

            <div className="event-action-buttons">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Gereja+HKBP+Dame+Ressort+Dame+Duri" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-maps primary"
              >
                <Map size={16} />
                <span>Buka Google Maps</span>
              </a>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Gereja+HKBP+Dame+Ressort+Dame+Duri" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-maps secondary"
              >
                <Navigation size={16} />
                <span>Petunjuk Arah (GPS)</span>
              </a>
            </div>

            {/* Google Calendar Button */}
            <a 
              href={makeGoogleCalendarUrl(
                `Pemberkatan Nikah: ${data.groomName || 'Yenricho'} & ${data.brideName || 'Veni'}`,
                `Pemberkatan Pernikahan Kudus ${data.groomFullName} & ${data.brideFullName} di Gereja HKBP Dame Duri.`,
                data.pemberkatan.address,
                '20261003T020000Z',
                '20261003T043000Z'
              )}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-add-calendar"
            >
              <CalendarPlus size={15} />
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>

          {/* Resepsi */}
          <div className="event-card glass-card reveal reveal-right">
            <CornerGorgaFiligree position="top-right" />
            <CornerGorgaFiligree position="bottom-left" />
            <div className="event-icon">
              <PartyPopper size={44} />
            </div>
            <h3 className="event-title">{data.resepsi.title}</h3>
            
            <div className="event-details">
              <div className="event-detail-item">
                <CalendarDays size={18} />
                <span>{data.resepsi.date}</span>
              </div>
              <div className="event-detail-item">
                <Clock size={18} />
                <span>{data.resepsi.time}</span>
              </div>
              <div className="event-detail-item">
                <MapPin size={18} />
                <span>{data.resepsi.venue}</span>
              </div>
              <div className="event-detail-item address">
                <Navigation size={18} />
                <span>{data.resepsi.address}</span>
              </div>
            </div>

            {/* REAL GOOGLE MAPS EMBED */}
            <div className="card-map-wrapper">
              <iframe
                title="Peta Lokasi Resepsi Pernikahan"
                src="https://maps.google.com/maps?q=Sopo+Margurosi+Jalan+Sejahtera+Duri&t=&z=16&ie=UTF8&iwloc=&output=embed"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="event-map-iframe"
              ></iframe>
            </div>

            <div className="event-action-buttons">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Sopo+Margurosi+Jalan+Sejahtera+Duri" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-maps primary"
              >
                <Map size={16} />
                <span>Buka Google Maps</span>
              </a>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Sopo+Margurosi+Jalan+Sejahtera+Duri" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-maps secondary"
              >
                <Navigation size={16} />
                <span>Petunjuk Arah (GPS)</span>
              </a>
            </div>

            {/* Google Calendar Button */}
            <a 
              href={makeGoogleCalendarUrl(
                `Resepsi Adat: ${data.groomName || 'Yenricho'} & ${data.brideName || 'Veni'}`,
                `Resepsi Pernikahan dan Pesta Adat Batak ${data.groomFullName} & ${data.brideFullName} di Sopo Margurosi Duri.`,
                data.resepsi.address,
                '20261003T043000Z',
                '20261003T110000Z'
              )}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-add-calendar"
            >
              <CalendarPlus size={15} />
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>

        </div>

        {/* Countdown Timer */}
        <div className="countdown-container reveal">
          <h3 className="countdown-title">Menghitung Hari Bahagia</h3>
          <div className="countdown-timer" id="countdown">
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.days}</div>
              <div className="countdown-label">Hari</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.hours}</div>
              <div className="countdown-label">Jam</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.minutes}</div>
              <div className="countdown-label">Menit</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.seconds}</div>
              <div className="countdown-label">Detik</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

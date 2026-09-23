import React, { useState, useEffect } from 'react';

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'couple', label: 'Mempelai' },
    { id: 'story', label: 'Kisah Cinta' },
    { id: 'event', label: 'Acara & Lokasi' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'envelope-section', label: 'Amplop & Kado' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'wishes', label: 'Ucapan' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="floating-nav" id="floating-nav">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`nav-dot ${activeSection === item.id ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, item.id)}
          title={item.label}
        >
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

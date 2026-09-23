import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Play, Pause, Maximize2, Sparkles, Heart } from 'lucide-react';
import { UlosRibbonDivider, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef(null);
  const filmstripRef = useRef(null);

  // All 18 authentic, unique, curated prewedding photos
  const galleryPhotos = [
    { 
      src: '/assets/images/12.jpeg', 
      title: 'Doa Khusyuk di Hadapan Tuhan', 
      tag: 'Gereja HKBP',
      caption: 'Memohon tuntunan dan berkat Tuhan Yang Maha Esa atas janji suci berdua.' 
    },
    { 
      src: '/assets/images/9.jpeg', 
      title: 'Pelukan Kasih di Depan Altar Suci', 
      tag: 'Altar Suci',
      caption: 'Dua insan bersatu dalam keteduhan rumah ibadah yang agung.' 
    },
    { 
      src: '/assets/images/10.jpeg', 
      title: 'Cincin Pengikat Janji Suci', 
      tag: 'Martumpol',
      caption: 'Simbol ikatan cinta abadi yang saling melengkapi dalam iman dan kasih.' 
    },
    { 
      src: '/assets/images/11.jpeg', 
      title: 'Anggun di Antara Bangku Gereja', 
      tag: 'Gereja HKBP',
      caption: 'Langkah mantap menuju hari bahagia yang telah dinanti.' 
    },
    { 
      src: '/assets/images/1.jpeg', 
      title: 'Pesona Ulos Tradisional Batak Toba', 
      tag: 'Adat Batak',
      caption: 'Warisan leluhur penuh kehormatan, doa restu orang tua dan bona ni pasu.' 
    },
    { 
      src: '/assets/images/2.jpeg', 
      title: 'Santun Adat & Doa Restu', 
      tag: 'Adat Batak',
      caption: 'Permohonan doa tulus kepada keluarga besar dan Tuhan pencipta semesta.' 
    },
    { 
      src: '/assets/images/3.jpeg', 
      title: 'Langkah Bersama Menggapai Cita', 
      tag: 'Adat Batak',
      caption: 'Berdampingan menatap masa depan penuh kebahagiaan dan kemuliaan.' 
    },
    { 
      src: '/assets/images/14.jpeg', 
      title: 'Tandok Beras & Harapan Kemakmuran', 
      tag: 'Adat Batak',
      caption: 'Lambang kemakmuran, kesuburan, dan kerukunan rumah tangga Batak.' 
    },
    { 
      src: '/assets/images/foto laki laki sendiri.jpeg', 
      title: 'Yenricho Noprian T Silaban', 
      tag: 'Mempelai Pria',
      caption: 'Putra pertama dari Bapak B. Silaban & Ibu R. Panjaitan yang siap memimpin bahtera rumah tangga.' 
    },
    { 
      src: '/assets/images/foto perempuan sendiri.jpeg', 
      title: 'Veni Gracia Br Sitanggang, S.Pd', 
      tag: 'Mempelai Wanita',
      caption: 'Putri terakhir dari Bapak A. Sitanggang & Ibu R. Manurung yang anggun, setia, dan berbudi luhur.' 
    },
    { 
      src: '/assets/images/26.jpeg', 
      title: 'Buket Bunga & Senyum Bahagia', 
      tag: 'Romansa Senja',
      caption: 'Kehangatan senyum yang selalu merekah di setiap langkah kebersamaan.' 
    },
    { 
      src: '/assets/images/4.jpeg', 
      title: 'Casual Style & Kacamata Hitam', 
      tag: 'Casual Modern',
      caption: 'Gaya santai berdua, menjadi diri sendiri dengan penuh rasa bahagia.' 
    },
    { 
      src: '/assets/images/5.jpeg', 
      title: 'Bergandengan Tangan Menyusuri Jalan', 
      tag: 'Casual Modern',
      caption: 'Genggaman tangan erat yang takkan pernah saling melepaskan.' 
    },
    { 
      src: '/assets/images/6.jpeg', 
      title: 'Dekapan Hangat Penuh Ketulusan', 
      tag: 'Romansa',
      caption: 'Rasa nyaman dan damai yang hadir saat berada di sampingmu.' 
    },
    { 
      src: '/assets/images/7.jpeg', 
      title: 'Menatap Hari Esok Penuh Cinta', 
      tag: 'Romansa',
      caption: 'Tawa dan canda yang selalu mengiringi setiap detik perjalanan kami.' 
    },
    { 
      src: '/assets/images/8.jpeg', 
      title: 'Tatapan Kasih di Kala Senja', 
      tag: 'Romansa',
      caption: 'Cinta yang semakin mendalam seiring bergulirnya waktu.' 
    },
    { 
      src: '/assets/images/21.jpeg', 
      title: 'Detik-Detik Bahagia Bersama', 
      tag: 'Casual Modern',
      caption: 'Momen spontan penuh keceriaan yang terukir manis dalam kenangan.' 
    },
    { 
      src: '/assets/images/24.jpeg', 
      title: 'Harmoni Senja & Kasih Sejati', 
      tag: 'Casual Modern',
      caption: 'Menyatu dalam keindahan alam senja yang tenang dan syahdu.' 
    }
  ];

  const totalPhotos = galleryPhotos.length;
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef(null);

  // Track if gallery section is in viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-play slider logic - ONLY runs when user is looking at gallery
  useEffect(() => {
    if (!isPlaying || lightboxOpen || !isSectionVisible) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPhotos);
    }, 4500);
    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying, lightboxOpen, isSectionVisible, totalPhotos]);

  // Scroll active thumbnail horizontally INSIDE filmstrip only (NEVER touch window scroll!)
  useEffect(() => {
    const container = filmstripRef.current;
    if (!container) return;
    const activeThumb = container.querySelector(`.thumb-${currentIndex}`);
    if (activeThumb) {
      const scrollPos = activeThumb.offsetLeft - (container.clientWidth / 2) + (activeThumb.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
    }
  }, [currentIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  };

  // Touch swipe support for smartphone guests
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const activePhoto = galleryPhotos[currentIndex];

  // Interactive 3D tilt on card mouse move
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section 
      id="gallery" 
      ref={sectionRef}
      className="section section-dark section-photo-bg"
      style={{ backgroundImage: "url('/assets/images/26.jpeg')" }}
    >
      <div className="section-photo-overlay"></div>

      <div className="section-content">
        
        {/* Section Header */}
        <div className="section-header reveal">
          <p className="section-label">OUR MOMENTS</p>
          <h2 className="section-title">Galeri Foto Prewedding</h2>
          <GorgaBatakOrnament size={46} />
          <UlosRibbonDivider />
          <p className="gallery-subtitle">
            Potret sakral, adat, dan kebersamaan cinta Yenricho & Veni
          </p>
        </div>

        {/* 1. CINEMATIC SHOWCASE SLIDER (FEATURED VIEWER) */}
        <div 
          className="gallery-cinematic-showcase reveal"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CornerGorgaFiligree position="top-left" />
          <CornerGorgaFiligree position="top-right" />
          <CornerGorgaFiligree position="bottom-left" />
          <CornerGorgaFiligree position="bottom-right" />

          {/* Main Slide Image */}
          <div 
            className="showcase-image-container"
            onClick={() => setLightboxOpen(true)}
            title="Klik untuk melihat layar penuh"
          >
            <img 
              src={activePhoto.src} 
              alt={activePhoto.title} 
              className="showcase-active-img" 
              key={currentIndex}
            />

            <div className="showcase-gradient-vignette"></div>

            {/* Top Bar: Tag & Expand */}
            <div className="showcase-top-bar">
              <span className="showcase-tag-pill">✦ {activePhoto.tag} ✦</span>
              <button 
                type="button" 
                className="btn-showcase-expand"
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                title="Layar Penuh"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="showcase-caption-card">
              <span className="showcase-counter-badge">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}
              </span>
              <h3 className="showcase-title">{activePhoto.title}</h3>
              <p className="showcase-desc">{activePhoto.caption}</p>
            </div>
          </div>

          {/* Slide Navigation Buttons */}
          <button 
            type="button" 
            className="btn-slider-nav prev"
            onClick={handlePrev}
            title="Foto Sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            type="button" 
            className="btn-slider-nav next"
            onClick={handleNext}
            title="Foto Selanjutnya"
          >
            <ChevronRight size={24} />
          </button>

          {/* Autoplay Pause / Play Toggle */}
          <div className="slider-bottom-controls">
            <button 
              type="button" 
              className="btn-autoplay-toggle"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Jeda Slideshow' : 'Putar Slideshow'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Slideshow Aktif' : 'Slideshow Dijeda'}</span>
            </button>
          </div>
        </div>

        {/* 2. HORIZONTAL FILMSTRIP THUMBNAIL RIBBON */}
        <div className="gallery-filmstrip-wrapper reveal">
          <p className="filmstrip-hint">✦ Geser atau pilih foto untuk melihat ✦</p>
          <div className="gallery-filmstrip" ref={filmstripRef}>
            {galleryPhotos.map((photo, index) => (
              <div
                key={index}
                className={`filmstrip-thumb thumb-${index} ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                title={photo.title}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
                {index === currentIndex && <div className="thumb-active-glow"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* 3. BALANCED EDITORIAL LOOKBOOK GRID (KEREN & RAPI) */}
        <div className="gallery-section-divider reveal">
          <span className="divider-gold-diamond">✦ ✦ ✦</span>
          <p className="lookbook-section-label">KOLEKSI LENGKAP PREWEDDING</p>
          <div className="lookbook-divider-line"></div>
        </div>

        <div className="gallery-editorial-grid reveal">
          {galleryPhotos.map((photo, index) => (
            <div 
              key={index} 
              className={`editorial-card ${index === currentIndex ? 'selected-card' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setCurrentIndex(index);
                setLightboxOpen(true);
              }}
              title="Klik untuk memperbesar"
            >
              <div className="editorial-card-frame">
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <div className="editorial-card-overlay">
                  <div className="editorial-overlay-content">
                    <span className="editorial-card-tag">{photo.tag}</span>
                    <h4 className="editorial-card-title">{photo.title}</h4>
                    <div className="editorial-card-zoom-hint">
                      <ZoomIn size={14} />
                      <span>Lihat Foto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 4. FULLSCREEN HIGH-RES LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="lightbox active" onClick={() => setLightboxOpen(false)}>
          <button 
            type="button" 
            className="lightbox-close" 
            onClick={() => setLightboxOpen(false)} 
            title="Tutup (ESC)"
          >
            <X size={26} />
          </button>
          
          <button 
            type="button" 
            className="lightbox-nav lightbox-prev" 
            onClick={handlePrev} 
            title="Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft size={36} />
          </button>
          
          <button 
            type="button" 
            className="lightbox-nav lightbox-next" 
            onClick={handleNext} 
            title="Selanjutnya (Panah Kanan)"
          >
            <ChevronRight size={36} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activePhoto.src} 
              alt={activePhoto.title} 
              id="lightbox-img" 
            />
            <div className="lightbox-caption">
              <span className="caption-text">{activePhoto.title}</span>
              <span className="caption-counter">{currentIndex + 1} / {totalPhotos}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

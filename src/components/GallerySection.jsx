import React, { useState, useEffect } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';

export default function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const allImages = [
    { src: 'assets/images/1.jpeg', title: 'Pesona Tradisional Batak', category: 'adat' },
    { src: 'assets/images/2.jpeg', title: 'Janji & Doa Bersama', category: 'adat' },
    { src: 'assets/images/3.jpeg', title: 'Langkah Berdampingan', category: 'adat' },
    { src: 'assets/images/4.jpeg', title: 'Casual & Modern Vibes', category: 'modern' },
    { src: 'assets/images/5.jpeg', title: 'Tatapan Penuh Makna', category: 'modern' },
    { src: 'assets/images/6.jpeg', title: 'Senyuman Bahagia', category: 'modern' },
    { src: 'assets/images/7.jpeg', title: 'Menatap Masa Depan', category: 'modern' },
    { src: 'assets/images/8.jpeg', title: 'Genggaman Hangat', category: 'modern' },
    { src: 'assets/images/9.jpeg', title: 'Romansa Dalam Kesederhanaan', category: 'modern' },
    { src: 'assets/images/10.jpeg', title: 'Momen Kehangatan', category: 'modern' },
    { src: 'assets/images/11.jpeg', title: 'Dua Hati Satu Tujuan', category: 'modern' },
    { src: 'assets/images/12.jpeg', title: 'Menuju Hari Bahagia', category: 'modern' }
  ];

  const filteredImages = activeFilter === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === activeFilter);

  const openLightbox = (index) => {
    // find index in allImages
    const selectedImg = filteredImages[index];
    const originalIndex = allImages.findIndex(img => img.src === selectedImg.src);
    setCurrentIndex(originalIndex >= 0 ? originalIndex : 0);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <section id="gallery" className="section section-light">
      <div className="section-content">
        
        <div className="section-header reveal">
          <p className="section-label">Momen Bahagia</p>
          <h2 className="section-title">Galeri Foto Prewedding</h2>
          <div className="ornament-line"></div>
          <p className="gallery-subtitle">
            Koleksi potret kasih dan kebersamaan Yenricho & Veni
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="gallery-filters reveal">
          <button 
            className={`gallery-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <span>Semua Foto ({allImages.length})</span>
          </button>
          <button 
            className={`gallery-filter-btn ${activeFilter === 'adat' ? 'active' : ''}`}
            onClick={() => setActiveFilter('adat')}
          >
            <span>Busana Adat Batak</span>
          </button>
          <button 
            className={`gallery-filter-btn ${activeFilter === 'modern' ? 'active' : ''}`}
            onClick={() => setActiveFilter('modern')}
          >
            <span>Casual & Modern</span>
          </button>
        </div>

        {/* Photo Grid with All 12 Prewedding Photos */}
        <div className="gallery-grid reveal">
          {filteredImages.map((item, index) => (
            <div 
              key={index} 
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="gallery-overlay">
                <div className="overlay-content">
                  <ZoomIn size={28} className="overlay-zoom-icon" />
                  <span className="overlay-title">{item.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox active" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} title="Tutup">
            <X size={24} />
          </button>
          
          <button className="lightbox-nav lightbox-prev" onClick={prevImage} title="Sebelumnya">
            <ChevronLeft size={32} />
          </button>
          
          <button className="lightbox-nav lightbox-next" onClick={nextImage} title="Selanjutnya">
            <ChevronRight size={32} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={allImages[currentIndex].src} 
              alt={allImages[currentIndex].title} 
              id="lightbox-img" 
            />
            <div className="lightbox-caption">
              <span className="caption-text">{allImages[currentIndex].title}</span>
              <span className="caption-counter">{currentIndex + 1} / {allImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

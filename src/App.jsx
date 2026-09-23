import React, { useState, useEffect } from 'react';
import { defaultData } from './data/defaultData';
import CoverSection from './components/CoverSection';
import HeroSection from './components/HeroSection';
import CoupleSection from './components/CoupleSection';
import StorySection from './components/StorySection';
import EventSection from './components/EventSection';
import GallerySection from './components/GallerySection';
import DigitalEnvelopeSection from './components/DigitalEnvelopeSection';
import RsvpSection from './components/RsvpSection';
import WishesSection from './components/WishesSection';
import FooterSection from './components/FooterSection';
import PhotoQuoteBanner from './components/PhotoQuoteBanner';
import FloatingNav from './components/FloatingNav';
import MusicPlayer from './components/MusicPlayer';
import EnvelopePrintModal from './components/EnvelopePrintModal';
import AdminPage from './components/AdminPage';
import { exportElementToPdf, exportBulkToPdf } from './utils/pdfExport';
import { triggerLuxuryWeddingConfetti } from './utils/confetti';
import { initUlosShimmer, initBatakCursorTrail } from './utils/batakInteractions';

export default function App() {
  // Load data from localStorage or defaultData, prioritizing URL params if present
  const [data, setData] = useState(() => {
    let initial = defaultData;
    try {
      const saved = localStorage.getItem('amplop_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.groomParents || parsed.groomParents.includes('...')) {
          parsed.groomParents = defaultData.groomParents;
        }
        if (!parsed.groomChildOrder) {
          parsed.groomChildOrder = defaultData.groomChildOrder;
        }
        if (!parsed.brideParents || parsed.brideParents.includes('...')) {
          parsed.brideParents = defaultData.brideParents;
        }
        if (!parsed.brideChildOrder) {
          parsed.brideChildOrder = defaultData.brideChildOrder;
        }
        if (!parsed.giftAddress || !parsed.giftAddress.postalCode || (parsed.giftAddress.street && parsed.giftAddress.street.includes('dusty pink'))) {
          parsed.giftAddress = defaultData.giftAddress;
        }
        parsed.stories = defaultData.stories;
        initial = { ...defaultData, ...parsed };
      }
    } catch (e) {
      console.error(e);
    }

    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const guestFromUrl = params.get('to') || params.get('kepada');
        if (guestFromUrl) {
          initial = { ...initial, recipientName: guestFromUrl };
        }
      } catch (e) {}
    }

    return initial;
  });

  // Quick guest list
  const [guestList, setGuestList] = useState(() => {
    try {
      const saved = localStorage.getItem('amplop_guests');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultData.defaultGuests;
  });

  // Bulk name list
  const [bulkList, setBulkList] = useState(() => {
    try {
      const saved = localStorage.getItem('amplop_bulk');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      'Bapak Ahmad & Keluarga',
      'Bapak Budi & Keluarga',
      'Ibu Siti & Keluarga',
      'Saudara Andi',
      'Saudara Rina'
    ];
  });

  const [activeBulkIndex, setActiveBulkIndex] = useState(0);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [startMusic, setStartMusic] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Check if URL is an admin route (/admin, ?admin, #admin)
  const checkIsAdmin = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('/admin') || search.includes('admin') || hash.includes('admin');
  };

  const [isAdminView, setIsAdminView] = useState(checkIsAdmin);

  // Sync routing on browser popstate / hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(checkIsAdmin());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleExitAdmin = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch (e) {}
    setIsAdminView(false);
  };

  const handleEnterAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch (e) {}
    setIsAdminView(true);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('amplop_data', JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('amplop_guests', JSON.stringify(guestList));
    } catch (e) {}
  }, [guestList]);

  useEffect(() => {
    try {
      localStorage.setItem('amplop_bulk', JSON.stringify(bulkList));
    } catch (e) {}
  }, [bulkList]);

  // Check URL params (?to=... or ?kepada=...) on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestFromUrl = params.get('to') || params.get('kepada');
    if (guestFromUrl) {
      setData(prev => ({ ...prev, recipientName: guestFromUrl }));
    }
  }, []);

  // Scroll reveal animation observer
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));

    // Initialize metallic gold shimmer sweep on Batak Ulos ribbons & interactive Batak cursor trail
    const cleanupShimmer = initUlosShimmer();
    const cleanupCursor = initBatakCursorTrail();

    return () => {
      observer.disconnect();
      if (cleanupShimmer) cleanupShimmer();
      if (cleanupCursor) cleanupCursor();
    };
  }, [isInvitationOpen]);

  // Handle invitation open
  const handleOpenInvitation = () => {
    // Ledakan confetti mewah kelopak mawar & emas
    triggerLuxuryWeddingConfetti();

    // Mulai putar lagu romantis Batak secara otomatis
    setStartMusic(true);

    const coverEl = document.getElementById('cover');
    if (coverEl) {
      coverEl.classList.add('fade-out');
    }
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      setIsInvitationOpen(true);
      // Trigger instant reveal for hero
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add('active');
          }
        });
      }, 200);
    }, 800);
  };

  // Reset to default data
  const handleResetData = () => {
    if (window.confirm('Reset semua nama ke data bawaan?')) {
      setData(defaultData);
      setGuestList(defaultData.defaultGuests);
      setBulkList([
        'Bapak Ahmad & Keluarga',
        'Bapak Budi & Keluarga',
        'Ibu Siti & Keluarga',
        'Saudara Andi',
        'Saudara Rina'
      ]);
      setActiveBulkIndex(0);
      localStorage.removeItem('amplop_data');
      localStorage.removeItem('amplop_guests');
      localStorage.removeItem('amplop_bulk');
    }
  };

  // Export single PDF
  const handleExportSinglePdf = async () => {
    try {
      setIsExporting(true);
      // Ensure print modal is open so element exists
      if (!isPrintModalOpen) setIsPrintModalOpen(true);
      await new Promise(r => setTimeout(r, 400));
      
      const element = document.getElementById('printable-envelope');
      const safeName = (data.recipientName || 'amplop')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      await exportElementToPdf(element, `amplop_${safeName}.pdf`);
    } catch (err) {
      alert('Gagal mendownload PDF: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Export bulk PDF
  const handleExportBulkPdf = async () => {
    if (bulkList.length === 0) return;
    try {
      setIsExporting(true);
      if (!isPrintModalOpen) setIsPrintModalOpen(true);
      await new Promise(r => setTimeout(r, 400));

      await exportBulkToPdf(
        bulkList,
        (newName) => {
          setData(prev => ({ ...prev, recipientName: newName }));
        },
        () => document.getElementById('printable-envelope'),
        `semua_amplop_${bulkList.length}_tamu.pdf`
      );
    } catch (err) {
      alert('Gagal mendownload bulk PDF: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  // 1. DEDICATED ADMIN MANAGEMENT PAGE (/admin, ?admin, #admin)
  if (isAdminView) {
    return (
      <div className="wedding-app admin-view">
        <AdminPage 
          data={data}
          setData={setData}
          guestList={guestList}
          setGuestList={setGuestList}
          bulkList={bulkList}
          setBulkList={setBulkList}
          activeBulkIndex={activeBulkIndex}
          setActiveBulkIndex={setActiveBulkIndex}
          onResetData={handleResetData}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
          onExportSinglePdf={handleExportSinglePdf}
          onExportBulkPdf={handleExportBulkPdf}
          isExporting={isExporting}
          onExitAdmin={handleExitAdmin}
        />

        {/* PRINTABLE ENVELOPE MODAL */}
        <EnvelopePrintModal 
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          data={data}
          bulkList={bulkList}
          activeBulkIndex={activeBulkIndex}
          setActiveBulkIndex={setActiveBulkIndex}
          onExportSinglePdf={handleExportSinglePdf}
          onExportBulkPdf={handleExportBulkPdf}
          isExporting={isExporting}
        />
      </div>
    );
  }

  // 2. PUBLIC WEDDING INVITATION FOR GUESTS & FAMILIES
  return (
    <div className="wedding-app public-invitation-view">
      
      {/* 1. COVER / AMPLOP DIGITAL OPENING */}
      <CoverSection 
        data={data}
        onOpenInvitation={handleOpenInvitation}
        isOpen={isInvitationOpen}
      />

      {/* 2. MAIN INVITATION CONTENT (revealed when opened) */}
      <main id="main-content" className={isInvitationOpen ? '' : 'hidden'}>
        <MusicPlayer shouldAutoPlay={startMusic} />
        <FloatingNav />

        <HeroSection data={data} />
        <CoupleSection data={data} />

        {/* Parallax Photo Quote Banner 1: Holy Bible Verse */}
        <PhotoQuoteBanner 
          bgImage="/assets/images/11.jpeg"
          quote="Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan."
          reference="Kolose 3:14"
        />

        <EventSection data={data} />

        {/* Parallax Photo Quote Banner 2: Batak Blessing */}
        <PhotoQuoteBanner 
          bgImage="/assets/images/14.jpeg"
          quote="Aek godang tu aek laut, Dos ni roha do sibahen na saut. Horas jala gabe ma hita saluhutna."
          subtext="Kiranya limpahan berkat, kerukunan, dan damai sejahtera senantiasa menyertai langkah baru kedua mempelai."
          reference="Umpasa Batak Toba"
        />

        <StorySection stories={data.stories} />
        <GallerySection />

        {/* Parallax Photo Quote Banner 3: Romantic Promise */}
        <PhotoQuoteBanner 
          bgImage="/assets/images/7.jpeg"
          quote="Dua hati yang dipersatukan dalam cinta dan komitmen suci, melangkah bersama di bawah naungan berkat Tuhan selamanya."
          reference="Yenricho & Veni"
        />

        <DigitalEnvelopeSection 
          bankAccounts={data.bankAccounts} 
          giftAddress={data.giftAddress} 
          defaultGuestName={data.recipientName}
        />
        <RsvpSection defaultName={data.recipientName} />
        <WishesSection defaultName={data.recipientName} />
        <FooterSection data={data} onEnterAdmin={handleEnterAdmin} />
      </main>

      {/* PRINTABLE ENVELOPE MODAL (CAN BE OPENED IF NEEDED) */}
      <EnvelopePrintModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={data}
        bulkList={bulkList}
        activeBulkIndex={activeBulkIndex}
        setActiveBulkIndex={setActiveBulkIndex}
        onExportSinglePdf={handleExportSinglePdf}
        onExportBulkPdf={handleExportBulkPdf}
        isExporting={isExporting}
      />

    </div>
  );
}

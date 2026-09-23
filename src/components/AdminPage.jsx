import React, { useState, useEffect } from 'react';
import { 
  Users, Edit3, Share2, CreditCard, Printer, Download, ExternalLink, 
  RotateCcw, Sparkles, Plus, Trash2, Check, Copy, MessageCircle, 
  QrCode, FileSpreadsheet, CheckCircle2, Clock, Search, ArrowLeft, 
  Gift, Building2, Heart, Send, X, Eye, FileText, Package, Truck
} from 'lucide-react';
import { MonogramCrest } from './Ornaments';

export default function AdminPage({
  data,
  setData,
  guestList,
  setGuestList,
  bulkList,
  setBulkList,
  activeBulkIndex,
  setActiveBulkIndex,
  onResetData,
  onOpenPrintModal,
  onExportSinglePdf,
  onExportBulkPdf,
  isExporting,
  onExitAdmin
}) {
  const [activeTab, setActiveTab] = useState('share'); // 'share', 'guests', 'couple', 'bank', 'print'
  const [searchQuery, setSearchQuery] = useState('');
  const [newGuestInput, setNewGuestInput] = useState('');
  const [bulkTextInput, setBulkTextInput] = useState(() => 
    bulkList.length > 0 ? bulkList.join('\n') : ''
  );
  const [showToast, setShowToast] = useState('');
  const [copiedLinkIndex, setCopiedLinkIndex] = useState(null);
  const [copiedMsgIndex, setCopiedMsgIndex] = useState(null);
  const [waTemplateType, setWaTemplateType] = useState('formal'); // 'formal', 'keluarga', 'batak'
  const [qrModalGuest, setQrModalGuest] = useState(null);

  // Status Terkirim tracker (LocalStorage)
  const [sentStatus, setSentStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('amplop_sent_status');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Incoming gift confirmations tracker
  const [giftConfirmations, setGiftConfirmations] = useState(() => {
    try {
      const saved = localStorage.getItem('wedding_gift_confirmations');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const handleGiftUpdate = (e) => {
      if (e.detail) {
        setGiftConfirmations(e.detail);
      }
    };
    window.addEventListener('gift-confirmation-updated', handleGiftUpdate);
    return () => window.removeEventListener('gift-confirmation-updated', handleGiftUpdate);
  }, []);

  const totalSentCount = bulkList.filter(guest => !!sentStatus[guest]).length;
  const totalUnsentCount = bulkList.length - totalSentCount;

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2600);
  };

  // Base URL for guest links (excluding /admin)
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      return `${origin}/`;
    }
    return 'https://amplopnikah-yenricho.vercel.app/';
  };

  const generateGuestLink = (guestName) => {
    const base = getBaseUrl();
    const encoded = encodeURIComponent(guestName || '');
    return `${base}?to=${encoded}`;
  };

  // WhatsApp Message Generator (Sesuai Struktur Format Referensi)
  const generateWaMessage = (guestName) => {
    const link = generateGuestLink(guestName);
    const groom = data.groomName || 'Yenricho';
    const bride = data.brideName || 'Veni';
    const targetGuest = guestName?.trim() || 'Bapak/Ibu/Saudara/i';
    
    if (waTemplateType === 'batak') {
      return `Shalom & Horas,\n\nKepada Yth.\nBapak/Ibu/Doli/Inang/Saudara/i\n*${targetGuest}*\n_______\n\nDengan memohon berkat dan penyertaan Tuhan Yang Maha Esa, perkenankan kami mengundang Bapak/Ibu/Doli/Inang/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara Pemberkatan Nikah dan Pesta Adat pernikahan kami:\n\n*${groom} dan ${bride}*\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n${link}\n\nMerupakan suatu kehormatan dan sukacita yang besar bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nNote:\nUntuk mendapatkan hasil yg bagus, harap buka melalui google chrome terupdate.\n\nMauliate godang, Tuhan memberkati.\n\nTerima Kasih\n\nHormat kami,\n${groom} dan ${bride}\n________`;
    }

    if (waTemplateType === 'keluarga') {
      return `Halo *${targetGuest}*,\n_______\n\nKabar bahagia dari kami! Dengan rasa syukur, perkenankan kami mengundang Bapak/Ibu/Saudara/i, keluarga, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami:\n\n*${groom} dan ${bride}*\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n${link}\n\nKehadiran dan doa restu dari kalian sangat berarti bagi kami berdua.\n\nNote:\nUntuk mendapatkan hasil yg bagus, harap buka melalui google chrome terupdate.\n\nTerima Kasih ❤️\n\nHormat kami,\n${groom} dan ${bride}\n________`;
    }

    // Default Formal: Persis format template referensi yang diminta user
    return `Kepada Yth.\nBapak/Ibu/Saudara/i\n*${targetGuest}*\n_______\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n${link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nNote:\nUntuk mendapatkan hasil yg bagus, harap buka melalui google chrome terupdate.\n\nTerima Kasih\n\nHormat kami,\n${groom} dan ${bride}\n________`;
  };

  const handleCopyLink = (guestName, indexKey) => {
    const link = generateGuestLink(guestName);
    navigator.clipboard.writeText(link);
    setCopiedLinkIndex(indexKey);
    triggerToast(`Link untuk "${guestName}" berhasil disalin!`);
    setTimeout(() => setCopiedLinkIndex(null), 2500);
  };

  const handleCopyWaMessage = (guestName, indexKey) => {
    const msg = generateWaMessage(guestName);
    navigator.clipboard.writeText(msg);
    setCopiedMsgIndex(indexKey);
    triggerToast(`Teks undangan WA untuk "${guestName}" berhasil disalin!`);
    setTimeout(() => setCopiedMsgIndex(null), 2500);
  };

  const toggleSentStatus = (guestName, forceVal) => {
    setSentStatus(prev => {
      const next = { ...prev, [guestName]: forceVal !== undefined ? forceVal : !prev[guestName] };
      try {
        localStorage.setItem('amplop_sent_status', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSendWa = (guestName) => {
    const text = encodeURIComponent(generateWaMessage(guestName));
    const url = `https://api.whatsapp.com/send?text=${text}`;
    toggleSentStatus(guestName, true);
    window.open(url, '_blank');
  };

  // Download all links as CSV / Excel
  const downloadCsvRecap = () => {
    if (bulkList.length === 0) {
      triggerToast('Daftar tamu masih kosong!');
      return;
    }
    const rows = [
      ['No', 'Nama Tamu / Keluarga', 'Link Undangan Khusus', 'Status Kirim'],
      ...bulkList.map((guest, i) => [
        i + 1,
        `"${guest.replace(/"/g, '""')}"`,
        generateGuestLink(guest),
        sentStatus[guest] ? 'Sudah Terkirim' : 'Belum Terkirim'
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_link_undangan_${bulkList.length}_keluarga.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Rekap link Excel/CSV berhasil diunduh!');
  };

  // Filtered Bulk Guests
  const filteredGuests = bulkList.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add individual guest
  const handleAddGuest = (e) => {
    e.preventDefault();
    const trimmed = newGuestInput.trim();
    if (!trimmed) return;
    if (bulkList.includes(trimmed)) {
      triggerToast('Nama ini sudah ada di daftar!');
      return;
    }
    const updated = [...bulkList, trimmed];
    setBulkList(updated);
    setBulkTextInput(updated.join('\n'));
    setNewGuestInput('');
    triggerToast(`"${trimmed}" berhasil ditambahkan!`);
  };

  // Delete guest
  const handleDeleteGuest = (indexToDelete) => {
    const targetName = bulkList[indexToDelete];
    const updated = bulkList.filter((_, i) => i !== indexToDelete);
    setBulkList(updated);
    setBulkTextInput(updated.join('\n'));
    triggerToast(`"${targetName}" telah dihapus.`);
  };

  // Apply Bulk Text
  const handleApplyBulkText = () => {
    const lines = bulkTextInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      triggerToast('Mohon masukkan minimal 1 nama.');
      return;
    }

    setBulkList(lines);
    triggerToast(`Berhasil memperbarui ${lines.length} nama tamu!`);
  };

  // Handle data updates
  const handleFieldChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.bankAccounts];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, bankAccounts: updated };
    });
  };

  const groomInit = (data.groomName || 'Y').charAt(0).toUpperCase();
  const brideInit = (data.brideName || 'V').charAt(0).toUpperCase();

  return (
    <div className="admin-page-root">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="admin-toast">
          <Sparkles size={16} />
          <span>{showToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand">
            <div className="admin-crest-wrap">
              <MonogramCrest groomInit={groomInit} brideInit={brideInit} size={42} />
            </div>
            <div>
              <h1 className="admin-title">Panel Pengelola Undangan & Amplop</h1>
              <p className="admin-subtitle">
                Pernikahan <strong>{data.groomName}</strong> & <strong>{data.brideName}</strong> • Akses Khusus Admin
              </p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button 
              className="btn-admin-action secondary"
              onClick={onResetData}
              title="Kembalikan semua data ke pengaturan default"
            >
              <RotateCcw size={15} />
              <span>Reset Default</span>
            </button>

            <button 
              className="btn-admin-action primary"
              onClick={onExitAdmin}
              title="Buka tampilan undangan publik yang dilihat para tamu"
            >
              <Eye size={16} />
              <span>Lihat Undangan Tamu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="admin-container">
        
        {/* Quick Stats Bar */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-circle total">
              <Users size={22} />
            </div>
            <div>
              <span className="stat-number">{bulkList.length}</span>
              <span className="stat-label">Total Tamu / Keluarga</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-circle sent">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="stat-number">{totalSentCount}</span>
              <span className="stat-label">Sudah Terkirim</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-circle unsent">
              <Clock size={22} />
            </div>
            <div>
              <span className="stat-number">{totalUnsentCount}</span>
              <span className="stat-label">Belum Terkirim</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-circle bank">
              <CreditCard size={22} />
            </div>
            <div>
              <span className="stat-number">{data.bankAccounts.length}</span>
              <span className="stat-label">Rekening Bank Aktif</span>
            </div>
          </div>

          <div className="stat-card cursor-pointer" onClick={() => setActiveTab('gifts')} title="Klik untuk membuka kelola kado masuk" style={{ cursor: 'pointer' }}>
            <div className="stat-icon-circle" style={{ background: '#fef3c7', color: '#b45309' }}>
              <Package size={22} />
            </div>
            <div>
              <span className="stat-number">{giftConfirmations.length}</span>
              <span className="stat-label">Kado Dikonfirmasi</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="admin-tabs-bar">
          <button 
            className={`admin-nav-tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <Share2 size={16} />
            <span>Bagikan Link & WA ({bulkList.length})</span>
          </button>

          <button 
            className={`admin-nav-tab ${activeTab === 'guests' ? 'active' : ''}`}
            onClick={() => setActiveTab('guests')}
          >
            <Users size={16} />
            <span>Kelola Daftar Tamu</span>
          </button>

          <button 
            className={`admin-nav-tab ${activeTab === 'couple' ? 'active' : ''}`}
            onClick={() => setActiveTab('couple')}
          >
            <Heart size={16} />
            <span>Nama Kedua Mempelai</span>
          </button>

          <button 
            className={`admin-nav-tab ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <CreditCard size={16} />
            <span>Rekening & Alamat</span>
          </button>

          <button 
            className={`admin-nav-tab ${activeTab === 'gifts' ? 'active' : ''}`}
            onClick={() => setActiveTab('gifts')}
          >
            <Package size={16} />
            <span>Kado Masuk ({giftConfirmations.length})</span>
          </button>

          <button 
            className={`admin-nav-tab ${activeTab === 'print' ? 'active' : ''}`}
            onClick={() => setActiveTab('print')}
          >
            <Printer size={16} />
            <span>Cetak Amplop & PDF</span>
          </button>
        </div>

        {/* TAB 1: BAGIKAN LINK & WHATSAPP (UTAMA) */}
        {activeTab === 'share' && (
          <div className="admin-tab-pane">
            
            {/* Explanatory Banner */}
            <div className="admin-banner-gold">
              <Sparkles size={24} className="banner-icon-gold" />
              <div>
                <h3 className="banner-title">Sistem Pembagian Link Khusus Keluarga (100% Otomatis)</h3>
                <p className="banner-desc">
                  Setiap link memiliki parameter unik <code>?to=Nama+Keluarga</code>. Ketika link dibuka di HP tamu, nama amplop otomatis tertulis atas nama keluarga tersebut tanpa perlu database atau registrasi.
                </p>
              </div>
            </div>

            {/* WA Template Selector & CSV Download Row */}
            <div className="admin-toolbar-row">
              <div className="template-select-section">
                <span className="section-mini-title">Pilih Gaya Pesan WhatsApp:</span>
                <div className="template-pills-row">
                  <button 
                    className={`adm-pill ${waTemplateType === 'formal' ? 'active' : ''}`}
                    onClick={() => setWaTemplateType('formal')}
                  >
                    Resmi (Format Referensi)
                  </button>
                  <button 
                    className={`adm-pill ${waTemplateType === 'keluarga' ? 'active' : ''}`}
                    onClick={() => setWaTemplateType('keluarga')}
                  >
                    Hangat & Santai
                  </button>
                  <button 
                    className={`adm-pill ${waTemplateType === 'batak' ? 'active' : ''}`}
                    onClick={() => setWaTemplateType('batak')}
                  >
                    Khas Batak (Horas)
                  </button>
                </div>
              </div>

              <div className="toolbar-right-btns">
                <button 
                  className="btn-adm-csv"
                  onClick={downloadCsvRecap}
                  title="Download Rekap Seluruh Link ke File Excel / CSV"
                >
                  <FileSpreadsheet size={16} />
                  <span>Download Rekap Excel/CSV</span>
                </button>
              </div>
            </div>

            {/* WA Live Preview Card */}
            <div className="wa-template-preview-box">
              <div className="wa-preview-box-header">
                <div className="wa-preview-meta">
                  <MessageCircle size={15} className="text-emerald" />
                  <span className="wa-preview-label">
                    Format Pesan WhatsApp Aktif ({waTemplateType === 'formal' ? 'Resmi / Standar' : waTemplateType === 'keluarga' ? 'Hangat & Santai' : 'Khas Adat Batak'}):
                  </span>
                </div>
                <button 
                  type="button" 
                  className="btn-copy-full-template"
                  onClick={() => {
                    const sampleName = filteredGuests[0] || bulkList[0] || 'Veni dan Partner';
                    const sampleMsg = generateWaMessage(sampleName);
                    navigator.clipboard.writeText(sampleMsg);
                    triggerToast('Format teks WhatsApp berhasil disalin!');
                  }}
                  title="Salin contoh teks pesan ini ke clipboard"
                >
                  <Copy size={13} />
                  <span>Salin Contoh Teks WA</span>
                </button>
              </div>
              <pre className="wa-preview-bubble-content">
                {generateWaMessage(filteredGuests[0] || bulkList[0] || 'Veni dan Partner')}
              </pre>
            </div>

            {/* Search and Table */}
            <div className="admin-table-card">
              <div className="table-search-bar">
                <div className="search-input-wrap">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Cari nama keluarga atau tamu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="search-count-badge">
                  Menampilkan {filteredGuests.length} dari {bulkList.length} tamu
                </div>
              </div>

              {filteredGuests.length === 0 ? (
                <div className="empty-state">
                  <p>Tidak ada nama yang sesuai dengan pencarian "{searchQuery}".</p>
                </div>
              ) : (
                <div className="guest-table-wrapper">
                  <table className="admin-guest-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Status</th>
                        <th style={{ width: '50px' }}>No</th>
                        <th>Nama Tamu / Keluarga</th>
                        <th>Link Undangan Khusus</th>
                        <th style={{ width: '280px', textAlign: 'center' }}>Aksi Kirim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuests.map((guest, idx) => {
                        const originalIdx = bulkList.indexOf(guest);
                        const isSent = !!sentStatus[guest];
                        const link = generateGuestLink(guest);

                        return (
                          <tr key={idx} className={isSent ? 'row-sent' : ''}>
                            {/* Checkbox Status */}
                            <td className="cell-center">
                              <button 
                                className={`btn-status-toggle ${isSent ? 'checked' : ''}`}
                                onClick={() => toggleSentStatus(guest)}
                                title={isSent ? 'Klik untuk tandai belum terkirim' : 'Klik untuk tandai sudah terkirim'}
                              >
                                <Check size={14} />
                              </button>
                            </td>

                            {/* Nomor */}
                            <td className="cell-num">{originalIdx + 1}</td>

                            {/* Nama Tamu */}
                            <td className="cell-name">
                              <span className="guest-display-name">{guest}</span>
                              {isSent && <span className="badge-sent">Terkirim</span>}
                            </td>

                            {/* Link Box */}
                            <td className="cell-link">
                              <div className="link-preview-pill">
                                <code>{link}</code>
                              </div>
                            </td>

                            {/* Aksi */}
                            <td className="cell-actions">
                              <div className="actions-cluster">
                                <button 
                                  className="btn-table-action qr"
                                  onClick={() => setQrModalGuest(guest)}
                                  title="Tampilkan & Download QR Code"
                                >
                                  <QrCode size={14} />
                                  <span>QR</span>
                                </button>

                                <button 
                                  className={`btn-table-action copy ${copiedLinkIndex === idx ? 'done' : ''}`}
                                  onClick={() => handleCopyLink(guest, idx)}
                                  title="Salin Link Undangan"
                                >
                                  {copiedLinkIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                                  <span>{copiedLinkIndex === idx ? 'Tersalin' : 'Salin'}</span>
                                </button>

                                <button 
                                  className={`btn-table-action copy-text ${copiedMsgIndex === idx ? 'done' : ''}`}
                                  onClick={() => handleCopyWaMessage(guest, idx)}
                                  title="Salin Teks Lengkap Undangan WhatsApp"
                                >
                                  {copiedMsgIndex === idx ? <Check size={14} /> : <FileText size={14} />}
                                  <span>{copiedMsgIndex === idx ? 'Teks Tersalin' : 'Salin Teks WA'}</span>
                                </button>

                                <button 
                                  className="btn-table-action wa"
                                  onClick={() => handleSendWa(guest)}
                                  title="Kirim Pesan WhatsApp Langsung"
                                >
                                  <MessageCircle size={14} />
                                  <span>Kirim WA</span>
                                </button>

                                <a 
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-table-action test"
                                  title="Buka Undangan Sebagai Tamu Ini di Tab Baru"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: KELOLA DAFTAR TAMU (TAMBAH / MASSAL) */}
        {activeTab === 'guests' && (
          <div className="admin-tab-pane">
            <div className="admin-two-col-grid">
              
              {/* Kolom Kiri: Input Cepat 1 Nama */}
              <div className="admin-card">
                <h3 className="card-section-title">
                  <Plus size={18} className="gold-text" />
                  Tambah Tamu Satuan
                </h3>
                <p className="card-desc">Tambahkan satu nama keluarga atau sahabat secara instan ke daftar.</p>

                <form onSubmit={handleAddGuest} className="single-add-form">
                  <input 
                    type="text" 
                    placeholder="Contoh: Bapak Ir. Siregar & Keluarga"
                    value={newGuestInput}
                    onChange={(e) => setNewGuestInput(e.target.value)}
                    className="admin-input"
                  />
                  <button type="submit" className="btn-adm-primary">
                    <Plus size={16} />
                    <span>Tambahkan ke Daftar</span>
                  </button>
                </form>

                <hr className="admin-divider" />

                <h4 className="sub-section-title">Daftar Tamu Saat Ini ({bulkList.length})</h4>
                <div className="mini-guest-scroll">
                  {bulkList.map((name, i) => (
                    <div key={i} className="mini-guest-row">
                      <span className="guest-row-num">{i + 1}.</span>
                      <span className="guest-row-name">{name}</span>
                      <button 
                        className="btn-row-del"
                        onClick={() => handleDeleteGuest(i)}
                        title="Hapus nama ini"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolom Kanan: Input Massal (Copy-Paste) */}
              <div className="admin-card">
                <h3 className="card-section-title">
                  <FileSpreadsheet size={18} className="gold-text" />
                  Input Tamu Massal (Salin-Tempel)
                </h3>
                <p className="card-desc">
                  Tempel (paste) puluhan daftar keluarga dari Microsoft Excel, Word, atau WhatsApp di sini (satu nama per baris).
                </p>

                <textarea 
                  rows={14}
                  value={bulkTextInput}
                  onChange={(e) => setBulkTextInput(e.target.value)}
                  placeholder="Bapak Ahmad & Keluarga&#10;Bapak Budi & Keluarga&#10;Ibu Siti & Keluarga&#10;Keluarga Tulang Sitompul&#10;Sahabat Rina"
                  className="admin-textarea"
                />

                <div className="textarea-actions">
                  <span className="textarea-counter">
                    Terdeteksi: {bulkTextInput.split('\n').filter(s => s.trim()).length} baris nama
                  </span>
                  <button 
                    className="btn-adm-primary"
                    onClick={handleApplyBulkText}
                  >
                    <Check size={16} />
                    <span>Simpan & Terapkan Daftar Ini</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: NAMA KEDUA MEMPELAI */}
        {activeTab === 'couple' && (
          <div className="admin-tab-pane">
            <div className="admin-card max-w-800">
              <h3 className="card-section-title">
                <Heart size={18} className="gold-text" />
                Data Nama Kedua Mempelai
              </h3>
              <p className="card-desc">
                Nama ini akan diperbarui secara otomatis di seluruh bagian website, judul cover amplop, dan pesan undangan.
              </p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="admin-label">Nama Mempelai Pria (Lengkap / Adat):</label>
                  <input 
                    type="text" 
                    value={data.groomName || ''}
                    onChange={(e) => handleFieldChange('groomName', e.target.value)}
                    className="admin-input"
                  />
                  <span className="input-hint">Default: Yenricho Noprian T Silaban</span>
                </div>

                <div className="form-group">
                  <label className="admin-label">Nama Mempelai Wanita (Lengkap & Gelar):</label>
                  <input 
                    type="text" 
                    value={data.brideName || ''}
                    onChange={(e) => handleFieldChange('brideName', e.target.value)}
                    className="admin-input"
                  />
                  <span className="input-hint">Default: Veni Gracia Br Sitanggang, S.Pd</span>
                </div>
              </div>

              <div className="form-grid-2 mt-4">
                <div className="form-group">
                  <label className="admin-label">Orang Tua Pria ({data.groomChildOrder || 'Putra pertama'}):</label>
                  <input 
                    type="text" 
                    value={data.groomParents || 'Bapak B. Silaban & Ibu R. Panjaitan'}
                    onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                    className="admin-input"
                  />
                  <span className="input-hint">Default: Bapak B. Silaban & Ibu R. Panjaitan</span>
                </div>

                <div className="form-group">
                  <label className="admin-label">Orang Tua Wanita ({data.brideChildOrder || 'Putri terakhir'}):</label>
                  <input 
                    type="text" 
                    value={data.brideParents || 'Bapak A. Sitanggang & Ibu R. Manurung'}
                    onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                    className="admin-input"
                  />
                  <span className="input-hint">Default: Bapak A. Sitanggang & Ibu R. Manurung</span>
                </div>
              </div>

              <div className="form-grid-2 mt-4">
                <div className="form-group">
                  <label className="admin-label">Nama Pengirim Amplop (Opsional):</label>
                  <input 
                    type="text" 
                    value={data.senderName || ''}
                    onChange={(e) => handleFieldChange('senderName', e.target.value)}
                    placeholder="Contoh: Keluarga Besar Silaban & Sitanggang"
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label className="admin-label">Nama Penerima Default (Jika Buka Tanpa Link):</label>
                  <input 
                    type="text" 
                    value={data.recipientName || ''}
                    onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                    className="admin-input"
                  />
                  <span className="input-hint">Nama default yang muncul jika link dibuka tanpa parameter ?to=...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REKENING & KADO FISIK */}
        {activeTab === 'bank' && (
          <div className="admin-tab-pane">
            <div className="admin-card max-w-900">
              <h3 className="card-section-title">
                <CreditCard size={18} className="gold-text" />
                Rekening Amplop Digital & Alamat Kado
              </h3>
              <p className="card-desc">
                Pengaturan nomor rekening bank dan alamat pengiriman kado fisik untuk tamu yang berhalangan hadir.
              </p>

              <div className="bank-config-grid">
                {data.bankAccounts.map((account, index) => (
                  <div key={index} className="bank-config-item">
                    <div className="bank-config-header">
                      <span className="bank-card-badge">{account.bank}</span>
                      <span className="bank-holder-tag">a.n {account.holder}</span>
                    </div>

                    <div className="form-group">
                      <label className="admin-label">Nama Bank:</label>
                      <input 
                        type="text" 
                        value={account.bank}
                        onChange={(e) => handleBankChange(index, 'bank', e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="admin-label">Nomor Rekening:</label>
                      <input 
                        type="text" 
                        value={account.accountNumber}
                        onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                        className="admin-input font-mono"
                      />
                    </div>

                    <div className="form-group">
                      <label className="admin-label">Nama Pemilik Rekening:</label>
                      <input 
                        type="text" 
                        value={account.holder}
                        onChange={(e) => handleBankChange(index, 'holder', e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <hr className="admin-divider" />

              <h4 className="sub-section-title">
                <Gift size={16} className="gold-text" />
                Alamat Resmi Pengiriman Kado Fisik
              </h4>
              <div className="gift-address-form">
                <div className="form-group">
                  <label className="admin-label">Alamat Lengkap Pengiriman:</label>
                  <textarea 
                    rows={4}
                    value={data.giftAddress ? `Penerima: ${data.giftAddress.recipient} (${data.giftAddress.phone})\nAlamat: ${data.giftAddress.street}\nWilayah: ${data.giftAddress.subdistrict}\nKode Pos / ID: ${data.giftAddress.postalCode || '28811'}\nPatokan: ${data.giftAddress.landmark || 'Rumah pagar steinless putih'}` : ''}
                    readOnly
                    className="admin-textarea"
                  />
                  <span className="input-hint">
                    Alamat ini yang muncul pada tab 'Kirim Kado & Konfirmasi' di website undangan tamu.
                  </span>
                </div>
              </div>

              <hr className="admin-divider" />

              {/* DAFTAR KONFIRMASI KADO MASUK DARI TAMU */}
              <div className="incoming-gifts-section">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="sub-section-title mb-1">
                      <Package size={16} className="gold-text" />
                      Daftar Konfirmasi Kado Masuk ({giftConfirmations.length})
                    </h4>
                    <p className="card-desc text-xs">
                      Konfirmasi yang dikirimkan oleh tamu undangan via formulir kado di website.
                    </p>
                  </div>
                </div>

                {giftConfirmations.length === 0 ? (
                  <div className="empty-gift-notice">
                    <p>Belum ada konfirmasi pengiriman kado yang masuk dari tamu.</p>
                  </div>
                ) : (
                  <div className="incoming-gifts-grid">
                    {giftConfirmations.map((g) => (
                      <div key={g.id} className="incoming-gift-card">
                        <div className="incoming-gift-top">
                          <div>
                            <strong className="incoming-sender-name">{g.senderName}</strong>
                            {g.senderPhone && (
                              <span className="incoming-sender-phone"> • {g.senderPhone}</span>
                            )}
                          </div>
                          <span className="gift-channel-tag">{g.channel || 'Website'}</span>
                        </div>

                        <div className="incoming-gift-body">
                          <p className="incoming-gift-item">
                            🎁 <strong>Kado:</strong> {g.giftItem || 'Tanda Kasih'}
                          </p>
                          <p className="incoming-courier">
                            🚚 <strong>Kurir:</strong> {g.courier} {g.trackingNumber ? `(Resi: ${g.trackingNumber})` : ''}
                          </p>
                          {g.giftMessage && (
                            <p className="incoming-gift-msg">
                              💌 "{g.giftMessage}"
                            </p>
                          )}
                          <span className="incoming-date">
                            {new Date(g.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        <div className="incoming-gift-actions">
                          {g.trackingNumber && (
                            <button 
                              className="btn-adm-mini"
                              onClick={() => {
                                navigator.clipboard.writeText(g.trackingNumber);
                                triggerToast('Nomor resi berhasil disalin!');
                              }}
                            >
                              <Copy size={13} />
                              <span>Salin Resi</span>
                            </button>
                          )}
                          {g.senderPhone && (
                            <a 
                              href={`https://wa.me/62${g.senderPhone.replace(/^0/, '').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(g.senderName)},%20terima%20kasih%20banyak%20atas%20kado%20pernikahan%20yang%20telah%20dikirimkan...`}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn-adm-mini btn-wa-mini"
                            >
                              <MessageCircle size={13} />
                              <span>WA Pengirim</span>
                            </a>
                          )}
                          <button 
                            className="btn-adm-mini danger"
                            onClick={() => {
                              if (window.confirm(`Hapus catatan konfirmasi kado dari ${g.senderName}?`)) {
                                const filtered = giftConfirmations.filter(item => item.id !== g.id);
                                setGiftConfirmations(filtered);
                                localStorage.setItem('wedding_gift_confirmations', JSON.stringify(filtered));
                                triggerToast('Catatan kado dihapus');
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: KADO MASUK DARI TAMU */}
        {activeTab === 'gifts' && (
          <div className="admin-tab-pane">
            <div className="admin-card max-w-900">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="card-section-title">
                    <Package size={20} className="gold-text" />
                    Daftar Kado Masuk Dikonfirmasi ({giftConfirmations.length})
                  </h3>
                  <p className="card-desc">
                    Seluruh konfirmasi pengiriman kado pernikahan yang diisi oleh para tamu melalui formulir di website.
                  </p>
                </div>

                {giftConfirmations.length > 0 && (
                  <button 
                    className="btn-adm-secondary"
                    onClick={() => {
                      const textData = giftConfirmations.map((g, i) => 
                        `${i + 1}. ${g.senderName} (${g.senderPhone || '-'}) | Kado: ${g.giftItem || '-'} | Kurir: ${g.courier} | Resi: ${g.trackingNumber || '-'} | Pesan: "${g.giftMessage || '-'}"`
                      ).join('\n\n');
                      navigator.clipboard.writeText(textData);
                      triggerToast('Daftar kado berhasil disalin ke clipboard!');
                    }}
                  >
                    <Copy size={15} />
                    <span>Salin Semua Data Kado</span>
                  </button>
                )}
              </div>

              {giftConfirmations.length === 0 ? (
                <div className="empty-gift-notice" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <Package size={48} style={{ color: '#d4af37', margin: '0 auto 1rem', display: 'block' }} />
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--batak-dark)' }}>Belum Ada Kado yang Dikonfirmasi</h4>
                  <p style={{ maxWidth: '460px', margin: '0 auto', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Ketika tamu undangan mengisi formulir di bagian <strong>"Kirim Kado & Konfirmasi"</strong> pada website undangan, data kado beserta nomor resi kurir akan otomatis muncul di halaman ini.
                  </p>
                </div>
              ) : (
                <div className="incoming-gifts-grid">
                  {giftConfirmations.map((g, index) => (
                    <div key={g.id || index} className="incoming-gift-card">
                      <div className="incoming-gift-top">
                        <div>
                          <strong className="incoming-sender-name" style={{ fontSize: '1.05rem' }}>
                            {g.senderName}
                          </strong>
                          {g.senderPhone && (
                            <span className="incoming-sender-phone"> • {g.senderPhone}</span>
                          )}
                        </div>
                        <span className="gift-channel-tag">{g.channel || 'Website'}</span>
                      </div>

                      <div className="incoming-gift-body">
                        <p className="incoming-gift-item" style={{ fontSize: '0.92rem' }}>
                          🎁 <strong>Kado:</strong> {g.giftItem || 'Tanda Kasih Pernikahan'}
                        </p>
                        <p className="incoming-courier">
                          🚚 <strong>Ekspedisi / Kurir:</strong> {g.courier} 
                          {g.trackingNumber ? (
                            <span style={{ marginLeft: '0.5rem' }}>
                              (No. Resi: <code style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{g.trackingNumber}</code>)
                            </span>
                          ) : ' (Tanpa nomor resi / Antar langsung)'}
                        </p>
                        {g.giftMessage && (
                          <p className="incoming-gift-msg">
                            💌 "{g.giftMessage}"
                          </p>
                        )}
                        <span className="incoming-date">
                          Waktu Konfirmasi: {new Date(g.timestamp).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="incoming-gift-actions">
                        {g.trackingNumber && (
                          <button 
                            className="btn-adm-mini"
                            onClick={() => {
                              navigator.clipboard.writeText(g.trackingNumber);
                              triggerToast('Nomor resi berhasil disalin!');
                            }}
                          >
                            <Copy size={13} />
                            <span>Salin Resi</span>
                          </button>
                        )}
                        {g.senderPhone && (
                          <a 
                            href={`https://wa.me/62${g.senderPhone.replace(/^0/, '').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(g.senderName)},%20kami%20Yenricho%20%26%20Veni%20mengucapkan%20terima%20kasih%20banyak%20atas%20perhatian%20dan%20kado%20pernikahan%20yang%20telah%20dikirimkan...`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-adm-mini btn-wa-mini"
                          >
                            <MessageCircle size={13} />
                            <span>Balas WA Tamu</span>
                          </a>
                        )}
                        <button 
                          className="btn-adm-mini danger"
                          onClick={() => {
                            if (window.confirm(`Hapus catatan konfirmasi kado dari ${g.senderName}?`)) {
                              const filtered = giftConfirmations.filter(item => item.id !== g.id);
                              setGiftConfirmations(filtered);
                              localStorage.setItem('wedding_gift_confirmations', JSON.stringify(filtered));
                              triggerToast('Catatan kado dihapus');
                            }
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CETAK AMPLOP & PDF */}
        {activeTab === 'print' && (
          <div className="admin-tab-pane">
            <div className="admin-card max-w-800">
              <h3 className="card-section-title">
                <Printer size={18} className="gold-text" />
                Cetak Amplop Fisik & Export PDF
              </h3>
              <p className="card-desc">
                Desain amplop fisik mewah resolusi tinggi (format A5 Landscape) siap cetak di percetakan atau printer rumahan.
              </p>

              <div className="print-actions-box">
                <div className="print-action-card">
                  <h4>Preview & Cetak Layar</h4>
                  <p>Lihat pratinjau amplop dalam ukuran cetak asli dan cetak langsung via dialog Print browser.</p>
                  <button className="btn-adm-secondary" onClick={onOpenPrintModal}>
                    <Printer size={16} />
                    <span>Buka Modal Pratinjau Cetak</span>
                  </button>
                </div>

                <div className="print-action-card highlight">
                  <h4>Download PDF Satuan</h4>
                  <p>Download file PDF resolusi tinggi untuk amplop dengan nama tamu aktif saat ini.</p>
                  <button 
                    className="btn-adm-primary" 
                    onClick={onExportSinglePdf}
                    disabled={isExporting}
                  >
                    <Download size={16} />
                    <span>{isExporting ? 'Memproses PDF...' : 'Download PDF Amplop Ini'}</span>
                  </button>
                </div>

                <div className="print-action-card gold-border">
                  <h4>Download Bulk PDF Seluruh Keluarga</h4>
                  <p>Download seluruh ({bulkList.length}) amplop keluarga sekaligus ke dalam file PDF multi-halaman.</p>
                  <button 
                    className="btn-adm-gold" 
                    onClick={onExportBulkPdf}
                    disabled={isExporting}
                  >
                    <Download size={16} />
                    <span>{isExporting ? 'Memproses Semua...' : `Export Semua (${bulkList.length} Halaman PDF)`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* QR Code Modal Popup */}
      {qrModalGuest && (
        <div className="qr-modal-backdrop" onClick={() => setQrModalGuest(null)}>
          <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="qr-modal-close" 
              onClick={() => setQrModalGuest(null)}
              title="Tutup"
            >
              <X size={18} />
            </button>

            <div className="qr-modal-header">
              <div className="qr-modal-icon-wrap">
                <QrCode size={24} />
              </div>
              <h3 className="qr-modal-title">QR Code Undangan Khusus</h3>
              <p className="qr-modal-subtitle">Untuk: <strong>{qrModalGuest}</strong></p>
            </div>

            <div className="qr-code-img-container">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generateGuestLink(qrModalGuest))}&margin=10`} 
                alt={`QR Code untuk ${qrModalGuest}`}
                className="qr-image"
                loading="lazy"
              />
              <span className="qr-hint">Scan dengan kamera HP untuk langsung membuka amplop digital</span>
            </div>

            <div className="qr-modal-url-display">
              <code>{generateGuestLink(qrModalGuest)}</code>
            </div>

            <div className="qr-modal-actions">
              <button 
                className="btn-qr-action copy"
                onClick={() => handleCopyLink(qrModalGuest, 'qr')}
              >
                {copiedLinkIndex === 'qr' ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedLinkIndex === 'qr' ? 'Tersalin' : 'Salin Link'}</span>
              </button>

              <a 
                href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(generateGuestLink(qrModalGuest))}&margin=15`}
                download={`QR_Undangan_${qrModalGuest.replace(/[^a-zA-Z0-9]/g, '_')}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-qr-action download"
              >
                <Download size={16} />
                <span>Download Gambar QR</span>
              </a>

              <button 
                className="btn-qr-action wa"
                onClick={() => {
                  handleSendWa(qrModalGuest);
                  setQrModalGuest(null);
                }}
              >
                <MessageCircle size={16} />
                <span>Kirim WA</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

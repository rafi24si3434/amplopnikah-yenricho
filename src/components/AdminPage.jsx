import React, { useState, useEffect } from 'react';
import { 
  Users, Edit3, Share2, CreditCard, Printer, Download, ExternalLink, 
  RotateCcw, Sparkles, Plus, Trash2, Check, Copy, MessageCircle, 
  QrCode, FileSpreadsheet, CheckCircle2, Clock, Search, ArrowLeft, 
  Gift, Building2, Heart, Send, X, Eye
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
    return 'https://amplopnikah-yenricho-veni.vercel.app/';
  };

  const generateGuestLink = (guestName) => {
    const base = getBaseUrl();
    const encoded = encodeURIComponent(guestName || '');
    return `${base}?to=${encoded}`;
  };

  // WhatsApp Message Generator
  const generateWaMessage = (guestName) => {
    const link = generateGuestLink(guestName);
    const groom = data.groomName || 'Yenricho';
    const bride = data.brideName || 'Veni';
    const sender = data.senderName ? `\nDari: ${data.senderName}` : '';
    
    if (waTemplateType === 'batak') {
      return `Shalom & Horas,\n\nKepada Yth. *${guestName}*,\n\nDengan memohon berkat dan penyertaan Tuhan Yang Maha Esa, perkenankan kami mengundang Bapak/Ibu/Doli/Inang/Saudara/i untuk menghadiri acara Pemberkatan Nikah dan Pesta Adat pernikahan kami:\n\n💍 *${groom} & ${bride}*${sender}\n\nUntuk melihat rincian acara, peta lokasi, dan amplop digital, silakan buka tautan undangan resmi berikut:\n👉 ${link}\n\nMerupakan suatu kehormatan dan sukacita yang besar bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.\n\nMauliate godang, Tuhan memberkati.`;
    }

    if (waTemplateType === 'keluarga') {
      return `Halo *${guestName}*,\n\nKabar bahagia dari kami! Dengan rasa syukur, kami ingin mengundang keluarga/sahabat tercinta ke hari pernikahan kami:\n\n💍 *${groom} & ${bride}*${sender}\n\nBuka undangan digital khusus untukmu di sini:\n👉 ${link}\n\nKehadiran dan doa restu dari kalian sangat berarti bagi kami berdua.\n\nSampai jumpa di hari bahagia kami! ❤️✨`;
    }

    // Default Formal
    return `Yth. *${guestName}*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:\n\n💍 *${groom} & ${bride}*${sender}\n\nUntuk melihat undangan dan amplop digital lengkap, silakan buka tautan berikut:\n👉 ${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;
  };

  const handleCopyLink = (guestName, indexKey) => {
    const link = generateGuestLink(guestName);
    navigator.clipboard.writeText(link);
    setCopiedLinkIndex(indexKey);
    triggerToast(`Link untuk "${guestName}" berhasil disalin!`);
    setTimeout(() => setCopiedLinkIndex(null), 2500);
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
            <span>Rekening & Kado Fisik</span>
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
                    Formal & Sopan
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

              <h4 className="sub-section-title">Alamat Pengiriman Kado Fisik</h4>
              <div className="gift-address-form">
                <div className="form-group">
                  <label className="admin-label">Alamat Lengkap Dumai:</label>
                  <textarea 
                    rows={3}
                    value={data.giftAddress ? `${data.giftAddress.recipient} - ${data.giftAddress.phone}\n${data.giftAddress.address}` : ''}
                    readOnly
                    className="admin-textarea"
                  />
                  <span className="input-hint">
                    Penerima: Veni Gracia Sitanggang (0821-7299-8806) / Yenricho Silaban (0822-8356-9169) - Dumai, Riau.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CETAK AMPLOP & PDF */}
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

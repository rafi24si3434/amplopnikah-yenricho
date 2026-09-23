import React, { useState, useEffect } from 'react';
import { 
  Edit3, Users, FileText, ChevronLeft, ChevronRight, 
  RotateCcw, Sparkles, Download, Printer, X, Plus, Trash2, Check,
  Share2, Copy, Send, ExternalLink, MessageCircle, QrCode, FileSpreadsheet, CheckCircle2
} from 'lucide-react';

export default function NameEditorPanel({
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
  isExporting
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('single'); // 'single', 'quick', 'bulk', 'share'
  const [newGuestInput, setNewGuestInput] = useState('');
  const [bulkTextInput, setBulkTextInput] = useState(() => 
    bulkList.length > 0 ? bulkList.join('\n') : ''
  );
  const [showToast, setShowToast] = useState('');
  const [copiedLinkIndex, setCopiedLinkIndex] = useState(null);
  const [waTemplateType, setWaTemplateType] = useState('formal'); // 'formal', 'keluarga', 'batak'
  const [qrModalGuest, setQrModalGuest] = useState(null);

  // Sent tracker persisted in localStorage
  const [sentStatus, setSentStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('amplop_sent_status');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const totalSentCount = bulkList.filter(guest => !!sentStatus[guest]).length;

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2500);
  };

  // Base domain for link sharing
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    }
    return 'https://amplopnikah.vercel.app/';
  };

  // Generate invitation link for a guest name
  const generateGuestLink = (guestName) => {
    const base = getBaseUrl();
    const encoded = encodeURIComponent(guestName || '');
    return `${base}?to=${encoded}`;
  };

  // Generate WhatsApp message based on chosen template
  const generateWaMessage = (guestName) => {
    const link = generateGuestLink(guestName);
    const groom = data.groomName || 'Yenricho';
    const bride = data.brideName || 'Veni';
    const targetGuest = guestName?.trim() || 'Bapak/Ibu/Saudara/i';
    
    if (waTemplateType === 'batak') {
      return `Shalom & Horas,\n\nKepada Yth.\nBapak/Ibu/Doli/Inang/Saudara/i\n*${targetGuest}*\n_______\n\nDengan memohon berkat dan penyertaan Tuhan Yang Maha Esa, perkenankan kami mengundang Bapak/Ibu/Doli/Inang/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara Pemberkatan Nikah dan Pesta Adat pernikahan kami:\n\n*${groom} dan ${bride}*\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n${link}\n\nMerupakan suatu kehormatan dan sukacita yang besar bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.\n\nNote:\nUntuk mendapatkan hasil yg bagus, harap buka melalui google chrome terupdate.\n\nMauliate godang, Tuhan memberkati.\n\nTerima Kasih\n\nHormat kami,\n${groom} dan ${bride}\n________`;
    }

    if (waTemplateType === 'keluarga') {
      return `Halo *${targetGuest}*,\n_______\n\nKabar bahagia dari kami! Dengan rasa syukur, perkenankan kami mengundang Bapak/Ibu/Saudara/i, keluarga, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami:\n\n*${groom} dan ${bride}*\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n${link}\n\nKehadiran dan doa restu dari kalian sangat berarti bagi kami berdua.\n\nNote:\nUntuk mendapatkan hasil yg bagus, harap buka melalui google chrome terupdate.\n\nTerima Kasih ❤️\n\nHormat kami,\n${groom} dan ${bride}\n________`;
    }

    // Default Formal: Persis format template referensi yang diminta user
    return `Kepada Yth.\nBapak/Ibu/Saudara/i\n*${targetGuest}*\n_______\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.\n\nBerikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n${link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nNote:\nUntuk mendapatkan hasil yg bagus, harap buka melalui google chrome terupdate.\n\nTerima Kasih\n\nHormat kami,\n${groom} dan ${bride}\n________`;
  };

  const handleCopyLink = (guestName, indexKey = 'single') => {
    const link = generateGuestLink(guestName);
    navigator.clipboard.writeText(link);
    setCopiedLinkIndex(indexKey);
    triggerToast(`Link untuk "${guestName}" berhasil disalin!`);
    setTimeout(() => setCopiedLinkIndex(null), 2500);
  };

  const handleSendWa = (guestName, phone = '') => {
    const text = encodeURIComponent(generateWaMessage(guestName));
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    
    // Automatically mark as sent
    toggleSentStatus(guestName, true);
    window.open(url, '_blank');
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

  // Download all links as Excel/CSV
  const downloadCsvRecap = () => {
    if (bulkList.length === 0) return;
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
    triggerToast('Rekap link CSV berhasil diunduh!');
  };

  // Handle single inputs
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Quick guest pick
  const handleSelectQuickGuest = (name) => {
    setData(prev => ({ ...prev, recipientName: name }));
    triggerToast(`Tamu diubah: "${name}"`);
  };

  // Add guest to quick list
  const handleAddQuickGuest = (e) => {
    e.preventDefault();
    const trimmed = newGuestInput.trim();
    if (!trimmed) return;
    if (!guestList.includes(trimmed)) {
      setGuestList(prev => [...prev, trimmed]);
      setData(prev => ({ ...prev, recipientName: trimmed }));
      triggerToast(`"${trimmed}" ditambahkan ke daftar tamu`);
    }
    setNewGuestInput('');
  };

  // Remove guest from quick list
  const handleRemoveQuickGuest = (nameToRemove, e) => {
    e.stopPropagation();
    setGuestList(prev => prev.filter(g => g !== nameToRemove));
  };

  // Process bulk names
  const handleApplyBulk = () => {
    const lines = bulkTextInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      alert('Silakan masukkan minimal 1 nama tamu.');
      return;
    }

    setBulkList(lines);
    setActiveBulkIndex(0);
    setData(prev => ({ ...prev, recipientName: lines[0] }));
    triggerToast(`Berhasil generate ${lines.length} amplop!`);
  };

  // Pager navigation
  const handlePrevBulk = () => {
    if (bulkList.length === 0) return;
    const nextIdx = (activeBulkIndex - 1 + bulkList.length) % bulkList.length;
    setActiveBulkIndex(nextIdx);
    setData(prev => ({ ...prev, recipientName: bulkList[nextIdx] }));
  };

  const handleNextBulk = () => {
    if (bulkList.length === 0) return;
    const nextIdx = (activeBulkIndex + 1) % bulkList.length;
    setActiveBulkIndex(nextIdx);
    setData(prev => ({ ...prev, recipientName: bulkList[nextIdx] }));
  };

  const handleSelectBulkByIndex = (index) => {
    setActiveBulkIndex(index);
    setData(prev => ({ ...prev, recipientName: bulkList[index] }));
  };

  const totalSentCount = bulkList.filter(g => sentStatus[g]).length;

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="editor-toast">
          <Sparkles size={16} className="toast-icon" />
          <span>{showToast}</span>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalGuest && (
        <div className="qr-modal-overlay" onClick={() => setQrModalGuest(null)}>
          <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
            <div className="qr-modal-header">
              <div className="qr-modal-title">
                <QrCode size={20} className="gold-icon" />
                <h4>QR Code Khusus Tamu</h4>
              </div>
              <button className="btn-modal-close" onClick={() => setQrModalGuest(null)}>
                <X size={20} />
              </button>
            </div>

            <p className="qr-guest-name">{qrModalGuest}</p>
            
            <div className="qr-code-box">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(generateGuestLink(qrModalGuest))}`} 
                alt={`QR Code ${qrModalGuest}`}
                className="qr-img"
              />
            </div>

            <p className="qr-hint-text">
              Arahkan kamera HP ke QR Code ini untuk langsung membuka undangan atas nama <strong>{qrModalGuest}</strong>
            </p>

            <div className="qr-actions">
              <button 
                className="btn-editor-secondary"
                onClick={() => handleCopyLink(qrModalGuest, 'qr')}
              >
                <Copy size={15} />
                <span>Salin Link</span>
              </button>
              <button 
                className="btn-editor-primary"
                onClick={() => {
                  window.open(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(generateGuestLink(qrModalGuest))}`, '_blank');
                }}
              >
                <Download size={15} />
                <span>Download QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="editor-floating-trigger">
        <button 
          className={`btn-toggle-editor ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          title="Pengaturan Nama & Amplop"
        >
          <Edit3 size={18} />
          <span className="btn-label">Edit Nama & Amplop</span>
          <span className="live-badge">LIVE</span>
        </button>

        {/* Quick bulk pager indicator if bulk active */}
        {bulkList.length > 1 && (
          <div className="bulk-mini-pager">
            <button onClick={handlePrevBulk} title="Amplop Sebelumnya" className="mini-pager-btn">
              <ChevronLeft size={16} />
            </button>
            <span className="mini-pager-text">
              {activeBulkIndex + 1}/{bulkList.length}
            </span>
            <button onClick={handleNextBulk} title="Amplop Selanjutnya" className="mini-pager-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Drawer / Modal Panel */}
      {isOpen && (
        <div className="editor-drawer-overlay" onClick={() => setIsOpen(false)}>
          <div className="editor-drawer-content" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="editor-header">
              <div className="editor-header-title">
                <Sparkles size={18} className="gold-icon" />
                <h3>Pengaturan Nama Amplop Nikah</h3>
              </div>
              <button 
                className="btn-close-editor" 
                onClick={() => setIsOpen(false)}
                title="Tutup Panel"
              >
                <X size={20} />
              </button>
            </div>

            <p className="editor-subtitle">
              ⚡ <strong>Live Preview Aktif:</strong> Ketik nama baru, tampilan amplop langsung terupdate tanpa reload atau simpan.
            </p>

            {/* Navigation Tabs */}
            <div className="editor-tabs">
              <button 
                className={`editor-tab-btn ${activeTab === 'single' ? 'active' : ''}`}
                onClick={() => setActiveTab('single')}
              >
                <Edit3 size={15} />
                <span>Ganti Nama</span>
              </button>
              <button 
                className={`editor-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
                onClick={() => setActiveTab('quick')}
              >
                <Users size={15} />
                <span>Daftar Tamu ({guestList.length})</span>
              </button>
              <button 
                className={`editor-tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
                onClick={() => setActiveTab('bulk')}
              >
                <FileText size={15} />
                <span>Banyak Nama ({bulkList.length})</span>
              </button>
              <button 
                className={`editor-tab-btn ${activeTab === 'share' ? 'active' : ''}`}
                onClick={() => setActiveTab('share')}
              >
                <Share2 size={15} />
                <span>Bagikan Link & WA</span>
              </button>
            </div>

            {/* TAB 1: GANTI NAMA (LIVE PREVIEW) */}
            {activeTab === 'single' && (
              <div className="editor-tab-body">
                
                {/* Nama Penerima / Tamu */}
                <div className="editor-form-group">
                  <label>Nama Penerima (Tamu Undangan)</label>
                  <input 
                    type="text"
                    value={data.recipientName}
                    onChange={(e) => handleChange('recipientName', e.target.value)}
                    placeholder="Contoh: Bapak Budi & Keluarga"
                    className="editor-input"
                  />
                  <small className="editor-hint">Ditampilkan pada kotak "Kepada Yth." di amplop.</small>
                </div>

                {/* Nama Pengirim */}
                <div className="editor-form-group">
                  <label>Nama Pengirim (Dari / Keluarga)</label>
                  <input 
                    type="text"
                    value={data.senderName}
                    onChange={(e) => handleChange('senderName', e.target.value)}
                    placeholder="Contoh: Keluarga Silaban / Saudara Andi"
                    className="editor-input"
                  />
                  <small className="editor-hint">Ditampilkan pada baris "Dari / Pengirim:" di amplop.</small>
                </div>

                {/* Nama Mempelai */}
                <div className="editor-grid-2">
                  <div className="editor-form-group">
                    <label>Mempelai Pria (Panggilan)</label>
                    <input 
                      type="text"
                      value={data.groomName}
                      onChange={(e) => handleChange('groomName', e.target.value)}
                      placeholder="Yenricho"
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-form-group">
                    <label>Mempelai Wanita (Panggilan)</label>
                    <input 
                      type="text"
                      value={data.brideName}
                      onChange={(e) => handleChange('brideName', e.target.value)}
                      placeholder="Veni"
                      className="editor-input"
                    />
                  </div>
                </div>

                <div className="editor-grid-2">
                  <div className="editor-form-group">
                    <label>Nama Lengkap Pria</label>
                    <input 
                      type="text"
                      value={data.groomFullName}
                      onChange={(e) => handleChange('groomFullName', e.target.value)}
                      placeholder="Yenricho Noprian T Silaban"
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-form-group">
                    <label>Nama Lengkap Wanita</label>
                    <input 
                      type="text"
                      value={data.brideFullName}
                      onChange={(e) => handleChange('brideFullName', e.target.value)}
                      placeholder="Veni Gracia Br Sitanggang, S.Pd"
                      className="editor-input"
                    />
                  </div>
                </div>

                <div className="editor-grid-2">
                  <div className="editor-form-group">
                    <label>Orang Tua Pria ({data.groomChildOrder || 'Putra pertama'})</label>
                    <input 
                      type="text"
                      value={data.groomParents || 'Bapak B. Silaban & Ibu R. Panjaitan'}
                      onChange={(e) => handleChange('groomParents', e.target.value)}
                      placeholder="Bapak B. Silaban & Ibu R. Panjaitan"
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-form-group">
                    <label>Orang Tua Wanita ({data.brideChildOrder || 'Putri terakhir'})</label>
                    <input 
                      type="text"
                      value={data.brideParents || 'Bapak A. Sitanggang & Ibu R. Manurung'}
                      onChange={(e) => handleChange('brideParents', e.target.value)}
                      placeholder="Bapak A. Sitanggang & Ibu R. Manurung"
                      className="editor-input"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="editor-action-row">
                  <button 
                    type="button" 
                    className="btn-editor-secondary"
                    onClick={onResetData}
                  >
                    <RotateCcw size={15} />
                    <span>Reset ke Awal</span>
                  </button>
                  <button 
                    type="button"
                    className="btn-editor-primary"
                    onClick={onOpenPrintModal}
                  >
                    <Printer size={15} />
                    <span>Cetak / PDF Amplop</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: DAFTAR NAMA TAMU (QUICK SWITCHER) */}
            {activeTab === 'quick' && (
              <div className="editor-tab-body">
                <p className="tab-instructions">
                  Klik salah satu nama di bawah untuk langsung mengganti nama penerima pada amplop:
                </p>

                {/* Guest Chips */}
                <div className="guest-chips-container">
                  {guestList.map((guest, idx) => {
                    const isSelected = data.recipientName === guest;
                    return (
                      <div 
                        key={idx} 
                        className={`guest-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectQuickGuest(guest)}
                      >
                        {isSelected && <Check size={14} className="chip-check" />}
                        <span className="chip-name">{guest}</span>
                        <button 
                          className="chip-remove"
                          onClick={(e) => handleRemoveQuickGuest(guest, e)}
                          title="Hapus dari daftar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add new guest form */}
                <form onSubmit={handleAddQuickGuest} className="add-guest-form">
                  <input 
                    type="text" 
                    value={newGuestInput}
                    onChange={(e) => setNewGuestInput(e.target.value)}
                    placeholder="Tambah nama tamu baru..."
                    className="editor-input"
                  />
                  <button type="submit" className="btn-add-guest">
                    <Plus size={16} />
                    <span>Tambah</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: BULK NAME GENERATOR & PDF */}
            {activeTab === 'bulk' && (
              <div className="editor-tab-body">
                <p className="tab-instructions">
                  Masukkan banyak nama keluarga / penerima sekaligus (1 baris untuk 1 nama). Sistem akan membuat variasi amplop untuk setiap nama.
                </p>

                <textarea 
                  className="bulk-textarea"
                  rows={6}
                  value={bulkTextInput}
                  onChange={(e) => setBulkTextInput(e.target.value)}
                  placeholder={`Keluarga Besar Bpk. Ahmad\nKeluarga Bpk. Budi\nOpung Maria & Keluarga\nTulang Silaban & Keluarga\nSaudara Andi`}
                />

                <div className="bulk-apply-row">
                  <button 
                    type="button" 
                    className="btn-editor-primary full-width"
                    onClick={handleApplyBulk}
                  >
                    <Sparkles size={16} />
                    <span>Generate Amplop ({bulkTextInput.split('\n').filter(s => s.trim()).length} Nama)</span>
                  </button>
                </div>

                {/* Bulk Pager Controls */}
                {bulkList.length > 0 && (
                  <div className="bulk-controls-card">
                    <div className="bulk-status-row">
                      <span>Pratinjau Variasi Amplop:</span>
                      <strong>Amplop {activeBulkIndex + 1} dari {bulkList.length}</strong>
                    </div>

                    <div className="bulk-nav-buttons">
                      <button 
                        className="btn-pager" 
                        onClick={handlePrevBulk}
                        title="Sebelumnya"
                      >
                        <ChevronLeft size={16} />
                        <span>Sebelumnya</span>
                      </button>

                      {/* Dropdown jump */}
                      <select 
                        className="bulk-dropdown"
                        value={activeBulkIndex}
                        onChange={(e) => handleSelectBulkByIndex(Number(e.target.value))}
                      >
                        {bulkList.map((name, i) => (
                          <option key={i} value={i}>
                            {i + 1}. {name}
                          </option>
                        ))}
                      </select>

                      <button 
                        className="btn-pager" 
                        onClick={handleNextBulk}
                        title="Selanjutnya"
                      >
                        <span>Selanjutnya</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* PDF Export actions */}
                    <div className="bulk-export-actions">
                      <button 
                        className="btn-export-pdf" 
                        onClick={onExportSinglePdf}
                        disabled={isExporting}
                      >
                        <Download size={15} />
                        <span>{isExporting ? 'Memproses...' : 'Export PDF Amplop Ini'}</span>
                      </button>

                      <button 
                        className="btn-export-pdf gold"
                        onClick={onExportBulkPdf}
                        disabled={isExporting}
                      >
                        <Download size={15} />
                        <span>{isExporting ? 'Memproses Semua...' : `Export Semua (${bulkList.length} PDF)`}</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: BAGIKAN LINK & WHATSAPP (SOLUSI LINK KHUSUS KELUARGA / TAMU) */}
            {activeTab === 'share' && (
              <div className="editor-tab-body">
                
                {/* Explanatory Banner */}
                <div className="share-guide-banner">
                  <Sparkles size={20} className="gold-icon" />
                  <div>
                    <strong>Solusi Mengirim Link ke Berbagai Keluarga:</strong>
                    <p>
                      Setiap keluarga mendapatkan link unik berparameter <code>?to=Nama+Keluarga</code>. Ketika link dibuka oleh keluarga di HP-nya, nama pada amplop otomatis bertuliskan nama mereka secara personal!
                    </p>
                  </div>
                </div>

                {/* Pilih Template WhatsApp */}
                <div className="wa-template-selector">
                  <label className="selector-label">Pilih Gaya Pesan WhatsApp:</label>
                  <div className="template-radio-group">
                    <button 
                      type="button"
                      className={`template-pill ${waTemplateType === 'formal' ? 'active' : ''}`}
                      onClick={() => setWaTemplateType('formal')}
                    >
                      Formal & Sopan
                    </button>
                    <button 
                      type="button"
                      className={`template-pill ${waTemplateType === 'keluarga' ? 'active' : ''}`}
                      onClick={() => setWaTemplateType('keluarga')}
                    >
                      Hangat & Santai
                    </button>
                    <button 
                      type="button"
                      className={`template-pill ${waTemplateType === 'batak' ? 'active' : ''}`}
                      onClick={() => setWaTemplateType('batak')}
                    >
                      Khas Batak (Horas)
                    </button>
                  </div>
                </div>

                {/* Active Guest Link Card */}
                <div className="share-card-highlight">
                  <div className="share-card-header-row">
                    <span className="share-card-tag">Tamu / Keluarga Aktif Saat Ini</span>
                    <button 
                      className="btn-mini-qr"
                      onClick={() => setQrModalGuest(data.recipientName)}
                      title="Lihat QR Code"
                    >
                      <QrCode size={14} />
                      <span>QR Code</span>
                    </button>
                  </div>
                  
                  <h4 className="share-guest-name">{data.recipientName}</h4>
                  
                  <div className="share-link-box">
                    <input 
                      type="text" 
                      readOnly 
                      value={generateGuestLink(data.recipientName)}
                      className="share-link-input"
                    />
                    <button 
                      className={`btn-share-copy ${copiedLinkIndex === 'active' ? 'copied' : ''}`}
                      onClick={() => handleCopyLink(data.recipientName, 'active')}
                    >
                      {copiedLinkIndex === 'active' ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedLinkIndex === 'active' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  <div className="share-action-buttons">
                    <button 
                      className="btn-share-wa"
                      onClick={() => handleSendWa(data.recipientName)}
                    >
                      <MessageCircle size={17} />
                      <span>Kirim Undangan via WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Bulk Sharing Section with Progress Tracker & CSV Download */}
                <div className="bulk-share-section">
                  <div className="bulk-share-header">
                    <div>
                      <h4 className="bulk-share-title">Daftar Kirim ke Keluarga ({bulkList.length})</h4>
                      <span className="bulk-progress-badge">
                        Progres Terkirim: {totalSentCount} dari {bulkList.length} Keluarga
                      </span>
                    </div>

                    <button 
                      className="btn-download-csv"
                      onClick={downloadCsvRecap}
                      title="Download Rekap Daftar Link ke File Excel / CSV"
                    >
                      <FileSpreadsheet size={15} />
                      <span>Download Excel/CSV</span>
                    </button>
                  </div>

                  <div className="bulk-share-list">
                    {bulkList.map((guest, idx) => {
                      const isSent = !!sentStatus[guest];
                      return (
                        <div key={idx} className={`bulk-share-item ${isSent ? 'is-sent' : ''}`}>
                          <div className="bulk-share-name">
                            <button 
                              className={`btn-check-sent ${isSent ? 'checked' : ''}`}
                              onClick={() => toggleSentStatus(guest)}
                              title={isSent ? 'Tandai Belum Terkirim' : 'Tandai Sudah Terkirim'}
                            >
                              <Check size={12} />
                            </button>
                            <span className="bulk-idx">{idx + 1}.</span>
                            <span className="bulk-title">{guest}</span>
                            {isSent && <span className="tag-terkirim">Terkirim</span>}
                          </div>

                          <div className="bulk-share-btns">
                            <button 
                              className="btn-mini-action qr"
                              onClick={() => setQrModalGuest(guest)}
                              title="Tampilkan QR Code"
                            >
                              <QrCode size={13} />
                            </button>
                            <button 
                              className={`btn-mini-action ${copiedLinkIndex === idx ? 'copied' : ''}`}
                              onClick={() => handleCopyLink(guest, idx)}
                              title="Salin Link Khusus"
                            >
                              {copiedLinkIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedLinkIndex === idx ? 'Disalin' : 'Salin'}</span>
                            </button>
                            <button 
                              className="btn-mini-action wa"
                              onClick={() => handleSendWa(guest)}
                              title="Kirim Langsung via WhatsApp"
                            >
                              <MessageCircle size={13} />
                              <span>Kirim WA</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

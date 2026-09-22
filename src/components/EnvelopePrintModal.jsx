import React, { useRef, useState } from 'react';
import { X, Printer, Download, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EnvelopePrintModal({
  isOpen,
  onClose,
  data,
  bulkList,
  activeBulkIndex,
  setActiveBulkIndex,
  onExportSinglePdf,
  onExportBulkPdf,
  isExporting
}) {
  const envelopeCardRef = useRef(null);

  if (!isOpen) return null;

  const currentRecipient = bulkList.length > 0 ? bulkList[activeBulkIndex] : data.recipientName;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="envelope-modal-overlay" onClick={onClose}>
      <div className="envelope-modal-dialog" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="envelope-modal-header">
          <div className="modal-header-left">
            <Sparkles className="gold-icon" size={20} />
            <div>
              <h3>Pratinjau Amplop Siap Cetak & PDF</h3>
              <p>Format proporsional kartu amplop nikah mewah (Gold Foil Style)</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Bulk Pager if multiple */}
        {bulkList.length > 1 && (
          <div className="modal-bulk-nav">
            <button 
              className="btn-modal-nav"
              onClick={() => setActiveBulkIndex((activeBulkIndex - 1 + bulkList.length) % bulkList.length)}
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>
            <span className="modal-bulk-badge">
              Amplop {activeBulkIndex + 1} dari {bulkList.length} : <strong>{currentRecipient}</strong>
            </span>
            <button 
              className="btn-modal-nav"
              onClick={() => setActiveBulkIndex((activeBulkIndex + 1) % bulkList.length)}
            >
              Selanjutnya <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* THE ENVELOPE CARD (Target for Print & PDF capture) */}
        <div className="envelope-print-stage">
          <div className="printable-envelope" id="printable-envelope" ref={envelopeCardRef}>
            
            {/* Outer Frame Border */}
            <div className="envelope-border-outer">
              <div className="envelope-border-inner">
                
                {/* Corner Ornaments */}
                <div className="corner-ornament top-left">✦</div>
                <div className="corner-ornament top-right">✦</div>
                <div className="corner-ornament bottom-left">✦</div>
                <div className="corner-ornament bottom-right">✦</div>

                {/* Top Header */}
                <div className="envelope-header">
                  <div className="envelope-ornament-svg">
                    <svg viewBox="0 0 200 30" className="envelope-svg">
                      <path d="M0,15 Q50,0 100,15 Q150,30 200,15" stroke="#C9A96E" fill="none" strokeWidth="1.2" />
                      <circle cx="100" cy="15" r="3" fill="#C9A96E" />
                    </svg>
                  </div>
                  <p className="envelope-subtitle">THE WEDDING OF</p>
                  <h1 className="envelope-couple-names">
                    {data.groomName || 'Yenricho'} & {data.brideName || 'Veni'}
                  </h1>
                  <p className="envelope-date">{data.weddingDateText || 'Sabtu, 03 Oktober 2026'}</p>
                </div>

                {/* Envelope Center / Recipient Box */}
                <div className="envelope-recipient-box">
                  <p className="recipient-label">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                  <h2 className="recipient-name">
                    {currentRecipient || 'Bapak/Ibu/Saudara/i'}
                  </h2>
                  {data.senderName && (
                    <div className="recipient-sender">
                      <span className="sender-tag">Dari / Pengirim:</span>
                      <span className="sender-val">{data.senderName}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Footer info */}
                <div className="envelope-footer">
                  <p className="envelope-venue">Gereja HKBP Dame Ressort Dame Duri & Sopo Margurosi</p>
                  <div className="envelope-ornament-svg">
                    <svg viewBox="0 0 200 30" className="envelope-svg">
                      <path d="M0,15 Q50,30 100,15 Q150,0 200,15" stroke="#C9A96E" fill="none" strokeWidth="1.2" />
                      <circle cx="100" cy="15" r="3" fill="#C9A96E" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="envelope-modal-actions">
          <button 
            type="button" 
            className="btn-modal-action secondary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Cetak Langsung (Print)</span>
          </button>

          <button 
            type="button" 
            className="btn-modal-action primary"
            onClick={onExportSinglePdf}
            disabled={isExporting}
          >
            <Download size={16} />
            <span>{isExporting ? 'Sedang Export...' : 'Download PDF Amplop Ini'}</span>
          </button>

          {bulkList.length > 1 && (
            <button 
              type="button" 
              className="btn-modal-action gold"
              onClick={onExportBulkPdf}
              disabled={isExporting}
            >
              <Download size={16} />
              <span>{isExporting ? 'Memproses Semua...' : `Download Semua (${bulkList.length} Amplop PDF)`}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

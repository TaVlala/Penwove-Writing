import React from 'react';

function ExportMenu({
  show,
  onToggle,
  onExportTxt,
  onExportPdf,
  onExportDocx,
  onExportEpub,
  menuRef
}) {
  return (
    <div className="export-menu-wrap" ref={menuRef}>
      <button
        className={`btn btn-secondary btn-icon-only ${show ? 'active' : ''}`}
        onClick={() => onToggle(!show)}
        title="Export Document"
      >
        ↓
      </button>
      {show && (
        <div className="export-dropdown">
          <button onClick={onExportTxt} className="export-item">
            <span className="export-icon">📄</span>
            <div className="export-info">
              <span className="export-label">Plain Text</span>
              <span className="export-ext">.txt</span>
            </div>
          </button>
          <button onClick={onExportPdf} className="export-item">
            <span className="export-icon">📕</span>
            <div className="export-info">
              <span className="export-label">PDF Document</span>
              <span className="export-ext">.pdf</span>
            </div>
          </button>
          <button onClick={onExportDocx} className="export-item">
            <span className="export-icon">📘</span>
            <div className="export-info">
              <span className="export-label">Word Document</span>
              <span className="export-ext">.docx</span>
            </div>
          </button>
          <button onClick={onExportEpub} className="export-item">
            <span className="export-icon">📙</span>
            <div className="export-info">
              <span className="export-label">EPUB Book</span>
              <span className="export-ext">.epub</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(ExportMenu);

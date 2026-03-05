import React from 'react'

export default function Modal({ open, modalPath, onSetModalPath, onClose, onStartFromModal }) {
  const isQuote = modalPath === 'quote'

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-hd">
          <div className="modal-title">New Quote / Project</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="path-sel">
            <div className={`path-card${isQuote ? ' sel' : ''}`} onClick={() => onSetModalPath('quote')}>
              <div className="path-icon">⚡</div>
              <div className="path-name">From RFQ / Quote</div>
              <div className="path-desc">Run AI pipeline to generate quote first. Convert to project on win.</div>
            </div>
            <div className={`path-card${!isQuote ? ' sel' : ''}`} onClick={() => onSetModalPath('direct')}>
              <div className="path-icon">⊕</div>
              <div className="path-name">Direct Award</div>
              <div className="path-desc">Create project immediately, run AI processing from inside later.</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="e.g. SpaceX Drip Pan 2024" />
            </div>
            <div className="form-field">
              <label className="form-label">Client</label>
              <input className="form-input" placeholder="e.g. SpaceX Starbase" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Value ($)</label>
              <input className="form-input" placeholder="10000" />
            </div>
            <div className="form-field">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" />
            </div>
          </div>
          {isQuote ? (
            <div className="modal-note" style={{ background: 'var(--amber-g)', border: '1px solid var(--amber-r)', padding: '8px 10px', borderRadius: 4, fontSize: 10, color: 'var(--mid)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>⚡ AI Pipeline will launch</strong><br />
              You'll be taken to Ingest to upload sources. AI generates quote, BOM, and schedule.
            </div>
          ) : (
            <div className="modal-note" style={{ background: 'var(--purple-g)', border: '1px solid var(--purple-r)', padding: '8px 10px', borderRadius: 4, fontSize: 10, color: 'var(--mid)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--purple)', fontFamily: 'var(--mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>⊕ Direct project setup</strong><br />
              Project created immediately. Run AI processing later from inside the project.
            </div>
          )}
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-amber" onClick={onStartFromModal}>
            {isQuote ? '⚡ Start Pipeline →' : '⊕ Create Project →'}
          </button>
        </div>
      </div>
    </div>
  )
}

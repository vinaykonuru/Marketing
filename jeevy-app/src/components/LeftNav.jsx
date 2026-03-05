import React from 'react'
import { PJ } from '../App'

export default function LeftNav({
  role, mode, currentView, pipelineMode, activeProject, inProject, isPipeline, verifiedSrcs = new Set(), selectedSrc, onSelectSrc,
  onShowView, onGoStep, onExitPipeline, onEnterProject, onExitProject, onShowTool, onStartPipeline,
}) {
  // ── Floor / Shop nav ─────────────────────────────────────────────
  if (role === 'fl' || mode === 'shop') {
    return (
      <nav className="lnav">
        <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--b0)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--lo)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.1em' }}>Logged in as</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Marcus T.</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--lo)' }}>TIG Welder · Bay 3</div>
        </div>
        <div className="ln-sect">
          <div className="ln-item active">
            <span className="ln-icon" style={{ color: 'var(--green)' }}>✅</span>
            <span className="ln-text">My Tasks</span>
            <span className="ln-badge r">3</span>
          </div>
          <div className="ln-item">
            <span className="ln-icon">📐</span>
            <span className="ln-text">My Drawings</span>
          </div>
          <div className="ln-item">
            <span className="ln-icon">📦</span>
            <span className="ln-text">Material Check-In</span>
          </div>
        </div>
        <div style={{ marginTop: 'auto', padding: 8, borderTop: '1px solid var(--b0)' }}>
          <div className="ln-shift">
            <div className="ln-shift-lbl">● Shift Active</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--hi)', marginTop: 2 }}>Bay 3 · 3h 18m</div>
          </div>
        </div>
      </nav>
    )
  }

  // ── Pipeline nav (sources only; pipeline steps live in Topbar) ────
  if (isPipeline) {
    const sources = [
      { id: 'email',   icon: '✉', iconCls: 'vi-e', name: 'SpaceX RFQ Email',  verified: verifiedSrcs.has('email'),   state: 'verified' },
      { id: 'drawing', icon: '⊞', iconCls: 'vi-d', name: 'DripPan_Assy_Rev3', verified: verifiedSrcs.has('drawing'), state: 'needs_verify' },
      { id: 'photo',   icon: '◉', iconCls: 'vi-p', name: 'site_photos_jan',   verified: verifiedSrcs.has('photo'),   state: 'processing' },
      { id: 'audio',   icon: '♪', iconCls: 'vi-a', name: 'Voicenote_req',     verified: verifiedSrcs.has('audio'),   state: 'queued' },
    ]
    const inIngest = currentView === 'ingest'
    return (
      <nav className="lnav">
        <div className="ln-sect">
          <span className="ln-label">Sources</span>
          {sources.map((src) => {
            const selected = inIngest && selectedSrc === src.id
            return (
              <div
                key={src.id}
                className={`ln-item${selected ? ' active' : ''}`}
                style={{ padding: '6px 10px', cursor: inIngest ? 'pointer' : 'default' }}
                onClick={inIngest ? () => onSelectSrc?.(src.id) : undefined}
              >
                <div className={`vs-icon ${src.iconCls}`} style={{ width: 20, height: 20, fontSize: 10 }}>{src.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: src.verified ? 'var(--mid)' : 'var(--lo)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.name}</div>
                </div>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: src.verified ? 'var(--green)' : 'var(--amber)', flexShrink: 0, display: 'block' }} />
              </div>
            )
          })}
        </div>
        <div style={{ padding: 6 }}>
          <div className="drop-zone" style={{ padding: 8 }}>
            <div className="dz-l" style={{ fontSize: 10 }}>+ Add source</div>
          </div>
        </div>
        <div className="ln-div" />
        <div className="ln-sect">
          <div className="ln-item" onClick={onExitPipeline}>
            <span className="ln-icon">←</span>
            <span className="ln-text">Exit Pipeline</span>
          </div>
        </div>
      </nav>
    )
  }

  // ── In-project nav ───────────────────────────────────────────────
  if (inProject) {
    const p = PJ[activeProject]
    const sources = [
      { id: 'email',   icon: '✉', iconCls: 'vi-e', name: 'SpaceX RFQ Email',  verified: verifiedSrcs.has('email'),   state: 'verified' },
      { id: 'drawing', icon: '⊞', iconCls: 'vi-d', name: 'DripPan_Assy_Rev3', verified: verifiedSrcs.has('drawing'), state: 'needs_verify' },
      { id: 'photo',   icon: '◉', iconCls: 'vi-p', name: 'site_photos_jan',   verified: verifiedSrcs.has('photo'),   state: 'processing' },
      { id: 'audio',   icon: '♪', iconCls: 'vi-a', name: 'Voicenote_req',     verified: verifiedSrcs.has('audio'),   state: 'queued' },
    ]
    const inSources = currentView === 'ingest'

    return (
      <nav className="lnav">
        <div className="ln-ctx">
          <div className="ln-ctx-lbl">Active Project</div>
          <div className="ln-ctx-name">{p.name}</div>
          <div className="ln-ctx-meta">Due {p.due} · {p.prog}% complete</div>
          <div className="ln-ctx-prog"><div className="ln-ctx-fill" style={{ width: `${p.prog}%` }} /></div>
          <span className="ln-ctx-link" onClick={onExitProject}>← All Projects</span>
        </div>
        <div className="ln-div" />
        <div className="ln-sect">
          <span className="ln-label">Digest &amp; Sources</span>
          <div className={`ln-item${currentView === 'overview' ? ' active' : ''}`} onClick={() => onShowTool('overview')}>
            <span className="ln-icon">⊞</span><span className="ln-text">Overview</span>
          </div>
          <div className={`ln-item${currentView === 'digest' ? ' active' : ''}`} onClick={() => onShowTool('digest')}>
            <span className="ln-icon">📋</span><span className="ln-text">Digest</span>
          </div>
          <div className={`ln-item${inSources ? ' active' : ''}`} onClick={() => onShowTool('sources')}>
            <span className="ln-icon">⚡</span><span className="ln-text">Sources</span><span className="ln-badge">4</span>
          </div>
          {inSources && sources.map((src) => {
            const selected = selectedSrc === src.id
            return (
              <div
                key={src.id}
                className={`ln-item${selected ? ' active' : ''}`}
                style={{ padding: '6px 10px', paddingLeft: 20, cursor: 'pointer' }}
                onClick={() => onSelectSrc?.(src.id)}
              >
                <div className={`vs-icon ${src.iconCls}`} style={{ width: 20, height: 20, fontSize: 10 }}>{src.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: src.verified ? 'var(--mid)' : 'var(--lo)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.name}</div>
                </div>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: src.verified ? 'var(--green)' : 'var(--amber)', flexShrink: 0, display: 'block' }} />
              </div>
            )
          })}
          {inSources && (
            <div style={{ padding: '6px 10px 6px 20px' }}>
              <div className="drop-zone" style={{ padding: 8 }}>
                <div className="dz-l" style={{ fontSize: 10 }}>+ Add source</div>
              </div>
            </div>
          )}
        </div>
        <div className="ln-div" />
        <div className="ln-sect">
          <span className="ln-label">Files &amp; Tools</span>
          <div className={`ln-item${currentView === 'drawings' ? ' active' : ''}`} onClick={() => onShowTool('drawings')}>
            <span className="ln-icon">📐</span><span className="ln-text">Drawing Manager</span><span className="ln-badge">4</span>
          </div>
          <div className="ln-item" onClick={() => onShowTool('assembly')}>
            <span className="ln-icon">🔩</span><span className="ln-text">Assembly</span>
          </div>
          <div className="ln-item" onClick={() => onShowTool('takeoff')}>
            <span className="ln-icon">📊</span><span className="ln-text">Takeoff Dashboard</span>
          </div>
          <div className={`ln-item${currentView === 'tasking' ? ' active' : ''}`} onClick={() => onShowTool('tasking')}>
            <span className="ln-icon">✅</span><span className="ln-text">Tasking</span><span className="ln-badge r">5</span>
          </div>
          <div className="ln-item" onClick={() => onShowTool('materials')}>
            <span className="ln-icon">📦</span><span className="ln-text">Material Tracking</span>
          </div>
          <div className="ln-item" onClick={() => onShowTool('schedule')}>
            <span className="ln-icon">📅</span><span className="ln-text">Schedule</span>
          </div>
        </div>
      </nav>
    )
  }

  // ── Platform-level nav ───────────────────────────────────────────
  if (mode === 'pipeline') {
    return (
      <nav className="lnav">
        <div className="ln-sect">
          <span className="ln-label">Pipeline</span>
          <div className={`ln-item${currentView === 'quotes' ? ' active' : ''}`} onClick={() => onShowView('quotes')}>
            <span className="ln-icon">📋</span><span className="ln-text">Quotes</span><span className="ln-badge a">4</span>
          </div>
          <div className="ln-item" onClick={() => onStartPipeline('quote')}>
            <span className="ln-icon">⚡</span><span className="ln-text">New Quote</span>
          </div>
        </div>
        <div className="ln-div" />
        <div className="ln-sect">
          <span className="ln-label">Recent Projects</span>
          <div className="ln-item" onClick={() => onEnterProject('spacex')}>
            <span className="ln-icon" style={{ fontSize: 10 }}>🛸</span><span className="ln-text">SpaceX DripPan</span><span className="ln-badge g">live</span>
          </div>
          <div className="ln-item" onClick={() => onEnterProject('boeing')}>
            <span className="ln-icon" style={{ fontSize: 10 }}>✈</span><span className="ln-text">Boeing Figs</span>
          </div>
        </div>
        <div className="ln-div" />
        <div className="ln-sect">
          <span className="ln-label">Analytics</span>
          <div className="ln-item"><span className="ln-icon">📈</span><span className="ln-text">Win Rate</span></div>
          <div className="ln-item"><span className="ln-icon">💰</span><span className="ln-text">Revenue</span></div>
        </div>
      </nav>
    )
  }

  if (mode === 'projects') {
    return (
      <nav className="lnav">
        <div className="ln-sect">
          <span className="ln-label">Projects</span>
          <div className="ln-item active">
            <span className="ln-icon">⊞</span><span className="ln-text">All Projects</span><span className="ln-badge">7</span>
          </div>
          <div className="ln-item"><span className="ln-icon">📈</span><span className="ln-text">Overview</span></div>
          <div className="ln-item"><span className="ln-icon">👥</span><span className="ln-text">Team</span></div>
        </div>
        <div className="ln-div" />
        <div className="ln-sect">
          <span className="ln-label">Quick Access</span>
          <div className="ln-item" onClick={() => onEnterProject('spacex')}>
            <span className="ln-icon" style={{ fontSize: 10 }}>🛸</span><span className="ln-text">SpaceX DripPan</span><span className="ln-badge g">live</span>
          </div>
          <div className="ln-item" onClick={() => onEnterProject('boeing')}>
            <span className="ln-icon" style={{ fontSize: 10 }}>✈</span><span className="ln-text">Boeing Figs</span>
          </div>
          <div className="ln-item" onClick={() => onEnterProject('lockheed')}>
            <span className="ln-icon" style={{ fontSize: 10 }}>🔲</span><span className="ln-text">Lockheed Box</span>
          </div>
        </div>
      </nav>
    )
  }

  return <nav className="lnav" />
}

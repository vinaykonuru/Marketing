import React from 'react'

export default function QuotesView({ onOpenModal, onStartPipeline, convBannerShow, onShowConvBanner, onDismissConvBanner, onLaunchProject }) {
  return (
    <div className="view active">
      <div className="ch">
        <div className="ch-title">Quotes &amp; Pipeline</div>
        <div className="ch-sub">· AI-assisted quoting</div>
        <div className="ch-gap" />
        <button className="btn btn-ghost">Filter ▾</button>
        <button className="btn btn-amber" onClick={onOpenModal}>+ New Quote</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

        {convBannerShow && (
          <div className="conv-banner show">
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎉</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)', marginBottom: 2 }}>Lockheed Box Weldment — Bid Won!</div>
              <div style={{ fontSize: 11, color: 'var(--mid)', lineHeight: 1.5 }}>Digest ready to auto-provision a project. BOM, schedule, drawings pre-loaded.</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button className="btn btn-ghost" onClick={onDismissConvBanner}>Dismiss</button>
              <button className="btn btn-amber" onClick={onLaunchProject}>⚡ Launch Project →</button>
            </div>
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card"><div className="sc-l">Pipeline Value</div><div className="sc-v a">$284k</div><div className="sc-s">6 active quotes</div></div>
          <div className="stat-card"><div className="sc-l">Won YTD</div><div className="sc-v g">$1.2M</div><div className="sc-s">14 projects</div></div>
          <div className="stat-card"><div className="sc-l">Win Rate</div><div className="sc-v">67%</div><div className="sc-s">vs 58% last yr</div></div>
          <div className="stat-card"><div className="sc-l">Avg Cycle</div><div className="sc-v">3.2d</div><div className="sc-s">quote to send</div></div>
        </div>

        <div className="tbl-wrap">
          <div className="tbl-top">
            <div className="tbl-title">All Quotes</div>
            <div className="tbl-sub">· by activity</div>
            <input className="search" placeholder="Search…" style={{ marginLeft: 'auto' }} />
            <button className="btn btn-ghost" style={{ marginLeft: 6 }}>Export</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Project</th><th>Client</th><th>Status</th><th>Pipeline</th><th>Value</th><th>Due</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="crow" onClick={() => onStartPipeline('quote')}>
                <td><span className="td-hi">SpaceX Drip Pan Assy</span></td>
                <td className="td-mono">SpaceX Starbase</td>
                <td><span className="pill p-pipe">⟳ In Pipeline</span></td>
                <td><div className="pipe-dots"><div className="pd d"/><div className="pd a"/><div className="pd"/><div className="pd"/></div></td>
                <td className="td-a">$10,714</td><td className="td-mono">Mar 1</td>
                <td><button className="btn btn-ghost" style={{ height: 20, fontSize: 7, padding: '0 6px' }} onClick={(e) => { e.stopPropagation(); onStartPipeline('quote') }}>Continue →</button></td>
              </tr>
              <tr className="crow">
                <td><span className="td-hi">Boeing Figs Assy Rev2</span></td>
                <td className="td-mono">Boeing PDX</td>
                <td><span className="pill p-sent">Sent</span></td>
                <td><div className="pipe-dots"><div className="pd d"/><div className="pd d"/><div className="pd d"/><div className="pd d"/></div></td>
                <td className="td-a">$48,200</td><td className="td-mono">Feb 28</td>
                <td><button className="btn btn-ghost" style={{ height: 20, fontSize: 7, padding: '0 6px' }}>Follow up</button></td>
              </tr>
              <tr className="crow" onClick={onShowConvBanner}>
                <td><span className="td-hi">Lockheed Box Weldment</span></td>
                <td className="td-mono">Lockheed Martin</td>
                <td><span className="pill p-won">✓ Won</span></td>
                <td><div className="pipe-dots"><div className="pd d"/><div className="pd d"/><div className="pd d"/><div className="pd d"/></div></td>
                <td className="td-g">$67,500</td><td className="td-mono">Mar 14</td>
                <td><button className="btn btn-green" style={{ height: 20, fontSize: 7, padding: '0 6px' }} onClick={(e) => { e.stopPropagation(); onShowConvBanner() }}>Launch Project</button></td>
              </tr>
              <tr className="crow">
                <td><span className="td-hi">SpaceX Wipers Bracket</span></td>
                <td className="td-mono">SpaceX Starbase</td>
                <td><span className="pill p-draft">Draft</span></td>
                <td><div className="pipe-dots"><div className="pd d"/><div className="pd"/><div className="pd"/><div className="pd"/></div></td>
                <td className="td-a">$8,900</td><td className="td-mono">Mar 5</td>
                <td><button className="btn btn-ghost" style={{ height: 20, fontSize: 7, padding: '0 6px' }}>Resume</button></td>
              </tr>
              <tr className="crow">
                <td><span className="td-hi">Structural Frame Weld</span></td>
                <td className="td-mono">General Dynamics</td>
                <td><span className="pill p-lost">Lost</span></td>
                <td><div className="pipe-dots"><div className="pd d"/><div className="pd d"/><div className="pd d"/><div className="pd d"/></div></td>
                <td className="td-mono" style={{ color: 'var(--lo)' }}>$31,000</td><td className="td-mono" style={{ color: 'var(--lo)' }}>Feb 10</td>
                <td><button className="btn btn-ghost" style={{ height: 20, fontSize: 7, padding: '0 6px' }}>Archive</button></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

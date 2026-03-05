import React, { useState } from 'react'

export default function AIPanel() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`d-ai${collapsed ? ' collapsed' : ''}`}>
      <div className="ai-hd" onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer' }}>
        <div className="ai-hd-lbl"><div className="ai-dot"/><span>AI Assistant</span></div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--lo)', flexShrink: 0 }}>{collapsed ? '▶' : '◀'}</span>
      </div>
      {!collapsed && (
        <>
          <div className="ai-ctx">
            <div className="ai-ctx-lbl">Active Context</div>
            <div className="ai-chips">
              {['Quote','Digest','Schedule','BOM','AS9100'].map((c,i)=>(
                <div key={c} className={`ai-chip${i<2?' on':''}`}>{c}</div>
              ))}
            </div>
          </div>
          <div className="ai-msgs">
            <div className="msg">
              <div className="msg-hd"><div className="msg-av ai">J</div><div className="msg-name">JEEVY AI · Digest Agent</div></div>
              <div className="msg-body ai">Processed <strong>3 of 4 sources</strong>. Voicenote still transcribing. Extracted <strong>8 line items</strong>, flagged a <span className="ic">FAI</span> requirement — add to quote?</div>
            </div>
            <div className="msg">
              <div className="msg-hd"><div className="msg-av u">N</div><div className="msg-name">You</div></div>
              <div className="msg-body">Yes include FAI, what's my margin?</div>
            </div>
            <div className="msg">
              <div className="msg-hd"><div className="msg-av ai">J</div><div className="msg-name">JEEVY AI · Digest Agent</div></div>
              <div className="msg-body ai">Added <span className="ic">FAI Report</span> +$350. Total: <strong>$11,064</strong>. Margin <strong>18.2%</strong> — under 20% target. Can optimize with sheet drops from Boeing order.</div>
            </div>
          </div>
          <div className="qa-area">
            <div className="qa-lbl">Quick Actions</div>
            <div className="qa-grid">
              <div className="qa-btn">📋 Gen BOM</div>
              <div className="qa-btn">📅 Sim Schedule</div>
              <div className="qa-btn">✓ AS9100 Check</div>
              <div className="qa-btn">↗ Optimize Margin</div>
            </div>
          </div>
          <div className="ai-inp-wrap">
            <textarea className="ai-inp" placeholder="Ask about this project…" rows={1}/>
            <button className="ai-send">↑</button>
          </div>
        </>
      )}
    </div>
  )
}

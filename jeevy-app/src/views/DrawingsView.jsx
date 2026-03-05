import React from 'react'
import { PJ } from '../App'

export default function DrawingsView({ activeProject, onExitProject }) {
  const p = activeProject ? PJ[activeProject] : null
  const projName = p ? p.name : 'Project'

  return (
    <div className="view active">
      <div className="ch">
        <button className="ch-back" onClick={onExitProject}>← Projects</button>
        <div>
          <div className="ch-title">{projName}</div>
          <div className="ch-sub">Drawing Manager · 4 drawings</div>
        </div>
        <div className="ch-gap" />
        <button className="btn btn-amber">+ Upload</button>
      </div>
      <div className="dm-wrap">
        <div className="dm-list">
          <div className="dm-list-hd">Drawings (4)</div>
          <div className="dm-item active"><div className="dm-item-name">DripPan_Assy_Rev3.pdf</div><div className="dm-item-meta">ASSEMBLY · Rev 3</div></div>
          <div className="dm-item"><div className="dm-item-name">DripPan_Body_Detail.pdf</div><div className="dm-item-meta">DETAIL · Rev 2</div></div>
          <div className="dm-item"><div className="dm-item-name">Mounting_Bracket_Assy.pdf</div><div className="dm-item-meta">DETAIL · Rev 1</div></div>
          <div className="dm-item"><div className="dm-item-name">DripPan_Weld_Symbols.pdf</div><div className="dm-item-meta">WELD · Rev 3</div></div>
        </div>
        <div className="dm-canvas">
          <svg width="100%" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: 300 }}>
            <rect width="600" height="300" fill="#0c1016"/>
            <defs><pattern id="gp" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0L0 0 0 18" fill="none" stroke="#141c24" strokeWidth=".4"/></pattern></defs>
            <rect width="600" height="300" fill="url(#gp)"/>
            <rect x="8" y="8" width="584" height="284" fill="none" stroke="#253040" strokeWidth="1.2"/>
            <rect x="8" y="8" width="584" height="18" fill="none" stroke="#253040" strokeWidth=".5"/>
            <text x="300" y="20" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace" fontWeight="bold">DRIP PAN ASSEMBLY — REV 3 — AS9100 — JEEVY FABRICATION</text>
            <text x="88" y="42" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">FRONT VIEW</text>
            <rect x="22" y="48" width="132" height="88" fill="none" stroke="#5a8098" strokeWidth="1.3"/>
            <circle cx="88" cy="92" r="10" fill="none" stroke="#5a8098" strokeWidth="1"/>
            <circle cx="88" cy="92" r="3" fill="rgba(90,128,152,.3)"/>
            <line x1="22" y1="70" x2="46" y2="48" stroke="#5a8098" strokeWidth=".7"/>
            <line x1="154" y1="70" x2="130" y2="48" stroke="#5a8098" strokeWidth=".7"/>
            <line x1="88" y1="44" x2="88" y2="140" stroke="#253040" strokeWidth=".4" strokeDasharray="5,3"/>
            <line x1="16" y1="92" x2="160" y2="92" stroke="#253040" strokeWidth=".4" strokeDasharray="5,3"/>
            <rect x="22" y="48" width="132" height="88" fill="rgba(34,197,94,.07)" stroke="rgba(34,197,94,.5)" strokeWidth=".9" strokeDasharray="4,2"/>
            <circle cx="88" cy="92" r="14" fill="rgba(248,113,113,.1)" stroke="rgba(248,113,113,.6)" strokeWidth="1" strokeDasharray="4,2"/>
            <text x="248" y="42" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">SIDE VIEW</text>
            <rect x="190" y="48" width="116" height="88" fill="none" stroke="#5a8098" strokeWidth="1.3"/>
            <rect x="226" y="80" width="44" height="26" fill="none" stroke="#5a8098" strokeWidth=".8"/>
            <rect x="190" y="48" width="116" height="88" fill="rgba(34,197,94,.06)" stroke="rgba(34,197,94,.4)" strokeWidth=".9" strokeDasharray="4,2"/>
            <text x="440" y="42" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">TOP VIEW</text>
            <rect x="346" y="48" width="246" height="88" fill="none" stroke="#5a8098" strokeWidth="1.3"/>
            {[366,572].map(x => [66,118].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill="none" stroke="#5a8098" strokeWidth=".8"/>))}
            <circle cx="469" cy="92" r="14" fill="none" stroke="#5a8098" strokeWidth=".8"/>
            <rect x="346" y="48" width="246" height="88" fill="rgba(34,197,94,.06)" stroke="rgba(34,197,94,.4)" strokeWidth=".9" strokeDasharray="4,2"/>
            {[366,572].map(x => [66,118].map(y => <circle key={`b-${x}-${y}`} cx={x} cy={y} r="11" fill="rgba(96,165,250,.08)" stroke="rgba(96,165,250,.5)" strokeWidth=".8" strokeDasharray="3,2"/>))}
            <line x1="22" y1="146" x2="154" y2="146" stroke="#253040" strokeWidth=".7"/>
            <line x1="22" y1="142" x2="22" y2="150" stroke="#253040" strokeWidth=".7"/>
            <line x1="154" y1="142" x2="154" y2="150" stroke="#253040" strokeWidth=".7"/>
            <text x="88" y="144" textAnchor="middle" fill="#3a5060" fontSize="6" fontFamily="monospace">12.00"</text>
            <rect x="8" y="266" width="584" height="26" fill="none" stroke="#253040" strokeWidth=".7"/>
            <line x1="200" y1="266" x2="200" y2="292" stroke="#253040" strokeWidth=".4"/>
            <line x1="390" y1="266" x2="390" y2="292" stroke="#253040" strokeWidth=".4"/>
            <text x="104" y="282" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace">MATERIAL: 316L SS</text>
            <text x="295" y="282" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace">JEEVY AUTOMATION</text>
            <text x="485" y="282" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace">AS9100 REV D</text>
          </svg>
        </div>
        <div className="dm-detail">
          <div className="dm-dt">Drawing Details</div>
          <div className="dm-field"><div className="dmf-l">File</div><div className="dmf-v" style={{ fontFamily: 'var(--mono)', fontSize: 9 }}>DripPan_Assy_Rev3.pdf</div></div>
          <div className="dm-field"><div className="dmf-l">Revision</div><div className="dmf-v">Rev 3</div></div>
          <div className="dm-field"><div className="dmf-l">Type</div><div className="dmf-v">Assembly</div></div>
          <div className="dm-field"><div className="dmf-l">Material</div><div className="dmf-v">316L Stainless</div></div>
          <div className="dm-field"><div className="dmf-l">Views</div><div className="dmf-v" style={{ fontSize: 10 }}>Front · Side · Top · §A-A</div></div>
          <div className="dm-field"><div className="dmf-l">Compliance</div><div className="dmf-v" style={{ color: 'var(--green)', fontSize: 11 }}>AS9100 Rev D ✓</div></div>
          <div style={{ borderTop: '1px solid var(--b0)', paddingTop: 9, marginTop: 4 }}>
            <div className="dm-dt">Notes</div>
            <div style={{ fontSize: 10, color: 'var(--mid)', lineHeight: 1.6 }}>Passivation to AMS 2700. All welds per AWS D1.6. MTRs required.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

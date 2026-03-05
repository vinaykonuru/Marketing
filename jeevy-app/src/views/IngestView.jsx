import React, { useState, useEffect, useRef } from 'react'

function drawEmailCanvas(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, 400, 80)
  ctx.fillStyle = '#1a2535'; ctx.fillRect(12, 8, 376, 64)
  const lines = [
    ['From: j.rivera@spacex.com', '#4a6070', '9px monospace'],
    ['Subject: RFQ — Drip Pan Assembly — AS9100', '#7a9ab0', 'bold 10px monospace'],
    ['316L SS · 14 day delivery · ~$12k budget', '#5a7588', '9px monospace'],
  ]
  lines.forEach(([t, c, f], i) => { ctx.fillStyle = c; ctx.font = f; ctx.fillText(t, 22, 24 + i * 18) })
}

function drawDrawingCanvas(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0a1018'; ctx.fillRect(0, 0, 400, 80)
  ctx.strokeStyle = '#1a2530'; ctx.lineWidth = 0.5
  for (let x = 0; x < 400; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 80); ctx.stroke() }
  for (let y = 0; y < 80; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke() }
  ctx.strokeStyle = '#4a6a7a'; ctx.lineWidth = 1.2
  ctx.strokeRect(14, 8, 100, 64)
  ctx.beginPath(); ctx.arc(64, 40, 10, 0, Math.PI * 2); ctx.stroke()
  ctx.strokeRect(136, 8, 70, 64); ctx.strokeRect(154, 26, 34, 28)
  ctx.strokeRect(224, 8, 162, 64)
  ;[238, 378].forEach(x => [18, 62].forEach(y => { ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.stroke() }))
  ctx.fillStyle = 'rgba(34,197,94,.1)'; ctx.strokeStyle = 'rgba(34,197,94,.6)'; ctx.lineWidth = .8; ctx.setLineDash([3, 2])
  ctx.fillRect(14, 8, 100, 64); ctx.strokeRect(14, 8, 100, 64)
  ctx.fillStyle = 'rgba(248,113,113,.12)'; ctx.strokeStyle = 'rgba(248,113,113,.7)'
  ctx.beginPath(); ctx.arc(64, 40, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.setLineDash([])
}

function drawPhotoCanvas(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#100f1a'; ctx.fillRect(0, 0, 400, 80)
  const cols = ['#1a1528', '#120f20', '#1e1730', '#150f22']
  cols.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i * 100, 0, 100, 80) })
  ctx.strokeStyle = '#2a2040'; ctx.lineWidth = 1
  ;[100, 200, 300].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 80); ctx.stroke() })
  ;[[40, 35, 18], [150, 45, 14], [250, 30, 20], [350, 40, 16]].forEach(([x, y, r]) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(167,139,250,.15)'; ctx.fill()
    ctx.strokeStyle = 'rgba(167,139,250,.5)'; ctx.lineWidth = .8; ctx.stroke()
  })
}

const SOURCES = [
  { id: 'email',   pill: 'pp-e', icon: '✉', iconCls: 'vi-e', name: 'SpaceX RFQ Email',       state: 'verified',   meta: 'EMAIL · 2.1KB' },
  { id: 'drawing', pill: 'pp-d', icon: '⊞', iconCls: 'vi-d', name: 'DripPan_Assy_Rev3.pdf',  state: 'needs_verify', meta: 'DRAWING · 4.7MB' },
  { id: 'photo',   pill: 'pp-p', icon: '◉', iconCls: 'vi-p', name: 'site_photos_jan.zip',    state: 'processing', meta: 'PHOTOS · 12' },
  { id: 'audio',   pill: 'pp-a', icon: '♪', iconCls: 'vi-a', name: 'Voicenote_requirements', state: 'queued',    meta: 'AUDIO · 3m 12s' },
]

const BOM_ROWS = [
  { n: '001', desc: 'Drain Fitting — NPT', pn: 'DF-001', qty: '3', mat: '316L SS', conf: 38, cls: 'rf', dotCls: 'f', confCol: 'var(--red)', fieldCls: 'fl' },
  { n: '002', desc: 'Drain Body — Side View', pn: 'DB-S01', qty: '1', mat: '316L SS', conf: 44, cls: 'rf', dotCls: 'f', confCol: 'var(--red)', fieldCls: 'fl' },
  { n: '003', desc: 'Gusset Plate — Reinforcement', pn: 'GP-004', qty: '6', mat: '316L SS', conf: 68, cls: 'rw', dotCls: 'w', confCol: 'var(--amber)', fieldCls: '' },
  { n: '004', desc: 'Main Pan Body — Weldment', pn: 'PB-001', qty: '1', mat: '316L SS', conf: 94, cls: '', dotCls: 'o', confCol: 'var(--green)', fieldCls: '' },
  { n: '005', desc: 'Mounting Bracket Assembly (4-pt)', pn: 'MB-004', qty: '4', mat: 'A36 Steel', conf: 91, cls: '', dotCls: 'o', confCol: 'var(--green)', fieldCls: '' },
  { n: '006', desc: 'Lid Weldment — Hinged Cover', pn: 'LW-002', qty: '1', mat: '316L SS', conf: 88, cls: '', dotCls: 'o', confCol: 'var(--green)', fieldCls: '' },
]

export default function IngestView({ pipelineMode, verifiedSrcs, selectedSrc = 'drawing', onApproveSrc, onGoStep }) {
  const [rowApproved, setRowApproved] = useState({})
  const [ftab, setFtab] = useState('all')
  const cvEmail = useRef(null)
  const cvDraw = useRef(null)
  const cvPhoto = useRef(null)

  useEffect(() => {
    drawEmailCanvas(cvEmail.current)
    drawDrawingCanvas(cvDraw.current)
    drawPhotoCanvas(cvPhoto.current)
  }, [])

  const modeColor = pipelineMode === 'quote' ? 'var(--blue)' : 'var(--green)'
  const modeLabel = pipelineMode === 'quote' ? 'Quote' : 'Project'
  const src = SOURCES.find(s => s.id === selectedSrc)
  const isReadyForVerify = src?.state === 'needs_verify' && !verifiedSrcs.has(selectedSrc)

  function approveRow(idx) {
    setRowApproved(prev => ({ ...prev, [idx]: true }))
  }

  return (
    <div className="view active">
      <div className="pip-bar">
        <div className="pb-seg done"><div className="pb-dot g"/><span>4 Sources</span></div>
        <div className="pb-seg active"><div className="pb-dot a"/>Extract &amp; Verify</div>
        <div className="pb-seg"><div className="pb-dot"/>Digest</div>
        <div className="pb-right">
          <div className="pb-tag">Project <span>SpaceX-DripPan-2024</span></div>
          <div className="pb-tag">Mode <span style={{ color: modeColor }}>{modeLabel}</span></div>
        </div>
      </div>

      <div className="ingest-layout">
        {/* Center: source detail / verification pane (sources in LeftNav) */}
        <div className="ingest-center">
          {!src ? (
            <div className="ingest-empty">Select a source</div>
          ) : isReadyForVerify ? (
            /* Full verification pane when ready for verify */
            selectedSrc === 'drawing' ? (
            <>
              <div className="v-src-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: src.id === 'drawing' ? 'var(--amber)' : 'var(--blue)' }}>{src.id === 'drawing' ? 'DRAWING' : src.meta.split(' · ')[0]}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--hi)' }}>{src.name}</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                  <button className="btn btn-red" style={{ height: 24, fontSize: 8 }}>↺ Re-extract</button>
                  <button className="btn btn-green" style={{ height: 24, fontSize: 8 }} onClick={() => onApproveSrc(selectedSrc)}>✓ Approve</button>
                </div>
              </div>
              <div className="v-body v-body-stacked">
                <div className="v-drawing-top">
                  <div className="vpanel-hd">Drawing Preview</div>
                  <div className="vpanel-body">
                    <svg width="100%" viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg">
                      <rect width="560" height="260" fill="#0a1018"/>
                      <defs><pattern id="vg" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0L0 0 0 16" fill="none" stroke="#131b24" strokeWidth=".4"/></pattern></defs>
                      <rect width="560" height="260" fill="url(#vg)"/>
                      <rect x="8" y="8" width="544" height="244" fill="none" stroke="#253040" strokeWidth="1.2"/>
                      <text x="84" y="30" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">FRONT VIEW</text>
                      <rect x="18" y="36" width="132" height="88" fill="none" stroke="#5a8098" strokeWidth="1.3"/>
                      <circle cx="84" cy="80" r="10" fill="none" stroke="#5a8098" strokeWidth="1"/>
                      <rect x="18" y="36" width="132" height="88" fill="rgba(34,197,94,.07)" stroke="rgba(34,197,94,.55)" strokeWidth=".9" strokeDasharray="4,2"/>
                      <circle cx="84" cy="80" r="14" fill="rgba(248,113,113,.12)" stroke="rgba(248,113,113,.7)" strokeWidth="1" strokeDasharray="4,2"/>
                      <text x="234" y="30" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">SIDE VIEW</text>
                      <rect x="180" y="36" width="108" height="88" fill="none" stroke="#5a8098" strokeWidth="1.3"/>
                      <rect x="180" y="36" width="108" height="88" fill="rgba(34,197,94,.06)" stroke="rgba(34,197,94,.4)" strokeWidth=".9" strokeDasharray="4,2"/>
                      <text x="418" y="30" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">TOP VIEW</text>
                      <rect x="316" y="36" width="236" height="88" fill="none" stroke="#5a8098" strokeWidth="1.3"/>
                      <rect x="316" y="36" width="236" height="88" fill="rgba(34,197,94,.06)" stroke="rgba(34,197,94,.4)" strokeWidth=".9" strokeDasharray="4,2"/>
                      <text x="84" y="152" textAnchor="middle" fill="#2a4050" fontSize="7" fontFamily="monospace">SECTION A-A</text>
                      <rect x="18" y="158" width="132" height="46" fill="none" stroke="#3a5060" strokeWidth=".8" strokeDasharray="3,2"/>
                      <text x="97" y="236" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace">316L SS · 0.125"</text>
                      <text x="275" y="236" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace">JEEVY AUTOMATION</text>
                      <text x="455" y="236" textAnchor="middle" fill="#3a5060" fontSize="7" fontFamily="monospace">AS9100 REV D</text>
                    </svg>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '6px 0' }}>
                      {[['var(--green)','Body'],['var(--red)','Drain ⚠'],['var(--amber)','Gussets'],['var(--blue)','Brackets']].map(([c,l]) => (
                        <div key={l} style={{ display:'flex',alignItems:'center',gap:3,padding:'2px 6px',borderRadius:2,background:'var(--bg2)',border:'1px solid var(--b0)',fontFamily:'var(--mono)',fontSize:8,color:'var(--mid)' }}>
                          <div style={{ width:5,height:5,borderRadius:'50%',background:c }}/>{l}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="v-extract-below">
                  <div className="issue-bar">
                    <span className="ib f"><span style={{ fontWeight: 700 }}>2</span> flags</span>
                    <span className="ib w"><span style={{ fontWeight: 700 }}>3</span> warn</span>
                    <span className="ib o"><span style={{ fontWeight: 700 }}>12</span> ok</span>
                    <div className="ftabs">
                      {['All','Flags','OK'].map(t => (
                        <div key={t} className={`ft${ftab === t.toLowerCase() ? ' active' : ''}`} onClick={() => setFtab(t.toLowerCase())}>{t}</div>
                      ))}
                    </div>
                  </div>
                  <div className="extract-scroll">
                    <div style={{ padding:'5px 8px',background:'var(--bg1)',borderBottom:'1px solid var(--b0)',fontFamily:'var(--mono)',fontSize:8,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--lo)',position:'sticky',top:0 }}>BOM Extraction</div>
                    <table className="bom-table">
                      <thead><tr><th style={{width:12}}></th><th style={{width:24}}>#</th><th>Description</th><th style={{width:54}}>P/N</th><th style={{width:26}}>Qty</th><th style={{width:56}}>Material</th><th style={{width:58}}>Conf</th><th style={{width:44}}></th></tr></thead>
                      <tbody>
                        {BOM_ROWS.map((row, i) => (
                          <tr key={i} className={row.cls}>
                            <td><div className="td-in"><div className={`rs ${row.dotCls}`}/></div></td>
                            <td><div className="td-in"><span style={{fontFamily:'var(--mono)',fontSize:8,color:'var(--lo)'}}>{row.n}</span></div></td>
                            <td><div className="td-in"><input className={`bfield${row.fieldCls ? ' '+row.fieldCls : ''}`} defaultValue={row.desc}/></div></td>
                            <td><div className="td-in"><input className={`bfield${row.fieldCls ? ' '+row.fieldCls : ''}`} defaultValue={row.pn} style={{width:46}}/></div></td>
                            <td><div className="td-in"><input className="bfield" defaultValue={row.qty} style={{width:20}}/></div></td>
                            <td><div className="td-in"><input className="bfield" defaultValue={row.mat} style={{width:50}}/></div></td>
                            <td><div className="td-in"><div className="mini-cf"><div className="mcb"><div className="mcf" style={{width:`${row.conf}%`,background:row.confCol}}/></div><span style={{fontFamily:'var(--mono)',fontSize:8,color:row.confCol}}>{row.conf}%</span></div></div></td>
                            <td><div className="td-in">
                              {rowApproved[i] ? <span style={{fontFamily:'var(--mono)',fontSize:8,color:'var(--green)'}}>✓</span> : (
                                <><button className="ra ok" onClick={() => approveRow(i)}>✓</button><button className="ra re">↺</button></>
                              )}
                            </div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{padding:'5px 8px',background:'var(--bg1)',borderTop:'1px solid var(--b0)',borderBottom:'1px solid var(--b0)',fontFamily:'var(--mono)',fontSize:8,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--lo)'}}>Issues</div>
                    <div style={{padding:8}}>
                      <div style={{background:'var(--red-g)',border:'1px solid var(--red-r)',borderRadius:4,padding:'8px 10px',marginBottom:6}}>
                        <div style={{fontFamily:'var(--mono)',fontSize:8,fontWeight:700,color:'var(--red)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:2}}>⚠ View Correspondence Mismatch</div>
                        <div style={{fontSize:10,color:'var(--mid)',lineHeight:1.5}}>Drain fitting FRONT → SIDE match offset by ~14px. May be annotation error.</div>
                      </div>
                      <div style={{background:'var(--amber-g)',border:'1px solid var(--amber-r)',borderRadius:4,padding:'8px 10px'}}>
                        <div style={{fontFamily:'var(--mono)',fontSize:8,fontWeight:700,color:'var(--amber)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:2}}>◈ Gusset Count Discrepancy</div>
                        <div style={{fontSize:10,color:'var(--mid)',lineHeight:1.5}}>8 instances in TOP VIEW, BOM extracted as 6. Verify intended quantity.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
            ) : (
            /* Email / other source verification */
            <>
              <div className="v-src-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--blue)' }}>EMAIL</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--hi)' }}>{src.name}</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <button className="btn btn-green" style={{ height: 24, fontSize: 8 }} onClick={() => onApproveSrc(selectedSrc)}>✓ Approve</button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
                <div className="proc-card c-done" style={{ maxWidth: 420 }}>
                  <div className="pc-ext">
                    <div className="pe-lbl">Extracted <span>7 fields</span></div>
                    <div className="er"><span className="er-k">material</span><span className="er-v">316L SS throughout</span><span className="er-c h">96%</span></div>
                    <div className="er"><span className="er-k">comply</span><span className="er-v">AS9100 Rev D + MTRs</span><span className="er-c h">99%</span></div>
                    <div className="er"><span className="er-k">delivery</span><span className="er-v">14 days, Boca Chica TX</span><span className="er-c h">94%</span></div>
                    <div className="er"><span className="er-k">budget</span><span className="er-v">~$12,000 all-in</span><span className="er-c h">91%</span></div>
                  </div>
                </div>
              </div>
            </>
            )
          ) : src.state === 'verified' || verifiedSrcs.has(selectedSrc) ? (
            /* Verified: show summary */
            <div className="ingest-detail">
              <div className="v-src-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--green)' }}>VERIFIED</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--hi)' }}>{src.name}</span>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
                <div className="proc-card c-done" style={{ maxWidth: 420 }}>
                  <div className="pc-top"><span className={`pc-pill ${src.pill}`}>{src.id}</span><span className="pc-name">{src.name}</span></div>
                  <div className="pc-ext">
                    <div className="pe-lbl">Extracted data</div>
                    {src.id === 'email' && (
                      <>
                        <div className="er"><span className="er-k">material</span><span className="er-v">316L SS throughout</span><span className="er-c h">96%</span></div>
                        <div className="er"><span className="er-k">comply</span><span className="er-v">AS9100 Rev D + MTRs</span><span className="er-c h">99%</span></div>
                        <div className="er"><span className="er-k">delivery</span><span className="er-v">14 days, Boca Chica TX</span><span className="er-c h">94%</span></div>
                        <div className="er"><span className="er-k">budget</span><span className="er-v">~$12,000 all-in</span><span className="er-c h">91%</span></div>
                      </>
                    )}
                    {src.id === 'drawing' && (
                      <>
                        <div className="er"><span className="er-k">views</span><span className="er-v">Front · Side · Top</span><span className="er-c h">97%</span></div>
                        <div className="er"><span className="er-k">bom</span><span className="er-v">6 items</span><span className="er-c h">94%</span></div>
                      </>
                    )}
                  </div>
                  <div className="pc-stat"><span className="ps d">✓ Verified</span></div>
                </div>
              </div>
            </div>
          ) : src.state === 'processing' ? (
            /* Processing: show steps */
            <div className="ingest-detail">
              <div className="v-src-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--amber)' }}>PROCESSING</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--hi)' }}>{src.name}</span>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
                <div className="proc-card c-active" style={{ maxWidth: 420 }}>
                  <div className="pc-top"><span className={`pc-pill ${src.pill}`}>Photos</span><span className="pc-name">{src.name}</span></div>
                  <div className="pc-preview" style={{ background: '#100f1a' }}>
                    <canvas ref={cvPhoto} width={400} height={80} />
                    <div className="pc-plbl">frame 4/12 — keyframes</div>
                  </div>
                  <div className="pc-steps">
                    <div className="sr"><div className="si d">✓</div><span className="sl d">process_photos (12 imgs)</span><span className="st">0.8s</span></div>
                    <div className="sr"><div className="si d">✓</div><span className="sl d">extract_keyframes</span><span className="st">1.9s</span></div>
                    <div className="sr"><div className="si a">⟳</div><span className="sl a">classify_context</span><span className="st" style={{ color: 'var(--amber)' }}>…</span></div>
                    <div className="sr"><div className="si w">·</div><span className="sl w">tag_observations</span></div>
                  </div>
                  <div className="pc-prog"><div className="prog-bar"><div className="prog-fill pf-a" style={{ width: '34%' }}/></div><span className="prog-pct" style={{ color: 'var(--amber)' }}>34%</span></div>
                  <div className="pc-stat"><span className="ps a">⟳ Processing 3/5</span></div>
                </div>
              </div>
            </div>
          ) : (
            /* Queued */
            <div className="ingest-detail">
              <div className="v-src-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--lo)' }}>QUEUED</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--hi)' }}>{src.name}</span>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--lo)', fontFamily: 'var(--mono)', fontSize: 10 }}>
                  <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>♪</div>
                  <div>Starts when drawing completes</div>
                  <div style={{ marginTop: 4, fontSize: 9 }}>3 min 12 sec</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ingest-foot">
        <div className="if-stat">Sources <span className="v">4</span></div>
        <div className="if-stat">Verified <span className="g">{verifiedSrcs.size}</span></div>
        <div className="if-stat">Processing <span className="a">1</span></div>
        <div className="if-stat">Queued <span className="v">1</span></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => onGoStep('digest')}>Skip →</button>
          <button className="btn btn-amber" onClick={() => onGoStep('digest')}>Proceed to Digest →</button>
        </div>
      </div>
    </div>
  )
}

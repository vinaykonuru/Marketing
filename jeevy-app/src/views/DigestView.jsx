import React from 'react'

const TABS = ['tree', 'materials', 'schedule', 'quote']

export default function DigestView({ pipelineMode, digestTab, verifiedSrcs = new Set(), onSwitchDTab, onGoStep }) {
  const modeColor = pipelineMode === 'quote' ? 'var(--blue)' : 'var(--green)'
  const modeLabel = pipelineMode === 'quote' ? 'Quote' : 'Project'

  return (
    <div className="view active">
      <div className="pip-bar">
        <div className="pb-seg done"><div className="pb-dot g"/>{verifiedSrcs.size} Verified</div>
        <div className="pb-seg active"><div className="pb-dot a"/>Digest Building</div>
        <div className="pb-seg"><div className="pb-dot"/>Generate Output</div>
        <div className="pb-right">
          <div className="pb-tag">Project <span>SpaceX-DripPan-2024</span></div>
          <div className="pb-tag">Mode <span style={{ color: modeColor }}>{modeLabel}</span></div>
        </div>
      </div>

      <div className="digest-layout">
        {/* Digest content (sources in LeftNav) */}
        <div className="d-main">
          <div className="d-tabs">
            {[['tree','Digest Tree',null],['materials','Materials','14'],['schedule','Schedule',null],['quote','Quote','8']].map(([id,label,badge])=>(
              <div key={id} className={`d-tab${digestTab===id?' active':''}`} onClick={()=>onSwitchDTab(id)}>
                {label} {badge && <span className="d-badge">{badge}</span>}
              </div>
            ))}
            <div className="d-tab-acts">
              <button className="btn btn-ghost" style={{ height: 22, fontSize: 8 }}>✎ Edit Raw</button>
              <button className="btn btn-green" style={{ height: 22, fontSize: 8 }}>↓ Export PDF</button>
              <button className="btn btn-amber" style={{ height: 22, fontSize: 8 }} onClick={() => onGoStep('output')}>Generate Output →</button>
            </div>
          </div>

          <div className="d-content">
            {digestTab === 'quote' && (
              <div>
                <div style={{ fontFamily:'var(--mono)',fontSize:8,fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--lo)',paddingBottom:6,borderBottom:'1px solid var(--b0)',marginBottom:10,display:'flex',justifyContent:'space-between' }}>
                  <span>Line Items</span><span style={{fontWeight:400}}>8 items · 3 sources</span>
                </div>
                <table className="li-table">
                  <thead><tr><th>#</th><th>Part / Description</th><th>Type</th><th>Qty</th><th>Material</th><th>Unit</th><th>Total</th></tr></thead>
                  <tbody>
                    <tr><td className="li-m">001</td><td className="li-n">Drip Pan Body — Main Weldment</td><td><span className="pill p-draft">Fab</span></td><td className="li-m">1</td><td className="li-m" style={{color:'var(--lo)'}}>316L SS</td><td className="li-a">$4,200</td><td className="li-g">$4,200</td></tr>
                    <tr><td className="li-m">002</td><td className="li-n">Drain Fitting — 2" NPT</td><td><span className="pill p-draft">Fab</span></td><td className="li-m">3</td><td className="li-m" style={{color:'var(--lo)'}}>316L SS</td><td className="li-a">$180</td><td className="li-g">$540</td></tr>
                    <tr><td className="li-m">003</td><td className="li-n">Mounting Bracket Assy (4-pt)</td><td><span className="pill p-draft">Fab</span></td><td className="li-m">4</td><td className="li-m" style={{color:'var(--lo)'}}>A36 Steel</td><td className="li-a">$320</td><td className="li-g">$1,280</td></tr>
                    <tr><td className="li-m">004</td><td className="li-n">Surface Passivation — AMS 2700</td><td><span className="pill p-draft">Svc</span></td><td className="li-m">1</td><td className="li-m" style={{color:'var(--lo)'}}>—</td><td className="li-a">$650</td><td className="li-g">$650</td></tr>
                    <tr><td className="li-m">005</td><td className="li-n">Gusset Plate — Reinforcement</td><td><span className="pill p-draft">Fab</span></td><td className="li-m">8</td><td className="li-m" style={{color:'var(--lo)'}}>316L SS</td><td className="li-a">$95</td><td className="li-g">$760</td></tr>
                    <tr><td className="li-m">006</td><td className="li-n">Dimensional Inspection Report</td><td><span className="pill p-draft">Svc</span></td><td className="li-m">1</td><td className="li-m" style={{color:'var(--lo)'}}>—</td><td className="li-a">$400</td><td className="li-g">$400</td></tr>
                    <tr><td className="li-m">007</td><td className="li-n">Lid Weldment — Hinged Cover</td><td><span className="pill p-draft">Fab</span></td><td className="li-m">1</td><td className="li-m" style={{color:'var(--lo)'}}>316L SS</td><td className="li-a">$1,100</td><td className="li-g">$1,100</td></tr>
                    <tr><td className="li-m">008</td><td className="li-n">Material Certs (MTR)</td><td><span className="pill p-draft">Mat</span></td><td className="li-m">1</td><td className="li-m" style={{color:'var(--lo)'}}>—</td><td className="li-a">$150</td><td className="li-g">$150</td></tr>
                  </tbody>
                </table>
                <div className="summ-grid" style={{ marginTop: 10 }}>
                  <div className="summ-card"><div className="summ-l">Subtotal</div><div className="summ-v">$9,080</div></div>
                  <div className="summ-card"><div className="summ-l">Margin (18%)</div><div className="summ-v" style={{color:'var(--amber)'}}>+$1,634</div></div>
                  <div className="summ-card"><div className="summ-l">Lead Time</div><div className="summ-v" style={{color:'var(--blue)'}}>14 days</div></div>
                  <div className="summ-card hi"><div className="summ-l">Quote Total</div><div className="summ-v">$10,714</div></div>
                </div>
              </div>
            )}

            {digestTab === 'materials' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  ['316L Stainless Sheet','48 sqft','0.125" · 4x8 · AMS 5507'],
                  ['316L SS Tubing','12 ft','2" OD · 0.065" wall · ASTM A269'],
                  ['A36 Flat Bar','6 ft','2" x 0.25" · ASTM A36'],
                  ['ER316L Weld Wire','5 lb','0.035" · AWS A5.9'],
                  ['NPT Coupling 2"','3 ea','316 SS · Class 3000'],
                  ['Argon Shielding Gas','1 cyl','99.99% · AWS A5.32'],
                ].map(([name,qty,spec])=>(
                  <div key={name} style={{background:'var(--bg1)',border:'1px solid var(--b0)',borderRadius:5,padding:'9px 11px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                      <span style={{fontSize:11,fontWeight:500,color:'var(--hi)'}}>{name}</span>
                      <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--amber)'}}>{qty}</span>
                    </div>
                    <div style={{fontFamily:'var(--mono)',fontSize:8,color:'var(--lo)'}}>{spec}</div>
                  </div>
                ))}
              </div>
            )}

            {digestTab === 'schedule' && (
              <div className="sched-card">
                <div className="sched-hd">START: Feb 26 → DELIVERY: Mar 14 · 14 working days</div>
                {[
                  ['Day 1–2','var(--blue)','rgba(96,165,250,.06)','Material Procurement + MTR review'],
                  ['Day 3–5','var(--amber)','rgba(245,158,11,.06)','Laser cut / shear sheet · plasma bracket profile'],
                  ['Day 6–9','var(--amber)','rgba(245,158,11,.06)','TIG weld main body · gussets · drain fittings'],
                  ['Day 10','var(--purple)','rgba(167,139,250,.06)','Passivation — send to vendor'],
                  ['Day 11–12','var(--green)','rgba(34,197,94,.06)','Dimensional inspection · CMM · AS9100 docs'],
                  ['Day 13–14','var(--green)','rgba(34,197,94,.06)','Final QC · packaging · shipping to Starbase'],
                ].map(([day,bc,bg,task])=>(
                  <div key={day} className="sched-row">
                    <span className="sched-day">{day}</span>
                    <div className="sched-bar" style={{borderColor:bc,background:bg}}>{task}</div>
                  </div>
                ))}
              </div>
            )}

            {digestTab === 'tree' && (
              <div style={{background:'var(--bg1)',border:'1px solid var(--b0)',borderRadius:6,padding:10}}>
                {[
                  {depth:0,label:'▾ SpaceX Drip Pan Project',extra:'3 sources'},
                  {depth:1,label:'▾ Fabrication'},
                  {depth:2,label:'· Main Weldment',extra:'drawing'},
                  {depth:2,label:'· Drain Fittings × 3',extra:'email + drawing'},
                  {depth:2,label:'· Mounting Brackets × 4',extra:'drawing'},
                  {depth:1,label:'▾ Services'},
                  {depth:2,label:'· Passivation AMS 2700',extra:'spec'},
                  {depth:2,label:'· CMM Inspection',extra:'email'},
                  {depth:1,label:'▾ Compliance'},
                  {depth:2,label:'· AS9100 Rev D ✓',color:'var(--green)',extra:'mapped'},
                  {depth:2,label:'· MTR Traceability ✓',color:'var(--green)',extra:'mapped'},
                  {depth:1,label:'▾ Requirements'},
                  {depth:2,label:'· Delivery 14d Boca Chica',extra:'email'},
                  {depth:2,label:'· Budget ~$12k',extra:'email'},
                ].map((row,i)=>(
                  <div key={i} style={{padding:`4px ${row.depth*12+4}px`,fontSize:row.depth===2?9:11,fontFamily:row.depth===2?'var(--mono)':undefined,fontWeight:row.depth===0?600:undefined,color:row.color||(row.depth===0?'var(--hi)':row.depth===1?'var(--mid)':'var(--lo)'),cursor:'pointer',display:'flex'}}>
                    <span style={{flex:1}}>{row.label}</span>
                    {row.extra&&<span style={{color:'var(--lo)',fontSize:8,fontFamily:'var(--mono)'}}>{row.extra}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

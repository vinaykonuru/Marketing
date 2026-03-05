import React, { useState } from 'react'

function TaskItem({ name, meta, priority }) {
  const [done, setDone] = useState(false)
  return (
    <div className="task-item">
      <div className={`tck${done ? ' done' : ''}`} onClick={() => setDone(!done)}>{done ? '✓' : ''}</div>
      <div className="task-info">
        <div className="task-name">{name}</div>
        <div className="task-meta">{meta.map((m, i) => <span key={i}>{m}</span>)}</div>
      </div>
      <span className={`task-pri${priority === 'urgent' ? ' u' : ' n'}`}>{priority === 'urgent' ? 'Urgent' : 'Normal'}</span>
    </div>
  )
}

export default function ShopView() {
  return (
    <div className="view active">
      <div className="ch">
        <div className="ch-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: 'var(--green)', fontSize: 10 }}>●</span>
          My Tasks
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lo)', fontWeight: 400 }}>Marcus T. · Bay 3</span>
        </div>
        <div className="ch-gap" />
        <button className="btn btn-ghost">↓ My Drawings</button>
        <button className="btn btn-green">+ Check-in Material</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12, alignContent: 'start' }}>
        <div className="shop-card">
          <div className="shop-hd"><div className="shop-title">Today's Tasks</div><div className="shop-sub">SpaceX DripPan · 3 urgent</div></div>
          <TaskItem name="TIG weld main pan body — front & side seams" meta={['DripPan_Assy_Rev3 · Bay 3']} priority="urgent" />
          <TaskItem name="Tack gusset plates × 8 before full pass" meta={['DripPan_Body_Detail · Bay 3']} priority="urgent" />
          <TaskItem name='Weld drain fittings — 2" NPT × 3' meta={['Section A-A · Bay 3']} priority="urgent" />
          <TaskItem name="Grind weld spatter on body seams" meta={['AWS D1.6 finish spec']} priority="normal" />
          <TaskItem name="Stage assembly for passivation pickup" meta={['QC checklist']} priority="normal" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="shop-card">
            <div className="shop-hd"><div className="shop-title">My Drawings</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderBottom: '1px solid var(--b0)' }}>
              <span>📐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--hi)' }}>DripPan_Assy_Rev3.pdf</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--lo)' }}>Assembly · Rev 3</div>
              </div>
              <button className="btn btn-ghost" style={{ height: 20, fontSize: 7, padding: '0 6px' }}>View</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px' }}>
              <span>📐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--hi)' }}>DripPan_Weld_Symbols.pdf</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--lo)' }}>Weld Detail · Rev 3</div>
              </div>
              <button className="btn btn-ghost" style={{ height: 20, fontSize: 7, padding: '0 6px' }}>View</button>
            </div>
          </div>
          <div className="shop-card">
            <div className="shop-hd"><div className="shop-title">Shift</div></div>
            <div className="sinfo-row"><div className="sdot" style={{ background: 'var(--green)' }}/><span style={{ fontSize: 11, color: 'var(--mid)', flex: 1 }}>Bay 3 Active</span><span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lo)' }}>3h 18m</span></div>
            <div className="sinfo-row"><div className="sdot" style={{ background: 'var(--amber)' }}/><span style={{ fontSize: 11, color: 'var(--mid)', flex: 1 }}>Tasks done</span><span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lo)' }}>0 / 5</span></div>
            <div className="sinfo-row"><div className="sdot" style={{ background: 'var(--blue)' }}/><span style={{ fontSize: 11, color: 'var(--mid)', flex: 1 }}>Project</span><span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lo)' }}>SpaceX DripPan</span></div>
          </div>
          <div className="shop-card">
            <div className="shop-hd"><div className="shop-title">Materials</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderBottom: '1px solid var(--b0)' }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: 'var(--hi)' }}>316L SS Sheet 0.125"</div><div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--lo)' }}>48 sqft</div></div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--amber)' }}>Expected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px' }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: 'var(--hi)' }}>ER316L Weld Wire</div><div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--lo)' }}>5 lb</div></div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--green)' }}>Checked in ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

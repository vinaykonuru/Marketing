import React from 'react'

export default function ProjectsView({ onOpenModal, onEnterProject }) {
  return (
    <div className="view active">
      <div className="ch">
        <div className="ch-title">Projects</div>
        <div className="ch-sub">· All active fabrication projects</div>
        <div className="ch-gap" />
        <button className="btn btn-ghost">Filter ▾</button>
        <button className="btn btn-amber" onClick={onOpenModal}>+ New Project</button>
      </div>
      <div className="pj-grid">
        <div className="pj-card hi" onClick={() => onEnterProject('spacex')}>
          <div className="pj-head">
            <div><div className="pj-name">SpaceX Drip Pan 2024</div><div className="pj-client">SpaceX Starbase · GSE</div></div>
            <span className="pill p-active">Active</span>
          </div>
          <div className="pj-body">
            <div className="pj-meta">
              <div><div className="pjm-l">Value</div><div className="pjm-v" style={{ color: 'var(--amber)' }}>$10,714</div></div>
              <div><div className="pjm-l">Due</div><div className="pjm-v">Mar 14</div></div>
              <div><div className="pjm-l">PM</div><div className="pjm-v">Jeevy</div></div>
            </div>
            <div className="pj-prog-lbl"><span>Progress</span><span>68%</span></div>
            <div className="pj-prog"><div className="pj-fill" style={{ width: '68%' }} /></div>
            <div className="pj-chips">
              <span className="pj-chip u">3 urgent</span>
              <span className="pj-chip">8 open</span>
              <span className="pj-chip">4 drawings</span>
            </div>
          </div>
          <div className="pj-foot"><span className="pj-foot-l" style={{ color: 'var(--amber)' }}>⚡ AI-provisioned</span><span className="pj-foot-l">Feb 24</span></div>
        </div>

        <div className="pj-card" onClick={() => onEnterProject('boeing')}>
          <div className="pj-head">
            <div><div className="pj-name">Boeing Figs Assembly</div><div className="pj-client">Boeing PDX · Structures</div></div>
            <span className="pill p-active">Active</span>
          </div>
          <div className="pj-body">
            <div className="pj-meta">
              <div><div className="pjm-l">Value</div><div className="pjm-v" style={{ color: 'var(--amber)' }}>$48,200</div></div>
              <div><div className="pjm-l">Due</div><div className="pjm-v">Apr 2</div></div>
              <div><div className="pjm-l">PM</div><div className="pjm-v">Sarah K.</div></div>
            </div>
            <div className="pj-prog-lbl"><span>Progress</span><span>34%</span></div>
            <div className="pj-prog"><div className="pj-fill" style={{ width: '34%' }} /></div>
            <div className="pj-chips"><span className="pj-chip">12 open</span><span className="pj-chip">7 drawings</span></div>
          </div>
          <div className="pj-foot"><span className="pj-foot-l" style={{ color: 'var(--purple)' }}>⊕ Direct award</span><span className="pj-foot-l">Feb 18</span></div>
        </div>

        <div className="pj-card" onClick={() => onEnterProject('lockheed')}>
          <div className="pj-head">
            <div><div className="pj-name">Lockheed Box Weldment</div><div className="pj-client">Lockheed Martin · Aero</div></div>
            <span className="pill p-setup">Setup</span>
          </div>
          <div className="pj-body">
            <div className="pj-meta">
              <div><div className="pjm-l">Value</div><div className="pjm-v" style={{ color: 'var(--amber)' }}>$67,500</div></div>
              <div><div className="pjm-l">Due</div><div className="pjm-v">Mar 28</div></div>
              <div><div className="pjm-l">PM</div><div className="pjm-v">TBD</div></div>
            </div>
            <div className="pj-prog-lbl"><span>Progress</span><span>5%</span></div>
            <div className="pj-prog"><div className="pj-fill" style={{ width: '5%' }} /></div>
            <div className="pj-chips"><span className="pj-chip ai">Needs AI processing</span></div>
          </div>
          <div className="pj-foot"><span className="pj-foot-l" style={{ color: 'var(--amber)' }}>⚡ Just launched</span><span className="pj-foot-l">Today</span></div>
        </div>

        <div className="pj-card pj-new" onClick={onOpenModal}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, color: 'var(--lo)', marginBottom: 4 }}>+</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--lo)', textTransform: 'uppercase', letterSpacing: '.1em' }}>New Project</div>
          </div>
        </div>
      </div>
    </div>
  )
}

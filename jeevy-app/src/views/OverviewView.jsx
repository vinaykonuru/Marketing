import React from 'react'
import { PJ } from '../App'

const PJ_DETAILS = {
  spacex: {
    scope: 'Drip pan assembly for ground support equipment. 316L SS throughout, AS9100 Rev D compliant.',
    milestones: [
      { label: 'Kickoff', date: 'Feb 15', done: true },
      { label: 'Fab complete', date: 'Mar 5', done: false },
      { label: 'Passivation', date: 'Mar 10', done: false },
      { label: 'Delivery', date: 'Mar 14', done: false },
    ],
    notes: 'Boca Chica delivery. MTRs required for all materials.',
  },
  boeing: {
    scope: 'Figs assembly — 12 units. Aluminum 6061-T6, anodized per spec.',
    milestones: [
      { label: 'Kickoff', date: 'Feb 28', done: true },
      { label: 'First article', date: 'Mar 18', done: false },
      { label: 'Production run', date: 'Mar 28', done: false },
      { label: 'Ship', date: 'Apr 2', done: false },
    ],
    notes: 'PDX dock. First article inspection before production.',
  },
  lockheed: {
    scope: 'Box weldment — structural steel, weld per AWS D1.1.',
    milestones: [
      { label: 'Kickoff', date: 'TBD', done: false },
      { label: 'Design review', date: 'TBD', done: false },
      { label: 'Fab', date: 'TBD', done: false },
      { label: 'Delivery', date: 'Mar 28', done: false },
    ],
    notes: 'PM TBD. Awaiting PO.',
  },
}

export default function OverviewView({ activeProject, onExitProject }) {
  const p = activeProject ? PJ[activeProject] : null
  const details = activeProject ? PJ_DETAILS[activeProject] : null

  if (!activeProject || !p) return null

  return (
    <div className="view active">
      <div className="ch">
        <button className="ch-back" onClick={onExitProject}>← All Projects</button>
        <div className="ch-title">{p.name}</div>
        <div className="ch-sub">{p.client} · Due {p.due}</div>
      </div>
      <div className="overview-grid">
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Value</span><span className="ov-val g">{p.value}</span></div>
        <div className="ov-bubble ov-stat ov-prog-bubble"><span className="ov-lbl">Progress</span><span className="ov-val"><div className="ov-prog"><div className="ov-prog-fill" style={{ width: `${p.prog}%` }} /></div><span>{p.prog}%</span></span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">PM</span><span className="ov-val">{p.pm}</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Sources</span><span className="ov-val">4</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Line items</span><span className="ov-val">8</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Lead time</span><span className="ov-val">14d</span></div>
        {details && (
          <>
            <div className="ov-bubble ov-scope">
              <span className="ov-lbl">Scope</span>
              <span className="ov-txt">{details.scope}</span>
            </div>
            <div className="ov-bubble ov-milestones">
              <span className="ov-lbl">Milestones</span>
              <div className="ov-m-list">
                {details.milestones.map((m, i) => (
                  <div key={i} className="ov-m-item">
                    <span className={`ov-m-dot${m.done ? ' done' : ''}`} />
                    <span className="ov-m-lbl">{m.label}</span>
                    <span className="ov-m-date">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ov-bubble ov-notes">
              <span className="ov-lbl">Notes</span>
              <span className="ov-txt">{details.notes}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import React from 'react'
import { PJ } from '../App'

const VIEW_LABELS = {
  quotes: 'Pipeline · Quotes', projects: 'Projects', drawings: 'Drawing Manager',
  tasking: 'Tasking', shop: 'Shop Floor', ingest: 'Pipeline · Ingest',
  digest: 'Pipeline · Digest', output: 'Pipeline · Output',
}

export default function StatusBar({ currentView, activeProject, pipelineMode }) {
  const p = activeProject ? PJ[activeProject] : null
  const modeC = pipelineMode === 'quote' ? 'var(--blue)' : 'var(--green)'
  const modeLabel = pipelineMode === 'quote' ? 'Quote' : 'Project'

  return (
    <div className="statusbar">
      <div className="sb">Stage <span className="v" style={{ color: 'var(--amber)' }}>{VIEW_LABELS[currentView] || currentView}</span></div>
      <div style={{ width: 1, height: 12, background: 'var(--b1)' }} />
      <div className="sb">
        {p
          ? <>Project <span className="v">{p.name}</span></>
          : <>Mode <span className="v" style={{ color: modeC }}>{modeLabel}</span></>
        }
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="sb">AS9100 <span className="g">✓</span></div>
        <div style={{ width: 1, height: 12, background: 'var(--b1)' }} />
        <div className="sb">{p ? `${p.name} · ${p.due}` : 'SpaceX-DripPan-2024 · Rev 1'}</div>
      </div>
    </div>
  )
}

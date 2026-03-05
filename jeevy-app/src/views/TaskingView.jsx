import React, { useState } from 'react'
import { PJ } from '../App'

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

export default function TaskingView({ activeProject, onShowTool }) {
  const p = activeProject ? PJ[activeProject] : null
  return (
    <div className="view active">
      <div className="ch">
        <button className="ch-back" onClick={() => onShowTool('drawings')}>← Drawing Manager</button>
        <div>
          <div className="ch-title">Tasking</div>
          <div className="ch-sub">· {p ? p.name : 'Project'}</div>
        </div>
        <div className="ch-gap" />
        <button className="btn btn-amber">+ Add Task</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--b0)', borderRadius: 6, overflow: 'hidden' }}>
          <div className="task-col-hd">Urgent <span style={{ color: 'var(--red)' }}>3</span></div>
          <TaskItem name="TIG weld main pan body seams" meta={['DripPan_Assy_Rev3 · Bay 3', '→ Marcus T.']} priority="urgent" />
          <TaskItem name={'Tack gusset plates \u00d7 8 before full pass'} meta={['DripPan_Body_Detail · Bay 3', '→ Marcus T.']} priority="urgent" />
          <TaskItem name={'Weld drain fittings \u2014 2" NPT \u00d7 3'} meta={['Section A-A · Bay 3', '→ Marcus T.']} priority="urgent" />
        </div>
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--b0)', borderRadius: 6, overflow: 'hidden' }}>
          <div className="task-col-hd">Open <span style={{ color: 'var(--mid)' }}>5</span></div>
          <TaskItem name="Grind weld spatter on body seams" meta={['AWS D1.6 finish spec · Bay 3']} priority="normal" />
          <TaskItem name="Stage assembly for passivation pickup" meta={['QC checklist · Staging']} priority="normal" />
          <TaskItem name="Dimensional inspection CMM" meta={['AS9100 · Inspection bay']} priority="normal" />
          <TaskItem name="Update MTR log for 316L sheet" meta={['Material tracking']} priority="normal" />
          <TaskItem name="Pack and label for shipping" meta={['Shipping spec · Dock']} priority="normal" />
        </div>
      </div>
    </div>
  )
}

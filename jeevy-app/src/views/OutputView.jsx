import React from 'react'

export default function OutputView({ pipelineMode, onGoStep, onLaunchProject }) {
  const isProj = pipelineMode === 'project'
  const modeColor = isProj ? 'var(--green)' : 'var(--blue)'
  const modeLabel = isProj ? 'Project' : 'Quote'

  return (
    <div className="view active">
      <div className="pip-bar">
        <div className="pb-seg done"><div className="pb-dot g"/>Digest Complete</div>
        <div className="pb-seg active"><div className="pb-dot g"/>Generate Output</div>
        <div className="pb-right">
          <div className="pb-tag">Project <span>SpaceX-DripPan-2024</span></div>
          <div className="pb-tag">Mode <span style={{ color: modeColor }}>{modeLabel}</span></div>
        </div>
      </div>

      <div className="out-body">
        <div className={`out-banner${isProj ? ' bp' : ' bq'}`}>
          <span style={{ fontSize: 18 }}>{isProj ? '🚀' : '📤'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: modeColor }}>
              {isProj ? 'Project Mode — Push to Shop' : 'Quote Mode — Export & Send'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--mid)', lineHeight: 1.5 }}>
              {isProj
                ? 'Digest complete. Auto-provision BOM, schedule, and work procedures so the shop can start immediately.'
                : 'Digest complete. Generate your client-facing quote PDF, or convert on win.'}
            </div>
          </div>
          <button
            className={`btn${isProj ? ' btn-green' : ' btn-amber'}`}
            style={{ height: 32, fontSize: 10, flexShrink: 0 }}
            onClick={() => isProj && onGoStep('drawings')}
          >
            {isProj ? '🚀 Push to Shop' : '📄 Generate Quote PDF'}
          </button>
        </div>

        <div className="out-grid">
          {isProj ? (
            <>
              <div className="out-card"><div className="out-card-icon">📦</div><div className="out-card-title">Bill of Materials</div><div className="out-card-sub">Push verified BOM to procurement and material tracking.</div><button className="btn btn-amber" style={{width:'100%',justifyContent:'center'}}>Push BOM →</button></div>
              <div className="out-card"><div className="out-card-icon">📅</div><div className="out-card-title">Production Schedule</div><div className="out-card-sub">Auto-build Gantt and push to shop calendar.</div><button className="btn btn-amber" style={{width:'100%',justifyContent:'center'}}>Push Schedule →</button></div>
              <div className="out-card"><div className="out-card-icon">📋</div><div className="out-card-title">Work Procedures</div><div className="out-card-sub">AI-generated step-by-step assembly and weld procedures.</div><button className="btn btn-ghost" style={{width:'100%',justifyContent:'center'}}>Review &amp; Push</button></div>
              <div className="out-card"><div className="out-card-icon">✅</div><div className="out-card-title">Task Assignments</div><div className="out-card-sub">Auto-assign tasks to shop roles based on skill and availability.</div><button className="btn btn-ghost" style={{width:'100%',justifyContent:'center'}}>Review &amp; Assign</button></div>
            </>
          ) : (
            <>
              <div className="out-card"><div className="out-card-icon">📄</div><div className="out-card-title">Quote PDF</div><div className="out-card-sub">Client-facing quote with line items, lead time, and terms.</div><button className="btn btn-amber" style={{width:'100%',justifyContent:'center'}}>Generate &amp; Export</button></div>
              <div className="out-card"><div className="out-card-icon">📦</div><div className="out-card-title">Bill of Materials</div><div className="out-card-sub">Full BOM with quantities, materials, and part numbers.</div><button className="btn btn-ghost" style={{width:'100%',justifyContent:'center'}}>Export BOM</button></div>
              <div className="out-card"><div className="out-card-icon">📅</div><div className="out-card-title">Schedule</div><div className="out-card-sub">Production schedule for internal planning reference.</div><button className="btn btn-ghost" style={{width:'100%',justifyContent:'center'}}>Export Schedule</button></div>
              <div className="out-card" style={{background:'linear-gradient(135deg,var(--green-g),rgba(34,197,94,.02))',borderColor:'var(--green-r)'}}>
                <div className="out-card-icon">🚀</div>
                <div className="out-card-title" style={{color:'var(--green)'}}>Win → Launch Project</div>
                <div className="out-card-sub">If bid is won, auto-provision a project with this digest's BOM, schedule, and drawings pre-loaded.</div>
                <button className="btn btn-green" style={{width:'100%',justifyContent:'center'}} onClick={onLaunchProject}>⚡ Launch Project →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import React from 'react'

const PIPELINE_STEPS = [
  { id: 'overview', label: 'Overview' },
  { id: 'ingest', label: 'Ingest' },
  { id: 'digest', label: 'Digest' },
  { id: 'output', label: 'Output' },
]

const STEP_ORDER = ['overview', 'ingest', 'digest', 'output']

export default function Topbar({ role, mode, currentView, pipelineMode, isPipeline, onSetMode, onSetRole, onGoHome, onGoStep }) {
  const stepIdx = STEP_ORDER.indexOf(currentView)
  const pipColor = pipelineMode === 'quote' ? 'var(--blue)' : 'var(--green)'
  const pipLabel = pipelineMode === 'quote' ? 'Quote Mode' : 'Project Mode'

  function tabActive(tabMode) {
    if (tabMode === 'pipeline') return mode === 'pipeline' || currentView === 'quotes'
    if (tabMode === 'projects') return mode === 'projects' && !isPipeline
    if (tabMode === 'shop') return mode === 'shop' && !isPipeline
    return false
  }

  return (
    <header className="topbar">
      <div className="tb-logo" onClick={onGoHome}>
        <div className="tb-mark">J</div>
        <div className="tb-name">JEEVY</div>
      </div>

      {!isPipeline && (
        <nav className="tb-tabs">
          <div
            className={`tb-tab${tabActive('pipeline') ? ' active' : ''}`}
            onClick={() => onSetMode('pipeline')}
          >
            <span>⚡</span> Pipeline <span className="t-badge">4</span>
          </div>
          <div
            className={`tb-tab${tabActive('projects') ? ' active' : ''}`}
            onClick={() => onSetMode('projects')}
          >
            <span>⊞</span> Projects <span className="t-badge">7</span>
          </div>
          <div
            className={`tb-tab${tabActive('shop') ? ' active' : ''}`}
            onClick={() => onSetMode('shop')}
          >
            <span>🔧</span> Shop Floor
          </div>
        </nav>
      )}

      {isPipeline && (
        <div className="tb-pipeline show">
          {PIPELINE_STEPS.map((s, i) => {
            let cls = 'pip-step'
            if (i < stepIdx) cls += ' done'
            else if (i === stepIdx) cls += ' active'
            return (
              <React.Fragment key={s.id}>
                {i > 0 && <div className="pip-arrow">›</div>}
                <div className={cls} onClick={() => onGoStep(s.id)}>
                  <div className="pn">{i < stepIdx ? '✓' : i + 1}</div>
                  {s.label}
                </div>
              </React.Fragment>
            )
          })}
          <div className="pip-mode">
            <div className="pip-mode-dot" style={{ background: pipColor }} />
            {pipLabel}
          </div>
        </div>
      )}

      <div className="tb-right">
        <span className="tb-rlabel">View as</span>
        <div className="tb-role">
          <button className={`rb est${role === 'est' ? ' active' : ''}`} onClick={() => onSetRole('est')}>Estimator</button>
          <button className={`rb pm${role === 'pm' ? ' active' : ''}`} onClick={() => onSetRole('pm')}>PM</button>
          <button className={`rb fl${role === 'fl' ? ' active' : ''}`} onClick={() => onSetRole('fl')}>Floor</button>
        </div>
        <div className="tb-icon">🔔</div>
        <div className="tb-avatar">J</div>
      </div>
    </header>
  )
}

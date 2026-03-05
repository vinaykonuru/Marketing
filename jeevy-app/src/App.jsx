import React, { useState } from 'react'
import Topbar from './components/Topbar'
import LeftNav from './components/LeftNav'
import StatusBar from './components/StatusBar'
import Modal from './components/Modal'
import QuotesView from './views/QuotesView'
import ProjectsView from './views/ProjectsView'
import DrawingsView from './views/DrawingsView'
import TaskingView from './views/TaskingView'
import ShopView from './views/ShopView'
import IngestView from './views/IngestView'
import DigestView from './views/DigestView'
import OutputView from './views/OutputView'
import AIPanel from './components/AIPanel'
import OverviewView from './views/OverviewView'
import QuoteOverviewView from './views/QuoteOverviewView'

export const PJ = {
  spacex:   { name: 'SpaceX Drip Pan 2024',   client: 'SpaceX Starbase', value: '$10,714', due: 'Mar 14', pm: 'Jeevy',    prog: 68 },
  boeing:   { name: 'Boeing Figs Assembly',    client: 'Boeing PDX',     value: '$48,200', due: 'Apr 2',  pm: 'Sarah K.', prog: 34 },
  lockheed: { name: 'Lockheed Box Weldment',   client: 'Lockheed Martin', value: '$67,500', due: 'Mar 28', pm: 'TBD',     prog: 5  },
}

export const SRC_DATA = {
  email:   { type: 'EMAIL',   color: 'var(--blue)',   name: 'SpaceX RFQ Email',       conf: 92, confColor: 'var(--green)', issues: '0 flags · 0 warnings',   issColor: 'var(--green)' },
  drawing: { type: 'DRAWING', color: 'var(--amber)',  name: 'DripPan_Assy_Rev3.pdf',  conf: 71, confColor: 'var(--amber)', issues: '⚠ 2 flags · 3 warnings',  issColor: 'var(--red)'   },
  photo:   { type: 'PHOTOS',  color: 'var(--purple)', name: 'site_photos_jan.zip',    conf: 76, confColor: 'var(--amber)', issues: '0 flags · 4 warnings',    issColor: 'var(--amber)' },
  audio:   { type: 'AUDIO',   color: 'var(--green)',  name: 'Voicenote_requirements', conf: 81, confColor: 'var(--amber)', issues: '0 flags · 2 warnings',    issColor: 'var(--amber)' },
}

const PIPELINE_VIEWS = ['overview', 'ingest', 'digest', 'output']

export default function App() {
  const [role, setRoleState]         = useState('est')
  const [mode, setModeState]         = useState('pipeline')
  const [pipelineMode, setPipelineMode] = useState('quote')
  const [activeProject, setActiveProject] = useState(null)
  const [currentView, setCurrentView] = useState('quotes')
  const [verifiedSrcs, setVerifiedSrcs] = useState(new Set(['email']))
  const [selectedSrc, setSelectedSrc]  = useState('drawing')
  const [modalOpen, setModalOpen]     = useState(false)
  const [modalPath, setModalPath]     = useState('quote')
  const [convBannerShow, setConvBannerShow] = useState(false)
  const [digestTab, setDigestTab]     = useState('tree')

  const inProject = !!activeProject && ['overview', 'drawings', 'tasking', 'digest', 'ingest'].includes(currentView)
  const isPipeline = PIPELINE_VIEWS.includes(currentView) && !inProject
  const showAIPanel = isPipeline || inProject

  // ── navigation helpers ──────────────────────────────────────────
  function showView(id) {
    setCurrentView(id)
  }

  function setMode(m) {
    setModeState(m)
    setActiveProject(null)
    if (m === 'pipeline') showView('quotes')
    else if (m === 'projects') showView('projects')
    else if (m === 'shop') showView('shop')
  }

  function setRole(r) {
    setRoleState(r)
    if (r === 'fl') setMode('shop')
    else if (r === 'pm') setMode('projects')
    else setMode('pipeline')
  }

  function goHome() {
    setActiveProject(null)
    setMode(mode)
  }

  function enterProject(id) {
    setActiveProject(id)
    setModeState('projects')
    showView('overview')
  }

  function exitProject() {
    setActiveProject(null)
    showView('projects')
  }

  function showTool(tool) {
    if (tool === 'overview') showView('overview')
    else if (tool === 'digest') showView('digest')
    else if (tool === 'sources' || tool === 'ingest') showView('ingest')
    else if (tool === 'drawings') showView('drawings')
    else if (tool === 'tasking') showView('tasking')
  }

  function startPipeline(pipMode) {
    setPipelineMode(pipMode)
    showView('overview')
  }

  function goStep(step) {
    showView(step)
  }

  function exitPipeline() {
    if (pipelineMode === 'project' && activeProject) {
      setModeState('projects')
      showView('overview')
    } else {
      setModeState('pipeline')
      setActiveProject(null)
      showView('quotes')
    }
  }

  function launchProject() {
    setConvBannerShow(false)
    setModeState('projects')
    setActiveProject('lockheed')
    showView('overview')
  }

  // ── verify helpers ───────────────────────────────────────────────
  function approveSrc(id) {
    const updated = new Set(verifiedSrcs)
    updated.add(id)
    setVerifiedSrcs(updated)
  }

  // ── modal helpers ────────────────────────────────────────────────
  function startFromModal() {
    setModalOpen(false)
    if (modalPath === 'quote') startPipeline('quote')
    else setMode('projects')
  }

  // ── view rendering ───────────────────────────────────────────────
  function renderView() {
    switch (currentView) {
      case 'quotes':
        return <QuotesView
          onOpenModal={() => setModalOpen(true)}
          onStartPipeline={startPipeline}
          convBannerShow={convBannerShow}
          onShowConvBanner={() => setConvBannerShow(true)}
          onDismissConvBanner={() => setConvBannerShow(false)}
          onLaunchProject={launchProject}
        />
      case 'projects':
        return <ProjectsView onOpenModal={() => setModalOpen(true)} onEnterProject={enterProject} />
      case 'overview':
        return inProject
          ? <OverviewView activeProject={activeProject} onExitProject={exitProject} />
          : <QuoteOverviewView onExitPipeline={exitPipeline} onGoStep={goStep} />
      case 'drawings':
        return <DrawingsView activeProject={activeProject} onExitProject={exitProject} />
      case 'tasking':
        return <TaskingView activeProject={activeProject} onShowTool={showTool} />
      case 'shop':
        return <ShopView />
      case 'ingest':
        return <IngestView
          pipelineMode={activeProject ? 'project' : pipelineMode}
          verifiedSrcs={verifiedSrcs}
          selectedSrc={selectedSrc}
          onApproveSrc={approveSrc}
          onGoStep={goStep}
        />
      case 'digest':
        return <DigestView
          pipelineMode={activeProject ? 'project' : pipelineMode}
          digestTab={digestTab}
          verifiedSrcs={verifiedSrcs}
          onSwitchDTab={setDigestTab}
          onGoStep={goStep}
        />
      case 'output':
        return <OutputView
          pipelineMode={pipelineMode}
          onGoStep={goStep}
          onLaunchProject={launchProject}
        />
      default:
        return null
    }
  }

  return (
    <>
      <Topbar
        role={role}
        mode={mode}
        currentView={currentView}
        pipelineMode={pipelineMode}
        isPipeline={isPipeline}
        onSetMode={setMode}
        onSetRole={setRole}
        onGoHome={goHome}
        onGoStep={goStep}
      />
      <div className="app">
        <LeftNav
          role={role}
          mode={mode}
          currentView={currentView}
          pipelineMode={pipelineMode}
          activeProject={activeProject}
          inProject={inProject}
          isPipeline={isPipeline}
          verifiedSrcs={verifiedSrcs}
          selectedSrc={selectedSrc}
          onSelectSrc={setSelectedSrc}
          onShowView={showView}
          onGoStep={goStep}
          onExitPipeline={exitPipeline}
          onEnterProject={enterProject}
          onExitProject={exitProject}
          onShowTool={showTool}
          onStartPipeline={startPipeline}
        />
        <div className={`main${showAIPanel ? ' with-ai' : ''}`}>
          <div className="main-content">{renderView()}</div>
          {showAIPanel && (
            <div className="ai-panel-wrap">
              <AIPanel />
            </div>
          )}
        </div>
      </div>
      <StatusBar currentView={currentView} activeProject={activeProject} pipelineMode={pipelineMode} />
      <Modal
        open={modalOpen}
        modalPath={modalPath}
        onSetModalPath={setModalPath}
        onClose={() => setModalOpen(false)}
        onStartFromModal={startFromModal}
      />
    </>
  )
}

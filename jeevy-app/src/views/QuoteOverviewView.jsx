import React from 'react'

// Mock quote context (extracted from RFQ sources)
const QUOTE_CONTEXT = {
  title: 'Drip Pan Assembly',
  client: 'SpaceX Starbase',
  rfq: 'SpaceX RFQ Email',
  material: '316L SS throughout',
  compliance: 'AS9100 Rev D + MTRs',
  delivery: '14 days',
  location: 'Boca Chica TX',
  budget: '~$12,000 all-in',
  sources: 4,
  verified: 1,
}

export default function QuoteOverviewView({ onExitPipeline, onGoStep }) {
  return (
    <div className="view active">
      <div className="ch">
        <button className="ch-back" onClick={onExitPipeline}>← Exit Pipeline</button>
        <div className="ch-title">{QUOTE_CONTEXT.title}</div>
        <div className="ch-sub">{QUOTE_CONTEXT.client} · {QUOTE_CONTEXT.rfq}</div>
      </div>
      <div className="overview-grid">
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Budget</span><span className="ov-val g">{QUOTE_CONTEXT.budget}</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Delivery</span><span className="ov-val">{QUOTE_CONTEXT.delivery}</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Material</span><span className="ov-val">{QUOTE_CONTEXT.material}</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Sources</span><span className="ov-val">{QUOTE_CONTEXT.sources}</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Verified</span><span className="ov-val">{QUOTE_CONTEXT.verified}</span></div>
        <div className="ov-bubble ov-stat"><span className="ov-lbl">Compliance</span><span className="ov-val">{QUOTE_CONTEXT.compliance}</span></div>
        <div className="ov-bubble ov-scope ov-span2">
          <span className="ov-lbl">Scope</span>
          <span className="ov-txt">Drip pan assembly for ground support equipment. 316L SS throughout, AS9100 Rev D compliant. Delivery to {QUOTE_CONTEXT.location}.</span>
        </div>
        <div className="ov-bubble ov-notes ov-span2">
          <span className="ov-lbl">Next steps</span>
          <span className="ov-txt">Verify sources in <strong>Ingest</strong> to extract BOM and requirements. Then build the <strong>Digest</strong> for materials, schedule, and quote.</span>
        </div>
      </div>
      <div className="overview-actions">
        <button className="btn btn-ghost" onClick={onExitPipeline}>Exit Pipeline</button>
        <button className="btn btn-amber" onClick={() => onGoStep('ingest')}>Proceed to Ingest →</button>
      </div>
    </div>
  )
}

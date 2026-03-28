export default function TestPlan({ onBack }) {
  return (
    <div className="card animate-fade-in">
      <div className="card-body">
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>No test plan generated yet</h3>
          <p>Complete the previous steps to generate your test plan</p>
          <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={onBack}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

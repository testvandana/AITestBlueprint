export default function Review({ activeConnection, fetchedIssues, contextInput, setContextInput, onComplete, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Connection Banner */}
      <div className="card" style={{ padding: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            </span>
            {activeConnection?.name} ({activeConnection?.url})
          </div>
          <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Refresh Issues
          </button>
        </div>
      </div>

      {/* Additional Context */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.125rem' }}>Additional Context & Notes</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Add any additional context, special requirements, or constraints
            </p>
          </div>
        </div>
        <div className="card-body">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Add any additional context about the testing approach, special requirements, constraints, team structure, or specific areas of focus..."
            value={contextInput}
            onChange={e => setContextInput(e.target.value)}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
      </div>

      {/* Review Issues */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.125rem' }}>Review Issues ({fetchedIssues?.length || 0})</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Issues that will be used to generate the test plan
            </p>
          </div>
        </div>
        <div className="card-body">
          {(!fetchedIssues || fetchedIssues.length === 0) ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <h3>No issues fetched yet</h3>
              <p>Go back to fetch issues from your connected project</p>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {fetchedIssues.slice(0, 10).map((issue) => (
                <div key={issue.id} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{issue.key}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issue.fields?.issuetype?.name || 'Issue'}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>{issue.fields?.summary}</div>
                </div>
              ))}
              {fetchedIssues.length > 10 && (
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                  + {fetchedIssues.length - 10} more issues
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={onBack}>← Back</button>
            <button className="btn btn-primary" style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center' }} onClick={onComplete}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              Generate Test Plan
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

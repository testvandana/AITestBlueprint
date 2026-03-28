import { useState } from 'react';

export default function FetchIssues({ activeConnection, onComplete, onBack }) {
  const [productName, setProductName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [sprintVersion, setSprintVersion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [fetchStatus, setFetchStatus] = useState(null); // null | 'fetching' | 'done' | 'error'
  const [fetchedCount, setFetchedCount] = useState(0);

  const handleFetch = () => {
    if (!projectKey.trim()) return;
    setFetchStatus('fetching');
    setTimeout(() => {
      setFetchedCount(0); // In real app this would come from API
      setFetchStatus('done');
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Connection Info Banner */}
      <div className="card" style={{ padding: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeConnection?.type === 'jira' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19.29A11.95 11.95 0 0 1 12 21c-5.33 0-9.75-3.35-11.25-8a11.95 11.95 0 0 1 5.5-8.29"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Connected to:</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {activeConnection?.name} ({activeConnection?.url})
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>Change</button>
        </div>
      </div>

      {/* Fetch Form */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.125rem' }}>
              Fetch {activeConnection?.type === 'jira' ? 'Jira' : 'Azure DevOps'} Requirements
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Enter project details to fetch user stories and requirements
            </p>
          </div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input className="form-control" placeholder="e.g., MyApp" value={productName} onChange={e => setProductName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Project Key *</label>
              <input className="form-control" placeholder={activeConnection?.type === 'jira' ? 'e.g., MYAPP' : 'e.g., MyProject'} value={projectKey} onChange={e => setProjectKey(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sprint/Fix Version (Optional)</label>
            <input className="form-control" placeholder="e.g., Sprint 15 or leave empty for all open issues" value={sprintVersion} onChange={e => setSprintVersion(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Context (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Any additional information about the product, testing goals, or constraints..."
              value={additionalContext}
              onChange={e => setAdditionalContext(e.target.value)}
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          {fetchStatus === 'done' && (
            <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Fetch complete! {fetchedCount} issues found. Proceed to review.</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={onBack}>
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleFetch}
              disabled={!projectKey.trim() || fetchStatus === 'fetching'}
              style={{ flex: 1 }}
            >
              {fetchStatus === 'fetching' ? (
                'Fetching...'
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Fetch Issues
                </>
              )}
            </button>
          </div>

          {fetchStatus === 'done' && (
            <>
              <hr className="divider" />
              <button className="btn btn-primary btn-block" onClick={onComplete}  style={{ padding: '0.875rem' }}>
                Continue to Review →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

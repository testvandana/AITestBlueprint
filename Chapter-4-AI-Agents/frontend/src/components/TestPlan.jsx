import { useState, useEffect } from 'react';

export default function TestPlan({ fetchedIssues, contextInput, llmSettings, onBack }) {
  const [status, setStatus] = useState('generating'); // generating | success | error
  const [plan, setPlan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000/api/generate/testplan' : '/api/generate/testplan';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            issues: fetchedIssues,
            context: contextInput,
            llmSettings: llmSettings
          })
        });
        
        const data = await response.json();
        
        if (isMounted) {
          if (response.ok) {
            setPlan(data.plan);
            setStatus('success');
          } else {
            setErrorMsg(data.detail || 'Failed to generate');
            setStatus('error');
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg(err.message);
          setStatus('error');
        }
      }
    })();
    return () => { isMounted = false; };
  }, [fetchedIssues, contextInput, llmSettings]);

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>AI-Generated Test Plan</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Generated using {llmSettings?.provider?.toUpperCase()}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onBack}>
            ← Back to Review
          </button>
        </div>
      </div>
      <div className="card-body">
        {status === 'generating' && (
          <div className="empty-state" style={{ padding: '4rem 2rem' }}>
            <div className="spinner" style={{ marginBottom: '1.5rem', width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h3>Analyzing Requirements...</h3>
            <p>Your LLM agent is drafting the test plan. This may take a minute.</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <div style={{ fontWeight: '600' }}>Generation Failed</div>
              <div>{errorMsg}</div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div style={{ 
            padding: '1.5rem', 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)',
            whiteSpace: 'pre-wrap',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: 'var(--text-primary)'
          }}>
            {plan}
          </div>
        )}
      </div>
    </div>
  );
}

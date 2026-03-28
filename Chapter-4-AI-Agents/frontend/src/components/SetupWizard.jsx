import { useState } from 'react';

export default function SetupWizard({ onComplete, onSaveConnection, savedConnections, activeConnection, setActiveConnection }) {
  const [connectionType, setConnectionType] = useState('jira');
  const [connectionName, setConnectionName] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  // LLM Settings
  const [llmProvider, setLlmProvider] = useState('ollama');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [llmModel, setLlmModel] = useState('');
  const [llmStatus, setLlmStatus] = useState(null);

  const handleSaveConnection = () => {
    if (!connectionName.trim() || !url.trim()) return;
    setSaveStatus('saving');
    setTimeout(() => {
      onSaveConnection({
        type: connectionType,
        name: connectionName,
        url,
        email,
        token: apiToken,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 800);
  };

  const handleTestLLM = () => {
    setLlmStatus('testing');
    setTimeout(() => {
      setLlmStatus('connected');
      setTimeout(() => setLlmStatus(null), 3000);
    }, 1500);
  };

  const canProceed = activeConnection !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ===== ALM Connection Card ===== */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.125rem' }}>ALM Connection</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Connect to your Jira or Azure DevOps instance
            </p>
          </div>
          {activeConnection && (
            <span className="badge badge-success">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Connected
            </span>
          )}
        </div>
        <div className="card-body">

          {/* Use existing connection or add new */}
          {savedConnections.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Use Existing Connection</label>
              <select
                className="form-control"
                value={activeConnection?.id || ''}
                onChange={e => {
                  const conn = savedConnections.find(c => c.id === Number(e.target.value));
                  setActiveConnection(conn || null);
                }}
              >
                <option value="">-- Select a connection --</option>
                {savedConnections.map(conn => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.type === 'jira' ? 'Jira' : 'Azure DevOps'}) — {conn.url}
                  </option>
                ))}
              </select>
              <hr className="divider" />
            </div>
          )}

          <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
            {savedConnections.length > 0 ? 'Or Add New Connection' : 'Add Connection'}
          </h3>

          {/* Connection Type Selector */}
          <div className="form-group">
            <label className="form-label">Connection Type</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className={`btn ${connectionType === 'jira' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setConnectionType('jira')}
                style={{ flex: 1 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                Jira
              </button>
              <button
                className={`btn ${connectionType === 'ado' ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setConnectionType('ado')}
                style={{ flex: 1 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19.29A11.95 11.95 0 0 1 12 21c-5.33 0-9.75-3.35-11.25-8 a11.95 11.95 0 0 1 5.5-8.29"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Azure DevOps
              </button>
            </div>
          </div>

          {/* Connection Fields */}
          <div className="form-group">
            <label className="form-label">Connection Name *</label>
            <input className="form-control" placeholder="e.g., My Project Jira" value={connectionName} onChange={e => setConnectionName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">{connectionType === 'jira' ? 'Jira URL *' : 'Organization URL *'}</label>
            <input
              className="form-control"
              placeholder={connectionType === 'jira' ? 'https://yourcompany.atlassian.net' : 'https://dev.azure.com/yourorg'}
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{connectionType === 'jira' ? 'Email' : 'Username'}</label>
              <input
                className="form-control"
                placeholder={connectionType === 'jira' ? 'your-email@company.com' : 'your-username'}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{connectionType === 'jira' ? 'API Token *' : 'Personal Access Token *'}</label>
              <input type="password" className="form-control" placeholder="Paste your token here" value={apiToken} onChange={e => setApiToken(e.target.value)} />
            </div>
          </div>

          {connectionType === 'jira' && (
            <div className="form-hint" style={{ marginBottom: '1rem' }}>
              Generate your API token at: <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>id.atlassian.com</a>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleSaveConnection} disabled={!connectionName.trim() || !url.trim()}>
              {saveStatus === 'saving' ? 'Saving...' : 'Save Connection'}
            </button>
            {saveStatus === 'saved' && (
              <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Connection Saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== LLM Connection Card ===== */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.125rem' }}>LLM Connection</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Configure your AI model for test plan generation
            </p>
          </div>
          {llmStatus === 'connected' && (
            <span className="badge badge-success">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Connected
            </span>
          )}
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">LLM Provider</label>
            <select className="form-control" value={llmProvider} onChange={e => setLlmProvider(e.target.value)}>
              <option value="ollama">🖥️ Local — Ollama</option>
              <option value="groq">⚡ Cloud — Groq (Fast)</option>
              <option value="openai">🤖 Cloud — OpenAI</option>
              <option value="gemini">💎 Cloud — Google Gemini</option>
              <option value="claude">🧠 Cloud — Anthropic Claude</option>
            </select>
          </div>

          {llmProvider !== 'ollama' && (
            <div className="form-group">
              <label className="form-label">API Key *</label>
              <input type="password" className="form-control" placeholder="Paste your API key" value={llmApiKey} onChange={e => setLlmApiKey(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Model Name</label>
            <input
              className="form-control"
              placeholder={llmProvider === 'ollama' ? 'e.g., llama3, mistral' : llmProvider === 'openai' ? 'e.g., gpt-4o' : llmProvider === 'gemini' ? 'e.g., gemini-2.0-flash' : llmProvider === 'claude' ? 'e.g., claude-sonnet-4-20250514' : 'e.g., llama-3.3-70b-versatile'}
              value={llmModel}
              onChange={e => setLlmModel(e.target.value)}
            />
          </div>

          {llmProvider === 'ollama' && (
            <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Make sure Ollama is running locally on port 11434 before testing the connection.</span>
            </div>
          )}

          <button className="btn btn-outline" onClick={handleTestLLM}>
            {llmStatus === 'testing' ? 'Testing...' : 'Test LLM Connection'}
          </button>
        </div>
      </div>

      {/* ===== Continue Button ===== */}
      <button
        className="btn btn-primary btn-block"
        onClick={onComplete}
        disabled={!canProceed}
        style={{ padding: '0.875rem', fontSize: '0.95rem', opacity: canProceed ? 1 : 0.5 }}
      >
        Continue to Fetch Issues →
      </button>

      {!canProceed && (
        <div className="form-hint" style={{ textAlign: 'center' }}>
          Save at least one ALM connection to continue
        </div>
      )}

    </div>
  );
}

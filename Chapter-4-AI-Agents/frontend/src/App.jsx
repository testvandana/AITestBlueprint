import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SetupWizard from './components/SetupWizard';
import FetchIssues from './components/FetchIssues';
import Review from './components/Review';
import TestPlan from './components/TestPlan';

const steps = ['1. Setup', '2. Fetch Issues', '3. Review', '4. Test Plan'];

function App() {
  const [activePage, setActivePage] = useState('test-planner');
  const [currentStep, setCurrentStep] = useState(1);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [savedConnections, setSavedConnections] = useState(() => {
    const saved = localStorage.getItem('alm_connections');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeConnection, setActiveConnection] = useState(() => {
    const active = localStorage.getItem('alm_active_connection');
    return active ? JSON.parse(active) : null;
  });
  const [llmSettings, setLlmSettings] = useState(() => {
    const saved = localStorage.getItem('llm_settings');
    return saved ? JSON.parse(saved) : { provider: 'ollama', apiKey: '', model: '' };
  });
  const [fetchedIssues, setFetchedIssues] = useState([]);
  const [contextInput, setContextInput] = useState('');

  useEffect(() => {
    localStorage.setItem('alm_connections', JSON.stringify(savedConnections));
  }, [savedConnections]);

  useEffect(() => {
    if (activeConnection) {
      localStorage.setItem('alm_active_connection', JSON.stringify(activeConnection));
    } else {
      localStorage.removeItem('alm_active_connection');
    }
  }, [activeConnection]);

  useEffect(() => {
    localStorage.setItem('llm_settings', JSON.stringify(llmSettings));
  }, [llmSettings]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSaveConnection = (conn) => {
    const newConn = { ...conn, id: Date.now() };
    setSavedConnections(prev => [...prev, newConn]);
    setActiveConnection(newConn);
  };

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="empty-state">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>
              </svg>
              <h3>Dashboard</h3>
              <p>Your test planning overview will appear here. Start by creating a connection and generating your first test plan.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setActivePage('test-planner')}>
                Get Started
              </button>
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <h2 style={{ fontSize: '1.1rem' }}>Saved Connections</h2>
              </div>
              <div className="card-body">
                {savedConnections.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <h3>No connections yet</h3>
                    <p>Go to the Test Planner to set up your first Jira or Azure DevOps connection.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActivePage('test-planner')}>
                      Add Connection
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {savedConnections.map(conn => (
                      <div key={conn.id} className="connection-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{conn.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{conn.type === 'jira' ? 'Jira' : 'Azure DevOps'} • {conn.url}</div>
                        </div>
                        <span className="badge badge-success">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          Saved
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="animate-fade-in">
            <div className="card">
              <div className="card-header">
                <h2 style={{ fontSize: '1.1rem' }}>Application Settings</h2>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Appearance</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toggle between light and dark theme</div>
                  </div>
                  <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'test-planner':
        return (
          <div className="animate-fade-in">
            {/* Step Bar */}
            <div className="step-bar">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`step-bar-item ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <SetupWizard
                onComplete={() => setCurrentStep(2)}
                onSaveConnection={handleSaveConnection}
                savedConnections={savedConnections}
                activeConnection={activeConnection}
                setActiveConnection={setActiveConnection}
                llmSettings={llmSettings}
                setLlmSettings={setLlmSettings}
              />
            )}
            {currentStep === 2 && (
              <FetchIssues
                activeConnection={activeConnection}
                setFetchedIssues={setFetchedIssues}
                onComplete={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <Review
                activeConnection={activeConnection}
                fetchedIssues={fetchedIssues}
                contextInput={contextInput}
                setContextInput={setContextInput}
                onComplete={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <TestPlan 
                fetchedIssues={fetchedIssues}
                contextInput={contextInput}
                llmSettings={llmSettings}
                onBack={() => setCurrentStep(3)} 
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return { title: 'Dashboard', subtitle: 'Overview of your testing projects' };
      case 'connections': return { title: 'Connections', subtitle: 'Manage your ALM and LLM connections' };
      case 'settings': return { title: 'Settings', subtitle: 'Configure application preferences' };
      case 'test-planner': return { title: 'Intelligent Test Planning Agent', subtitle: 'Generate comprehensive test plans from Jira/ADO requirements using AI' };
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="main-header-title">
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="main-header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button className="btn btn-outline btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M4 14a9 9 0 0 0 14.36 3.36L23 14"></path>
              </svg>
              View History
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="main-body">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;

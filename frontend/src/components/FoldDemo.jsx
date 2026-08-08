import { useState } from 'react';
import { useRef } from 'react';

export default function FoldDemo() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
     const searchInputRef = useRef(null);
     
  // 2. Define the click handler to focus the input field
  // const handleButtonClick = () => {
  //   if (searchInputRef.current) {
  //     searchInputRef.current.focus();
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setShortUrl('');
    setShowStats(false);
    setStats(null);
    
    try {
      let finalUrl = url.trim();
      if (!finalUrl.match(/^https?:\/\//i)) {
        finalUrl = 'http://' + finalUrl;
      }
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl: finalUrl })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to shorten URL');
      
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!shortUrl) return;
    setStatsLoading(true);
    try {
      const code = shortUrl.split('/').pop();
      const res = await fetch(`/api/${code}/stats`);
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const toggleStats = () => {
    if (!showStats) {
      fetchStats();
    }
    setShowStats(!showStats);
  };

  return (
    <div className="fold-demo" id="demo">
      <div className="fold-stage" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
          <input 
            id="url-input"
            type="text" 
            required 
            value={url}
             ref={searchInputRef} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long link here"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '2px solid var(--ink)',
              background: 'var(--bg)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              color: 'var(--ink)'
            }}
          />
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px 24px', margin: 0 }}>
            {loading ? 'Snipping...' : 'Snip it'}
          </button>
        </form>
        
        {error && <div style={{ color: 'var(--coral-dark)', marginTop: '14px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
        
        {shortUrl && (
          <>
            <div style={{ marginTop: '24px', background: 'var(--bg)', padding: '16px 20px', borderRadius: '12px', border: '2px dashed var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={shortUrl} target="_blank" rel="noreferrer" className="mono" style={{ color: 'var(--coral-dark)', fontWeight: 700, fontSize: '1.1rem', wordBreak: 'break-all' }}>
                {shortUrl}
              </a>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button"
                  onClick={toggleStats}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {showStats ? 'Hide Stats' : 'View Stats'}
                </button>
                <button 
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Copy
                </button>
              </div>
            </div>

            {showStats && (
              <div style={{ marginTop: '12px', background: 'var(--card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Total Clicks</div>
                  <div className="display" style={{ fontSize: '1.5rem', color: 'var(--ink)', marginTop: '4px' }}>
                    {statsLoading ? '...' : (stats?.click_count || 0)}
                  </div>
                </div>
                <button onClick={fetchStats} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled={statsLoading}>
                  Refresh
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="fold-actions" style={{ justifyContent: 'center' }}>
        <span className="fold-hint">No sign-up needed for your first 10 links</span>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function FoldDemo() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setShortUrl('');
    
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

  return (
    <div className="fold-demo" id="demo">
      <div className="fold-stage" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            required 
            value={url}
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
          <div style={{ marginTop: '24px', background: 'var(--bg)', padding: '16px 20px', borderRadius: '12px', border: '2px dashed var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href={shortUrl} target="_blank" rel="noreferrer" className="mono" style={{ color: 'var(--coral-dark)', fontWeight: 700, fontSize: '1.1rem', wordBreak: 'break-all' }}>
              {shortUrl}
            </a>
            <button 
              type="button"
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Copy
            </button>
          </div>
        )}
      </div>
      <div className="fold-actions" style={{ justifyContent: 'center' }}>
        <span className="fold-hint">No sign-up needed for your first 10 links</span>
      </div>
    </div>
  );
}

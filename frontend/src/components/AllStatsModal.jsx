import { useState, useEffect } from 'react';

export default function AllStatsModal({ onClose }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/stats/all')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch all stats:", err);
        setError("Failed to load statistics.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" style={{ maxWidth: '800px', width: '90%' }} onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="display" style={{ marginBottom: '24px' }}>Global Link Analytics</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>Loading analytics...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--coral-dark)' }}>{error}</div>
        ) : stats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>No links have been shortened yet!</div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)', color: 'var(--ink-soft)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Short Link</th>
                  <th style={{ padding: '12px 8px' }}>Original URL</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(link => (
                  <tr key={link.code} style={{ borderBottom: '1px solid rgba(23, 20, 15, 0.1)' }}>
                    <td style={{ padding: '16px 8px' }}>
                      <a href={`/api/${link.code}`} target="_blank" rel="noreferrer" className="mono" style={{ color: 'var(--coral-dark)', fontWeight: 600 }}>
                        {link.code}
                      </a>
                    </td>
                    <td style={{ padding: '16px 8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={link.long_url} target="_blank" rel="noreferrer" style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                        {link.long_url}
                      </a>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                      {link.click_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import './App.css';

const periods = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '3Y', '5Y'];

const benchmarks = {
  '1D': 0.42,
  '1W': 1.18,
  '1M': 3.64,
  '3M': 8.92,
  YTD: 11.74,
  '1Y': 17.86,
  '3Y': 42.31,
  '5Y': 82.64,
};

const funds = [
  { symbol: 'SMH', name: 'VanEck Semiconductor ETF', category: 'Technology', price: 271.84, change: 2.31, returns: { '1D': 2.84, '1W': 5.72, '1M': 14.28, '3M': 31.52, YTD: 38.64, '1Y': 68.32, '3Y': 142.6, '5Y': 248.2 }, color: '#ad75ff' },
  { symbol: 'VGT', name: 'Vanguard Information Technology', category: 'Technology', price: 612.37, change: 1.16, returns: { '1D': 1.48, '1W': 3.14, '1M': 9.42, '3M': 20.86, YTD: 26.48, '1Y': 42.16, '3Y': 91.8, '5Y': 164.3 }, color: '#71a7ff' },
  { symbol: 'QQQM', name: 'Invesco NASDAQ 100 ETF', category: 'Large growth', price: 221.56, change: 0.93, returns: { '1D': 1.12, '1W': 2.48, '1M': 7.24, '3M': 16.72, YTD: 21.32, '1Y': 34.58, '3Y': 76.4, '5Y': 138.9 }, color: '#60d6bd' },
  { symbol: 'SCHG', name: 'Schwab U.S. Large-Cap Growth', category: 'Large growth', price: 28.63, change: 0.84, returns: { '1D': 0.94, '1W': 2.16, '1M': 6.58, '3M': 15.18, YTD: 19.86, '1Y': 32.48, '3Y': 72.1, '5Y': 127.6 }, color: '#f0b968' },
  { symbol: 'IWF', name: 'iShares Russell 1000 Growth', category: 'Large growth', price: 412.15, change: 0.67, returns: { '1D': 0.79, '1W': 1.92, '1M': 5.84, '3M': 13.42, YTD: 17.82, '1Y': 29.72, '3Y': 66.3, '5Y': 117.2 }, color: '#e9899e' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR', category: 'Technology', price: 238.71, change: 0.62, returns: { '1D': 0.72, '1W': 1.78, '1M': 5.46, '3M': 12.64, YTD: 16.58, '1Y': 28.36, '3Y': 63.8, '5Y': 111.3 }, color: '#8a9bff' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'Large blend', price: 527.92, change: 0.38, returns: { '1D': 0.41, '1W': 1.16, '1M': 3.58, '3M': 8.78, YTD: 11.62, '1Y': 17.72, '3Y': 41.9, '5Y': 81.8 }, color: '#a2adbd' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Commodities', price: 241.38, change: 0.22, returns: { '1D': 0.86, '1W': 1.82, '1M': 4.12, '3M': 7.86, YTD: 15.28, '1Y': 24.62, '3Y': 39.4, '5Y': 61.8 }, color: '#f2c56b' },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock', category: 'International', price: 64.19, change: 0.28, returns: { '1D': 0.24, '1W': 0.82, '1M': 2.18, '3M': 5.92, YTD: 7.14, '1Y': 12.86, '3Y': 19.6, '5Y': 28.4 }, color: '#67c8d6' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'Small cap', price: 208.64, change: -0.31, returns: { '1D': -0.28, '1W': -0.62, '1M': 1.12, '3M': 4.26, YTD: 3.84, '1Y': 9.12, '3Y': 13.4, '5Y': 21.6 }, color: '#76c893' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR', category: 'Energy', price: 87.24, change: -0.46, returns: { '1D': -0.52, '1W': -1.18, '1M': -2.42, '3M': 1.86, YTD: 4.32, '1Y': 6.78, '3Y': 26.2, '5Y': 38.5 }, color: '#db9071' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market', category: 'Fixed income', price: 72.16, change: 0.08, returns: { '1D': 0.06, '1W': 0.22, '1M': 0.48, '3M': 1.26, YTD: 2.14, '1Y': 4.82, '3Y': 3.8, '5Y': -4.6 }, color: '#8ba5c6' },
];

const navItems = [
  { label: 'Overview', icon: '◫' },
  { label: 'ETF leaderboard', icon: '▤' },
  { label: 'My watchlist', icon: '☆' },
  { label: 'Market insights', icon: '⌁' },
];

function formatPercent(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function Sparkline({ seed, color, negative = false }) {
  const points = Array.from({ length: 22 }, (_, index) => {
    const wave = Math.sin((index + seed) * 1.3) * 5 + Math.cos((index + seed) * 0.65) * 3;
    const trend = (index / 21) * (negative ? -10 : -17);
    return `${(index / 21) * 100},${22 + wave + trend}`;
  }).join(' ');

  return (
    <svg className="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function PerformanceChart({ fund, period }) {
  const base = [50, 48, 52, 45, 47, 42, 44, 37, 39, 34, 36, 31, 33, 25, 28, 21, 24, 17, 20, 12, 16, 8, 12, 5];
  const scale = Math.max(0.45, Math.min(1.45, Math.abs(fund.returns[period] / 30)));
  const offset = fund.returns[period] < 0 ? -1 : 1;
  const fundPoints = base.map((value, index) => `${index * (560 / 23)},${Math.max(7, Math.min(82, 48 + (value - 30) * scale * offset))}`).join(' ');
  const benchmarkPoints = base.map((value, index) => `${index * (560 / 23)},${Math.max(9, Math.min(84, 48 + (value - 30) * 0.58))}`).join(' ');

  return (
    <svg className="performance-chart" viewBox="0 0 560 100" preserveAspectRatio="none" role="img" aria-label={`${fund.symbol} and S&P 500 illustrative performance chart`}>
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fund.color} stopOpacity=".18" />
          <stop offset="100%" stopColor={fund.color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${fundPoints.replaceAll(' ', ' L ')} L 560 100 L 0 100 Z`} fill="url(#chartFill)" />
      {[25, 50, 75].map((y) => <line key={y} x1="0" x2="560" y1={y} y2={y} className="chart-gridline" />)}
      <polyline points={benchmarkPoints} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
      <polyline points={fundPoints} fill="none" stroke={fund.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function App() {
  const [period, setPeriod] = useState('1Y');
  const [category, setCategory] = useState('All ETFs');
  const [query, setQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('SMH');
  const [watchlist, setWatchlist] = useState(['QQQM', 'VOO', 'VGT']);
  const [activeNav, setActiveNav] = useState('ETF leaderboard');

  const rankedFunds = useMemo(() => funds
    .filter((fund) => {
      const matchesQuery = `${fund.symbol} ${fund.name} ${fund.category}`.toLowerCase().includes(query.toLowerCase());
      const beatsMarket = fund.returns[period] > benchmarks[period];
      const matchesCategory = category === 'All ETFs'
        || (category === 'Beating S&P' && beatsMarket)
        || (category === 'Trailing S&P' && !beatsMarket);
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => b.returns[period] - a.returns[period]), [category, period, query]);

  const selectedFund = funds.find((fund) => fund.symbol === selectedSymbol) ?? funds[0];
  const beatingCount = funds.filter((fund) => fund.returns[period] > benchmarks[period]).length;
  const isSelectedWatched = watchlist.includes(selectedFund.symbol);

  function toggleWatchlist(symbol) {
    setWatchlist((current) => current.includes(symbol)
      ? current.filter((item) => item !== symbol)
      : [...current, symbol]);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActiveNav('Overview')}>
          <span className="brand-mark"><span /></span>
          <span>fund<span className="brand-light">scope</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeNav === item.label ? 'active' : ''}`}
              key={item.label}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.label === 'My watchlist' && <span className="nav-count">{watchlist.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-orb">✦</span>
            <strong>See the whole picture</strong>
            <p>Get smarter about every corner of the market.</p>
            <button onClick={() => setActiveNav('Market insights')}>Explore insights <span>↗</span></button>
          </div>
          <button className="profile-button">
            <span className="avatar">JD</span>
            <span className="profile-copy"><strong>Jordan Davis</strong><span>Free plan</span></span>
            <span className="profile-menu">···</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Markets</span><span className="breadcrumb-slash">/</span><strong>ETF leaderboard</strong></div>
          <div className="topbar-actions">
            <span className="market-status"><span className="status-dot" />Market open</span>
            <button className="icon-button notification-button" aria-label="Notifications">♧<span /></button>
            <span className="topbar-avatar">JD</span>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" />YOUR MARKET, IN PERSPECTIVE</div>
              <h1>ETF leaderboard<span className="heading-period">.</span></h1>
              <p className="page-subtitle">Find the funds outpacing the market. All in one place.</p>
            </div>
            <div className="data-note"><span className="data-note-icon">◷</span><span>Illustrative sample data<br /><strong>Not real-time market quotes</strong></span></div>
          </section>

          <section className="summary-grid" aria-label="Market summary">
            <article className="summary-card">
              <div className="summary-top"><span>ETFs beating the S&amp;P 500</span><span className="summary-icon green">↗</span></div>
              <div className="summary-value">{beatingCount}<span className="summary-total"> / {funds.length}</span></div>
              <div className="summary-foot"><span className="mini-bar"><i style={{ width: `${(beatingCount / funds.length) * 100}%` }} /></span><span>over {period}</span></div>
            </article>
            <article className="summary-card">
              <div className="summary-top"><span>Top performer</span><span className="summary-icon purple">✦</span></div>
              <div className="summary-value summary-fund-value">{rankedFunds[0]?.symbol ?? '—'} <span className={`performance-pill ${rankedFunds[0]?.returns[period] >= 0 ? 'positive' : 'negative'}`}>{rankedFunds[0] ? formatPercent(rankedFunds[0].returns[period]) : '—'}</span></div>
              <div className="summary-foot"><span>{rankedFunds[0]?.name ?? 'No matching ETFs'}</span></div>
            </article>
            <article className="summary-card benchmark-card">
              <div className="summary-top"><span>S&amp;P 500 benchmark</span><span className="summary-icon neutral">⌁</span></div>
              <div className="summary-value">{formatPercent(benchmarks[period])}</div>
              <div className="summary-foot"><span>VOO · Vanguard S&amp;P 500 ETF</span><span className="benchmark-period">{period}</span></div>
            </article>
          </section>

          <section className="leaderboard-section">
            <div className="section-heading">
              <div><h2>Performance rankings</h2><p>Compare ETF returns against the S&amp;P 500</p></div>
              <button className="export-button" onClick={() => window.print()}><span>↓</span> Export</button>
            </div>
            <div className="controls-row">
              <div className="period-tabs" role="group" aria-label="Performance period">
                {periods.map((item) => (
                  <button className={period === item ? 'selected' : ''} key={item} onClick={() => setPeriod(item)}>{item}</button>
                ))}
              </div>
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input aria-label="Search ETFs" placeholder="Search ETFs..." value={query} onChange={(event) => setQuery(event.target.value)} />
                <kbd>⌘ K</kbd>
              </label>
            </div>

            <div className="filter-row">
              <div className="category-tabs" role="group" aria-label="Filter ETFs">
                {['All ETFs', 'Beating S&P', 'Trailing S&P'].map((item) => (
                  <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
              <span className="results-count">{rankedFunds.length} funds <span>·</span> Ranked by {period} return</span>
            </div>

            <div className="table-scroll">
              <table className="leaderboard-table">
                <thead>
                  <tr><th className="rank-column">#</th><th>ETF</th><th>Price</th><th>Today</th><th className="sorted-column">{period} return <span>↓</span></th><th>vs. S&amp;P 500</th><th className="trend-column">Trend</th><th aria-label="Watchlist" /></tr>
                </thead>
                <tbody>
                  {rankedFunds.map((fund, index) => {
                    const difference = fund.returns[period] - benchmarks[period];
                    const isWatched = watchlist.includes(fund.symbol);
                    return (
                      <tr className={selectedSymbol === fund.symbol ? 'selected-row' : ''} key={fund.symbol} onClick={() => setSelectedSymbol(fund.symbol)}>
                        <td className="rank-cell">{String(index + 1).padStart(2, '0')}</td>
                        <td><div className="fund-cell"><span className="fund-logo" style={{ '--fund-color': fund.color }}>{fund.symbol.slice(0, 1)}</span><span><strong>{fund.symbol}</strong><small>{fund.name}</small></span></div></td>
                        <td className="price-cell">${fund.price.toFixed(2)}</td>
                        <td className={fund.change >= 0 ? 'positive-text' : 'negative-text'}>{formatPercent(fund.change)}</td>
                        <td className={fund.returns[period] >= 0 ? 'positive-text return-cell' : 'negative-text return-cell'}>{formatPercent(fund.returns[period])}</td>
                        <td><span className={`alpha-badge ${difference >= 0 ? 'positive' : 'negative'}`}>{difference >= 0 ? '↑' : '↓'} {formatPercent(Math.abs(difference))}</span></td>
                        <td><Sparkline seed={index + 2} color={fund.color} negative={fund.returns[period] < 0} /></td>
                        <td><button className={`watch-button ${isWatched ? 'watched' : ''}`} aria-label={`${isWatched ? 'Remove' : 'Add'} ${fund.symbol} ${isWatched ? 'from' : 'to'} watchlist`} onClick={(event) => { event.stopPropagation(); toggleWatchlist(fund.symbol); }}>{isWatched ? '★' : '☆'}</button></td>
                      </tr>
                    );
                  })}
                  {rankedFunds.length === 0 && <tr><td className="empty-state" colSpan="8">No ETFs match that search. Try another symbol or fund name.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span><span className="footer-dot" />Returns include price appreciation only</span><button onClick={() => setCategory('All ETFs')}>View all funds <span>→</span></button></div>
          </section>

          <section className="bottom-grid">
            <article className="chart-card">
              <div className="card-heading">
                <div><div className="chart-card-label">FUND PERFORMANCE</div><h3>{selectedFund.name}</h3><span className="chart-symbol">{selectedFund.symbol} <span>·</span> {period}</span></div>
                <div className="chart-value-block"><strong className={selectedFund.returns[period] >= 0 ? 'positive-text' : 'negative-text'}>{formatPercent(selectedFund.returns[period])}</strong><span>{period} return</span></div>
              </div>
              <div className="chart-wrap"><PerformanceChart fund={selectedFund} period={period} /></div>
              <div className="chart-axis"><span>{period === '1D' ? '9:30 AM' : 'Start'}</span><span>{period === '1D' ? '12:00 PM' : 'Midpoint'}</span><span>Now</span></div>
              <div className="chart-legend"><span><i style={{ background: selectedFund.color }} />{selectedFund.symbol}</span><span><i className="legend-benchmark" />S&amp;P 500</span><span className="chart-demo">Illustrative trend</span></div>
            </article>
            <article className="watchlist-card">
              <div className="watchlist-heading"><div><div className="chart-card-label">KEEP AN EYE ON</div><h3>Your watchlist</h3></div><button aria-label="Add selected ETF to watchlist" onClick={() => toggleWatchlist(selectedFund.symbol)}>+</button></div>
              <div className="watchlist-items">
                {funds.filter((fund) => watchlist.includes(fund.symbol)).slice(0, 4).map((fund) => (
                  <button className={`watchlist-item ${selectedSymbol === fund.symbol ? 'active' : ''}`} key={fund.symbol} onClick={() => setSelectedSymbol(fund.symbol)}>
                    <span className="watchlist-mark" style={{ '--fund-color': fund.color }}>{fund.symbol.slice(0, 1)}</span>
                    <span className="watchlist-fund"><strong>{fund.symbol}</strong><small>${fund.price.toFixed(2)}</small></span>
                    <span className={`watchlist-return ${fund.returns[period] >= 0 ? 'positive-text' : 'negative-text'}`}>{formatPercent(fund.returns[period])}</span>
                  </button>
                ))}
                {watchlist.length === 0 && <p className="watchlist-empty">Your watchlist is empty. Star a fund to keep it close.</p>}
              </div>
              <button className="manage-watchlist" onClick={() => { setCategory('All ETFs'); setActiveNav('My watchlist'); }}>Manage watchlist <span>→</span></button>
            </article>
          </section>
          <footer className="page-footer"><span>Market data shown for illustrative purposes only.</span><span>Investing involves risk, including possible loss of principal.</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;

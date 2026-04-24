import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ThreeBackground from '../components/ThreeBackground.jsx'
import TopNav from '../components/TopNav.jsx'

function Bar({ v, col }) {
  return (
    <div style={{ height: 10, borderRadius: 999, border: '1px solid rgba(0,180,255,0.08)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${v}%`, background: col, boxShadow: '0 0 18px rgba(0,212,255,0.12)' }} />
    </div>
  )
}

function Badge({ children, col }) {
  return (
    <span className="mono" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(0,180,255,0.10)', background: 'rgba(255,255,255,0.02)', color: col, fontWeight: 900, letterSpacing: '0.14em' }}>
      {children}
    </span>
  )
}

export default function AdminDashboard() {
  const nav = useNavigate()
  const ticker = useMemo(
    () => [
      { symbol: 'BTC/USD', price: 67842.3, change: 2.24 },
      { symbol: 'ETH/USD', price: 3524.8, change: 1.12 },
      { symbol: 'EUR/USD', price: 1.0842, change: -0.22 },
      { symbol: 'USD/JPY', price: 153.42, change: 0.18 },
    ],
    [],
  )

  const kpis = useMemo(
    () => [
      { label: 'Volume', value: '$8.42M', top: 'var(--cyan)' },
      { label: 'Users', value: '1284', top: 'var(--green)' },
      { label: 'Revenue', value: '$24,180', top: 'var(--gold)' },
      { label: 'Escrow', value: '$142K', top: 'var(--purple)' },
    ],
    [],
  )

  const sessions = useMemo(
    () => [
      { user: 'AstraNova', status: 'LIVE', pair: 'BTC/USD', pnl: '+$842.30', bal: '$48,220' },
      { user: 'ZenQuant', status: 'LIVE', pair: 'EUR/USD', pnl: '-$124.50', bal: '$12,480' },
      { user: 'KairoX', status: 'IDLE', pair: 'USD/JPY', pnl: '+$92.10', bal: '$9,840' },
      { user: 'VegaPilot', status: 'LIVE', pair: 'ETH/USD', pnl: '+$210.40', bal: '$21,300' },
      { user: 'IronHawk', status: 'WARN', pair: 'OTC EUR', pnl: '-$48.30', bal: '$6,740' },
    ],
    [],
  )

  const endpoints = useMemo(
    () => [
      { m: 'GET', p: '/v1/markets' },
      { m: 'POST', p: '/v1/orders' },
      { m: 'GET', p: '/v1/orderbook' },
      { m: 'DELETE', p: '/v1/orders/:id' },
      { m: 'PUT', p: '/v1/risk/limits' },
      { m: 'GET', p: '/v1/users/sessions' },
      { m: 'POST', p: '/v1/escrow/release' },
      { m: 'GET', p: '/v1/admin/logs' },
      { m: 'PUT', p: '/v1/fees' },
      { m: 'POST', p: '/v1/auth/rotate' },
      { m: 'GET', p: '/v1/health' },
      { m: 'DELETE', p: '/v1/users/:id' },
    ],
    [],
  )

  const logs = useMemo(
    () => [
      { lvl: 'OK', msg: 'WS cluster stable • 0 drops (1m)' },
      { lvl: 'INFO', msg: 'Risk engine recalculated exposure (Δ 1.2%)' },
      { lvl: 'OK', msg: 'DB replication lag 8ms (p95)' },
      { lvl: 'WARN', msg: 'Rate limit burst detected (API key 0x7f3a...)' },
      { lvl: 'INFO', msg: 'Escrow release queued (ESC-7821)' },
      { lvl: 'ERR', msg: 'Order reject: insufficient margin (user ZenQuant)' },
      { lvl: 'OK', msg: 'Uptime heartbeat 99.9% sustained' },
    ],
    [],
  )

  const methodColor = (m) => {
    if (m === 'GET') return 'var(--green)'
    if (m === 'POST') return 'var(--cyan)'
    if (m === 'DELETE') return 'var(--red)'
    return 'var(--gold)'
  }

  const logColor = (lvl) => {
    if (lvl === 'OK') return 'var(--green)'
    if (lvl === 'INFO') return 'var(--cyan)'
    if (lvl === 'WARN') return 'var(--gold)'
    return 'var(--red)'
  }

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100%' }}>
      <ThreeBackground />
      <TopNav ticker={ticker} />

      <div className="pagePad" style={{ position: 'relative', zIndex: 10 }}>
        <div className="glass" style={{ borderRadius: 18, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>ADMIN COMMAND CENTER</div>
              <div className="mono" style={{ marginTop: 6, color: 'var(--muted)' }}>
                Threat-aware monitoring • Risk controls • Endpoint surface
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge col="var(--green)">● LIVE MONITORING</Badge>
              <button type="button" className="btn mono" onClick={() => nav('/')} style={{ cursor: 'none' }}>
                Back to Terminal
              </button>
            </div>
          </div>

          <div className="adminKpis" style={{ marginTop: 14 }}>
            {kpis.map((k) => (
              <div key={k.label} className="glass glass-hover" style={{ borderRadius: 18, padding: 14, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, borderTop: `3px solid ${k.top}` }} />
                <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {k.label}
                </div>
                <div className="mono" style={{ fontSize: 22, fontWeight: 900, marginTop: 10 }}>
                  {k.value}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Bar v={k.label === 'Users' ? 62 : k.label === 'Revenue' ? 44 : k.label === 'Escrow' ? 58 : 71} col={`linear-gradient(90deg, ${k.top}, rgba(255,255,255,0))`} />
                </div>
              </div>
            ))}
          </div>

          <div className="split_16_10" style={{ marginTop: 12 }}>
            <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                User Sessions
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {sessions.map((s) => (
                  <div key={s.user} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 0.8fr 0.8fr', gap: 10, padding: '10px 10px', borderRadius: 14, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid rgba(0,212,255,0.18)', background: 'radial-gradient(circle at 30% 25%, rgba(0,212,255,0.25), rgba(139,92,246,0.08), rgba(255,255,255,0.02))' }} />
                      <div style={{ fontWeight: 900 }}>{s.user}</div>
                    </div>
                    <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: s.status === 'LIVE' ? 'var(--green)' : s.status === 'WARN' ? 'var(--gold)' : 'rgba(74,122,155,0.8)' }} />
                      {s.status}
                    </div>
                    <div className="mono">{s.pair}</div>
                    <div className="mono" style={{ color: s.pnl.startsWith('+') ? 'var(--green)' : 'var(--red)', fontWeight: 900 }}>
                      {s.pnl}
                    </div>
                    <div className="mono" style={{ textAlign: 'right' }}>{s.bal}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                  System Stats
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div>
                    <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(223,240,255,0.8)' }}>
                      <span>CPU</span><span>34%</span>
                    </div>
                    <Bar v={34} col="linear-gradient(90deg, rgba(0,212,255,0.85), rgba(0,212,255,0))" />
                  </div>
                  <div>
                    <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(223,240,255,0.8)' }}>
                      <span>RAM</span><span>62%</span>
                    </div>
                    <Bar v={62} col="linear-gradient(90deg, rgba(139,92,246,0.85), rgba(139,92,246,0))" />
                  </div>
                  <div>
                    <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(223,240,255,0.8)' }}>
                      <span>Disk</span><span>41%</span>
                    </div>
                    <Bar v={41} col="linear-gradient(90deg, rgba(240,180,41,0.85), rgba(240,180,41,0))" />
                  </div>
                  <div>
                    <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(223,240,255,0.8)' }}>
                      <span>Net</span><span>18%</span>
                    </div>
                    <Bar v={18} col="linear-gradient(90deg, rgba(0,230,118,0.85), rgba(0,230,118,0))" />
                  </div>
                </div>
              </div>

              <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Performance Metrics
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}><span>API</span><span style={{ color: 'var(--green)', fontWeight: 900 }}>12ms</span></div>
                  <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}><span>WS</span><span style={{ color: 'var(--cyan)', fontWeight: 900 }}>4ms</span></div>
                  <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}><span>DB</span><span style={{ color: 'var(--gold)', fontWeight: 900 }}>8ms</span></div>
                  <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Uptime</span><span style={{ color: 'var(--purple)', fontWeight: 900 }}>99.9%</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="split_14_10" style={{ marginTop: 12 }}>
            <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                API Endpoints
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {endpoints.map((e) => (
                  <div key={e.m + e.p} style={{ borderRadius: 14, padding: 10, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="mono" style={{ fontWeight: 900, color: methodColor(e.m), letterSpacing: '0.14em' }}>
                      {e.m}
                    </div>
                    <div className="mono" style={{ marginTop: 6, color: 'rgba(223,240,255,0.82)' }}>
                      {e.p}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Revenue (Jan–Apr 2026)
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    { m: 'Jan', v: 52, col: 'linear-gradient(90deg, rgba(0,212,255,0.85), rgba(0,212,255,0))' },
                    { m: 'Feb', v: 64, col: 'linear-gradient(90deg, rgba(0,230,118,0.85), rgba(0,230,118,0))' },
                    { m: 'Mar', v: 44, col: 'linear-gradient(90deg, rgba(240,180,41,0.85), rgba(240,180,41,0))' },
                    { m: 'Apr', v: 71, col: 'linear-gradient(90deg, rgba(139,92,246,0.85), rgba(139,92,246,0))' },
                  ].map((b) => (
                    <div key={b.m}>
                      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(223,240,255,0.8)' }}>
                        <span>{b.m}</span><span>{b.v}%</span>
                      </div>
                      <Bar v={b.v} col={b.col} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Live System Logs
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {logs.map((l, idx) => (
                    <div key={idx} style={{ borderRadius: 14, padding: 10, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <span className="mono" style={{ color: logColor(l.lvl), fontWeight: 900, letterSpacing: '0.14em' }}>
                        {l.lvl}
                      </span>
                      <span className="mono" style={{ color: 'rgba(223,240,255,0.82)', textAlign: 'right' }}>
                        {l.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


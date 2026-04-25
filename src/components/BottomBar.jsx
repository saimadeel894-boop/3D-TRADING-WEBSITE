import { AlertTriangle, Bell, ShieldCheck } from 'lucide-react'

function Pnl({ value }) {
  const up = value >= 0
  return (
    <span className="mono" style={{ color: up ? 'var(--green)' : 'var(--red)', fontWeight: 800 }}>
      {up ? '+' : '-'}${Math.abs(value).toFixed(2)}
    </span>
  )
}

export default function BottomBar({ positions, trades, alerts, onClose }) {
  const icon = (k) => (k === 'risk' ? <AlertTriangle size={14} /> : k === 'bell' ? <Bell size={14} /> : <ShieldCheck size={14} />)

  const sectionTitleStyle = {
    fontFamily: 'JetBrains Mono',
    fontSize: '9px',
    color: '#4a7a9b',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '8px'
  }

  const sectionStyle = {
    flex: 1, 
    minWidth: 0, 
    borderRight: '1px solid rgba(0,180,255,0.08)',
    paddingRight: '12px'
  }

  return (
    <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
      <div
        className="glass"
        style={{
          height: 118,
          borderRadius: 0,
          padding: '10px 16px',
          background: 'rgba(4,10,20,0.97)',
          borderTop: '1px solid rgba(0,180,255,0.1)',
          display: 'flex',
          gap: 12,
        }}
      >
        <section style={sectionStyle}>
          <div style={sectionTitleStyle}>
            OPEN POSITIONS
          </div>
          <div style={{ display: 'grid', gap: 6, overflowY: 'auto', maxHeight: '72px' }}>
            {positions.slice(0, 3).map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '4px 8px', borderRadius: 10, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontWeight: 900, fontSize: 11 }}>{p.pair}</div>
                  <span
                    className="mono"
                    style={{
                      fontSize: 9,
                      padding: '2px 6px',
                      borderRadius: 999,
                      border: '1px solid rgba(0,180,255,0.10)',
                      background: p.side === 'buy' ? 'rgba(0,230,118,0.10)' : 'rgba(255,61,113,0.10)',
                      color: p.side === 'buy' ? 'var(--green)' : 'var(--red)',
                      fontWeight: 800,
                    }}
                  >
                    {p.side === 'buy' ? 'LONG' : 'SHORT'}
                  </span>
                </div>
                <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                  <span style={{ color: 'rgba(223,240,255,0.75)' }}>{p.entry.toFixed(2)} → {p.entry.toFixed(2) /* Mock current */}</span>
                  <Pnl value={p.pnl || 0} />
                  <button
                    type="button"
                    onClick={() => onClose?.(p.id)}
                    className="mono"
                    style={{
                      borderRadius: 999,
                      padding: '4px 8px',
                      border: '1px solid rgba(0,212,255,0.22)',
                      background: 'rgba(0,212,255,0.06)',
                      color: 'var(--text)',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      cursor: 'none',
                    }}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionTitleStyle}>
            RECENT TRADES
          </div>
          <div style={{ display: 'grid', gap: 6, overflowY: 'auto', maxHeight: '72px' }}>
            {trades.slice(0, 3).map((t) => (
              <div key={t.id || `${t.pair}-${t.openedAt || t.time}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '4px 8px', borderRadius: 10, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 11 }}>{t.pair}</div>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>
                    {t.time}
                  </div>
                </div>
                <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                  <span style={{ color: 'rgba(223,240,255,0.75)' }}>{t.size?.toFixed ? t.size.toFixed(4) : t.size}</span>
                  <Pnl value={t.pnl || 0} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ flex: 1, minWidth: 0 }}>
          <div style={sectionTitleStyle}>
            MARKET ALERTS
          </div>
          <div style={{ display: 'grid', gap: 6, overflowY: 'auto', maxHeight: '72px' }}>
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '4px 8px', borderRadius: 10, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: a.level === 'WARN' ? 'var(--gold)' : a.level === 'RISK' ? 'var(--red)' : 'var(--cyan)' }}>
                    {icon(a.icon)}
                  </span>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 11 }}>{a.title}</div>
                    <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>
                      {a.detail}
                    </div>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 9, color: a.level === 'WARN' ? 'var(--gold)' : a.level === 'RISK' ? 'var(--red)' : 'var(--cyan)', fontWeight: 900, letterSpacing: '0.14em' }}>
                  {a.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}


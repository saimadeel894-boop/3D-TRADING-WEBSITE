import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThreeBackground from '../components/ThreeBackground.jsx'
import TopNav from '../components/TopNav.jsx'

function Badge({ text, col }) {
  return (
    <span className="mono" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(0,180,255,0.10)', background: 'rgba(255,255,255,0.02)', color: col, fontWeight: 900, letterSpacing: '0.14em' }}>
      {text}
    </span>
  )
}

export default function P2PMarketplace() {
  const nav = useNavigate()
  const ticker = useMemo(
    () => [
      { symbol: 'BTC/USD', price: 67842.3, change: 1.84 },
      { symbol: 'ETH/USD', price: 3524.8, change: 0.74 },
      { symbol: 'EUR/USD', price: 1.0842, change: -0.12 },
      { symbol: 'USD/JPY', price: 153.42, change: 0.28 },
    ],
    [],
  )

  const trades = useMemo(
    () => [
      { id: 'ESC-7811', status: 'LOCKED', user: 'AstraNova', amount: '$1,240', asset: 'USDT', time: '2m ago' },
      { id: 'ESC-7821', status: 'PENDING', user: 'ZenQuant', amount: '$2,450', asset: 'USDT', time: 'now' },
      { id: 'ESC-7803', status: 'RELEASED', user: 'VegaPilot', amount: '$980', asset: 'USDT', time: '11m ago' },
    ],
    [],
  )

  const [msgs, setMsgs] = useState([
    { id: 1, who: 'Buyer', msg: 'Funds deposited. Waiting for seller confirmation.' },
    { id: 2, who: 'Seller', msg: 'Confirmed. Preparing release steps and proof.' },
    { id: 3, who: 'System', msg: 'Escrow conditions verified. Step 3 is now active.' },
    { id: 4, who: 'Buyer', msg: 'Received confirmation. Ready to release escrow after final check.' },
  ])
  const [text, setText] = useState('')

  const send = () => {
    const t = text.trim()
    if (!t) return
    setMsgs((p) => [...p, { id: Date.now(), who: 'You', msg: t }])
    setText('')
  }

  const step = (done, label, active) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        className="mono"
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: '1px solid rgba(0,180,255,0.12)',
          background: done ? 'rgba(0,230,118,0.12)' : active ? 'rgba(240,180,41,0.12)' : 'rgba(255,255,255,0.02)',
          color: done ? 'var(--green)' : active ? 'var(--gold)' : 'var(--muted)',
          fontWeight: 900,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {done ? '✓' : active ? '⟳' : '○'}
      </div>
      <div className="mono" style={{ color: done ? 'rgba(223,240,255,0.9)' : active ? 'rgba(223,240,255,0.9)' : 'var(--muted)' }}>
        {label}
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
      <ThreeBackground />
      <TopNav ticker={ticker} />

      <div style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em' }}>P2P Escrow Trades</div>
                  <div className="mono" style={{ color: 'var(--muted)', marginTop: 6 }}>Multi-step escrow with live chat and release controls</div>
                </div>
                <button type="button" className="btn mono" onClick={() => nav('/')} style={{ cursor: 'none' }}>
                  Back
                </button>
              </div>

              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                {trades.map((t) => {
                  const col = t.status === 'LOCKED' ? 'var(--cyan)' : t.status === 'PENDING' ? 'var(--gold)' : 'var(--green)'
                  return (
                    <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr', gap: 10, padding: '10px 10px', borderRadius: 14, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)', alignItems: 'center' }}>
                      <div className="mono" style={{ fontWeight: 900, color: 'rgba(223,240,255,0.9)' }}>{t.id}</div>
                      <div><Badge text={t.status} col={col} /></div>
                      <div className="mono">{t.user}</div>
                      <div className="mono" style={{ textAlign: 'right' }}>{t.amount}</div>
                      <div className="mono" style={{ textAlign: 'right', color: 'var(--muted)' }}>{t.time}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 16, fontWeight: 900 }}>In-trade chat</div>
                <div className="pill mono" style={{ color: 'var(--gold)' }}>#ESC-7821</div>
              </div>

              <div style={{ marginTop: 12, height: 260, overflow: 'auto', paddingRight: 6, display: 'grid', gap: 10 }}>
                {msgs.map((m) => (
                  <div key={m.id} style={{ display: 'grid', gap: 6 }}>
                    <div className="mono" style={{ fontSize: 11, color: m.who === 'System' ? 'var(--gold)' : m.who === 'You' ? 'var(--cyan)' : 'var(--muted)', letterSpacing: '0.14em', fontWeight: 900 }}>
                      {m.who}
                    </div>
                    <div style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)', color: 'rgba(223,240,255,0.9)' }}>
                      {m.msg}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type message…"
                  className="mono"
                  style={{ flex: 1, borderRadius: 14, padding: '10px 12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)', outline: 'none', cursor: 'none' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') send()
                  }}
                />
                <button type="button" className="btn btnPrimary mono" onClick={send} style={{ cursor: 'none' }}>
                  Send
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 16, fontWeight: 900 }}>Escrow Widget</div>
                <Badge text="$2,450 LOCKED" col="var(--cyan)" />
              </div>

              <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                {step(true, 'Funds deposited', false)}
                {step(true, 'Counterparty verified', false)}
                {step(false, 'Release active', true)}
                {step(false, 'Settlement complete', false)}
              </div>

              <button
                type="button"
                className="mono"
                style={{
                  marginTop: 14,
                  width: '100%',
                  borderRadius: 16,
                  padding: '14px 14px',
                  border: '1px solid rgba(240,180,41,0.55)',
                  background: 'linear-gradient(180deg, rgba(240,180,41,0.25), rgba(240,180,41,0.08))',
                  color: 'var(--text)',
                  fontWeight: 900,
                  letterSpacing: '0.16em',
                  cursor: 'none',
                  boxShadow: '0 0 28px rgba(240,180,41,0.16)',
                }}
              >
                RELEASE ESCROW →
              </button>
            </div>

            <div className="glass" style={{ borderRadius: 18, padding: 14 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                P2P Stats
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { k: 'Total Trades', v: '1842', c: 'var(--cyan)' },
                  { k: 'Success', v: '99.2%', c: 'var(--green)' },
                  { k: 'Avg', v: '4.2m', c: 'var(--gold)' },
                  { k: 'Disputes', v: '0.8%', c: 'var(--purple)' },
                ].map((s) => (
                  <div key={s.k} style={{ borderRadius: 14, padding: 10, border: '1px solid rgba(0,180,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>{s.k}</div>
                    <div className="mono" style={{ fontWeight: 900, fontSize: 18, marginTop: 6, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" className="btn mono" onClick={() => nav('/')} style={{ cursor: 'none' }}>
              Back to Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


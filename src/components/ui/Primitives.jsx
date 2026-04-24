export function Panel({ className = '', style, children }) {
  return (
    <div className={`glass densePanel ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

export function SectionHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
      <div>
        <div className="sectionTitle">{title}</div>
        {subtitle ? <div className="sectionSub mono">{subtitle}</div> : null}
      </div>
      {right || null}
    </div>
  )
}

export function MetricCard({ label, value, tone = 'var(--cyan)', footer }) {
  return (
    <div className="glass glass-hover" style={{ borderRadius: 16, padding: 12, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, borderTop: `2px solid ${tone}`, borderRadius: 16 }} />
      <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 900, marginTop: 8 }}>
        {value}
      </div>
      {footer ? <div style={{ marginTop: 10 }}>{footer}</div> : null}
    </div>
  )
}


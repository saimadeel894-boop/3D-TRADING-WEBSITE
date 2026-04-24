import { useMemo, useState } from 'react'
import TiltCard from './TiltCard.jsx'

function Toggle({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-2xl border border-glass bg-white/5 px-3 py-3 text-sm text-text-primary transition-colors hover:bg-white/10"
    >
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
          {value ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      <div
        className={[
          'relative h-6 w-11 rounded-full border transition-colors',
          value ? 'bg-emerald-500/25 border-emerald-500/25' : 'bg-white/5 border-glass',
        ].join(' ')}
      >
        <div
          className={[
            'absolute top-1 h-4 w-4 rounded-full transition-transform',
            value ? 'left-6 bg-emerald-300' : 'left-1 bg-slate-200/70',
          ].join(' ')}
        />
      </div>
    </button>
  )
}

function Field({ label, value, onChange, suffix }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-[0.22em] text-text-muted">{label}</div>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-glass bg-white/5 px-3 py-2 text-sm text-text-primary outline-none focus:border-glass-strong"
        />
        {suffix ? (
          <div className="rounded-2xl border border-glass bg-white/5 px-3 py-2 text-xs text-text-secondary">
            {suffix}
          </div>
        ) : null}
      </div>
    </label>
  )
}

export default function PlatformControls() {
  const [toggles, setToggles] = useState({
    trading: true,
    registrations: true,
    withdrawals: true,
    maintenance: false,
  })
  const [risk, setRisk] = useState({ maxLev: '100', minSize: '10', fee: '0.06' })

  const status = useMemo(() => (toggles.maintenance ? 'Maintenance' : toggles.trading ? 'Live' : 'Paused'), [toggles])
  const statusColor = toggles.maintenance ? 'text-amber-200' : toggles.trading ? 'text-emerald-200' : 'text-red-200'

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
      <TiltCard className="glass rounded-3xl p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="text-sm font-semibold text-text-primary">Platform Controls</div>
          <div className={['text-[11px] uppercase tracking-[0.22em] tabular-nums', statusColor].join(' ')}>
            {status}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Toggle
            label="Trading Enabled"
            value={toggles.trading}
            onChange={(v) => setToggles((s) => ({ ...s, trading: v }))}
          />
          <Toggle
            label="New Registrations"
            value={toggles.registrations}
            onChange={(v) => setToggles((s) => ({ ...s, registrations: v }))}
          />
          <Toggle
            label="Withdrawals"
            value={toggles.withdrawals}
            onChange={(v) => setToggles((s) => ({ ...s, withdrawals: v }))}
          />
          <Toggle
            label="Maintenance Mode"
            value={toggles.maintenance}
            onChange={(v) => setToggles((s) => ({ ...s, maintenance: v }))}
          />
        </div>
      </TiltCard>

      <TiltCard className="glass rounded-3xl p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="text-sm font-semibold text-text-primary">Risk Management</div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Editable</div>
        </div>

        <div className="space-y-3">
          <Field
            label="Max Leverage Allowed"
            value={risk.maxLev}
            onChange={(v) => setRisk((s) => ({ ...s, maxLev: v }))}
            suffix="x"
          />
          <Field
            label="Min Trade Size"
            value={risk.minSize}
            onChange={(v) => setRisk((s) => ({ ...s, minSize: v }))}
            suffix="USDT"
          />
          <Field
            label="Fee Rate"
            value={risk.fee}
            onChange={(v) => setRisk((s) => ({ ...s, fee: v }))}
            suffix="%"
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="w-full rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-500/35 to-red-500/10 px-4 py-3 text-sm font-semibold text-text-primary shadow-[0_0_28px_rgba(239,68,68,0.24)] transition-transform duration-200 hover:-translate-y-[1px]"
          >
            Pause All Trading
          </button>
          <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-text-muted">
            Emergency control requires confirmation in production.
          </div>
        </div>
      </TiltCard>
    </div>
  )
}


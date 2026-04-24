import Navbar from '../components/Navbar.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'
import StatCard from '../components/StatCard.jsx'
import AdminCharts from '../components/AdminCharts.jsx'
import TradesTable from '../components/TradesTable.jsx'
import Leaderboard from '../components/Leaderboard.jsx'
import PlatformControls from '../components/PlatformControls.jsx'
import { useRafCountUp } from '../hooks/useRafCountUp.js'
import { Activity, DollarSign, Layers, TrendingUp } from 'lucide-react'
import CinematicRays from '../components/CinematicRays.jsx'
import GridFloor from '../components/GridFloor.jsx'
import Reveal from '../components/Reveal.jsx'

function fmtInt(n) {
  return Math.round(n).toLocaleString()
}

export default function Admin() {
  const vol = useRafCountUp({ to: 4_200_000_000, durationMs: 1200, start: true })
  const users = useRafCountUp({ to: 24847, durationMs: 1200, start: true })
  const open = useRafCountUp({ to: 18432, durationMs: 1200, start: true })
  const rev = useRafCountUp({ to: 842000, durationMs: 1200, start: true })

  return (
    <div className="relative min-h-screen overflow-hidden noise">
      <Navbar />
      <div className="absolute inset-0 bg-hero-linear" />
      <div className="absolute inset-0 bg-hero-radial opacity-70" />
      <CinematicRays className="opacity-55" />
      <GridFloor className="opacity-65" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-28 pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <div className="h-[calc(100vh-180px)] lg:sticky lg:top-28">
            <AdminSidebar />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Platform Volume"
                value={`$${(vol / 1_000_000_000).toFixed(1)}B`}
                sub="7d trend: +12.4%"
                icon={TrendingUp}
                trend="up"
                spark={[12, 13, 13.6, 14.1, 14.0, 14.7, 15.4]}
              />
              <StatCard
                label="Active Users"
                value={fmtInt(users)}
                sub="Real-time sessions"
                icon={Activity}
                trend="up"
                spark={[7, 7.2, 7.15, 7.35, 7.5, 7.65, 7.82]}
              />
              <StatCard
                label="Open Positions"
                value={fmtInt(open)}
                sub="Across all markets"
                icon={Layers}
                trend="up"
                spark={[10.1, 10.2, 10.0, 10.25, 10.4, 10.35, 10.55]}
              />
              <StatCard
                label="Platform Revenue"
                value={`$${fmtInt(rev)}`}
                sub="Fees & funding"
                icon={DollarSign}
                trend="up"
                spark={[9.2, 9.4, 9.35, 9.6, 9.7, 9.75, 10.0]}
              />
            </div>

            <Reveal>
              <AdminCharts />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TradesTable />
                <Leaderboard />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <PlatformControls />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}


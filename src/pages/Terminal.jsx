import Navbar from '../components/Navbar.jsx'
import CandleChart from '../components/CandleChart.jsx'
import OrderBook from '../components/OrderBook.jsx'
import OrderForm from '../components/OrderForm.jsx'
import Positions from '../components/Positions.jsx'
import TerminalSidebar from '../components/TerminalSidebar.jsx'
import TickerBar from '../components/TickerBar.jsx'
import { useLivePrices } from '../hooks/useLivePrice.js'
import TiltCard from '../components/TiltCard.jsx'
import Globe3D from '../components/Globe3D.jsx'
import CinematicRays from '../components/CinematicRays.jsx'
import GridFloor from '../components/GridFloor.jsx'

export default function Terminal() {
  const { bySymbol } = useLivePrices({ intervalMs: 1000 })
  const btc = bySymbol.get('BTC/USDT')?.price ?? 67842.3
  const eth = bySymbol.get('ETH/USDT')?.price ?? 3524.8

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-hero-linear" />
      <div className="absolute inset-0 bg-hero-radial opacity-70" />
      <CinematicRays />
      <GridFloor className="opacity-75" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-28 pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[52px_1fr_280px]">
          <div className="h-[calc(100vh-180px)]">
            <TerminalSidebar />
          </div>

          <div className="h-[calc(100vh-180px)]">
            <TiltCard className="h-full">
              <CandleChart symbol="BTC/USDT" intervalMs={1200} />
            </TiltCard>
          </div>

          <div className="h-[calc(100vh-180px)] space-y-4 overflow-auto pr-1 scrollbar-thin">
            <OrderBook mid={btc} />
            <OrderForm markPrice={btc} />
            <Positions marks={{ BTC: btc, ETH: eth }} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[-120px] top-[120px] hidden h-[420px] w-[420px] opacity-40 lg:block">
        <Globe3D className="h-full w-full" bloom />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40">
        <TickerBar />
      </div>
    </div>
  )
}


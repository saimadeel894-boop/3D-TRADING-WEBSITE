import { useEffect, useMemo, useState } from 'react'
import ThreeBackground from '../components/ThreeBackground.jsx'
import TopNav from '../components/TopNav.jsx'
import PairSidebar from '../components/PairSidebar.jsx'
import CandlestickChart from '../components/CandlestickChart.jsx'
import OrderPanel from '../components/OrderPanel.jsx'
import BottomBar from '../components/BottomBar.jsx'

function baseFor(pair) {
  if (pair.includes('BTC')) return 67842.3
  if (pair.includes('ETH')) return 3524.8
  if (pair.includes('JPY')) return 153.42
  if (pair.includes('OTC')) return 1.10
  return 1.0
}

function drift(pair) {
  if (pair.includes('BTC')) return 0.0032
  if (pair.includes('ETH')) return 0.004
  if (pair.includes('JPY')) return 0.0015
  return 0.0012
}

export default function TradingTerminal() {
  const [selectedPair, setSelectedPair] = useState('BTC/USD')
  const [priceMap, setPriceMap] = useState(() => new Map([['BTC/USD', 67842.3], ['ETH/USD', 3524.8]]))

  useEffect(() => {
    const id = setInterval(() => {
      setPriceMap((prev) => {
        const next = new Map(prev)
        // keep these 4 for top ticker
        const keys = ['BTC/USD', 'ETH/USD', 'EUR/USD', 'USD/JPY']
        for (const k of keys) {
          const cur = next.get(k) ?? baseFor(k)
          const pct = drift(k)
          const noise = (Math.random() - 0.5) * 2
          next.set(k, cur * (1 + noise * pct))
        }
        // selected pair always updates
        const curSel = next.get(selectedPair) ?? baseFor(selectedPair)
        next.set(selectedPair, curSel * (1 + (Math.random() - 0.5) * 2 * drift(selectedPair)))
        return next
      })
    }, 1200)
    return () => clearInterval(id)
  }, [selectedPair])

  const price = priceMap.get(selectedPair) ?? baseFor(selectedPair)

  const ticker = useMemo(() => {
    const items = [
      { symbol: 'BTC/USD', price: priceMap.get('BTC/USD') ?? 67842.3 },
      { symbol: 'ETH/USD', price: priceMap.get('ETH/USD') ?? 3524.8 },
      { symbol: 'EUR/USD', price: priceMap.get('EUR/USD') ?? 1.0842 },
      { symbol: 'USD/JPY', price: priceMap.get('USD/JPY') ?? 153.42 },
    ]
    return items.map((it) => ({
      ...it,
      change: (Math.random() - 0.5) * 1.4,
    }))
  }, [priceMap])

  const positions = useMemo(() => {
    const btc = (priceMap.get('BTC/USD') ?? 67842.3)
    const eth = (priceMap.get('ETH/USD') ?? 3524.8)
    return [
      { pair: 'BTC/USD', dir: 'LONG', entry: 66420, current: btc, pnl: (btc - 66420) * 0.04 },
      { pair: 'ETH/USD', dir: 'SHORT', entry: 3610, current: eth, pnl: (3610 - eth) * 0.55 },
      { pair: 'EUR/USD', dir: 'LONG', entry: 1.0731, current: priceMap.get('EUR/USD') ?? 1.0842, pnl: 182.4 },
    ]
  }, [priceMap])

  const trades = useMemo(
    () => [
      { id: 1, pair: 'BTC/USD', size: '0.120', pnl: 84.12, time: '2s ago' },
      { id: 2, pair: 'USD/JPY', size: '2.50', pnl: -32.8, time: '14s ago' },
      { id: 3, pair: 'ETH/USD', size: '1.20', pnl: 26.4, time: '41s ago' },
    ],
    [],
  )

  const alerts = useMemo(
    () => [
      { id: 1, icon: 'bell', level: 'INFO', title: 'Volatility spike', detail: 'BTC/USD 1m ATR +18%' },
      { id: 2, icon: 'risk', level: 'RISK', title: 'Leverage exposure', detail: 'Margin ratio > 62% (3 users)' },
      { id: 3, icon: 'shield', level: 'WARN', title: 'Funding anomaly', detail: 'ETH perp funding deviating' },
    ],
    [],
  )

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100%' }}>
      <ThreeBackground />
      <TopNav ticker={ticker} />

      <div className="pagePad" style={{ position: 'relative', zIndex: 10 }}>
        <div className="terminalGrid">
          <PairSidebar selected={selectedPair} onSelect={setSelectedPair} />
          <div style={{ minHeight: 520 }}>
            <CandlestickChart pair={selectedPair} basePrice={price} />
          </div>
          <OrderPanel pair={selectedPair} price={price} />
        </div>
      </div>

      <BottomBar positions={positions} trades={trades} alerts={alerts} />
    </div>
  )
}


import { useMemo, useState } from 'react'
import ThreeBackground from '../components/ThreeBackground.jsx'
import TopNav from '../components/TopNav.jsx'
import PairSidebar from '../components/PairSidebar.jsx'
import CandlestickChart from '../components/CandlestickChart.jsx'
import OrderPanel from '../components/OrderPanel.jsx'
import BottomBar from '../components/BottomBar.jsx'
import { useBinancePrice } from '../hooks/useBinancePrice.js'
import { useBinanceCandles } from '../hooks/useBinanceCandles.js'
import { useBinanceOrderBook } from '../hooks/useBinanceOrderBook.js'
import { useMultiTicker } from '../hooks/useMultiTicker.js'
import { useSimulatedOrders } from '../hooks/useSimulatedOrders.js'

const PAIRS = ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt']
const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1D']

function pairLabel(p) {
  return p.replace('usdt', '/USDT').toUpperCase()
}

export default function TradingTerminal() {
  const [activePair, setActivePair] = useState('btcusdt')
  const [activeInterval, setActiveInterval] = useState('1m')

  const { tickers, status: multiStatus } = useMultiTicker()
  const { data: ticker, status: tickerStatus } = useBinancePrice(activePair)
  const { book, status: bookStatus } = useBinanceOrderBook(activePair)
  const binanceInterval = activeInterval === '1D' ? '1d' : activeInterval
  const { candles, status: candlesStatus, isLoading: candlesLoading } = useBinanceCandles(activePair, binanceInterval)

  const markPrice = ticker?.price ?? 0
  const sim = useSimulatedOrders(markPrice || 0, { pairLabel: pairLabel(activePair) })

  const topTicker = useMemo(() => {
    // map to existing TopNav shape: [{symbol, price, change(number)}]
    const out = PAIRS.slice(0, 4).map((p) => {
      const key = p.toUpperCase()
      const t = tickers[key]
      return {
        symbol: pairLabel(p),
        price: t?.price ?? 0,
        change: Number.parseFloat(t?.change ?? '0'),
      }
    })
    return out
  }, [tickers])

  const connection = useMemo(() => {
    const connected =
      multiStatus === 'connected' &&
      tickerStatus === 'connected' &&
      bookStatus === 'connected' &&
      candlesStatus === 'connected'
    const anyDisconnected =
      multiStatus === 'disconnected' ||
      tickerStatus === 'disconnected' ||
      bookStatus === 'disconnected' ||
      candlesStatus === 'disconnected'
    return connected ? 'connected' : anyDisconnected ? 'disconnected' : 'connecting'
  }, [bookStatus, candlesStatus, multiStatus, tickerStatus])

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
      <TopNav ticker={topTicker} connectionStatus={connection} balance={sim.balance} />

      <div className="pagePad" style={{ position: 'relative', zIndex: 1 }}>
        <div className="mobilePairHeader glass mono">
          <span>{pairLabel(activePair)}</span>
          <span style={{ color: ticker?.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
            ${markPrice ? markPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
          </span>
        </div>
        <div className="terminalGrid" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: 12, minHeight: 0 }}>
          <PairSidebar
            pairs={PAIRS}
            tickers={tickers}
            selected={activePair}
            onSelect={setActivePair}
          />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', height: 'calc(100vh - 280px)' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <CandlestickChart
              pair={pairLabel(activePair)}
              interval={activeInterval}
              onInterval={(it) => setActiveInterval(it)}
              intervals={INTERVALS}
              candles={candles}
              isLoading={candlesLoading}
              status={candlesStatus}
            />
            </div>
          </div>
          <OrderPanel
            pair={pairLabel(activePair)}
            symbol={activePair}
            price={markPrice}
            ticker={ticker}
            book={book}
            bookStatus={bookStatus}
            balance={sim.balance}
            positions={sim.positions}
            placeOrder={sim.placeOrder}
            closePosition={sim.closePosition}
          />
          </div>
        </div>
      </div>

      <BottomBar positions={sim.positions} trades={sim.tradeHistory} alerts={alerts} onClose={sim.closePosition} />
    </div>
  )
}


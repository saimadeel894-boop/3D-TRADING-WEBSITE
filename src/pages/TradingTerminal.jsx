import { useEffect, useRef, useState } from 'react';
import TopNav from '../components/TopNav';
import PairSidebar from '../components/PairSidebar';
import CandlestickChart from '../components/CandlestickChart';
import OrderPanel from '../components/OrderPanel';
import BottomBar from '../components/BottomBar';
import ThreeBackground from '../components/ThreeBackground';

export default function TradingTerminal() {
  const [selectedPair, setSelectedPair] = useState({
    name: 'BTC/USDT',
    price: 77685,
    change: 0.16,
    category: 'crypto'
  });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#010409',
      position: 'relative',
      fontFamily: "'Rajdhani', sans-serif",
      color: '#dff0ff',
      cursor: 'none'
    }}>
      
      {/* 3D Background — subtle particles ONLY */}
      <ThreeBackground />
      
      {/* Scanline overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.007) 3px, rgba(0,212,255,0.007) 4px)',
        pointerEvents: 'none', zIndex: 3
      }} />

      {/* Nav */}
      <div style={{ position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <TopNav selectedPair={selectedPair} />
      </div>

      {/* Main trading area */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
        minHeight: 0
      }}>
        <PairSidebar 
          selected={selectedPair.name.replace('/', '').toLowerCase()} 
          onSelect={(key) => {
             // Mock updating object based on string key for compatibility
             setSelectedPair({
               name: key.toUpperCase().replace('USDT', '/USDT'),
               price: 77685,
               change: 0.16,
               category: 'crypto'
             });
          }} 
        />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
          borderLeft: '1px solid rgba(0,180,255,0.1)',
          borderRight: '1px solid rgba(0,180,255,0.1)',
          background: 'rgba(6,14,26,0.85)'
        }}>
          {/* Chart header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderBottom: '1px solid rgba(0,180,255,0.1)',
            flexShrink: 0,
            background: 'rgba(6,14,26,0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 19, fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                {selectedPair.name}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20, fontWeight: 700,
                color: selectedPair.change >= 0 ? '#00e676' : '#ff3d71',
                textShadow: selectedPair.change >= 0
                  ? '0 0 12px rgba(0,230,118,0.4)'
                  : '0 0 12px rgba(255,61,113,0.4)'
              }}>
                ${selectedPair.price.toLocaleString()}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: selectedPair.change >= 0 ? '#00e676' : '#ff3d71'
              }}>
                {selectedPair.change >= 0 ? '▲' : '▼'} 
                {Math.abs(selectedPair.change).toFixed(2)}%
              </span>
            </div>
            {/* Timeframe buttons */}
            <div style={{ display: 'flex', gap: 2 }}>
              {['1M','5M','15M','1H','4H','1D'].map(tf => (
                <button key={tf} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, padding: '4px 9px',
                  borderRadius: 3, border: 'none',
                  background: tf === '1H'
                    ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: tf === '1H' ? '#00d4ff' : '#4a7a9b',
                  cursor: 'none'
                }}>{tf}</button>
              ))}
            </div>
            {/* Indicator badges */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                {label:'EMA 9/21', bg:'rgba(139,92,246,0.15)', 
                 color:'#a78bfa', border:'rgba(139,92,246,0.25)'},
                {label:'RSI', bg:'rgba(240,180,41,0.1)', 
                 color:'#f0b429', border:'rgba(240,180,41,0.2)'},
                {label:'VOL MA', bg:'rgba(0,212,255,0.08)', 
                 color:'#00d4ff', border:'rgba(0,180,255,0.1)'},
              ].map(b => (
                <span key={b.label} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, padding: '3px 8px',
                  borderRadius: 3, letterSpacing: '0.06em',
                  background: b.bg, color: b.color,
                  border: `1px solid ${b.border}`
                }}>{b.label}</span>
              ))}
            </div>
          </div>
          {/* Chart canvas */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
            <CandlestickChart pair={selectedPair.name} />
          </div>
        </div>
        <OrderPanel pair={selectedPair.name} price={selectedPair.price} />
      </div>

      <BottomBar positions={[]} trades={[]} alerts={[]} />
    </div>
  );
}


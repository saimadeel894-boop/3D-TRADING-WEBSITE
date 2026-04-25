import { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TradingTerminal from './pages/TradingTerminal.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import P2PMarketplace from './pages/P2PMarketplace.jsx'

function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rx = 0, ry = 0, mx = 0, my = 0, currentScale = 1, isPointer = false, rafId;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target;
      isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
                  ['BUTTON', 'A', 'INPUT', 'SELECT'].includes(target.tagName);
    };

    const follow = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      
      const targetScale = isPointer ? 1.5 : 1;
      currentScale += (targetScale - currentScale) * 0.2;
      ring.style.transform = `translate(-50%,-50%) scale(${currentScale})`;
      ring.style.borderColor = isPointer ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.35)';
      
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      rafId = requestAnimationFrame(follow);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    follow();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed',
        width: 10,
        height: 10,
        background: '#00d4ff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 14px #00d4ff, 0 0 4px #00d4ff'
      }} />
      <div ref={ringRef} style={{
        position: 'fixed',
        width: 32,
        height: 32,
        border: '1px solid rgba(0,212,255,0.5)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99998,
        transform: 'translate(-50%,-50%)'
      }} />
    </>
  );
}

export default function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/home"     element={<HomePage />} />
        <Route path="/terminal" element={<TradingTerminal />} />
        <Route path="/admin"    element={<AdminDashboard />} />
        <Route path="/p2p"      element={<P2PMarketplace />} />
      </Routes>
    </>
  );
}

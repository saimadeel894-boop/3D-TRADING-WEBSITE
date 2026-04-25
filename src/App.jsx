import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import TradingTerminal from './pages/TradingTerminal.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import P2PMarketplace from './pages/P2PMarketplace.jsx'

function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  let rx = 0, ry = 0;

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    };

    const follow = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(follow);
    };

    document.addEventListener('mousemove', onMove);
    follow();
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed',
        width: 10, height: 10,
        background: '#00d4ff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 12px #00d4ff',
        transition: 'transform 0.08s'
      }} />
      <div ref={ringRef} style={{
        position: 'fixed',
        width: 32, height: 32,
        border: '1px solid rgba(0,212,255,0.45)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99998,
        transform: 'translate(-50%,-50%)'
      }} />
    </>
  );
}

function PageShell({ children }) {
  return <div className="min-h-screen scanlines noise">{children}</div>
}

export default function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route
          path="/"
          element={
            <PageShell>
              <TradingTerminal />
            </PageShell>
          }
        />
        <Route
          path="/admin"
          element={
            <PageShell>
              <AdminDashboard />
            </PageShell>
          }
        />
        <Route
          path="/p2p"
          element={
            <PageShell>
              <P2PMarketplace />
            </PageShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const logoRef      = useRef(null);
  const navLogoRef   = useRef(null);
  const heroTextRef  = useRef(null);
  const arcRef       = useRef(null);
  const word1Ref     = useRef(null);
  const word2Ref     = useRef(null);
  const word3Ref     = useRef(null);
  const lenisRef     = useRef(null);

  // ── Lenis smooth scroll ──────────────────────
  useEffect(() => {
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenisRef.current = lenis;
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    });
    return () => lenisRef.current?.destroy();
  }, []);

  // ── Three.js particle background ─────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Particles
    const N   = 1500;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 26;
      pos[i*3+1] = (Math.random() - 0.5) * 26;
      pos[i*3+2] = (Math.random() - 0.5) * 12;
      const r = Math.random();
      if (r < 0.65) { col[i*3]=0;    col[i*3+1]=0.95; col[i*3+2]=1;    } // cyan
      else if (r < 0.85) { col[i*3]=0.54; col[i*3+1]=0.36; col[i*3+2]=0.96; } // purple
      else               { col[i*3]=0.94; col[i*3+1]=0.71; col[i*3+2]=0.16; } // gold
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.045, vertexColors: true, transparent: true, opacity: 0.75
    }));
    scene.add(pts);

    // Glowing arc geometry
    const arcPoints = [];
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI;
      arcPoints.push(new THREE.Vector3(
        Math.cos(a) * 3.2,
        Math.sin(a) * 1.1 - 0.4,
        0
      ));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x00f2ff, transparent: true, opacity: 0.55
    });
    const arc = new THREE.Line(arcGeo, arcMat);
    scene.add(arc);

    // Second inner arc
    const arc2Points = [];
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI;
      arc2Points.push(new THREE.Vector3(
        Math.cos(a) * 2.4,
        Math.sin(a) * 0.75 - 0.4,
        0
      ));
    }
    const arc2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(arc2Points),
      new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.25 })
    );
    scene.add(arc2);

    let t = 0, rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.004;
      pts.rotation.y = t * 0.05;
      pts.rotation.x = t * 0.02;
      // Pulse arc opacity
      arcMat.opacity = 0.4 + Math.sin(t * 1.5) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // ── GSAP entrance animations ─────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Arc scales in
      gsap.from(arcRef.current, {
        scaleX: 0, scaleY: 0, opacity: 0,
        duration: 1.8, ease: 'expo.out', delay: 0.2
      });

      // Hero brand name mask-reveal (swipe in)
      gsap.from(heroTextRef.current, {
        xPercent: -100, opacity: 0,
        duration: 1.4, ease: 'expo.out', delay: 0.5
      });

      // "Fast. Reliable. Secure." slam in one by one
      const words = [word1Ref, word2Ref, word3Ref];
      words.forEach((ref, i) => {
        gsap.from(ref.current, {
          y: 60, opacity: 0,
          filter: 'blur(12px)',
          duration: 0.7,
          ease: 'power4.out',
          delay: 1.0 + i * 0.18
        });
      });

      // Flying logo — shrinks from hero into navbar on scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (logoRef.current) {
            gsap.set(logoRef.current, {
              scale: 1 - p * 0.55,
              opacity: 1 - p * 0.6
            });
          }
          if (navLogoRef.current) {
            gsap.set(navLogoRef.current, { opacity: p });
          }
        }
      });

      // Feature cards stagger in
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%'
        },
        y: 80, opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Stats heartbeat
      gsap.to('.stat-value', {
        scale: 1.05,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{
      background: '#020203',
      minHeight: '100vh',
      overflowX: 'hidden',
      fontFamily: "'Syne', sans-serif",
      color: '#dff0ff',
      position: 'relative'
    }}>

      {/* Three.js canvas background */}
      <canvas ref={canvasRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        opacity: 0.55
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,242,255,0.007) 3px, rgba(0,242,255,0.007) 4px)'
      }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 56, zIndex: 100,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(2,2,3,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,242,255,0.08)'
      }}>
        {/* Nav logo — fades IN as hero logo fades out */}
        <div ref={navLogoRef} style={{
          opacity: 0, display: 'flex',
          alignItems: 'center', gap: 10
        }}>
          <div style={{
            width: 24, height: 24,
            background: 'linear-gradient(135deg,#00f2ff,#8b5cf6)',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            boxShadow: '0 0 14px rgba(0,242,255,0.6)'
          }} />
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: 16,
            letterSpacing: '0.18em'
          }}>VERTEX<span style={{ color: '#00f2ff' }}>PRO</span></span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 32 }}>
          {['Features','Markets','P2P','Pricing'].map(link => (
            <span key={link} style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 13, fontWeight: 600,
              color: 'rgba(223,240,255,0.6)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.target.style.color='#00f2ff'}
            onMouseLeave={e => e.target.style.color='rgba(223,240,255,0.6)'}
            >{link}</span>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/terminal')}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 700,
              padding: '8px 18px',
              borderRadius: 4,
              border: '1px solid rgba(0,242,255,0.35)',
              background: 'transparent',
              color: '#00f2ff',
              letterSpacing: '0.1em'
            }}>
            TERMINAL
          </button>
          <button
            onClick={() => navigate('/terminal')}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 700,
              padding: '8px 20px',
              borderRadius: 4, border: 'none',
              background: 'linear-gradient(135deg,#f0b429,#c8880a)',
              color: '#000',
              letterSpacing: '0.1em',
              boxShadow: '0 4px 20px rgba(240,180,41,0.35)'
            }}>
            START TRADING
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: 'relative', zIndex: 2,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '0 40px'
      }}>

        {/* Arc decoration (HTML overlay matching Three.js arc) */}
        <div ref={arcRef} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 220,
          borderTop: '1px solid rgba(0,242,255,0.3)',
          borderLeft: '1px solid rgba(0,242,255,0.15)',
          borderRight: '1px solid rgba(0,242,255,0.15)',
          borderRadius: '50% 50% 0 0',
          pointerEvents: 'none',
          boxShadow: '0 -8px 40px rgba(0,242,255,0.08) inset'
        }} />

        {/* Big hero logo */}
        <div ref={logoRef} style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 16, marginBottom: 8
          }}>
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg,#00f2ff,#8b5cf6)',
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              boxShadow: '0 0 30px rgba(0,242,255,0.5), 0 0 60px rgba(0,242,255,0.2)',
              animation: 'hexPulse 3s ease-in-out infinite'
            }} />
          </div>
        </div>

        {/* Brand name mask reveal */}
        <div style={{ overflow: 'hidden', marginBottom: 8 }}>
          <h1 ref={heroTextRef} style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(52px, 8vw, 110px)',
            fontWeight: 800,
            letterSpacing: '0.2em',
            margin: 0, lineHeight: 1,
            background: 'linear-gradient(135deg, #ffffff 0%, #00f2ff 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase'
          }}>
            VERTEX<span style={{
              WebkitTextFillColor: '#00f2ff',
              textShadow: '0 0 40px rgba(0,242,255,0.4)'
            }}>PRO</span>
          </h1>
        </div>

        {/* Slam-in tagline words */}
        <div style={{
          display: 'flex', gap: 20,
          marginBottom: 32, marginTop: 8
        }}>
          {[
            { ref: word1Ref, text: 'FAST.',     color: '#00f2ff' },
            { ref: word2Ref, text: 'RELIABLE.', color: '#dff0ff' },
            { ref: word3Ref, text: 'SECURE.',   color: '#f0b429' },
          ].map(({ ref, text, color }) => (
            <span key={text} ref={ref} style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(20px, 3vw, 36px)',
              fontWeight: 800,
              color, letterSpacing: '0.12em',
              textShadow: `0 0 20px ${color}44`
            }}>{text}</span>
          ))}
        </div>

        {/* Sub headline */}
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 16, fontWeight: 500,
          color: 'rgba(223,240,255,0.55)',
          letterSpacing: '0.06em',
          maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.7
        }}>
          The elite trading ecosystem built for professionals.
          Real-time execution • Escrow-grade P2P security •{' '}
          Full admin control suite.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: 14 }}>
          <button
            onClick={() => navigate('/terminal')}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, fontWeight: 700,
              padding: '14px 32px',
              borderRadius: 5, border: 'none',
              background: 'linear-gradient(135deg,#f0b429,#c8880a)',
              color: '#000', letterSpacing: '0.12em',
              boxShadow: '0 4px 30px rgba(240,180,41,0.4)',
              transform: 'translateY(0)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(240,180,41,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 30px rgba(240,180,41,0.4)';
            }}>
            OPEN TERMINAL →
          </button>
          <button
            onClick={() => navigate('/p2p')}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, fontWeight: 700,
              padding: '14px 32px',
              borderRadius: 5,
              border: '1px solid rgba(0,242,255,0.3)',
              background: 'transparent',
              color: '#00f2ff', letterSpacing: '0.12em',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,242,255,0.06)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,242,255,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}>
            P2P MARKETPLACE
          </button>
        </div>

        {/* Live stats row */}
        <div style={{
          display: 'flex', gap: 40,
          marginTop: 60,
          padding: '20px 40px',
          background: 'rgba(0,242,255,0.04)',
          border: '1px solid rgba(0,242,255,0.1)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { label: '24H VOLUME',   value: '$8.42M', color: '#00f2ff' },
            { label: 'ACTIVE USERS', value: '1,284',  color: '#00e676' },
            { label: 'PAIRS',        value: '30+',    color: '#f0b429' },
            { label: 'UPTIME',       value: '99.9%',  color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28, fontWeight: 800,
                color: s.color,
                textShadow: `0 0 16px ${s.color}66`
              }}>{s.value}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, color: 'rgba(74,122,155,0.9)',
                letterSpacing: '0.12em', marginTop: 4
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 32,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
          animation: 'bounce 2s ease-in-out infinite'
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, color: 'rgba(74,122,155,0.6)',
            letterSpacing: '0.15em'
          }}>SCROLL</span>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, #00f2ff, transparent)'
          }} />
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="features-section" style={{
        position: 'relative', zIndex: 2,
        padding: '120px 60px',
        maxWidth: 1200, margin: '0 auto'
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800, textAlign: 'center',
          letterSpacing: '0.1em', marginBottom: 64,
          background: 'linear-gradient(135deg,#ffffff,#00f2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          BUILT FOR THE ELITE
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24
        }}>
          {[
            {
              icon: '📊',
              title: 'Live Trading Terminal',
              desc: '30+ Forex & OTC pairs. Real-time candlestick charts with EMA, RSI, and Volume. Sub-millisecond execution.',
              color: '#00f2ff',
              link: '/terminal'
            },
            {
              icon: '🔒',
              title: 'P2P Escrow Marketplace',
              desc: 'Automated multi-step escrow locking. In-trade chat. 99.2% success rate across 1,842 trades.',
              color: '#f0b429',
              link: '/p2p'
            },
            {
              icon: '⚡',
              title: 'Admin Command Center',
              desc: '100+ API endpoints. Live user sessions. System metrics. Full risk controls and endpoint surface.',
              color: '#8b5cf6',
              link: '/admin'
            },
            {
              icon: '🌐',
              title: 'Real-Time WebSockets',
              desc: '4ms WebSocket latency. Live order book depth. Price streaming across all pairs simultaneously.',
              color: '#00e676',
              link: '/terminal'
            },
            {
              icon: '🛡️',
              title: 'Institutional Security',
              desc: 'KYC verification pipeline. Rate limiting. Automated threat detection. Bank-grade encryption.',
              color: '#ff3d71',
              link: '/admin'
            },
            {
              icon: '📈',
              title: 'Advanced Analytics',
              desc: 'PnL tracking. Portfolio distribution. Revenue charts. Trade history with full audit trail.',
              color: '#f0b429',
              link: '/admin'
            },
          ].map((card) => (
            <div
              key={card.title}
              className="feature-card"
              onClick={() => navigate(card.link)}
              style={{
                background: 'rgba(10,22,40,0.7)',
                border: `1px solid ${card.color}22`,
                borderRadius: 10,
                padding: '28px 24px',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = card.color + '55';
                e.currentTarget.style.transform = 'translateY(-6px) rotateX(2deg)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${card.color}22`;
                e.currentTarget.style.background = `rgba(10,22,40,0.9)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = card.color + '22';
                e.currentTarget.style.transform = 'translateY(0) rotateX(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(10,22,40,0.7)';
              }}>
              {/* Top color bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${card.color}, transparent)`
              }} />
              <div style={{ fontSize: 28, marginBottom: 14 }}>{card.icon}</div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16, fontWeight: 700,
                color: card.color, marginBottom: 10,
                letterSpacing: '0.06em'
              }}>{card.title}</h3>
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 13, fontWeight: 500,
                color: 'rgba(223,240,255,0.55)',
                lineHeight: 1.7, margin: 0
              }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center',
        padding: '100px 40px 140px'
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 800,
          letterSpacing: '0.1em',
          marginBottom: 20,
          background: 'linear-gradient(135deg,#ffffff,#00f2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          READY TO TRADE?
        </h2>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 16,
          color: 'rgba(223,240,255,0.5)',
          marginBottom: 40,
          letterSpacing: '0.05em'
        }}>
          Join 1,284 professional traders on VertexPro
        </p>
        <button
          onClick={() => navigate('/terminal')}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, fontWeight: 700,
            padding: '16px 48px',
            borderRadius: 6, border: 'none',
            background: 'linear-gradient(135deg,#f0b429,#c8880a)',
            color: '#000', letterSpacing: '0.14em',
            boxShadow: '0 4px 40px rgba(240,180,41,0.45)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 50px rgba(240,180,41,0.65)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 40px rgba(240,180,41,0.45)';
          }}>
          ENTER TERMINAL →
        </button>
      </section>

      {/* Keyframe animations */}
      <style>{`
        @keyframes hexPulse {
          0%,100% { box-shadow: 0 0 20px rgba(0,242,255,0.5), 0 0 40px rgba(0,242,255,0.2); }
          50%      { box-shadow: 0 0 35px rgba(0,242,255,0.8), 0 0 70px rgba(0,242,255,0.35); }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}

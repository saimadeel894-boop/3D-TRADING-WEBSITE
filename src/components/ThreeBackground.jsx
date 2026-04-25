import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, antialias: true 
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W/H, 0.1, 1000);
    camera.position.z = 5;

    // PARTICLES ONLY — 1200 points
    const N = 1200;
    const positions = new Float32Array(N * 3);
    const colors    = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 24;
      positions[i*3+1] = (Math.random() - 0.5) * 24;
      positions[i*3+2] = (Math.random() - 0.5) * 10;

      const r = Math.random();
      if (r < 0.60) {
        // cyan
        colors[i*3]=0; colors[i*3+1]=0.83; colors[i*3+2]=1;
      } else if (r < 0.85) {
        // purple
        colors[i*3]=0.54; colors[i*3+1]=0.36; colors[i*3+2]=0.96;
      } else {
        // gold
        colors[i*3]=0.94; colors[i*3+1]=0.71; colors[i*3+2]=0.16;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', 
      new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    
      new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Subtle grid plane
    const gridLines = [];
    for (let i = -12; i <= 12; i++) {
      gridLines.push(-12,0,i, 12,0,i);
      gridLines.push(i,0,-12, i,0,12);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array(gridLines), 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x003355, transparent: true, opacity: 0.2
    });
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    grid.position.y = -3.5;
    grid.rotation.x = Math.PI * 0.08;
    scene.add(grid);

    // Animation
    let animId;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.003;
      points.rotation.y = t * 0.06;
      points.rotation.x = t * 0.03;
      // Subtle float
      const pos = geo.attributes.position.array;
      for (let i = 1; i < N * 3; i += 3) {
        pos[i] += Math.sin(t + pos[i-1] * 0.1) * 0.0003;
      }
      geo.attributes.position.needsUpdate = true;
      grid.rotation.z = t * 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 0,
      opacity: 0.35,
      pointerEvents: 'none'
    }} />
  );
}



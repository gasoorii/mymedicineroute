'use client';
import { useEffect, useRef, useState } from 'react';

function ECGCanvas({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const midY = H / 2;

    const points = new Array(Math.floor(W)).fill(midY);
    let scanX = 0;
    const speed = 4; 

    let isBeating = false;
    let beatPhase = 0;
    let cooldown = 50; 
    let currentBeatType = 0; 
    let currentQRS = 110; 

    function getPulseY() {
      let yOffset = 0;
      if (!isBeating) {
        cooldown--;
        if (cooldown <= 0) {
          isBeating = true;
          beatPhase = 0;
          currentBeatType = Math.floor(Math.random() * 3);
          currentQRS = 100 + Math.random() * 40; 
          cooldown = 80 + Math.random() * 100; 
        }
      } else {
        beatPhase += 0.015; 
        const p = beatPhase;
        if (p < 0.1) yOffset = -Math.sin((p / 0.1) * Math.PI) * 8;
        else if (p > 0.15 && p < 0.5) {
          const qrsP = (p - 0.15) / 0.35;
          if (currentBeatType === 0) {
            if (qrsP < 0.1) yOffset = qrsP * 40;
            else if (qrsP < 0.3) yOffset = -currentQRS * ((qrsP - 0.1) / 0.2); 
            else if (qrsP < 0.7) yOffset = (currentQRS + 40) * ((qrsP - 0.3) / 0.4) - currentQRS;
          } 
          else if (currentBeatType === 1) {
            if (qrsP < 0.2) yOffset = - (currentQRS + 30) * (qrsP / 0.2);
            else if (qrsP < 0.5) yOffset = (currentQRS + 60) * ((qrsP - 0.2) / 0.3) - (currentQRS + 30);
            else if (qrsP < 0.8) yOffset = -30 * ((qrsP - 0.5) / 0.3) + 30;
          }
          else {
            if (qrsP < 0.2) yOffset = -80;
            else if (qrsP < 0.4) yOffset = -40;
            else if (qrsP < 0.6) yOffset = -120;
            else if (qrsP < 0.9) yOffset = 120 * ((qrsP - 0.6) / 0.3) - 120;
          }
        }
        else if (p > 0.6 && p < 0.95) {
          const tP = (p - 0.6) / 0.35;
          yOffset = -Math.sin(tP * Math.PI) * 22;
        }
        if (p >= 1) isBeating = false;
      }
      const noise = (Math.random() - 0.5) * 1.5;
      return midY + yOffset + noise;
    }

    function draw() {
      for (let i = 0; i < speed; i++) {
        const x = Math.floor((scanX + i) % W);
        points[x] = getPulseY();
      }
      ctx.clearRect(0, 0, W, H);

      // Dot Grid
      ctx.fillStyle = 'rgba(225, 29, 72, 0.12)';
      for (let x = 0; x < W; x += 60) {
        for (let y = 0; y < H; y += 60) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      ctx.lineWidth = 5; 
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter'; 

      for (let x = 1; x < W; x++) {
        let age = scanX - x;
        if (age < 0) age += W;
        if (age > W - 25) continue; 
        const opacity = Math.pow(1 - age / W, 2.5);
        if (opacity < 0.01) continue;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(244, 63, 94, ${opacity})`;
        if (age < 40) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#E11D48';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.moveTo(x - 1, points[x - 1]);
        ctx.lineTo(x, points[x]);
        ctx.stroke();
      }

      const headY = points[Math.floor(scanX)];
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fff';
      ctx.fillStyle = '#fff';
      ctx.fillRect(scanX - 2, headY - 5, 4, 10);

      scanX = (scanX + speed) % W;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isVisible]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '280px', display: 'block' }} />;
}

export default function ECGSection() {
  const ecgRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    },
    { threshold: 0.1 }
  );
  if (ecgRef.current) observer.observe(ecgRef.current);
  return () => observer.disconnect();
}, []);

  return (
    <section ref={ecgRef} style={{
      background: 'radial-gradient(circle at center, #2a0707 0%, #050000 100%)',
      padding: '30px 0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderTop: '1px solid #330a0a',
      borderBottom: '1px solid #330a0a'
    }}>
      <h2 style={{
        // CLEAN WHITE/GREY STYLE - No background bug
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '10px', // Spacing between text and line
        textAlign: 'center',
        fontFamily: 'monospace',
        width: '100%',
        zIndex: 10
      }}>
        The Best Future Starts with a Better Connection
      </h2>
      
      <div style={{ width: '100%', position: 'relative', maxWidth: '1800px' }}>
        <ECGCanvas isVisible={isVisible} />
        {/* Vignette Overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to right, #050000 0%, transparent 10%, transparent 90%, #050000 100%)'
        }} />
      </div>
    </section>
  );
}
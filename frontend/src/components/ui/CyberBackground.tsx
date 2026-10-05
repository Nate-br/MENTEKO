import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulsePhase: number;
}

interface PulsePacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates
    let mouseX = -1000;
    let mouseY = -1000;

    const colors = [
      { fill: '#8f1eae', glow: 'rgba(143, 30, 174, 0.4)' }, // primary #8f1eae
      { fill: '#6d1487', glow: 'rgba(109, 20, 135, 0.35)' }, // deep purple
      { fill: '#a834cb', glow: 'rgba(168, 52, 203, 0.4)' }, // vibrant violet
    ];

    let particles: Particle[] = [];
    let packets: PulsePacket[] = [];

    const initParticles = () => {
      // Scale count based on width for consistent density
      const count = Math.min(65, Math.max(30, Math.floor((width * height) / 22000)));
      particles = [];

      for (let i = 0; i < count; i++) {
        const col = colors[Math.floor(Math.random() * colors.length)];
        const baseRadius = 1.2 + Math.random() * 1.8;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          color: col.fill,
          glowColor: col.glow,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      packets = [];
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const maxDistance = 140;
    const mouseRadius = 160;

    let lastPacketSpawn = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Periodically spawn a data pulse between connected nodes
      if (time - lastPacketSpawn > 900 && particles.length > 5) {
        lastPacketSpawn = time;
        const i = Math.floor(Math.random() * particles.length);
        // Find a nearby node
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDistance) {
            packets.push({
              fromNode: i,
              toNode: j,
              progress: 0,
              speed: 0.015 + Math.random() * 0.02,
              color: particles[i].color,
            });
            break;
          }
        }
      }

      // Update & Draw node-to-node connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(143, 30, 174, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouseX > 0 && mouseY > 0) {
          const dx = p1.x - mouseX;
          const dy = p1.y - mouseY;
          const mouseDist = Math.hypot(dx, dy);

          if (mouseDist < mouseRadius) {
            const alpha = (1 - mouseDist / mouseRadius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(143, 30, 174, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Subtle attraction toward mouse
            p1.x -= dx * 0.008;
            p1.y -= dy * 0.008;
          }
        }
      }

      // Update & draw data packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const pFrom = particles[pkt.fromNode];
        const pTo = particles[pkt.toNode];
        if (!pFrom || !pTo) {
          packets.splice(k, 1);
          continue;
        }

        const curX = pFrom.x + (pTo.x - pFrom.x) * pkt.progress;
        const curY = pFrom.y + (pTo.y - pFrom.y) * pkt.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#8f1eae';
        ctx.shadowColor = 'rgba(143, 30, 174, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse radius
        p.pulsePhase += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulsePhase) * 0.6;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      {/* Interactive Cyber Defense Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-auto"
      />

      {/* Atmospheric Ambient Lighting Orbs */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[#8f1eae]/6 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-[#b947db]/5 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/3 top-10 h-72 w-72 rounded-full bg-cyan/4 blur-[100px]" />

      {/* Subtle bottom fade into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
    </div>
  );
}

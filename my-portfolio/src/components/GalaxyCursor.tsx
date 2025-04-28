'use client';

import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ===== PARTICLE TYPE ===== //
type Particle = {
  id: number;
  size: number;
  color: string;
  x: number;
  y: number;
  delay: number;
  type: 'star' | 'blob';
  baseX: number;
  baseY: number;
  trailFactor: number;
  clusterProgress: number;
};

// ===== ANIMATIONS ===== //
const twinkle = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

// ===== STYLED COMPONENTS ===== //
const CursorContainer = styled.div<{ hidden?: boolean }>`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: ${props => props.hidden ? 0 : 1};
  transform: scale(${props => props.hidden ? 0.8 : 1});
`;

const OuterRing = styled.div<{ $isHovering: boolean; $themeMode: 'nebula' | 'supernova' }>`
  pointer-events: none;
  position: absolute;
  width: ${props => props.$isHovering ? '40px' : '36px'};   /* Increased size on hover */
  height: ${props => props.$isHovering ? '40px' : '36px'};  /* Increased size on hover */
  border: 2px solid ${props => props.$isHovering ? (props.$themeMode === 'nebula' ? 'rgba(173, 126, 255, 1)' : 'rgba(255, 191, 0, 1)') : (props.$themeMode === 'nebula' ? 'rgba(173, 126, 255, 0.6)' : 'rgba(255, 191, 0, 0.6)')};
  border-radius: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  box-shadow: 0 0 10px ${props => props.$isHovering ? (props.$themeMode === 'nebula' ? 'rgba(173, 126, 255, 1)' : 'rgba(255, 191, 0, 1)') : (props.$themeMode === 'nebula' ? 'rgba(138, 43, 226, 0.4)' : 'rgba(255, 140, 0, 0.4)')};
`;

const MainCursor = styled.div<{ size: number; $isHovering: boolean; $themeMode: 'nebula' | 'supernova' }>`
  pointer-events: none;
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${props => props.$isHovering
      ? 'white 0%, white 50%, white 100%'  // white color when hovering
      : props.$themeMode === 'nebula'
      ? 'rgba(173, 126, 255, 0.9) 0%, rgba(100, 68, 255, 0.7) 50%, rgba(50, 15, 150, 0.5) 100%' 
      : 'rgba(255, 191, 0, 0.9) 0%, rgba(255, 87, 34, 0.7) 50%, rgba(255, 69, 0, 0.5) 100%'}
  );
  box-shadow: 0 0 15px ${props => props.$isHovering ? 'white' : (props.$themeMode === 'nebula' ? 'rgba(138, 43, 226, 0.6)' : 'rgba(255, 140, 0, 0.6)')};
  transform: translate(-50%, -50%) scale(${props => props.$isHovering ? 1.1 : 1}); 
  transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease;
`;

const Star = styled.div<{ color: string; size: number; delay: number; $isHovering: boolean }>`
  pointer-events: none;
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.$isHovering ? 'white' : props.color};  /* Color change on hover */
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
  animation: ${twinkle} ${props => 3 + props.delay}s infinite ease-in-out;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
  
  /* Glowing effect when not hovering */
  box-shadow: 0 0 8px ${props => props.$isHovering ? 'white' : props.color}, 
              0 0 12px ${props => props.$isHovering ? 'white' : props.color};  /* Apply glow effect */
`;

const TwinkleBlob = styled.div<{ color: string; size: number; delay: number; $isHovering: boolean }>`
  pointer-events: none;
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.$isHovering ? 'white' : props.color};
  animation: ${float} ${props => 2 + props.delay}s infinite ease-in-out;
  transform: translate(-50%, -50%);
`;

const GalaxyCursor: React.FC<{ theme: 'nebula' | 'supernova' }> = ({ theme }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false); 
  const [cursorSize] = useState(20); 
  const [isOutOfFrame, setIsOutOfFrame] = useState(false);

  const animationRef = useRef<number | null>(null);
  const lastMouseTime = useRef<number>(Date.now());
  const velocity = useRef({ x: 0, y: 0 });
  const prevPosition = useRef({ x: 0, y: 0 });
  const cursorAngle = useRef(0);
  const isStationary = useRef(false);
  const stationaryStartTime = useRef<number | null>(null);
  const lastSpeed = useRef(0);

  const generateParticles = () => {
    const colors = theme === 'nebula'
      ? ['rgba(173,126,255,0.9)', 'rgba(138,43,226,0.8)', 'rgba(100,68,255,0.7)', 'rgba(75,0,130,0.6)']
      : ['rgba(255,191,0,0.9)', 'rgba(255,87,34,0.8)', 'rgba(255,140,0,0.7)', 'rgba(255,69,0,0.6)'];

    setParticles([
      { id: 1, size: 10, color: colors[0], x: 0, y: 0, delay: 0.7, type: 'star', baseX: -20, baseY: -10, trailFactor: 1.2, clusterProgress: 0 },
      { id: 2, size: 8, color: colors[1], x: 0, y: 0, delay: 1.2, type: 'star', baseX: 15, baseY: 20, trailFactor: 1.3, clusterProgress: 0 },
      { id: 3, size: 5, color: colors[2], x: 0, y: 0, delay: 1.6, type: 'star', baseX: -25, baseY: 15, trailFactor: 1.4, clusterProgress: 0 },
      { id: 4, size: 4, color: colors[3], x: 0, y: 0, delay: 2, type: 'star', baseX: 20, baseY: -15, trailFactor: 1.1, clusterProgress: 0 },
      { id: 5, size: 3, color: colors[0], x: 0, y: 0, delay: 0.4, type: 'blob', baseX: 0, baseY: -25, trailFactor: 0.3, clusterProgress: 0 },
      { id: 6, size: 4, color: colors[1], x: 0, y: 0, delay: 0.6, type: 'blob', baseX: 25, baseY: 0, trailFactor: 0.35, clusterProgress: 0 },
      { id: 7, size: 3, color: colors[2], x: 0, y: 0, delay: 0.3, type: 'blob', baseX: 0, baseY: 25, trailFactor: 0.4, clusterProgress: 0 },
      { id: 8, size: 4, color: colors[3], x: 0, y: 0, delay: 0.5, type: 'blob', baseX: -25, baseY: 0, trailFactor: 0.45, clusterProgress: 0 },
    ]);
  };

  useEffect(() => {
    generateParticles();
  }, [theme]);

  useEffect(() => {
    // Handle mousemove for cursor position
    const updatePosition = (e: MouseEvent) => {
      const now = Date.now();
      const deltaTime = now - lastMouseTime.current;
      
      if (deltaTime > 0) {
        velocity.current = {
          x: (e.clientX - prevPosition.current.x) / deltaTime,
          y: (e.clientY - prevPosition.current.y) / deltaTime,
        };
        cursorAngle.current = Math.atan2(velocity.current.y, velocity.current.x);
        lastSpeed.current = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        
        if (lastSpeed.current < 0.1 && !isStationary.current) {
          isStationary.current = true;
          stationaryStartTime.current = now;
        } else if (lastSpeed.current >= 0.1) {
          isStationary.current = false;
          stationaryStartTime.current = null;
        }
      }
      
      prevPosition.current = { x: e.clientX, y: e.clientY };
      setCursorPosition({ x: e.clientX, y: e.clientY });
      lastMouseTime.current = now;
    };

    const animate = () => {
      const now = Date.now();
      const timeSinceLastMove = now - lastMouseTime.current;
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
      const distance = Math.min(30, speed * 2);

      const blobTargetX = cursorPosition.x - Math.cos(cursorAngle.current) * distance * 0.7;
      const blobTargetY = cursorPosition.y - Math.sin(cursorAngle.current) * distance * 0.7;

      setBlobPosition(prev => ({
        x: prev.x + (blobTargetX - prev.x) * 0.2,
        y: prev.y + (blobTargetY - prev.y) * 0.2,
      }));

      setParticles(prev =>
        prev.map(p => {
          const orbitRadius = 10 + p.delay * 2;
          const orbitSpeed = 0.002 + p.delay * 0.0003;
          const orbitAngle = now * orbitSpeed + p.id;

          const orbitX = p.baseX + Math.cos(orbitAngle) * orbitRadius;
          const orbitY = p.baseY + Math.sin(orbitAngle) * orbitRadius;

          const offsetX = -Math.cos(cursorAngle.current) * distance * p.trailFactor;
          const offsetY = -Math.sin(cursorAngle.current) * distance * p.trailFactor;

          let clusterProgress = p.clusterProgress;
          if (isStationary.current && stationaryStartTime.current) {
            const stationaryTime = now - stationaryStartTime.current;
            clusterProgress = Math.min(1, stationaryTime / 200);
          } else if (!isStationary.current) {
            clusterProgress = Math.max(0, clusterProgress - 0.1);
          }

          const blendFactor = Math.min(1, Math.max(0, 1 - timeSinceLastMove / 300));

          let targetX, targetY;
          if (clusterProgress > 0) {
            targetX = p.baseX * (1 - clusterProgress);
            targetY = p.baseY * (1 - clusterProgress);
          } else {
            targetX = p.baseX + offsetX;
            targetY = p.baseY + offsetY;
          }

          const blendedX = orbitX * (1 - blendFactor) + targetX * blendFactor;
          const blendedY = orbitY * (1 - blendFactor) + targetY * blendFactor;

          return { 
            ...p, 
            x: blendedX, 
            y: blendedY,
            clusterProgress 
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseleave', () => setIsOutOfFrame(true));
    window.addEventListener('mouseenter', () => setIsOutOfFrame(false));

    // Detect mouseenter and mouseleave events on interactive elements
    const hoverableElements = document.querySelectorAll('button, a, input, .interactive');
    hoverableElements.forEach(element => {
      element.addEventListener('mouseenter', () => setIsHovering(true));
      element.addEventListener('mouseleave', () => setIsHovering(false));
    });

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      hoverableElements.forEach(element => {
        element.removeEventListener('mouseenter', () => setIsHovering(true));
        element.removeEventListener('mouseleave', () => setIsHovering(false));
      });
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [cursorPosition]);

  const offsetIfOut = (value: number) => (isOutOfFrame ? value + 100 : value);

  return (
    <>
      <CursorContainer hidden={isOutOfFrame} style={{ left: `${offsetIfOut(cursorPosition.x)}px`, top: `${offsetIfOut(cursorPosition.y)}px` }}>
        <OuterRing $isHovering={isHovering} $themeMode={theme} />
      </CursorContainer>

      {particles.map(p => (
        <CursorContainer
          key={p.id}
          hidden={isOutOfFrame}
          style={{
            left: `${offsetIfOut(blobPosition.x + p.x)}px`,
            top: `${offsetIfOut(blobPosition.y + p.y)}px`,
            transition: `transform ${0.2 + p.delay * 0.2}s cubic-bezier(0.175, 0.885, 0.32, 1.1)`
          }}
        >
          {p.type === 'star' ? (
            <Star size={p.size} color={p.color} delay={p.delay} $isHovering={isHovering} />
          ) : (
            <TwinkleBlob size={p.size} color={p.color} delay={p.delay} $isHovering={isHovering} />
          )}
        </CursorContainer>
      ))}

      <CursorContainer hidden={isOutOfFrame} style={{ left: `${offsetIfOut(blobPosition.x)}px`, top: `${offsetIfOut(blobPosition.y)}px` }}>
        <MainCursor size={cursorSize} $isHovering={isHovering} $themeMode={theme} />
      </CursorContainer>
    </>
  );
};

export default GalaxyCursor;

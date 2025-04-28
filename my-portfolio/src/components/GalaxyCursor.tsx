'use client';

import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

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
  width: ${props => props.$isHovering ? '40px' : '36px'};
  height: ${props => props.$isHovering ? '40px' : '36px'};
  border: 2px solid ${props => props.$isHovering ? (props.$themeMode === 'nebula' ? 'rgba(173, 126, 255, 1)' : 'rgba(255, 191, 0, 1)') : (props.$themeMode === 'nebula' ? 'rgba(173, 126, 255, 0.6)' : 'rgba(255, 191, 0, 0.6)')};
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
      ? 'white 0%, white 50%, white 100%'
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
  background: ${props => props.$isHovering ? 'white' : props.color};
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
  animation: ${twinkle} ${props => 3 + props.delay}s infinite ease-in-out;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
  box-shadow: 0 0 8px ${props => props.$isHovering ? 'white' : props.color}, 0 0 12px ${props => props.$isHovering ? 'white' : props.color};
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
    const updatePosition = (e: MouseEvent) => { /* continues with animate and handlers */ };
    const animate = () => { /* continues with particles animate */ };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseleave', () => setIsOutOfFrame(true));
    window.addEventListener('mouseenter', () => setIsOutOfFrame(false));

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
      {/* continues rendering particles and cursors */}
    </>
  );
};

export default GalaxyCursor;

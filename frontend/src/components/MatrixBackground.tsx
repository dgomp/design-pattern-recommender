import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const columnsRef = useRef<number>(0);
  const fontSize = 16;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Função para inicializar drops e columns
    const initializeMatrix = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columnsRef.current = Math.floor(canvas.width / fontSize);
      dropsRef.current = [];
      for (let i = 0; i < columnsRef.current; i++) {
        // Inicializa as gotas em posições aleatórias dentro da tela
        dropsRef.current[i] = Math.random() * (canvas.height / fontSize);
      }
    };

    initializeMatrix();
    window.addEventListener('resize', initializeMatrix);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#39ff14';
      ctx.font = `bold ${fontSize}px monospace`;
      for (let i = 0; i < columnsRef.current; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, dropsRef.current[i] * fontSize);
        // Mover a gota para baixo
        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', initializeMatrix);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ opacity: 0.8 }}
    />
  );
};

export default MatrixBackground; 
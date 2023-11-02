'use client'
// components/PaintCanvas.tsx

import React, { useRef, useState, useCallback } from 'react';

interface PaintCanvasProps {
  width: number;
  height: number;
}

const DrawSt: React.FC<PaintCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [color, setColor] = useState<string>('#000000');
  const [size, setSize] = useState<number>(5);

  const startPaint = useCallback((event: React.MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      draw(coordinates);
    }
  }, []);

  const paint = useCallback(
    (event: React.MouseEvent) => {
      if (isPainting) {
        const coordinates = getCoordinates(event);
        if (coordinates) {
          draw(coordinates);
        }
      }
    },
    [isPainting]
  );

  const stopPaint = useCallback(() => {
    if (isPainting) {
      setIsPainting(false);
      if (canvasRef.current) {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
          context.beginPath();
        }
      }
    }
  }, [isPainting]);

  const getCoordinates = (event: React.MouseEvent): { x: number; y: number } | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const draw = ({ x, y }: { x: number; y: number }) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = size;
      context.lineJoin = 'round';
      context.lineCap = 'round';

      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(Number(event.target.value));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        const img = new Image();
        img.onload = () => {
          const canvas: HTMLCanvasElement = canvasRef.current!;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
        };
        img.src = e.target!.result as string;
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const saveCanvas = () => {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'my-painting.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div>
      <input type="color" value={color} onChange={handleColorChange} />
      <input type="range" min="1" max="100" value={size} onChange={handleSizeChange} />
      <input type="file" onChange={handleImageUpload} />
      <button onClick={saveCanvas}>Save</button>
      <canvas
        ref={canvasRef}
        onMouseDown={startPaint}
        onMouseMove={paint}
        onMouseUp={stopPaint}
        onMouseLeave={stopPaint}
        width={width}
        height={height}
      />
      {/* The rest of your canvas and UI elements */}
    </div>
  );
};

export default DrawSt;

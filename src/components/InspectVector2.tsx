import React, { useRef, useState, useEffect } from 'react';
import { useDragNumber } from '../hooks/useDragNumber';

interface Vector2Value {
  x: number;
  y: number;
}

interface InspectVector2Props {
  value: Vector2Value;
  onChange: (value: Vector2Value) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const InspectVector2: React.FC<InspectVector2Props> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState(value.x);
  const [y, setY] = useState(value.y);

  // Use refs to store current values to avoid stale closures
  const currentXRef = useRef(x);
  const currentYRef = useRef(y);

  // Update refs when state changes
  useEffect(() => {
    currentXRef.current = x;
    currentYRef.current = y;
  }, [x, y]);

  // Sync with external value changes
  useEffect(() => {
    setX(value.x);
    setY(value.y);
  }, [value]);

  const xLabelRef = useRef<HTMLLabelElement>(null);
  const yLabelRef = useRef<HTMLLabelElement>(null);
  const xInputRef = useRef<HTMLInputElement>(null);
  const yInputRef = useRef<HTMLInputElement>(null);

  // Hooks

  useDragNumber({
    label: xLabelRef,
    input: xInputRef,
    defaultValue: x,
    min,
    max,
    step,
    onChange: (newValue: number) => {
      setX(newValue);
      onChange({ x: newValue, y: currentYRef.current });
    }
  });

  useDragNumber({
    label: yLabelRef,
    input: yInputRef,
    defaultValue: y,
    min,
    max,
    step,
    onChange: (newValue: number) => {
      setY(newValue);
      onChange({ x: currentXRef.current, y: newValue });
    }
  });

  // Canvas Draw

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw point
    const pointX = ((x - min) / (max - min)) * canvas.width;
    const pointY = canvas.height - ((y - min) / (max - min)) * canvas.height;

    const color = '#fff';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw crosshair
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pointX - 10, pointY);
    ctx.lineTo(pointX + 10, pointY);
    ctx.moveTo(pointX, pointY - 10);
    ctx.lineTo(pointX, pointY + 10);
    ctx.stroke();
  }, [x, y, min, max]);

  // Canvas dragging

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = min + (mouseX / canvas.width) * (max - min);
      const newY = min + ((canvas.height - mouseY) / canvas.height) * (max - min);

      const clampedX = Math.max(min, Math.min(max, newX));
      const clampedY = Math.max(min, Math.min(max, newY));

      setX(clampedX);
      setY(clampedY);
      onChange({ x: clampedX, y: clampedY });

      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = min + (mouseX / canvas.width) * (max - min);
      const newY = min + ((canvas.height - mouseY) / canvas.height) * (max - min);

      const clampedX = Math.max(min, Math.min(max, newX));
      const clampedY = Math.max(min, Math.min(max, newY));

      setX(clampedX);
      setY(clampedY);
      onChange({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, onChange]);

  return (
    <div className="vector2-field">
      <div className="vector2-inputs">
        <div className="vector2-input">
          <label 
            ref={xLabelRef}
            className="field-label"
          >
            X
          </label>
          <input
            ref={xInputRef}
            type="number"
            value={x}
            min={min}
            max={max}
            step={step}
            className="field-input"
            onChange={(evt) => {
              const newValue = parseFloat(evt.target.value);
              setX(newValue);
              onChange({ x: newValue, y: currentYRef.current });
            }}
          />
        </div>
        <div className="vector2-input">
          <label 
            ref={yLabelRef}
            className="field-label"
          >
            Y
          </label>
          <input
            ref={yInputRef}
            type="number"
            value={y}
            min={min}
            max={max}
            step={step}
            className="field-input"
            onChange={(evt) => {
              const newValue = parseFloat(evt.target.value);
              setY(newValue);
              onChange({ x: currentXRef.current, y: newValue });
            }}
          />
        </div>
      </div>
      <div ref={containerRef} className="vector2-canvas-container">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="vector2-canvas"
        />
      </div>
    </div>
  );
};
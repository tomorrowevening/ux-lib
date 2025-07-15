import React, { useRef, useState, useEffect } from 'react';
import { useDragNumber } from '../hooks/useDragNumber';

interface Grid3Value {
  x: number;
  y: number;
  z: number;
}

interface InspectGrid3Props {
  value: Grid3Value;
  onChange: (value: Grid3Value) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const InspectGrid3: React.FC<InspectGrid3Props> = ({
  value,
  onChange,
  min,
  max,
  step = 0.01,
  disabled = false,
}) => {
  const [x, setX] = useState(value.x);
  const [y, setY] = useState(value.y);
  const [z, setZ] = useState(value.z);

  // Use refs to store current values to avoid stale closures
  const currentXRef = useRef(x);
  const currentYRef = useRef(y);
  const currentZRef = useRef(z);

  // Update refs when state changes
  useEffect(() => {
    currentXRef.current = x;
    currentYRef.current = y;
    currentZRef.current = z;
  }, [x, y, z]);

  // Sync with external value changes
  useEffect(() => {
    setX(value.x);
    setY(value.y);
    setZ(value.z);
  }, [value]);

  const xLabelRef = useRef<HTMLLabelElement>(null);
  const yLabelRef = useRef<HTMLLabelElement>(null);
  const zLabelRef = useRef<HTMLLabelElement>(null);
  const xInputRef = useRef<HTMLInputElement>(null);
  const yInputRef = useRef<HTMLInputElement>(null);
  const zInputRef = useRef<HTMLInputElement>(null);

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
      onChange({ x: newValue, y: currentYRef.current, z: currentZRef.current });
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
      onChange({ x: currentXRef.current, y: newValue, z: currentZRef.current });
    }
  });

  useDragNumber({
    label: zLabelRef,
    input: zInputRef,
    defaultValue: z,
    min,
    max,
    step,
    onChange: (newValue: number) => {
      setZ(newValue);
      onChange({ x: currentXRef.current, y: currentYRef.current, z: newValue });
    }
  });

  return (
    <div className="grid3-field">
      <div className="grid3-inputs">
        <div className="grid3-input">
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
            disabled={disabled}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || 0;
              setX(newValue);
              onChange({ x: newValue, y: currentYRef.current, z: currentZRef.current });
            }}
          />
        </div>
        <div className="grid3-input">
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
            disabled={disabled}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || 0;
              setY(newValue);
              onChange({ x: currentXRef.current, y: newValue, z: currentZRef.current });
            }}
          />
        </div>
        <div className="grid3-input">
          <label 
            ref={zLabelRef}
            className="field-label"
          >
            Z
          </label>
          <input
            ref={zInputRef}
            type="number"
            value={z}
            min={min}
            max={max}
            step={step}
            className="field-input"
            disabled={disabled}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || 0;
              setZ(newValue);
              onChange({ x: currentXRef.current, y: currentYRef.current, z: newValue });
            }}
          />
        </div>
      </div>
    </div>
  );
};
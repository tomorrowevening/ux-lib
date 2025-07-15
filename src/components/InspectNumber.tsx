import React, { useRef } from 'react';
import { useDragNumber } from '../hooks/useDragNumber';

interface InspectNumberProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  type?: 'number' | 'range';
  disabled?: boolean;
}

export const InspectNumber: React.FC<InspectNumberProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  type = 'number',
  disabled = false,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const fieldValue = useDragNumber({
    label: labelRef,
    input: inputRef,
    sliderRef: type === 'range' ? sliderRef : undefined,
    defaultValue: value,
    min,
    max,
    step,
    onChange
  });

  return (
    <>
      <label 
        ref={labelRef}
        className="field-label"
      >
        {label}
      </label>
      <div className="field-control">
        {type === 'range' ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={fieldValue}
              className="field-input min"
              disabled={disabled}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value) || 0;
                onChange(newValue);
              }}
            />
            <input
              ref={sliderRef}
              type="range"
              value={fieldValue}
              min={min}
              max={max}
              step={step}
              className="field-range"
              disabled={disabled}
              onChange={() => {}}
            />
          </>
        ) : (
          <input
            ref={inputRef}
            type="number"
            value={fieldValue}
            disabled={disabled}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || 0;
              onChange(newValue);
            }}
            min={min}
            max={max}
            step={step}
            className="field-input"
          />
        )}
      </div>
    </>
  );
};
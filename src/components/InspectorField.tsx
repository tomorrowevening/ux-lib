import { memo, useCallback } from 'react';
import { InspectNumber } from './InspectNumber';
import { InspectVector2 } from './InspectVector2';
import { InspectGrid3 } from './InspectGrid3';
import { InspectGrid4 } from './InspectGrid4';
import { InspectImage } from './InspectImage';
import type {
  Grid3Value,
  Grid4Value,
  FieldType,
  FieldValue,
  OptionValue,
  Vector2Value,
} from './types';

export interface InspectorFieldProps {
  label: string;
  type: FieldType;
  value?: FieldValue;
  onChange?: (value: FieldValue) => void;
  onClick?: () => void;
  min?: number;
  max?: number;
  step?: number;
  options?: OptionValue[];
  block?: boolean;
  disabled?: boolean;
}

export const InspectorField = memo(function InspectorField({
  label,
  type,
  value,
  onChange,
  onClick,
  min,
  max,
  step,
  options,
  block = false,
  disabled = false,
}: InspectorFieldProps) {
  const handleChange = useCallback((newValue: FieldValue) => {
    onChange?.(newValue);
  }, [onChange]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const renderField = () => {
    switch (type) {
      case 'string':
        return (
          <input
            type="text"
            value={value as string || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="field-input"
            disabled={disabled}
          />
        );

      case 'number':
        return (
          <InspectNumber
            label={label}
            value={value as number || 0}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        );

      case 'range':
        return (
          <InspectNumber
            label={label}
            value={value as number || 0}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            type="range"
            disabled={disabled}
          />
        );

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value as boolean || false}
            onChange={(e) => handleChange(e.target.checked)}
            className="field-checkbox"
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value as string || '#ffffff'}
            onChange={(e) => handleChange(e.target.value)}
            className="field-color"
          />
        );

      case 'vector2':
        return (
          <InspectVector2
            value={value as Vector2Value || { x: 0, y: 0 }}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
          />
        );

      case 'grid3':
        return (
          <InspectGrid3
            value={value as Grid3Value || { x: 0, y: 0, z: 0 }}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
          />
        );

      case 'grid4':
        return (
          <InspectGrid4
            value={value as Grid4Value || { x: 0, y: 0, z: 0, w: 0 }}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
          />
        );

      case 'image':
        return (
          <InspectImage
            value={value as string || ''}
            onChange={handleChange}
          />
        );

      case 'option':
        return (
          <select
            value={JSON.stringify(value)}
            onChange={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                handleChange(parsedValue);
              } catch {
                handleChange(e.target.value);
              }
            }}
            className="field-select"
          >
            {options?.map((option, index) => (
              <option key={index} value={JSON.stringify(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'button':
        return (
          <button
            onClick={handleClick}
            className="field-button"
          >
            {label}
          </button>
        );

      default:
        return null;
    }
  };

  const fieldContent = renderField();

  if (type === 'button') {
    return <div className="inspector-field button-field">{fieldContent}</div>;
  }

  if (type === 'number' || type === 'range') {
    return <div className={`inspector-field ${block ? 'block' : ''}`}>{fieldContent}</div>;
  }

  return (
    <div className={`inspector-field ${block ? 'block' : ''}`}>
      <label className={`field-label ${(type === 'vector2' || type === 'grid3' || type === 'grid4' || type === 'boolean' || type === 'color' || type === 'option' || type === 'string' || type === 'image') ? 'non-draggable' : ''}`}>{label}</label>
      <div className="field-control">
        {fieldContent}
      </div>
    </div>
  );
});
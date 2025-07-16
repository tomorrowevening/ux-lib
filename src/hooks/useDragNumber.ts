/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';

interface DragNumberProps {
  label: RefObject<HTMLLabelElement | null>
  input: RefObject<HTMLInputElement | null>
  sliderRef?: RefObject<HTMLInputElement | null>
  defaultValue: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

// Derp

export function useDragNumber(props: DragNumberProps) {
  const [fieldValue, setFieldValue] = useState(props.defaultValue);
  const propsRef = useRef(props);
  
  // Update ref when props change
  propsRef.current = props;

  // Sync fieldValue when defaultValue changes (e.g., from canvas dragging)
  useEffect(() => {
    setFieldValue(props.defaultValue);
  }, [props.defaultValue]);

  useEffect(() => {
    let mouseDown = false;
    let mouseStart = -1;
    let valueStart = 0;
    let value = props.defaultValue;
    let multiplyAmount = false;

    const onKeyEvent = (evt: KeyboardEvent) => {
      multiplyAmount = evt.ctrlKey;
    };

    const onMouseMove = (evt: MouseEvent) => {
      if (!mouseDown) return;
      const currentProps = propsRef.current;
      const deltaAmt = currentProps.step !== undefined ? currentProps.step : 1;
      const delta = (evt.clientX - mouseStart) * deltaAmt * (multiplyAmount ? 10 : 1);
      value = Number((valueStart + delta).toFixed(4));
      if (currentProps.min !== undefined) value = Math.max(value, currentProps.min);
      if (currentProps.max !== undefined) value = Math.min(value, currentProps.max);
      if (currentProps.onChange !== undefined) currentProps.onChange(value);
      setFieldValue(value);
    };

    const onMouseUp = () => {
      mouseDown = false;
    };

    const onMouseDown = (evt: MouseEvent) => {
      mouseDown = true;
      const currentProps = propsRef.current;
      valueStart = Number(currentProps.input.current?.value);
      mouseStart = evt.clientX;
    };

    const onSlide = (evt: any) => {
      const currentProps = propsRef.current;
      const newValue = Number(evt.target.value);
      if (currentProps.onChange !== undefined) currentProps.onChange(newValue);
      setFieldValue(newValue);
    };

    // Add all listeners at once - no dynamic adding/removing
    const labelElement = props.label.current;
    const sliderElement = props.sliderRef?.current;
    
    labelElement?.addEventListener('mousedown', onMouseDown, false);
    sliderElement?.addEventListener('input', onSlide);
    document.addEventListener('keydown', onKeyEvent, false);
    document.addEventListener('keyup', onKeyEvent, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('contextmenu', onMouseUp, false);
    
    return () => {
      // Remove all listeners using captured elements
      labelElement?.removeEventListener('mousedown', onMouseDown);
      sliderElement?.removeEventListener('input', onSlide);
      document.removeEventListener('keydown', onKeyEvent);
      document.removeEventListener('keyup', onKeyEvent);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('contextmenu', onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to prevent re-running on prop changes

  return fieldValue;
}

import React, { useState, useImperativeHandle, forwardRef, memo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Accordion } from './Accordion';
import { InspectorField } from './InspectorField';
import type { InspectorFieldProps } from './InspectorField';
import { capitalize } from './utils';
import type { GroupData, FieldValue } from './types';

function isGroup(obj: InspectorFieldProps | InspectorGroupProps): obj is InspectorGroupProps {
  return 'items' in obj;
}

export interface InspectorGroupProps {
  title: string;
  defaultOpen?: boolean;
  items: (InspectorFieldProps | InspectorGroupProps)[];
  onToggle?: (value: boolean) => void;
}

export interface InspectorGroupRef {
  addGroup: (data: GroupData) => React.RefObject<InspectorGroupRef | null>;
  removeGroup: (name: string) => void;
  setField: (name: string, value: FieldValue) => void;
}

// Forward declaration to handle recursive type
const InspectorGroupForwardRef = forwardRef<InspectorGroupRef, InspectorGroupProps>(
  function InspectorGroup({ title, defaultOpen = false, items }, ref) {
    const [subgroups, setSubgroups] = useState<Array<{
      name: string;
      element: React.ReactElement;
      ref: React.RefObject<InspectorGroupRef | null>;
    }>>([]);
    const [valueOverrides, setValueOverrides] = useState<Map<string, FieldValue>>(new Map());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addGroup = useCallback((_data: GroupData): React.RefObject<InspectorGroupRef | null> => {
      // TODO: Implement recursive group support
      console.warn('Nested groups not yet supported in memoized version');
      return React.createRef<InspectorGroupRef>();
    }, []);

    const removeGroup = useCallback((name: string) => {
      setSubgroups(prev => prev.filter(group => group.name !== name));
    }, []);

    const setField = useCallback((name: string, value: FieldValue) => {
      setValueOverrides(prev => {
        const newMap = new Map(prev);
        newMap.set(name, value);
        return newMap;
      });
    }, []);

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      addGroup,
      removeGroup,
      setField,
    }));

    const renderChildren = (): ReactNode[] => {
      const children: ReactNode[] = [];

      // Render main items
      items.forEach((child: InspectorFieldProps | InspectorGroupProps, index) => {
        if (isGroup(child)) {
          // Simple nested group without memo for now to avoid circular reference
          children.push(
            <div key={`group-${index}`} style={{ marginLeft: '10px' }}>
              <h4>{capitalize(child.title)}</h4>
              {child.items.map((nestedChild, nestedIndex) => (
                <InspectorField
                  key={`nested-field-${nestedIndex}`}
                  label={(nestedChild as InspectorFieldProps).label}
                  type={(nestedChild as InspectorFieldProps).type}
                  value={(nestedChild as InspectorFieldProps).value}
                  onChange={(nestedChild as InspectorFieldProps).onChange}
                  onClick={(nestedChild as InspectorFieldProps).onClick}
                />
              ))}
            </div>
          );
        } else {
          const valueOverride = valueOverrides.get(child.label);
          const value = valueOverride !== undefined ? valueOverride : child.value;
          
          children.push(
            <InspectorField
              key={`field-${index}`}
              label={child.label}
              type={child.type}
              value={value}
              min={child.min}
              max={child.max}
              step={child.step}
              disabled={child.disabled}
              options={child.options}
              onChange={(value: FieldValue) => {
                if (child.onChange !== undefined) {
                  // Clear override when user changes value
                  setValueOverrides(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(child.label);
                    return newMap;
                  });
                  child.onChange(value);
                }
              }}
              onClick={child.onClick}
            />
          );
        }
      });

      // Render dynamically added subgroups
      subgroups.forEach((subgroup) => {
        children.push(subgroup.element);
      });

      return children;
    };

    return (
      <Accordion
        title={title}
        defaultOpen={defaultOpen}
      >
        {renderChildren()}
      </Accordion>
    );
  }
);

export const InspectorGroup = memo(InspectorGroupForwardRef, (prevProps, nextProps) => {
  // Custom comparison for complex props
  return JSON.stringify(prevProps.items) === JSON.stringify(nextProps.items) &&
         prevProps.title === nextProps.title &&
         prevProps.defaultOpen === nextProps.defaultOpen;
});

InspectorGroup.displayName = 'InspectorGroup';

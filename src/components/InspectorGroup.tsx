import React, { useState, useImperativeHandle, forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Accordion } from './Accordion';
import { InspectorField } from './InspectorField';
import type { InspectorFieldProps } from './InspectorField';
import { capitalize } from './utils';
import type { GroupData, GroupItemData, FieldValue } from './types';

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

export const InspectorGroup = forwardRef<InspectorGroupRef, InspectorGroupProps>(
  ({ title, defaultOpen = false, items }, ref) => {
    const [subgroups, setSubgroups] = useState<Array<{
      name: string;
      element: React.ReactElement;
      ref: React.RefObject<InspectorGroupRef | null>;
    }>>([]);
    const [valueOverrides, setValueOverrides] = useState<Map<string, FieldValue>>(new Map());

    const addGroup = (data: GroupData): React.RefObject<InspectorGroupRef | null> => {
      const groupItems: InspectorFieldProps[] = data.items.map((item: GroupItemData) => ({
        label: item.title !== undefined ? item.title : item.prop,
        type: item.type,
        value: item.value as FieldValue,
        min: item.min,
        max: item.max,
        step: item.step,
        options: item.options,
        disabled: item.disabled,
        onChange: (value: FieldValue) => {
          data.onUpdate(item.prop, value);
        },
      }));

      const elementRef = React.createRef<InspectorGroupRef>();
      const element = (
        <InspectorGroup
          ref={elementRef}
          title={data.title}
          defaultOpen={data.expanded}
          items={groupItems}
          key={`${data.title}-${Date.now()}`}
        />
      );

      setSubgroups(prev => [
        ...prev,
        {
          name: data.title,
          element,
          ref: elementRef
        }
      ]);

      return elementRef;
    };

    const removeGroup = (name: string) => {
      setSubgroups(prev => prev.filter(group => group.name !== name));
    };

    const setField = (name: string, value: FieldValue) => {
      setValueOverrides(prev => {
        const newMap = new Map(prev);
        newMap.set(name, value);
        return newMap;
      });
    };

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
          children.push(
            <InspectorGroup
              title={capitalize(child.title)}
              defaultOpen={child.defaultOpen}
              items={child.items}
              onToggle={child.onToggle}
              key={`group-${index}`}
            />
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

InspectorGroup.displayName = 'InspectorGroup';

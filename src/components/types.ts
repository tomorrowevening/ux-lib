export interface Vector2Value {
  x: number;
  y: number;
}

export interface Grid3Value {
  x: number;
  y: number;
  z: number;
}

export interface Grid4Value {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface OptionValue {
  label: string;
  value: string | number | boolean;
}

export type FieldValue = string | number | boolean | Vector2Value | Grid3Value | Grid4Value | OptionValue[];

export type FieldType = 
  | 'string' 
  | 'number' 
  | 'range'
  | 'boolean' 
  | 'color' 
  | 'vector2' 
  | 'grid3' 
  | 'grid4' 
  | 'image' 
  | 'option' 
  | 'button';

export interface GroupItemData {
  type: FieldType
  prop: string
  title?: string
  value?: unknown
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  options?: OptionValue[]
}

export interface GroupData {
  title: string
  expanded?: boolean
  items: GroupItemData[]
  onUpdate: (prop: string, value: unknown) => void
}

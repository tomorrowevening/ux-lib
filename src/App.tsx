import { useState } from 'react';
import { InspectorField } from './components/InspectorField';
import { Accordion } from './components/Accordion';
import './styles/accordion.scss';
import './styles/inspector.scss';

export default function App() {
  const [numberValue, setNumberValue] = useState(5);
  const [rangeValue, setRangeValue] = useState(0.5);
  const [stringValue, setStringValue] = useState('Hello World');
  const [boolValue, setBoolValue] = useState(true);
  const [colorValue, setColorValue] = useState('#ff0000');
  const [vectorValue, setVectorValue] = useState({ x: 0.5, y: 0.3 });
  const [vector3Value, setVector3Value] = useState({ x: 1.0, y: 2.0, z: 0.5 });
  const [vector4Value, setVector4Value] = useState({ x: 1.0, y: 2.0, z: 0.5, w: 1.0 });
  const [selectedOption, setSelectedOption] = useState('option2');
  const [imageValue, setImageValue] = useState('');

  return (
    <div>
      <h1>UX Library</h1>
      <p>React components extracted from <a href='https://github.com/tomorrowevening/hermes' target='_blank'>Hermes</a> editor</p>
      
      <div style={{ 
        maxWidth: '400px',
        backgroundColor: '#0d0d0d',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <InspectorField
          label="Text Field"
          type="string"
          value={"Lorem Ipsum"}
          disabled={true}
        />
        
        <Accordion title='Example' defaultOpen={true}>
          <InspectorField
            label="String Field"
            type="string"
            value={stringValue}
            onChange={(value) => setStringValue(value as string)}
          />
          
          <InspectorField
            label="Number Field"
            type="number"
            value={numberValue}
            step={0.01}
            onChange={(value) => setNumberValue(value as number)}
          />
          
          <InspectorField
            label="Range Field"
            type="range"
            value={rangeValue}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => setRangeValue(value as number)}
          />
          
          <InspectorField
            label="Boolean Field"
            type="boolean"
            value={boolValue}
            onChange={(value) => setBoolValue(value as boolean)}
          />
          
          <InspectorField
            label="Color Field"
            type="color"
            value={colorValue}
            onChange={(value) => setColorValue(value as string)}
          />
          
          <InspectorField
            label="Image Field"
            type="image"
            value={imageValue}
            onChange={(value) => setImageValue(value as string)}
          />
          
          <InspectorField
            label="Vector2 Field"
            type="vector2"
            value={vectorValue}
            onChange={(value) => setVectorValue(value as { x: number; y: number })}
          />
          
          <InspectorField
            label="Vector3 Grid"
            type="grid3"
            value={vector3Value}
            onChange={(value) => setVector3Value(value as { x: number; y: number; z: number })}
          />
          
          <InspectorField
            label="Vector4 Grid"
            type="grid4"
            value={vector4Value}
            onChange={(value) => setVector4Value(value as { x: number; y: number; z: number; w: number })}
          />
          
          <InspectorField
            label="Option Field"
            type="option"
            value={selectedOption}
            options={[
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' }
            ]}
            onChange={(value) => setSelectedOption(value as string)}
          />
          
          <InspectorField
            label="Click Me!"
            type="button"
            onClick={() => alert('Button clicked!')}
          />
        </Accordion>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        opacity: 0.7,
        backgroundColor: '#222',
        padding: '15px',
        borderRadius: '4px',
        maxWidth: '400px'
      }}>
        <h3>Current Values:</h3>
        <pre>{JSON.stringify({
          string: stringValue,
          number: numberValue,
          range: rangeValue,
          boolean: boolValue,
          color: colorValue,
          image: imageValue ? `[Image: ${Math.round(imageValue.length / 1024)}KB]` : 'No image',
          vector2: vectorValue,
          vector3: vector3Value,
          vector4: vector4Value,
          selectedOption: selectedOption
        }, null, 2)}</pre>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        fontSize: '14px',
        opacity: 0.8,
        maxWidth: '400px'
      }}>
        <h3 style={{ margin: '10px 0' }}>Features:</h3>
        <ul style={{
          margin: 0,
          paddingInlineStart: '20px',
        }}>
          <li>Drag number field labels to edit values</li>
          <li>Visual vector2 editing with interactive grid</li>
          <li>Collapsible accordion containers with nesting support</li>
          <li>Clean SCSS styling matching Hermes editor</li>
          <li>TypeScript support with proper types</li>
          <li>Zero dependencies (except React)</li>
        </ul>
      </div>
    </div>
  );
}

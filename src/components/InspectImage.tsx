import React, { useRef, useState } from 'react';

interface InspectImageProps {
  value: string;
  onChange: (value: string) => void;
}

export const InspectImage: React.FC<InspectImageProps> = ({
  value,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      // Create object URL for preview (more efficient than base64)
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Only read as base64 for the onChange callback if needed
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setFileName('');
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="inspector-field image-field">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="image-controls">
        <button
          onClick={handleButtonClick}
          className="field-button image-button"
        >
          {fileName ? 'Change Image' : 'Choose Image'}
        </button>
        {fileName && (
          <button
            onClick={clearImage}
            className="field-button image-clear-button"
          >
            Clear
          </button>
        )}
      </div>
      {fileName && (
        <div className="image-info">
          <span className="image-filename">{fileName}</span>
        </div>
      )}
      {previewUrl && (
        <div className="image-preview">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="preview-image"
          />
        </div>
      )}
    </div>
  );
};
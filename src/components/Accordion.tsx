import React, { useState, useRef } from 'react';

interface AccordionProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const hide = !isOpen || children === undefined;

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion ${hide ? 'hide' : ''} ${className}`}>
      <button
        className={`accordion-header ${isOpen ? 'open' : ''}`}
        onClick={toggleAccordion}
        type="button"
      >
        <span className="accordion-title">{title}</span>
        <span className={`accordion-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>
      
      <div 
        ref={contentRef}
        className={`accordion-content ${isOpen ? 'open' : ''}`}
      >
        <div className="accordion-body">
          {children}
        </div>
      </div>
    </div>
  );
};

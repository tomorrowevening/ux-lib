import { useState, useRef, memo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AccordionProps {
  title: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion = memo(function Accordion({
  title,
  children,
  defaultOpen = false,
  className = ''
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const hide = !isOpen || children === undefined;

  const toggleAccordion = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

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
});

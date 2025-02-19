import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Save previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Find all focusable elements
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      // Focus the first element
      (focusableElements[0] as HTMLElement).focus();
    }

    // Create focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      if (e.key === 'Tab') {
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        // If shift+tab on first element, go to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } 
        // If tab on last element, go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      
      // Allow escape to exit
      if (e.key === 'Escape' && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus when unmounting
      if (active && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

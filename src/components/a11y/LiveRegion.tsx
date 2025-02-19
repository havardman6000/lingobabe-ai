interface LiveRegionProps {
    children: React.ReactNode;
    ariaLive?: 'polite' | 'assertive' | 'off';
    ariaAtomic?: boolean;
    ariaRelevant?: 'additions' | 'removals' | 'text' | 'all';
    className?: string;
  }
  
  export function LiveRegion({
    children,
    ariaLive = 'polite',
    ariaAtomic = true,
    ariaRelevant,
    className,
  }: LiveRegionProps) {
    return (
      <div
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
        aria-relevant={ariaRelevant}
        className={className}
      >
        {children}
      </div>
    );
  }
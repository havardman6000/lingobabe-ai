import { VisuallyHidden } from "./VisuallyHidden";

interface AccessibleIconProps {
    icon: React.ReactNode;
    label: string;
  }
  
  export function AccessibleIcon({ icon, label }: AccessibleIconProps) {
    return (
      <>
        <span aria-hidden="true">{icon}</span>
        <VisuallyHidden>{label}</VisuallyHidden>
      </>
    );
  }
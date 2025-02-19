import { useEffect } from "react";

interface AccessibleToastProps {
    message: string;
    isVisible: boolean;
    type?: 'info' | 'success' | 'error' | 'warning';
    autoClose?: boolean;
    duration?: number;
    onClose?: () => void;
  }
  
  export function AccessibleToast({
    message,
    isVisible,
    type = 'info',
    autoClose = true,
    duration = 5000,
    onClose,
  }: AccessibleToastProps) {
    useEffect(() => {
      if (isVisible && autoClose) {
        const timer = setTimeout(() => {
          if (onClose) onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [isVisible, autoClose, duration, onClose]);
  
    if (!isVisible) return null;
  
    const toastClasses = {
      base: 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded shadow-lg max-w-sm w-full',
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
      success: 'bg-green-100 text-green-800 border border-green-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    };
  
    return (
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={`${toastClasses.base} ${toastClasses[type]}`}
      >
        <div className="flex justify-between items-center">
          <div>{message}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Close notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
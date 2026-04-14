import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import DirectConnectForm from './DirectConnectForm';

interface DirectConnectOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle?: string;
}

export default function DirectConnectOverlay({ isOpen, onClose, sessionTitle }: DirectConnectOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-card border border-border/50 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors z-10 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 md:p-12">
            <DirectConnectForm onComplete={onClose} sessionContext={sessionTitle} />
        </div>
      </div>
    </div>
  );
}

// src/components/ConfirmExitDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmExitDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  onStayInChat: () => void;
}

export function ConfirmExitDialog({ 
  open, 
  onClose, 
  onConfirmExit,
  onStayInChat
}: ConfirmExitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Chat?</DialogTitle>
        </DialogHeader>
        <div className="text-gray-300 my-4">
          <p>If you leave now, your progress will be lost and you'll lose access to this chat.</p>
          <p className="mt-2">You'll need to pay 10 LBAI tokens again to restart this conversation.</p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button
            variant="outline"
            onClick={onStayInChat}
            className="sm:w-auto w-full"
          >
            Back to Chat
          </Button>
          
          <Button
            onClick={onConfirmExit}
            variant="destructive"
            className="sm:w-auto w-full"
          >
            Leave Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
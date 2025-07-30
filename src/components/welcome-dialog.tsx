
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BadgeCheck, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

    useEffect(() => {
        if (open) {
            setTimeLeft(180); // Reset timer when dialog opens
            const intervalId = setInterval(() => {
                setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            return () => clearInterval(intervalId); // Cleanup on close
        }
    }, [open]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 overflow-hidden">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold font-headline">
            Shop Smarter.
            <span
              className="block text-4xl font-extrabold"
              style={{
                color: '#FFFF00',
                textShadow:
                  '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000',
              }}
            >
              Save 10% on Every Order.
            </span>
          </DialogTitle>
           <div className="flex items-center justify-center gap-2 mt-2 bg-red-500/20 text-red-300 border border-red-500/50 rounded-full px-4 py-1.5 max-w-xs mx-auto">
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg font-bold">Offer ends in: {formatTime(timeLeft)}</span>
            </div>
        </DialogHeader>
        <div className="space-y-4 text-center text-sm text-muted-foreground mt-2">
          <p>
            Stop paying full price. Creating your free account is the fastest way to unlock permanent savings on the gear you need. It takes less than a minute.
          </p>
          <p className="font-semibold text-foreground">Here’s how it works:</p>
          <div className="space-y-4 text-left p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-accent">SAVE 10% RIGHT NOW</h4>
                <p>Get an instant 10% discount on your entire first order the moment you sign up.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-accent">KEEP SAVING 10%</h4>
                <p>Then, automatically save 10% on all future orders over $40—every single time you shop with your account.</p>
              </div>
            </div>
          </div>
           <p>
            You'll be given a code to apply at checkout for your savings. Just smart, automatic savings.
          </p>
        </div>
        <DialogFooter className="flex-col gap-2 pt-2 items-center">
          <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/account#signup">Register Now</Link>
          </Button>
           <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
            Ignore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

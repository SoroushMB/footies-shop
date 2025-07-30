
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
import { BadgeCheck } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 overflow-hidden">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold font-headline">Shop Smarter: Save 10% on Every Order.</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center text-sm text-muted-foreground">
          <p>
            Stop paying full price. Creating your free account is the fastest way to unlock permanent savings on the gear you need. It takes less than 30 seconds.
          </p>
          <p className="font-semibold text-foreground">Here’s how it works:</p>
          <div className="space-y-4 text-left p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground">SAVE 10% RIGHT NOW</h4>
                <p>Get an instant 10% discount on your entire first order the moment you sign up.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground">KEEP SAVING 10%</h4>
                <p>Then, automatically save 10% on all future orders over $40—every single time you shop with your account.</p>
              </div>
            </div>
          </div>
           <p>
            You'll be given a code to apply at checkout for your savings. Just smart, automatic savings.
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:justify-center gap-2 pt-2">
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

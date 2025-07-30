
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
import { Input } from './ui/input';
import Image from 'next/image';
import Link from 'next/link';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="relative aspect-video">
          <Image 
            src="https://images.unsplash.com/photo-1551958214-2d5b914b5a29?q=80&w=800&auto=format&fit=crop"
            alt="Promotional image of football gear"
            layout="fill"
            objectFit="cover"
            data-ai-hint="football gear"
          />
        </div>
        <DialogHeader className="p-6 text-center">
          <DialogTitle className="text-2xl font-bold font-headline">Welcome to Footies-Shop!</DialogTitle>
          <DialogDescription>
            Get 15% off your first order. Use code <span className="font-bold text-accent">WELCOME15</span> at checkout when you register.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col sm:justify-center gap-2 p-6 pt-0">
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

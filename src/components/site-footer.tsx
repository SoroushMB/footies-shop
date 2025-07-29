import Link from 'next/link';
import { Facebook, Instagram, Lock, ShieldCheck, Truck, Twitter, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 text-sm text-neutral-300">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-center md:text-left border-b border-white/10">
          <FeatureItem icon={<Truck className="h-8 w-8 text-accent" />} text="Free & Fast Shipping" />
          <FeatureItem icon={<Undo2 className="h-8 w-8 text-accent" />} text="Easy Returns" />
          <FeatureItem icon={<ShieldCheck className="h-8 w-8 text-accent" />} text="Official Products" />
          <FeatureItem icon={<Lock className="h-8 w-8 text-accent" />} text="Secure Payments" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 py-12 items-center">
          <div className="lg:col-span-5 text-center lg:text-left">
            <h3 className="font-headline text-2xl font-bold text-white">DON'T MISS OUT</h3>
            <p className="mt-2">Be the first to know about new collections and exclusive offers.</p>
          </div>
          <div className="lg:col-span-7">
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-white/10 border-white/20 placeholder:text-neutral-400 h-12"
              />
              <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-12">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-t border-white/10">
          <FooterLinkColumn title="Shop" links={[
            { name: 'Jerseys', href: '/category/jerseys' },
            { name: 'Footballs', href: '/category/footballs' },
            { name: 'Apparel', href: '/category/apparel' },
            { name: 'Footwear', href: '/category/footwear' },
            { name: 'Accessories', href: '/category/accessories' },
          ]} />
          <FooterLinkColumn title="Information" links={[
            { name: 'About Us', href: '#' },
            { name: 'FAQ', href: '#' },
            { name: 'Shipping & Returns', href: '#' },
            { name: 'Contact Us', href: '#' },
          ]} />
          <FooterLinkColumn title="Legal" links={[
            { name: 'Terms of Service', href: '#' },
            { name: 'Privacy Policy', href: '#' },
          ]} />
          <div className="lg:col-span-2 text-center md:text-left">
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <SocialIcon href="#" icon={<Instagram />} />
              <SocialIcon href="#" icon={<Facebook />} />
              <SocialIcon href="#" icon={<Twitter />} />
              <SocialIcon href="#" icon={<Icons.tiktok />} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black/20 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">&copy; {new Date().getFullYear()} Apex Football Gear. All Rights Reserved.</p>
          <div className="flex gap-2 items-center">
            <Icons.visa className="h-6" />
            <Icons.mastercard className="h-6" />
            <Icons.amex className="h-6" />
            <Icons.paypal className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {icon}
      <span className="font-semibold text-white">{text}</span>
    </div>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="hover:text-accent transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="text-neutral-300 hover:text-accent transition-colors">
      {icon}
    </Link>
  );
}

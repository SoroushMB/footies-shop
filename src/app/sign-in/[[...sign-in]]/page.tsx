import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl',
          },
        }}
      />
    </div>
  );
}


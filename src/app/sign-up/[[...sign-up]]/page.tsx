import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SignUp
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


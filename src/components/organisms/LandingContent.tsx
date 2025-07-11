import Link from 'next/link';
import Button from '@/components/atoms/Button';

export default function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="flex gap-4">
        <Link href="/auth?mode=login">
          <Button variant="secondary">Sign In</Button>
        </Link>
        <Link href="/auth?mode=signup">
          <Button variant="primary">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}

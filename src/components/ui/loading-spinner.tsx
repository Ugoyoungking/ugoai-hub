import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <Logo className="h-12 w-12 animate-pulse text-primary duration-2000" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

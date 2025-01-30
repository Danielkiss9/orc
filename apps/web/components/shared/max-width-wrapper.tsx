import { ReactNode } from 'react';
import { cn } from '@orc/web/ui/custom-ui';

export default function MaxWidthWrapper({
  className,
  children,
  large = false,
}: {
  className?: string;
  large?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'container',
        large ? 'max-w-screen-3xl' : 'max-w-6xl',
        className
      )}
    >
      {children}
    </div>
  );
}

import { cn } from './../utils';
import { ReactNode } from 'react';
import { Icons } from './icons';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button';

export interface AdvancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text?: string;
  loading?: boolean;
  icon?: ReactNode;
  shortcut?: string;
  disabledTooltip?: string | ReactNode;
}

export function AdvancedButton({
  text,
  variant = 'default',
  className,
  loading,
  icon,
  shortcut,
  ...props
}: AdvancedButtonProps) {
  return (
    <button
      // if onClick is passed, it's a "button" type, otherwise it's being used in a form, hence "submit"
      type={props.onClick ? 'button' : 'submit'}
      className={cn(
        'group flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all p-4',
        props.disabled || loading
          ? 'cursor-not-allowed border-gray-200 bg-primary text-gray-400'
          : buttonVariants({ variant, size: props.size }),
        className
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <Icons.spinner className="size-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {text && <p className={cn(shortcut && 'flex-1 text-left')}>{text}</p>}
      {shortcut && (
        <kbd
          className={cn(
            'hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block',
            buttonVariants({ variant, size: 'icon' })
          )}
        >
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

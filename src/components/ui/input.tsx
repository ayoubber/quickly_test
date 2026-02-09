import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-brand-navy-light border border-white/10',
            'text-white placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        {helper && !error && (
          <p className="mt-2 text-sm text-gray-400">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

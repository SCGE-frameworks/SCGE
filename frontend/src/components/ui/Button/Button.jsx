const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600 focus:ring-brand-400',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-400',
  danger:
    'bg-red-500 text-white hover:bg-red-400 active:bg-red-600 focus:ring-red-400',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const variantClasses = variants[variant] ?? variants.primary;
  const sizeClasses = sizes[size] ?? sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-all duration-150 ease-in-out',
        'shadow-sm',

        'focus:outline-none focus:ring-2 focus:ring-offset-2',

        'disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white',

        variantClasses,
        sizeClasses,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
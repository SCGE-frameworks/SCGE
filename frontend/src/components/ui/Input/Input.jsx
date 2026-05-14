function Input({
  label,
  error,
  helperText,
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}

<input
  id={inputId}
  disabled={disabled}
  className={[
    'h-11 rounded-md border bg-white px-3 text-sm text-gray-600',
    'outline-none transition-all duration-150',
    'placeholder:text-gray-400',
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/30'
      : 'border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30',
    'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
    className,
  ].join(' ')}
  {...props}
/>

      {error && <span className="text-xs text-red-500">{error}</span>}

      {!error && helperText && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </div>
  );
}

export default Input;
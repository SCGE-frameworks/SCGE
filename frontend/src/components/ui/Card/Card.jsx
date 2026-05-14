function Card({ children, className = '', ...props }) {
  return (
    <div
      className={[
        'rounded-xl border border-gray-100 bg-white shadow-sm',
        'p-8',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
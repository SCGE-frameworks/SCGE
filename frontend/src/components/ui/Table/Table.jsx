function Table({ children, className = '', ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={[
          'w-full border-collapse text-sm',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export default Table;
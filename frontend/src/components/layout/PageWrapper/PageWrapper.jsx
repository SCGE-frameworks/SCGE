function PageWrapper({ title, description, children, className = '' }) {
  return (
    <section className={['space-y-6', className].join(' ')}>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      <div>{children}</div>
    </section>
  );
}

export default PageWrapper;

export const Spinner = () => <span className="spinner" aria-label="Loading" />;

export function EmptyState({ title = 'Nothing here yet', description = 'Try changing the filters or add a new record.' }) {
  return <div className="empty"><strong>{title}</strong><span>{description}</span></div>;
}

export function StatusBadge({ value }) {
  const safe = String(value ?? 'unknown').replaceAll('_', ' ');
  return <span className={`badge badge-${safe.toLowerCase()}`}>{safe}</span>;
}

export function Notice({ message, type = 'error' }) {
  return message ? <div className={`notice ${type}`} role={type === 'error' ? 'alert' : 'status'}>{message}</div> : null;
}

export function Modal({ title, children, onClose, showHeader = true }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
    <section className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      {showHeader && <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><h2 className="text-lg font-bold text-slate-950">{title}</h2><button type="button" className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close">×</button></header>}
      {children}
    </section>
  </div>;
}

export function Pagination({ meta, onChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  return <div className="pagination"><span>Page {meta.page} of {meta.totalPages}</span><div><button disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>Previous</button><button disabled={meta.page >= meta.totalPages} onClick={() => onChange(meta.page + 1)}>Next</button></div></div>;
}

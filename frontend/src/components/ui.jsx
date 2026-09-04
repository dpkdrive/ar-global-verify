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

export function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <header><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close">×</button></header>
      {children}
    </section>
  </div>;
}

export function Pagination({ meta, onChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  return <div className="pagination"><span>Page {meta.page} of {meta.totalPages}</span><div><button disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>Previous</button><button disabled={meta.page >= meta.totalPages} onClick={() => onChange(meta.page + 1)}>Next</button></div></div>;
}

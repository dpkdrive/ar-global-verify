const navigation = [
  ['dashboard', 'Overview'], ['products', 'Products'], ['suspicious', 'Risk monitor'], ['audit', 'Activity'], ['settings', 'Settings'],
];

export function AppShell({ user, page, setPage, onLogout, children }) {
  const links = user.role === 'admin' ? [...navigation.slice(0, 4), ['users', 'Users'], navigation[4]] : navigation;
  return <div className="app-shell">
    <aside className="sidebar"><button className="brand" onClick={() => setPage('dashboard')}><span>AR</span> Authentica</button>
      <nav>{links.map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>{label}</button>)}</nav>
      <div className="account"><span className="avatar">{user.name?.slice(0, 1)}</span><div><strong>{user.name}</strong><small>{user.role}</small></div><button className="text-button" onClick={onLogout}>Sign out</button></div>
    </aside>
    <main className="main-content">{children}</main>
  </div>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <header className="page-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</header>;
}

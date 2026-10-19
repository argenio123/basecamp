// Static-shell fallback for /admin while the session and fresh content stream in.
export default function AdminSkeleton() {
  return (
    <div className="adm-app" aria-busy="true">
      <header className="adm-topbar">
        <p className="adm-topbar-title">BaseCamp CamSur · Content admin</p>
      </header>
      <div className="adm-layout">
        <div className="adm-tabs adm-skeleton-tabs" aria-hidden="true">
          {Array.from({ length: 11 }, (_, i) => <span key={i} className="adm-skeleton-bar" />)}
        </div>
        <div className="adm-panel">
          <p className="adm-muted" role="status">Loading the content admin…</p>
          <span className="adm-skeleton-block" aria-hidden="true" />
          <span className="adm-skeleton-block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

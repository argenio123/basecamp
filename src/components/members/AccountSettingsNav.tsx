import Link from "next/link";

type SettingsArea = "profile" | "history" | "system";
type NavIconName = "profile" | "history" | "system";

const NAV_ITEMS: Array<{ label: string; href: string; icon: NavIconName; area: SettingsArea }> = [
  { label: "Account profile", href: "/account", icon: "profile", area: "profile" },
  { label: "Activity history", href: "/account/history", icon: "history", area: "history" },
  { label: "System settings", href: "/account/settings", icon: "system", area: "system" },
];

function NavIcon({ name }: { name: NavIconName }) {
  if (name === "profile") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
  if (name === "history") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6M12 8v4l3 2" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" /></svg>;
}

export default function AccountSettingsNav({ active, name, email, initials, completion }: { active: SettingsArea; name: string; email: string; initials: string; completion: number }) {
  return (
    <aside className="ma-settings-sidebar" aria-label="Account settings navigation">
      <header className="ma-sidebar-head"><span>Settings</span><h2>Settings &amp; privacy</h2></header>
      <div className="ma-sidebar-member">
        <span className="ma-sidebar-avatar" aria-hidden="true">{initials}</span>
        <div><strong>{name || "BaseCamp member"}</strong><small>{email}</small></div>
      </div>
      <div className="ma-sidebar-progress" aria-label={`${completion}% profile complete`}>
        <span><b>Profile</b><small>{completion}% complete</small></span>
        <i aria-hidden="true"><b style={{ width: `${completion}%` }} /></i>
      </div>
      <nav>
        <p>Manage your account</p>
        {NAV_ITEMS.map((item) => {
          const selected = item.area === active;
          return (
            <Link key={item.href} href={item.href} className={selected ? "is-active" : undefined} aria-current={selected ? "page" : undefined}>
              <span><NavIcon name={item.icon} /></span>
              <span><strong>{item.label}</strong></span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

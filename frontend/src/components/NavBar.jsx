import Logo from "./Logo";
import Icon from "./Icon";

const LINKS = [
  { key: "home", label: "Home", icon: "home" },
  { key: "dashboard", label: "Dashboard", icon: "grid" },
  { key: "goals", label: "Goals", icon: "flag" },
];

export default function NavBar({ page, setPage, hasResults }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => setPage("home")}>
          <Logo size={30} />
          <span className="brand-name">CashFlo</span>
        </button>

        <nav className="navbar-links">
          {LINKS.map((link) => (
            <button
              key={link.key}
              className={`nav-link ${page === link.key ? "active" : ""}`}
              onClick={() => setPage(link.key)}
            >
              <Icon name={link.icon} size={16} className="nav-icon" />
              <span className="nav-label">{link.label}</span>
              {link.key === "dashboard" && hasResults && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

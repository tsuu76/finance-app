import Logo from "./Logo";

export default function NavBar({ page, setPage, hasResults }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
          <Logo size={34} />
          <span className="brand-name">CashFlo</span>
        </div>

        <nav className="navbar-links">
          <button
            className={`nav-link ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            <span className="nav-icon">⌂</span> Home
          </button>
          <button
            className={`nav-link ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            <span className="nav-icon">◈</span> Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}

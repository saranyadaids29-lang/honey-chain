import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BeekeeperDashboard from "./pages/BeekeeperDashboard.jsx";
import LabDashboard from "./pages/LabDashboard.jsx";
import PartnerDashboard from "./pages/PartnerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TraceBatch from "./pages/TraceBatch.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/beekeeper", label: "Beekeeper" },
  { to: "/lab", label: "Lab" },
  { to: "/partner", label: "Packaging & Transport" },
  { to: "/admin", label: "Admin" },
  { to: "/trace", label: "Trace Honey" },
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-hex" aria-hidden="true">
            <svg viewBox="0 0 100 115" width="34" height="39">
              <polygon points="50,2 97,28 97,87 50,113 3,87 3,28" />
            </svg>
          </span>
          <div className="brand-text">
            <span className="brand-name">HoneyChain</span>
            <span className="brand-sub">Blockchain Honey Traceability</span>
          </div>
        </div>
        <nav className="comb-nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => "comb-link" + (isActive ? " active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beekeeper" element={<BeekeeperDashboard />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/trace" element={<TraceBatch />} />
          <Route path="/trace/:batchId" element={<TraceBatch />} />
        </Routes>
      </main>

      <footer className="app-footer">
      HoneyChain — Ensuring pure, transparent, and blockchain-powered honey traceability from hive to home.
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";

const ROLES = [
  {
    to: "/beekeeper",
    icon: "🐝",
    title: "Beekeeper",
    desc: "Register your apiary, log harvests, and create a traceable honey batch with a QR code.",
  },
  {
    to: "/lab",
    icon: "🧪",
    title: "Quality Lab",
    desc: "Record purity and moisture test results against a batch ID.",
  },
  {
    to: "/partner",
    icon: "📦",
    title: "Packaging & Transport",
    desc: "Log packaging, custody transfers, and retail hand-off events on the chain.",
  },
  {
    to: "/admin",
    icon: "📊",
    title: "Admin",
    desc: "Monitor every beekeeper, batch, and the integrity of the ledger itself.",
  },
  {
    to: "/trace",
    icon: "🔍",
    title: "Trace Honey",
    desc: "Scan a bottle's QR code (or enter a batch ID) to see its full journey.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div>
          <span className="hero-eyebrow">Blockchain-Verified Traceability</span>
          <h1>Know exactly where your honey came from.</h1>
          <p className="lead">
            HoneyChain records every stage of a honey batch's journey — apiary, harvest, lab test,
            packaging, transport, and retailer — on a tamper-evident ledger. One QR code lets any
            customer verify it's genuine.
          </p>
          <div className="hero-actions">
            <Link to="/beekeeper">
              <button>Register a batch</button>
            </Link>
            <Link to="/trace">
              <button className="secondary">Trace a bottle</button>
            </Link>
          </div>
        </div>
        <div className="honeycomb-hero" aria-hidden="true">
          <div className="hex-cell outline">🐝</div>
          <div className="hex-cell filled">📦</div>
          <div className="hex-cell outline">🧪</div>
          <div className="hex-cell filled">🚚</div>
          <div className="hex-cell outline">🏪</div>
          <div className="hex-cell filled">✓</div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.15rem", marginBottom: 16 }}>Choose your role</h2>
        <div className="role-grid">
          {ROLES.map((role) => (
            <Link key={role.to} to={role.to} className="role-card">
              <div className="icon-hex">{role.icon}</div>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

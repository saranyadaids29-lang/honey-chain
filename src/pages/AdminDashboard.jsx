import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { STATUS_META } from "../eventMeta.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [beekeepers, setBeekeepers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [validity, setValidity] = useState(null);
  const [error, setError] = useState("");

  function refresh() {
    api.getStats().then(setStats).catch((e) => setError(e.message));
    api.listBeekeepers().then(setBeekeepers).catch((e) => setError(e.message));
    api.listBatches().then(setBatches).catch((e) => setError(e.message));
    api.validateChain().then(setValidity).catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  const beekeeperName = (id) => beekeepers.find((b) => b.id === id)?.name || id;

  return (
    <div>
      <h1 style={{ fontSize: "1.6rem" }}>Admin dashboard</h1>
      <p className="subtle">A bird's-eye view of every beekeeper, batch, and the ledger's integrity.</p>

      {error && <div className="message error">{error}</div>}

      {stats && (
        <div className="stat-grid">
          <div className="stat-hex">
            <div className="num">{stats.beekeepers}</div>
            <div className="label">Beekeepers</div>
          </div>
          <div className="stat-hex">
            <div className="num">{stats.farms}</div>
            <div className="label">Apiaries</div>
          </div>
          <div className="stat-hex">
            <div className="num">{stats.harvests}</div>
            <div className="label">Harvests</div>
          </div>
          <div className="stat-hex">
            <div className="num">{stats.batches}</div>
            <div className="label">Batches</div>
          </div>
          <div className="stat-hex">
            <div className="num">{stats.blocks}</div>
            <div className="label">Ledger blocks</div>
          </div>
        </div>
      )}

      {validity && (
        <div className={`verdict ${validity.valid ? "pass" : "fail"}`}>
          <span className="verdict-icon">{validity.valid ? "✅" : "⚠️"}</span>
          <div>
            <strong>{validity.valid ? "Ledger integrity verified" : "Ledger integrity compromised"}</strong>
            <div className="subtle">
              {validity.valid
                ? "Every block's hash matches its contents and links correctly to the previous block."
                : validity.reason}
            </div>
          </div>
          <button className="secondary" style={{ marginLeft: "auto" }} onClick={refresh}>
            Re-check
          </button>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h2>All batches</h2>
        </div>
        {batches.length === 0 ? (
          <p className="subtle">No batches created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Beekeeper</th>
                <th>Qty (kg)</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.batchId}>
                  <td className="mono">{b.batchId}</td>
                  <td>{beekeeperName(b.beekeeperId)}</td>
                  <td>{b.quantityKg}</td>
                  <td>
                    <StatusBadge status={b.status} meta={STATUS_META[b.status]} />
                  </td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/trace/${b.batchId}`}>View trace →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>All beekeepers</h2>
        </div>
        {beekeepers.length === 0 ? (
          <p className="subtle">No beekeepers registered yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {beekeepers.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.phone}</td>
                  <td>{[b.village, b.district, b.state].filter(Boolean).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

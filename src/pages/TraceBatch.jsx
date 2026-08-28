import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import EventTimeline from "../components/EventTimeline.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { STATUS_META } from "../eventMeta.js";

export default function TraceBatch() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(batchId || "");
  const [history, setHistory] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (batchId) load(batchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  async function load(id) {
    setLoading(true);
    setError("");
    setHistory(null);
    try {
      const data = await api.getBatchHistory(id.trim());
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/trace/${input.trim()}`);
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.6rem" }}>Trace your honey</h1>
      <p className="subtle">Scan the QR code on your bottle, or type the batch ID printed below it.</p>

      <form className="batch-search" onSubmit={handleSubmit}>
        <input
          placeholder="e.g. HC-2026-AB12CD"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Trace</button>
      </form>

      {loading && <p className="subtle">Looking up the ledger…</p>}
      {error && <div className="message error">{error}</div>}

      {history && (
        <>
          <div className={`verdict ${history.chainValid ? "pass" : "fail"}`}>
            <span className="verdict-icon">{history.chainValid ? "✅" : "⚠️"}</span>
            <div>
              <strong>{history.chainValid ? "Verified genuine — record untampered" : "Warning — ledger integrity check failed"}</strong>
              <div className="subtle">
                {history.chainValid
                  ? "Every stage below is cryptographically linked and has not been altered."
                  : history.validityDetail.reason}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>
                Batch <span className="mono">{history.batch.batchId}</span>
              </h2>
              <StatusBadge status={history.batch.status} meta={STATUS_META[history.batch.status]} />
            </div>
            <div className="form-grid" style={{ marginBottom: 4 }}>
              <div>
                <div className="subtle">Beekeeper</div>
                <strong>{history.beekeeper?.name || "Unknown"}</strong>
              </div>
              <div>
                <div className="subtle">Origin</div>
                <strong>
                  {[history.beekeeper?.village, history.beekeeper?.district, history.beekeeper?.state]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </strong>
              </div>
              <div>
                <div className="subtle">Quantity</div>
                <strong>{history.batch.quantityKg} kg</strong>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Journey</h2>
            </div>
            <EventTimeline events={history.events} />
          </div>
        </>
      )}
    </div>
  );
}

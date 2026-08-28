import { useState } from "react";
import { api } from "../api.js";

export default function LabDashboard() {
  const [batchId, setBatchId] = useState("");
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleLookup(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      const found = await api.getBatch(batchId.trim());
      setBatch(found);
    } catch (err) {
      setBatch(null);
      setError(err.message);
    }
  }

  async function handleSubmitTest(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    const form = new FormData(e.target);
    try {
      await api.addQualityTest(batch.batchId, {
        labName: form.get("labName"),
        moisturePercent: form.get("moisturePercent") ? Number(form.get("moisturePercent")) : null,
        purityPercent: form.get("purityPercent") ? Number(form.get("purityPercent")) : null,
        result: form.get("result"),
        notes: form.get("notes"),
      });
      setNotice(`Quality test recorded on the ledger for batch ${batch.batchId}.`);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.6rem" }}>Quality lab</h1>
      <p className="subtle">Look up a batch by ID and attach a signed test result to the ledger.</p>

      <div className="panel">
        <form className="batch-search" onSubmit={handleLookup}>
          <input
            placeholder="Enter batch ID, e.g. HC-2026-AB12CD"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
          <button type="submit">Look up</button>
        </form>
        {error && <div className="message error">{error}</div>}
      </div>

      {batch && (
        <div className="panel">
          <div className="panel-header">
            <h2>
              Batch <span className="mono">{batch.batchId}</span>
            </h2>
            <span className="badge gold">{batch.quantityKg} kg</span>
          </div>

          <form onSubmit={handleSubmitTest} className="form-grid">
            <label>
              Lab name
              <input name="labName" required />
            </label>
            <label>
              Moisture (%)
              <input name="moisturePercent" type="number" step="0.1" min="0" max="100" />
            </label>
            <label>
              Purity (%)
              <input name="purityPercent" type="number" step="0.1" min="0" max="100" />
            </label>
            <label>
              Result
              <select name="result" required>
                <option value="PASS">Pass</option>
                <option value="FAIL">Fail</option>
              </select>
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Notes
              <textarea name="notes" rows={2} placeholder="Any adulteration markers, sugar syrup test notes, etc." />
            </label>
            <div className="form-actions">
              <button type="submit">Submit test result to ledger</button>
            </div>
          </form>

          {notice && <div className="message success">{notice}</div>}
        </div>
      )}
    </div>
  );
}

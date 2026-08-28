import { useState } from "react";
import { api } from "../api.js";

const EVENT_TABS = [
  { key: "packaging", label: "📦 Packaging" },
  { key: "distribution", label: "🚚 Transport" },
  { key: "retail", label: "🏪 Retail receipt" },
];

export default function PartnerDashboard() {
  const [batchId, setBatchId] = useState("");
  const [batch, setBatch] = useState(null);
  const [tab, setTab] = useState("packaging");
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

  async function submit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    const form = new FormData(e.target);
    try {
      if (tab === "packaging") {
        await api.addPackaging(batch.batchId, {
          packagedBy: form.get("packagedBy"),
          unitSizeMl: form.get("unitSizeMl") ? Number(form.get("unitSizeMl")) : null,
          unitsProduced: form.get("unitsProduced") ? Number(form.get("unitsProduced")) : null,
          packagingDate: form.get("packagingDate"),
        });
      } else if (tab === "distribution") {
        await api.addDistribution(batch.batchId, {
          transporterName: form.get("transporterName"),
          fromLocation: form.get("fromLocation"),
          toLocation: form.get("toLocation"),
          vehicleNo: form.get("vehicleNo"),
          date: form.get("date"),
        });
      } else {
        await api.addRetail(batch.batchId, {
          shopName: form.get("shopName"),
          location: form.get("location"),
          date: form.get("date"),
        });
      }
      setNotice(`Event recorded on the ledger for batch ${batch.batchId}.`);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.6rem" }}>Packaging &amp; transport</h1>
      <p className="subtle">Record custody as honey moves from packaging through to the retailer's shelf.</p>

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

          <div className="comb-nav" style={{ marginBottom: 18 }}>
            {EVENT_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={tab === t.key ? "" : "secondary"}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "packaging" && (
            <form onSubmit={submit} className="form-grid">
              <label>
                Packaged by
                <input name="packagedBy" required />
              </label>
              <label>
                Unit size (ml)
                <input name="unitSizeMl" type="number" min="0" />
              </label>
              <label>
                Units produced
                <input name="unitsProduced" type="number" min="0" />
              </label>
              <label>
                Packaging date
                <input name="packagingDate" type="date" required />
              </label>
              <div className="form-actions">
                <button type="submit">Record packaging</button>
              </div>
            </form>
          )}

          {tab === "distribution" && (
            <form onSubmit={submit} className="form-grid">
              <label>
                Transporter name
                <input name="transporterName" required />
              </label>
              <label>
                From
                <input name="fromLocation" required />
              </label>
              <label>
                To
                <input name="toLocation" required />
              </label>
              <label>
                Vehicle no.
                <input name="vehicleNo" />
              </label>
              <label>
                Date
                <input name="date" type="date" required />
              </label>
              <div className="form-actions">
                <button type="submit">Record transport</button>
              </div>
            </form>
          )}

          {tab === "retail" && (
            <form onSubmit={submit} className="form-grid">
              <label>
                Shop / retailer name
                <input name="shopName" required />
              </label>
              <label>
                Location
                <input name="location" required />
              </label>
              <label>
                Date received
                <input name="date" type="date" required />
              </label>
              <div className="form-actions">
                <button type="submit">Record retail receipt</button>
              </div>
            </form>
          )}

          {notice && <div className="message success">{notice}</div>}
        </div>
      )}
    </div>
  );
}

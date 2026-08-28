import { useEffect, useState } from "react";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { STATUS_META } from "../eventMeta.js";

const LS_KEY = "honeychain.beekeeperId";

export default function BeekeeperDashboard() {
  const [beekeepers, setBeekeepers] = useState([]);
  const [activeId, setActiveId] = useState(localStorage.getItem(LS_KEY) || "");
  const [farms, setFarms] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const active = beekeepers.find((b) => b.id === activeId);

  useEffect(() => {
    api.listBeekeepers().then(setBeekeepers).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!activeId) return;
    localStorage.setItem(LS_KEY, activeId);
    refreshFarmsAndHarvests();
    refreshBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function refreshFarmsAndHarvests() {
    api.listFarms(activeId).then(setFarms).catch((e) => setError(e.message));
    api.listHarvests(activeId).then(setHarvests).catch((e) => setError(e.message));
  }

  function refreshBatches() {
    api.listBatches().then((all) => setBatches(all.filter((b) => b.beekeeperId === activeId)));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    try {
      const bk = await api.registerBeekeeper({
        name: form.get("name"),
        phone: form.get("phone"),
        village: form.get("village"),
        district: form.get("district"),
        state: form.get("state"),
      });
      setBeekeepers((prev) => [...prev, bk]);
      setActiveId(bk.id);
      setNotice(`Registered! Your beekeeper ID is ${bk.id}.`);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddFarm(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    try {
      await api.addFarm(activeId, {
        farmName: form.get("farmName"),
        location: form.get("location"),
        hiveCount: Number(form.get("hiveCount")),
        floraType: form.get("floraType"),
      });
      refreshFarmsAndHarvests();
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddHarvest(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    try {
      await api.addHarvest(activeId, {
        farmId: form.get("farmId"),
        date: form.get("date"),
        quantityKg: Number(form.get("quantityKg")),
        floraType: form.get("floraType"),
        notes: form.get("notes"),
      });
      refreshFarmsAndHarvests();
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateBatch(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    const selectedHarvestIds = form.getAll("harvestIds");
    if (selectedHarvestIds.length === 0) {
      setError("Select at least one harvest to include in the batch.");
      return;
    }
    const totalQty = harvests
      .filter((h) => selectedHarvestIds.includes(h.id))
      .reduce((sum, h) => sum + h.quantityKg, 0);
    try {
      const batch = await api.createBatch({
        beekeeperId: activeId,
        harvestIds: selectedHarvestIds,
        quantityKg: totalQty,
      });
      setNotice(`Batch ${batch.batchId} created and written to the ledger.`);
      refreshFarmsAndHarvests();
      refreshBatches();
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  const unusedHarvests = harvests.filter((h) => !h.usedInBatch);

  return (
    <div>
      <h1 style={{ fontSize: "1.6rem" }}>Beekeeper dashboard</h1>
      <p className="subtle">Register your apiary, log every harvest, and turn harvests into a traceable batch.</p>

      {error && <div className="message error">{error}</div>}
      {notice && <div className="message success">{notice}</div>}

      {!active ? (
        <div className="panel">
          <div className="panel-header">
            <h2>Register as a beekeeper</h2>
          </div>

          {beekeepers.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <label>
                Already registered? Select your profile
                <select value={activeId} onChange={(e) => setActiveId(e.target.value)}>
                  <option value="">— choose —</option>
                  {beekeepers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.village || b.district || "—"})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <form onSubmit={handleRegister} className="form-grid">
            <label>
              Full name
              <input name="name" required />
            </label>
            <label>
              Phone number
              <input name="phone" required />
            </label>
            <label>
              Village
              <input name="village" />
            </label>
            <label>
              District
              <input name="district" />
            </label>
            <label>
              State
              <input name="state" />
            </label>
            <div className="form-actions" style={{ alignSelf: "end" }}>
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="panel">
            <div className="panel-header">
              <h2>
                {active.name} <span className="mono subtle">#{active.id}</span>
              </h2>
              <button className="secondary" onClick={() => { setActiveId(""); localStorage.removeItem(LS_KEY); }}>
                Switch profile
              </button>
            </div>
            <p className="subtle">{[active.village, active.district, active.state].filter(Boolean).join(", ") || "No location on file."}</p>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Your apiaries (farms)</h2>
            </div>
            <form onSubmit={handleAddFarm} className="form-grid">
              <label>
                Farm / apiary name
                <input name="farmName" required />
              </label>
              <label>
                Location
                <input name="location" placeholder="e.g. Nilgiris, Tamil Nadu" />
              </label>
              <label>
                Number of hives
                <input name="hiveCount" type="number" min="0" />
              </label>
              <label>
                Primary flora
                <input name="floraType" placeholder="e.g. Wildflower, Litchi, Jamun" />
              </label>
              <div className="form-actions" style={{ alignSelf: "end" }}>
                <button type="submit">Add farm</button>
              </div>
            </form>

            {farms.length > 0 && (
              <table style={{ marginTop: 18 }}>
                <thead>
                  <tr>
                    <th>Farm</th>
                    <th>Location</th>
                    <th>Hives</th>
                    <th>Flora</th>
                  </tr>
                </thead>
                <tbody>
                  {farms.map((f) => (
                    <tr key={f.id}>
                      <td>{f.farmName}</td>
                      <td>{f.location}</td>
                      <td>{f.hiveCount}</td>
                      <td>{f.floraType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Log a harvest</h2>
            </div>
            {farms.length === 0 ? (
              <p className="subtle">Add a farm first — harvests need to be linked to an apiary.</p>
            ) : (
              <form onSubmit={handleAddHarvest} className="form-grid">
                <label>
                  Farm
                  <select name="farmId" required>
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.farmName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Harvest date
                  <input name="date" type="date" required />
                </label>
                <label>
                  Quantity (kg)
                  <input name="quantityKg" type="number" min="0" step="0.1" required />
                </label>
                <label>
                  Flora type
                  <input name="floraType" />
                </label>
                <label style={{ gridColumn: "1 / -1" }}>
                  Notes
                  <textarea name="notes" rows={2} />
                </label>
                <div className="form-actions">
                  <button type="submit">Log harvest</button>
                </div>
              </form>
            )}

            {harvests.length > 0 && (
              <table style={{ marginTop: 18 }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Qty (kg)</th>
                    <th>Flora</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {harvests.map((h) => (
                    <tr key={h.id}>
                      <td>{h.date}</td>
                      <td>{h.quantityKg}</td>
                      <td>{h.floraType}</td>
                      <td>{h.usedInBatch ? <span className="badge brown">In a batch</span> : <span className="badge gold">Available</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Create a honey batch</h2>
            </div>
            {unusedHarvests.length === 0 ? (
              <p className="subtle">No unused harvests available. Log a harvest above first.</p>
            ) : (
              <form onSubmit={handleCreateBatch}>
                <p className="subtle" style={{ marginBottom: 8 }}>Select the harvests to combine into one traceable batch:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {unusedHarvests.map((h) => (
                    <label key={h.id} style={{ flexDirection: "row", alignItems: "center", fontWeight: 400 }}>
                      <input type="checkbox" name="harvestIds" value={h.id} style={{ width: "auto" }} />
                      {h.date} · {h.quantityKg} kg · {h.floraType || "unspecified flora"}
                    </label>
                  ))}
                </div>
                <button type="submit">Create batch &amp; generate QR</button>
              </form>
            )}
          </div>

          {batches.length > 0 && (
            <div className="panel">
              <div className="panel-header">
                <h2>Your batches</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {batches.map((b) => (
                  <div key={b.batchId} className="qr-card">
                    <img src={b.qrCodeDataUrl} alt={`QR code for batch ${b.batchId}`} />
                    <div style={{ flex: 1 }}>
                      <div className="qr-id">{b.batchId}</div>
                      <div style={{ margin: "4px 0" }}>
                        <StatusBadge status={b.status} meta={STATUS_META[b.status]} />
                      </div>
                      <div>{b.quantityKg} kg</div>
                      <div className="qr-url">{b.traceUrl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

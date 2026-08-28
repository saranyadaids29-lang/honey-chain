const BASE_URL = "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }
  return body;
}

export const api = {
  // Beekeepers
  registerBeekeeper: (data) => request("/beekeepers", { method: "POST", body: JSON.stringify(data) }),
  listBeekeepers: () => request("/beekeepers"),
  getBeekeeper: (id) => request(`/beekeepers/${id}`),

  // Farms
  addFarm: (beekeeperId, data) => request(`/beekeepers/${beekeeperId}/farms`, { method: "POST", body: JSON.stringify(data) }),
  listFarms: (beekeeperId) => request(`/beekeepers/${beekeeperId}/farms`),

  // Harvests
  addHarvest: (beekeeperId, data) => request(`/beekeepers/${beekeeperId}/harvests`, { method: "POST", body: JSON.stringify(data) }),
  listHarvests: (beekeeperId) => request(`/beekeepers/${beekeeperId}/harvests`),

  // Batches
  createBatch: (data) => request("/batches", { method: "POST", body: JSON.stringify(data) }),
  listBatches: () => request("/batches"),
  getBatch: (batchId) => request(`/batches/${batchId}`),
  getBatchHistory: (batchId) => request(`/batches/${batchId}/history`),

  addQualityTest: (batchId, data) => request(`/batches/${batchId}/quality-test`, { method: "POST", body: JSON.stringify(data) }),
  addPackaging: (batchId, data) => request(`/batches/${batchId}/packaging`, { method: "POST", body: JSON.stringify(data) }),
  addDistribution: (batchId, data) => request(`/batches/${batchId}/distribution`, { method: "POST", body: JSON.stringify(data) }),
  addRetail: (batchId, data) => request(`/batches/${batchId}/retail`, { method: "POST", body: JSON.stringify(data) }),

  // Blockchain / stats
  getStats: () => request("/stats"),
  validateChain: () => request("/blockchain/validate"),
  getChain: () => request("/blockchain"),
};

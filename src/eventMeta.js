export const EVENT_META = {
  GENESIS: { label: "Ledger Initialized", icon: "⬡", badge: "brown" },
  BATCH_CREATED: { label: "Harvested by Beekeeper", icon: "🐝", badge: "gold" },
  QUALITY_TEST: { label: "Quality Test", icon: "🧪", badge: "green" },
  PACKAGING: { label: "Packaged", icon: "📦", badge: "gold" },
  DISTRIBUTION: { label: "In Transit", icon: "🚚", badge: "brown" },
  RETAIL: { label: "Received by Retailer", icon: "🏪", badge: "gold" },
};

export function metaFor(type) {
  return EVENT_META[type] || { label: type, icon: "⬡", badge: "brown" };
}

export const STATUS_META = {
  HARVESTED: { label: "Harvested", badge: "gold" },
  QUALITY_TESTED: { label: "Quality Tested", badge: "green" },
  PACKAGED: { label: "Packaged", badge: "gold" },
  IN_TRANSIT: { label: "In Transit", badge: "brown" },
  AT_RETAILER: { label: "At Retailer", badge: "green" },
};

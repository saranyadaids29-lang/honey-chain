import { metaFor } from "../eventMeta.js";

function summarize(event) {
  const { type, payload, actor } = event.data;
  switch (type) {
    case "GENESIS":
      return "The traceability ledger was created.";
    case "BATCH_CREATED":
      return `${payload.quantityKg} kg collected by ${payload.beekeeperName} in ${payload.village || payload.district || payload.state || "an unspecified location"}.`;
    case "QUALITY_TEST":
      return `${payload.labName} tested this batch — result: ${payload.result}${payload.purityPercent ? `, purity ${payload.purityPercent}%` : ""}${payload.moisturePercent ? `, moisture ${payload.moisturePercent}%` : ""}.`;
    case "PACKAGING":
      return `Packaged${payload.packagedBy ? ` by ${payload.packagedBy}` : ""}${payload.unitsProduced ? ` into ${payload.unitsProduced} units` : ""} on ${payload.packagingDate}.`;
    case "DISTRIBUTION":
      return `Transported${payload.transporterName ? ` by ${payload.transporterName}` : ""} from ${payload.fromLocation || "origin"} to ${payload.toLocation || "destination"}.`;
    case "RETAIL":
      return `Received by ${payload.shopName || "retailer"} in ${payload.location || "an unspecified location"}.`;
    default:
      return actor || "";
  }
}

export default function EventTimeline({ events }) {
  return (
    <div className="timeline">
      {events.map((event) => {
        const meta = metaFor(event.data.type);
        return (
          <div className="timeline-item" key={event.hash}>
            <div className="timeline-node" title={meta.label}>
              {meta.icon}
            </div>
            <div className="timeline-body">
              <h4>{meta.label}</h4>
              <div className="timeline-meta">
                {new Date(event.timestamp).toLocaleString()} · Block #{event.index}
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "0.88rem" }}>{summarize(event)}</p>
              <div className="timeline-hash">hash: {event.hash.slice(0, 24)}…</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StatusBadge({ status, meta }) {
  const color = meta?.badge || "brown";
  const label = meta?.label || status;
  return <span className={`badge ${color}`}>{label}</span>;
}

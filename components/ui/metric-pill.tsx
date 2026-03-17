type MetricPillProps = {
  label: string;
  value: string;
};

export function MetricPill({ label, value }: MetricPillProps) {
  return (
    <div className="glass-card flex items-center justify-between rounded-2xl px-4 py-3 shadow-soft">
      <span className="text-sm text-ink/60">{label}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function ProgressBar({ value = 0, max = 100 }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="rounded-full bg-slate-200 h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 transition-width duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

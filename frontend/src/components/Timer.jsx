import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const pad = (value) => String(value).padStart(2, "0");

export default function Timer({ seconds = 60, onExpire, pause }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (pause) return;
    if (remaining <= 0) {
      onExpire?.();
      return;
    }

    const timer = window.setTimeout(() => setRemaining((prev) => Math.max(prev - 1, 0)), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, pause, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const color = useMemo(() => {
    if (remaining <= 10) return "text-rose-500";
    if (remaining <= 20) return "text-amber-500";
    return "text-emerald-500";
  }, [remaining]);

  return (
    <div className="flex items-center gap-2">
      <div className={clsx("rounded-full px-3 py-1 text-sm font-semibold shadow-soft", color, "bg-white/70")}>{`${pad(minutes)}:${pad(secs)}`}</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-teal-500 transition-all"
          style={{ width: `${(remaining / seconds) * 100}%` }}
        />
      </div>
    </div>
  );
}

import clsx from "clsx";

export default function QuestionNav({ total, current, answeredMap, onSelect }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
      {Array.from({ length: total }).map((_, index) => {
        const number = index + 1;
        const answered = Boolean(answeredMap[number]);
        const isActive = current === index;
        return (
          <button
            key={number}
            type="button"
            onClick={() => onSelect(index)}
            className={clsx(
              "h-9 w-full rounded-lg border text-sm font-medium transition",
              isActive
                ? "border-blue-400 bg-blue-700 text-white"
                : answered
                ? "border-slate-600 bg-slate-900 text-slate-200"
                : "border-rose-600 bg-rose-900 text-rose-200"
            )}
          >
            {number}
          </button>
        );
      })}
    </div>
  );
}

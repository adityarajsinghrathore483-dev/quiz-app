import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { clearQuizState, getStoredUser } from "../services/auth";

const performanceMessage = (percentage) => {
  if (percentage >= 90) return "Excellent! You are on top of current affairs.";
  if (percentage >= 70) return "Great work! Keep staying updated.";
  if (percentage >= 50) return "Good effort. Review trending news and try again.";
  return "Keep learning — you can improve with daily headlines.";
};

export default function Result() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const stored = getStoredUser();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = userId || stored?.id || stored?._id;
    if (!id) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await api.get(`/results/${id}`);
        setStats(response.data.user);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId, navigate, stored]);

  const handleRestart = () => {
    clearQuizState();
    navigate("/quiz", { replace: true });
  };

  const score = typeof stats?.score === "number" ? stats.score : 0;
  const attempted = typeof stats?.questionsAttempted === "number" ? stats.questionsAttempted : 0;
  const total = typeof stats?.totalQuestions === "number" ? stats.totalQuestions : 0;
  const incorrect = attempted - score;
  const notAnswered = total - attempted;
  const percentage = useMemo(() => {
    if (attempted <= 0) return 0;
    return Math.round((score / attempted) * 100);
  }, [score, attempted]);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-3xl bg-white/90 p-10 shadow-soft">
        <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-3xl bg-white/90 p-10 shadow-soft">
        <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-600">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white/90 p-10 shadow-soft">
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Your Results</h1>
        <p className="mt-2 text-sm text-slate-600">Great job, {stats?.name || "Quizzer"}! Here's your performance summary.</p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Score</h2>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold text-brand-600">
              {score !== null ? score : "—"}
            </span>
            <span className="text-sm text-slate-500">/ {attempted ?? "—"}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-slate-600">
            {percentage !== null ? performanceMessage(percentage) : "Score not available yet."}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Summary</h2>
          <dl className="mt-4 grid gap-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>Correct</dt>
              <dd className="font-semibold text-emerald-600">{score !== null ? score : "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Incorrect</dt>
              <dd className="font-semibold text-rose-600">
                {attempted !== null ? incorrect : "—"}
              </dd>
            </div>
            {notAnswered > 0 && (
              <div className="flex items-center justify-between">
                <dt>Not Answered</dt>
                <dd className="font-semibold text-orange-600">{notAnswered}</dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt>Percentage</dt>
              <dd className="font-semibold text-brand-600">
                {percentage !== null ? `${percentage}%` : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Taken</dt>
              <dd className="font-semibold text-slate-500">
                {stats?.completedAt ? new Date(stats.completedAt).toLocaleString() : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={handleRestart}
          className="w-full rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 sm:w-auto"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

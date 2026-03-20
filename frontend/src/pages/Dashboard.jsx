import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const startQuiz = () => {
    navigate("/exams");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 dark:bg-slate-950 p-4">      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-bold text-4xl shadow-lg mb-4">
            📚
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Quiz App</h1>
          <p className="text-teal-200 text-lg">Welcome back, <span className="font-semibold">{user?.name || "Quizzer"}!</span></p>
        </div>

        {/* Main CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Feature Card 1 */}
          <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl border border-white/20 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Multiple Exams</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Prepare for NET, SET, NIMCET, Assistant Professor, MPPSC and more with our comprehensive exam preparation platform.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                  <li>✓ 5 Different Subjects per Exam</li>
                  <li>✓ 20 Questions per Subject</li>
                  <li>✓ 1 Minute per Question</li>
                  <li>✓ Instant Performance Analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl border border-white/20 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚡</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Smart Learning</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Get detailed performance metrics and insights to identify your weaknesses and improve faster.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                  <li>✓ Real-time Score Display</li>
                  <li>✓ Subject-wise Performance</li>
                  <li>✓ Time Management Tips</li>
                  <li>✓ Progress Tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg text-white text-center">
            <p className="text-3xl font-bold">500+</p>
            <p className="text-blue-100">Total Questions</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg text-white text-center">
            <p className="text-3xl font-bold">6</p>
            <p className="text-purple-100">Exam Types</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg text-white text-center">
            <p className="text-3xl font-bold">5</p>
            <p className="text-emerald-100">Subjects</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-8">
          <button
            onClick={startQuiz}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transform transition hover:scale-105"
          >
            <span>🚀</span> Start Your Quiz Journey
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-teal-200 text-sm">
            💡 Tip: Each exam has 5 subjects with 20 questions each. 1 minute per question. Good luck!
          </p>
        </div>
      </div>
    </div>
  );
}

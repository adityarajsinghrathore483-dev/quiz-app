import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../services/auth";

export default function ExamSelection() {
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const exams = [
    {
      id: "NET",
      name: "NET",
      description: "National Eligibility Test for Assistant Professor",
      icon: "🎓",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "SET",
      name: "SET",
      description: "State Eligibility Test",
      icon: "📚",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "NIMCET",
      name: "NIMCET",
      description: "NIT MCA Common Entrance Test",
      icon: "💻",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "ASSISTANT_PROFESSOR",
      name: "Assistant Professor",
      description: "University Teaching Position",
      icon: "👨‍🏫",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "MPPSC",
      name: "MPPSC",
      description: "Madhya Pradesh Public Service Commission",
      icon: "🏛️",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "OTHER",
      name: "Other Exams",
      description: "General Knowledge & Aptitude",
      icon: "🎯",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleSelectExam = (examId) => {
    navigate("/subjects", { state: { exam: examId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 dark:bg-slate-950 p-4">      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-bold text-2xl shadow-lg mb-4">
            📚
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Select Your Exam</h1>
          <p className="text-teal-200">Choose the exam you want to prepare for</p>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => handleSelectExam(exam.id)}
              className="group relative rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg hover:shadow-2xl transform transition hover:scale-105 border border-white/20 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${exam.color} opacity-0 group-hover:opacity-5 transition`}></div>

              {/* Content */}
              <div className="relative z-10 text-left">
                <div className="text-4xl mb-3">{exam.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition">
                  {exam.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{exam.description}</p>
                <div className="flex items-center text-teal-600 font-semibold text-sm group-hover:translate-x-2 transition">
                  Select Exam →
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-teal-300 hover:text-teal-200 text-sm font-semibold transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

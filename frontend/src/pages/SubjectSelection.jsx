import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../services/auth";

export default function SubjectSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const selectedExam = location.state?.exam;

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
    if (!selectedExam) {
      navigate("/exams", { replace: true });
    }
  }, [user, selectedExam, navigate]);

  const subjects = [
    {
      id: "maths",
      name: "Mathematics",
      description: "20 Questions • 20 Minutes",
      icon: "🔢",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "reasoning",
      name: "Reasoning",
      description: "20 Questions • 20 Minutes",
      icon: "🧠",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "computer",
      name: "Computer Science",
      description: "20 Questions • 20 Minutes",
      icon: "💻",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "english",
      name: "English",
      description: "20 Questions • 20 Minutes",
      icon: "📖",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "aptitude",
      name: "Aptitude",
      description: "20 Questions • 20 Minutes",
      icon: "📊",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const handleSelectSubject = (subjectId) => {
    navigate("/quiz", {
      state: {
        exam: selectedExam,
        subject: subjectId,
      },
    });
  };

  const getExamName = () => {
    const examMap = {
      NET: "National Eligibility Test",
      SET: "State Eligibility Test",
      NIMCET: "NIT MCA Entrance Test",
      ASSISTANT_PROFESSOR: "Assistant Professor",
      MPPSC: "MPPSC Exam",
      OTHER: "General Knowledge",
    };
    return examMap[selectedExam] || selectedExam;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 dark:bg-slate-950 p-4">      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <button
            onClick={() => navigate("/exams")}
            className="text-teal-300 hover:text-teal-200 text-sm font-semibold transition mb-4 inline-flex items-center gap-2"
          >
            ← Change Exam
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-bold text-2xl shadow-lg mb-4">
            📚
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Select Subject</h1>
          <p className="text-teal-200">Preparing for <span className="font-semibold">{getExamName()}</span></p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSelectSubject(subject.id)}
              className="group relative rounded-xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg hover:shadow-2xl transform transition hover:scale-105 border border-white/20 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-10 transition`}></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-3">{subject.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition">
                  {subject.name}
                </h3>
                <p className="text-xs text-slate-600">{subject.description}</p>
                <div className="mt-4 inline-flex items-center justify-center w-full px-3 py-2 rounded-lg bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 font-semibold text-xs group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-emerald-500 group-hover:text-white transition">
                  Start Quiz
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8">
          <div className="grid grid-cols-3 gap-8 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400">100</p>
              <p className="text-xs text-teal-200">Total Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">100</p>
              <p className="text-xs text-emerald-200">Total Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">5</p>
              <p className="text-xs text-cyan-200">Subjects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

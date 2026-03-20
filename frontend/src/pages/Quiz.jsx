import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { clearQuizState, getStoredQuizState, getStoredUser, storeQuizState } from "../services/auth";
import Modal from "../components/Modal";
import ProgressBar from "../components/ProgressBar";
import QuestionNav from "../components/QuestionNav";
import Timer from "../components/Timer";

const TOTAL_QUESTIONS = 20;
const SECONDS_PER_QUESTION = 60;

const sanitizeQuestions = (questions) => {
  return (questions || []).map((q) => ({
    _id: q?._id,
    question: q?.question,
    optionA: q?.optionA,
    optionB: q?.optionB,
    optionC: q?.optionC,
    optionD: q?.optionD,
  }));
};

const buildInitialState = (questions) => {
  const answers = {};
  sanitizeQuestions(questions).forEach((q) => {
    if (q?._id) answers[q._id.toString()] = null;
  });
  return {
    currentIndex: 0,
    answers,
    questions: sanitizeQuestions(questions),
  };
};

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = getStoredUser();
  const savedState = getStoredQuizState();
  const selectedExam = location.state?.exam;
  const selectedSubject = location.state?.subject;
  const initialQuestions = sanitizeQuestions(savedState?.questions || []);
  const [questions, setQuestions] = useState(initialQuestions);
  const [totalQuestions, setTotalQuestions] = useState(TOTAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(savedState?.currentIndex || 0);
  const [answers, setAnswers] = useState(savedState?.answers || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const autoSubmitTimerRef = useRef(null);

  const question = questions[currentIndex];
  const answeredMap = useMemo(() => {
    return questions.reduce((acc, q, idx) => {
      const key = q?._id?.toString();
      if (key && answers[key]) {
        acc[idx + 1] = true;
      }
      return acc;
    }, {});
  }, [answers, questions]);

  const saveState = useCallback(
    (partial) => {
      const next = {
        questions: sanitizeQuestions(questions),
        currentIndex,
        answers,
        ...partial,
      };
      storeQuizState(next);
    },
    [questions, currentIndex, answers]
  );

  const fetchQuestions = useCallback(async () => {
    if (!selectedExam || !selectedSubject) {
      navigate("/subjects", { replace: true });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.get("/questions", {
        params: { exam: selectedExam, subject: selectedSubject },
      });
      const list = response.data?.questions ?? [];
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error("No questions available for this subject.");
      }
      const count = Math.min(TOTAL_QUESTIONS, list.length);
      setTotalQuestions(count);
      const sanitized = sanitizeQuestions(list.slice(0, count));
      setQuestions(sanitized);
      setCurrentIndex((prev) => Math.min(prev, count - 1));

      // Clear old answers and initialize NEW answers for loaded questions only
      const newAnswers = {};
      list.slice(0, count).forEach((q) => {
        const id = q?._id?.toString();
        if (id) {
          newAnswers[id] = null;
        }
      });
      setAnswers(newAnswers);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to load questions.");
    } finally {
      setLoading(false);
    }
  }, [selectedExam, selectedSubject, navigate]);

  useEffect(() => {
    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (!selectedExam || !selectedSubject) {
      navigate("/subjects", { replace: true });
      return;
    }

    if (!questions.length) {
      fetchQuestions();
    }

    return () => {
      if (autoSubmitTimerRef.current) {
        window.clearTimeout(autoSubmitTimerRef.current);
      }
    };
  }, [storedUser, selectedExam, selectedSubject, navigate, questions.length, fetchQuestions]);

  useEffect(() => {
    // Ensure currentIndex is within the loaded questions range (in case questions length changes).
    if (questions.length > 0 && currentIndex >= questions.length) {
      setCurrentIndex(Math.max(0, questions.length - 1));
    }

    // Migrate legacy stored answers (number-based index keys) into question-id keys.
    const hasNumericKeys = Object.keys(answers).some((k) => /^\d+$/.test(k));
    if (questions.length > 0 && hasNumericKeys) {
      setAnswers((prev) => {
        const next = { ...prev };
        questions.forEach((q, idx) => {
          const id = q?._id?.toString();
          if (!id) return;
          if (next[idx] !== undefined && next[id] === undefined) {
            next[id] = next[idx];
          }
        });
        // Remove numeric keys after migrating
        Object.keys(next)
          .filter((k) => /^\d+$/.test(k))
          .forEach((k) => delete next[k]);
        return next;
      });
    }
  }, [questions.length, currentIndex, answers]);

  useEffect(() => {
    saveState({});
  }, [answers, currentIndex, questions, saveState]);

  const selectOption = (option) => {
    const questionId = question?._id?.toString();
    if (!questionId) return;

    const nextAnswers = { ...answers, [questionId]: option };
    setAnswers(nextAnswers);

    if (autoSubmitTimerRef.current) {
      window.clearTimeout(autoSubmitTimerRef.current);
    }

    if (currentIndex >= totalQuestions - 1) {
      autoSubmitTimerRef.current = window.setTimeout(() => {
        submitAnswers(nextAnswers);
      }, 800);
    }
  };

  const goToIndex = (index) => {
    const bounded = Math.max(0, Math.min(totalQuestions - 1, index));
    setCurrentIndex(bounded);
  };

  const handleNext = () => {
    if (currentIndex >= totalQuestions - 1) {
      setConfirmOpen(true);
      return;
    }
    goToIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    goToIndex(currentIndex - 1);
  };

  const handleTimerExpire = () => {
    if (finished || submitting) return;

    if (currentIndex >= totalQuestions - 1) {
      submitAnswers();
    } else {
      goToIndex(currentIndex + 1);
    }
  };

  const submitAnswers = async (stateAnswers = answers) => {
    if (!storedUser) return;

    setSubmitting(true);
    try {
      // Filter to only include answers for questions that are actually loaded
      const validQuestionIds = new Set(questions.map(q => q?._id?.toString()).filter(Boolean));
      const payloadAnswers = Object.fromEntries(
        Object.entries(stateAnswers)
          .filter(([key, v]) => v && validQuestionIds.has(key))
      );

      const response = await api.post("/submit", {
        userId: storedUser.id || storedUser._id,
        answers: payloadAnswers,
        exam: selectedExam,
        subject: selectedSubject,
      });
      clearQuizState();
      setFinished(true);
      const userId = response.data.user?.id || storedUser.id;
      navigate(`/result/${userId}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unknown error while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = useMemo(() => {
    const validQuestionIds = new Set(questions.map(q => q?._id?.toString()).filter(Boolean));
    return Object.entries(answers)
      .filter(([key, value]) => value && validQuestionIds.has(key))
      .length;
  }, [answers, questions]);

  const getSubjectName = () => {
    const subjectMap = {
      maths: "Mathematics",
      reasoning: "Reasoning",
      computer: "Computer Science",
      english: "English",
      aptitude: "Aptitude",
    };
    return subjectMap[selectedSubject] || selectedSubject;
  };

  const getExamName = () => {
    const examMap = {
      NET: "NET",
      SET: "SET",
      NIMCET: "NIMCET",
      ASSISTANT_PROFESSOR: "Assistant Professor",
      MPPSC: "MPPSC",
      OTHER: "General Knowledge",
    };
    return examMap[selectedExam] || selectedExam;
  };

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 rounded-3xl bg-white/90 p-10 shadow-soft dark:bg-slate-900/80">
        <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white/90 p-10 shadow-soft dark:bg-slate-900/80">
        <h1 className="text-xl font-semibold text-slate-900">Could not load the quiz</h1>
        <p className="mt-3 text-sm text-slate-600">{error}</p>
        <button
          onClick={fetchQuestions}
          className="mt-6 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl bg-gradient-to-b from-slate-50 to-white p-6 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate("/subjects")}
              className="text-teal-600 hover:text-teal-700 text-sm font-semibold"
            >
              ← Change Subject
            </button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {getExamName()} - {getSubjectName()}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Question {currentIndex + 1} of {totalQuestions}</p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-600 mb-1">Progress</p>
            <p className="font-semibold text-teal-700">{completedCount}/{totalQuestions} Answered</p>
          </div>
          <Timer
            key={currentIndex}
            seconds={SECONDS_PER_QUESTION}
            onExpire={handleTimerExpire}
            pause={finished || submitting}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <ProgressBar value={completedCount} max={totalQuestions} />
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Question Section */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold mb-3">
              Question {currentIndex + 1}
            </div>
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {question.question}
            </div>
          </div>

          <div className="grid gap-3 mt-6">
            {(["A", "B", "C", "D"]).map((opt) => {
              const optionValue = question[`option${opt}`];
              const questionId = question?._id?.toString();
              const isSelected = questionId ? answers[questionId] === opt : false;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectOption(opt)}
                  className={`w-full rounded-lg border-2 px-4 py-4 text-left text-sm font-medium transition ${
                    isSelected
                      ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-900/20 dark:text-teal-200"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold text-xs mr-3" style={{
                    borderColor: isSelected ? '#14b8a6' : '#cbd5e1',
                    backgroundColor: isSelected ? '#f0fdfa' : 'white',
                    color: isSelected ? '#14b8a6' : '#64748b',
                  }}>
                    {opt}
                  </span>
                  <span>{optionValue}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm transition hover:bg-teal-100"
              >
                Next →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              ✓ Submit
            </button>
          </div>
        </div>

        {/* Sidebar - Question Navigator */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Quick Navigation</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">Tap to jump to any question</p>
          <div className="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg dark:from-slate-900 dark:to-slate-900">
            <QuestionNav total={totalQuestions} current={currentIndex} answeredMap={answeredMap} onSelect={goToIndex} />
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-800 mb-3">Legend</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300 dark:bg-slate-700 dark:border-slate-600"></div>
                <span className="text-slate-600 dark:text-slate-400">Not answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-teal-500 border border-teal-600"></div>
                <span className="text-slate-600 dark:text-slate-400">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-teal-500 bg-white dark:bg-slate-900"></div>
                <span className="text-slate-600 dark:text-slate-400">Current</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Submit Quiz?"
        description={`You have answered ${completedCount} out of ${totalQuestions} questions. Are you sure you want to submit?`}
      >
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => setConfirmOpen(false)}
          >
            Continue Quiz
          </button>
          <button
            onClick={() => submitAnswers()}
            disabled={submitting}
            className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

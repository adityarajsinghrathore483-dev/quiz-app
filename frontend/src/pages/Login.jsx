import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getStoredUser, storeUser } from "../services/auth";
import { isValidEmail, isValidMobile, isValidName } from "../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const stored = getStoredUser();

  useEffect(() => {
    if (stored) {
      navigate("/dashboard", { replace: true });
    }
  }, [stored, navigate]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidForm = useMemo(() => {
    return isValidName(name) && isValidEmail(email) && isValidMobile(mobile);
  }, [name, email, mobile]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!isValidForm) {
      setError("Please enter a valid name, email, and mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", { name, email, mobile });
      const user = response.data?.user;
      if (!user) {
        throw new Error("Unable to login. Please try again.");
      }
      storeUser(user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 dark:bg-slate-950 p-4">      <div className="mx-auto w-full max-w-md">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-10 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-5 blur-3xl"></div>

        {/* Main Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-8 shadow-2xl backdrop-blur border border-white/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:border-slate-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-bold text-2xl shadow-lg mb-4">
              📚
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Quiz App
            </h1>
            <p className="text-slate-600 text-sm">Master exams with confidence</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500">👤</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500">✉️</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  placeholder="john@example.com"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Mobile Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500">📱</span>
                <input
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  placeholder="+91 98765 43210"
                  required
                  type="tel"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border-l-4 border-red-500 px-4 py-3 text-sm text-red-700">
                <p className="font-semibold">❌ Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !isValidForm}
              className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transform transition hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Signing in..." : "Continue to Quiz"}
            </button>

            {/* Features Info */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center mb-3 font-semibold">WHY CHOOSE US?</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <p className="text-lg mb-1">📝</p>
                  <p className="text-slate-600">20 Questions</p>
                </div>
                <div>
                  <p className="text-lg mb-1">⏱️</p>
                  <p className="text-slate-600">1 Min/Ques</p>
                </div>
                <div>
                  <p className="text-lg mb-1">🎯</p>
                  <p className="text-slate-600">5 Subjects</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

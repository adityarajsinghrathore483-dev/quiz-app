import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStoredUser, clearUser, clearQuizState } from "../services/auth";

export default function Layout({ children }) {
  const location = useLocation();
  const user = getStoredUser();
  const hideHeader = location.pathname === "/" || location.pathname === "/login";

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleSignOut = () => {
    clearUser();
    clearQuizState();
    window.location.href = "/login";
  };

  const containerClasses = useMemo(() => {
    return isDark
      ? "min-h-screen bg-slate-950 text-slate-100"
      : "min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900";
  }, [isDark]);

  return (
    <div className={containerClasses}>
      {!hideHeader && (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-brand-700 dark:text-brand-200">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-600 to-teal-500 text-white shadow-soft">
                Q
              </span>
              Quiz App
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {isDark ? "🌙" : "☀️"}
              </button>
              {user && (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <div className="font-medium text-slate-800 dark:text-slate-100">{user.name}</div>
                  <div className="text-xs">{user.email}</div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10">{children}</main>
      <footer className="border-t border-slate-200 bg-white/80 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
        Built with React, Tailwind, Node, Express, and MongoDB — Designed for a modern quiz experience.
      </footer>
    </div>
  );
}

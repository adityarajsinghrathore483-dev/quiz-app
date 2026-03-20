const USER_KEY = "quizAppUser";
const QUIZ_STATE_KEY = "quizAppState";

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    if (!user) return null;

    const normalized = {
      ...user,
      id: user.id || user._id || null,
    };

    // Keep stored user normalized so future loads are consistent.
    if (!user.id && normalized.id) {
      localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch (e) {
    console.warn("Failed to parse stored user", e);
    return null;
  }
};

export const storeUser = (user) => {
  if (!user) return;
  const normalized = {
    ...user,
    id: user.id || user._id || null,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getStoredQuizState = () => {
  try {
    const raw = localStorage.getItem(QUIZ_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const storeQuizState = (state) => {
  if (!state) return;

  try {
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
  } catch (err) {
    // If localStorage fails (e.g., circular values), we clear the stored state to prevent
    // repeated failures and keep the app usable.
    console.warn("Failed to store quiz state", err);
    try {
      localStorage.removeItem(QUIZ_STATE_KEY);
    } catch (ignore) {
      // ignore
    }
  }
};

export const clearQuizState = () => {
  localStorage.removeItem(QUIZ_STATE_KEY);
};

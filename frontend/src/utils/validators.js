export const isValidName = (value) => typeof value === "string" && value.trim().length >= 2;
export const isValidEmail = (value) => {
  if (!value || typeof value !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value.trim());
};
export const isValidMobile = (value) => {
  if (!value || typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

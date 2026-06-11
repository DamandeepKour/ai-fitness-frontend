import { isValidPhoneNumber } from "react-phone-number-input";

export function validateEmail(value) {
  const email = String(value || "").trim();
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Not a valid email address";
  }
  return "";
}

export function validatePassword(value, { minLength = 8 } = {}) {
  if (!value) return "Password is required";
  if (value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include letters and numbers";
  }
  return "";
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return "";
}

export function validateName(value) {
  const name = String(value || "").trim();
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return "";
}

export function validatePhone(value, { required = false } = {}) {
  if (!value) {
    return required ? "Phone number is required" : "";
  }
  if (!isValidPhoneNumber(value)) {
    return "Not a valid phone number";
  }
  return "";
}

export function createFieldValidator(validators) {
  return {
    errors: {},
    touched: {},

    validateField(field, value, allValues = {}) {
      const fn = validators[field];
      if (!fn) return "";
      return fn(value, allValues);
    },

    validateAll(values) {
      const errors = {};
      let valid = true;
      for (const field of Object.keys(validators)) {
        const message = validators[field](values[field], values);
        errors[field] = message;
        if (message) valid = false;
      }
      return { valid, errors };
    },
  };
}

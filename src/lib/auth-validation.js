import { isValidPhoneNumber } from "react-phone-number-input";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "yopmail.com",
  "throwaway.email",
  "fakeinbox.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "sharklasers.com",
  "grr.la",
  "mailnesia.com",
  "mintemail.com",
  "emailondeck.com",
  "tempail.com",
  "moakt.com",
]);

export function validateEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email) return "Email is required";
  if (email.length > 254) return "Email is too long";
  if (!EMAIL_REGEX.test(email)) {
    return "Not a valid email address";
  }

  const domain = email.split("@")[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return "Temporary or disposable email addresses are not allowed";
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

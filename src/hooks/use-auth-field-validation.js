import { useCallback, useState } from "react";

export function useAuthFieldValidation(validators) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (field, value, allValues = {}) => {
      const fn = validators[field];
      if (!fn) return "";
      const message = fn(value, allValues);
      setErrors((prev) => ({ ...prev, [field]: message }));
      return message;
    },
    [validators],
  );

  const touch = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateAll = useCallback(
    (values) => {
      const nextErrors = {};
      let valid = true;

      for (const field of Object.keys(validators)) {
        const message = validators[field](values[field], values);
        nextErrors[field] = message;
        if (message) valid = false;
      }

      setErrors(nextErrors);
      setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
      return valid;
    },
    [validators],
  );

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const getError = useCallback(
    (field) => (touched[field] ? errors[field] : ""),
    [errors, touched],
  );

  return {
    errors,
    touched,
    touch,
    validateField,
    validateAll,
    clearFieldError,
    getError,
    setErrors,
  };
}

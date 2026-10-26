import { useCallback, useState } from "react";

// localStorage is shared by the popup and the full-tab view (same extension origin).
// Every access is guarded: storage can be disabled, full, or contain stale data.

export const readStorage = <T>(key: string, fallback: T, validate: (v: unknown) => v is T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore: nothing to clean up if storage is unavailable
  }
};

/**
 * useState that is persisted synchronously on every update, so values survive the
 * popup closing abruptly (e.g. right after the EyeDropper returns).
 */
export const usePersistentState = <T>(
  key: string,
  fallback: T,
  validate: (v: unknown) => v is T,
) => {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback, validate));

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
};

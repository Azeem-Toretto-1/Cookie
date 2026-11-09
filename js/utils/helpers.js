/**
 * General Helper Utilities
 */

/**
 * Safely parse a JSON string with fallback
 * @param {string|null} jsonString
 * @param {*} fallback
 * @returns {*}
 */
export const safeJSONParse = (jsonString, fallback = null) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn("JSON parse error:", err);
    return fallback;
  }
};


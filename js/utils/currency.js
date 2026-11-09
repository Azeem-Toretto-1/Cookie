/**
 * Currency Formatting Utility
 * Formats numbers into standardized USD currency strings ($ X.XX)
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  const num = typeof value === "number" && !isNaN(value) ? value : 0;
  return `$ ${num.toFixed(2)}`;
};


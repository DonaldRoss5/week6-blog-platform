/**
 * Formats an ISO timestamp as a readable date, e.g. "October 7, 2026".
 *
 * @param {string} isoString
 */
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export { formatDate };

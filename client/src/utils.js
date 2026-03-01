export const APP_COLORS = [
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ec4899', // Pink
  '#84cc16', // Lime
  '#14b8a6'  // Teal
];

/**
 * Returns a stable color from the palette for a given ID.
 */
export function getAuthorColor(authorId) {
  if (!authorId) return APP_COLORS[0];
  let hash = 0;
  for (let i = 0; i < authorId.length; i++) {
    hash = ((hash << 5) - hash) + authorId.charCodeAt(i);
    hash = hash & hash;
  }
  return APP_COLORS[Math.abs(hash) % APP_COLORS.length];
}

/**
 * Formats a timestamp into a human-readable relative time.
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Safely strips HTML tags from a string.
 */
export function stripHTML(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export const API_ORIGIN =
  process.env.REACT_APP_API_ORIGIN ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : 'http://localhost:5000');

export function resolveImageUrl(src) {
  if (!src) return '/no-image.png';
  const s = String(src).trim();
  if (!s) return '/no-image.png';
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  // uploads are served by backend, not CRA dev server
  if (s.startsWith('/uploads/')) return `${API_ORIGIN}${s}`;
  return s;
}



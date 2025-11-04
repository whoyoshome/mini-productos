export function normalizeUrl(u: string) {
  if (!u) return "";
  const t = u.trim();
  if (/^(data|blob):/i.test(t)) return t;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export function shouldProxy(u: string) {
  if (!u) return false;
  const t = u.trim();
  if (/^(data|blob):/i.test(t)) return false;
  return /^https?:\/\//i.test(t);
}

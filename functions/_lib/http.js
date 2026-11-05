// 带超时的上游请求封装

export const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export function fetchWithTimeout(url, opts = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...opts,
    signal: controller.signal,
    headers: { 'User-Agent': BROWSER_UA, ...(opts.headers || {}) }
  }).finally(() => clearTimeout(timer));
}

export async function fetchText(url, opts, timeoutMs) {
  const resp = await fetchWithTimeout(url, opts, timeoutMs);
  if (!resp.ok) {
    try { await resp.body?.cancel(); } catch (e) { /* ignore */ }
    throw new Error('HTTP ' + resp.status);
  }
  return resp.text();
}

export async function fetchJSON(url, opts, timeoutMs) {
  return JSON.parse(await fetchText(url, opts, timeoutMs));
}

// 盘搜 pansearch.me：Next.js 数据接口，需先取动态 buildId
// 移植自 fish2018/pansou（MIT）plugin/pansearch

import { fetchJSON, fetchText } from '../http.js';
import { getLinkType, extractPassword, toISO, htmlToText, ZERO_TIME } from '../regex.js';

let buildIdCache = { id: '', at: 0 };
const BUILD_ID_TTL = 30 * 60 * 1000;

async function getBuildId(timeoutMs) {
  if (buildIdCache.id && Date.now() - buildIdCache.at < BUILD_ID_TTL) return buildIdCache.id;
  const html = await fetchText('https://www.pansearch.me/search', {
    headers: { Accept: 'text/html,application/xhtml+xml', Referer: 'https://www.pansearch.me/' }
  }, timeoutMs);
  let m = html.match(/"buildId":"([^"]+)"/);
  if (!m) {
    const n = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (n) {
      try { m = [null, JSON.parse(n[1]).buildId]; } catch (e) { /* ignore */ }
    }
  }
  if (!m || !m[1]) throw new Error('无法获取 pansearch buildId');
  buildIdCache = { id: m[1], at: Date.now() };
  return m[1];
}

function normalizePan(item, kw) {
  const pan = String(item.pan || '').toLowerCase();
  if (['ali', 'alipan', 'aliyun', 'aliyundrive'].includes(pan)) return 'aliyun';
  if (['quark', 'uc', 'baidu', 'xunlei', 'tianyi', '115', '123', 'mobile', 'pikpak'].includes(pan)) return pan;
  return '';
}

export async function search(kw, { timeoutMs }) {
  const buildId = await getBuildId(timeoutMs);

  // 最多取前 2 页（每页 10 条），控制子请求数
  const pages = await Promise.allSettled([0, 10].map(offset =>
    fetchJSON(
      `https://www.pansearch.me/_next/data/${buildId}/search.json?keyword=${encodeURIComponent(kw)}&offset=${offset}`,
      { headers: { Accept: 'application/json', Referer: 'https://www.pansearch.me/', 'Cache-Control': 'no-cache', Pragma: 'no-cache' } },
      timeoutMs
    )
  ));

  const seen = new Set();
  const out = [];
  for (const p of pages) {
    if (p.status !== 'fulfilled') continue;
    const items = p.value?.pageProps?.data?.data;
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);

      const content = String(item.content || '');
      // 取第一个指向网盘的链接；类型优先用 pan 字段，否则按域名推断
      let url = '', type = '';
      for (const m of content.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
        const u = m[1].replace(/&amp;/g, '&').replace(/#+$/, '');
        const t = normalizePan(item, kw) || getLinkType(u);
        if (t && t !== 'others') { url = u; type = t; break; }
      }
      if (!url) continue;

      const text = htmlToText(content);
      const nameMatch = text.match(/名称[：:]\s*([^\n]+)/);
      let datetime = '';
      const t = Date.parse(String(item.time || ''));
      if (!Number.isNaN(t)) datetime = new Date(t).toISOString();
      else datetime = toISO(item.time);

      out.push({
        id: 'pansearch-' + item.id,
        title: nameMatch ? nameMatch[1].trim() : kw,
        datetime: datetime || ZERO_TIME,
        links: [{ type, url, password: extractPassword(url, text) }]
      });
    }
  }
  return out;
}

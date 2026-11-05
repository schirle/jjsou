// 混合盘系：同构端点并行 POST JSON（2026-10 实测仅 qkpanso 可用，其余保留观察）
// 移植自 fish2018/pansou（MIT）plugin/hunhepan

import { fetchJSON } from '../http.js';
import { ZERO_TIME } from '../regex.js';

// [接口, Referer, Origin?]（2026-10 实测仅 qkpanso 可用）
const ENDPOINTS = [
  ['https://qkpanso.com/v1/search/disk', 'https://qkpanso.com/search', '']
];

const TYPE_MAP = {
  BDY: 'baidu', ALY: 'aliyun', QUARK: 'quark', TIANYI: 'tianyi', UC: 'uc',
  CAIYUN: 'mobile', '115': '115', XUNLEI: 'xunlei', '123PAN': '123', PIKPAK: 'pikpak'
};

async function fetchPage(url, referer, origin, kw, page, timeoutMs) {
  const headers = { 'Content-Type': 'application/json', Referer: referer };
  if (origin) headers.Origin = origin;
  const body = {
    page, q: kw, user: '', exact: false, format: [], share_time: '', size: 30,
    type: '', exclude_user: [], adv_params: { wechat_pwd: '', platform: 'pc' }
  };
  const res = await fetchJSON(url, { method: 'POST', headers, body: JSON.stringify(body) }, timeoutMs);
  if (res.code !== 200 || !Array.isArray(res.data?.list)) return [];

  return res.data.list.map(it => ({
    id: 'hunhepan-' + it.disk_id,
    title: String(it.disk_name || '').replace(/<\/?(em|b|strong|i)>/g, ''),
    datetime: String(it.shared_time || '').replace(' ', 'T') + (it.shared_time ? 'Z' : ''),
    links: it.link ? [{
      type: TYPE_MAP[String(it.disk_type || '').toUpperCase()] || 'others',
      url: String(it.link),
      password: String(it.disk_pass || '')
    }] : []
  })).filter(r => r.links.length);
}

export async function search(kw, { timeoutMs }) {
  const jobs = [];
  for (const [url, referer, origin] of ENDPOINTS) {
    for (const page of [1, 2]) jobs.push(fetchPage(url, referer, origin, kw, page, timeoutMs));
  }
  const settled = await Promise.allSettled(jobs);

  const seen = new Set();
  const out = [];
  for (const s of settled) {
    if (s.status !== 'fulfilled' || !Array.isArray(s.value)) continue;
    for (const r of s.value) {
      const key = r.links[0].url;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(r);
    }
  }
  return out.map(r => ({ ...r, datetime: r.datetime || ZERO_TIME }));
}

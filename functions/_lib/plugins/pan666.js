// pan666（Flarum 论坛 JSON:API）
// 移植自 fish2018/pansou（MIT）plugin/pan666

import { fetchJSON } from '../http.js';
import { PAN_LINK_RE, getLinkType, extractPassword, htmlToText, ZERO_TIME } from '../regex.js';

const UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
];

function randomIp() {
  return `${1 + Math.floor(Math.random() * 223)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${1 + Math.floor(Math.random() * 254)}`;
}

async function fetchPage(kw, offset, timeoutMs) {
  const url = `https://pan666.net/api/discussions?filter[q]=${encodeURIComponent(kw)}&include=mostRelevantPost&page[offset]=${offset}&page[limit]=50`;
  const res = await fetchJSON(url, {
    headers: {
      'User-Agent': UAS[Math.floor(Math.random() * UAS.length)],
      'X-Forwarded-For': randomIp(),
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    }
  }, timeoutMs);

  // included[] 里按 id 找正文 contentHtml
  const posts = new Map();
  for (const inc of res.included || []) {
    if (inc.type === 'posts' && inc.attributes?.contentHtml) posts.set(String(inc.id), inc.attributes.contentHtml);
  }

  const out = [];
  for (const d of res.data || []) {
    const postId = d.relationships?.mostRelevantPost?.data?.id;
    const contentHtml = posts.get(String(postId));
    if (!contentHtml) continue;

    const text = htmlToText(contentHtml);
    const urls = [...new Set([...text.matchAll(PAN_LINK_RE)].map(m => m[0]))];
    if (!urls.length) continue;

    const links = [];
    for (const url of urls) {
      const type = getLinkType(url);
      if (type === 'others') continue;
      links.push({ type, url, password: extractPassword(url, text) });
    }
    if (!links.length) continue;

    let datetime = ZERO_TIME;
    const t = Date.parse(d.attributes?.createdAt || '');
    if (!Number.isNaN(t)) datetime = new Date(t).toISOString();

    out.push({ id: 'pan666-' + d.id, title: String(d.attributes?.title || ''), datetime, links });
  }
  return out;
}

export async function search(kw, { timeoutMs }) {
  const settled = await Promise.allSettled([0, 50].map(o => fetchPage(kw, o, timeoutMs)));
  const seen = new Set();
  const out = [];
  for (const s of settled) {
    if (s.status !== 'fulfilled' || !Array.isArray(s.value)) continue;
    for (const r of s.value) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      out.push(r);
    }
  }
  return out;
}

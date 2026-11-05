// 即刻盘：单次 POST JSON
// 移植自 fish2018/pansou（MIT）plugin/jikepan

import { fetchJSON } from '../http.js';
import { getLinkType, ZERO_TIME } from '../regex.js';

const SERVICE_MAP = {
  baidu: 'baidu', aliyun: 'aliyun', xunlei: 'xunlei', quark: 'quark',
  '115': '115', '123': '123', pikpak: 'pikpak', ed2k: 'ed2k', magnet: 'magnet',
  '189cloud': 'tianyi', caiyun: 'mobile'
};

export async function search(kw, { timeoutMs }) {
  const res = await fetchJSON('https://api.jikepan.xyz/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', referer: 'https://jikepan.xyz/' },
    body: JSON.stringify({ name: kw, is_all: false })
  }, timeoutMs);
  if (res.msg !== 'success' || !Array.isArray(res.list)) return [];

  const out = [];
  for (const item of res.list) {
    const links = [];
    for (const l of item.links || []) {
      let type = SERVICE_MAP[String(l.service || '').toLowerCase()] || '';
      if (!type) continue; // unknown 跳过
      if (type === 'others' && String(l.link || '').includes('drive.uc.cn')) type = 'uc';
      links.push({ type, url: String(l.link || ''), password: String(l.pwd || '') });
    }
    if (links.length) {
      out.push({ id: 'jikepan-' + (item.id || item.name), title: String(item.name || ''), datetime: ZERO_TIME, links });
    }
  }
  return out;
}

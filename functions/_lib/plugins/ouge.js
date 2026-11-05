// 欧歌影视资源 API（wanou 与其同源，合并为一个插件）
// 移植自 fish2018/pansou（MIT）plugin/ouge、plugin/wanou

import { fetchJSON } from '../http.js';
import { getLinkType, ZERO_TIME } from '../regex.js';

const API_TYPE_MAP = {
  BD: 'baidu', KG: 'quark', UC: 'uc', ALY: 'aliyun', XL: 'xunlei',
  TY: 'tianyi', '115': '115', MB: 'mobile', '123': '123', PK: 'pikpak', PIKPAK: 'pikpak'
};

export async function search(kw, { timeoutMs }) {
  const res = await fetchJSON(
    `https://woog.nxog.eu.org/api.php/provide/vod?ac=detail&wd=${encodeURIComponent(kw)}`,
    { headers: { Accept: 'application/json', Referer: 'https://woog.nxog.eu.org/' } },
    timeoutMs
  );
  if (res.code !== 1 || !Array.isArray(res.list)) return [];

  const out = [];
  for (const vod of res.list) {
    const froms = String(vod.vod_down_from || '').split('$$$');
    const urls = String(vod.vod_down_url || '').split('$$$');
    const links = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      if (!url) continue;
      const type = API_TYPE_MAP[froms[i]] && API_TYPE_MAP[froms[i]] !== 'others'
        ? API_TYPE_MAP[froms[i]]
        : getLinkType(url);
      if (type === 'others') continue;
      const pwd = url.match(/[?&]pwd=([0-9a-zA-Z]+)/);
      links.push({ type, url, password: pwd ? pwd[1] : '' });
    }
    if (!links.length) continue;

    out.push({
      id: 'ouge-' + vod.vod_id,
      title: String(vod.vod_name || ''),
      datetime: toIsoOrZero(vod.vod_time),
      links
    });
  }
  return out;
}

function toIsoOrZero(s) {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : ZERO_TIME;
}

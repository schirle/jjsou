// 趣盘搜：单次 POST JSON
// 移植自 fish2018/pansou（MIT）plugin/qupansou

import { fetchJSON } from '../http.js';
import { getLinkType, toISO, ZERO_TIME } from '../regex.js';

export async function search(kw, { timeoutMs }) {
  const body = {
    style: 'get', datasrc: 'search',
    query: { id: '', datetime: '', courseid: 1, categoryid: '', filetypeid: '', filetype: '', reportid: '', validid: '', searchtext: kw },
    page: { pageSize: 1000, pageIndex: 1 },
    order: { prop: 'sort', order: 'desc' },
    message: '请求资源列表数据'
  };
  const res = await fetchJSON('https://v.funletu.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://pan.funletu.com/' },
    body: JSON.stringify(body)
  }, timeoutMs);
  if (res.status !== 200 || !Array.isArray(res.data)) return [];

  const out = [];
  for (const it of res.data) {
    const url = String(it.url || '');
    const type = getLinkType(url);
    if (type === 'others' || !url) continue;
    out.push({
      id: 'qupansou-' + (it.id || url),
      title: String(it.title || '').replace(/<[^>]+>/g, ''),
      datetime: toISO(it.updatetime) || ZERO_TIME,
      links: [{ type, url, password: '' }]
    });
  }
  return out;
}

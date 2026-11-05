// 由 build.mjs 生成，请勿直接编辑；改动请改 functions/ 下的源码后重新打包

const INDEX_HTML = "<!DOCTYPE html>\r\n<html lang=\"zh-CN\">\r\n<head>\r\n<meta charset=\"UTF-8\">\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n<meta name=\"referrer\" content=\"no-referrer\">\r\n<title>网盘聚合搜索 API</title>\r\n<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>\">\r\n<style>\r\n  :root{\r\n    --bg:#0b0f17; --panel:#121826; --panel-2:#182131; --line:#243044;\r\n    --text:#e6edf7; --muted:#8b9bb4; --accent:#4c8dff; --accent-2:#2ad4a4;\r\n    --warn:#ffb02e; --radius:14px;\r\n  }\r\n  *{box-sizing:border-box}\r\n  html,body{margin:0;padding:0}\r\n  body{\r\n    background:radial-gradient(1200px 600px at 50% -10%,#16233a 0%,var(--bg) 55%) fixed;\r\n    color:var(--text); font:15px/1.6 -apple-system,BlinkMacSystemFont,\"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;\r\n    min-height:100vh; padding:40px 16px 64px;\r\n  }\r\n  .wrap{max-width:880px;margin:0 auto}\r\n  header{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:22px}\r\n  h1{font-size:22px;margin:0;font-weight:650;letter-spacing:.3px}\r\n  .badge{font-size:12px;color:var(--muted);border:1px solid var(--line);background:var(--panel);padding:3px 9px;border-radius:999px}\r\n  .badge b{color:var(--accent-2);font-weight:600}\r\n  .panel{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:18px;box-shadow:0 10px 30px rgba(0,0,0,.28)}\r\n  .searchbar{display:flex;gap:10px}\r\n  input[type=text]{\r\n    flex:1;min-width:0;background:var(--panel-2);border:1px solid var(--line);color:var(--text);\r\n    border-radius:10px;padding:12px 14px;font-size:15px;outline:none;transition:border-color .15s,box-shadow .15s\r\n  }\r\n  input[type=text]:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(76,141,255,.16)}\r\n  button{\r\n    border:0;border-radius:10px;padding:12px 22px;font-size:15px;font-weight:600;cursor:pointer;\r\n    background:linear-gradient(135deg,#4c8dff,#3b6fe0);color:#fff;transition:transform .08s,filter .15s;white-space:nowrap\r\n  }\r\n  button:hover{filter:brightness(1.08)}\r\n  button:active{transform:translateY(1px)}\r\n  button:disabled{opacity:.55;cursor:not-allowed}\r\n  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}\r\n  .chip{\r\n    font-size:13px;color:var(--muted);background:var(--panel-2);border:1px solid var(--line);\r\n    padding:6px 12px;border-radius:999px;cursor:pointer;user-select:none;transition:all .15s\r\n  }\r\n  .chip:hover{color:var(--text);border-color:#33425c}\r\n  .chip.on{color:#fff;background:rgba(76,141,255,.18);border-color:var(--accent)}\r\n  .hint{font-size:12.5px;color:var(--muted);margin-top:12px;word-break:break-all}\r\n  .hint code{background:var(--panel-2);border:1px solid var(--line);padding:1px 6px;border-radius:6px;color:#b9c9e2}\r\n  .status{margin-top:18px;font-size:14px;color:var(--muted);min-height:22px}\r\n  .status.err{color:#ff7a7a}\r\n  .group{margin-top:20px}\r\n  .group-head{display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:14px;color:var(--muted)}\r\n  .group-head .dot{width:7px;height:7px;border-radius:50%;background:var(--accent)}\r\n  .group-head b{color:var(--text);font-weight:600}\r\n  .item{\r\n    display:flex;align-items:center;gap:12px;background:var(--panel-2);border:1px solid var(--line);\r\n    border-radius:11px;padding:11px 13px;margin-bottom:8px;transition:border-color .15s\r\n  }\r\n  .item:hover{border-color:#33425c}\r\n  .item .main{flex:1;min-width:0}\r\n  .item .title{font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\r\n  .item .meta{font-size:12px;color:var(--muted);margin-top:3px;display:flex;gap:10px;flex-wrap:wrap}\r\n  .item .meta a{color:#7aa9ff;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}\r\n  .item a:hover{text-decoration:underline}\r\n  .pwd{font-size:12px;color:#0b0f17;background:var(--warn);border-radius:6px;padding:2px 7px;font-weight:700}\r\n  .copy{\r\n    background:transparent;border:1px solid var(--line);color:var(--muted);font-size:12.5px;font-weight:500;\r\n    padding:7px 13px;border-radius:8px;flex:none\r\n  }\r\n  .copy:hover{color:var(--text);border-color:var(--accent);filter:none}\r\n  .copy.done{color:var(--accent-2);border-color:var(--accent-2)}\r\n  details{margin-top:22px;border-top:1px solid var(--line);padding-top:14px}\r\n  summary{cursor:pointer;font-size:13.5px;color:var(--muted);outline:none}\r\n  summary:hover{color:var(--text)}\r\n  pre{background:#0a0e15;border:1px solid var(--line);border-radius:10px;padding:14px;overflow:auto;font-size:12.5px;line-height:1.55;color:#b9c9e2;max-height:420px}\r\n  footer{text-align:center;color:#5c6b82;font-size:12px;margin-top:36px}\r\n  footer a{color:#7aa9ff;text-decoration:none}\r\n  @media (max-width:560px){\r\n    body{padding:24px 12px 48px}\r\n    .searchbar{flex-direction:column}\r\n    button{width:100%}\r\n    .item{flex-wrap:wrap}\r\n    .copy{width:100%}\r\n  }\r\n</style>\r\n</head>\r\n<body>\r\n<div class=\"wrap\">\r\n  <header>\r\n    <h1>网盘聚合搜索 API</h1>\r\n    <span class=\"badge\" id=\"health\">加载中…</span>\r\n  </header>\r\n\r\n  <div class=\"panel\">\r\n    <div class=\"searchbar\">\r\n      <input id=\"kw\" type=\"text\" placeholder=\"输入关键词，例如：无主之地 / 凡人修仙传\" autocomplete=\"off\">\r\n      <button id=\"btn\">搜索</button>\r\n    </div>\r\n\r\n    <div class=\"chips\" id=\"chips\"></div>\r\n\r\n    <div class=\"hint\">\r\n      接口：<code id=\"apiUrl\">/api/search?kw=</code>\r\n    </div>\r\n    <div class=\"status\" id=\"status\"></div>\r\n  </div>\r\n\r\n  <div id=\"results\"></div>\r\n\r\n  <details id=\"rawBox\" hidden>\r\n    <summary>查看原始 JSON</summary>\r\n    <pre id=\"raw\"></pre>\r\n  </details>\r\n\r\n  <footer>\r\n    Cloudflare Pages Functions · 聚合 TG 频道与多个网盘搜索引擎 · <a href=\"/api/health\">/api/health</a>\r\n  </footer>\r\n</div>\r\n\r\n<script>\r\nconst TYPES = [\r\n  ['quark','夸克'], ['uc','UC'], ['aliyun','阿里'], ['baidu','百度'],\r\n  ['xunlei','迅雷'], ['123','123'], ['115','115'], ['tianyi','天翼'],\r\n  ['mobile','移动'], ['pikpak','PikPak'], ['magnet','磁力'], ['ed2k','电驴']\r\n];\r\nconst selected = new Set();\r\nconst $ = id => document.getElementById(id);\r\n\r\n// 类型筛选 chips\r\nconst chipsEl = $('chips');\r\nTYPES.forEach(([key, label]) => {\r\n  const el = document.createElement('span');\r\n  el.className = 'chip';\r\n  el.textContent = label;\r\n  el.dataset.key = key;\r\n  el.onclick = () => {\r\n    if (selected.has(key)) { selected.delete(key); el.classList.remove('on'); }\r\n    else { selected.add(key); el.classList.add('on'); }\r\n    updateApiHint();\r\n  };\r\n  chipsEl.appendChild(el);\r\n});\r\n\r\nfunction buildUrl(kw) {\r\n  const params = new URLSearchParams();\r\n  params.set('kw', kw);\r\n  if (selected.size) params.set('cloud_types', [...selected].join(','));\r\n  return '/api/search?' + params.toString();\r\n}\r\n\r\nfunction updateApiHint() {\r\n  const kw = $('kw').value.trim();\r\n  $('apiUrl').textContent = buildUrl(kw ? encodeURIComponent(kw) : '关键词');\r\n}\r\n\r\nfunction fmtTime(s) {\r\n  if (!s || s.startsWith('0001-01-01')) return '';\r\n  const d = new Date(s);\r\n  if (isNaN(d)) return '';\r\n  const p = n => String(n).padStart(2, '0');\r\n  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());\r\n}\r\n\r\nfunction typeLabel(key) {\r\n  const hit = TYPES.find(t => t[0] === key);\r\n  return hit ? hit[1] : key;\r\n}\r\n\r\n// 健康检查\r\nfetch('/api/health').then(r => r.json()).then(j => {\r\n  const d = j.data || {};\r\n  $('health').innerHTML = '插件 <b>' + (d.plugins || []).length + '</b> 个 · TG 频道 <b>' + (d.channels || 0) + '</b> 个';\r\n}).catch(() => { $('health').textContent = '接口未就绪'; });\r\n\r\nasync function doSearch() {\r\n  const kw = $('kw').value.trim();\r\n  if (!kw) { $('kw').focus(); return; }\r\n\r\n  const btn = $('btn'), statusEl = $('status'), resultsEl = $('results');\r\n  btn.disabled = true;\r\n  statusEl.className = 'status';\r\n  statusEl.textContent = '搜索中…（并发请求所有源，通常 1–5 秒）';\r\n  resultsEl.innerHTML = '';\r\n  $('rawBox').hidden = true;\r\n\r\n  const t0 = performance.now();\r\n  try {\r\n    const resp = await fetch(buildUrl(kw));\r\n    const body = await resp.json();\r\n    const took = Math.round(performance.now() - t0);\r\n\r\n    if (body.code !== 0) {\r\n      statusEl.className = 'status err';\r\n      statusEl.textContent = '错误 ' + body.code + '：' + (body.message || '未知错误');\r\n      $('raw').textContent = JSON.stringify(body, null, 2);\r\n      $('rawBox').hidden = false;\r\n      return;\r\n    }\r\n\r\n    const data = body.data || {};\r\n    const groups = Object.entries(data.merged_by_type || {});\r\n    statusEl.textContent = '共 ' + (data.total || 0) + ' 条结果 · 耗时 ' + took + ' ms';\r\n\r\n    if (!groups.length) {\r\n      resultsEl.innerHTML = '<div class=\"panel\" style=\"margin-top:20px;color:var(--muted)\">没有搜索到结果，换个关键词或调整网盘类型试试。</div>';\r\n    }\r\n\r\n    groups.sort((a, b) => b[1].length - a[1].length);\r\n    for (const [type, list] of groups) {\r\n      const groupEl = document.createElement('div');\r\n      groupEl.className = 'group';\r\n      const head = document.createElement('div');\r\n      head.className = 'group-head';\r\n      head.innerHTML = '<span class=\"dot\"></span><b>' + typeLabel(type) + '</b><span>' + list.length + ' 条</span>';\r\n      groupEl.appendChild(head);\r\n\r\n      for (const item of list) {\r\n        const row = document.createElement('div');\r\n        row.className = 'item';\r\n\r\n        const time = fmtTime(item.datetime);\r\n        const meta = [];\r\n        if (item.password) meta.push('<span class=\"pwd\">提取码 ' + item.password + '</span>');\r\n        meta.push('<a href=\"' + item.url + '\" target=\"_blank\" rel=\"noreferrer noopener\">' + item.url + '</a>');\r\n        if (time) meta.push('<span>' + time + '</span>');\r\n\r\n        row.innerHTML =\r\n          '<div class=\"main\">' +\r\n            '<div class=\"title\">' + (item.note || '（无标题）').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])) + '</div>' +\r\n            '<div class=\"meta\">' + meta.join('<span>·</span>') + '</div>' +\r\n          '</div>' +\r\n          '<button class=\"copy\">复制链接</button>';\r\n\r\n        const copyBtn = row.querySelector('.copy');\r\n        copyBtn.onclick = async () => {\r\n          const text = item.password ? item.url + ' 提取码 ' + item.password : item.url;\r\n          try { await navigator.clipboard.writeText(text); } catch (e) { window.prompt('手动复制', text); }\r\n          copyBtn.textContent = '已复制';\r\n          copyBtn.classList.add('done');\r\n          setTimeout(() => { copyBtn.textContent = '复制链接'; copyBtn.classList.remove('done'); }, 1400);\r\n        };\r\n\r\n        groupEl.appendChild(row);\r\n      }\r\n      resultsEl.appendChild(groupEl);\r\n    }\r\n\r\n    $('raw').textContent = JSON.stringify(body, null, 2);\r\n    $('rawBox').hidden = false;\r\n  } catch (e) {\r\n    statusEl.className = 'status err';\r\n    statusEl.textContent = '请求失败：' + e.message;\r\n  } finally {\r\n    btn.disabled = false;\r\n  }\r\n}\r\n\r\n$('btn').onclick = doSearch;\r\n$('kw').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });\r\n$('kw').addEventListener('input', updateApiHint);\r\nupdateApiHint();\r\n</script>\r\n</body>\r\n</html>\r\n";

// ---- functions/_lib/regex.js ----
const __R = (() => {
// 网盘链接识别 / 提取码 / 文本清洗
// 正则移植自 fish2018/pansou（MIT）util/regex_util.go

// 全网盘链接（正文裸链接提取用）
const PAN_LINK_RE = /(?:magnet:\?xt=urn:btih:[a-zA-Z0-9]+)|(?:ed2k:\/\/\|file\|[^|]+\|\d+\|[A-Fa-f0-9]+\|\/?)|(?:https?:\/\/(?:(?:[\w.-]+\.)?(?:pan\.(?:baidu|quark)\.cn|(?:www\.)?(?:alipan|aliyundrive)\.com|drive\.uc\.cn|cloud\.189\.cn|(?:www\.)?(?:yun|caiyun)\.139\.com|caiyun\.feixin\.10086\.cn|(?:www\.)?123(?:684|685|865|912|pan|592)\.(?:com|cn)|115\.com|115cdn\.com|anxia\.com|pan\.xunlei\.com|mypikpak\.com|guangyapan\.com))(?:\/[^\s'"<>【】（）《》]*)?)/g;

// 按域名判定网盘类型（顺序即判定顺序）
function getLinkType(url) {
  const u = String(url).toLowerCase();
  if (u.startsWith('ed2k:')) return 'ed2k';
  if (u.startsWith('magnet:')) return 'magnet';
  if (u.includes('pan.baidu.com')) return 'baidu';
  if (u.includes('pan.quark.cn')) return 'quark';
  if (u.includes('alipan.com') || u.includes('aliyundrive.com')) return 'aliyun';
  if (u.includes('guangyapan.com')) return 'guangya';
  if (u.includes('cloud.189.cn')) return 'tianyi';
  if (u.includes('drive.uc.cn')) return 'uc';
  if (u.includes('caiyun.139.com') || u.includes('yun.139.com') || u.includes('caiyun.feixin.10086.cn')) return 'mobile';
  if (u.includes('115.com') || u.includes('115cdn.com') || u.includes('anxia.com')) return '115';
  if (u.includes('mypikpak.com')) return 'pikpak';
  if (u.includes('pan.xunlei.com')) return 'xunlei';
  if (/(?:123684|123685|123865|123912|123pan\.com|123pan\.cn|123592)/.test(u)) return '123';
  return 'others';
}

// 提取码：优先 URL 参数，其次在链接附近的文本窗口里找
const URL_PWD_RE = /[?&](?:pwd|password|passcode|code)=([a-zA-Z0-9]{4,8})(?![a-zA-Z0-9])/i;
const NEARBY_PWD_RE = /(?:提取码|访问码|密码|pwd)[：:\s]*([a-zA-Z0-9]{4,6})(?![a-zA-Z0-9])/i;

function extractPassword(url, text) {
  const m = String(url).match(URL_PWD_RE);
  if (m) return m[1];
  if (text) {
    const i = text.indexOf(url);
    const win = i >= 0 ? text.slice(Math.max(0, i - 80), i + url.length + 80) : text;
    const n = win.match(NEARBY_PWD_RE);
    if (n) return n[1];
  }
  return '';
}

// '2024-01-02 03:04:05' -> '2024-01-02T03:04:05Z'；其余原样返回
function toISO(s) {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : String(s || '');
}

const ZERO_TIME = '0001-01-01T00:00:00Z';

// HTML 转纯文本（<br> 转换行）
function htmlToText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/[ \t]+/gm, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 标题截断：在 简介/描述 处截断
function cutTitle(title) {
  const i = String(title).search(/简介|描述/);
  return (i > 0 ? String(title).slice(0, i) : String(title)).trim();
}

// 从消息正文里取标题（跳过 #标签行、日期头、元数据行）
const DATE_HEADER_RE = /^📅?\s*\d{1,4}(?:年\d{1,2}月\d{1,2}日|[-/.]\d{1,2}[-/.]\d{1,2})$|^📅?\s*\d{1,2}月\d{1,2}日$/;

function titleFromText(text, fallback) {
  for (const line of String(text).split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#') || DATE_HEADER_RE.test(s)) continue;
    if (/^(类型|分享|网盘|简介|描述|更多资源)[：:]/.test(s)) continue;
    if (/^名称[：:]/.test(s)) return cutTitle(s.replace(/^名称[：:]/, ''));
    return cutTitle(s);
  }
  return fallback;
}

return { PAN_LINK_RE, getLinkType, extractPassword, toISO, ZERO_TIME, htmlToText, cutTitle, titleFromText };
})();

// ---- functions/_lib/http.js ----
const __H = (() => {
// 带超时的上游请求封装

const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

function fetchWithTimeout(url, opts = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...opts,
    signal: controller.signal,
    headers: { 'User-Agent': BROWSER_UA, ...(opts.headers || {}) }
  }).finally(() => clearTimeout(timer));
}

async function fetchText(url, opts, timeoutMs) {
  const resp = await fetchWithTimeout(url, opts, timeoutMs);
  if (!resp.ok) {
    try { await resp.body?.cancel(); } catch (e) { /* ignore */ }
    throw new Error('HTTP ' + resp.status);
  }
  return resp.text();
}

async function fetchJSON(url, opts, timeoutMs) {
  return JSON.parse(await fetchText(url, opts, timeoutMs));
}

return { BROWSER_UA, fetchWithTimeout, fetchText, fetchJSON };
})();

// ---- functions/_lib/tg.js ----
const __TG = (() => {
// TG 频道搜索：抓取 https://t.me/s/{channel}?q={kw} 网页版并解析
// 解析逻辑移植自 fish2018/pansou（MIT）util/parser_util.goconst { fetchText } = __H;const { PAN_LINK_RE, getLinkType, extractPassword, htmlToText, titleFromText } = __R;
// 提取消息正文 HTML（平衡 <div> 嵌套）
function extractTextHtml(block) {
  const at = block.indexOf('tgme_widget_message_text');
  if (at === -1) return '';
  const openEnd = block.indexOf('>', at);
  if (openEnd === -1) return '';

  let depth = 1;
  let i = openEnd + 1;
  while (i < block.length && depth > 0) {
    const lt = block.indexOf('<', i);
    if (lt === -1) break;
    if (block.startsWith('</div', lt)) {
      depth--;
      i = (block.indexOf('>', lt) || lt) + 1;
      if (depth === 0) return block.slice(openEnd + 1, lt);
    } else if (block.startsWith('<div', lt)) {
      depth++;
      i = (block.indexOf('>', lt) || lt) + 1;
    } else {
      i = (block.indexOf('>', lt) || lt) + 1;
    }
  }
  return block.slice(openEnd + 1);
}

function parseChannelPage(html, channel, kw) {
  const blocks = html.split('tgme_widget_message_wrap').slice(1);
  const results = [];

  for (const block of blocks) {
    const idMatch = block.match(/data-post="[^"]+\/(\d+)"/);
    const timeMatch = block.match(/<time[^>]*\bdatetime="([^"]+)"/);
    if (!idMatch || !timeMatch) continue;

    const textHtml = extractTextHtml(block);
    const text = htmlToText(textHtml);

    // 链接两路来源：正文/按钮里的 <a href> + 文本裸链接
    const urls = new Set();
    for (const m of block.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      const u = m[1].replace(/&amp;/g, '&').replace(/#$/, '');
      if (getLinkType(u) !== 'others') urls.add(u);
    }
    for (const m of text.matchAll(PAN_LINK_RE)) {
      urls.add(m[0].replace(/&amp;/g, '&').replace(/#$/, ''));
    }
    if (urls.size === 0) continue;

    const links = [];
    for (const url of urls) {
      links.push({ type: getLinkType(url), url, password: extractPassword(url, text) });
    }

    results.push({
      id: `${channel}_${idMatch[1]}`,
      channel,
      datetime: timeMatch[1],
      title: titleFromText(text, kw),
      links
    });
  }

  return results;
}

async function searchChannel(channel, kw, timeoutMs) {
  const url = `https://t.me/s/${encodeURIComponent(channel)}?q=${encodeURIComponent(kw)}`;
  const html = await fetchText(url, {
    headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
  }, timeoutMs);
  return parseChannelPage(html, channel, kw);
}

// 并发搜索多个频道，单个频道失败不影响整体
async function searchTG(kw, channels, timeoutMs) {
  const settled = await Promise.allSettled(channels.map(ch => searchChannel(ch, kw, timeoutMs)));
  const ok = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && Array.isArray(s.value)) ok.push(...s.value);
  }
  return ok;
}

return { searchTG };
})();

// ---- functions/_lib/plugins/hunhepan.js ----
const __P_hunhepan = (() => {
// 混合盘系：同构端点并行 POST JSON（2026-10 实测仅 qkpanso 可用，其余保留观察）
// 移植自 fish2018/pansou（MIT）plugin/hunhepanconst { fetchJSON } = __H;const { ZERO_TIME } = __R;
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

async function search(kw, { timeoutMs }) {
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

return { search };
})();

// ---- functions/_lib/plugins/jikepan.js ----
const __P_jikepan = (() => {
// 即刻盘：单次 POST JSON
// 移植自 fish2018/pansou（MIT）plugin/jikepanconst { fetchJSON } = __H;const { getLinkType, ZERO_TIME } = __R;
const SERVICE_MAP = {
  baidu: 'baidu', aliyun: 'aliyun', xunlei: 'xunlei', quark: 'quark',
  '115': '115', '123': '123', pikpak: 'pikpak', ed2k: 'ed2k', magnet: 'magnet',
  '189cloud': 'tianyi', caiyun: 'mobile'
};

async function search(kw, { timeoutMs }) {
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

return { search };
})();

// ---- functions/_lib/plugins/qupansou.js ----
const __P_qupansou = (() => {
// 趣盘搜：单次 POST JSON
// 移植自 fish2018/pansou（MIT）plugin/qupansouconst { fetchJSON } = __H;const { getLinkType, toISO, ZERO_TIME } = __R;
async function search(kw, { timeoutMs }) {
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

return { search };
})();

// ---- functions/_lib/plugins/pansearch.js ----
const __P_pansearch = (() => {
// 盘搜 pansearch.me：Next.js 数据接口，需先取动态 buildId
// 移植自 fish2018/pansou（MIT）plugin/pansearchconst { fetchJSON, fetchText } = __H;const { getLinkType, extractPassword, toISO, htmlToText, ZERO_TIME } = __R;
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

async function search(kw, { timeoutMs }) {
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

return { search };
})();

// ---- functions/_lib/plugins/pan666.js ----
const __P_pan666 = (() => {
// pan666（Flarum 论坛 JSON:API）
// 移植自 fish2018/pansou（MIT）plugin/pan666const { fetchJSON } = __H;const { PAN_LINK_RE, getLinkType, extractPassword, htmlToText, ZERO_TIME } = __R;
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

async function search(kw, { timeoutMs }) {
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

return { search };
})();

// ---- functions/_lib/plugins/ouge.js ----
const __P_ouge = (() => {
// 欧歌影视资源 API（wanou 与其同源，合并为一个插件）
// 移植自 fish2018/pansou（MIT）plugin/ouge、plugin/wanouconst { fetchJSON } = __H;const { getLinkType, ZERO_TIME } = __R;
const API_TYPE_MAP = {
  BD: 'baidu', KG: 'quark', UC: 'uc', ALY: 'aliyun', XL: 'xunlei',
  TY: 'tianyi', '115': '115', MB: 'mobile', '123': '123', PK: 'pikpak', PIKPAK: 'pikpak'
};

async function search(kw, { timeoutMs }) {
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

return { search };
})();

// ---- functions/_lib/plugins/index.js ----
const __PIndex = (() => {
// 插件注册表：name -> search(kw, {timeoutMs}) => [{id,title,datetime,links:[{type,url,password}]}]const hunhepan = __P_hunhepan;const jikepan = __P_jikepan;const qupansou = __P_qupansou;const pansearch = __P_pansearch;const pan666 = __P_pan666;const ouge = __P_ouge;
const PLUGINS = {
  hunhepan,
  jikepan,
  qupansou,
  pansearch,
  pan666,
  ouge
};

const DEFAULT_PLUGINS = Object.keys(PLUGINS);

return { PLUGINS, DEFAULT_PLUGINS };
})();

// ---- functions/_worker.js ----
// 网盘聚合搜索 API（Cloudflare Pages Functions）
// 功能对齐 fish2018/pansou（MIT）的搜索聚合：TG 频道 + 多插件并发搜索，
// 合并去重后按网盘类型归类输出。无需 Docker / 常驻服务器。
//
// 路由：
//   GET /api/search?kw=关键词[&cloud_types=quark,uc][&src=all|tg|plugin][&channels=a,b][&plugins=a,b][&refresh=1][&debug=1]
//   GET /api/health
// 出参：{ code, message, data: { total, merged_by_type: { quark: [{url,password,note,datetime}] } } }
//
// Cloudflare 变量：
//   TG_CHANNELS        TG 频道列表（可选，逗号分隔；不配用内置默认）
//   PLUGINS            启用的插件（可选，逗号分隔；不配用内置全部）
//   SEARCH_TIMEOUT_MS  单个上游请求超时毫秒（可选，默认 8000）
//   CACHE_TTL_SECONDS  搜索结果缓存秒数（可选，默认 1800）const { searchTG } = __TG;const { PLUGINS, DEFAULT_PLUGINS } = __PIndex;const { getLinkType, cutTitle, ZERO_TIME } = __R;
// 内置默认 TG 频道（与 pansou 默认配置一致，可用 TG_CHANNELS 变量覆盖）
const DEFAULT_TG_CHANNELS = [
  'tgsearchers2', 'Aliyun_4K_Movies', 'yunpanx', 'yp123pan', 'yunpanxunlei', 'tianyifc',
  'BaiduCloudDisk', 'txtyzy', 'peccxinpd', 'gotopan', 'PanjClub', 'kkxlzy', 'baicaoZY',
  'MCPH01', 'bdwpzhpd', 'ysxb48', 'yggpan', 'MCPH086', 'zaihuayun', 'Q66Share',
  'Oscar_4Kmovies', 'ucwpzy', 'shareAliyun', 'alyp_1', 'dianyingshare', 'Quark_Movies',
  'XiangxiuNBB', 'ydypzyfx', 'ucquark', 'xx123pan', 'zyfb123', 'tyypzhpd', 'tianyirigeng',
  'cloudtianyi', 'hdhhd21', 'Lsp115', 'oneonefivewpfx', 'qixingzhenren', 'taoxgzy',
  'Channel_Shares_115', 'vip115hot', 'yunpan139', 'yunpan189', 'yunpanuc', 'leoziyuan',
  'pikpakpan', 'Q_dongman'
];

// Workers 免费版单请求最多 50 个子请求，频道数需给插件留余量
const MAX_CHANNELS = 32;

function parseList(v) {
  return String(v || '').split(/[\s,，;；]+/).map(s => s.trim()).filter(Boolean);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// 合并去重：URL 为唯一键，重复时保留时间更新的；按网盘类型分组
function mergeByType(resultGroups, wantedTypes) {
  const byUrl = new Map();

  for (const group of resultGroups) {
    for (const r of group.items) {
      const title = cutTitle(r.title || '');
      for (const link of r.links || []) {
        if (!link.url) continue;
        const datetime = link.datetime || r.datetime || ZERO_TIME;
        const prev = byUrl.get(link.url);
        if (!prev) {
          byUrl.set(link.url, {
            type: link.type || getLinkType(link.url),
            url: link.url,
            password: link.password || '',
            note: title,
            datetime
          });
        } else {
          // 更新的记录覆盖时间/提取码，标题取先到的非空值
          if (datetime > prev.datetime) prev.datetime = datetime;
          if (!prev.password && link.password) prev.password = link.password;
          if (!prev.note && title) prev.note = title;
        }
      }
    }
  }

  const merged = {};
  let total = 0;
  for (const e of byUrl.values()) {
    if (wantedTypes && !wantedTypes.has(e.type)) continue;
    (merged[e.type] || (merged[e.type] = [])).push({
      url: e.url, password: e.password, note: e.note, datetime: e.datetime
    });
    total += 1;
  }

  // 按固定类型顺序输出，保证结构稳定
  const order = ['baidu', 'aliyun', 'quark', 'tianyi', 'uc', 'mobile', '115', 'xunlei', '123', 'pikpak', 'magnet', 'ed2k', 'guangya', 'others'];
  const merged_by_type = {};
  for (const t of order) {
    if (merged[t]?.length) merged_by_type[t] = merged[t];
  }
  return { total, merged_by_type };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }

    const url = new URL(request.url);
    const sp = url.searchParams;
    const startedAt = Date.now();

    // GET /api/health
    if (url.pathname === '/api/health') {
      const plugins = parseList(env.PLUGINS).filter(p => PLUGINS[p]);
      return json({
        code: 0, message: 'success',
        data: {
          plugins: plugins.length ? plugins : DEFAULT_PLUGINS,
          channels: parseList(env.TG_CHANNELS).length || DEFAULT_TG_CHANNELS.length
        }
      });
    }

    if (url.pathname !== '/api/search') {
      // 非 API 路径：优先 Pages 静态资源（env.ASSETS），
      // 单文件 Worker 形态下没有 ASSETS，直接返回内联的 index.html
      if (env.ASSETS && (request.method === 'GET' || request.method === 'HEAD')) {
        return env.ASSETS.fetch(request);
      }
      if (typeof INDEX_HTML === 'string' && (url.pathname === '/' || url.pathname === '/index.html')) {
        return new Response(INDEX_HTML, {
          headers: { 'Content-Type': 'text/html;charset=utf-8' }
        });
      }
      return json({ code: 404, message: 'not found', data: null }, 404);
    }

    const kw = (sp.get('kw') || sp.get('word') || '').trim();
    if (!kw) return json({ code: 400, message: '缺少 kw 参数', data: null }, 400);

    // 缓存（refresh=1 跳过读取；debug 响应不缓存；本地 node 无 caches，自动降级）
    const cache = globalThis.caches?.default;
    const refresh = ['1', 'true'].includes(sp.get('refresh'));
    const debug = sp.get('debug') === '1';
    if (cache && !refresh && !debug) {
      const hit = await cache.match(request);
      if (hit) return hit;
    }

    const src = sp.get('src') || 'all';
    const timeoutMs = Math.min(Math.max(Number(env.SEARCH_TIMEOUT_MS) || 8000, 2000), 25000);

    // 频道与插件清单
    const channels = (sp.get('channels') ? parseList(sp.get('channels')) : (parseList(env.TG_CHANNELS).length ? parseList(env.TG_CHANNELS) : DEFAULT_TG_CHANNELS)).slice(0, MAX_CHANNELS);
    const pluginNames = (sp.get('plugins') ? parseList(sp.get('plugins')) : (parseList(env.PLUGINS).length ? parseList(env.PLUGINS) : DEFAULT_PLUGINS))
      .filter(p => PLUGINS[p]);

    // 并发搜索：TG 一路 + 各插件一路，全部并行，单路失败不影响整体
    // TG 频道单独用更短的超时（t.me 正常响应很快，挂住的多为被墙/限流）
    const jobs = [];
    if (src !== 'plugin' && channels.length) {
      const tgTimeout = Math.min(timeoutMs, 5000);
      jobs.push(searchTG(kw, channels, tgTimeout).then(items => ({ name: 'tg', items })));
    }
    if (src !== 'tg') {
      for (const name of pluginNames) {
        jobs.push(
          PLUGINS[name].search(kw, { timeoutMs })
            .then(items => ({ name, items }))
            .catch(e => ({ name, items: [], error: String(e?.message || e) }))
        );
      }
    }

    const settled = await Promise.allSettled(jobs);
    const groups = [];
    const stats = [];
    for (const s of settled) {
      if (s.status === 'fulfilled') {
        groups.push(s.value);
        stats.push({ source: s.value.name, count: s.value.items.length, error: s.value.error || '' });
      } else {
        stats.push({ source: 'unknown', count: 0, error: String(s.reason?.message || s.reason) });
      }
    }

    // cloud_types 过滤（网盘类型名，如 quark,uc,115）
    const requestedTypes = parseList(sp.get('cloud_types')).map(s => s.toLowerCase());
    const wantedTypes = requestedTypes.length ? new Set(requestedTypes) : null;

    const { total, merged_by_type } = mergeByType(groups, wantedTypes);

    const data = { total, merged_by_type };
    if (debug) {
      data.took_ms = Date.now() - startedAt;
      data.sources = stats;
    }

    const resp = json({ code: 0, message: 'success', data });
    resp.headers.set('Cache-Control', 'public, max-age=' + Math.min(Math.max(Number(env.CACHE_TTL_SECONDS) || 1800, 60), 86400));
    if (cache) ctx?.waitUntil(cache.put(request, resp.clone()));
    return resp;
  }
};

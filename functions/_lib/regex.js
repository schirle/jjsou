// 网盘链接识别 / 提取码 / 文本清洗
// 正则移植自 fish2018/pansou（MIT）util/regex_util.go

// 全网盘链接（正文裸链接提取用）
export const PAN_LINK_RE = /(?:magnet:\?xt=urn:btih:[a-zA-Z0-9]+)|(?:ed2k:\/\/\|file\|[^|]+\|\d+\|[A-Fa-f0-9]+\|\/?)|(?:https?:\/\/(?:(?:[\w.-]+\.)?(?:pan\.(?:baidu|quark)\.cn|(?:www\.)?(?:alipan|aliyundrive)\.com|drive\.uc\.cn|cloud\.189\.cn|(?:www\.)?(?:yun|caiyun)\.139\.com|caiyun\.feixin\.10086\.cn|(?:www\.)?123(?:684|685|865|912|pan|592)\.(?:com|cn)|115\.com|115cdn\.com|anxia\.com|pan\.xunlei\.com|mypikpak\.com|guangyapan\.com))(?:\/[^\s'"<>【】（）《》]*)?)/g;

// 按域名判定网盘类型（顺序即判定顺序）
export function getLinkType(url) {
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

export function extractPassword(url, text) {
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
export function toISO(s) {
  const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` : String(s || '');
}

export const ZERO_TIME = '0001-01-01T00:00:00Z';

// HTML 转纯文本（<br> 转换行）
export function htmlToText(html) {
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
export function cutTitle(title) {
  const i = String(title).search(/简介|描述/);
  return (i > 0 ? String(title).slice(0, i) : String(title)).trim();
}

// 从消息正文里取标题（跳过 #标签行、日期头、元数据行）
const DATE_HEADER_RE = /^📅?\s*\d{1,4}(?:年\d{1,2}月\d{1,2}日|[-/.]\d{1,2}[-/.]\d{1,2})$|^📅?\s*\d{1,2}月\d{1,2}日$/;

export function titleFromText(text, fallback) {
  for (const line of String(text).split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#') || DATE_HEADER_RE.test(s)) continue;
    if (/^(类型|分享|网盘|简介|描述|更多资源)[：:]/.test(s)) continue;
    if (/^名称[：:]/.test(s)) return cutTitle(s.replace(/^名称[：:]/, ''));
    return cutTitle(s);
  }
  return fallback;
}

// TG 频道搜索：抓取 https://t.me/s/{channel}?q={kw} 网页版并解析
// 解析逻辑移植自 fish2018/pansou（MIT）util/parser_util.go

import { fetchText } from './http.js';
import { PAN_LINK_RE, getLinkType, extractPassword, htmlToText, titleFromText } from './regex.js';

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
export async function searchTG(kw, channels, timeoutMs) {
  const settled = await Promise.allSettled(channels.map(ch => searchChannel(ch, kw, timeoutMs)));
  const ok = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && Array.isArray(s.value)) ok.push(...s.value);
  }
  return ok;
}
